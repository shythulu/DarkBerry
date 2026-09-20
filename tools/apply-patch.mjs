// Applies a patch exported from Darkberry Studio (docs/studio.html) to the source files.
//   node tools/apply-patch.mjs patch.json [--no-build]
// Patch format:
//   { "darkberry-patch": 1,
//     "palette": { "<flavour>": { "<colour>": "#rrggbb" } },
//     "roles":   { "<role>": { "value": "petal" | "mix(a,b,0.5)", "why": "..." } },
//     "vscodeTabLine": "none" | "top" | "bottom" }
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const [file, flag] = process.argv.slice(2);
if (!file) { console.error("usage: node tools/apply-patch.mjs patch.json [--no-build]"); process.exit(1); }
const patch = JSON.parse(fs.readFileSync(file, "utf8"));
if ((patch["darkberry-patch"] ?? patch["bramble-patch"]) !== 1) { console.error("Not a Darkberry Studio patch."); process.exit(1); }

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n");
const P = read("src/palette.json"), R = read("src/roles.json");
const CTP = { blossom: "rosewater", petal: "flamingo", berry: "pink", plum: "mauve", cranberry: "red", cherry: "maroon", apricot: "peach", honey: "yellow", gooseberry: "green", juniper: "teal", frost: "sky", bilberry: "sapphire", blueberry: "blue", lavender: "lavender" };
const log = [], errors = [];

for (const [fl, cols] of Object.entries(patch.palette || {})) {
  if (!P.flavours[fl]) { errors.push(`unknown flavour ${fl}`); continue; }
  for (const [name, hex] of Object.entries(cols)) {
    if (!(name in P.flavours[fl].colors)) { errors.push(`unknown palette colour ${name}`); continue; }
    if (!/^#[0-9a-f]{6}$/i.test(hex)) { errors.push(`${fl}.${name}: "${hex}" is not #rrggbb`); continue; }
    log.push(`palette ${fl}.${name}: ${P.flavours[fl].colors[name]} → ${hex.toLowerCase()}`);
    P.flavours[fl].colors[name] = hex.toLowerCase();
  }
}

for (const [role, change] of Object.entries(patch.roles || {})) {
  const [group, ...rest] = role.split("."), key = rest.join(".");
  const r = R[group]?.[key];
  if (!r || typeof r !== "object") { errors.push(`unknown role ${role}`); continue; }
  const old = r.value;
  if (JSON.stringify(old) === JSON.stringify(change.value)) continue;
  r.value = change.value;
  if (r.catppuccin === "=") {
    if (!change.why) { errors.push(`${role} was aligned with Catppuccin; changing it needs a "why"`); continue; }
    r.catppuccin = typeof old === "string" ? (CTP[old] || old) : JSON.stringify(old);
    r.why = change.why;
  } else if (r.catppuccin && typeof change.value === "string" && CTP[change.value] === r.catppuccin) {
    r.catppuccin = "="; delete r.why;
    log.push(`${role} is aligned with Catppuccin again`);
  } else if (change.why) r.why = change.why;
  log.push(`role ${role}: ${JSON.stringify(old)} → ${JSON.stringify(change.value)}`);
}

if (patch.vscodeTabLine) {
  const O = read("src/overrides/vscode.json");
  O.overrides = (O.overrides || []).filter((o) => !["tab.activeBorderTop", "tab.activeBorder"].includes(o.key));
  if (patch.vscodeTabLine !== "none") {
    const key = patch.vscodeTabLine === "top" ? "tab.activeBorderTop" : "tab.activeBorder";
    O.overrides.push({ key, value: "{ui.tab.indicator}", why: `Show the active-tab highlight as a ${patch.vscodeTabLine} line, matching Firefox and kitty.` });
  }
  var tabOverrides = O;
  log.push(`VS Code tab line: ${patch.vscodeTabLine}`);
}

if (errors.length) { errors.forEach((e) => console.error("error:", e)); console.error("Nothing was written."); process.exit(1); }
write("src/palette.json", P); write("src/roles.json", R);
if (tabOverrides) write("src/overrides/vscode.json", tabOverrides);
log.forEach((l) => console.log(l));
if (flag !== "--no-build") execFileSync("node", ["build.mjs"], { stdio: "inherit" });
