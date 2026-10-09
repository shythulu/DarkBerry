// Darkberry variant generator. Every variant is a variation on Darkberry (src/palette.json).
//   node tools/variants.mjs                  -> every named variant into src/variants/
//   node tools/variants.mjs cloudberry 1 -2  -> cloudberry, hue step +1, chroma step -2
//   add --raw to skip the syntax-spacing pass
// A variant tints the neutrals toward a berry (tint or tintHue, strength, plus optional
// textTint, a multiplier on how much tint reaches text and greys, and depth, an OKLCH
// lightness shift for dark flavours' backgrounds), keeping their lightness.
// Hue steps move the tint's hue 5° each; chroma steps scale neutral and accent intensity.
// Every text role is then nudged until it is at least 4.5:1 on base, and tools/spread.mjs
// keeps key syntax colours distinct.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { hexOf, gam, toHsl, fromHsl, toOklch, oklchRgb, contrast } from "../lib/color.mjs";
import { settleFill } from "../lib/derive.mjs";

// Settings are relative to Darkberry (src/palette.json).
const VARIANTS = {
  lingonberry: { label: "Lingonberry", tintHue: 0, strength: 0.5, textTint: 1.45, depth: 0.008 },
  cloudberry:  { label: "Cloudberry",  tintHue: 49, strength: 0.5, textTint: 1.2, depth: 0.008 },
  crowberry:   { label: "Crowberry",   tint: "#2e2440", strength: 0.6 },
  blueberry:   { label: "Blueberry",   tint: "#4d6399", strength: 0.6 },
};
const TEXT_NEUTRALS = ["text", "subtext1", "subtext0"];
const HUE_STEP = 5;
const NEUTRAL_CHROMA = { "-2": 0.6, "-1": 0.8, "0": 1, "1": 1.25, "2": 1.5 };
const ACCENT_CHROMA = { "-2": 0.7, "-1": 0.85, "0": 1, "1": 1.15, "2": 1.3 };

// The tints were tuned on this gamut mapping, which gives up chroma in coarser steps than
// lib/color.mjs fromOklch; switching would move a few tint colours by one unit.
const fromOklch = (L, C, h) => { let c = C, x; for (let i = 0; i < 60; i++) { x = oklchRgb(L, c, h); if (x.every((v) => v >= -0.001 && v <= 1.001)) break; c *= 0.96; } return hexOf(x.map(gam)); };

const BG = ["base", "mantle", "crust", "surface0", "surface1", "surface2"];

function generate(P, variant, hueStep = 0, chromaStep = 0) {
  const cfg = VARIANTS[variant];
  const V = structuredClone(P);
  const dh = hueStep * HUE_STEP, nc = NEUTRAL_CHROMA[chromaStep], ac = ACCENT_CHROMA[chromaStep];
  V.variant = { name: variant, hueStep, chromaStep };
  for (const f of Object.values(V.flavours)) {
    const o = f.colors;
    const tintHue = (cfg.tintHue ?? (toOklch(cfg.tint)[2] * 180) / Math.PI) + dh;
    for (const k of Object.keys(o)) {
      if (P.neutralOrder.includes(k)) {
        let [L, C] = toOklch(o[k]); const s = cfg.strength;
        const target = (BG.includes(k) ? (f.dark ? 0.05 : 0.025) : TEXT_NEUTRALS.includes(k) ? (f.dark ? 0.022 : 0.05) * (cfg.textTint ?? 1) : 0.04) * nc;
        if (f.dark && BG.includes(k)) L += cfg.depth ?? 0;
        o[k] = fromOklch(L, C * (1 - s) + target * s * 1.1, (tintHue * Math.PI) / 180);
      } else if (k !== "onjam" && ac !== 1) { const [L, C, h] = toOklch(o[k]); o[k] = fromOklch(L, C * ac, h); }
    }
    for (const k of Object.keys(o)) {
      if (k === "jam" || k === "onjam" || k === "tint" || [...BG, "overlay0", "overlay1"].includes(k)) continue;
      let n = 0;
      while (contrast(o[k], o.base) < 4.5 && n++ < 60) { const [H, S, l] = toHsl(o[k]); o[k] = fromHsl(H, S, l + (f.dark ? 0.01 : -0.01)); }
    }
    // tint: the tab highlight colour, berry's lightness and intensity at the tint's own hue.
    // Tab text (base) must stay >= 4.5:1.
    if ("tint" in o) {
      const [L, C] = toOklch(o.berry);
      o.tint = fromOklch(L, C, (tintHue * Math.PI) / 180);
      let n = 0;
      while (contrast(o.base, o.tint) < 4.5 && n++ < 60) { const [L, C, h] = toOklch(o.tint); o.tint = fromOklch(L + (f.dark ? 0.01 : -0.01), C, h); }
    }
    Object.assign(o, settleFill(o)); // jam and onjam follow the fill equation (lib/derive.mjs)
  }
  return V;
}

const sign = (n) => (n > 0 ? `+${n}` : `${n}`);
const P = JSON.parse(fs.readFileSync("src/palette.json", "utf8")); // seed: Darkberry, the default
fs.mkdirSync("src/variants", { recursive: true });
const args = process.argv.slice(2), raw = args.includes("--raw");
const [v, h, c] = args.filter((a) => a !== "--raw");
if (v && !VARIANTS[v]) { console.error(`unknown variant "${v}". Known: ${Object.keys(VARIANTS).join(", ")}`); process.exit(1); }
const jobs = v ? [[v, +(h || 0), +(c || 0)]] : Object.keys(VARIANTS).map((k) => [k, 0, 0]);
for (const [name, hs, cs] of jobs) {
  const file = hs || cs ? `src/variants/${name}_h${sign(hs)}_c${sign(cs)}.json` : `src/variants/${name}.json`;
  const out = generate(P, name, hs, cs);
  out.description = `${P.description} Tint: ${VARIANTS[name].label}.`; // description and tagline per flavour carry over: the build swaps the tagline for the tint's line
  // The default's flavour notes describe its own neutrals, which a tint replaces.
  for (const [fid, f] of Object.entries(out.flavours)) f.note = `${VARIANTS[name].label} tint of ${f.name}: ${f.dark ? "dark" : "light"}, neutrals leaned toward ${name} (base ${f.colors.base}).`;
  delete out.defaultVariant;
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  if (!raw) { execFileSync("node", ["tools/spread.mjs", file, "6"], { stdio: "ignore" }); execFileSync("node", ["tools/settle.mjs", file], { stdio: "ignore" }); }
  console.log("wrote", file);
}
