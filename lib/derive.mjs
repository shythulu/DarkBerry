// The fill equation, shared by the build (which checks it), tools/settle.mjs and
// tools/variants.mjs (which apply it). One rule for every flavour and tint, so no
// flavour needs an exception in roles.json:
//
//   jam keeps its hue and chroma; its lightness moves away from the background's
//   until jam clears the background by FILL_ON_BACKGROUND (a non-text UI element,
//   WCAG 1.4.11 asks 3:1; the extra 0.3 keeps tints off the line without pushing Mire past the point where white stops reading).
//   onjam is whichever of white or crust reads best on jam, and must reach
//   TEXT_ON_FILL. Pale fills take crust, deep fills take white.
import { toOklch, fromOklch, contrast } from "./color.mjs";

export const FILL_ON_BACKGROUND = 3.3, TEXT_ON_FILL = 4.5;

export function settleFill(colors) {
  let [L, C, H] = toOklch(colors.jam), jam = colors.jam;
  const bgL = toOklch(colors.base)[0], dir = L >= bgL ? 1 : -1;
  const best = (j) => ["#ffffff", colors.crust].map((c) => [contrast(c, j), c]).sort((a, b) => b[0] - a[0])[0];
  for (let i = 0; i < 300 && (contrast(jam, colors.base) < FILL_ON_BACKGROUND || best(jam)[0] < TEXT_ON_FILL); i++) { L += dir * 0.002; jam = fromOklch(L, C, H); }
  return { jam, onjam: best(jam)[1] };
}
export const fillSettled = (colors) => { const s = settleFill(colors); return s.jam === colors.jam && s.onjam === colors.onjam; };
