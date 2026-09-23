// Darkberry variant generator. Every variant is a variation on Darkberry (src/palette.json).
//   node tools/variants.mjs                  -> every named variant into src/variants/
//   node tools/variants.mjs cloudberry 1 -2  -> cloudberry, hue step +1, chroma step -2
//   add --raw to skip the syntax-spacing pass
// A variant can either rotate the wine neutrals to a target hue (hue, sat, dim, pink) or
// tint them toward a berry (tint or tintHue, strength, plus optional textTint, a multiplier
// on how much tint reaches text and greys, and depth, an OKLCH lightness shift for dark
// flavours' backgrounds). Only nature tints are defined now.
// Nature tints lean only the neutrals toward a berry's colour, keeping their lightness.
// Hue steps move 5° each; chroma steps scale neutral and accent intensity.
// Every text role is then nudged until it is at least 4.5:1 on base, and tools/spread.mjs
// keeps key syntax colours distinct.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

// Settings are relative to Darkberry. darkberry itself is the identity, used for grid tiles.
export const VARIANTS = {
  darkberry:   { label: "Darkberry", hue: null, sat: 1, dim: 1, pink: 0 },
  lingonberry: { label: "Lingonberry", tintHue: 0, strength: 0.5, textTint: 1.45, depth: 0.008 },
  cloudberry:  { label: "Cloudberry",  tintHue: 49, strength: 0.5, textTint: 1.2, depth: 0.008 },
  crowberry:   { label: "Crowberry",   tint: "#2e2440", strength: 0.6 },
  blueberry:   { label: "Blueberry",   tint: "#4d6399", strength: 0.6 },
};
const TEXT_NEUTRALS = ["text", "subtext1", "subtext0"];
export const HUE_STEP = 5;
export const NEUTRAL_CHROMA = { "-2": 0.6, "-1": 0.8, "0": 1, "1": 1.25, "2": 1.5 };
export const ACCENT_CHROMA = { "-2": 0.7, "-1": 0.85, "0": 1, "1": 1.15, "2": 1.3 };

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const hexOf = (a) => "#" + a.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
const toHsl = (h) => { const [r, g, b] = rgb(h), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let H = 0, S = 0; if (d) { S = d / (1 - Math.abs(2 * l - 1)); H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360; } return [H, S, l]; };
const fromHsl = (H, S, l) => { H = ((H % 360) + 360) % 360; S = Math.min(1, Math.max(0, S)); l = Math.min(1, Math.max(0, l)); const c = (1 - Math.abs(2 * l - 1)) * S, x = c * (1 - Math.abs((H / 60) % 2 - 1)), m = l - c / 2; const [r, g, b] = H < 60 ? [c, x, 0] : H < 120 ? [x, c, 0] : H < 180 ? [0, c, x] : H < 240 ? [0, x, c] : H < 300 ? [x, 0, c] : [c, 0, x]; return hexOf([r + m, g + m, b + m]); };
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const toOklch = (h) => { const [r, g, b] = rgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)]; };
const oklchRgb = (L, C, h) => { const A = C * Math.cos(h), B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]; };
const fromOklch = (L, C, h) => { let c = C, x; for (let i = 0; i < 60; i++) { x = oklchRgb(L, c, h); if (x.every((v) => v >= -0.001 && v <= 1.001)) break; c *= 0.96; } return hexOf(x.map(gam)); };
const lum = (h) => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const BG = ["base", "mantle", "crust", "surface0", "surface1", "surface2"];
const PINKS = ["blossom", "petal", "berry", "cherry", "jam"];

