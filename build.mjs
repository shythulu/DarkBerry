// Darkberry build.
//   node build.mjs [path/to/palette.json]
// Layer 1  src/palette.json            what each colour is
// Layer 2  src/roles.json              what each colour means (shared by every port)
// Layer 3  src/overrides/<port>.json   rare, logged, port-only exceptions
// Templates in src/ports/ and src/vscode/ reference roles (or palette names for
// structural chrome) inside {braces}. Literal hex values are a build error.
import fs from "node:fs";
import path from "node:path";
import { rgb, mix, toHsl, toOklch, contrast, deltaE } from "./lib/color.mjs";
import { indexRoles, flavourContext } from "./lib/resolve.mjs";
import { fillSettled, FILL_ON_BACKGROUND, TEXT_ON_FILL } from "./lib/derive.mjs";

const root = path.dirname(new URL(import.meta.url).pathname);
const read = (rel) => fs.readFileSync(path.resolve(root, rel), "utf8");
const readJson = (rel) => JSON.parse(read(rel));
// `node build.mjs --check [palette]` runs every check and writes nothing, so a tint
// can be verified without overwriting ports/, docs/ and dist/ with its output.
const CHECK_ONLY = process.argv.includes("--check");
const argPalette = process.argv.slice(2).find((a) => !a.startsWith("--"));
const out = (rel, data) => {
  if (CHECK_ONLY) return;
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n");
};

const P = readJson(argPalette || "src/palette.json");
const ROLES = readJson("src/roles.json");
const NON_ACCENT = ["jam", "onjam", "tint"];
const errors = [], warnings = [];
const HEX_LITERAL = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/;

// ---------- roles ----------
const roleIndex = indexRoles(ROLES);
const whyOf = (r) => { const w = r.why; return w && w.includes(".$why") ? ROLES[w.split(".")[0]]["$why"] : w; };
for (const [name, r] of Object.entries(roleIndex)) {
  if (r.catppuccin && r.catppuccin !== "=" && !whyOf(r)) errors.push(`role ${name} deviates from Catppuccin without a 'why'`);
  if (HEX_LITERAL.test(JSON.stringify(r.value))) errors.push(`role ${name} uses a literal hex value`);
}

// ---------- the fill equation (lib/derive.mjs) ----------
for (const [id, f] of Object.entries(P.flavours))
  if (!fillSettled(f.colors)) errors.push(`${f.name}: jam/onjam are not settled (jam ${FILL_ON_BACKGROUND}:1 on base, onjam ${TEXT_ON_FILL}:1 on jam); run node tools/settle.mjs`);
// ---------- per-flavour resolution (lib/resolve.mjs) ----------
const ctxs = Object.entries(P.flavours).map(([id, f]) => flavourContext(id, f, ROLES, roleIndex));
const usageRef = ctxs.find((x) => x.id === "mire") || ctxs.find((x) => x.f.dark) || ctxs[0];

