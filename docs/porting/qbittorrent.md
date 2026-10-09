# Porting and publishing qBittorrent

qBittorrent is a desktop BitTorrent client built on Qt 6, on Linux, macOS and Windows. A theme for its desktop client is one `.qbtheme` file, a Qt binary resource bundle. Qt's `rcc` compiles it from a `resources.qrc` that lists a `stylesheet.qss`, a `config.json` and any icons. The same three files in a plain folder also load as a theme, with no compile step. Reach is the Windows user base above all, because Windows has no system theming for Qt apps. Catppuccin's port has 930 stars, which is a lot for a torrent client theme. The research was done 2026-10-08.

## Porting

### Format

One theme is a bundle of three things. qBittorrent mounts the bundle at the resource path `:/uitheme` and reads two reserved files from its root.

| Part | File | Format | Required | What it does |
|---|---|---|---|---|
| Widget styling | `stylesheet.qss` | Qt Style Sheet, a CSS dialect | Yes in practice | Colours and shapes of every Qt widget: menus, tabs, buttons, lists, scrollbars |
| Colour overrides | `config.json` | JSON, one `colors` object | No, but every real theme has one | The 56 named colours qBittorrent paints itself: palette roles, transfer-list row text, log lines, pieces bar |
| Icons | `icons/<name>.svg` or `.png`, `icons/dark/<name>.svg` | SVG or PNG | No | Replaces any of the 85 GUI icons by name. `icons/dark/` is used when the palette is dark |
| Anything else | any path | any | No | Referenced from the stylesheet as `url(:/uitheme/<path>)` |

