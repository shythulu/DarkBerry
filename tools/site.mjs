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
  const t = { name: TINTS[id]?.name || id, emoji: TINTS[id]?.emoji || "", note: TINTS[id]?.note || "", colors: {}, roles: {}, ansi: {}, oklch: {} };
  for (const [fid, f] of Object.entries(pal.flavours)) {
    const ctx = flavourContext(fid, f, ROLES, roleIndex);
    t.colors[fid] = ORDER.map((k) => f.colors[k]);
    t.oklch[fid] = t.colors[fid].map(oklchCss);
    t.roles[fid] = Object.fromEntries(Object.keys(roleIndex).map((r) => [r, ctx.resolve(r)[0]]));
    t.ansi[fid] = ctx.ansi;
  }
  data.tints[id] = t;
}

// Which ports carry screenshots, per tint: ports/<id>/assets/<flavour>.webp for Darkberry itself,
// ports/<id>/<tint>/assets/<flavour>.webp for the tints. The Ports page only shows a picture it can find.
data.ports = {};
for (const id of fs.readdirSync(path.join(root, "ports")).sort()) {
  const has = (dir) => Object.keys(P.flavours).every((f) => fs.existsSync(path.join(root, "ports", id, dir, "assets", `${f}.webp`)));
  const shots = palettes.map(([t]) => t).filter((t) => has(t === "darkberry" ? "" : t));
  if (shots.length) data.ports[id] = shots;
}

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
  ["ports", "Darkberry ports", "Darkberry for terminals, editors, browsers and desktops, with install notes for each."],
];
const NAV = (current) => [["index", "Home"], ["palette", "Palette"], ["ports", "Ports"]].map(([id, label]) => `<a href="${id}.html"${id === current ? ' aria-current="page"' : ""}>${label}</a>`).join("");

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
for (const [from, to] of [["docs/specimen.html", "specimen.html"], ["dist/palette.json", "palette.json"]]) {
  if (!fs.existsSync(path.join(root, from))) { console.error(`Missing ${from}. Run node build.mjs first.`); process.exit(1); }
  fs.copyFileSync(path.join(root, from), path.join(out, to));
}
console.log(`Site built in site/ (${palettes.length} palettes × ${Object.keys(P.flavours).length} flavours, ${Object.keys(data.ports).length} ports with screenshots).`);
