// gallery.mjs [out.html] [--standalone]
// Writes the Darkberry pattern gallery: the common UI patterns of web, desktop and mobile
// apps (window chrome, tabs, lists, buttons, inputs, toggles, menus, tooltip, scrollbar,
// meters, badges, banners, dialog, table, editor, diff, terminal, mobile bars), each drawn
// from the roles the meaning -> role table gives it, in every flavour and tint. It is the
// gold standard the review panel compares a port with: a port's frame should read the way
// the same pattern reads here.
//
// Every colour comes from src/roles.json through lib/resolve.mjs at generation time, so
// re-run this after a palette or role change. The page lets a viewer switch flavour and
// tint, label every element with its roles, recolour any role, watch the WCAG checks move,
// and copy the edits as JSON.
// Without --standalone the output is an Artifact page body (no doctype); with it, a full
// HTML document for a local browser. Open it at #<flavour> or #<tint>-<flavour> to pick
// one; for the review bundle, capture each flavour with a headless browser:
//   google-chrome --headless=new --window-size=1300,2700 --virtual-time-budget=4000 \
//     --screenshot=gallery-mire.png "file://$PWD/gallery.html#mire"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const { indexRoles, flavourContext } = await import(path.join(root, "lib/resolve.mjs"));
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

const args = process.argv.slice(2);
const standalone = args.includes("--standalone");
const out = args.find((a) => !a.startsWith("--"));

const ROLES = readJson("src/roles.json"), roleIndex = indexRoles(ROLES);
const TINTS = Object.entries(readJson("src/tints.json")).filter(([k]) => !k.startsWith("$"));
const data = {};
for (const [t, meta] of TINTS) {
  const P = readJson(t === "darkberry" ? "src/palette.json" : `src/variants/${t}.json`);
  data[t] = { name: meta.name, note: meta.note, flavours: {} };
  for (const [fl, f] of Object.entries(P.flavours)) {
    const ctx = flavourContext(fl, f, ROLES, roleIndex), roles = {};
    for (const r of Object.keys(roleIndex)) { try { roles[r] = ctx.resolve(r)[0]; } catch {} }
    data[t].flavours[fl] = { name: f.name, dark: f.dark, roles, palette: { ...f.colors }, ansi: ctx.ansi };
  }
}
const floors = {};
for (const r of Object.keys(roleIndex)) {
  const v = roleIndex[r]; if (v.minContrast || v.minContrastWith) floors[r] = { min: v.minContrast, with: v.minContrastWith };
}

// CSS custom property names: ui.pane.secondary -> --ui-pane-secondary, surface1 -> --p-surface1, ansi 3 -> --ansi-3.
const v = (name) => "--" + name.replace(/\./g, "-");
const varsOf = (fd) => [
  ...Object.entries(fd.roles).map(([k, h]) => `${v(k)}:${h}`),
  ...Object.entries(fd.palette).map(([k, h]) => `--p-${k}:${h}`),
  ...fd.ansi.map((h, i) => `--ansi-${i}:${h}`),
].join(";");
const wisp = data.darkberry.flavours.wisp, mire = data.darkberry.flavours.mire;

