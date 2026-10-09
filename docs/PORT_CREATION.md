# Port creation

How a Darkberry port is laid out and added. The layout is based on 
[Catppuccin's](https://github.com/catppuccin/catppuccin/blob/main/docs/port-creation.md),
which keeps one repository per port, folded into this one repository: every port is a
folder under `ports/` with the same shape a Catppuccin port repository has, and the
[template](../template/) is Catppuccin's
[port template](https://github.com/catppuccin/template) with Darkberry's names in it. The
colour rules are in [STYLE_GUIDE.md](../STYLE_GUIDE.md); this file is only the shape.

## What a port looks like

```
ports/<key>/
  README.md          written by build.mjs from template/README.md; never edited by hand
  assets/            screenshots: preview.webp (all flavours in one image) and one <flavour>.webp each
  <theme files>      one installable unit per flavour, named as STYLE_GUIDE.md step 9 says
  <tint>/            the same again for each tint (see Tints below)
```

`<key>` is the app's name in lower kebab case (`ls-colors`, `notepadpp`), as Catppuccin
names its repositories.

## Tints

Every port is also built in each tint from `src/tints.json` (`src/variants/<tint>.json`),
under the tint's own id and name, so `cloudberry-mire.conf` can sit beside
`darkberry-mire.conf` in an app's theme folder. Where the tint goes depends on whether
the app's format can hold several themes in one unit:

- **One theme per file or folder** (every port but two): the tint gets
  `ports/<key>/<tint>/`, with the same files, its own `assets/` for screenshots and its
  own README. The bar of tint badges under every README's badges links between them.
- **Every tint in one unit**: VS Code, where one extension contributes many themes, gets
  `ports/vscode/with-tints/`, a second extension with all twenty; the GIMP palette gets
  `ports/gpl/darkberry-with-tints.gpl` and one `<tint>.gpl` per tint beside the Darkberry
  files.

`build.mjs` does the routing in `route()`: a tint build writes only under `ports/`, into
the subfolder, and the default build writes the two all-in-one units, the docs and the
root README. `package.sh` makes a plain and a with-tints package of every port.

The README follows the template top to bottom: logo and title, the three badges, the main
preview, a collapsible preview per flavour, **Usage**, **Created by**, the footer and the
licence badge. Two parts of it are the port's own:

- **Usage** comes from `src/usage/<key>.md`: numbered install steps, then the version floor
  and any environment the colours need, then anything the reader has to know that the
  file's own header does not say. Paths are relative to the port folder ("copy a flavour
  from this folder"), and a related port is linked as `[Kate](../kate)`. A FAQ, if the
  port needs one, goes at the end of the same file under `## 🙋 FAQ`, in Catppuccin's
  `Q:`/`A:` list form.
- **Previews** are the port's own screenshots when `ports/<key>/assets/` has them, and the
  generated palette strips under `assets/previews/` when it does not. Screenshots are
  `.webp`, one per flavour named `<flavour id>.webp`, plus `preview.webp`, the four
  layered into one image the way Catppuccin's
  [catwalk](https://github.com/catppuccin/catwalk) does it. Missing files fall back one
  at a time, so a port can ship with only `preview.webp`.

Everything else in the README is filled from `src/ports.json` and `src/palette.json`.

## The registry

`src/ports.json` is the shape of Catppuccin's `resources/ports.yml`, one entry per port:

```json
{ "key": "kitty", "name": "kitty", "url": "https://sw.kovidgoyal.net/kitty/", "emoji": "🐱",
  "categories": ["terminal"], "platform": ["linux", "macos"] }
```

- `key` is the folder under `ports/` and the file under `src/usage/`.
- `name` is the app's name capitalised the way the app writes it; `url` is the app's
  home page, which the README title links to.
- `emoji` is the one that best represents the app, as Catppuccin puts one in each
  repository's description. It leads the port's line in the README list.
- `categories` are keys from `src/categories.json`, which carries Catppuccin's category
  keys, names and emoji. The first category is where the port is listed in `README.md`.
- `platform` is `linux`, `macos`, `windows`, `web`, or empty for a format that has no
  platform of its own (Base24).
- `listing`, present once the port is published somewhere, is the venue's `name` and the
  `url` of the listing, plus `tints`, the tinted edition's own listing, when that is a
  separate item (VS Code's with-tints extension). The README's Usage, the port's line in
  `README.md` and the site's Ports page all link it; a port without one links its folder.
- `darkOnly`, optional, `true` for a port that ships only the dark flavours (Dark Reader):
  the README then lists no preview for Wisp.
- `maintainers`, optional, adds names to **Created by** ahead of the repository's
  maintainers.

The build fails when a `ports/` folder is missing from the registry, when a registry entry
has no output folder or usage file, or when a category is not in `src/categories.json`.

## Adding a port

The `darkberry-port` skill under `.claude/skills/` walks a contributor through all of
this in Claude Code, including the prototyping, screenshot and review steps; the steps
below are the same road without the guide.

1. Follow *Porting an application* in `STYLE_GUIDE.md` for the template, override file,
   build wiring and assertions. Those steps make `ports/<key>/` exist.
2. Add the entry to `src/ports.json` and write `src/usage/<key>.md`.
3. `node build.mjs`. It writes `ports/<key>/README.md`, an empty `ports/<key>/assets/`
   and the port's line in `README.md`.
4. Take the screenshots into `ports/<key>/assets/` and rebuild so the README picks them up.
5. The install line in `.github/workflows/release.yml`'s release notes. The site's Ports
   page and `package.sh` both read `src/ports.json`, so neither needs a change.
6. When the port goes live somewhere, add its `listing` to `src/ports.json` and rebuild.

## Generated assets

`assets/` at the repository root is written by the build and is not edited by hand:

```
assets/logos/<edition>-logo.svg        the logo per edition, its initial over the berries (and a PNG copy, which the VS Code READMEs and icon use)
assets/logos/<edition>-logo-words.svg  the same with the edition's name underneath
assets/previews/preview.png            palette strips of all four flavours, the fallback main preview
assets/previews/<flavour>.png          one flavour's strip, the fallback per-flavour preview
assets/previews/<tint>/...             the same strips for each tint
assets/footers/darkberry_on_line.png   the footer line with one dot per flavour
assets/misc/transparent.png            the spacer the template's title uses
```

They are drawn by `lib/png.mjs`, a small PNG writer, so the build still has no
dependencies. The logos are the exception: `node tools/logo.mjs` makes them from the one drawn logo in
`assets/logos/source/`, and needs Inkscape and the Manufacturing Consent font. It sets each
edition's initial and name the same way and converts the lettering to paths, since a README
shows the logo through `<img>`, which cannot load the font. Port screenshots under `ports/<key>/assets/` are the one thing under
`ports/` that is made by hand.
