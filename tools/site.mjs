// Builds the GitHub Pages site into site/ from the palette, the tints and the roles.
//   node build.mjs && node tools/site.mjs
// The page wears the theme: every colour on it is resolved from roles.json, so the site
// can't drift from what the ports ship.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { indexRoles, flavourContext } from "../lib/resolve.mjs";
import { toOklch } from "../lib/color.mjs";
import { loadTints } from "../lib/tints.mjs";

// CSS oklch(): lightness as a percentage, chroma to three places, hue in degrees.
const oklchCss = (hex) => { const [L, C, h] = toOklch(hex); const H = C < 0.0005 ? 0 : ((h * 180) / Math.PI + 360) % 360; return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`; };

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const json = (p) => JSON.parse(read(p));

const P = json("src/palette.json");
const ROLES = json("src/roles.json");
const CONFIG = json("src/site/config.json");
const roleIndex = indexRoles(ROLES);
const ORDER = [...P.accentOrder, ...P.neutralOrder];

// In src/tints.json order, so the site's tint picker matches the README and the build.
const TINTS = loadTints();

const data = {
  tree: `${P.repository.replace(/\/$/, "")}/tree/${CONFIG.branch}`, order: ORDER,
  flavours: Object.fromEntries(Object.entries(P.flavours).map(([id, f]) => [id, { name: f.name, emoji: f.emoji, dark: f.dark }])),
  tints: {},
};
for (const { id, name, note, pal } of TINTS) {
  const t = { name, note, colors: {}, roles: {}, oklch: {} };
  for (const [fid, f] of Object.entries(pal.flavours)) {
    const ctx = flavourContext(fid, f, ROLES, roleIndex);
    t.colors[fid] = ORDER.map((k) => f.colors[k]);
    t.oklch[fid] = t.colors[fid].map(oklchCss);
    t.roles[fid] = Object.fromEntries(Object.keys(roleIndex).map((r) => [r, ctx.resolve(r)[0]]));
  }
  data.tints[id] = t;
}

// The port registry, grouped by each port's first category in the order of src/categories.json,
// the same grouping as the list in README.md. Screenshots and install steps stay in each port's
// README; the Ports page lists only the name, the listing where the port is published, and the
// folder in the repository.
const REG = json("src/ports.json"), CATS = json("src/categories.json");
data.ports = CATS.map((c) => [c.name, REG.ports.filter((p) => p.categories[0] === c.key).map((p) => ({ key: p.key, name: p.name, url: p.url, listing: p.listing || null }))]).filter(([, ps]) => ps.length);

// The wallpapers page is built from the file names in wallpapers/:
//   darkberry_wallpaper_<mark>-<scene>_4k_<16x9|16x10>.png
// One card per <mark>-<scene>, grouped by mark, with a download link per aspect ratio. A card's
// preview is wallpapers/previews/<mark>-<scene>.webp, kept in git so the Pages build needs no
// image tools. A missing preview is made here with ImageMagick from the 16x9 file. To remake
// one after its wallpaper changes, delete it and build the site again.
// Each mark's section heading and the words its alt text uses, in the order the page shows them.
// A mark missing here still builds, under its raw name.
const MARKS = { d: { heading: "The D", with: "with the D" }, logo: { heading: "The logo", with: "with the logo" }, clean: { heading: "Clean", with: "with no mark" } };
const markOf = (m) => MARKS[m] || { heading: m, with: `with ${m}` };
const RATIOS = ["16x9", "16x10"];
const walls = new Map();
for (const f of fs.readdirSync(path.join(root, "wallpapers")).sort()) {
  const m = f.match(/^darkberry_wallpaper_([a-z0-9]+)-([a-z0-9]+)_4k_(16x9|16x10)\.png$/);
  if (!m) continue;
  const [, mark, scene, ratio] = m, id = `${mark}-${scene}`;
  if (!walls.has(id)) walls.set(id, { id, mark, name: scene[0].toUpperCase() + scene.slice(1), files: {} });
  walls.get(id).files[ratio] = f;
}
for (const w of walls.values()) {
  const preview = path.join(root, `wallpapers/previews/${w.id}.webp`), from = w.files["16x9"] || w.files["16x10"];
  if (fs.existsSync(preview)) continue;
  fs.mkdirSync(path.dirname(preview), { recursive: true });
  const args = [path.join(root, "wallpapers", from), "-resize", "1200x", "-quality", "86", preview];
  try { execFileSync("magick", args, { stdio: "ignore" }); }
  catch (e) { try { execFileSync("convert", args, { stdio: "ignore" }); } catch (e2) { console.error(`Missing wallpapers/previews/${w.id}.webp, and ImageMagick is not here to make it.`); process.exit(1); } }
  console.log(`Made wallpapers/previews/${w.id}.webp`);
}
const wallCard = (w) => {
  const mark = markOf(w.mark).with;
  const links = RATIOS.filter((r) => w.files[r]).map((r) => `<a href="wallpapers/${w.files[r]}" download aria-label="Download ${w.name} ${mark}, ${r.replace("x", ":")}">${r.replace("x", ":")}</a>`).join("");
  return `<li><img src="wallpapers/previews/${w.id}.webp" alt="${w.name} wallpaper ${mark}" width="1200" height="675" loading="lazy"><div class="cap"><span class="name">${w.name}</span><span class="links"><span>download</span>${links}</span></div></li>`;
};
const markOrder = (m) => { const i = Object.keys(MARKS).indexOf(m); return i < 0 ? Infinity : i; };
const WALLPAPERS = [...new Set([...walls.values()].map((w) => w.mark))].sort((a, b) => markOrder(a) - markOrder(b)).map((mark) => `<h3>${markOf(mark).heading}</h3><ul>` + [...walls.values()].filter((w) => w.mark === mark).map(wallCard).join("") + "</ul>").join("\n");

// The page's first paint, before the script runs, is Darkberry Blackwater.
const first = data.tints.darkberry, ROOT = [
  ...Object.entries(first.roles.blackwater).map(([r, v]) => `--${r.replace(/\./g, "-")}:${v}`),
  ...ORDER.map((k, i) => `--c-${k}:${first.colors.blackwater[i]}`),
].map((l) => "  " + l + ";").join("\n");

// The header flourishes and the moon ornament are Inkscape files in assets/misc. Each is inlined
// without Inkscape's wrapper, and its fill becomes currentColor, so the CSS colours it per flavour.
const inlineSvg = (file, cls) => {
  const svg = read(`assets/misc/${file}.svg`);
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const [, , w, h] = viewBox.split(/\s+/);
  const body = svg.slice(svg.indexOf("<g"), svg.lastIndexOf("</svg>"))
    .replace(/\s(?:inkscape|sodipodi):[\w-]+="[^"]*"/g, "")
    .replace(/\s(?:id|class)="[^"]*"/g, "")
    .replace(/fill:#[0-9a-f]{3,8}/gi, "fill:currentColor")
    .replace(/\s+/g, " ").trim();
  return `<svg class="${cls}" viewBox="${viewBox}" width="${w}" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`;
};

const SNIPPETS = {
  FLOURISH_LEFT: inlineSvg("flourish-top-left", "fl fl-top-left"),
  FLOURISH_RIGHT: inlineSvg("flourish-top-right", "fl fl-top-right"),
  PICKERS: read("src/site/snippets/pickers.html").trim(),
  PICK_FLAVOUR: read("src/site/snippets/pick-flavour.html").trim(),
  CODE: read("src/site/snippets/code.html").trim(),
  MOON: inlineSvg("moon", "fl fl-moon"),
  LINE_LEFT: inlineSvg("line-left", "line"),
  LINE_RIGHT: inlineSvg("line-right", "line"),
  CORE: read("src/site/core.js").trim(),
  WALLPAPERS,
  ROOT,
  DATA: JSON.stringify(data),
};
const fill = (html, extra = {}) => {
  const all = { ...SNIPPETS, ...extra };
  for (let i = 0; i < 4; i++) html = html.replace(/__([A-Z_]+)__/g, (m, k) => (k in all ? all[k] : m));
  return html;
};

// Each page: its file in src/site/pages, its nav label, its <title> and its meta description.
const PAGES = [
  ["index", "Home", "Darkberry, a bog-witch berry theme", "Darkberry is a berry dark colour theme in four flavours."],
  ["palette", "Palette", "The Darkberry palette", "Every Darkberry colour in hex, RGB, HSL and OKLCH, for each flavour and tint."],
  ["tints", "Tints", "Darkberry tints", "Five Darkberry tints, each steeping the backgrounds in a different berry."],
  ["ports", "Ports", "Darkberry ports", "Darkberry for terminals, editors, browsers and desktops: where each port is published, and where its files are."],
  ["wallpapers", "Wallpapers", "Darkberry wallpapers", "Darkberry wallpapers in 4K, each in 16:9 and 16:10."],
];
const NAV = (current) => PAGES.map(([id, label]) => `<a href="${id}.html"${id === current ? ' aria-current="page"' : ""}>${label}</a>`).join("");

const out = path.join(root, "site");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// The CSS inlined into every page: base.css (shared by every page), then page.css (one block per page).
SNIPPETS.CSS = `${read("src/site/base.css").trim()}\n${read("src/site/page.css").trim()}`;
// Known at build time, so the header and footer links work without JavaScript.
SNIPPETS.REPO = P.repository.replace(/\/$/, "");
SNIPPETS.VERSION = P.version;
const layout = read("src/site/layout.html");
for (const [id, , title, desc] of PAGES) {
  const [body, script = ""] = read(`src/site/pages/${id}.html`).split("<!--script-->");
  fs.writeFileSync(path.join(out, `${id}.html`), fill(layout, { TITLE: title, DESC: desc, NAV: NAV(id), BODY: body.trim(), SCRIPT: script.trim() }));
}
fs.writeFileSync(path.join(out, ".nojekyll"), "");
// The favicon is the Darkberry logo (assets/logos/darkberry-logo.svg) exported from Inkscape as a
// plain SVG with the "D" converted to a path, since a favicon cannot load the web font. The PNGs
// are the Safari fallback (96px) and the iOS home-screen icon (180px on the Mire base).
const COPIES = [
  ["docs/specimen.html", "specimen.html"],
  ["palette.json", "palette.json"],
  ["src/site/icons/favicon.svg", "favicon.svg"],
  ["src/site/icons/favicon.png", "favicon.png"],
  ["src/site/icons/apple-touch-icon.png", "apple-touch-icon.png"],
];
for (const [from, to] of COPIES) {
  if (!fs.existsSync(path.join(root, from))) { console.error(`Missing ${from}. Run node build.mjs first.`); process.exit(1); }
  fs.copyFileSync(path.join(root, from), path.join(out, to));
}
// The wallpapers and their previews are served from the site itself: a download link only
// saves the file when it is on the page's own origin.
fs.mkdirSync(path.join(out, "wallpapers/previews"), { recursive: true });
for (const w of walls.values())
  for (const f of [...Object.values(w.files), `previews/${w.id}.webp`]) fs.copyFileSync(path.join(root, "wallpapers", f), path.join(out, "wallpapers", f), fs.constants.COPYFILE_FICLONE);
console.log(`Site built in site/ (${TINTS.length} palettes × ${Object.keys(P.flavours).length} flavours, ${REG.ports.length} ports, ${walls.size} wallpapers).`);
