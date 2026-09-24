# Darkberry

A berry-dark theme in four flavours, brewed from one can of Benjamin Moore Dark Purple 2073-10 (`#4b3540`). Same colours, same jobs, in every editor, terminal and browser it touches.

| Flavour | Type | |
|---|---|---|
| Wisp | light | Will-o'-the-wisp glow: plum-violet text on pale cream |
| Fen | dark | Rosy dusk. The background sits within a shade of the paint itself |
| Mire | dark | The main dark flavour. Wine-dark, with berry accents |
| Blackwater | dark | Deepest wine, like black bog water |

## Repository layout

```
src/palette.json          layer 1: the untinted default palette, 12 neutrals + 14 accents + jam/onjam per flavour
src/roles.json            layer 2: what each colour means, shared by every port, with Catppuccin comparison
src/overrides/            layer 3: rare port-only exceptions, each with a reason
src/ports/                every port's template: terminals, editors, browsers, shells (roles in {braces}, no hex)
src/ports.json            the port registry (name, app URL, categories, platforms), in the shape of Catppuccin's ports.yml
src/categories.json       the port categories, Catppuccin's keys and emoji
src/usage/<port>.md       each port's install steps, the Usage section of its README
template/                 the port template (Catppuccin's, adapted): README.md and assets/
src/vscode/template.json  VS Code template (every syntax rule uses a syntax.* role)
src/variants/             nature tints of Darkberry: lingonberry, cloudberry, crowberry, blueberry
src/tints.json            the tints in order, with the name, emoji and badge colour each shows in READMEs
lib/color.mjs             colour maths, including Catppuccin's bright-ANSI formula
build.mjs                 generates everything below and enforces the rules (Node 18+, no dependencies)
dist/palette.json         Catppuccin-schema palette: hex, rgb, hsl, oklch, ANSI normal and bright
ports/<port>/             generated theme files, a README written from template/, and assets/ for screenshots
ports/<port>/<tint>/      the same for each tint (VS Code and the GIMP palette carry tints in one unit instead)
assets/                   generated logo, footer and fallback palette previews used by every port README
ports/gpl/                the palette as GIMP .gpl files, one per flavour and one with all four
docs/ROLES.md             every role, its value per flavour, and deviations from Catppuccin
docs/CHECKS.md            contrast and syntax-distinctness results
docs/USAGE.md             which roles and ports use each palette colour
docs/specimen.html        editor, terminal and browser in all four flavours on one page
docs/studio.html          Darkberry Studio: edit palette and roles live, then export a patch
tools/variants.mjs        makes Darkberry variations: node tools/variants.mjs <variant> [hue step] [chroma step]
tools/spread.mjs          nudges key syntax colours apart when they're too close
tools/settle.mjs          settles a palette against the build's full syntax checks (used by variants.mjs)
tools/where.mjs           shows what drives any setting: node tools/where.mjs tab
tools/apply-patch.mjs     applies a patch exported from Darkberry Studio, then rebuilds
tools/site.mjs            builds the GitHub Pages showcase into site/
lib/resolve.mjs           role resolution shared by the build and the site
STYLE_GUIDE.md            the rules
docs/PORT_CREATION.md     how a port is laid out and added, after Catppuccin's port-creation guide
```

`node build.mjs` rebuilds everything, the tints included, and fails if a rule is broken. `./package.sh` also builds the VS Code `.vsix` and Firefox `.xpi` files. `node build.mjs src/variants/cloudberry.json` rebuilds one tint into its subfolders; `--no-tints` builds only the default.

## Website

A showcase site is generated from the palette and published to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`. The site wears the theme. Pick a flavour or tint and the whole page recolours.

1. Set your repository's URL in `src/site/config.json`.
2. In the repository's Settings > Pages, set the source to **GitHub Actions**.
3. Push to `main`. The site appears at `https://<your-name>.github.io/<repo>/`.

To preview locally: `node build.mjs && node tools/site.mjs`, then open `site/index.html`. The `site/` folder is generated and ignored by git.