Docs: the wiki page [Create custom themes for qBittorrent](https://github.com/qbittorrent/qBittorrent/wiki/Create-custom-themes-for-qBittorrent) and the loader source, [`src/gui/uithemesource.cpp`](https://github.com/qbittorrent/qBittorrent/blob/master/src/gui/uithemesource.cpp) and [`src/gui/uithemecommon.h`](https://github.com/qbittorrent/qBittorrent/blob/master/src/gui/uithemecommon.h).

The theme carries no metadata. There is no name, author, version or licence field anywhere in the format. qBittorrent shows the file path in the options dialog and nothing else. A name goes in a comment at the top of `stylesheet.qss`, as Catppuccin does, and in the file name.

#### config.json keys

The file is one object. `colors` holds the theme's colours. `colors.dark` holds overrides that apply only when the resulting palette is dark. A value is anything `QColor` parses: `#rrggbb`, `#aarrggbb`, or an SVG colour name. Qt reads eight hex digits as alpha first, so an alpha suffix needs `build.mjs`'s `toArgb` converter, as the KDE port does.

| Group | Keys at master, 2026-10-08 | Count |
|---|---|---|
| `Palette.*` | `Window`, `WindowText`, `Base`, `AlternateBase`, `Text`, `ToolTipBase`, `ToolTipText`, `BrightText`, `Highlight`, `HighlightedText`, `Button`, `ButtonText`, `Link`, `LinkVisited`, `Light`, `Midlight`, `Mid`, `Dark`, `Shadow`, and the six `*Disabled` variants of `WindowText`, `Text`, `ToolTipText`, `BrightText`, `HighlightedText`, `ButtonText` | 25 |
| `TransferList.*` | `Downloading`, `StalledDownloading`, `DownloadingMetadata`, `ForcedDownloadingMetadata`, `ForcedDownloading`, `Uploading`, `StalledUploading`, `ForcedUploading`, `QueuedDownloading`, `QueuedUploading`, `CheckingDownloading`, `CheckingUploading`, `CheckingResumeData`, `StoppedDownloading`, `StoppedUploading`, `Moving`, `MissingFiles`, `Error` | 18 |
| `Log.*` | `TimeStamp`, `Normal`, `Info`, `Warning`, `Critical`, `BannedPeer` | 6 |
| `PiecesBar.*` | `Border`, `Piece`, `PartialPiece`, `MissingPiece` | 4 |
| `RSS.*` | `ReadArticle`, `UnreadArticle` | 2 |
| `ProgressBar` | the one key | 1 |

Two naming traps. The wiki page still documents `Log.Time` and `TransferList.PausedDownloading`/`PausedUploading`. The source at master reads `Log.TimeStamp` and `TransferList.StoppedDownloading`/`StoppedUploading`. Catppuccin's template writes the old `Paused` names, so its stopped-torrent colour is silently ignored on current builds, which is Catppuccin issue #27. Unknown keys are stored and never read, so a template can write both spellings to cover old and new versions. Which release renamed them is unverified.

#### Versions

| Version | Date | What it added | Source |
|---|---|---|---|
| 4.2.2 | 2020-03-24 | `.qbtheme` loading and the "Use custom UI theme" option | Changelog, wiki |
| 4.3.0 | 2020-10-18 | `config.json` colours and icon replacement from bundles | Changelog |
| 4.3.1 | 2020-11-25 | Progress bar styling from themes | Changelog |
| 4.4.0 | 2022-01-06 | Folder-based themes, pick the folder's `config.json` instead of a `.qbtheme` | Changelog |
| 4.5.1 | 2023-02-12 | Folder themes load correctly | Changelog |
| 4.6.0 | 2023-10-22 | Qt 6 only, Qt 5 dropped | Changelog, wiki |
| 5.2.3 | 2026-07-07 | Relative theme paths resolve | Changelog |
| 5.2.4 | 2026-09-28 | Latest release | GitHub releases |

Minimum version for a Darkberry port: 4.3.0 for the colours to apply, 4.6.0 if the bundle targets Qt 6. The practical floor is whatever `rcc` wrote the bundle, see Packaging.

#### Where it lives and how a user loads it

There is no theme directory. qBittorrent stores the path the user picks, so the file can sit anywhere.

1. Download the `.qbtheme`, or unzip the folder.
2. Tools > Options on Linux and Windows, qBittorrent > Preferences on macOS.
3. Behavior > Interface > tick "Use custom UI Theme".
4. Pick the `.qbtheme` file, or the `config.json` inside a theme folder.
5. Apply, then restart qBittorrent. The theme applies only at start.

One theme per file or folder. A `.qbtheme` cannot hold a second theme, so tints become subfolders in `ports/qbittorrent/`.

#### Packaging

`rcc <dir>/resources.qrc -o <name>.qbtheme -binary` compiles the bundle. The `.qrc` is a short XML list of `<file>` entries relative to itself. Paths with `..` keep their `..` in the resource tree, which is why Catppuccin's stylesheet references `:/uitheme/../icons/dark/check.svg`.

Which `rcc` matters. Catppuccin built its v2.0.0 release with `rcc 6.2.4` and every Windows user reported a theme that did nothing, with no error logged. A rebuild with `rcc 5.15` worked on Linux and Windows, and the repo now refuses `rcc` 6 or newer. The likely cause is compression. Qt 6 `rcc` defaults to zstd. The official Windows build lists zlib but no zstd under Help > About > Software Used. That cause is my inference, not confirmed by the maintainers. Qt 6 `rcc` has `--compress-algo zlib` and `--no-zstd`, which should give a bundle any build reads, but nobody in that thread tested it.

| Way to get `rcc` | Where | Verified |
|---|---|---|
| Homebrew `qt@5` 5.15.19 | macOS, `$(brew --prefix qt@5)/bin/rcc` | Formula exists, not installed here, binary path unverified |
| Homebrew `qt` 6.11.2 | macOS, Qt 6 `rcc` | Formula exists, needs the compression flags above |
| RccExtended v1.0.5 | Windows, a standalone `rcc.exe`, what Catppuccin's `build.ps1` downloads | Catppuccin uses it in CI |
| Debian `qtbase5-dev-tools` | Linux and GitHub Actions runners | Unverified package name |

### How Catppuccin and Rosé Pine do it

| | Catppuccin | Rosé Pine |
|---|---|---|
| Repo | https://github.com/catppuccin/qbittorrent | https://github.com/rose-pine/qbittorrent |
| Licence | MIT | MIT, the copyright line still says Catppuccin |
| Variants | 4, one `.qbtheme` each | 3, `main`, `moon`, `dawn` |
| Stars, last commit | 930, 2025-04-21 | 19, 2025-11-05 |
| Build tool | whiskers fills three `.tera` templates into `src/catppuccin-<flavor>/`, then `tools/build` runs `rcc` | `@rose-pine/build` on npm fills `$name` variables in `src/template/`, then `build.sh` runs `rcc` |
| Metadata | A comment block at the top of the stylesheet: name, author, licence, description, repo | The same block, inherited |
| Icons | 12 SVG indicators in `src/icons/dark/` and `light/`: checkbox, check, arrow, chevron, branch. Fill colour is hardcoded to the flavour's `text` | Catppuccin's 12, dark set only, even for the light `dawn` |
| Distributed as | GitHub Releases, 4 `.qbtheme` assets per release, latest v2.0.1 on 2024-10-05 | `dist/*.qbtheme` committed in the repo, no releases |
| Listed on | qBittorrent wiki theme list | rosepinetheme.com/themes/qbittorrent |
| Unusual | `rcc` pinned below 6.0. CI runs only a whiskers check, no build. PR #42 to add real GUI icons is open. Open issue #40 is a theme.park WebUI login failure on 5.2.1, filed on the wrong repo, not a Qt theme bug | The stylesheet references dark icons for every variant, so dawn's checkboxes are the dark set |

Files a Darkberry template derives from:

| Template | Raw URL |
|---|---|
| Stylesheet, 653 lines, about 120 selectors | https://raw.githubusercontent.com/catppuccin/qbittorrent/main/templates/stylesheet.tera |
| Colour config, 52 keys | https://raw.githubusercontent.com/catppuccin/qbittorrent/main/templates/config.tera |
| Resource list | https://raw.githubusercontent.com/catppuccin/qbittorrent/main/templates/resources.tera |
| One rendered variant | https://raw.githubusercontent.com/catppuccin/qbittorrent/main/src/catppuccin-mocha/stylesheet.qss and `config.json` beside it |

The Catppuccin repo was at commit `fd2b86e` on `main` when read.

### Mapping

Taken from Catppuccin's `config.tera`. The right column is the palette name a Darkberry template swaps in, before the role table in `STYLE_GUIDE.md` turns it into a role.

| qBittorrent key | Catppuccin | Darkberry role or palette name |
|---|---|---|
| `Palette.Window` | `base` | `base` |
| `Palette.WindowText`, `Palette.Text`, `Palette.ButtonText`, `Palette.ToolTipText`, `Log.Normal` | `text` | `ui.text` |
| `Palette.Base`, `Palette.Shadow`, `Palette.HighlightedText` | `crust` | `crust`, and `ui.on.fill` for the highlighted text |
| `Palette.AlternateBase`, `Palette.Dark` | `mantle` | `mantle` |
| `Palette.Mid` | `base` | `base` |
| `Palette.Button`, `Palette.ToolTipBase` | `surface0` | `surface0` |
| `Palette.Midlight` | `surface1` | `surface1` |
| `Palette.Light` | `surface2` | `surface2` |
| `Palette.PlaceholderText`, `RSS.ReadArticle` | `overlay2` | `overlay2` |
| all six `Palette.*Disabled` | `overlay1` | `overlay1` |
| `Palette.Highlight` | `blue` | `ui.fill` |
| `Palette.Link`, `Log.Info`, `RSS.UnreadArticle` | `blue` | `ui.link` |
| `Palette.LinkVisited` | `lavender` | `lavender` |
| `Palette.BrightText` | `mauve` | `plum` |
| `Log.TimeStamp` | `subtext1` | `subtext1` |
| `Log.Warning`, `TransferList.PausedDownloading`, `TransferList.PausedUploading` | `peach` | `ui.warning`, written to the `Stopped*` keys too |
| `Log.Critical`, `Log.BannedPeer`, `TransferList.MissingFiles`, `TransferList.Error` | `red` | `ui.error` |
| `TransferList.Downloading`, `DownloadingMetadata`, `ForcedDownloading` | `green` | `ui.success` |
| `TransferList.ForcedDownloadingMetadata` | `sky` | `frost` |
| `TransferList.Uploading`, `StalledUploading`, `ForcedUploading` | `blue` | `ui.link` or `blueberry` |
| `TransferList.StalledDownloading` | `overlay1` | `overlay1` |
| `TransferList.QueuedDownloading`, `QueuedUploading`, `CheckingDownloading`, `CheckingUploading`, `CheckingResumeData`, `Moving` | `teal` | `juniper` |
| `PiecesBar.*`, `ProgressBar`, `TransferList.Stopped*` | not set | new in the port, see Open questions |

The stylesheet uses twelve palette names and four dark-or-light branches. Counts are template occurrences.

| Palette name | Uses | Meaning in the stylesheet |
|---|---|---|
| `mantle` | 18 | Default widget background, tab bar, panes |
| `surface0` | 17 | Hover, pressed, buttons, inputs |
| `crust` | 13 | Menu bar, headers, the darkest strips |
| `surface1` | 10 | Menu item selected, borders |
| `blue` | 10 | Selected tab underline, focus, checked states |
| `base` | 9 | Selected tab, dialog background |
| `text`, `surface2` | 4 each | Foreground, scrollbar handle |
| `overlay0` | 4 | Scrollbar, disabled |
| `lavender` | 3 | Links in rich text |
| `overlay1` | 2 | Disabled text |
| `sapphire` | 1 | One accent |
| `surface2` at 30% | 1 | Selection background on every `QWidget`, which Catppuccin issue #22 found invisible in dialogs |

The four colour branches switch on `flavor.dark`. Tooltip and popup backgrounds use `base` when dark and `crust` when light. One badge uses `overlay0` under `base` text when dark, and `surface1` under `text` when light. The 17 icon branches pick `icons/dark/` or `icons/light/`. Darkberry has no template branches, so each of these becomes a role with `dark` and `light` values, or a `%SCHEME%` in the icon path.

### Build plan

Templates to add under `src/ports/`:

| Template | Output | Notes |
|---|---|---|
| `qbittorrent.qss` | `stylesheet.qss` | Derived from Catppuccin's stylesheet. Icon paths use `%SCHEME%` so the folder is `icons/dark` or `icons/light`. Override kind `lines` fits: one property per line |
| `qbittorrent.json` | `config.json` | 56 keys plus the two legacy `Paused*` spellings. Override kind `json` |
| `qbittorrent-icons/*.svg`, 12 files | `icons/<scheme>/*.svg` | Catppuccin's SVGs with the hardcoded fill replaced by `{ui.text}`. They are templates, not assets, because the fill is a colour |
| `qbittorrent.qrc` | `resources.qrc` | Static list of the 14 files. Could be a literal file copied by the build |

Output tree, one folder per flavour so the folder itself is a working theme before any compile step:

```
ports/qbittorrent/
  README.md
  assets/
  darkberry-wisp/
    stylesheet.qss
    config.json
    resources.qrc
    icons/light/*.svg       12 files
  darkberry-fen/ ... icons/dark/*.svg
  darkberry-mire/
  darkberry-blackwater/
  dist/                     written by package.sh, not build.mjs
    darkberry-wisp.qbtheme  one per flavour
    darkberry-qbittorrent-<version>.zip
  lingonberry/
    lingonberry-wisp/ ...   the same four folders, plus assets/ and README.md
  cloudberry/  crowberry/  blueberry/
```

The folder name is `%SLUG%` because the user picks a path, not a name the app displays. `build.mjs` writes the folders through `route()` with no change to routing: a tint build lands in `ports/qbittorrent/<tint>/`.

What `build.mjs` cannot do today:

- Run `rcc`. It is a binary tool, and the build has no dependencies by design. `package.sh` is the place. After `node build.mjs`, it loops over the flavour folders and calls `rcc` when it is on `PATH`. Without `rcc` it prints a message and skips, as Rosé Pine's `build.sh` does.
- Guarantee the bundle loads on Windows. Use Qt 5 `rcc`, or Qt 6 `rcc` with `--compress-algo zlib`, and test on Windows before a release. The folder form sidesteps the problem entirely, so the README should document both.
- Write a `.qrc` through `fill()` without tripping the literal-hex check. The `.qrc` has no colours, so a plain copy is fine.

`release.yml` needs a `.qbtheme` per flavour attached and one install line. The runner needs `rcc`, which means installing a Qt package in CI, unverified which.

## Venues

### qBittorrent wiki, "List of known qBittorrent themes"

- **URL**: https://github.com/qbittorrent/qBittorrent/wiki/List-of-known-qBittorrent-themes
- **Kind**: the project's own list. The wiki's "How to use custom UI themes" page sends readers here to find themes. That makes it the only official discovery path. 13 themes listed, Catppuccin, Dracula and Nord among them.
- **Accepts**: one bullet per theme: the repository URL on its own line, a blank line, then a one-line description indented two spaces. FOSS GUI themes only, by the page's own text. Issues go to the theme's own repo, not qBittorrent's.
- **Fields**: Repository [the bullet's URL], Summary [the indented line, one sentence, no limit stated].
- **Add-ons**: none. No screenshot, no version, no name field. The repo README is the theme's whole listing.
- **Requirements**: a GitHub account to fork https://github.com/qbittorrent/wiki, the source repo. CI runs pre-commit: `rumdl` Markdown lint, `codespell`, `typos`, LF endings, no trailing whitespace, newline at end of file. The maintainer `thalieht` merged the last two theme additions within one and eight hours: PR #81 on 2026-09-06, PR #78 on 2026-08-20. On push to `master`, `deploy.yaml` force-pushes the repo to the GitHub wiki.
- **Steps**:
  1. Fork https://github.com/qbittorrent/wiki.
  2. Edit `List-of-known-qBittorrent-themes.md`. Add a bullet in the existing shape, with the Darkberry repo URL and one line from COPY.md.
  3. Open a PR titled like the others: "Add Darkberry to known themes".
  4. CI lints. The maintainer merges, and the wiki updates on its own.
- **Updates**: the list holds only a URL and a line, so a new flavour or tint needs no change. Edit the line through another PR if the description changes.
- **Contacts**: https://github.com/qbittorrent/wiki/pulls, maintainer `thalieht` merged both recent theme PRs.
- **Sources**: https://github.com/qbittorrent/qBittorrent/wiki/List-of-known-qBittorrent-themes (2026-10-08), https://github.com/qbittorrent/qBittorrent/wiki/How-to-use-custom-UI-themes (2026-10-08), https://api.github.com/repos/qbittorrent/wiki (2026-10-08, description "Source repo for the qBittorrent wiki"), https://api.github.com/repos/qbittorrent/wiki/pulls/81 and /78 with their file diffs (2026-10-08), https://raw.githubusercontent.com/qbittorrent/wiki/master/.github/workflows/deploy.yaml and `ci_file_health.yaml` and `.pre-commit-config.yaml` (2026-10-08).
- **Confidence**: verified. Unverified: whether the GitHub wiki itself still accepts direct edits. A theme author edited it in place in March 2025. Also unverified: whether the maintainer wants a release out before listing a theme.

### GitHub Releases on shythulu/DarkBerry

- **URL**: https://github.com/shythulu/DarkBerry/releases
- **Kind**: the de facto distribution channel. Catppuccin's README sends users to its latest release for the `.qbtheme` files. The wiki list links repos. So a repo with release assets is the whole chain.
- **Accepts**: any asset. The port wants one `.qbtheme` per flavour and tint, 20 files, plus the plain and with-tints zips `package.sh` already makes.
- **Fields**: Name [the release title, already set by `release.yml`], Version [the tag], Description [the release notes, one install line per port], Repository.
- **Add-ons**: the install line in `release.yml`'s notes block, same shape as the Notepad++ line. It says: download `darkberry-<flavour>.qbtheme`, Tools > Options > Behavior > Use custom UI Theme, restart.
- **Requirements**: `rcc` on the release runner, or the `.qbtheme` files committed under `ports/qbittorrent/dist/` the way Rosé Pine commits its `dist/`. Committed binaries are the simpler path and the one that needs a Windows test first.
- **Steps**:
  1. Decide where the compile runs, CI or a local `package.sh` with the output committed.
  2. Add the loop to `package.sh` and the install line to `release.yml`.
  3. Attach the 20 `.qbtheme` files to the next release.
- **Updates**: every release re-attaches them. A user has to download and re-pick the file, because qBittorrent stores a path and never checks for updates.
- **Contacts**: none, it is this repo.
- **Sources**: https://raw.githubusercontent.com/catppuccin/qbittorrent/main/README.md (2026-10-08), https://api.github.com/repos/catppuccin/qbittorrent/releases (2026-10-08), https://raw.githubusercontent.com/rose-pine/qbittorrent/main/build.sh (2026-10-08), `.github/workflows/release.yml` and `package.sh` in this repo (2026-10-08).
- **Confidence**: verified for the mechanism. Unverified: which CI package provides a working `rcc`, and whether a Qt 6 `rcc` with `--compress-algo zlib` loads on the Windows build.

### Rosé Pine style listing on a Darkberry site

- **URL**: https://darkberry.slacklab.ca
- **Kind**: own site. Rosé Pine has no release and no wiki listing. Its reach is its own themes page, which lists qBittorrent with contributors and a repo link. Darkberry's site has a ports page with a card per port.
- **Accepts**: a card in the `PORTS` list in `src/site/pages/ports.html`, as `PORT_CREATION.md` step 5 says.
- **Fields**: Name, Summary, Screenshots, Repository.
- **Requirements**: none beyond the build.
- **Steps**: add the card with the rest of the port.
- **Sources**: https://rosepinetheme.com/themes/qbittorrent/ (2026-10-08, "Updated November 5, 2025"), `docs/PORT_CREATION.md` (2026-10-08).
- **Confidence**: verified.

## Not applicable

- **theme.park community themes**. Catppuccin and Rosé Pine both route WebUI theming there. It is CSS injected into qBittorrent's web interface through a Docker mod or a reverse proxy, with 20 community CSS files in `css/community-theme-options/`. That is a different port with a different format, and the brief covers the Qt desktop client. Worth its own research if a WebUI port is wanted. Source: https://docs.theme-park.dev/themes/qbittorrent/ and https://api.github.com/repos/themepark-dev/theme.park/contents/css/community-theme-options (2026-10-08).
- **userstyles.org, Stylus**. Browser userstyles for the WebUI, same reason.
- **redlinejoes/qbittorrent-themes**. A "collection of themes for qbittorrent" with 0 stars, last pushed 2022-04-12, README now 404. Dead. Source: https://api.github.com/repos/redlinejoes/qbittorrent-themes (2026-10-08).
- **A store or in-app gallery**. qBittorrent has none. The options dialog is a file picker. Checked the wiki index and the "How to use custom UI themes" page, 2026-10-08.
- **Package registries**. No theme is packaged for apt, Homebrew or similar that I found. An AUR package would be possible, as the Konsole research notes, but nothing exists to join.

## Open questions

1. **Folder, bundle, or both.** A theme folder loads with no `rcc` and no Windows compression risk. A `.qbtheme` is what every listed theme ships and what users expect to download. Shipping both doubles the install text. I would ship both and lead with the `.qbtheme`.
2. **Which `rcc`, and where it runs.** Qt 5 `rcc` is the only version proven on Windows. Qt 6 `rcc` with zlib compression is the untested fix. The choice decides whether CI installs Qt 5, Qt 6, or the port commits its binaries. A Windows test of one bundle settles it in an hour.
3. **The 20 bundles.** Four flavours is 4 files on the release. With tints it is 20, each one a separate download and a separate option-dialog pick for the user. The wiki list does not care, so the count only affects the release page.
4. **Keys Catppuccin leaves unset.** `PiecesBar.Border`, `Piece`, `PartialPiece`, `MissingPiece`, `ProgressBar` and the two `Stopped*` keys have no Catppuccin value. Each needs a role. The obvious picks are `ui.success` for a complete piece, `ui.warning` for partial and `surface1` for missing. The pieces bar is dense, so a screenshot on Windows should decide.
5. **Selection on every widget.** Catppuccin paints `selection-background-color` on `QWidget` at 30% of `surface2`, and had a bug where that was invisible in text dialogs. Darkberry has `ui.selection` with a contrast rule, so the template should use it and the review should check text dialogs and the transfer list both.
6. **Icons.** The 12 indicator icons are the only ones Catppuccin replaces, and their fill must become `{ui.text}` per flavour. qBittorrent lets a theme replace all 85 GUI icons by name. Catppuccin has an open PR for that. Decide whether the port stops at the 12.
7. **A WebUI port.** Catppuccin and Rosé Pine both answer "what about the WebUI" by pointing at theme.park. Users ask: Catppuccin issues #6, #8 and #40 are all WebUI requests or WebUI bugs. Decide whether Darkberry wants a theme.park CSS port alongside this one.
