// Draws every Darkberry logo from one editable source.
//   node tools/logo.mjs [source.svg] [outdir]
//   -> <outdir>/<edition>-logo.{svg,png} and <edition>-logo-words.{svg,png} for every edition in src/tints.json
// The source (assets/logos/source/darkberry-logo.svg) is drawn in Mire, with the letter as live
// text (id text120) in Manufacturing Consent. Each edition gets its own initial in that letter's
// place, centred where the D sits, and the -words logo adds the edition's name under it; every
// name is set at one size, chosen so the longest fits. A tint's Mire neutrals (crust, mantle,
// surface2, overlay2) and tint swap to the tint's own Mire values. Every other colour keeps its
// OKLCH lightness and chroma and turns by the same angle the tint turns Mire's neutrals, so the
// berries follow the tint. Greys stay as they are.
// Needs Inkscape and the Manufacturing Consent font installed: Inkscape measures the glyphs and
// then converts all text to paths, since READMEs show the logo through <img>, which cannot load
// a web font.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { toOklch, fromOklch } from "../lib/color.mjs";

const src = process.argv[2] || "assets/logos/source/darkberry-logo.svg", out = process.argv[3] || "assets/logos";
const source = fs.readFileSync(src, "utf8");
const tints = JSON.parse(fs.readFileSync("src/tints.json", "utf8"));
const mireOf = (t) => JSON.parse(fs.readFileSync(t === "darkberry" ? "src/palette.json" : `src/variants/${t}.json`, "utf8")).flavours.mire.colors;
const SWAP = ["crust", "mantle", "surface2", "overlay2", "tint"];
const base = mireOf("darkberry"), hue = (h) => toOklch(h)[2];
const editions = Object.keys(tints).filter((k) => k[0] !== "$").map((id) => ({ id, name: tints[id].name, letter: tints[id].name[0] }));

// The name under the mark: centred on the page, its lowest point BOTTOM px from the top, the
// longest name NAME_W px wide. Spacing and stroke scale with the size, as in the drawn letter.
const PAGE = 1200, NAME_W = 1085, BOTTOM = 1192, REF = 240;
const nameStyle = (size, fill, stroke) => `font-size:${size}px;line-height:1;font-family:'Manufacturing Consent';-inkscape-font-specification:'Manufacturing Consent';letter-spacing:${(size * 0.011406).toFixed(4)}px;fill:${fill};fill-opacity:1;stroke:${stroke};stroke-width:${(size * 0.06809).toFixed(4)};stroke-linecap:square;stroke-linejoin:round;stroke-opacity:1;paint-order:markers stroke fill`;

const LETTER = source.match(/<text\b[^>]*id="text120"[\s\S]*?<\/text>/)?.[0];
if (!LETTER || !/>D<\/tspan>/.test(LETTER)) { console.error(`${src} needs the letter as live text: <text id="text120"> holding "D".`); process.exit(1); }
const X0 = Number(LETTER.match(/\bx="([\d.-]+)"/)[1]);
const [, FILL, STROKE] = LETTER.match(/fill:(#[0-9a-f]{6});[\s\S]*?stroke:(#[0-9a-f]{6})/i);
const letterAt = (ch, x, id) => LETTER.replaceAll(`x="${X0}"`, `x="${x}"`).replace(/>D<\/tspan>/, `>${ch}</tspan>`).replace(/id="(text|tspan)120"/g, (_, k) => `id="${id ? `${id}-${k}` : `${k}120`}"`);
const nameText = (name, x, y, size, id) => `<text xml:space="preserve" id="${id}" x="${x}" y="${y}" style="${nameStyle(size, FILL, STROKE)}">${name}</text>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "darkberry-logo-"));
const inkscape = (...args) => execFileSync("inkscape", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

// Measure: every initial, the D moved 1000 units (to learn the letter group's scale), and every
// name at REF px from the origin, all in one document.
const probes = [...new Set(editions.map((e) => e.letter))].map((ch) => letterAt(ch, X0, `m-${ch}`)).join("") + letterAt("D", X0 + 1000, "m-shift");
const names = editions.map((e) => nameText(e.name, 0, 0, REF, `m-name-${e.id}`)).join("");
fs.writeFileSync(path.join(tmp, "measure.svg"), source.replace(LETTER, LETTER + probes).replace(/<\/svg>\s*$/, `${names}</svg>`));
const box = Object.fromEntries(inkscape("--query-all", path.join(tmp, "measure.svg")).trim().split("\n").map((l) => { const [id, ...n] = l.split(","); return [id, n.map(Number)]; }));
const centre = (id) => box[id][0] + box[id][2] / 2;
const scale = (centre("m-shift-text") - centre("text120")) / 1000;
const size = REF * Math.min(...editions.map((e) => NAME_W / box[`m-name-${e.id}`][2]));

const recolourer = (t) => {
  if (t === "darkberry") return (h) => h;
  const mire = mireOf(t), turn = hue(mire.surface2) - hue(base.surface2), map = new Map();
  for (const k of SWAP) map.set(base[k], mire[k]);
  return (h) => {
    h = h.toLowerCase();
    if (!map.has(h)) { const [L, C, H] = toOklch(h); map.set(h, C < 0.01 ? h : fromOklch(L, C, H + turn)); }
    return map.get(h);
  };
};

fs.mkdirSync(out, { recursive: true });
for (const e of editions) {
  const x = +(X0 + (centre("text120") - centre(`m-${e.letter}-text`)) / scale).toFixed(4), recolour = recolourer(e.id);
  const [nx, ny, nw, nh] = box[`m-name-${e.id}`].map((v) => v * size / REF);
  const name = nameText(e.name, +(PAGE / 2 - nx - nw / 2).toFixed(4), +(BOTTOM - ny - nh).toFixed(4), +size.toFixed(4), "name");
  for (const words of [false, true]) {
    const file = `${e.id}-logo${words ? "-words" : ""}`;
    let svg = source.replace(LETTER, letterAt(e.letter, x));
    if (words) svg = svg.replace(/<\/svg>\s*$/, `${name}</svg>\n`);
    svg = svg.replace(/#[0-9a-fA-F]{6}\b/g, recolour).replace(/sodipodi:docname="[^"]*"/, `sodipodi:docname="${file}.svg"`);
    fs.writeFileSync(path.join(tmp, `${file}.svg`), svg);
    inkscape("--export-text-to-path", "--export-type=svg", `--export-filename=${out}/${file}.svg`, path.join(tmp, `${file}.svg`));
    if (/<text\b/.test(fs.readFileSync(`${out}/${file}.svg`, "utf8"))) { console.error(`${out}/${file}.svg still has live text`); process.exit(1); }
    inkscape("--export-type=png", `--export-width=${PAGE}`, `--export-filename=${out}/${file}.png`, `${out}/${file}.svg`);
    console.log("wrote", `${out}/${file}.svg`, "and .png");
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