const html = `${standalone ? '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' : ""}<title>Darkberry Pattern Gallery</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Bodoni+Moda+SC:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Fira+Code:wght@400;500;700&family=Fira+Mono:wght@400;500;700&family=Manufacturing+Consent&display=swap">
<style>
/* Layout: a header of controls, then a two-column field of pattern cards; the tweak drawer slides over the right edge. */
/* Every colour token below is a Darkberry role, palette colour or ansi slot, generated from src/roles.json. */
:root{${varsOf(wisp)};
  --display:"Manufacturing Consent","Bodoni Moda SC",ui-serif,Georgia,serif;
  --sc:"Bodoni Moda SC",ui-serif,Georgia,"Times New Roman",serif;
  --serif:"Bodoni Moda",ui-serif,Georgia,serif;
  /* DESIGN_LANGUAGE.md §6: Fira Code for code, Fira Mono for UI; the Nerd Font names come first so a local install (with icons) wins. */
  --mono:"FiraCode Nerd Font","Fira Code",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --ui:"FiraMono Nerd Font","Fira Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --r:6px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${varsOf(mire)};color-scheme:dark}}
:root[data-theme="dark"]{${varsOf(mire)};color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--ui-pane-tertiary);color:var(--ui-text);font-family:var(--ui);font-size:13px;line-height:1.45;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:20px 64px}
.wrap{max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:24px}
header.top{display:flex;flex-wrap:wrap;gap:16px 28px;align-items:end;justify-content:space-between}
.brand h1{font-family:var(--display);font-weight:400;font-size:clamp(40px,7vw,68px);line-height:.95;margin:0;letter-spacing:.005em;text-wrap:balance}
.brand p:not(.eyebrow){margin:6px 0 0;color:var(--ui-text-muted);max-width:62ch;font-family:var(--serif);font-size:15px}
.eyebrow{font-family:var(--sc);font-size:12px;letter-spacing:.28em;text-transform:lowercase;color:var(--ui-text-muted);margin:0 0 6px}
.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.seg{display:inline-flex;border:1px solid var(--ui-border-inactive);border-radius:var(--r);overflow:hidden}
.seg button{all:unset;cursor:pointer;padding:6px 12px;color:var(--ui-text-muted);font-size:13px}
.seg button[aria-pressed="true"]{background:var(--ui-fill);color:var(--ui-on-fill)}
.seg button:focus-visible,.btn:focus-visible,select:focus-visible,input:focus-visible,.chk:focus-visible,.sw:focus-visible,.tab:focus-visible{outline:2px solid var(--ui-focus);outline-offset:2px}
select.ctl{font:inherit;font-size:13px;background:var(--ui-background);color:var(--ui-text);border:1px solid var(--ui-border-inactive);border-radius:var(--r);padding:6px 8px}
.btn{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r);font-size:13px;font-weight:500;line-height:1.2}
.btn.primary{background:var(--ui-fill);color:var(--ui-on-fill)}
.btn.primary:hover{background:color-mix(in srgb,var(--ui-fill) 88%,var(--ui-text))}
.btn.secondary{background:var(--p-surface0);color:var(--ui-text);border:1px solid var(--ui-border-inactive)}
.btn.secondary:hover{background:var(--p-surface1)}
.btn.ghost{color:var(--ui-text)}
.btn.ghost:hover{background:var(--p-surface0)}
.btn[disabled]{cursor:not-allowed;background:var(--p-surface0);color:var(--ui-text-subtle);border:1px solid transparent}
.btn.danger{background:var(--ui-error);color:var(--ui-on-error)}
.btn.focus{outline:2px solid var(--ui-focus);outline-offset:2px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,370px),1fr));gap:18px}
.card{background:var(--ui-pane-secondary);border:1px solid var(--p-surface1);border-radius:10px;display:flex;flex-direction:column;min-width:0}
.card>h2{font-family:var(--sc);font-weight:500;font-size:15px;letter-spacing:.06em;margin:0;padding:12px 16px 0;text-transform:lowercase}
.stage{margin:12px 16px;background:var(--ui-background);border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0;overflow:hidden}
.spec{margin:0 16px 14px;font-size:12px;color:var(--ui-text-muted);display:flex;flex-direction:column;gap:4px}
.spec code{font-family:var(--mono);font-size:11.5px;color:var(--ui-text)}
.spec .rule{color:var(--ui-text-muted)}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
/* role labels */
body.labels [data-roles]{outline:1px dashed var(--ui-emphasis);outline-offset:1px;position:relative}
body.labels [data-roles]::after{content:attr(data-roles);position:absolute;left:0;top:100%;z-index:3;font:10px/1.3 var(--mono);background:var(--ui-pane-tertiary);color:var(--ui-emphasis);padding:1px 4px;border-radius:3px;white-space:nowrap;pointer-events:none}
/* window chrome */
.win{border:1px solid var(--p-surface1);border-radius:8px;overflow:hidden}
.win .title{background:var(--ui-pane-secondary);display:flex;align-items:center;justify-content:space-between;padding:6px 10px;font-size:12px}
.win .title.backdrop{background:var(--ui-pane-tertiary);color:var(--ui-text-muted)}
.win .body{background:var(--ui-background);padding:10px;font-size:13px}
.dots{display:flex;gap:6px}.dots i{width:10px;height:10px;border-radius:50%;background:var(--p-surface2)}
/* tabs */
.tabs{display:flex;background:var(--ui-pane-tertiary);border-radius:6px 6px 0 0;overflow:hidden}
.tab{all:unset;cursor:pointer;padding:8px 14px;font-size:13px;background:var(--ui-tab-inactive);color:var(--ui-text-muted);border-right:1px solid var(--p-surface1)}
.tab.active{background:var(--ui-tab-active);color:var(--ui-text);box-shadow:inset 0 2px 0 var(--ui-tab-indicator)}
.tab .act{color:var(--ui-info);font-weight:700}
.ttabs{display:flex;gap:2px;background:var(--ui-pane-tertiary);padding:3px;border-radius:4px;font-family:var(--mono);font-size:12px}
.ttabs span{padding:3px 10px;background:var(--ui-tab-inactive);color:var(--ui-text-muted);border-radius:3px}
.ttabs span.active{background:var(--ui-tab-indicator);color:var(--ui-on-tab-indicator);font-weight:700}
.ttabs span.bell{color:var(--ui-bell);font-weight:700}
/* lists */
.list{display:flex;flex-direction:column;font-size:13px;border-radius:6px;overflow:hidden;background:var(--ui-pane-secondary)}
.list div{padding:6px 10px;display:flex;justify-content:space-between;gap:8px}
.list .hover{background:var(--p-surface0)}
.list .sel{background:var(--ui-fill);color:var(--ui-on-fill)}
.list .sel small{color:var(--ui-on-fill)}
.list small{color:var(--ui-text-muted)}
.list .mod{color:var(--ui-warning);font-weight:700}
/* inputs */
.field{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--ui-text-muted);min-width:0}
.field input{font:inherit;font-size:13px;color:var(--ui-text);background:var(--ui-background);border:1px solid var(--ui-border-inactive);border-radius:var(--r);padding:7px 9px;width:100%}
.field input::placeholder{color:var(--ui-text-subtle)}
.field input.focus{outline:2px solid var(--ui-focus);outline-offset:1px;border-color:var(--ui-focus)}
.field input:disabled{background:var(--p-surface0);color:var(--ui-text-subtle);border-color:transparent}
.field input.err{border-color:var(--ui-error)}
.field .msg{color:var(--ui-error)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
/* toggles */
.chk{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:4px;border:1.5px solid var(--ui-border-inactive);background:var(--ui-background);color:var(--ui-on-fill);font-size:12px;line-height:1}
.chk.on{background:var(--ui-fill);border-color:var(--ui-fill)}
.chk.radio{border-radius:50%}
.chk.radio.on{background:var(--ui-background);border-color:var(--ui-fill)}
.chk.radio.on::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--ui-fill)}
.chk.dis{border-color:var(--p-surface2);background:var(--p-surface0)}
.sw{display:inline-block;width:36px;height:20px;border-radius:10px;background:var(--p-surface2);border:1.5px solid var(--ui-border-inactive);position:relative}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:var(--ui-text-muted)}
.sw.on{background:var(--ui-fill);border-color:var(--ui-fill)}
.sw.on::after{left:18px;background:var(--ui-on-fill)}
label.opt{display:inline-flex;gap:8px;align-items:center;font-size:13px}
label.opt.dis{color:var(--ui-text-subtle)}
/* menu, tooltip */
.menu{background:var(--ui-pane-secondary);border:1px solid var(--p-surface1);border-radius:8px;padding:4px;width:min(100%,230px);font-size:13px;box-shadow:0 6px 18px color-mix(in srgb,var(--ui-pane-tertiary) 70%,transparent)}
.menu div{padding:6px 10px;border-radius:5px;display:flex;justify-content:space-between}
.menu kbd{font-family:var(--mono);font-size:11px;color:var(--ui-text-muted)}
.menu .sel{background:var(--ui-fill);color:var(--ui-on-fill)}.menu .sel kbd{color:var(--ui-on-fill)}
.menu .dis{color:var(--ui-text-subtle)}
.menu hr{border:0;border-top:1px solid var(--p-surface1);margin:4px 2px}
.tip{display:inline-block;background:var(--ui-pane-tertiary);color:var(--ui-text);border:1px solid var(--p-surface1);border-radius:5px;padding:4px 8px;font-size:12px}
.todo{font-size:11px;color:var(--ui-warning)}
/* scrollbar */
.scroller{display:flex;gap:10px;align-items:stretch;height:120px}
.scroller .pane{flex:1;background:var(--ui-background);border:1px solid var(--p-surface1);border-radius:6px;padding:8px;font-size:12px;color:var(--ui-text-muted);overflow:hidden}
.track{width:12px;background:var(--ui-pane-secondary);border-radius:6px;position:relative}
.track.in-mantle{background:var(--p-surface0)}
.thumb{position:absolute;left:2px;right:2px;top:14px;height:40px;border-radius:4px;background:var(--p-overlay0)}
.thumb.hover{background:var(--p-overlay1)}
/* meters */
.meter{height:8px;border-radius:4px;background:var(--p-surface2);overflow:hidden}
.meter i{display:block;height:100%;background:var(--ui-fill)}
.grad{display:flex;height:8px;border-radius:4px;overflow:hidden}
.grad i{flex:1}
/* badges, banners */
.badge{display:inline-block;padding:1px 7px;border-radius:9px;font-size:11px;font-weight:600;background:var(--ui-badge);color:var(--ui-on-badge)}
.banner{display:flex;gap:10px;align-items:baseline;padding:8px 12px;border-radius:6px;font-size:13px;border:1px solid}
.banner b{font-weight:700}
.b-err{background:var(--ui-error-surface);border-color:var(--ui-error);color:var(--ui-text)}.b-err b{color:var(--ui-error)}
.b-warn{background:var(--ui-warning-surface);border-color:var(--ui-warning);color:var(--ui-text)}.b-warn b{color:var(--ui-warning)}
.b-info{background:var(--ui-info-surface);border-color:var(--ui-info);color:var(--ui-text)}.b-info b{color:var(--ui-info)}
.pill{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;color:var(--ui-on-error)}
/* dialog */
.scrim{background:color-mix(in srgb,var(--ui-pane-tertiary) 75%,transparent);padding:18px;border-radius:6px;display:grid;place-items:center}
.dialog{background:var(--ui-pane-secondary);border:1px solid var(--p-surface1);border-radius:10px;padding:16px;width:min(100%,300px);display:flex;flex-direction:column;gap:10px}
.dialog h3{margin:0;font-size:15px}
.dialog p{margin:0;color:var(--ui-text-muted);font-size:13px}
/* table */
table.t{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums}
.t th{text-align:left;font-weight:600;color:var(--ui-text-muted);border-bottom:1px solid var(--p-surface1);padding:6px 8px;background:var(--ui-pane-secondary)}
.t td{padding:6px 8px;border-bottom:1px solid var(--p-surface1)}
.t tr.sel td{background:var(--ui-fill);color:var(--ui-on-fill)}
.t td.num{text-align:right}
.t a{color:var(--ui-link)}.t tr.sel a{color:var(--ui-on-fill)}
/* links */
a.lnk{color:var(--ui-link);text-underline-offset:2px}
a.lnk.hover{color:color-mix(in srgb,var(--ui-link) 60%,var(--ui-text))}
/* editor */
.code{font-family:var(--mono);font-size:12px;font-variant-ligatures:contextual;line-height:1.6;background:var(--ui-background);border-radius:6px;overflow-x:auto}
.code .ln{display:flex;white-space:pre}
.code .g{flex:0 0 34px;text-align:right;padding-right:10px;color:var(--ui-text-subtle);background:var(--ui-pane-secondary);user-select:none}
.code .cur{background:var(--ui-line-current)}
.code .cur .g{color:var(--ui-accent);font-weight:700}
.code .c{padding-left:8px;color:var(--syntax-text)}
.kw{color:var(--syntax-keyword)}.fn{color:var(--syntax-function)}.ty{color:var(--syntax-type)}.st{color:var(--syntax-string)}.nu{color:var(--syntax-number)}.cm{color:var(--syntax-comment);font-style:italic}.pr{color:var(--syntax-property)}.op{color:var(--syntax-operator)}.pu{color:var(--syntax-punctuation)}.ns{color:var(--syntax-namespace)}.va{color:var(--syntax-variable)}.co{color:var(--syntax-constant)}
.sel-t{background:var(--ui-selection)}
.hit{background:var(--ui-search-matches)}
.hit1{background:var(--ui-mark1);color:var(--ui-mark-text)}
.caret{box-shadow:inset 2px 0 0 var(--ui-cursor)}
.bm{color:var(--ui-accent);font-weight:700}
.squig{text-decoration:underline wavy var(--ui-error);text-underline-offset:3px}
.squig.w{text-decoration-color:var(--ui-warning)}
/* diff */
.diff .ln.add{background:var(--ui-diff-added)}.diff .ln.rem{background:var(--ui-diff-removed)}.diff .ln.chg{background:var(--ui-diff-changed)}
.diff .dt{background:var(--ui-diff-text)}
.diff .ln.add .g{color:var(--ui-success)}.diff .ln.rem .g{color:var(--syntax-diff-removed)}.diff .ln.chg .g{color:var(--ui-warning)}
/* terminal */
.term{font-family:var(--mono);font-size:12px;background:var(--ui-background);border-radius:6px;padding:10px;line-height:1.55;overflow-x:auto;white-space:pre}
.ansi{display:grid;grid-template-columns:repeat(8,1fr);gap:4px}
.ansi i{aspect-ratio:1.6;border-radius:3px;font:9px var(--mono);display:grid;place-items:center;font-style:normal}
.tcur{background:var(--ui-cursor);color:var(--ui-cursor-text)}
/* status bar */
.status{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;background:var(--ui-pane-secondary);color:var(--ui-text);font-size:12px;padding:4px 10px;border-top:1px solid var(--p-surface1)}
.status .err{color:var(--ui-error)}.status .warn{color:var(--ui-warning)}
/* mobile */
.phone{width:min(100%,250px);margin:0 auto;border:1px solid var(--p-surface1);border-radius:22px;overflow:hidden;background:var(--ui-background);display:flex;flex-direction:column}
.appbar{background:var(--ui-pane-secondary);padding:12px 14px;font-weight:600;display:flex;justify-content:space-between}
.pbody{padding:12px;display:flex;flex-direction:column;gap:10px;min-height:150px;position:relative;font-size:13px}
.segc{display:flex;background:var(--p-surface0);border-radius:8px;padding:2px}
.segc span{flex:1;text-align:center;padding:4px;border-radius:6px;font-size:12px;color:var(--ui-text-muted)}
.segc span.on{background:var(--ui-background);color:var(--ui-text);box-shadow:0 0 0 1px var(--ui-border-inactive)}
.slider{height:4px;border-radius:2px;background:var(--p-surface2);position:relative;margin:8px 0}
.slider i{position:absolute;left:0;top:0;bottom:0;width:60%;background:var(--ui-fill);border-radius:2px}
.slider b{position:absolute;left:calc(60% - 8px);top:-6px;width:16px;height:16px;border-radius:50%;background:var(--ui-fill);border:2px solid var(--ui-background)}
.fab{position:absolute;right:12px;bottom:12px;width:40px;height:40px;border-radius:12px;background:var(--ui-fill);color:var(--ui-on-fill);display:grid;place-items:center;font-size:20px}
.navbar{display:flex;background:var(--ui-pane-secondary);border-top:1px solid var(--p-surface1)}
.navbar span{flex:1;text-align:center;padding:8px 0;font-size:11px;color:var(--ui-text-muted)}
.navbar span.on{color:var(--p-tint);font-weight:700;box-shadow:inset 0 2px 0 var(--ui-tab-indicator)}
.toast{background:var(--ui-pane-tertiary);color:var(--ui-text);border:1px solid var(--p-surface1);border-radius:8px;padding:8px 10px;font-size:12px;display:flex;justify-content:space-between;gap:8px}
.toast a{color:var(--ui-link);font-weight:600;text-decoration:none}
.pbody .toast{margin-right:48px}
/* splits */
.splits{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-family:var(--mono);font-size:11.5px}
.splits div{background:var(--ui-background);border:1px solid var(--ui-border-inactive);border-radius:4px;padding:8px;min-height:84px;color:var(--ui-text-muted)}
.splits div.focus{border-color:var(--ui-border-active);color:var(--ui-text)}
.hair{display:flex;gap:0;background:var(--ui-pane-secondary);border-radius:4px;font-size:12px}
.hair span{flex:1;padding:6px 10px;border-right:1px solid var(--p-surface1);color:var(--ui-text-muted)}
.hair span:last-child{border-right:0}
/* ladder */
.ladder{display:flex;border-radius:6px;overflow:hidden;font:10px var(--mono)}
.ladder i{flex:1;padding:22px 4px 6px;font-style:normal;text-align:center}
/* drawer */
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(100%,380px);background:var(--ui-pane-secondary);border-left:1px solid var(--p-surface1);z-index:20;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .2s ease;padding-top:env(safe-area-inset-top,0px);padding-right:env(safe-area-inset-right,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
.drawer.open{transform:none}
@media (prefers-reduced-motion:reduce){.drawer{transition:none}}
.drawer header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--p-surface1)}
.drawer header h2{font-family:var(--sc);font-weight:500;font-size:16px;margin:0;text-transform:lowercase;letter-spacing:.06em}
.drawer .scroll{overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:16px}
.checks{width:100%;border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums}
.checks td{padding:3px 4px;border-bottom:1px solid var(--p-surface1);vertical-align:top}
.checks td.n{text-align:right;white-space:nowrap}
.ok{color:var(--ui-success);font-weight:700}.bad{color:var(--ui-error);font-weight:700}
.roles{display:flex;flex-direction:column;gap:2px}
.roles h3{font-family:var(--sc);font-size:12px;letter-spacing:.2em;text-transform:lowercase;color:var(--ui-text-muted);margin:10px 0 4px;font-weight:400}
.rrow{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;font:12px var(--mono)}
.rrow input[type=color]{width:28px;height:22px;border:1px solid var(--ui-border-inactive);border-radius:4px;padding:0;background:none;cursor:pointer}
.rrow .hx{color:var(--ui-text-muted)}
.rrow.edited span:first-of-type{color:var(--ui-emphasis)}
.drawer footer{display:flex;gap:8px;flex-wrap:wrap;padding:12px 16px;border-top:1px solid var(--p-surface1)}
.note{font-size:12px;color:var(--ui-text-muted);margin:0}
textarea.out{width:100%;min-height:90px;font:11px var(--mono);background:var(--ui-background);color:var(--ui-text);border:1px solid var(--ui-border-inactive);border-radius:6px;padding:6px}
</style>
<div class="wrap">
<header class="top">
  <div class="brand"><p class="eyebrow">darkberry · review reference</p><h1>Pattern gallery</h1>
  <p>The common UI patterns, each drawn from the roles STYLE_GUIDE.md assigns. A port's screenshot should read the way the same pattern reads here. <span id="tintnote"></span></p></div>
  <div class="controls">
    <div class="seg" role="group" aria-label="Flavour" id="flv"></div>
    <select class="ctl" id="tint" aria-label="Tint"></select>
    <button class="btn secondary" id="lbl" aria-pressed="false">Show roles</button>
    <button class="btn primary" id="tw">Tweak roles</button>
  </div>
</header>
<section class="grid" id="grid">

<article class="card"><h2>Surface ladder</h2><div class="stage">
  <div class="ladder" id="ladder"></div>
  <p class="note">Panes step away from text, surfaces step toward it. On Wisp, mantle and crust sit darker than base.</p>
</div><div class="spec"><code>crust · mantle · base · surface0–2</code><span class="rule">DESIGN_LANGUAGE §2; STYLE_GUIDE layer 1</span></div></article>

<article class="card"><h2>Window and title bar</h2><div class="stage">
  <div class="win"><div class="title" data-roles="ui.pane.secondary"><div class="dots"><i></i><i></i><i></i></div><span>ledger.rs — Bog</span><span></span></div>
  <div class="body" data-roles="ui.background">Focused window. The title bar is a pane, never the accent.</div></div>
  <div class="win"><div class="title backdrop" data-roles="ui.pane.tertiary / ui.text.muted"><div class="dots"><i></i><i></i><i></i></div><span>notes.md — Bog</span><span></span></div>
  <div class="body">Unfocused window: backdrop crust, muted title.</div></div>
</div><div class="spec"><code>ui.pane.secondary · backdrop ui.pane.tertiary + ui.text.muted</code><span class="rule">Meaning → role: Title / header bar</span></div></article>

<article class="card"><h2>Tabs</h2><div class="stage">
  <div><div class="tabs" role="tablist"><button class="tab active" role="tab" aria-selected="true" data-roles="ui.tab.active + ui.tab.indicator">main.rs</button><button class="tab" role="tab" data-roles="ui.tab.inactive / ui.text.muted">ledger.rs</button><button class="tab" role="tab"><span class="act" data-roles="ui.info">build ●</span></button></div>
  <div style="background:var(--ui-background);height:18px"></div></div>
  <div class="ttabs"><span class="active" data-roles="ui.tab.indicator / ui.on.tab.indicator">1 shell</span><span>2 logs</span><span class="bell" data-roles="ui.bell">3 build !</span></div>
</div><div class="spec"><code>editor: indicator line · terminal: filled indicator under ui.on.tab.indicator</code><span class="rule">Meaning → role: Tabs; Tab activity / bell</span></div></article>

<article class="card"><h2>Lists and row selection</h2><div class="stage">
  <div class="list"><div><span>assets</span><small>dir</small></div><div class="hover" data-roles="surface0 (hover fill)"><span>ledger.rs</span><small class="mod">M</small></div><div class="sel" data-roles="ui.fill / ui.on.fill"><span>main.rs</span><small>M</small></div><div><span>README.md</span><small>2 KB</small></div></div>
</div><div class="spec"><code>selected row: ui.fill under ui.on.fill · every foreground on it switches to ui.on.fill</code><span class="rule">Meaning → role: Row / list selection; Hover</span></div></article>

<article class="card"><h2>Buttons</h2><div class="stage">
  <div class="row"><button class="btn primary" data-roles="ui.fill / ui.on.fill">Brew</button><button class="btn secondary" data-roles="surface0 + ui.border.inactive">Strain</button><button class="btn ghost">Cancel</button></div>
  <div class="row"><button class="btn primary focus" data-roles="ui.focus ring">Focused</button><button class="btn" disabled data-roles="surface0 / ui.text.subtle">Disabled</button><button class="btn danger" data-roles="ui.error / ui.on.error">Discard</button></div>
  <p class="note">The focus ring sits outside the fill: ui.focus on ui.fill is near 1:1.</p>
</div><div class="spec"><code>primary ui.fill · focus ui.focus (never the accent) · destructive ui.error under ui.on.error</code><span class="rule">Meaning → role: Focus ring; Status item; WCAG 1.4.11</span></div></article>

<article class="card"><h2>Text fields</h2><div class="stage two">
  <label class="field">Name<input placeholder="Bilberry wine" data-roles="ui.border.inactive"></label>
  <label class="field">Focused<input class="focus" value="Juniper" data-roles="ui.focus"></label>
  <label class="field">Disabled<input disabled value="Locked"></label>
  <label class="field">Potency<input class="err" value="1.4" aria-invalid="true" data-roles="ui.error"><span class="msg">Must be between 0 and 1</span></label>
</div><div class="spec"><code>edge ui.border.inactive (3:1) · placeholder ui.text.subtle · focus ui.focus · invalid ui.error</code><span class="rule">Light flavour rules; WCAG 1.4.11</span></div></article>

<article class="card"><h2>Checkboxes, radios, switches</h2><div class="stage">
  <div class="row"><label class="opt"><span class="chk on" data-roles="ui.fill / ui.on.fill">✓</span>Steeped</label><label class="opt"><span class="chk" data-roles="ui.border.inactive"></span>Strained</label><label class="opt dis"><span class="chk dis"></span>Bottled</label></div>
  <div class="row"><label class="opt"><span class="chk radio on"></span>Mire</label><label class="opt"><span class="chk radio"></span>Fen</label></div>
  <div class="row"><label class="opt"><span class="sw on" data-roles="ui.fill + ui.on.fill thumb"></span>Auto-stir</label><label class="opt"><span class="sw" data-roles="surface2 + ui.border.inactive"></span>Notify</label></div>
</div><div class="spec"><code>on: ui.fill · off edge: ui.border.inactive · track: surface2</code><span class="rule">WCAG 1.4.11 state indicators</span></div></article>

<article class="card"><h2>Menu and tooltip</h2><div class="stage">
  <div class="menu" data-roles="ui.pane.secondary + surface1 border"><div>Open<kbd>Ctrl O</kbd></div><div class="sel" data-roles="ui.fill / ui.on.fill">Save<kbd>Ctrl S</kbd></div><div class="dis">Revert</div><hr><div>Quit<kbd>Ctrl Q</kbd></div></div>
  <div class="row"><span class="tip" data-roles="crust (no role yet)">Steep for three stirs</span><span class="todo">No ui.tooltip role yet: GTK and darktable use crust.</span></div>
</div><div class="spec"><code>menu ui.pane.secondary, border surface1, selected ui.fill</code><span class="rule">Meaning → role: Menu / popup; Tooltip (none yet)</span></div></article>

<article class="card"><h2>Scrollbars</h2><div class="stage">
  <div class="scroller"><div class="pane">Track on a base pane is mantle; the thumb is overlay0, overlay1 on hover.</div><div class="track" data-roles="ui.pane.secondary track"><div class="thumb" data-roles="overlay0"></div></div><div class="track"><div class="thumb hover" data-roles="overlay1 (hover)"></div></div><div class="track in-mantle" data-roles="surface0 (inside mantle)"><div class="thumb"></div></div></div>
</div><div class="spec"><code>slider overlay0 · hover overlay1 · track ui.pane.secondary, or surface0 on a mantle pane</code><span class="rule">Meaning → role: Scrollbar (structural)</span></div></article>

<article class="card"><h2>Progress and meters</h2><div class="stage">
  <div class="meter" data-roles="ui.fill on surface2"><i style="width:62%"></i></div>
  <div class="grad" id="grad" data-roles="gradient: low → mid → high"></div>
  <p class="note">Unfilled track is surface2. A gradient ends in ui.error only when the meaning is an alarm.</p>
</div><div class="spec"><code>fill ui.fill · track surface2 · gradient steps ≥ 5 apart</code><span class="rule">Meaning → role: Unfilled part of a meter; Gradient</span></div></article>

<article class="card"><h2>Badges and status</h2><div class="stage">
  <div class="row"><span class="badge" data-roles="ui.badge / ui.on.badge">3</span><span class="pill" style="background:var(--ui-error)" data-roles="ui.error / ui.on.error">failed</span><span class="pill" style="background:var(--ui-warning)">paused</span><span class="pill" style="background:var(--ui-info)">following</span><span class="pill" style="background:var(--ui-success)">ready</span></div>
  <div class="banner b-err" data-roles="ui.error.surface + ui.error"><b>Error</b><span>The cauldron overflowed.</span></div>
  <div class="banner b-warn"><b>Warning</b><span>Honey is running low.</span></div>
  <div class="banner b-info"><b>Info</b><span>Three stirs make it ready.</span></div>
</div><div class="spec"><code>status fill under ui.on.error · alert surfaces ui.*.surface with the status colour as text</code><span class="rule">Meaning → role: Status item / banner; Status</span></div></article>

<article class="card"><h2>Dialog and toast</h2><div class="stage">
  <div class="scrim"><div class="dialog" data-roles="ui.pane.secondary"><h3>Discard this batch?</h3><p>The brew has steeped for four hours. This cannot be undone.</p><div class="row" style="justify-content:flex-end"><button class="btn ghost">Keep</button><button class="btn danger">Discard</button></div></div></div>
  <div class="toast" data-roles="crust toast + ui.link action"><span>Batch saved</span><a href="#grid">Undo</a></div>
</div><div class="spec"><code>dialog ui.pane.secondary over a crust scrim · action ui.link</code><span class="rule">Meaning → role: Menu / popup / floating window</span></div></article>

<article class="card"><h2>Table and links</h2><div class="stage">
  <div style="overflow-x:auto"><table class="t"><thead><tr><th>Batch</th><th>Berry</th><th class="num">Potency</th></tr></thead><tbody><tr><td><a href="#grid">#12</a></td><td>Bilberry</td><td class="num">0.62</td></tr><tr class="sel" data-roles="ui.fill / ui.on.fill"><td><a href="#grid">#13</a></td><td>Cranberry</td><td class="num">0.88</td></tr><tr><td><a href="#grid">#14</a></td><td>Juniper</td><td class="num">0.31</td></tr></tbody></table></div>
  <p class="note">Read the <a class="lnk" href="#grid" data-roles="ui.link">brewing notes</a>, or <a class="lnk hover" href="#grid" data-roles="mix(ui.link, ui.text)">the hovered link</a>.</p>
</div><div class="spec"><code>hairlines surface1 · link ui.link · hover a mix toward ui.text · visited: no role yet</code><span class="rule">Meaning → role: Link; Hairline separators</span></div></article>

<article class="card"><h2>Code editor</h2><div class="stage" style="padding:0">
  <div class="code" id="code"></div>
  <div class="status" data-roles="ui.pane.secondary status bar"><span>main ✓</span><span><span class="err">⊗ 1</span> <span class="warn">⚠ 1</span> · Ln 3, Col 9 · Rust</span></div>
</div><div class="spec"><code>current line ui.line.current · selection ui.selection · current hit ui.mark1 · other hits ui.search.matches · cursor ui.cursor · bracket ui.accent bold</code><span class="rule">Meaning → role: Cursor, Selection, Current line, Search, Bracket match; DESIGN_LANGUAGE §4, §6</span></div></article>

<article class="card"><h2>Diff</h2><div class="stage" style="padding:0">
  <div class="code diff" id="diff"></div>
</div><div class="spec"><code>lines ui.diff.added / removed / changed · changed span ui.diff.text · marks ui.success / syntax.diff.removed / ui.warning</code><span class="rule">Meaning → role: Diff</span></div></article>

<article class="card"><h2>Terminal</h2><div class="stage">
  <div class="term" id="term"></div>
  <div class="ansi" id="ansi"></div>
</div><div class="spec"><code>ansi.0–15 exactly as kitty · prompt accent as tint · cursor ui.cursor</code><span class="rule">Meaning → role: ANSI; Accent as readable text</span></div></article>

<article class="card"><h2>Split panes and borders</h2><div class="stage">
  <div class="splits"><div class="focus" data-roles="ui.border.active">$ cargo watch<br>watching src/</div><div data-roles="ui.border.inactive">$ tail -f steep.log<br>stir 3/3</div></div>
  <div class="hair" data-roles="surface1 hairlines"><span>Explorer</span><span>Outline</span><span>Timeline</span></div>
  <p class="note">Only the focused split carries the accent edge. Idle edges are overlay1 at 3:1; in-window dividers are surface1 hairlines.</p>
</div><div class="spec"><code>focused ui.border.active · unfocused ui.border.inactive · dividers surface1</code><span class="rule">Meaning → role: Window / split border; Hairline separators</span></div></article>

<article class="card"><h2>Mobile app</h2><div class="stage">
  <div class="phone">
    <div class="appbar" data-roles="ui.pane.secondary app bar"><span>Batches</span><span>⋮</span></div>
    <div class="pbody">
      <div class="segc" data-roles="segmented: surface0 track"><span class="on">Steeping</span><span>Ready</span><span>Bottled</span></div>
      <div><div style="font-size:12px;color:var(--ui-text-muted)">Sweetness</div><div class="slider" data-roles="ui.fill on surface2"><i></i><b></b></div></div>
      <div class="toast"><span>Bilberry #13 ready</span><a href="#grid">Open</a></div>
      <span class="fab" data-roles="ui.fill / ui.on.fill">+</span>
    </div>
    <div class="navbar" data-roles="ui.pane.secondary nav"><span class="on" data-roles="tint + ui.tab.indicator">Brew</span><span>Pantry</span><span>Notes</span></div>
  </div>
</div><div class="spec"><code>app bar and nav ui.pane.secondary · active nav tint · FAB ui.fill</code><span class="rule">The patterns above at phone size; DESIGN_LANGUAGE §3 accent budget</span></div></article>

</section>
</div>
<aside class="drawer" id="drawer" aria-label="Tweak roles">
  <header><h2>Tweak roles</h2><button class="btn ghost" id="close">Close</button></header>
  <div class="scroll">
    <p class="note">Edits apply to the flavour and tint on screen and stay in this browser only. The checks are the build's floors, measured live.</p>
    <table class="checks" id="checks"></table>
    <div class="roles" id="roles"></div>
    <div><p class="note">Edits as JSON, for a roles.json change or <code>docs/studio.html</code>:</p><textarea class="out" id="json" readonly></textarea></div>
  </div>
  <footer><button class="btn primary" id="copy">Copy edits</button><button class="btn secondary" id="reset">Reset this flavour</button></footer>
</aside>
<script>
const DATA = ${JSON.stringify(data)};
const FLOORS = ${JSON.stringify(floors)};
const $ = (s) => document.querySelector(s);
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
let edits = store.get("dbg-edits", {});
const themeDark = () => { const t = document.documentElement.dataset.theme; return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
let state = { tint: store.get("dbg-tint", "darkberry"), flavour: store.get("dbg-flavour", null) };
if (!DATA[state.tint]) state.tint = "darkberry";

// colour maths, the same formulas as lib/color.mjs
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const oklab = (h) => { const [r, g, b] = rgb(h).map(lin); const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b); return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; };
const dE = (a, b) => { const x = oklab(a), y = oklab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100; };

const key = () => state.tint + "/" + state.flavour;
const fd = () => DATA[state.tint].flavours[state.flavour];
const val = (name) => (edits[key()] || {})[name] || fd().roles[name] || fd().palette[name];
const cssVar = (name) => "--" + name.replace(/\\./g, "-");

function apply() {
  const f = fd(), e = edits[key()] || {}, s = document.documentElement.style;
  for (const [k, h] of Object.entries(f.roles)) s.setProperty(cssVar(k), e[k] || h);
  for (const [k, h] of Object.entries(f.palette)) s.setProperty("--p-" + k, e[k] || h);
  f.ansi.forEach((h, i) => s.setProperty("--ansi-" + i, h));
  s.colorScheme = f.dark ? "dark" : "light";
  document.querySelectorAll("#flv button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === state.flavour)));
  $("#tintnote").textContent = DATA[state.tint].name + " " + f.name + ". " + DATA[state.tint].note;
  renderLadder(); renderChecks(); renderRoles(); $("#json").value = JSON.stringify(edits, null, 1);
}
function renderLadder() {
  const names = ["crust", "mantle", "base", "surface0", "surface1", "surface2"];
  $("#ladder").innerHTML = names.map((n) => '<i style="background:' + val(n) + ";color:" + val("text") + '">' + n + "</i>").join("");
  $("#grad").innerHTML = ["gooseberry", "honey", "cranberry"].map((n) => '<i style="background:' + val(n) + '"></i>').join("");
}
const CHECKS = [
  ["ui.text", "ui.background", 4.5, "body text"], ["ui.text.muted", "ui.background", 4.5, "muted text"], ["ui.text.muted", "ui.pane.tertiary", 4.5, "muted on crust"],
  ["ui.text.subtle", "ui.background", 3, "subtle (glue)"], ["ui.link", "ui.background", 4.5, "link"], ["syntax.comment", "ui.background", 4.5, "comment"],
  ["syntax.comment", "ui.line.current", 4.5 * 0.85, "comment on current line"], ["ui.text", "ui.selection", 4.5, "text on selection"],
  ["ui.on.fill", "ui.fill", 4.5, "on fill"], ["ui.on.error", "ui.error", 4.5, "on error"], ["ui.mark.text", "ui.mark1", 4.5, "current hit"],
  ["ui.on.badge", "ui.badge", 4.5, "badge"], ["ui.on.tab.indicator", "ui.tab.indicator", 4.5, "terminal tab"],
  ["ui.accent", "ui.background", 3, "accent (UI)"], ["ui.focus", "ui.background", 3, "focus ring"], ["ui.border.inactive", "ui.background", 3, "input edge"], ["ui.cursor", "ui.background", 3, "cursor"],
  ["ui.accent", "ui.pane.secondary", 4.5, "accent as text in gutter"],
];
function renderChecks() {
  const rows = CHECKS.map(([a, b, min, label]) => { const r = contrast(val(a), val(b)); return "<tr><td>" + label + '<br><code>' + a + " / " + b + '</code></td><td class="n">' + r.toFixed(2) + ':1</td><td class="n">' + min.toFixed(1) + '</td><td class="n ' + (r >= min ? "ok" : "bad") + '">' + (r >= min ? "pass" : "fail") + "</td></tr>"; });
  const d1 = dE(val("ui.selection"), val("ui.line.current")), d2 = dE(val("ui.line.current"), val("ui.background")), d3 = dE(val("ui.success"), val("ui.error"));
  rows.push('<tr><td>selection vs current line<br><code>OKLab ×100</code></td><td class="n">' + d1.toFixed(1) + '</td><td class="n">≥5</td><td class="n ' + (d1 >= 5 ? "ok" : "bad") + '">' + (d1 >= 5 ? "pass" : "fail") + "</td></tr>");
  rows.push('<tr><td>current line vs base<br><code>OKLab ×100</code></td><td class="n">' + d2.toFixed(1) + '</td><td class="n">≤4</td><td class="n ' + (d2 <= 4 ? "ok" : "bad") + '">' + (d2 <= 4 ? "pass" : "fail") + "</td></tr>");
  rows.push('<tr><td>success vs error<br><code>OKLab ×100</code></td><td class="n">' + d3.toFixed(1) + '</td><td class="n">≥10</td><td class="n ' + (d3 >= 10 ? "ok" : "bad") + '">' + (d3 >= 10 ? "pass" : "fail") + "</td></tr>");
  $("#checks").innerHTML = '<tr><td><b>Pair</b></td><td class="n"><b>Measured</b></td><td class="n"><b>Floor</b></td><td></td></tr>' + rows.join("");
}
const GROUPS = {
  Surfaces: ["ui.background", "ui.pane.secondary", "ui.pane.tertiary", "ui.line.current", "ui.selection", "ui.search.matches"],
  Text: ["ui.text", "ui.text.muted", "ui.text.subtle", "ui.link", "ui.emphasis"],
  Signals: ["ui.accent", "ui.fill", "ui.on.fill", "ui.focus", "ui.cursor", "ui.cursor.text", "ui.border.active", "ui.border.inactive", "ui.tab.indicator", "ui.on.tab.indicator", "ui.mark1", "ui.mark.text", "ui.badge", "ui.on.badge"],
  Status: ["ui.success", "ui.warning", "ui.error", "ui.on.error", "ui.info", "ui.bell", "ui.diff.added", "ui.diff.changed", "ui.diff.removed", "ui.diff.text"],
  Syntax: ["syntax.keyword", "syntax.function", "syntax.type", "syntax.string", "syntax.number", "syntax.comment", "syntax.property", "syntax.variable", "syntax.constant", "syntax.namespace", "syntax.operator", "syntax.punctuation"],
};
function renderRoles() {
  const e = edits[key()] || {};
  $("#roles").innerHTML = Object.entries(GROUPS).map(([g, list]) => "<h3>" + g + "</h3>" + list.filter((r) => fd().roles[r]).map((r) => '<label class="rrow' + (e[r] ? " edited" : "") + '"><input type="color" id="c-' + r.replace(/\\./g, "-") + '" data-r="' + r + '" value="' + val(r) + '"><span>' + r + '</span><span class="hx">' + val(r) + "</span></label>").join("")).join("");
}
$("#roles").addEventListener("input", (ev) => { const r = ev.target.dataset.r; if (!r) return; (edits[key()] ||= {})[r] = ev.target.value; store.set("dbg-edits", edits); const s = document.documentElement.style; s.setProperty(cssVar(r), ev.target.value); ev.target.closest(".rrow").classList.add("edited"); ev.target.parentElement.querySelector(".hx").textContent = ev.target.value; renderChecks(); $("#json").value = JSON.stringify(edits, null, 1); });
$("#reset").onclick = () => { delete edits[key()]; store.set("dbg-edits", edits); apply(); };
$("#copy").onclick = async (ev) => { const t = $("#json").value; try { await navigator.clipboard.writeText(t); ev.target.textContent = "Copied"; } catch { $("#json").select(); ev.target.textContent = "Selected, press Ctrl C"; } setTimeout(() => (ev.target.textContent = "Copy edits"), 1800); };
$("#tw").onclick = () => $("#drawer").classList.add("open");
$("#close").onclick = () => $("#drawer").classList.remove("open");
$("#lbl").onclick = (ev) => { const on = document.body.classList.toggle("labels"); ev.target.setAttribute("aria-pressed", String(on)); ev.target.textContent = on ? "Hide roles" : "Show roles"; };

// specimens built once; colours come from the custom properties
const L = (n, html, cls = "") => '<div class="ln ' + cls + '"><span class="g">' + n + '</span><span class="c">' + html + "</span></div>";
$("#code").innerHTML = [
  L(1, '<span class="cm">/// A brew in progress, steeped from one or more berries.</span>'),
  L(2, '<span class="kw">pub struct</span> <span class="ty">Brew</span> <span class="pu">{</span> <span class="pr">name</span><span class="pu">:</span> <span class="ty">String</span><span class="pu">,</span> <span class="pr"><span class="hit">potency</span></span><span class="pu">:</span> <span class="ty">f32</span> <span class="pu">}</span>'),
  L(3, '<span class="kw">let</span> <span class="va">state</span> <span class="op">=</span> <span class="kw">if</span> <span class="va">self</span><span class="pu">.</span><span class="pr hit1">potency</span> <span class="op">&gt;</span> <span class="nu">0.5</span> <span class="bm">{</span> <span class="st">"ready"</span> <span class="bm">}</span><span class="caret"> </span>', "cur"),
  L(4, '<span class="sel-t"><span class="fn">steep</span><span class="pu">(</span><span class="ns">berries</span><span class="pu">::</span><span class="co">BILBERRY</span><span class="pu">,</span> <span class="nu">3</span><span class="pu">)</span></span><span class="pu">;</span> <span class="squig">brew</span><span class="pu">.</span><span class="squig w">stir</span><span class="pu">()</span>'),
  L(5, '<span class="va">total</span> <span class="op">+=</span> <span class="va">self</span><span class="pu">.</span><span class="pr"><span class="hit">potency</span></span> <span class="op">*</span> <span class="nu">100.0</span><span class="pu">;</span>'),
].join("");
$("#diff").innerHTML = [
  L(" ", '<span class="kw">fn</span> <span class="fn">steep</span><span class="pu">(</span><span class="va">b</span><span class="pu">:</span> <span class="op">&amp;</span><span class="pu">[</span><span class="ty">Berry</span><span class="pu">])</span> <span class="pu">{</span>'),
  L("−", '    <span class="kw">let</span> <span class="va">p</span> <span class="op">=</span> <span class="nu">0.1</span><span class="pu">;</span>', "rem"),
  L("+", '    <span class="kw">let</span> <span class="va">p</span> <span class="op">=</span> <span class="va">b</span><span class="pu">.</span><span class="fn">len</span><span class="pu">()</span> <span class="kw">as</span> <span class="ty">f32</span> <span class="op">*</span> <span class="nu">0.125</span><span class="pu">;</span>', "add"),
  L("~", '    <span class="fn">stir</span><span class="pu">(</span><span class="dt"><span class="nu">3</span></span><span class="pu">);</span>', "chg"),
  L(" ", '<span class="pu">}</span>'),
].join("");
$("#term").innerHTML = '<span style="color:var(--p-tint);font-weight:700">~/bog</span> <span style="color:var(--ansi-5)">main</span> <span style="color:var(--ansi-2)">✓</span> <span style="color:var(--ui-text)">cargo test</span>\\n<span style="color:var(--ansi-2)">test</span> brew::steeps ... <span style="color:var(--ansi-2)">ok</span>\\n<span style="color:var(--ansi-2)">test</span> brew::stirs ... <span style="color:var(--ansi-1)">FAILED</span>\\n<span style="color:var(--ansi-3)">warning</span>: unused variable <span class="sel-t">\\x60honey\\x60</span>\\n<span style="color:var(--p-tint);font-weight:700">~/bog</span> <span class="tcur">\\u00a0</span>';
$("#ansi").innerHTML = Array.from({ length: 16 }, (_, i) => '<i style="background:var(--ansi-' + i + ");color:" + (i === 0 || i === 8 ? "var(--ui-text)" : "var(--ui-background)") + '">' + i + "</i>").join("");

// controls
$("#flv").innerHTML = ["wisp", "fen", "mire", "blackwater"].map((f) => '<button data-f="' + f + '" aria-pressed="false">' + DATA.darkberry.flavours[f].name + "</button>").join("");
$("#flv").onclick = (ev) => { const f = ev.target.dataset.f; if (!f) return; state.flavour = f; store.set("dbg-flavour", f); apply(); };
$("#tint").innerHTML = Object.entries(DATA).map(([k, t]) => '<option value="' + k + '">' + t.name + "</option>").join("");
$("#tint").value = state.tint;
$("#tint").onchange = (ev) => { state.tint = ev.target.value; store.set("dbg-tint", state.tint); apply(); };
// #mire or #blueberry-mire opens on that flavour and tint, so a headless browser can capture each one.
const hash = location.hash.slice(1).toLowerCase().split("-");
if (hash.length === 2 && DATA[hash[0]]) { state.tint = hash[0]; $("#tint").value = state.tint; }
if (DATA[state.tint].flavours[hash[hash.length - 1]]) state.flavour = hash[hash.length - 1];
if (!state.flavour || !fd()) state.flavour = themeDark() ? "mire" : "wisp";
apply();
</script>${standalone ? "\n</html>" : ""}
`;
if (out) { fs.writeFileSync(out, html); console.log(`wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`); } else process.stdout.write(html);
