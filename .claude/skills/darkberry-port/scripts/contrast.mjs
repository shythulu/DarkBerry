// contrast.mjs <fg> <bg> [<fg> <bg> ...]
// WCAG contrast ratios through lib/color.mjs, the maths the build uses for its floors.
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const { contrast } = await import(path.join(root, "lib/color.mjs"));
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) { console.error("usage: node contrast.mjs <fg> <bg> [<fg> <bg> ...]"); process.exit(1); }
for (let i = 0; i < args.length; i += 2) {
  const r = contrast(args[i], args[i + 1]);
  console.log(`${args[i]} on ${args[i + 1]}: ${r.toFixed(2)}:1  ${r >= 4.5 ? "AA text" : r >= 3 ? "AA large text / UI only" : "below 3:1"}`);
}
