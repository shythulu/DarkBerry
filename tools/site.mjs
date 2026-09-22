// Builds the GitHub Pages site into site/ from the palette, the tints and the roles.
//   node build.mjs && node tools/site.mjs
// The page wears the theme: every colour on it is resolved from roles.json, so the site
// can't drift from what the ports ship.
import fs from "node:fs";
import path from "node:path";
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

const TINT_NOTES = {
  darkberry: "The default. Wine-dark plum, rooted in Dark Purple 2073-10.",
  lingonberry: "Backgrounds steeped in raspberry-red.",
  cloudberry: "Backgrounds toasted toward ripe peach.",
  crowberry: "Backgrounds cooled to inky violet.",
  blueberry: "Backgrounds cooled to dusty slate blue.",
};
const palettes = [["darkberry", P]];
for (const f of fs.readdirSync(path.join(root, "src/variants")).filter((f) => f.endsWith(".json")).sort())
  palettes.push([f.replace(".json", ""), json(`src/variants/${f}`)]);

const data = {
  name: P.name, version: P.version, config: CONFIG, order: ORDER, accents: P.accentOrder.filter((k) => !["jam", "onjam", "tint"].includes(k)),
  flavours: Object.fromEntries(Object.entries(P.flavours).map(([id, f]) => [id, { name: f.name, emoji: f.emoji, dark: f.dark }])),
  tints: {},
};
for (const [id, pal] of palettes) {
  const t = { name: id[0].toUpperCase() + id.slice(1), note: TINT_NOTES[id] || "", colors: {}, roles: {}, ansi: {}, oklch: {} };
  for (const [fid, f] of Object.entries(pal.flavours)) {
    const ctx = flavourContext(fid, f, ROLES, roleIndex);
    t.colors[fid] = ORDER.map((k) => f.colors[k]);
    t.oklch[fid] = t.colors[fid].map(oklchCss);
    t.roles[fid] = Object.fromEntries(Object.keys(roleIndex).map((r) => [r, ctx.resolve(r)[0]]));
    t.ansi[fid] = ctx.ansi;
  }
  data.tints[id] = t;
}

const out = path.join(root, "site");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), read("src/site/index.html").replace("__DATA__", () => JSON.stringify(data)));
fs.writeFileSync(path.join(out, ".nojekyll"), "");
for (const [from, to] of [["docs/studio.html", "studio.html"], ["docs/specimen.html", "specimen.html"], ["dist/palette.json", "palette.json"]]) {
  if (!fs.existsSync(path.join(root, from))) { console.error(`Missing ${from}. Run node build.mjs first.`); process.exit(1); }
  fs.copyFileSync(path.join(root, from), path.join(out, to));
}
console.log(`Site built in site/ (${palettes.length} palettes × ${Object.keys(P.flavours).length} flavours).`);
