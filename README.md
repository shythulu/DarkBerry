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
ports/gpl/                the palette as GIMP .gpl files, one per flavour and one with all four
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

### GIMP, Inkscape and darktable

These are GTK 3 applications, and each theme covers a different layer.

`ports/gtk/` is a GTK 3 theme: copy a flavour folder into `~/.themes/` and select it as
your GTK theme. That reaches Inkscape and any other GTK 3 application that follows the
system theme. It recolours Adwaita rather than replacing it, so a few surfaces Adwaita
hardcodes stay grey.

`ports/darktable/` and `ports/gimp/` exist because those two ignore the system theme and
use their own. Each file's header has its install path, both of which involve sitting the
file beside the application's own CSS so the `@import` resolves.

For colour work, keep the image surround neutral. A saturated frame shifts how you judge
colour in the picture, which is why both applications ship greys. Darkberry uses its least
saturated colours there, but a grey theme is still the right tool for grading.

### Colour palettes for GIMP, Inkscape and Krita

`ports/gpl/` holds the palette itself, not a theme, in the GIMP palette format that GIMP,
Inkscape, Krita, MyPaint and Aseprite all import. There is one file per flavour and
`darkberry.gpl` with every flavour's colours, each labelled with its flavour and name.

- GIMP: Edit > Preferences > Folders > Palettes shows the folder; copy the files in, or
  Windows > Dockable Dialogs > Palettes, then Import Palette from a file.
- Inkscape: copy the files into `~/.config/inkscape/palettes/` and pick them from the
  menu at the left end of the palette bar.
- Krita: Settings > Manage Resources > Import Resources.

### Notepad++

Copy a `.xml` file from `ports/notepadpp/` into `%APPDATA%\\Notepad++\\themes\\`, restart
Notepad++, then Settings > Style Configurator and pick the flavour. Fonts are left blank so
your own choice survives.

### lsd

Copy a flavour from `ports/lsd/` to `~/.config/lsd/colors.yaml`, and set
`color: {theme: custom}` in `~/.config/lsd/config.yaml`.

Needs lsd 1.1 or newer; below that lsd rejects hex strings and silently drops the whole
theme, so for lsd 1.0 (Ubuntu 24.04) use the `.256.yaml` companion, the same theme as
xterm-256 indices. Written against lsd 1.2.0, whose theme struct rejects unknown keys. Notably `file-type` is
skipped in that version, so a theme carrying it is discarded whole and lsd falls back to its
defaults without saying so. Every key here is one lsd 1.2.0 accepts.

That skipped key is why `ports/ls-colors/` exists, and why you want both halves. colors.yaml
reaches only the metadata columns; the file and folder names, which are most of what a listing
actually shows, are left on lsd's stock blue and green until LS_COLORS is set.

### LS_COLORS

Source a flavour from `ports/ls-colors/` in your shell rc:

```sh
. ~/.config/darkberry/darkberry-mire.sh
```

It exports `LS_COLORS`, which lsd, GNU `ls`, eza, fd, dust, delta and zsh's completion menu all
read, so the one file themes every listing on the machine. Directories take the accent; source,
configuration, prose, media and archives each take a hue; build leavings and backups sit under
the reading colour. Executables stay green and symlinks stay cool, because those two meanings
are older than any theme.

BSD `ls`, which is what macOS ships without coreutils, reads `LSCOLORS` instead -- a different
format limited to the eight ANSI colours, which cannot carry these. Use lsd or GNU `ls` there.

### JankyBorders (macOS)

Copy a flavour from `ports/borders/` over `~/.config/borders/bordersrc` and restart borders
(`brew services restart borders`). The focused window's border follows `ui.border.active`,
the accent, and every other window `ui.border.inactive`. Width, style and hidpi are plain
defaults in the file; only the two colours are the theme.

### starship

Copy a flavour from `ports/starship/` over `~/.config/starship.toml`. A two-line
box-drawing prompt: row one is where you are, row two is the caret with the last command's
result on the right margin. The frame is plain Unicode, so it survives without a Nerd Font;
only the module icons need one.

The palette inside each file is split on purpose. Entries named after a role take their
colour from `src/roles.json`, so anything meaning "this failed" follows `ui.error`. Entries
named after a palette colour cover what no role describes: a language's brand colour, or a
git state that only needs to be distinguishable.

### Base24 and Tinted8

