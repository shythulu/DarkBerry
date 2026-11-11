// The tints, read the one way every script should: src/tints.json gives the ids, names and
// display order; darkberry is src/palette.json and every other id is src/variants/<id>.json.
// Files in src/variants/ that tints.json does not list (experiments from tools/variants.mjs)
// are never picked up.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

// Palette keys in accentOrder that are not accents: the button fill, the text on it, and the
// active-tab tint.
export const NON_ACCENT = ["jam", "onjam", "tint"];

export const tintFile = (id) => (id === "darkberry" ? "src/palette.json" : `src/variants/${id}.json`);

// [{ id, name, note, swatch, pal }] in tints.json order.
export function loadTints() {
  const T = readJson("src/tints.json");
  return Object.entries(T).filter(([id]) => !id.startsWith("$")).map(([id, t]) => ({ id, ...t, pal: readJson(tintFile(id)) }));
}
