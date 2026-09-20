// Where does a colour come from?
//   node tools/where.mjs tab          every themed key containing "tab", in every app
//   node tools/where.mjs ui.badge     every key that uses the ui.badge role
//   node tools/where.mjs berry        every key that ends up using the palette colour berry
// Reads dist/trace.json, so run `node build.mjs` first.
import fs from "node:fs";
const q = (process.argv[2] || "").toLowerCase();
if (!q) { console.log("usage: node tools/where.mjs <key, role or palette colour>"); process.exit(1); }
const T = JSON.parse(fs.readFileSync(new URL("../dist/trace.json", import.meta.url), "utf8"));
const hits = T.filter((t) => t.key.toLowerCase().includes(q) || t.roles.some((r) => r.toLowerCase() === q || r.toLowerCase().startsWith(q + ".")) || t.palette.includes(q));
if (!hits.length) { console.log(`Nothing themed matches "${q}".`); process.exit(0); }
const flav = Object.keys(hits[0].hex);
let port = "";
for (const h of hits.sort((a, b) => a.port.localeCompare(b.port))) {
  if (h.port !== port) { port = h.port; console.log(`\n${port}`); }
  const chain = [...h.roles.filter((r) => !r.startsWith("ansi.")), ...h.roles.filter((r) => r.startsWith("ansi.")), ...h.palette].join(" → ");
  console.log(`  ${h.key}\n    ${h.expr}  ${chain ? "(" + chain + ")" : ""}\n    ${flav.map((f) => `${f} ${h.hex[f]}`).join("  ")}`);
}
console.log(`\n${hits.length} key(s). Change a role in src/roles.json to move all of them together; add an override in src/overrides/<app>.json to change just one app.`);
