// pixel-audit.mjs <frame> [flavour] [--tint <id>] [--ignore x0,y0-x1,y1]... [--min <percent>] [--json]
// Measures how much of a screenshot is the theme, so "does the app show Darkberry's
// colours" is a number, not an impression. Two passes:
//
// 1. Flat regions. A pixel is "flat" when its 3x3 neighbourhood is one colour: fills,
//    bars, selections and panes, not antialiased glyph edges. Flat pixels are clustered,
//    and every cluster over --min percent of the frame (default 0.2) is matched to the
//    nearest palette colour, role or ansi slot by OKLab distance x100 (lib/color.mjs):
//      on    <= 1.2 (2.0 for a .webp: lossy chroma moves flat values by up to 1.5)
//      near  <= 6   a blend (an alpha suffix, a dimmed state, the app mixing on its own) or
//                   a near miss; dark colours sit close in OKLab, so read the box and name
//      off   >  6   not the theme: an app default or a hardcoded colour the port missed
//    near and off clusters print their bounding box. A grey cluster (OKLCH chroma under
//    0.008) next to a tinted match is flagged "!": every Darkberry neutral carries the
//    plum hue, so an untinted grey is almost always the app's own colour.
// 2. All pixels. Every pixel within 4 of a palette colour counts toward that colour, so
//    the shares DESIGN_LANGUAGE.md asks for are measured the same way each time: panes
//    (base + mantle + crust), the fill family (jam, tint, berry), all accents, and each
//    accent on its own (compare the list between Mire and Blackwater frames: the accents
//    are the same hex in both).
//
// The flavour and tint come from the arguments, else from the path: a file named for a
// flavour (mire.png) under a folder named for a tint (ports/gtk/blueberry/assets/). The
// tint and flavour whose ui.background is closest to the largest flat cluster are always
// worked out too, across every tint, and a WARNING is printed when they disagree with
// the name. That is how a frame that did not repaint shows up.
// --ignore excludes a box (image content, a video, a picture widget) from every count.
// Needs ImageMagick (magick or convert) to decode the frame.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const { deltaE, toOklch } = await import(path.join(root, "lib/color.mjs"));
const { indexRoles, flavourContext } = await import(path.join(root, "lib/resolve.mjs"));
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); if (i < 0) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const json = args.includes("--json"); if (json) args.splice(args.indexOf("--json"), 1);
const ignores = []; for (let v; (v = opt("--ignore", null)); ) { const m = /^(\d+),(\d+)-(\d+),(\d+)$/.exec(v); if (!m) { console.error(`--ignore wants x0,y0-x1,y1, not ${v}`); process.exit(1); } ignores.push(m.slice(1).map(Number)); }
const tintArg = opt("--tint", null), minShare = +opt("--min", "0.2");
const [frame, flavourArg] = args;
if (!frame) { console.error("usage: node pixel-audit.mjs <frame> [flavour] [--tint <id>] [--ignore x0,y0-x1,y1]... [--min <percent>] [--json]"); process.exit(1); }
const onLimit = /\.webp$/i.test(frame) ? 2.0 : 1.2;

// Decode to raw RGB through ImageMagick, whichever binary is installed.
const im = ["magick", "convert"].find((b) => { try { execFileSync(b, ["-version"], { stdio: "ignore" }); return true; } catch { return false; } });
if (!im) { console.error("ImageMagick is needed (magick or convert)"); process.exit(1); }
const [W, H] = execFileSync(im, [frame, "-format", "%w %h", "info:"]).toString().trim().split(/\s+/).map(Number);
const px = execFileSync(im, [frame, "-alpha", "off", "-depth", "8", "rgb:-"], { maxBuffer: 1 << 28 });
const hex = (i) => "#" + [px[i], px[i + 1], px[i + 2]].map((v) => v.toString(16).padStart(2, "0")).join("");
const ignored = (x, y) => ignores.some(([x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1);
let total = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!ignored(x, y)) total++;

// Flat pixels, counted per exact colour, with the box they span.
const flat = new Map(); let flatTotal = 0;
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  if (ignored(x, y)) continue;
  const i = (y * W + x) * 3; let same = true;
  for (let dy = -1; dy <= 1 && same; dy++) for (let dx = -1; dx <= 1 && same; dx++) {
    const j = ((y + dy) * W + x + dx) * 3;
    if (Math.abs(px[i] - px[j]) > 3 || Math.abs(px[i + 1] - px[j + 1]) > 3 || Math.abs(px[i + 2] - px[j + 2]) > 3) same = false;
  }
  if (same) {
    const h = hex(i), e = flat.get(h);
    if (e) { e.n++; if (x < e.x0) e.x0 = x; if (x > e.x1) e.x1 = x; if (y < e.y0) e.y0 = y; if (y > e.y1) e.y1 = y; }
    else flat.set(h, { n: 1, x0: x, x1: x, y0: y, y1: y });
    flatTotal++;
  }
}

