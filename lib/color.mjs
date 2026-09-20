// Colour maths shared by the build and the variant generator. No dependencies.
export const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
export const hexOf = (a) => "#" + a.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
export const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hexOf(x.map((v, i) => v + (y[i] - v) * t)); };
export const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export const toHsl = (h) => { const [r, g, b] = rgb(h), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let H = 0, S = 0; if (d) { S = d / (1 - Math.abs(2 * l - 1)); H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360; } return [H, S, l]; };
export const fromHsl = (H, S, l) => { H = ((H % 360) + 360) % 360; S = Math.min(1, Math.max(0, S)); l = Math.min(1, Math.max(0, l)); const c = (1 - Math.abs(2 * l - 1)) * S, x = c * (1 - Math.abs((H / 60) % 2 - 1)), m = l - c / 2; const [r, g, b] = H < 60 ? [c, x, 0] : H < 120 ? [x, c, 0] : H < 180 ? [0, c, x] : H < 240 ? [0, x, c] : H < 300 ? [x, 0, c] : [c, 0, x]; return hexOf([r + m, g + m, b + m]); };

// OKLab / OKLCH
export const toOklab = (h) => { const [r, g, b] = rgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; };
export const toOklch = (h) => { const [L, A, B] = toOklab(h); return [L, Math.hypot(A, B), Math.atan2(B, A)]; };
const oklchRgb = (L, C, h) => { const A = C * Math.cos(h), B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]; };
const inGamut = (x) => x.every((v) => v >= -0.0001 && v <= 1.0001);
export const fromOklch = (L, C, h) => { let c = C, x; for (let i = 0; i < 80; i++) { x = oklchRgb(L, c, h); if (inGamut(x)) break; c *= 0.97; } return hexOf(x.map(gam)); };
export const deltaE = (a, b) => { const x = toOklab(a), y = toOklab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100; };

// CIE LCh (D50), as used by Catppuccin's palette generator (colorjs "lch")
const D65toXYZ = [[0.4123907992659595, 0.357584339383878, 0.1804807884018343], [0.21263900587151036, 0.7151686787677559, 0.07219231536073371], [0.01933081871559185, 0.11919477979462599, 0.9505321522496606]];
const XYZtoD65 = [[3.2409699419045226, -1.537383177570094, -0.4986107602930034], [-0.9692436362808796, 1.8759675015077202, 0.04155505740717559], [0.05563007969699366, -0.20397695888897652, 1.0569715142428786]];
const D65toD50 = [[1.0479298208405488, 0.022946793341019088, -0.05019222954313557], [0.029627815688159344, 0.990434484573249, -0.01707382502938514], [-0.009243058152591178, 0.015055144896577895, 0.7518742899580008]];
const D50toD65 = [[0.9554734527042182, -0.023098536874261423, 0.0632593086610217], [-0.028369706963208136, 1.0099954580058226, 0.021041398966943008], [0.012314001688319899, -0.020507696433477912, 1.3303659366080753]];
const W50 = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];
const mul = (M, v) => M.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const e = 216 / 24389, k = 24389 / 27;
export const toLch = (h) => {
  const xyz = mul(D65toD50, mul(D65toXYZ, rgb(h).map(lin))).map((v, i) => v / W50[i]);
  const f = xyz.map((v) => (v > e ? Math.cbrt(v) : (k * v + 16) / 116));
  const L = 116 * f[1] - 16, a = 500 * (f[0] - f[1]), b = 200 * (f[1] - f[2]);
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
};
const lchRgb = (L, C, H) => {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const fy = (L + 16) / 116, fx = a / 500 + fy, fz = fy - b / 200;
  const xyz = [fx ** 3 > e ? fx ** 3 : (116 * fx - 16) / k, L > k * e ? fy ** 3 : L / k, fz ** 3 > e ? fz ** 3 : (116 * fz - 16) / k].map((v, i) => v * W50[i]);
  return mul(XYZtoD65, mul(D50toD65, xyz)).map(gam);
};
// Gamut-map by reducing chroma (close to colorjs toGamut for these light pastels)
export const fromLch = (L, C, H) => { let c = C, x; for (let i = 0; i < 200; i++) { x = lchRgb(L, c, H); if (inGamut(x)) break; c -= 0.25; } return hexOf(x); };

// WCAG
export const luminance = (h) => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Catppuccin's bright-ANSI formula
export const ansiBright = (hex, dark) => { const [L, C, H] = toLch(hex); return fromLch(L * (dark ? 0.94 : 1.09), C + (dark ? 8 : 0), H + 2); };