## Adjusting colours

Open `docs/studio.html` (regenerated on every build, so it always starts from the current theme). Click anything in its previews to see which role and palette colour it comes from, change it, check the results, then export a patch and run `node tools/apply-patch.mjs patch.json`.

## Ports

Every port has its own folder under `ports/`, laid out the way the
[Catppuccin](https://github.com/catppuccin) organisation lays out its port repositories.
Each one holds a README with previews and install steps, an `assets/` folder for
screenshots, and the theme files. The README is the install guide for that app.

Each port is also built in the four tints (lingonberry, cloudberry, crowberry and
blueberry), and each tint in the four flavours. The bar under a README's badges links to
them. Most apps load one theme per file, so each tint gets its own subfolder and README.
VS Code and the GIMP palette hold every tint in one unit, so those two get a `with-tints`
extension and a `darkberry-with-tints.gpl` file instead.

Every tagged release ships two sets of packaged files. The plain set is a `.vsix` for
VS Code, an `.xpi` per flavour for Firefox and a zip of every other port. The with-tints
set is a second `.vsix`, an `.xpi` per tint and flavour and a `-with-tints` zip per port.
Download them from [Releases](https://github.com/shythulu/DarkBerry/releases), or run
`./package.sh` to build the same set into `dist/`.

<!-- ports:begin -->
<!-- Written by build.mjs from src/ports.json; edit that file, not this list. -->

### 👾 Code Editors & IDEs

- 🌙 [Neovim](ports/neovim#readme)
- ✏️ [micro](ports/micro#readme)
- 💜 [Visual Studio Code](ports/vscode#readme)
- 🗒️ [Kate](ports/kate#readme)
- 📄 [Notepad++](ports/notepadpp#readme)

### 📚 Libraries

- 🖌️ [GIMP Palette](ports/gpl#readme)

### 🐚 CLI Tools

- 🪟 [tmux](ports/tmux#readme)
- 🚀 [Starship](ports/starship#readme)
- 📁 [lsd](ports/lsd#readme)
- 📂 [LS_COLORS](ports/ls-colors#readme)
- 📊 [btop++](ports/btop#readme)
- 🦇 [bat](ports/bat#readme)

### 🌱 Terminals

- 🐱 [kitty](ports/kitty#readme)
- 👻 [Ghostty](ports/ghostty#readme)
- ⚡ [Alacritty](ports/alacritty#readme)
- 🐚 [Konsole](ports/konsole#readme)

### 🔧 System

- 🧩 [GTK 3](ports/gtk#readme)
- 🎛️ [Base24](ports/base24#readme)
- 🎚️ [Tinted8](ports/tinted8#readme)

### 🖥️ Desktop Environments

- 🖥️ [KDE Plasma](ports/kde#readme)

### 🪟 Window Managers

- 🔲 [JankyBorders](ports/borders#readme)

### 🏄 Browsers

- 🦊 [Firefox](ports/firefox#readme)
- 🌐 [Google Chrome](ports/chrome#readme)

### 📷 Photo & Video

- 📷 [darktable](ports/darktable#readme)
- 🎨 [GIMP](ports/gimp#readme)

### 📝 Note Taking

- 💎 [Obsidian](ports/obsidian#readme)
- ☁️ [Nimbalyst](ports/nimbalyst#readme)

<!-- ports:end -->

## Credits

Darkberry is modelled on [Catppuccin](https://github.com/catppuccin) (MIT): its four-flavour structure, twelve-neutral ladder and naming, palette file format, style-guide approach, ANSI mapping and bright-colour formula, and the review rules the build enforces. Deliberate differences from Catppuccin are listed, with reasons, in `docs/ROLES.md`. No Catppuccin source code is included; the colour maths is reimplemented in `lib/color.mjs`.

The one piece of inherited code is the list of syntax rules in `src/vscode/template.json`, which began as a derivative of Pixel Berry by germainelry (MIT). Its licence requires keeping that copyright notice, so it remains in `LICENSE` for as long as the template derives from it.