// Greedy clustering: biggest colours first, anything within 1.5 joins the cluster.
const clusters = [];
for (const [h, e] of [...flat].sort((a, b) => b[1].n - a[1].n)) {
  const c = clusters.find((k) => deltaE(k.hex, h) <= 1.5);
  if (!c) { clusters.push({ hex: h, ...e }); continue; }
  c.n += e.n; c.x0 = Math.min(c.x0, e.x0); c.x1 = Math.max(c.x1, e.x1); c.y0 = Math.min(c.y0, e.y0); c.y1 = Math.max(c.y1, e.y1);
}
clusters.sort((a, b) => b.n - a.n);

// Candidate colours for one flavour: palette, every role, every ansi slot.
const ROLES = readJson("src/roles.json"), roleIndex = indexRoles(ROLES);
const tints = ["darkberry", ...fs.readdirSync(path.join(root, "src/variants")).map((f) => f.replace(/\.json$/, ""))];
const paletteOf = (t) => readJson(t === "darkberry" ? "src/palette.json" : `src/variants/${t}.json`);
const ACCENTS = readJson("src/palette.json").accentOrder.filter((a) => a !== "onjam");
function candidates(t, fl) {
  const P = paletteOf(t), f = P.flavours[fl]; if (!f) return null;
  const ctx = flavourContext(fl, f, ROLES, roleIndex), byHex = new Map();
  const add = (name, h) => { h = h.toLowerCase(); if (!byHex.has(h)) byHex.set(h, []); byHex.get(h).push(name); };
  for (const [k, v] of Object.entries(f.colors)) add(k, v);
  for (const r of Object.keys(roleIndex)) { try { add(r, ctx.resolve(r)[0]); } catch {} }
  ctx.ansi.forEach((v, n) => add(`ansi.${n}`, v));
  return { t, fl, byHex, colors: f.colors, bg: ctx.resolve("ui.background")[0].toLowerCase() };
}

// What the frame is meant to be, from the arguments or the path, and what it looks like.
const parts = path.resolve(frame).split(path.sep).map((p) => p.toLowerCase());
const expectedTint = tintArg || tints.find((t) => t !== "darkberry" && parts.includes(t)) || "darkberry";
const named = path.basename(frame).replace(/\.\w+$/, "").toLowerCase();
const expected = flavourArg || (paletteOf(expectedTint).flavours[named] ? named : null);
let guess, best = Infinity;
for (const t of tints) for (const fl of Object.keys(paletteOf(t).flavours)) {
  const c = candidates(t, fl), d = deltaE(c.bg, clusters[0]?.hex); if (d < best) { best = d; guess = c; }
}
const cand = expected ? candidates(expectedTint, expected) : guess;
if (!cand) { console.error(`no flavour "${flavourArg}" in ${expectedTint}`); process.exit(1); }
const mismatch = expected && (guess.fl !== expected || guess.t !== expectedTint)
  ? `the frame is meant to be ${expectedTint} ${expected}, but its background is ${guess.t} ${guess.fl} (${best.toFixed(1)} away)` : null;

