// Settles a palette against the build's syntax checks, changing as little as possible.
//   node tools/settle.mjs [palette.json] [floor=5.2]
// Where two syntax roles resolve closer than the floor (OKLab distance ×100), the accent
// palette colour behind one of them is nudged in OKLCH until they part, and every step
// keeps each role at or above its minimum contrast on the background and both panes.
// Neutrals are never moved: they are the tint. Unlike spread.mjs this resolves roles the
// way the build does, so mixes and per-flavour values are covered.
import fs from "node:fs";
import { toOklch, fromOklch, deltaE, contrast } from "../lib/color.mjs";
import { indexRoles, flavourContext } from "../lib/resolve.mjs";
import { settleFill } from "../lib/derive.mjs";

const file = process.argv[2] || "src/palette.json", floor = +(process.argv[3] || 5.2);
const P = JSON.parse(fs.readFileSync(file, "utf8"));
const ROLES = JSON.parse(fs.readFileSync(new URL("../src/roles.json", import.meta.url), "utf8"));
const idx = indexRoles(ROLES);
const syn = Object.entries(ROLES.syntax).filter(([k, r]) => !k.startsWith("$") && !(typeof r.value === "string" && r.value.startsWith("syntax.")));
const accents = new Set(P.accentOrder.filter((k) => !["jam", "onjam", "tint"].includes(k)));
const R2D = 180 / Math.PI;
let report = [];

for (const [id, f] of Object.entries(P.flavours)) {
  const c = f.colors, orig = { ...c };
  Object.assign(c, settleFill(c)); // jam and onjam follow the fill equation first
  const ctx = () => flavourContext(id, f, ROLES, idx);
  const okContrast = (x) => syn.every(([k, r]) => ["ui.background", "ui.pane.secondary", "ui.pane.tertiary"].every((bg) => contrast(x.resolve(`syntax.${k}`)[0], x.resolve(bg)[0]) >= (r.minContrast ?? 4.5)));
  const pairs = (x) => { const out = []; for (let i = 0; i < syn.length; i++) for (let j = i + 1; j < syn.length; j++) { const a = x.resolve(`syntax.${syn[i][0]}`), b = x.resolve(`syntax.${syn[j][0]}`); out.push([deltaE(a[0], b[0]), syn[i][0], syn[j][0], [...a[1].palette, ...b[1].palette].filter((p) => accents.has(p))]); } return out.sort((p, q) => p[0] - q[0]); };
  const worst = (x) => pairs(x)[0][0];
  let guard = 0, x = ctx(), m = pairs(x)[0];
  while (m[0] < floor && guard++ < 300) {
    let best = null;
    for (const n of new Set(m[3])) {
      const [L, C, h] = toOklch(c[n]);
      for (const [dL, dC, dh] of [[0, 0, 3], [0, 0, -3], [0, 0.01, 0], [0, -0.01, 0], [0.012, 0, 0], [-0.012, 0, 0]]) {
        const keep = c[n]; c[n] = fromOklch(L + dL, Math.max(0, C + dC), h + dh / R2D);
        const y = ctx();
        if (okContrast(y)) { const w = worst(y); if (!best || w > best.w) best = { w, n, v: c[n] }; }
        c[n] = keep;
      }
    }
    if (!best || best.w <= m[0] + 1e-6) break;
    c[best.n] = best.v; x = ctx(); m = pairs(x)[0];
  }
  const changes = Object.keys(c).filter((k) => c[k] !== orig[k]).map((k) => `${k} ${orig[k]}→${c[k]} (${deltaE(orig[k], c[k]).toFixed(1)})`);
  report.push(`${f.name}: closest ${m[1]}/${m[2]} ${m[0].toFixed(1)}${changes.length ? "; moved " + changes.join(", ") : ""}`);
}
fs.writeFileSync(file, JSON.stringify(P, null, 2) + "\n");
console.log(report.join("\n"));
