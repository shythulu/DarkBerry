// Draws the Chrome Web Store images that are not screenshots, from the palette and the logo.
//   node tools/store-images.mjs [outdir]   -> <outdir>/icon-128.png and <outdir>/<flavour>/promo-440x280.png
// The store icon is the logo at 96x96 inside 128x128 of transparent padding, as the Web Store
// asks. Each promo tile is drawn as a page and captured with headless Chrome (CHROME, or the
// macOS default), so the tile uses the site's own fonts.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const out = path.resolve(process.argv[2] || "assets/store/chrome");
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const palette = JSON.parse(fs.readFileSync("src/palette.json", "utf8"));
const logo = path.resolve("assets/logos/darkberry-logo.svg");
const SWATCHES = ["berry", "plum", "cranberry", "apricot", "honey", "gooseberry", "frost", "blueberry"];

fs.mkdirSync(out, { recursive: true });
execFileSync("sh", ["-c", `rsvg-convert -w 96 -h 96 "$1" | magick - -background none -gravity center -extent 128x128 "$2"`, "sh", logo, `${out}/icon-128.png`]);
console.log("wrote", `${out}/icon-128.png`);

const tile = (name, c) => `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda+SC:wght@600&family=Manufacturing+Consent&display=block">
<style>
  html, body { margin: 0; width: 440px; height: 280px; overflow: hidden; }
  body { display: flex; align-items: center; gap: 14px; padding: 0 26px 0 18px; box-sizing: border-box;
    background: radial-gradient(circle at 70% 45%, ${c.jam}55, transparent 62%), ${c.base}; }
  img { width: 176px; height: 176px; flex: none; }
  .words { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  h1 { margin: 0; font: 57px/1 "Manufacturing Consent"; color: ${c.text}; }
  h1 span { color: ${c.jam}; }
  p { margin: 0; font: 600 20px/1 "Bodoni Moda SC"; letter-spacing: .28em; text-transform: lowercase; color: ${c.subtext0}; padding-left: .28em; }
  ul { display: flex; gap: 7px; margin: 6px 0 0; padding: 0; list-style: none; }
  li { width: 15px; height: 15px; border-radius: 50%; }
</style>
<img src="file://${logo}">
<div class="words">
  <h1>Dark<span>berry</span></h1>
  <p>${name}</p>
  <ul>${SWATCHES.map((k) => `<li style="background:${c[k]}"></li>`).join("")}</ul>
</div>`;

for (const [key, f] of Object.entries(palette.flavours)) {
  const dir = `${out}/${key}`, html = `${dir}/promo.html`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(html, tile(f.name, f.colors));
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--allow-file-access-from-files",
    "--window-size=440,280", "--virtual-time-budget=10000", `--screenshot=${dir}/promo-440x280.png`, `file://${html}`], { stdio: "ignore" });
  fs.rmSync(html);
  console.log("wrote", `${dir}/promo-440x280.png`);
}
