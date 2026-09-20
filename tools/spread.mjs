// Pushes apart key syntax colours that sit too close together, changing as little as possible.
//   node tools/spread.mjs [palette.json] [target=6]
// Only palette colours behind a failing pair of key syntax roles are moved (OKLCH hue,
// chroma and lightness), and every move keeps each role at or above its minimum contrast.
import fs from "node:fs";
import { toOklch, fromOklch, deltaE, contrast } from "../lib/color.mjs";

const file = process.argv[2] || "src/palette.json";
const target = +(process.argv[3] || 6);
const P = JSON.parse(fs.readFileSync(file, "utf8"));
const R = JSON.parse(fs.readFileSync(new URL("../src/roles.json", import.meta.url), "utf8"));
const roleOf = (v) => { while (typeof v === "string" && /^(ui|syntax)\./.test(v)) { const [g, ...k] = v.split("."); v = R[g][k.join(".")].value; } return v; };
const key = Object.entries(R.syntax).filter(([, r]) => r.key).map(([k, r]) => [k, roleOf(r.value), r.minContrast ?? 4.5]);
const R2D = 180 / Math.PI;

for (const [id, f] of Object.entries(P.flavours)) {
  const c = f.colors, orig = { ...c };
  const minPair = () => { let m = [99]; for (let i = 0; i < key.length; i++) for (let j = i + 1; j < key.length; j++) { const d = deltaE(c[key[i][1]], c[key[j][1]]); if (d < m[0]) m = [d, key[i][1], key[j][1]]; } return m; };
  const minC = (name) => Math.max(...key.filter((k) => k[1] === name).map((k) => k[2]), 0);
  const score = () => { let s = 0; for (let i = 0; i < key.length; i++) for (let j = i + 1; j < key.length; j++) s += Math.max(0, target - deltaE(c[key[i][1]], c[key[j][1]])) ** 2; return s; };
  const moved = (n) => deltaE(orig[n], c[n]);
  let guard = 0, m = minPair();
  while (m[0] < target && guard++ < 400) {
    let best = null;
    for (const n of [m[1], m[2]]) {
      const [L, C, h] = toOklch(c[n]);
      for (const [dL, dC, dh] of [[0,0,4],[0,0,-4],[0,0.012,0],[0,-0.012,0],[0.015,0,0],[-0.015,0,0]]) {
        const cand = fromOklch(L + dL, Math.max(0, C + dC), h + dh / R2D);
        if (contrast(cand, c.base) < minC(n) + 0.05) continue;
        const keep = c[n]; c[n] = cand;
        const s = score() + 0.02 * moved(n) ** 2;
        if (!best || s < best[0]) best = [s, n, cand];
        c[n] = keep;
      }
    }
    if (!best) break;
    c[best[1]] = best[2]; m = minPair();
  }
  const changes = Object.keys(c).filter((k) => c[k] !== orig[k]).map((k) => `${k} ${orig[k]}→${c[k]} (moved ${moved(k).toFixed(1)})`);
  console.log(`${f.name}: closest pair now ${m[0].toFixed(1)} (${m[1]}/${m[2]})${changes.length ? "\n  " + changes.join("\n  ") : ", no changes"}`);
}
fs.writeFileSync(file, JSON.stringify(P, null, 2) + "\n");
