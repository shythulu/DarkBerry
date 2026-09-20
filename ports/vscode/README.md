# Darkberry

A bog-witch berry theme in four flavours, grown from Benjamin Moore Dark Purple 2073-10 (`#4b3540`).

| Flavour | Type | |
|---|---|---|
| Wisp | light | Will-o'-the-wisp glow: plum-violet text on pale cream |
| Fen | dark | Soft, rosy dusk; the background is within a shade of the paint colour |
| Mire | dark | The main dark flavour: wine-dark mire with berry accents |
| Blackwater | dark | Deepest wine, like black bog water |

## Repository layout

```
src/palette.json          layer 1: the untinted default palette, 12 neutrals + 14 accents + jam/onjam per flavour
src/roles.json            layer 2: what each colour means, shared by every port, with Catppuccin comparison
src/overrides/            layer 3: rare port-only exceptions, each with a reason
src/ports/                kitty, Ghostty and Firefox templates (roles in {braces}, no hex)
src/vscode/template.json  VS Code template (every syntax rule uses a syntax.* role)
src/variants/             nature tints of Darkberry: lingonberry, cloudberry, crowberry, blueberry
lib/color.mjs             colour maths, including Catppuccin's bright-ANSI formula
build.mjs                 generates everything below and enforces the rules (Node 18+, no dependencies)
dist/palette.json         Catppuccin-schema palette: hex, rgb, hsl, oklch, ANSI normal and bright
ports/                    generated kitty, Ghostty, VS Code and Firefox themes
docs/ROLES.md             every role, its value per flavour, and deviations from Catppuccin
docs/CHECKS.md            contrast and syntax-distinctness results
docs/USAGE.md             which roles and ports use each palette colour
docs/specimen.html        editor, terminal and browser in all four flavours on one page
docs/studio.html          Darkberry Studio: edit palette and roles live, then export a patch
tools/variants.mjs        makes Darkberry variations: node tools/variants.mjs <variant> [hue step] [chroma step]
tools/spread.mjs          nudges key syntax colours apart when they're too close
tools/where.mjs           shows what drives any setting: node tools/where.mjs tab
tools/apply-patch.mjs     applies a patch exported from Darkberry Studio, then rebuilds
tools/site.mjs            builds the GitHub Pages showcase into site/
lib/resolve.mjs           role resolution shared by the build and the site
STYLE_GUIDE.md            the rules
```

`node build.mjs` rebuilds everything and fails if a rule is broken. `./package.sh` also builds the VS Code `.vsix` and Firefox `.xpi` files. To build a variant instead of the default: `node build.mjs src/variants/cloudberry.json`.

## Website

A showcase site is generated from the palette and published to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`. It wears the theme: pick a flavour or tint and the whole page recolours.

1. Set your repository's URL in `src/site/config.json`.
2. In the repository's Settings > Pages, set the source to **GitHub Actions**.
3. Push to `main`. The site appears at `https://<your-name>.github.io/<repo>/`.

To preview locally: `node build.mjs && node tools/site.mjs`, then open `site/index.html`. The `site/` folder is generated and ignored by git.

## Adjusting colours

Open `docs/studio.html` (regenerated on every build, so it always starts from the current theme). Click anything in its previews to see which role and palette colour it comes from, change it, check the results, then export a patch and run `node tools/apply-patch.mjs patch.json`.

## Install

Every tagged release carries the packaged files for each app: a `.vsix` for VS Code, an
`.xpi` per flavour for Firefox, and zips of the kitty and Ghostty configs. Download them
from [Releases](https://github.com/shythulu/DarkBerry/releases), or build them yourself
with `./package.sh`, which writes the same set into `dist/`.

### kitty

Copy a file from `ports/kitty/` to `~/.config/kitty/themes/`, then run `kitty +kitten themes` and pick it. Or add to `kitty.conf`:

```
include themes/darkberry-mire.conf
```

To follow the OS light/dark setting (kitty 0.38+), copy two flavours to `~/.config/kitty/` named `light-theme.auto.conf` and `dark-theme.auto.conf`.

### Ghostty

Copy the files from `ports/ghostty/` to `~/.config/ghostty/themes/`, keeping their names, then in your Ghostty config:

```
theme = light:Darkberry Wisp,dark:Darkberry Mire
```

### Obsidian

Copy a flavour's folder from `ports/obsidian/` into your vault's `.obsidian/themes/`, keeping the
folder name, then pick it under Settings > Appearance > Themes. Each flavour is its own theme
and paints both of Obsidian's colour schemes, so the Appearance light/dark switch leaves the
flavour alone.

### VS Code (and Cursor, VSCodium, Windsurf)

Install `darkberry-theme-<version>.vsix` via Extensions > `...` > Install from VSIX, or `code --install-extension darkberry-theme-<version>.vsix`. Then pick a flavour with Ctrl+K Ctrl+T. To publish, set your own `publisher` in `build.mjs`.

### Firefox

Unsigned themes load in two ways:

- Temporarily in any Firefox: `about:debugging` > This Firefox > Load Temporary Add-on > choose `ports/firefox/<flavour>/manifest.json`. It's removed when Firefox restarts.
- Permanently: submit the `.xpi` from `dist/` to addons.mozilla.org as a self-distributed (unlisted) add-on to get it signed. Developer Edition and Nightly can also install unsigned files with `xpinstall.signatures.required` set to `false`.

## Credits

Darkberry is modelled on [Catppuccin](https://github.com/catppuccin) (MIT): its four-flavour structure, twelve-neutral ladder and naming, palette file format, style-guide approach, ANSI mapping and bright-colour formula, and the review rules the build enforces. Deliberate differences from Catppuccin are listed, with reasons, in `docs/ROLES.md`. No Catppuccin source code is included; the colour maths is reimplemented in `lib/color.mjs`.

The one piece of inherited code is the list of syntax rules in `src/vscode/template.json`, which began as a derivative of Pixel Berry by germainelry (MIT). Its licence requires keeping that copyright notice, so it remains in `LICENSE` for as long as the template derives from it.