// ---------- template filling ----------
const usage = {}; // palette colour -> { roles:Set, ports:{port:count} }
const note = (port, trace) => {
  for (const p of trace.palette) {
    usage[p] ??= { roles: new Set(), ports: {} };
    trace.roles.forEach((r) => usage[p].roles.add(r));
    usage[p].ports[port] = (usage[p].ports[port] || 0) + 1;
  }
};
const meta = (ctx) => ({
  FULL: `${P.name} ${ctx.f.name}`, NAME: P.name, NOTE: ctx.f.note, VERSION: P.version,
  SLUG: `${P.id}-${ctx.id}`, ID: P.id, SCHEME: ctx.f.dark ? "dark" : "light",
  FLAVOUR: ctx.f.name,
  HOMEPAGE: P.homepage,
  ISDARK: ctx.f.dark ? "true" : "false",
  ...accentHsl(ctx),
});
// Obsidian builds --color-accent and its hover shades out of these three, so a hex is not enough.
function accentHsl(ctx) {
  const [H, S, L] = toHsl(ctx.resolve("ui.accent")[0]);
  return { ACCENT_H: Math.round(H), ACCENT_S: `${Math.round(S * 100)}%`, ACCENT_L: `${Math.round(L * 100)}%` };
}
function fill(ctx, text, port) {
  if (HEX_LITERAL.test(text.replace(/%\w+%/g, ""))) errors.push(`${port}: template contains a literal hex value`);
  const M = meta(ctx);
  return text
    .replace(/%(\w+)%/g, (_, k) => M[k] ?? `%${k}%`)
    .replace(/\{([^{}"\s]+)\}([0-9a-f]{2})?/g, (_, expr, alpha) => {
      try { const [hex, trace] = ctx.resolve(expr); if (ctx.id === usageRef.id) note(port, trace); return hex + (alpha || ""); }
      catch (e) { errors.push(`${port}: ${e.message}`); return "#000000"; }
    });
}
function applyOverrides(port, kind, content, ctx) {
  const list = readJson(`src/overrides/${port}.json`).overrides || [];
  for (const o of list) {
    if (!o.why) errors.push(`override ${port}/${o.key} has no 'why'`);
    if (HEX_LITERAL.test(o.value)) errors.push(`override ${port}/${o.key} uses a literal hex value`);
    const v = fill(ctx, o.value, port);
    if (kind === "lines") {
      const re = new RegExp(`^(${o.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*=?\\s*).*$`, "m");
      if (!re.test(content)) errors.push(`override ${port}/${o.key}: key not found`);
      content = content.replace(re, (_, lead) => lead + v);
    } else content[o.key] = v;
  }
  return content;
}

// ---------- ports ----------
const kittyT = read("src/ports/kitty.conf"), ghosttyT = read("src/ports/ghostty"), firefoxT = read("src/ports/firefox.json");
const obsidianT = read("src/ports/obsidian.css"), obsidianManifestT = read("src/ports/obsidian.json");
const kdeT = read("src/ports/kde.colors"), konsoleT = read("src/ports/konsole.colorscheme");
const nimbalystT = read("src/ports/nimbalyst.json"), microT = read("src/ports/micro.micro");
const kateT = read("src/ports/kate.theme"), chromeT = read("src/ports/chrome.json");
const nppT = read("src/ports/notepadpp.xml");
const starshipT = read("src/ports/starship.toml"), lsdT = read("src/ports/lsd.yaml"), bordersT = read("src/ports/borders.sh");
// JankyBorders takes 0xAARRGGBB, so the filled hex gets an opaque alpha prefix.
const toArgb = (text) => text.replace(/#([0-9a-f]{6})\b/g, (_, h) => `0xff${h}`);
const lsColorsT = read("src/ports/ls-colors.txt");
const tinted8T = read("src/ports/tinted8.yaml"), base24T = read("src/ports/base24.yaml");
const gtkT = read("src/ports/gtk.css"), darktableT = read("src/ports/darktable.css"), gimpT = read("src/ports/gimp.css");
const btopT = read("src/ports/btop.theme");
// KDE and Konsole take decimal triplets, not hex, so the filled text is converted at the end.
const to256 = (text) => text.replace(/"#([0-9a-f]{6})"/g, (_, h) => {
  const [r, g, b] = rgb("#" + h).map((v) => v * 255), steps = [0, 95, 135, 175, 215, 255];
  const near = (v) => steps.reduce((best, s, i) => Math.abs(s - v) < Math.abs(steps[best] - v) ? i : best, 0);
  const cube = [near(r), near(g), near(b)], cubeRgb = cube.map((i) => steps[i]);
  const grey = Math.round(Math.min(23, Math.max(0, ((r + g + b) / 3 - 8) / 10))), greyV = 8 + grey * 10;
  const dist = (x) => (x[0] - r) ** 2 + (x[1] - g) ** 2 + (x[2] - b) ** 2;
  return String(dist([greyV, greyV, greyV]) < dist(cubeRgb) ? 232 + grey : 16 + 36 * cube[0] + 6 * cube[1] + cube[2]);
});
const toBareHex = (text) => text.replace(/"#([0-9a-f]{6})"/g, (_, h) => `"${h.toUpperCase()}"`);
const toRgbArrays = (text) => text.replace(/"#([0-9a-f]{6})"/g, (_, h) => "[" + rgb("#" + h).map((v) => Math.round(v * 255)).join(", ") + "]");
// LS_COLORS is one colon-joined string, so its port is a table (patterns, value,
// optional trailing note) that gets compiled rather than written out as-is. By the
// time this runs fill() has turned every {role} into a hex, which SGR cannot take.
const sgr = (hex) => "38;2;" + rgb(hex).map((v) => Math.round(v * 255)).join(";");
const WRAP = 96;
function toLsColors(text) {
  const lines = [];
  let first = true;
  for (const raw of text.split("\n")) {
    const t = raw.trim();
    if (!t || t.startsWith("#")) { lines.push(raw.trimEnd()); continue; }
    const toks = t.split(/\s+/);
    const vi = toks.findIndex((x) => /#[0-9a-f]{6}/.test(x));
    const value = toks[vi].replace(/#([0-9a-f]{6})/, (_, h) => sgr("#" + h));
    const note = toks.slice(vi + 1).join(" ");
    const entries = toks.slice(0, vi).map((p) => `${p}=${value}`);
    // A continuation inside double quotes swallows the newline but keeps every
    // space after it, so wrapped lines have to start hard against the margin.
    // ${LS_COLORS}, never $LS_COLORS: zsh reads `$LS_COLORS:st=` as the :s history
    // modifier and dies with "bad substitution". Six of the type keys start with a
    // modifier letter, so the braces are load-bearing.
    let body = first ? "LS_COLORS=\"" : "LS_COLORS=\"${LS_COLORS}:";
    const parts = [];
    for (const e of entries) {
      if (body.length + e.length + 1 > WRAP && !body.endsWith(":") && !body.endsWith("\"")) { parts.push(body + ":\\"); body = ""; }
      body += (body === "" || body.endsWith(":") || body.endsWith("\"") ? "" : ":") + e;
    }
    parts.push(body + "\"" + (note ? `  # ${note}` : ""));
    lines.push(parts.join("\n"));
    first = false;
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n\nexport LS_COLORS\n";
}
// The two Tinted Theming schemes carry a trailing note on some lines. Aligning
// it here rather than in the template is the only way it lands straight: a role
// name and the hex it resolves to are different lengths.
const alignYamlNotes = (text) => {
  const lines = [], block = [];
  const flush = () => {
    const w = Math.max(0, ...block.map(([code]) => code.length));
    for (const [code, note] of block.splice(0)) lines.push(code.padEnd(w) + "  " + note);
  };
  for (const line of text.split("\n")) {
    const m = /^(\s*[\w.-]+: "#[0-9a-f]{6}")\s+(#.*)$/.exec(line);
    if (m) block.push([m[1], m[2]]); else { flush(); lines.push(line); }
  }
  flush();
  return lines.join("\n");
};
const toTriplets = (text) => text.replace(/#([0-9a-f]{6})/g, (_, h) => rgb("#" + h).map((v) => Math.round(v * 255)).join(","));
const vscodeT = read("src/vscode/template.json");

// VS Code lint: syntax colours and key UI colours must go through roles
const VS = JSON.parse(vscodeT);
const mustBeRole = ["editor.background", "editorCursor.foreground", "terminalCursor.foreground", "focusBorder", "textLink.foreground",
  "badge.background", "badge.foreground", "button.foreground", "editorError.foreground", "editorWarning.foreground", "editorInfo.foreground",
  "gitDecoration.addedResourceForeground", "terminal.background", "terminal.selectionBackground", ...Object.keys(VS.colors).filter((k) => k.startsWith("terminal.ansi"))];
for (const k of mustBeRole) if (!/^\{(ui|syntax|ansi)\./.test(VS.colors[k] || "")) errors.push(`vscode: ${k} must reference a role`);
// One meaning, one role, in every port. These keys carry a shared meaning
// (selection, current line, fill, focus, emphasis, text on an error fill), so a
// port that reaches past the role for a palette mix is a drift, not a style.
const mustBe = (port, text, key, want, re) => { if (!re.test(text)) errors.push(`${port}: ${key} must be ${want}`); };
mustBe("vscode", VS.colors["editor.selectionBackground"], "editor.selectionBackground", "{ui.selection}", /^\{ui\.selection\}/);
mustBe("vscode", VS.colors["selection.background"], "selection.background", "{ui.selection}", /^\{ui\.selection\}/);
mustBe("vscode", VS.colors["editor.lineHighlightBackground"], "editor.lineHighlightBackground", "{ui.line.current}", /^\{ui\.line\.current\}/);
mustBe("vscode", VS.colors["button.background"], "button.background", "{ui.fill}", /^\{ui\.fill\}/);
mustBe("vscode", VS.colors["tab.activeBorderTop"], "tab.activeBorderTop", "an opaque {ui.tab.indicator}", /^\{ui\.tab\.indicator\}$/);
mustBe("konsole", konsoleT, "[ForegroundIntense]", "{ui.text} (Konsole draws bold with it)", /\[ForegroundIntense\]\nColor=\{ui\.text\}/);
mustBe("kde", kdeT, "DecorationFocus", "{ui.focus}", /^DecorationFocus=\{ui\.focus\}$/m);
mustBe("kde", kdeT, "DecorationHover", "{ui.accent}", /^DecorationHover=\{ui\.accent\}$/m);
mustBe("kate", kateT, "CurrentLine", "{ui.line.current}", /"CurrentLine": "\{ui\.line\.current\}"/);
mustBe("micro", microT, "error", "{ui.on.error} on {ui.error}", /^color-link error "\{ui\.on\.error\},\{ui\.error\}"/m);
mustBe("micro", microT, "error-message", "{ui.on.error} on {ui.error}", /^color-link error-message "\{ui\.on\.error\},\{ui\.error\}"/m);
mustBe("lsd", to256(fill(ctxs[0], lsdT, "lsd-check")), "256 companion", "free of hex strings", /^(?![\s\S]*"#[0-9a-f]{6}")/);
mustBe("btop", btopT, "main_bg", "{ui.background}", /^theme\[main_bg\]="\{ui\.background\}"$/m);
mustBe("btop", btopT, "main_fg", "{ui.text}", /^theme\[main_fg\]="\{ui\.text\}"$/m);
mustBe("btop", btopT, "selected_bg", "{ui.fill} (a row selection)", /^theme\[selected_bg\]="\{ui\.fill\}"$/m);
mustBe("btop", btopT, "selected_fg", "{ui.on.fill}", /^theme\[selected_fg\]="\{ui\.on\.fill\}"$/m);
mustBe("btop", btopT, "followed_bg", "{ui.mark1}", /^theme\[followed_bg\]="\{ui\.mark1\}"$/m);
mustBe("btop", btopT, "followed_fg", "{ui.mark.text}", /^theme\[followed_fg\]="\{ui\.mark\.text\}"$/m);
mustBe("btop", btopT, "temp gradient", "{ui.success} > {ui.warning} > {ui.error}", /^theme\[temp_start\]="\{ui\.success\}"\ntheme\[temp_mid\]="\{ui\.warning\}"\ntheme\[temp_end\]="\{ui\.error\}"$/m);
mustBe("btop", btopT, "proc_banner_fg", "{ui.on.error} (text on the status fills)", /^theme\[proc_banner_fg\]="\{ui\.on\.error\}"$/m);
mustBe("btop", btopT, "div_line", "{ui.border.inactive}", /^theme\[div_line\]="\{ui\.border\.inactive\}"$/m);
mustBe("darktable", darktableT, "@import", "free of chunk-fonts.css (unreleased file; a missing @import drops the whole theme on 4.6 to 5.2)", /^(?![\s\S]*@import[^\n]*chunk-fonts)/);

for (const t of VS.tokenColors) for (const v of [t.settings.foreground, t.settings.background].filter(Boolean))
  if (!/^\{syntax\./.test(v)) errors.push(`vscode: token rule "${t.name}" must use a syntax.* role (found ${v})`);

for (const ctx of ctxs) {
  const slug = `${P.id}-${ctx.id}`, full = `${P.name} ${ctx.f.name}`;
  out(`ports/kitty/${slug}.conf`, applyOverrides("kitty", "lines", fill(ctx, kittyT, "kitty"), ctx));
  out(`ports/ghostty/${full}`, applyOverrides("ghostty", "lines", fill(ctx, ghosttyT, "ghostty"), ctx));
  const ff = JSON.parse(fill(ctx, firefoxT, "firefox"));
  ff.theme.colors = applyOverrides("firefox", "json", ff.theme.colors, ctx);
  out(`ports/firefox/${ctx.id}/manifest.json`, ff);
  const nb = JSON.parse(fill(ctx, nimbalystT, "nimbalyst"));
  nb.colors = applyOverrides("nimbalyst", "json", nb.colors, ctx);
  out(`ports/nimbalyst/${full}/theme.json`, nb);
  out(`ports/micro/${slug}.micro`, applyOverrides("micro", "lines", fill(ctx, microT, "micro"), ctx));
  const kt = JSON.parse(fill(ctx, kateT, "kate"));
  kt["editor-colors"] = applyOverrides("kate", "json", kt["editor-colors"], ctx);
  out(`ports/kate/${slug}.theme`, kt);
  out(`ports/chrome/${full}/manifest.json`, toRgbArrays(fill(ctx, chromeT, "chrome")));
  const lsdOut = applyOverrides("lsd", "lines", fill(ctx, lsdT, "lsd"), ctx);
  out(`ports/lsd/${slug}.yaml`, lsdOut);
  // lsd below 1.1 rejects hex strings and then drops the whole theme without a word
  // (Ubuntu 24.04 ships 1.0.0), so a companion file carries the nearest xterm-256 index.
  out(`ports/lsd/${slug}.256.yaml`, to256(lsdOut).replace(/^attributes:\n(?:[ #].*\n)+/m, "") // the attributes block is lsd 1.1+ too
    .replace("Install with:", "lsd 1.0 companion (nearest xterm-256 colours). Install with:").replace(`${slug}.yaml`, `${slug}.256.yaml`).replace(/# Needs lsd 1\.1 or newer[\s\S]*?indices\.\n/, `# This is the lsd 1.0 companion: the same theme as xterm-256 indices, for releases that\n# reject hex strings (Ubuntu 24.04 ships 1.0.0). On lsd 1.1 or newer use ${slug}.yaml.\n`));
  out(`ports/ls-colors/${slug}.sh`, toLsColors(applyOverrides("ls-colors", "lines", fill(ctx, lsColorsT, "ls-colors"), ctx)));
  out(`ports/starship/${slug}.toml`, applyOverrides("starship", "lines", fill(ctx, starshipT, "starship"), ctx));
  out(`ports/borders/${slug}.sh`, toArgb(applyOverrides("borders", "lines", fill(ctx, bordersT, "borders"), ctx)));
  out(`ports/tinted8/${slug}.yaml`, alignYamlNotes(applyOverrides("tinted8", "lines", fill(ctx, tinted8T, "tinted8"), ctx)));
  out(`ports/base24/${slug}.yaml`, alignYamlNotes(applyOverrides("base24", "lines", fill(ctx, base24T, "base24"), ctx)));
  out(`ports/gtk/${full}/gtk-3.0/gtk.css`, applyOverrides("gtk", "lines", fill(ctx, gtkT, "gtk"), ctx));
  out(`ports/darktable/${slug}.css`, applyOverrides("darktable", "lines", fill(ctx, darktableT, "darktable"), ctx));
  out(`ports/gimp/${slug}.css`, applyOverrides("gimp", "lines", fill(ctx, gimpT, "gimp"), ctx));
  out(`ports/btop/${slug}.theme`, applyOverrides("btop", "lines", fill(ctx, btopT, "btop"), ctx));
  out(`ports/notepadpp/${full}.xml`, toBareHex(applyOverrides("notepadpp", "lines", fill(ctx, nppT, "notepadpp"), ctx)));
  out(`ports/kde/${full}.colors`, toTriplets(applyOverrides("kde", "lines", fill(ctx, kdeT, "kde"), ctx)));
  out(`ports/konsole/${full}.colorscheme`, toTriplets(applyOverrides("konsole", "lines", fill(ctx, konsoleT, "konsole"), ctx)));
  out(`ports/obsidian/${full}/theme.css`, applyOverrides("obsidian", "lines", fill(ctx, obsidianT, "obsidian"), ctx));
  out(`ports/obsidian/${full}/manifest.json`, JSON.parse(fill(ctx, obsidianManifestT, "obsidian")));
  const vs = JSON.parse(fill(ctx, vscodeT, "vscode"));
  vs.colors = applyOverrides("vscode", "json", vs.colors, ctx);
  out(`ports/vscode/themes/${slug}-color-theme.json`, { name: full, type: ctx.f.dark ? "dark" : "light", ...vs });
}
// GIMP palette (.gpl): the format GIMP, Inkscape, Krita, MyPaint and Aseprite all import.
// One file per flavour, and one with every flavour so a picker can hold the whole theme.
const gpl = (name, rows) => `GIMP Palette\nName: ${name}\nColumns: 8\n# ${P.name} ${P.version}, ${P.homepage}\n` +
  rows.map(([hex, label]) => rgb(hex).map((v) => String(Math.round(v * 255)).padStart(3)).join(" ") + "\t" + label).join("\n") + "\n";
const label = (k) => k[0].toUpperCase() + k.slice(1);
const gplOrder = [...P.accentOrder, ...P.neutralOrder];
for (const ctx of ctxs)
  out(`ports/gpl/${P.id}-${ctx.id}.gpl`, gpl(`${P.name} ${ctx.f.name}`, gplOrder.map((k) => [ctx.f.colors[k], label(k)])));
out(`ports/gpl/${P.id}.gpl`, gpl(P.name, ctxs.flatMap((ctx) => gplOrder.map((k) => [ctx.f.colors[k], `${ctx.f.name} ${label(k)}`]))));

out("ports/vscode/package.json", {
  name: `${P.id}-theme`, displayName: P.name, description: P.description, version: P.version,
  publisher: "shythulu", license: "MIT", engines: { vscode: "^1.70.0" },
  homepage: P.homepage, repository: { type: "git", url: P.repository },
  categories: ["Themes"], keywords: ["theme", "dark", "light", "berry", "plum", "wine"],
  contributes: { themes: ctxs.map((x) => ({ label: `${P.name} ${x.f.name}`, uiTheme: x.f.dark ? "vs-dark" : "vs", path: `./themes/${P.id}-${x.id}-color-theme.json` })) },
});

// ---------- dist/trace.json (what drives every themed key) ----------
const trace = [];
const traceExpr = (port, key, raw) => {
  for (const m of String(raw).matchAll(/\{([^{}"\s]+)\}([0-9a-f]{2})?/g)) {
    const [, chain] = usageRef.resolve(m[1]);
    trace.push({ port, key, expr: m[0], roles: chain.roles.filter((r) => !r.startsWith("ansi.")).concat(chain.roles.filter((r) => r.startsWith("ansi."))), palette: [...chain.palette],
      hex: Object.fromEntries(ctxs.map((x) => [x.id, x.resolve(m[1])[0] + (m[2] || "")])) });
  }
};
const walk = (port, o, pre = "") => { if (typeof o === "string") return traceExpr(port, pre, o);
  if (Array.isArray(o)) return o.forEach((v, i) => walk(port, v, `${pre}[${v?.name ? JSON.stringify(v.name) : i}]`));
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(port, v, pre ? (pre === "colors" || pre.endsWith("colors") ? `${k}` : `${pre}.${k}`) : k); };
for (const [port, text] of [["kitty", kittyT], ["ghostty", ghosttyT], ["obsidian", obsidianT], ["kde", kdeT], ["konsole", konsoleT], ["micro", microT], ["notepadpp", nppT], ["starship", starshipT], ["borders", bordersT], ["lsd", lsdT], ["tinted8", tinted8T], ["base24", base24T], ["gtk", gtkT], ["darktable", darktableT], ["gimp", gimpT]])
  for (const line of text.split("\n")) { const m = /^([\w.-]+(?:\s*=\s*\d+)?)\s*=?\s*(.*\{.*)$/.exec(line.trim()); if (m && !line.startsWith("#")) traceExpr(port, m[1].replace(/\s+/g, " "), m[2]); }
for (const raw of lsColorsT.split("\n")) {
  const t = raw.trim();
  if (!t || t.startsWith("#")) continue;
  const toks = t.split(/\s+/), vi = toks.findIndex((x) => x.includes("{"));
  if (vi > 0) traceExpr("ls-colors", toks.slice(0, vi).join(" "), toks[vi]);
}
// btop spells its keys theme[name]="..."; the line regex above would record every one as "theme".
for (const line of btopT.split("\n")) { const m = /^theme\[(\w+)\]="(.*)"$/.exec(line); if (m) traceExpr("btop", m[1], m[2]); }
walk("firefox", JSON.parse(firefoxT).theme.colors, "colors");
walk("chrome", JSON.parse(chromeT).theme.colors, "colors");
walk("nimbalyst", JSON.parse(nimbalystT.replace(/%ISDARK%/, "true")).colors, "colors");
walk("kate", JSON.parse(kateT));
walk("vscode", VS.colors, "colors");
walk("vscode", { tokenColors: VS.tokenColors.map((t) => ({ name: t.name, ...t.settings })) });
for (const port of ["kitty", "ghostty", "firefox", "vscode", "obsidian", "kde", "konsole", "nimbalyst", "micro", "kate", "chrome", "notepadpp", "gtk", "darktable", "gimp", "starship", "borders", "lsd", "ls-colors", "tinted8", "base24", "btop"]) for (const o of readJson(`src/overrides/${port}.json`).overrides || []) traceExpr(port, `${o.key} (override)`, o.value);
out("dist/trace.json", trace);

// ---------- docs/studio.html (interactive editor, regenerated with current data) ----------
{
  const vo = readJson("src/overrides/vscode.json").overrides || [];
  const tl = vo.find((o) => o.key === "tab.activeBorderTop" && !/\}00$/.test(o.value)) ? "top" : vo.find((o) => o.key === "tab.activeBorder" && !/\}00$/.test(o.value)) ? "bottom" : "none";
  const data = { version: P.version, palette: P, roles: ROLES, tabLine: tl, bindings: trace.map((t) => [t.port, t.key, t.expr]) };
  const lib = read("lib/color.mjs").replace(/^export /gm, "");
  out("docs/studio.html", read("src/studio/studio.html").replace("__DATA__", () => JSON.stringify(data)).replace("__COLOR_LIB__", () => lib));
}

// ---------- dist/palette.json (Catppuccin palette schema, plus jam and onjam) ----------
const entry = (name, hex, extra) => {
  const [r, g, b] = rgb(hex).map((v) => Math.round(v * 255)); const [h, s, l] = toHsl(hex); const [L, C, H] = toOklch(hex);
  return { name, ...extra, hex, rgb: { r, g, b }, hsl: { h, s, l }, oklch: { l: L, c: C, h: ((H * 180) / Math.PI + 360) % 360 } };
};
const order = [...P.accentOrder, ...P.neutralOrder];
const ansiNames = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
out("dist/palette.json", {
  version: P.version,
  ...Object.fromEntries(ctxs.map((x, fi) => [x.id, {
    name: x.f.name, emoji: x.f.emoji, order: fi, dark: x.f.dark,
    colors: Object.fromEntries(order.map((k, i) => [k, entry(k[0].toUpperCase() + k.slice(1), x.c[k], { order: i, accent: P.accentOrder.includes(k) && !NON_ACCENT.includes(k) })])),
    ansiColors: Object.fromEntries(ansiNames.map((n, i) => { const N = n[0].toUpperCase() + n.slice(1); return [n, {
      name: N, order: i,
      normal: { ...entry(N, x.ansi[i]), code: i },
      bright: { ...entry(`Bright ${N}`, x.ansi[i + 8]), code: i + 8 },
    }]; })),
  }])),
});

// ---------- checks ----------
const syntaxRoles = Object.entries(ROLES.syntax).filter(([k]) => !k.startsWith("$"));
const keyRoles = syntaxRoles.filter(([, r]) => r.key).map(([k]) => k);
let checks = `# Checks\n\nGenerated by \`build.mjs\`. The build fails on any ✗.\n\n## Contrast on \`ui.background\`\n\nEach role's minimum is set in \`src/roles.json\` (4.5 for text you read, 3.0 for structural glue).\n\n`;
checks += `| Role | Min | ${ctxs.map((x) => x.f.name).join(" | ")} |\n|---|---:|${ctxs.map(() => "---:").join("|")}|\n`;
const cRows = [...syntaxRoles.map(([k, r]) => [`syntax.${k}`, r.minContrast ?? 4.5]), ["ui.text", 4.5], ["ui.text.muted", 4.5], ["ui.link", 4.5]];
for (const [role, min] of cRows) {
  checks += `| ${role} | ${min} | ` + ctxs.map((x) => { const v = contrast(x.resolve(role)[0], x.resolve("ui.background")[0]); if (v < min) errors.push(`${x.f.name}: ${role} contrast ${v.toFixed(2)} < ${min}`); return v.toFixed(2) + (v < min ? " ✗" : ""); }).join(" | ") + " |\n";
}
// The same text lands on sidebars, panels, title and status bars in every port, so
// each text role must reach its own minimum on the two pane colours as well.
for (const bgRole of ["ui.pane.secondary", "ui.pane.tertiary"]) {
  checks += `| *on ${bgRole}* | | ${ctxs.map(() => "").join(" | ")} |\n`;
  for (const [role, min] of cRows) {
    checks += `| ${role} on ${bgRole} | ${min} | ` + ctxs.map((x) => { const v = contrast(x.resolve(role)[0], x.resolve(bgRole)[0]); if (v < min) errors.push(`${x.f.name}: ${role} on ${bgRole} contrast ${v.toFixed(2)} < ${min}`); return v.toFixed(2) + (v < min ? " ✗" : ""); }).join(" | ") + " |\n";
  }
}
checks += `| ui.on.fill on ui.fill | 4.5 | ` + ctxs.map((x) => { const v = contrast(x.resolve("ui.on.fill")[0], x.resolve("ui.fill")[0]); if (v < 4.5) errors.push(`${x.f.name}: on.fill contrast ${v.toFixed(2)}`); return v.toFixed(2) + (v < 4.5 ? " ✗" : ""); }).join(" | ") + " |\n";
// Backgrounds that code is drawn on. Syntax colours keep their own foreground on
// these, so each one has to preserve a share of every syntax role's declared minimum.
// A flat number cannot work here: in the light flavours syntax already sits near its
// 4.5 on the plain background, so any tint pushes something under.
for (const [name, r] of Object.entries(roleIndex)) if (r.carriesCode) {
  const share = r.carriesCode;
  checks += `| syntax on ${name} | ${(share * 100).toFixed(0)}% of each role\u2019s own minimum | ` + ctxs.map((x) => {
    const bg = x.resolve(name)[0];
    let worst = Infinity, who = "";
    for (const [k, sr] of syntaxRoles) {
      const need = (sr.minContrast ?? 4.5) * share;
      const v = contrast(x.resolve(`syntax.${k}`)[0], bg);
      if (v / need < worst / (worst === Infinity ? 1 : need)) {}
      if (v < need && (worst === Infinity || v / need < worst)) { worst = v / need; who = k; }
    }
    if (worst !== Infinity) errors.push(`${x.f.name}: syntax.${who} on ${name} is ${(worst * 100).toFixed(0)}% of its minimum`);
    return worst === Infinity ? "ok" : `${who} ${(worst * 100).toFixed(0)}% \u2717`;
  }).join(" | ") + " |\n";
}
// Non-text UI: borders, focus rings, cursors and the accent itself must be visible
// against the background at 3:1 (WCAG 1.4.11), the minimum each role declares.
const uiRows = Object.entries(roleIndex).filter(([n, r]) => n.startsWith("ui.") && r.minContrast).map(([n, r]) => [n, r.minContrast]);
checks += `| *non-text UI on ui.background* | | ${ctxs.map(() => "").join(" | ")} |\n`;
for (const [role, min] of uiRows) {
  checks += `| ${role} | ${min} | ` + ctxs.map((x) => { const v = contrast(x.resolve(role)[0], x.resolve("ui.background")[0]); if (v < min) errors.push(`${x.f.name}: ${role} on ui.background ${v.toFixed(2)} < ${min}`); return v.toFixed(2) + (v < min ? " ✗" : ""); }).join(" | ") + " |\n";
}
for (const [name, r] of Object.entries(roleIndex)) if (r.minContrastWith) {
  const [fg, min] = r.minContrastWith;
  checks += `| ${fg} on ${name} | ${min} | ` + ctxs.map((x) => { const v = contrast(x.resolve(fg)[0], x.resolve(name)[0]); if (v < min) errors.push(`${x.f.name}: ${fg} on ${name} contrast ${v.toFixed(2)} < ${min}`); return v.toFixed(2) + (v < min ? " ✗" : ""); }).join(" | ") + " |\n";
}
checks += `\n## Distinctness of syntax roles\n\nOKLab distance ×100 between every pair of syntax roles (an alias such as deprecated is checked through its target). Calibrated against Catppuccin, whose closest core pair is 5.7 (Frappé). Under 5 fails; under 7 between two key roles is a warning. Closest pairs per flavour:\n\n`;
for (const x of ctxs) {
  const pairs = [];
  // Every syntax role, not only the key ones: a role that cannot be told from its
  // neighbour is a role in name only.
  // A role whose value is another syntax role is an alias: the distinction is a
  // font style (strikethrough, italics), so it is checked through its target.
  const all = syntaxRoles.filter(([, r]) => !(typeof r.value === "string" && r.value.startsWith("syntax."))).map(([k]) => k);
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++)
    pairs.push([all[i], all[j], deltaE(x.resolve(`syntax.${all[i]}`)[0], x.resolve(`syntax.${all[j]}`)[0])]);
  pairs.sort((a, b) => a[2] - b[2]);
  for (const [a, b, d] of pairs) { if (d < 5) errors.push(`${x.f.name}: syntax.${a} and syntax.${b} too close (${d.toFixed(1)})`); else if (d < 7 && keyRoles.includes(a) && keyRoles.includes(b)) warnings.push(`${x.f.name}: syntax.${a} / syntax.${b} ${d.toFixed(1)}`); }
  checks += `- **${x.f.name}:** ` + pairs.slice(0, 4).map(([a, b, d]) => `${a}/${b} ${d.toFixed(1)}${d < 5 ? " ✗" : d < 7 ? " ~" : ""}`).join(", ") + "\n";
}
out("docs/CHECKS.md", checks);

// ---------- docs/ROLES.md (roles, values, Catppuccin comparison) ----------
let rolesMd = `# Roles\n\nGenerated from \`src/roles.json\`. Every port references these names.\n\n| Role | Value | ${ctxs.map((x) => x.f.name).join(" | ")} | Catppuccin |\n|---|---|${ctxs.map(() => "---").join("|")}|---|\n`;
for (const [name, r] of Object.entries(roleIndex)) {
  const v = typeof r.value === "object" ? Object.entries(r.value).map(([k, x]) => `${k}: ${x}`).join(", ") : r.value;
  rolesMd += `| \`${name}\` | \`${v}\` | ${ctxs.map((x) => `\`${x.resolve(name)[0]}\``).join(" | ")} | ${r.catppuccin === "=" ? "same" : r.catppuccin || ""} |\n`;
}
rolesMd += `\n## Deviations from Catppuccin\n\n| Role | Darkberry | Catppuccin | Why |\n|---|---|---|---|\n`;
for (const [name, r] of Object.entries(roleIndex)) if (r.catppuccin && r.catppuccin !== "=")
  rolesMd += `| \`${name}\` | \`${typeof r.value === "object" ? JSON.stringify(r.value) : r.value}\` | ${r.catppuccin} | ${whyOf(r)} |\n`;
rolesMd += `\nAligned with Catppuccin: ANSI mapping and bright formula, all background, text and status roles, cursor text, inactive borders, marks, and extended terminal colours 16 and 17.\n`;
out("docs/ROLES.md", rolesMd);

// ---------- docs/USAGE.md (blast radius of each palette colour) ----------
let usageMd = `# Usage\n\nGenerated by \`build.mjs\`. Before changing a palette colour, check who uses it. Counts are template keys per port, measured on ${usageRef.f.name}; ANSI black and white and cursor text swap neutrals in the light flavour.\n\n| Palette colour | Through roles | kitty | Ghostty | VS Code | Firefox | Obsidian | KDE | Konsole | Nimbalyst | micro | Kate | Chrome | Notepad++ | GTK | darktable | GIMP | starship | borders | lsd | LS_COLORS | Tinted8 | Base24 | btop |\n|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`;
for (const k of order) {
  const u = usage[k];
  usageMd += `| \`${k}\` | ${u ? [...u.roles].filter((r) => !r.startsWith("ansi")).map((r) => `\`${r}\``).join(", ") || "direct only" : "unused"} | ${["kitty", "ghostty", "vscode", "firefox", "obsidian", "kde", "konsole", "nimbalyst", "micro", "kate", "chrome", "notepadpp", "gtk", "darktable", "gimp", "starship", "borders", "lsd", "ls-colors", "tinted8", "base24", "btop"].map((p) => u?.ports[p] || "").join(" | ")} |\n`;
}
usageMd += `\nANSI colours (\`ansi.0\` to \`ansi.15\`) come from the palette via \`roles.json\` → \`ansi\`, the same way for every terminal.\n`;
out("docs/USAGE.md", usageMd);

// ---------- docs/specimen.html (all ports, all flavours, one page) ----------
const card = (x) => {
  const R = (e) => x.resolve(e)[0], a = x.ansi, s = (role, t, st = "") => `<span style="color:${R(role)};${st}">${t}</span>`;
  const code = [
    s("syntax.comment", "// every role in one place", "font-style:italic"),
    `${s("syntax.keyword", "import")} ${s("syntax.punctuation", "*")} ${s("syntax.keyword", "as")} ${s("syntax.namespace", "Orchard")} ${s("syntax.keyword", "from")} ${s("syntax.string", '"orchard"')}${s("syntax.punctuation", ";")}`,
    `${s("syntax.keyword", "export function")} ${s("syntax.function", "sealJar")}${s("syntax.punctuation", "(")}${s("syntax.variable", "jam")}${s("syntax.punctuation", ":")} ${s("syntax.type", "Preserve")}${s("syntax.punctuation", "):")} ${s("syntax.type", "Jar")} ${s("syntax.punctuation", "{")}`,
    `  ${s("syntax.keyword", "const")} ${s("syntax.variable", "lid")} ${s("syntax.operator", "=")} ${s("syntax.namespace", "Orchard")}${s("syntax.punctuation", ".")}${s("syntax.function", "findLid")}${s("syntax.punctuation", "(")}${s("syntax.variable", "jam")}${s("syntax.punctuation", ".")}${s("syntax.property", "size")}${s("syntax.punctuation", ");")}`,
    `  ${s("syntax.keyword", "if")} ${s("syntax.punctuation", "(!")}${s("syntax.variable", "lid")}${s("syntax.punctuation", ")")} ${s("syntax.error", "throw")} ${s("syntax.type", "PantryError")}${s("syntax.punctuation", "(")}${s("syntax.string", '"no lid"')}${s("syntax.punctuation", ");")}`,
    `  ${s("syntax.keyword", "return")} ${s("syntax.variable", "jam")}${s("syntax.punctuation", ".")}${s("syntax.function", "replace")}${s("syntax.punctuation", "(")}${s("syntax.regex", "/ber+y/g")}${s("syntax.punctuation", ",")} ${s("syntax.constant", "MAX")}${s("syntax.punctuation", ",")} ${s("syntax.number", "0.72")}${s("syntax.punctuation", ");")}`,
    `${s("syntax.punctuation", "}")}  ${s("syntax.link", "https://jam.dev")}`,
  ].join("\n");
  const ansiRow = (from) => a.slice(from, from + 8).map((c) => `<i style="background:${c}"></i>`).join("");
  return `<section style="background:${R("ui.pane.tertiary")};color:${R("ui.text")}">
<h2>${x.f.emoji} ${P.name} ${x.f.name}</h2>
<div class="ff" style="background:${R("ui.pane.tertiary")}"><span class="tab" style="background:${R("ui.background")};border-top:2px solid ${R("ui.accent")}">Jam recipes</span><span class="tab" style="color:${R("ui.text.muted")}">Pantry</span></div>
<div class="bar" style="background:${R("ui.background")}"><span class="url" style="background:${R("surface0")};border:1px solid ${R("ui.accent")};color:${R("ui.text")}">https://jam.dev/<span style="background:${R("ui.selection")}">recipes</span></span><span class="badge" style="background:${R("ui.fill")};color:${R("ui.on.fill")}">3</span></div>
<pre class="ed" style="background:${R("ui.background")};color:${R("syntax.text")}">${code}<span class="cur" style="background:${R("ui.cursor")}"> </span></pre>
<pre class="term" style="background:${R("ui.background")};color:${R("ui.text")};border:1px solid ${R("ui.border.active")}"><span style="color:${a[2]}">➜</span> <span style="color:${a[4]}">~/jam</span> <span style="color:${a[5]}">git:(main)</span> ls\n<span style="color:${a[12]}">recipes</span>  <span style="color:${a[10]}">seal.sh</span>  notes.md  <span style="color:${a[1]}">broken.lnk</span>  <span style="color:${a[3]}">todo</span>\n<span style="color:${R("ui.link")};text-decoration:underline">https://jam.dev</span>  <span style="background:${R("ui.selection")}">selected text</span>\n<span class="ansi">${ansiRow(0)}</span>\n<span class="ansi">${ansiRow(8)}</span></pre>
</section>`;
};
out("docs/specimen.html", `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${P.name} specimen</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#111}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(520px,1fr))}section{padding:18px}h2{font-size:15px;font-weight:500;margin:0 0 10px}
.ff{display:flex;gap:2px;padding:6px 6px 0}.tab{padding:6px 14px;font-size:12px;border-radius:6px 6px 0 0}.bar{display:flex;gap:8px;align-items:center;padding:6px}.url{flex:1;padding:4px 10px;border-radius:6px;font-size:12px}.badge{font-size:11px;padding:2px 7px;border-radius:9px}
pre{margin:10px 0 0;padding:10px 12px;border-radius:8px;font:12.5px/1.6 ui-monospace,monospace;overflow-x:auto}.cur{display:inline-block;width:.6em}.ansi{display:flex;gap:3px;margin-top:4px}.ansi i{display:block;width:22px;height:14px;border-radius:3px}</style></head>
<body><main>${ctxs.map(card).join("\n")}</main></body></html>\n`);

// ---------- result ----------
for (const w of new Set(warnings)) console.warn("warning:", w);
const uniq = [...new Set(errors)];
if (uniq.length) { for (const e of uniq) console.error("error:", e); console.error(`Build failed with ${uniq.length} error(s).`); process.exit(1); }
console.log(CHECK_ONLY ? `Checked ${path.basename(argPalette || "src/palette.json", ".json")} (${ctxs.length} flavours): 0 errors, ${warnings.length} warning(s). Nothing written.` : `Built ${ctxs.length} flavours. ${warnings.length} warning(s). See docs/CHECKS.md, docs/ROLES.md, docs/USAGE.md, docs/specimen.html.`);
