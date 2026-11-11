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
if (patch["darkberry-patch"] !== 1) { console.error("Not a Darkberry Studio patch."); process.exit(1); }

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

// The VS Code template sets both tab lines itself. An override is written only for a line whose
// wanted state differs from the template's; a value ending in 00 is transparent, so that line is off.
const OVR = "src/overrides/vscode.json";
if (patch.vscodeTabLine) {
  const O = fs.existsSync(OVR) ? read(OVR) : { overrides: [] };
  const lines = { top: "tab.activeBorderTop", bottom: "tab.activeBorder" };
  const T = read("src/ports/vscode.json").colors;
  O.overrides = (O.overrides || []).filter((o) => !Object.values(lines).includes(o.key));
  for (const [side, key] of Object.entries(lines)) {
    const value = side === patch.vscodeTabLine ? "{ui.tab.indicator}" : "{ui.tab.indicator}00";
    if (T[key] !== value) O.overrides.push({ key, value, why: patch.vscodeTabLine === "none" ? "No active-tab line, chosen in Darkberry Studio." : `Show the active-tab highlight as a ${patch.vscodeTabLine} line, chosen in Darkberry Studio.` });
  }
  var tabOverrides = O;
  log.push(`VS Code tab line: ${patch.vscodeTabLine}`);
}

if (errors.length) { errors.forEach((e) => console.error("error:", e)); console.error("Nothing was written."); process.exit(1); }
write("src/palette.json", P); write("src/roles.json", R);
// An empty override list is no file at all: the build reads a missing file as no overrides.
if (tabOverrides) { if (tabOverrides.overrides.length) write(OVR, tabOverrides); else if (fs.existsSync(OVR)) fs.rmSync(OVR); }
log.forEach((l) => console.log(l));
if (flag !== "--no-build") execFileSync("node", ["build.mjs"], { stdio: "inherit" });
