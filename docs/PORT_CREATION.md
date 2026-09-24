# Port creation

How a Darkberry port is laid out and added. The layout is
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
```

`<key>` is the app's name in lower kebab case (`ls-colors`, `notepadpp`), as Catppuccin
names its repositories.

The README follows the template top to bottom: logo and title, the three badges, the main
preview, a collapsible preview per flavour, **Usage**, **Thanks to**, the footer and the
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
- `maintainers`, optional, adds names to **Thanks to** ahead of the repository's
  maintainers.

The build fails when a `ports/` folder is missing from the registry, when a registry entry
has no output folder or usage file, or when a category is not in `src/categories.json`.

## Adding a port

1. Follow *Porting an application* in `STYLE_GUIDE.md` for the template, override file,
   build wiring and assertions. Those steps make `ports/<key>/` exist.
2. Add the entry to `src/ports.json` and write `src/usage/<key>.md`.
3. `node build.mjs`. It writes `ports/<key>/README.md`, an empty `ports/<key>/assets/`
   and the port's line in `README.md`.
4. Take the screenshots into `ports/<key>/assets/` and rebuild so the README picks them up.
5. A `zip` line in `package.sh` (with `-x "assets/*"`), the install line in
   `.github/workflows/release.yml`'s release notes, and a card in `src/site/index.html`.

## Generated assets

`assets/` at the repository root is written by the build and is not edited by hand:

```
assets/logos/darkberry.png             the four flavours' bases quartered around a jam centre
assets/previews/preview.png            palette strips of all four flavours, the fallback main preview
assets/previews/<flavour>.png          one flavour's strip, the fallback per-flavour preview
assets/footers/darkberry_on_line.png   the footer line with one dot per flavour
assets/misc/transparent.png            the spacer the template's title uses
```

They are drawn by `lib/png.mjs`, a small PNG writer, so the build still has no
dependencies. Port screenshots under `ports/<key>/assets/` are the one thing under
`ports/` that is made by hand.
