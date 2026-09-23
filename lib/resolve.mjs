// Role resolution shared by build.mjs and tools/site.mjs.
// indexRoles(ROLES) flattens roles.json; flavourContext() resolves any role, palette
// colour, ansi.N or mix(a,b,t) expression to a hex value for one flavour.
import { mix, ansiBright } from "./color.mjs";

export function indexRoles(ROLES) {
  const roleIndex = {};
  for (const group of ["ui", "terminal", "syntax"])
    for (const [k, v] of Object.entries(ROLES[group])) if (!k.startsWith("$")) roleIndex[`${group}.${k}`] = v;
  return roleIndex;
}

export function flavourContext(id, f, ROLES, roleIndex) {
  const c = f.colors;
  const src = [];
  const hueNames = ["red", "green", "yellow", "blue", "magenta", "cyan"].map((n) => ROLES.ansi[n]);
  src[0] = f.dark ? "surface1" : "subtext1";
  src[8] = f.dark ? "surface2" : "subtext0";
  src[7] = f.dark ? "subtext0" : "surface2";
  src[15] = f.dark ? "subtext1" : "surface1";
  hueNames.forEach((n, i) => { src[i + 1] = n; src[i + 9] = n; });
  const ansi = src.map((n, i) => (i >= 9 && i <= 14 ? ansiBright(c[n], f.dark) : c[n]));

  const resolve = (expr, trace = { palette: new Set(), roles: [] }, depth = 0) => {
    if (depth > 12) throw new Error(`role cycle at ${expr}`);
    const m = /^mix\(([\w.]+),([\w.]+),([\d.]+)\)$/.exec(expr);
    if (m) return [mix(resolve(m[1], trace, depth + 1)[0], resolve(m[2], trace, depth + 1)[0], +m[3]), trace];
    if (/^ansi\.\d+$/.test(expr)) { const n = +expr.split(".")[1]; if (ansi[n] == null) throw new Error(`unknown ${expr}`); trace.roles.push(expr); trace.palette.add(src[n]); return [ansi[n], trace]; }
    if (roleIndex[expr]) {
      trace.roles.push(expr);
      let v = roleIndex[expr].value;
      if (v && typeof v === "object") v = v[id] ?? (f.dark ? v.dark : v.light); // a flavour id key wins over dark/light
      return resolve(v, trace, depth + 1);
    }
    if (c[expr]) { trace.palette.add(expr); return [c[expr], trace]; }
    throw new Error(`unknown colour or role "${expr}"`);
  };
  return { id, f, c, ansi, resolve };
}