export function generate(P, variant, hueStep = 0, chromaStep = 0) {
  const cfg = VARIANTS[variant];
  const V = structuredClone(P);
  const dh = hueStep * HUE_STEP, nc = NEUTRAL_CHROMA[chromaStep], ac = ACCENT_CHROMA[chromaStep];
  V.variant = { name: variant, hueStep, chromaStep };
  for (const f of Object.values(V.flavours)) {
    const o = f.colors;
    const isTint = cfg.tint || cfg.tintHue != null;
    const tintHue = isTint ? (cfg.tintHue ?? (toOklch(cfg.tint)[2] * 180) / Math.PI) + dh : 0;
    for (const k of Object.keys(o)) {
      if (isTint && P.neutralOrder.includes(k)) {
        let [L, C] = toOklch(o[k]); const s = cfg.strength;
        const target = (BG.includes(k) ? (f.dark ? 0.05 : 0.025) : TEXT_NEUTRALS.includes(k) ? (f.dark ? 0.022 : 0.05) * (cfg.textTint ?? 1) : 0.04) * nc;
        if (f.dark && BG.includes(k)) L += cfg.depth ?? 0;
        o[k] = fromOklch(L, C * (1 - s) + target * s * 1.1, (tintHue * Math.PI) / 180);
      } else if (isTint) {
        if (k !== "onjam" && ac !== 1) { const [L, C, h] = toOklch(o[k]); o[k] = fromOklch(L, C * ac, h); }
      } else if (P.neutralOrder.includes(k)) {
        let [H, S, l] = toHsl(o[k]);
        H = (cfg.hue ?? H) + dh; S = S * cfg.sat * nc;
        if (f.dark && BG.includes(k)) l *= cfg.dim;
        if (!f.dark && (k === "text" || k.startsWith("subtext"))) l *= cfg.dim;
        o[k] = fromHsl(H, S, l);
      } else if (k !== "onjam") {
        let [L, C, h] = toOklch(o[k]);
        if (PINKS.includes(k)) h += ((cfg.pink + dh * 0.5) * Math.PI) / 180;
        o[k] = fromOklch(L, C * ac, h);
      }
    }
    for (const k of Object.keys(o)) {
      if (k === "jam" || k === "onjam" || k === "tint" || [...BG, "overlay0", "overlay1"].includes(k)) continue;
      let n = 0;
      while (contrast(o[k], o.base) < 4.5 && n++ < 60) { const [H, S, l] = toHsl(o[k]); o[k] = fromHsl(H, S, l + (f.dark ? 0.01 : -0.01)); }
    }
    // tint: the tab highlight colour. Tints take berry's lightness and intensity at the
    // tint's own hue; hue variants keep it equal to berry. Tab text (base) must stay >= 4.5:1.
    if ("tint" in o) {
      if (isTint) { const [L, C] = toOklch(o.berry); o.tint = fromOklch(L, C, (tintHue * Math.PI) / 180); }
      else o.tint = o.berry;
      let n = 0;
      while (contrast(o.base, o.tint) < 4.5 && n++ < 60) { const [L, C, h] = toOklch(o.tint); o.tint = fromOklch(L + (f.dark ? 0.01 : -0.01), C, h); }
    }
    if (contrast("#ffffff", o.jam) < 4.5) { let n = 0; while (contrast("#ffffff", o.jam) < 4.5 && n++ < 30) { const [H, S, l] = toHsl(o.jam); o.jam = fromHsl(H, S, l - 0.01); } }
  }
  return V;
}

const sign = (n) => (n > 0 ? `+${n}` : `${n}`);
if (import.meta.url === `file://${process.argv[1]}`) {
  const P = JSON.parse(fs.readFileSync("src/palette.json", "utf8")); // seed: Darkberry, the default
  fs.mkdirSync("src/variants", { recursive: true });
  const args = process.argv.slice(2), raw = args.includes("--raw");
  const [v, h, c] = args.filter((a) => a !== "--raw");
  if (v && !VARIANTS[v]) { console.error(`unknown variant "${v}". Known: ${Object.keys(VARIANTS).join(", ")}`); process.exit(1); }
  const jobs = v ? [[v, +(h || 0), +(c || 0)]] : Object.keys(VARIANTS).filter((k) => k !== "darkberry").map((k) => [k, 0, 0]);
  for (const [name, hs, cs] of jobs) {
    if (name === "darkberry" && !hs && !cs) { console.log("darkberry is the default palette itself (src/palette.json); nothing to write"); continue; }
    const file = hs || cs ? `src/variants/${name}_h${sign(hs)}_c${sign(cs)}.json` : `src/variants/${name}.json`;
    const out = generate(P, name, hs, cs);
    out.description = `${P.description} Tint: ${VARIANTS[name].label}.`;
    // The default's flavour notes describe its own neutrals, which a tint replaces.
    for (const [fid, f] of Object.entries(out.flavours)) f.note = `${VARIANTS[name].label} tint of ${f.name}: ${f.dark ? "dark" : "light"}, neutrals leaned toward ${name} (base ${f.colors.base}).`;
    delete out.defaultVariant;
    fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
    if (!raw) { execFileSync("node", ["tools/spread.mjs", file, "6"], { stdio: "ignore" }); execFileSync("node", ["tools/settle.mjs", file], { stdio: "ignore" }); }
    console.log("wrote", file);
  }
}
