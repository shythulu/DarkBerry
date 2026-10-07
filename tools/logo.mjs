// Recolours the Darkberry logo for every tint.
//   node tools/logo.mjs [logo.svg] [outdir]   -> <outdir>/<tint>-logo.svg for each tint in src/tints.json
// The logo is drawn in Mire. Its Mire neutrals (crust, mantle, surface2, overlay2) and tint
// swap to the tint's own Mire values. Every other colour keeps its OKLCH lightness and chroma
// and turns by the same angle the tint turns Mire's neutrals, so the berries follow the tint.
// Greys stay as they are.
import fs from "node:fs";
import { toOklch, fromOklch } from "../lib/color.mjs";

const src = process.argv[2] || "assets/logos/darkberry-logo.svg", out = process.argv[3] || "assets/logos";
const svg = fs.readFileSync(src, "utf8");
const tints = JSON.parse(fs.readFileSync("src/tints.json", "utf8"));
const mireOf = (t) => JSON.parse(fs.readFileSync(t === "darkberry" ? "src/palette.json" : `src/variants/${t}.json`, "utf8")).flavours.mire.colors;
const SWAP = ["crust", "mantle", "surface2", "overlay2", "tint"];
const base = mireOf("darkberry"), hue = (h) => toOklch(h)[2];

fs.mkdirSync(out, { recursive: true });
for (const t of Object.keys(tints).filter((k) => k[0] !== "$" && k !== "darkberry")) {
  const mire = mireOf(t), turn = hue(mire.surface2) - hue(base.surface2), map = new Map();
  for (const k of SWAP) map.set(base[k], mire[k]);
  const recolour = (h) => {
    h = h.toLowerCase();
    if (!map.has(h)) { const [L, C, H] = toOklch(h); map.set(h, C < 0.01 ? h : fromOklch(L, C, H + turn)); }
    return map.get(h);
  };
  const file = `${out}/${t}-logo.svg`;
  fs.writeFileSync(file, svg.replace(/#[0-9a-fA-F]{6}\b/g, recolour).replace(/sodipodi:docname="[^"]*"/, `sodipodi:docname="${t}-logo.svg"`));
  console.log("wrote", file);
}