Two ports carry Darkberry into [Tinted Theming](https://github.com/tinted-theming), whose
builders turn one scheme file into configuration for seventy-odd applications. These are the
only ports here that theme apps Darkberry has never heard of.

Copy a flavour from `ports/base24/` or `ports/tinted8/` into a builder's schemes directory
and build:

```sh
tinty install                      # or: tinted-builder-rust build .
```

Which one depends on the builder. **Base24** is the widely supported system: twenty-four
fixed slots, `base00` to `base17`, understood by every Base16 and Base24 template.
**Tinted8** is the newer spec: eight anchor colours that a builder expands, plus optional
`syntax` and `ui` blocks that let a scheme state what it actually means instead of leaving
the builder to guess. Darkberry fills both blocks, so the Tinted8 file is the more faithful
of the two -- it carries the syntax assignments token for token from the VS Code port, and
names the cursor, gutter, current line, selection and status colours outright.

Base24 has to compress more. Each of its slots does two jobs at once, an editor meaning and
an ANSI code, and where those disagree the file keeps the ANSI half so that a terminal built
from it matches the kitty, Ghostty and Konsole ports, and keeps the legible half wherever the
spec asks for legibility by name. The header comment in each generated file says which slots
were compromised and why; `src/ports/base24.yaml` carries the full reasoning.

Both were checked by building all four flavours with `tinted-builder-rust` 0.21.0, which is
stricter than the spec it implements: its scheme struct denies unknown fields, so a single key
spelled the way the styling spec prints it makes the builder reject the whole file -- the same
trap lsd's theme struct sets. The templates use the names the builder accepts, and every value
they declare was rendered back out and compared: 105 keys in the Tinted8 file, all 24 slots in
the Base24 one.

### micro

Copy a `.micro` file from `ports/micro/` into `~/.config/micro/colorschemes/`, then
`set colorscheme darkberry-mire`.

### Kate

Copy a `.theme` file from `ports/kate/` into
`~/.local/share/org.kde.syntax-highlighting/themes/`, then Settings > Configure Kate >
Fonts & Colors. The surrounding window chrome comes from the KDE colour scheme below.

### Chrome and Edge

Unzip `ports/chrome/` somewhere permanent, open `chrome://extensions`, turn on Developer
mode and use *Load unpacked* on a flavour's folder. Chromium themes install like extensions,
so a folder loaded this way stays until you remove it.

### Nimbalyst

Copy a flavour's folder from `ports/nimbalyst/` into Nimbalyst's themes directory, then pick
it under Settings > Themes. Each folder holds a `theme.json`, which is how Nimbalyst
discovers a theme.

### KDE Plasma

Copy the `.colors` files from `ports/kde/` into `~/.local/share/color-schemes/`, then pick a
flavour in System Settings > Colors. The scheme covers every Qt and KDE application; the
Plasma Style and window decorations are artwork rather than colour, so they stay as they are.

### Konsole

Copy the `.colorscheme` files from `ports/konsole/` into `~/.local/share/konsole/`, then
Settings > Edit Current Profile > Appearance.

### Obsidian

Copy a flavour's folder from `ports/obsidian/` into your vault's `.obsidian/themes/`, keeping the
folder name, then pick it under Settings > Appearance > Themes. Each flavour is its own theme
and paints both of Obsidian's colour schemes, so the Appearance light/dark switch leaves the
flavour alone.

### VS Code (and Cursor, VSCodium, Windsurf)

Install `darkberry-theme-<version>.vsix` via Extensions > `...` > Install from VSIX, or `code --install-extension darkberry-theme-<version>.vsix`. Then pick a flavour with Ctrl+K Ctrl+T. To publish, set your own `publisher` in `build.mjs`.

### Firefox

Install from [addons.mozilla.org](https://addons.mozilla.org/firefox/search/?q=darkberry).
Each flavour is its own theme there, and updates arrive automatically.

The `.xpi` files attached to a release are the unsigned build output, kept for archival.
Firefox refuses unsigned add-ons on release and beta — themes included — so those install
only through `about:debugging` > This Firefox > Load Temporary Add-on, or permanently on
Developer Edition, Nightly or an unbranded Release/Beta build with
`xpinstall.signatures.required` set to `false`. See [docs/AMO.md](docs/AMO.md) for how the
listing is maintained.

## Credits

Darkberry is modelled on [Catppuccin](https://github.com/catppuccin) (MIT): its four-flavour structure, twelve-neutral ladder and naming, palette file format, style-guide approach, ANSI mapping and bright-colour formula, and the review rules the build enforces. Deliberate differences from Catppuccin are listed, with reasons, in `docs/ROLES.md`. No Catppuccin source code is included; the colour maths is reimplemented in `lib/color.mjs`.

The one piece of inherited code is the list of syntax rules in `src/vscode/template.json`, which began as a derivative of Pixel Berry by germainelry (MIT). Its licence requires keeping that copyright notice, so it remains in `LICENSE` for as long as the template derives from it.