// Pass 1: flat clusters against palette, roles and ansi.
const nearest = (h, map) => { let b = { d: Infinity }; for (const [ch, names] of map) { const d = deltaE(h, ch); if (d < b.d) b = { d, hex: ch, names }; } return b; };
const verdict = (d) => (d <= onLimit ? "on" : d <= 6 ? "near" : "off");
const rows = [];
for (const c of clusters) {
  const share = (100 * c.n) / total; if (share < minShare) break;
  const m = nearest(c.hex, cand.byHex);
  const grey = toOklch(c.hex)[1] < 0.008 && toOklch(m.hex)[1] >= 0.008;
  rows.push({ hex: c.hex, share: +share.toFixed(2), match: m.hex, names: m.names, dE: +m.d.toFixed(1), verdict: verdict(m.d), grey, box: `${c.x0},${c.y0}-${c.x1},${c.y1}` });
}

// Pass 2: every pixel against the palette colours alone.
const palette = new Map(Object.entries(cand.colors).filter(([k]) => k !== "onjam").map(([k, v]) => [v.toLowerCase(), [k]]));
const byName = {}, cache = new Map();
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (ignored(x, y)) continue;
  const h = hex((y * W + x) * 3); let name = cache.get(h);
  if (name === undefined) { const m = nearest(h, palette); name = m.d <= 4 ? m.names[0] : null; cache.set(h, name); }
  if (name) byName[name] = (byName[name] || 0) + 1;
}
const pct = (n) => +((100 * n) / total).toFixed(2);
const shareOf = (names) => pct(names.reduce((s, n) => s + (byName[n] || 0), 0));
// tint and berry are one hex on the dark flavours, so the family is counted once per hex.
const fillHexes = new Set(["jam", "tint", "berry"].map((n) => cand.colors[n].toLowerCase()));
const fillNames = [...palette].filter(([h]) => fillHexes.has(h)).map(([, [n]]) => n);
const accentNames = [...palette].filter(([, [n]]) => ACCENTS.includes(n)).map(([, [n]]) => n);
const sum = (v) => +rows.filter((r) => r.verdict === v).reduce((s, r) => s + r.share, 0).toFixed(2);
const report = {
  frame, size: `${W}x${H}`, tint: cand.t, flavour: cand.fl, guessed: !expected, mismatch, ignored: ignores.map((b) => `${b[0]},${b[1]}-${b[2]},${b[3]}`),
  flatShare: pct(flatTotal), onShare: sum("on"), nearShare: sum("near"), offShare: sum("off"),
  panes: shareOf(["base", "mantle", "crust"]), mantle: shareOf(["mantle"]), fillFamily: shareOf(fillNames), accents: shareOf(accentNames),
  perAccent: Object.fromEntries(accentNames.map((n) => [n, pct(byName[n] || 0)]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])),
  clusters: rows,
};
if (json) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }

console.log(`${frame}  ${report.size}  ${cand.t} ${cand.fl}${report.guessed ? " (guessed from the background)" : ""}${ignores.length ? `  ignoring ${report.ignored.join(" ")}` : ""}`);
if (mismatch) console.log(`WARNING: ${mismatch}`);
console.log(`all pixels: panes ${report.panes}% (mantle ${report.mantle}%), fill family ${report.fillFamily}%, all accents ${report.accents}%`);
console.log(`  per accent: ${Object.entries(report.perAccent).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}`);
console.log(`flat ${report.flatShare}% of the frame; clusters >= ${minShare}%: on ${report.onShare}%, near ${report.nearShare}%, off ${report.offShare}%`);
console.log("");
console.log("share%  colour   verdict  dE    nearest  box               names");
for (const r of rows) console.log(`${String(r.share).padStart(6)}  ${r.hex}  ${(r.verdict + (r.grey ? "!" : "")).padEnd(7)}  ${String(r.dE).padStart(4)}  ${r.match}  ${(r.verdict === "on" ? "" : r.box).padEnd(16)}  ${r.names.slice(0, 4).join(", ")}${r.names.length > 4 ? ", ..." : ""}`);
if (rows.some((r) => r.grey)) console.log("\n! untinted grey: Darkberry neutrals all carry the plum hue, so this is likely the app's own colour");
