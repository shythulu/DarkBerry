// Builds the GitHub Pages site into site/ from the palette, the tints and the roles.
//   node build.mjs && node tools/site.mjs
// The page wears the theme: every colour on it is resolved from roles.json, so the site
// can't drift from what the ports ship.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { indexRoles, flavourContext } from "../lib/resolve.mjs";
import { toOklch } from "../lib/color.mjs";

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

const TINTS = json("src/tints.json"); delete TINTS.$comment;
const palettes = [["darkberry", P]];
for (const f of fs.readdirSync(path.join(root, "src/variants")).filter((f) => f.endsWith(".json")).sort())
  palettes.push([f.replace(".json", ""), json(`src/variants/${f}`)]);

const data = {
  name: P.name, version: P.version, config: CONFIG, order: ORDER, accents: P.accentOrder.filter((k) => !["jam", "onjam", "tint"].includes(k)),
  flavours: Object.fromEntries(Object.entries(P.flavours).map(([id, f]) => [id, { name: f.name, emoji: f.emoji, dark: f.dark }])),
  tints: {},
};
for (const [id, pal] of palettes) {
  const t = { name: TINTS[id]?.name || id, note: TINTS[id]?.note || "", colors: {}, roles: {}, ansi: {}, oklch: {} };
  for (const [fid, f] of Object.entries(pal.flavours)) {
    const ctx = flavourContext(fid, f, ROLES, roleIndex);
    t.colors[fid] = ORDER.map((k) => f.colors[k]);
    t.oklch[fid] = t.colors[fid].map(oklchCss);
    t.roles[fid] = Object.fromEntries(Object.keys(roleIndex).map((r) => [r, ctx.resolve(r)[0]]));
    t.ansi[fid] = ctx.ansi;
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
const MARKS = { d: "The D", logo: "The logo" }, RATIOS = ["16x9", "16x10"];
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
  const mark = (MARKS[w.mark] || w.mark).replace(/^The /, "the ");
  const links = RATIOS.filter((r) => w.files[r]).map((r) => `<a href="wallpapers/${w.files[r]}" download aria-label="Download ${w.name} with ${mark}, ${r.replace("x", ":")}">${r.replace("x", ":")}</a>`).join("");
  return `<li><img src="wallpapers/previews/${w.id}.webp" alt="${w.name} wallpaper with ${mark}" width="1200" height="675" loading="lazy"><div class="cap"><span class="name">${w.name}</span><span class="links"><span>download</span>${links}</span></div></li>`;
};
const WALLPAPERS = [...new Set([...walls.values()].map((w) => w.mark))].map((mark) => `<h3>${MARKS[mark] || mark}</h3><ul>` + [...walls.values()].filter((w) => w.mark === mark).map(wallCard).join("") + "</ul>").join("\n");

// The page's first paint, before the script runs, is Darkberry Blackwater.
const first = data.tints.darkberry, ROOT = [
  ...Object.entries(first.roles.blackwater).map(([r, v]) => `--${r.replace(/\./g, "-")}:${v}`),
  ...ORDER.map((k, i) => `--c-${k}:${first.colors.blackwater[i]}`),
].map((l) => "  " + l + ";").join("\n");

const SNIPPETS = {
  PICKERS: read("src/site/snippets/pickers.html").trim(),
  CODE: read("src/site/snippets/code.html").trim(),
  ORIGIN: read("src/site/snippets/origin.html").trim(),
  ORN: read("src/site/snippets/orn.svg").trim(),
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

const PAGES = [
  ["index", "Darkberry, a bog-witch berry theme", "Darkberry is a berry dark colour theme in four flavours."],
  ["palette", "The Darkberry palette", "Every Darkberry colour in hex, RGB, HSL and OKLCH, for each flavour and tint."],
  ["ports", "Darkberry ports", "Darkberry for terminals, editors, browsers and desktops: where each port is published, and where its files are."],
  ["wallpapers", "Darkberry wallpapers", "Darkberry wallpapers in 4K, each in 16:9 and 16:10."],
];
const NAV = (current) => [["index", "Home"], ["palette", "Palette"], ["ports", "Ports"], ["wallpapers", "Wallpapers"]].map(([id, label]) => `<a href="${id}.html"${id === current ? ' aria-current="page"' : ""}>${label}</a>`).join("");

const out = path.join(root, "site");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, ".tw"), { recursive: true });

// Tailwind. src/site/tailwind.css is the input: its __THEME__ becomes one --color-* per role and
// palette key (generated here, so a new role in roles.json is a utility with no hand edit), and
// base.css + page.css are appended inside @layer base. The CLI scans src/site for class names and
// writes the CSS that is inlined into every page. Run npm ci once to get the CLI.
const cli = path.join(root, "node_modules/.bin/tailwindcss");
if (!fs.existsSync(cli)) { console.error("Tailwind CLI not found. Run npm ci first."); process.exit(1); }
const THEME = [
  ...Object.keys(roleIndex).map((r) => r.replace(/\./g, "-")).map((r) => `  --color-${r}: var(--${r});`),
  ...ORDER.map((k) => `  --color-${k}: var(--c-${k});`),
].join("\n");
const input = read("src/site/tailwind.css").replaceAll("__THEME__", THEME) + `\n@layer base {\n${read("src/site/base.css")}\n${read("src/site/page.css")}\n}\n`;
fs.writeFileSync(path.join(out, ".tw/input.css"), input);
execFileSync(cli, ["-i", path.join(out, ".tw/input.css"), "-o", path.join(out, ".tw/output.css")], { stdio: ["ignore", "inherit", "inherit"] });
SNIPPETS.CSS = fs.readFileSync(path.join(out, ".tw/output.css"), "utf8").trim();
const layout = read("src/site/layout.html");
for (const [id, title, desc] of PAGES) {
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
console.log(`Site built in site/ (${palettes.length} palettes × ${Object.keys(P.flavours).length} flavours, ${REG.ports.length} ports, ${walls.size} wallpapers).`);
