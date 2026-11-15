// cvd.mjs <hexA> <hexB> [<hexA> <hexB> ...]      distance of each pair, normal and under CVD
// cvd.mjs --roles <flavour> [palette.json]         the meaning-by-hue role pairs for one built flavour
//
// Prints OKLab deltaE x100 (the unit build.mjs uses for syntax distinctness) for each pair as
// seen normally and under protanopia, deuteranopia and tritanopia, plus the WCAG contrast ratio.
// Thresholds (justified in references/wcag.md): a meaning pair under 5 in any condition FAILS
// (the build's own floor for syntax pairs); under 10 WARNS, because status colours are read
// apart from each other, not side by side, and need more room than adjacent syntax tokens.
//
// Simulation: Machado, Oliveira & Fernandes, "A Physiologically-based Model for Simulation of
// Color Vision Deficiency", IEEE TVCG 15(6), 2009. Severity 1.0 matrices, applied in linear RGB
// (values as published in the paper's supplementary table and reproduced by colorspacious /
// DaltonLens). Dichromat simulation is a worst case; most CVD is anomalous (milder).
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const { rgb, hexOf, lin, gam, deltaE, contrast } = await import(path.join(root, "lib/color.mjs"));

const MACHADO = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691088, 0.304180]],
};
const FAIL = 5, WARN = 10;

export const simulate = (hex, kind) => {
  const M = MACHADO[kind];
  const v = rgb(hex).map(lin);
  return hexOf(M.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]).map((x) => gam(Math.min(1, Math.max(0, x)))));
};
export const report = (a, b) => {
  const row = { normal: deltaE(a, b), contrast: contrast(a, b) };
  for (const k of Object.keys(MACHADO)) row[k] = deltaE(simulate(a, k), simulate(b, k));
  row.worst = Math.min(row.normal, row.protanopia, row.deuteranopia, row.tritanopia);
  row.flag = row.worst < FAIL ? "FAIL" : row.worst < WARN ? "warn" : "ok";
  return row;
};

// Pairs whose difference carries a meaning by hue alone somewhere in the ports.
const MEANING_PAIRS = [
  ["ui.success", "ui.error", "status text, git status letters, diff marks"],
  ["ui.warning", "ui.error", "diagnostic severity"],
  ["ui.diff.added", "ui.diff.removed", "diff line backgrounds"],
  ["syntax.diff.removed", "ui.success", "removed vs added diff text"],
  ["ui.info", "ui.success", "info vs hint/success"],
  ["ansi.1", "ansi.2", "ANSI red vs green"],
  ["ansi.9", "ansi.10", "bright red vs bright green"],
  ["ui.mark1", "ui.mark2", "search hit vs replace preview"],
  ["ui.mark2", "ui.mark3", "hint label first vs rest"],
  ["ui.mark1", "ui.mark3", "marks 1 and 3"],
];

const fmt = (n) => n.toFixed(1).padStart(5);
const line = (label, a, b, r) =>
  console.log(`${label.padEnd(44)} ${a} ${b}  ${fmt(r.normal)} ${fmt(r.protanopia)} ${fmt(r.deuteranopia)} ${fmt(r.tritanopia)}  ${r.contrast.toFixed(2).padStart(5)}:1  ${r.flag}`);
const header = (label) => console.log(`${label.padEnd(44)} ${"A".padEnd(7)} ${"B".padEnd(7)}  ${"norm".padStart(5)} ${"prot".padStart(5)} ${"deut".padStart(5)} ${"trit".padStart(5)}  ${"ratio".padStart(7)}  flag`);

const args = process.argv.slice(2);
if (process.argv[1]?.endsWith("cvd.mjs")) {
  if (args[0] === "--roles") {
    const flavour = args[1];
    const P = JSON.parse(fs.readFileSync(path.join(root, args[2] || "src/palette.json"), "utf8"));
    const ROLES = JSON.parse(fs.readFileSync(path.join(root, "src/roles.json"), "utf8"));
    const { indexRoles, flavourContext } = await import(path.join(root, "lib/resolve.mjs"));
    const ids = flavour === "all" ? Object.keys(P.flavours) : [flavour];
    let worst = "ok";
    for (const id of ids) {
      const f = P.flavours[id];
      if (!f) { console.error(`unknown flavour "${id}"; have: ${Object.keys(P.flavours).join(", ")}`); process.exit(1); }
      const ctx = flavourContext(id, f, ROLES, indexRoles(ROLES));
      console.log(`\n## ${f.name} (${id})`);
      header("pair");
      for (const [a, b, why] of MEANING_PAIRS) {
        const ha = ctx.resolve(a)[0], hb = ctx.resolve(b)[0];
        const r = report(ha, hb);
        line(`${a} / ${b}`, ha, hb, r);
        if (r.flag === "FAIL" || (r.flag === "warn" && worst === "ok")) worst = r.flag;
      }
    }
    console.log(`\nunits: OKLab deltaE x100 (same as docs/CHECKS.md). FAIL < ${FAIL}, warn < ${WARN}.`);
    process.exit(worst === "FAIL" ? 1 : 0);
  }
  if (args.length < 2 || args.length % 2 || !args.every((h) => /^#?[0-9a-f]{6}$/i.test(h))) {
    console.error("usage: node cvd.mjs <hexA> <hexB> [<hexA> <hexB> ...]\n       node cvd.mjs --roles <wisp|fen|mire|blackwater|all> [palette.json]");
    process.exit(1);
  }
  header("pair");
  let worst = "ok";
  for (let i = 0; i < args.length; i += 2) {
    const a = args[i].startsWith("#") ? args[i] : `#${args[i]}`, b = args[i + 1].startsWith("#") ? args[i + 1] : `#${args[i + 1]}`;
    const r = report(a, b);
    line(`${a} vs ${b}`, a, b, r);
    if (r.flag === "FAIL" || (r.flag === "warn" && worst === "ok")) worst = r.flag;
  }
  console.log(`units: OKLab deltaE x100. FAIL < ${FAIL}, warn < ${WARN}.`);
  process.exit(worst === "FAIL" ? 1 : 0);
}
