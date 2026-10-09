# Porting and publishing Zed

Zed is a code editor from Zed Industries, written in Rust, for macOS, Linux and Windows. A Zed theme is one JSON file that holds a *theme family*: a name, an author and a list of themes. Each theme has a light or dark appearance and a `style` object of colour keys. The file validates against https://zed.dev/schema/themes/v0.2.0.json. Themes reach users as extensions from the Zed extension registry, which is a GitHub repository of submodules. The registry listed 1,569 extensions on 2026-10-08. Catppuccin's theme has 1.18 million downloads there and Rosé Pine's has 132 thousand.

## Porting

### Format

One `.json` file is one theme family. The family holds any number of themes, so all four flavours fit in one file. Zed reads the family with serde and ignores keys it does not know, so a `$schema` key is safe.

| Level | Key | Required | Value |
|---|---|---|---|
| Family | `$schema` | no | `https://zed.dev/schema/themes/v0.2.0.json`, for editor validation only |
| Family | `name` | yes | The family name, shown nowhere in the UI. Catppuccin uses `Catppuccin` |
| Family | `author` | yes | Free text. Catppuccin uses `Catppuccin <releases@catppuccin.com>` |
| Family | `themes` | yes | Array of theme objects |
| Theme | `name` | yes | The name the theme selector shows and `settings.json` stores. Global across every installed extension |
| Theme | `appearance` | yes | `light` or `dark` |
| Theme | `style` | yes | The colour object below |
| Style | `background.appearance` | no | `opaque`, `transparent` or `blurred` |
| Style | `accents` | no | Array of hex strings. Zed uses them for bracket colourisation and indent-aware colouring, not as the theme accent |
| Style | colour keys | no | 142 keys in the served schema, 190 in Zed's source on 2026-10-06. Any key may be `null` to take Zed's default |
| Style | `players` | no | Array of `{cursor, background, selection}`. Entry 0 is the local user, so it carries the editor cursor and selection. Catppuccin ships 8 entries |
| Style | `syntax` | no | Object keyed by Tree-sitter capture name. Each value is `{color, background_color, font_style, font_weight}` |

Colours are hex strings. `#rrggbb` and `#rrggbbaa` both work. There is no underline or strikethrough in a syntax entry: `font_style` is `normal`, `italic` or `oblique`, and `font_weight` is 100 to 900.

The served schema is behind the source. Catppuccin ships 34 keys the schema lacks and Rosé Pine 25, and Zed loads them all. They are the `vim.*` mode badges, `version_control.*`, `minimap.thumb.*`, `search.active_match_background`, `panel.overlay_background`, `scrollbar.thumb.active_background`, `debugger.accent` and `editor.debugger_active_line.background`. The source of truth is `ThemeStyleContent` in https://github.com/zed-industries/zed/blob/main/crates/settings_content/src/theme.rs.

Theme names collide silently. `ThemeRegistry` stores themes in a map keyed by `name`, so a second `Darkberry Mire` from any extension replaces the first. Every theme name Darkberry ships must be unique on its own.

Where the files live:

| Place | macOS | Linux | Windows |
|---|---|---|---|
| User themes, loose files | `~/.config/zed/themes/` | `~/.config/zed/themes/`, or `$FLATPAK_XDG_CONFIG_HOME/themes/` under Flatpak | `%APPDATA%\Zed\themes\` |
| Installed extensions | `~/Library/Application Support/Zed/extensions/installed/<id>/` | `~/.local/share/zed/extensions/installed/<id>/` | `%LOCALAPPDATA%\Zed\extensions\installed\<id>\` |

Install and activate:

1. Drop the family file into the user themes folder, or install the extension from `zed: extensions`.
2. Zed watches the user themes folder and loads a new or changed file within a second. The docs still say "the next time Zed loads".
3. Pick the theme with `theme selector: toggle`, bound to `cmd-k cmd-t` on macOS and `ctrl-k ctrl-t` elsewhere.
4. Zed writes the choice into `settings.json` as `"theme": {"mode": "system", "light": "Darkberry Wisp", "dark": "Darkberry Mire"}`. A light flavour and a dark flavour can both be set.

Packaging around the file is an *extension*. That is a public Git repository with `extension.toml` at the extension root, a `themes/` folder, and a `LICENSE` file at the same root. No Rust and no build step. Zed's packager scans `themes/*.json` itself, so `extension.toml` does not list the theme files. The v1 manifest:

```toml
id = "darkberry-theme"
name = "Darkberry"
version = "0.3.0"
schema_version = 1
authors = ["shythulu"]
description = "Darkberry: a bog-witch berry theme in four flavours, one light and three dark."
repository = "https://github.com/shythulu/DarkBerry"
```

| Manifest key | Rule | Checked by |
|---|---|---|
| `id` | Lowercase letters, digits, hyphens. Not starting `zed-`, not ending `-zed`, not containing `extension`. Should say it is a theme, for example a `-theme` suffix. Never changes after publication | registry `validation.js`, prerequisites page |
| `name` | Not starting `Zed `, not ending ` Zed`, not containing `extension` | registry `validation.js` |
| `version` | Plain `major.minor.patch`, no `v`, no leading zeros, never lower than the published one | registry `validation.js` |
| `schema_version` | `1` | registry `validation.js` |
| `repository` | Required by the `zed-extension` CLI when it writes the published `manifest.json` | `extension_cli/src/main.rs` |
| `authors`, `description` | Optional. The gallery shows both | `extension_manifest.rs` |
| `LICENSE` | One of Apache 2.0, BSD 2 or 3, CC BY 4.0, GPLv3, LGPLv3, MIT, Unlicense, zlib. At the extension root, not the repo root, when the extension sits in a subfolder | registry `license.js` |

Local testing needs no packaging: `zed: install dev extension` points at the extension folder, and `zed: reload extensions` picks up edits.

### How Catppuccin and Rosé Pine do it

| | Catppuccin | Rosé Pine |
|---|---|---|
| Repo | https://github.com/catppuccin/zed | https://github.com/rose-pine/zed |
| Licence | MIT | MIT |
| Registry id, version, downloads | `catppuccin`, 0.2.27, 1,176,821 on 2026-10-08 | `rose-pine-theme`, 2.0.0, 131,836 on 2026-10-08 |
| Files and variants | One family file per accent and italics variant: `themes/catppuccin[-no-italics]-<accent>.json`. Each file holds Latte, Frappé, Macchiato and Mocha. Only the two mauve files are committed and shipped, so the extension has 8 themes. The other 26 files are GitHub release assets for manual install | Three family files, one theme each: `rose-pine.json` and `rose-pine-moon.json` dark, `rose-pine-dawn.json` light |
| Build tool | Whiskers, Catppuccin's Tera generator. `zed.tera` has a `matrix` of variant × flavor × accent and writes the files. `just build`, `just all`, `just release` | bloom, Rosé Pine's generator. `src/template.json` uses `$name`, `$type`, `$text` placeholders. `bloom build ./src/template.json -o ./themes/` by hand |
| Metadata | `extension.toml` at the repo root. Family `name` and `author` in the template | Same |
| Distribution | Registry submodule. A tag `v*` runs `huacnlee/zed-extension-action@v2.0.0`, which opens the version-bump PR on `zed-industries/extensions` from a fork | Registry submodule, PR by hand |
| Keys set | 176 style keys, 102 syntax captures, 8 players, 7 accents | 150 style keys |
| Unusual | `background.appearance` is pinned to `opaque` because other values drop the macOS window shadow. The `text` capture is left out on purpose: markdown paragraphs emit `@text`, and setting it would override the parent style inside doc comments. Comments mark the `comment.todo` family as untested | `scrollbar.track.background` is `#00000000`. `border.transparent` is the literal string `transparent` |

Template sources:

- Catppuccin template: https://raw.githubusercontent.com/catppuccin/zed/main/zed.tera
- Catppuccin built file: https://raw.githubusercontent.com/catppuccin/zed/main/themes/catppuccin-mauve.json
- Rosé Pine template: https://raw.githubusercontent.com/rose-pine/zed/main/src/template.json
- Rosé Pine built file: https://raw.githubusercontent.com/rose-pine/zed/main/themes/rose-pine.json

A Darkberry template derives from `zed.tera`. It has the fuller key set and the style-guide reasoning in comments.

### Mapping

Catppuccin's choice is from `zed.tera` at `catppuccin/zed` main on 2026-10-08. `accent` is the per-file accent, mauve in the shipped files. The last column is the Darkberry role that the VS Code template uses for the same meaning. Where the VS Code template names a palette colour, the key is structural chrome and the palette name is listed.

Surfaces and text:

| Zed key | Catppuccin | Darkberry |
|---|---|---|
| `editor.background`, `editor.gutter.background`, `toolbar.background`, `terminal.background`, `terminal.ansi.background` | `base` | `{ui.background}` |
| `background` | `mantle` lightened 7 on dark, darkened 5 on light. A comment says only elevated buttons use it | `{ui.background}` |
| `surface.background`, `elevated_surface.background`, `panel.background`, `panel.overlay_background`, `editor.subheader.background` | `mantle` | `{ui.pane.secondary}` |
| `status_bar.background`, `title_bar.background`, `tab_bar.background`, `scrollbar.track.background` | `crust` | `{ui.pane.secondary}` for the status and title bars as VS Code, `{ui.pane.tertiary}` for the tab bar as kitty |
| `title_bar.inactive_background` | `crust` +3 | `{ui.pane.tertiary}` |
| `tab.active_background` | `base` | `{ui.tab.active}` |
| `tab.inactive_background` | `crust` −3 | `{ui.tab.inactive}` |
| `editor.foreground`, `text`, `icon`, `terminal.foreground`, `terminal.bright_foreground` | `text` | `{ui.text}`. Bright foreground is `{ui.text}` by the terminal-bold rule |
| `text.muted` | `subtext1` | `{ui.text.muted}` |
| `text.placeholder`, `icon.placeholder` | `surface2` | `{ui.text.subtle}` |
| `text.disabled`, `icon.disabled` | `overlay0` | `{ui.text.subtle}` |
| `icon.muted`, `terminal.dim_foreground`, `editor.line_number` | `overlay1` | `{ui.text.subtle}` |
| `editor.active_line_number` | `accent` | `{subtext0}`, as VS Code's active line number |
| `text.accent`, `icon.accent` | `accent` | `{ui.emphasis}` or `tint`. Decide: `ui.accent` is a fill colour with a 3:1 floor, text needs 4.5:1 |
| `editor.invisible` | `overlay2` at 40% | `{text}29` as VS Code |

Borders, elements and selection:

| Zed key | Catppuccin | Darkberry |
|---|---|---|
| `border`, `pane_group.border` | `surface0` | `{surface1}`, VS Code's `editorGroup.border` |
| `border.variant` | `accent` 8% into `base` | `{surface0}` |
| `border.focused` | `lavender` | `{ui.focus}` |
| `border.selected` | `accent` | `{ui.accent}` |
| `border.disabled`, `element.disabled`, `ghost_element.disabled` | `overlay0` | `{surface2}` |
| `border.transparent`, `ghost_element.background` | `#00000000` | `{ui.background}00`. A literal hex fails the build, the alpha suffix does not |
| `panel.focused_border`, `pane.focused_border` | `text` | `{ui.border.active}` |
| `element.background` | `crust` | `{surface0}`, because Zed draws `text` on it, so `ui.fill` cannot go here |
| `element.hover`, `ghost_element.hover` | `surface0`, `surface1` at 30% | `{mix(base,surface0,0.6)}` as VS Code's list hover |
| `element.active`, `ghost_element.active` | `surface2` at 30% and 60% | `{surface1}` |
| `element.selected`, `ghost_element.selected` | `surface0` at 30%, `surface2` at 40% | `{mix(surface1,berry,0.25)}` as VS Code's active list row |
| `drop_target.background` | `surface0` at 40% | `{mix(surface0,surface1,0.6)}` as VS Code |
| `players[0].cursor`, `players[0].background` | `rosewater` | `{ui.cursor}` |
| `players[0].selection` | `overlay2` at 25% dark, 30% light | `{ui.selection}` |
| `players[1..7]` | the rainbow: `mauve`, `lavender`, `sapphire`, `green`, `yellow`, `peach`, `red` | seven berries, same order as the `accents` array |
| `accents` | the same rainbow | the same seven berries |

Editor:

| Zed key | Catppuccin | Darkberry |
|---|---|---|
| `editor.active_line.background` | `text` at 7% | `{ui.line.current}` |
| `editor.highlighted_line.background` | null | `{text}0b` as VS Code's range highlight |
| `editor.document_highlight.read_background`, `write_background` | `subtext0` at 16% | `{surface2}99` and `{mix(surface1,blueberry,0.25)}b8` as VS Code |
| `editor.document_highlight.bracket_background` | `accent` at 9% | `{gooseberry}1a` as VS Code |
| `editor.indent_guide`, `panel.indent_guide` | `surface0` at 60% | `{surface0}` |
| `editor.indent_guide_active`, `panel.indent_guide_active`, `editor.wrap_guide`, `editor.active_wrap_guide` | `surface2` | `{surface2}` |
| `panel.indent_guide_hover` | `accent` | `{overlay0}` |
| `search.match_background` | `teal` at 30% | `{ui.search.matches}` |
| `search.active_match_background` | `red` at 30% | `{ui.mark1}` |
| `scrollbar.thumb.background`, `hover_background` | `surface2` at 50%, `overlay0` | `{overlay0}66`, `{overlay0}b3` as VS Code |
| `scrollbar.thumb.active_background`, `scrollbar.thumb.border`, `minimap.thumb.border` | null | `{overlay2}66`, null, null |
| `scrollbar.track.border` | `text` at 7% | `{surface1}4d` |
| `minimap.thumb.background`, `hover`, `active` | `accent` at 20%, 40%, 60% | `{overlay0}` at `66`, `b3`, and `{overlay2}66` |
| `link_text.hover` | `sky` | `{ui.link}` |
| `editor.debugger_active_line.background` | `peach` at 7% | `{ui.warning.surface}` |
| `debugger.accent` | `red` | `{ui.error}` |

Status, diff and version control. Each status name has `.border` and `.background` siblings:

| Zed key | Catppuccin | Darkberry |
|---|---|---|
| `created`, `success`, `version_control.added` | `green` | `{ui.success}` |
| `deleted`, `error`, `unreachable`, `version_control.deleted` | `red` | `{ui.error}` |
| `modified`, `warning`, `version_control.modified` | `yellow` | `{ui.warning}` |
| `renamed`, `version_control.renamed` | `sapphire` | `{ui.info}` |
| `conflict`, `version_control.conflict` | `peach` | `{plum}` as VS Code's conflicting resource |
| `ignored`, `hidden`, `version_control.ignored` | `overlay0` | `{overlay1}` |
| `info` | `teal` | `{ui.info}` |
| `hint` | `surface2` | `{ui.text.subtle}` |
| `predictive` | `overlay0` text, `lavender` border | `{ui.text.subtle}` |
| `error.background`, `warning.background`, `info.background` | the colour at 12% to 20% | `{ui.error.surface}`, `{ui.warning.surface}`, `{ui.info.surface}` |
| `success.background`, `created.background` | `green` at 12% and 15% | `{ui.diff.added}` |
| `deleted.background` | `red` at 15% | `{ui.diff.removed}` |
| `modified.background` | `yellow` at 15% | `{ui.diff.changed}` |
| `version_control.conflict_marker.ours`, `theirs` | `green` at 20%, `blue` at 20% | `{ui.diff.added}`, `{ui.diff.text}` |
| `vim.*.background` | `rosewater` normal, `lavender` visual, `green` insert, `mauve` visual block, `maroon` replace | `{ui.cursor}`, `{ui.mark1}`, `{ui.success}`, `{ui.mark2}`, `{ui.error}` |
| `vim.*.foreground`, `vim.mode.text` | `crust` | `{ui.cursor.text}` |

Terminal ANSI. Catppuccin's bright colours are literal hex per flavour and its black and white swap by scheme:

| Zed key | Catppuccin | Darkberry |
|---|---|---|
| `terminal.ansi.black` .. `terminal.ansi.white` | `surface1`, `red`, `green`, `yellow`, `blue`, `pink`, `teal`, `subtext0` | `{ansi.0}` .. `{ansi.7}` |
| `terminal.ansi.bright_black` .. `bright_white` | `surface2`, per-flavour hex, `subtext1` | `{ansi.8}` .. `{ansi.15}` |
| `terminal.ansi.dim_*` | same as the normal colours | the dim mix the roles table names |

Syntax captures. Zed's captures are Tree-sitter names, not TextMate scopes. The Darkberry column follows the style guide's "VS Code wins" rule:

| Zed capture | Catppuccin | Darkberry |
|---|---|---|
| `variable`, `variable.builtin`, `variable.parameter`, `variable.special`, `parameter` | `text`, `red`, `maroon`, `red` italic, `maroon` | `{syntax.variable}` |
| `variable.member`, `field`, `property` | `blue`, `blue`, `lavender` | `{syntax.property}` |
| `constant`, `constant.builtin` | `peach` | `{syntax.constant}` |
| `boolean` | `peach` | `{syntax.keyword}`, the `constant.language` rule |
| `number`, `number.float`, `float` | `peach` | `{syntax.number}` |
| `constant.macro`, `function.macro` | `rosewater` | `{syntax.function}` |
| `string`, `string.documentation`, `character`, `text.literal` | `green`, `teal`, `teal`, `green` | `{syntax.string}` |
| `string.regexp`, `string.regex` | `pink` | `{syntax.regex}` |
| `string.escape`, `character.special` | `pink` | `{syntax.number}`, the escape rule |
| `string.special`, `string.special.path` | `pink` | `{syntax.string}` |
| `string.special.symbol`, `symbol`, `punctuation.special.symbol` | `flamingo` | `{syntax.constant}` |
| `string.special.url`, `link_uri`, `link_text` | `rosewater` italic, `blue` italic, `lavender` | `{syntax.link}` |
| `type`, `type.definition`, `type.interface`, `type.super`, `type.class.definition`, `enum` | `yellow`, some italic or bold | `{syntax.type}` |
| `type.builtin` | `mauve` italic | `{syntax.type}` |
| `attribute`, `tag.attribute`, `selector.pseudo` | `yellow` | `{syntax.constant}`, VS Code's `entity.other.attribute-name` |
| `tag` | `blue` | `{syntax.function}`, VS Code's `entity.name.tag` |
| `tag.delimiter` | `teal` | `{syntax.punctuation}` |
| `function`, `function.call`, `function.method`, `function.method.call`, `function.builtin`, `constructor` | `blue`, `red` for builtin, `flamingo` for constructor | `{syntax.function}` |
| `function.decorator` | `peach` | `{syntax.function}`, the decorator rule |
| `module`, `namespace` | `yellow` italic | `{syntax.namespace}` |
| `keyword` and every `keyword.*` except directives | `mauve` | `{syntax.keyword}` |
| `keyword.directive`, `keyword.directive.define`, `preproc` | `pink` | `{syntax.namespace}`, the preprocessor rule |
| `operator` | `sky` | `{syntax.operator}` |
| `punctuation`, `punctuation.delimiter`, `punctuation.bracket`, `punctuation.list_marker` | `overlay2`, `teal` for list markers | `{syntax.punctuation}` |
| `punctuation.special` | `pink` | `{syntax.punctuation}` |
| `comment`, `comment.doc`, `comment.documentation` | `overlay2` italic | `{syntax.comment}` italic |
| `comment.todo`, `comment.note`, `comment.warning`, `comment.error`, `comment.hint`, `comment.info` | `flamingo`, `rosewater`, `yellow`, `red`, `blue`, `teal`, all italic | `{ui.emphasis}`, `{ui.info}`, `{ui.warning}`, `{ui.error}`, `{ui.info}`, `{ui.info}` |
| `diff.plus`, `diff.minus` | `green`, `red` | `{syntax.string}`, `{syntax.diff.removed}` |
| `title` | see the template | `{syntax.function}` bold, VS Code's `markup.heading` |
| `emphasis`, `emphasis.strong` | `maroon` italic, `maroon` bold | VS Code's `markup.italic` and `markup.bold`; the bold scope is `{syntax.constant}` |
| `embedded`, `label`, `concept`, `parent`, `primary`, `variant`, `predoc`, `predictive`, `hint` | `maroon`, `sapphire`, `sapphire`, `peach`, and the rest in the template | `{syntax.text}`, `{syntax.keyword}`, `{syntax.type}`, `{syntax.type}`, decide the rest |

The remaining captures and their styles are in the template at the raw URL above.

### Build plan

Files to add:

| File | Holds |
|---|---|
| `src/ports/zed.json` | One theme object: `name`, `appearance`, `style`. `%FULL%` for the name, `%SCHEME%` for the appearance, roles in braces. The header block goes in a `$comment` key inside the theme object, as `src/ports/t3code.json` does |
| `src/ports/zed.extension.toml` | The manifest with `%VERSION%`, `%AUTHOR%`, `%DESCRIPTION%`, `%REPOSITORY%` |
| `src/overrides/zed.json` | `{ "overrides": [] }`, override kind `json` |
| `src/usage/zed.md` | Install steps: the extension from `zed: extensions` once published, or copy `themes/darkberry.json` into the user themes folder |

What `build.mjs` has to do that it does not do today:

1. Fill `src/ports/zed.json` once per flavour, parse each result, and collect the four objects, the way the VS Code with-tints build collects `vsThemes`.
2. Write one family file per tint: `{ "$schema": ..., "name": "Darkberry", "author": "%AUTHOR%", "themes": [wisp, fen, mire, blackwater] }`. The family name is the tint name.
3. Copy `LICENSE` into the extension folder, because the registry wants it at the extension root.
4. Run the port assertions: `players[0].selection` is `{ui.selection}`, `editor.active_line.background` is `{ui.line.current}`, `border.focused` is `{ui.focus}`, `search.active_match_background` is `{ui.mark1}`, `link_text.hover` is `{ui.link}`, `terminal.bright_foreground` is `{ui.text}`.

Output tree, following the VS Code precedent of a plain extension and a with-tints extension:

```
ports/zed/
  README.md
  assets/                     preview.webp, wisp.webp, fen.webp, mire.webp, blackwater.webp
  extension.toml              id darkberry-theme, 4 themes
  LICENSE
  themes/darkberry.json       Darkberry Wisp, Fen, Mire, Blackwater
  lingonberry/
    README.md
    assets/
    extension.toml            id lingonberry-theme, if ever published on its own
    LICENSE
    themes/lingonberry.json   Lingonberry Wisp, Fen, Mire, Blackwater
  cloudberry/ crowberry/ blueberry/   the same
  with-tints/
    extension.toml            id darkberry-with-tints-theme, 20 themes
    LICENSE
    themes/darkberry.json lingonberry.json cloudberry.json crowberry.json blueberry.json
```

Zed's unit is the family file, not the flavour. Four separate flavour files would work too, but a family file lets `settings.json` pair Wisp for light with Mire for dark from one install. `route()` in `build.mjs` already sends tint builds into the subfolder and the all-in-one unit into `with-tints/`. The Zed port follows the `vscode` branch of that function.

What the build cannot do:

- Open the registry pull request, add the submodule or bump `extensions.toml`. A person or `huacnlee/zed-extension-action` does that.
- Decide the registry `version`. It must rise on every registry PR, and `src/palette.json` carries the only version today.
- Make a separate repository. The registry accepts a subfolder of a submodule through `path = "ports/zed"`, so the monorepo can be the submodule. zed-themes.com cannot read that layout, see the venue below.
- Underline diagnostics or spelling. Zed syntax entries have no underline.

Two tools can seed the template from the VS Code port. Zed's own `theme_importer` crate converts a VS Code theme to a Zed family. Zed's Theme Builder at https://zed.dev/theme-builder imports and exports the JSON with a live preview. Either can turn `ports/vscode/themes/darkberry-mire.json` into a first draft of the key list. The mapping table above is the shorter road.

## Venues

### Zed extension registry

- **URL**: https://github.com/zed-industries/extensions, listed at https://zed.dev/extensions?filter=themes and inside Zed under `zed: extensions`
- **Kind**: official gallery. The only in-app source. Every entry is a Git submodule under `extensions/<id>` plus a version line in `extensions.toml`. Merging packages the extension with the `zed-extension` CLI and uploads it to Zed's blob store.
- **Accepts**: a public HTTPS Git repository that holds `extension.toml`, `themes/*.json` and a `LICENSE` at the extension root. The checked-out commit must be on a branch. Theme extensions must provide themes and nothing else. The extension must add something not already in the registry.
- **Fields**: Name (`name` in `extension.toml`, not starting `Zed `, not containing `extension`); Summary (`description`, shown on the gallery card and detail page, no documented limit); Author (`authors`, a list, `Name <email>` is the convention); Repository (`repository`, required, the detail page links it as "Visit Repository"); Licence (a `LICENSE*` file at the extension root, MIT accepted); Version (`version`, strict `major.minor.patch`, never decreasing, identical in `extension.toml` and `extensions.toml`); Title (the PR title, checked by the `danger-plugin-pr-hygiene` rules, no fixed pattern).
- **Add-ons**: `id` (kebab-case, unique, not `zed-*`, `*-zed` or `*extension*`, should end in `-theme`, cannot change later. `darkberry` and `darkberry-theme` were both free in `extensions.toml` on 2026-10-08); `schema_version = 1`; the submodule at `extensions/<id>` with an `https://` URL; `path = "ports/zed"` if the extension sits in a subfolder; `pnpm sort-extensions` before committing; the PR checkbox that says the contribution guidelines were read. The gallery shows name, description, author, version, download count, "Provides: Themes" and the last update date. No icon, no screenshots, no README on the gallery page.
- **Requirements**: a GitHub account. A fork on a personal account, not an organisation, so Zed staff can push fixes. The extension tested in Zed as a dev extension at the submitted commit. Every PR adds or updates exactly one extension. At most three open PRs. A reply to maintainer feedback within three weeks or the PR is closed. The AI policy: PR text and replies written by a human, no autonomous agents, AI context only in a quoted block with human commentary. No fee, no signing, no CLA.
- **Steps**:
  1. Make the extension folder public on GitHub: either the DarkBerry repo with `ports/zed/` committed, or a mirror repo with `extension.toml` at its root.
  2. Install it as a dev extension in Zed and check all four themes at that commit.
  3. Fork `zed-industries/extensions` to a personal account, clone it, `git submodule init`, `git submodule update`.
  4. `git submodule add https://github.com/shythulu/DarkBerry.git extensions/darkberry-theme`, then `git add extensions/darkberry-theme`.
  5. Add to `extensions.toml`: `[darkberry-theme]`, `submodule = "extensions/darkberry-theme"`, `path = "ports/zed"` if using the monorepo, `version = "0.3.0"`.
  6. `pnpm sort-extensions`.
  7. Open the PR with a human-written body. CI checks the licence, the version format, sorting, no Git LFS, and packages the themes, which parses every family file.
  8. Wait. The FAQ says first feedback usually within a few weeks, sometimes one to two months.
- **Updates**: a new commit on a branch in the extension repo with `version` raised in `extension.toml`. In the fork, `git submodule update --remote extensions/darkberry-theme`, raise `version` in `extensions.toml`, open a PR. The same rules apply. `huacnlee/zed-extension-action` automates this on a tag, which is what Catppuccin runs. The `version` must never go down.
- **Contacts**: the PR itself; https://github.com/zed-industries/extensions/issues; policy questions as a discussion on https://github.com/zed-industries/zed pinging @MrSubidubi.
- **Sources**: https://raw.githubusercontent.com/zed-industries/zed/main/docs/src/extensions/publishing/publishing-guide.md (2026-10-08), .../prerequisites.md (2026-10-08), .../license-requirements.md (2026-10-08), .../updating-and-maintenance.md (2026-10-08), .../faq.md (2026-10-08), https://raw.githubusercontent.com/zed-industries/zed/main/docs/src/extensions/developing-extensions.md (2026-10-08), https://raw.githubusercontent.com/zed-industries/zed/main/docs/src/extensions/themes.md (2026-10-08), https://raw.githubusercontent.com/zed-industries/zed/main/docs/src/themes.md (2026-10-08), https://raw.githubusercontent.com/zed-industries/extensions/main/CONTRIBUTING.md (2026-10-08), .../AI_POLICY.md (2026-10-08), .../src/lib/validation.js (2026-10-08), .../.github/workflows/ci.yml (2026-10-08), .../dangerfile.ts (2026-10-08), .../.github/pull_request_template.md (2026-10-08), .../extensions.toml (2026-10-08, id survey), https://raw.githubusercontent.com/zed-industries/zed/main/crates/extension/src/extension_builder.rs (2026-10-08, `themes/` auto-discovery), https://raw.githubusercontent.com/zed-industries/zed/main/crates/extension_cli/src/main.rs (2026-10-08), https://raw.githubusercontent.com/zed-industries/zed/main/crates/settings_content/src/theme.rs (2026-10-08, key list), https://raw.githubusercontent.com/zed-industries/zed/main/crates/theme/src/registry.rs (2026-10-08, name collision), https://raw.githubusercontent.com/zed-industries/zed/main/crates/zed/src/main.rs (2026-10-08, themes folder watch), https://raw.githubusercontent.com/zed-industries/zed/main/crates/paths/src/paths.rs (2026-10-08), https://zed.dev/extensions/catppuccin (2026-10-08), https://api.zed.dev/extensions?max_schema_version=1 (2026-10-08).
- **Confidence**: verified. Unverified: whether maintainers accept a 20-theme with-tints extension or treat it as a near-duplicate of the 4-theme one, whether a `path = "ports/zed"` submodule of a 30-port monorepo draws a request for a dedicated repo, and the review time for a theme in October 2026.

### zed-themes.com

- **URL**: https://zed-themes.com, source https://github.com/labithiotis/zed-themes
- **Kind**: third-party gallery with rendered previews, linked from Zed's own themes docs. It syncs from the registry, so a published extension appears without a submission. Users can also sign in and upload a theme JSON by hand.
- **Accepts**: for the synced path, nothing: `dev/syncZedThemes.ts` reads `https://api.zed.dev/extensions`, takes each extension's `repository`, and fetches `<repo>/contents/themes` from the GitHub API. It uses the first `.json` file in that folder and logs the rest as skipped. A repo whose `themes/` is not at the root is skipped. For the manual path, one family JSON through the site's Create page, which needs a Clerk login.
- **Fields**: Name (the extension `name` with the word "theme" stripped); Author (`authors` with emails stripped); Repository (`repository`, shown with the star count); Version (`version`, stored as `versionHash`). The install count and "Included" badge come from the registry.
- **Add-ons**: none. Previews are rendered by the site from the JSON.
- **Requirements**: for the synced path, the extension in the registry and the family file at `<repo root>/themes/*.json`. The DarkBerry monorepo has no root `themes/` folder, so only a mirror repo or a root-level copy gets synced. Only the first file by GitHub's listing order is shown, so one family file per repo is the safe shape.
- **Steps**:
  1. Publish to the registry with the family file at the repo root `themes/` folder.
  2. Wait for the next sync. The site showed "Synced on 30/09/2026" on 2026-10-08, and the repo's last commit was 2026-09-03, so the cadence is unknown.
  3. Or sign in and upload `darkberry.json` through Create for an unsynced listing.
- **Updates**: automatic through the sync for the registry path. Re-upload for the manual path.
- **Contacts**: https://github.com/labithiotis/zed-themes/issues
- **Sources**: https://raw.githubusercontent.com/labithiotis/zed-themes/main/readme.md (2026-10-08), https://raw.githubusercontent.com/labithiotis/zed-themes/main/dev/syncZedThemes.ts (2026-10-08), https://zed-themes.com/ (2026-10-08), https://raw.githubusercontent.com/zed-industries/zed/main/docs/src/themes.md (2026-10-08, the link from Zed's docs).
- **Confidence**: partly verified. The sync mechanism is from source. Unverified: how often the sync runs, whether the manual upload path accepts a multi-theme family, and whether a listing for the DarkBerry monorepo layout would show nothing or an error.

### Darkberry Releases, manual install

- **URL**: https://github.com/shythulu/DarkBerry/releases
- **Kind**: Darkberry's own channel. Catppuccin uses the same pattern for the 26 accent files it does not ship in the extension.
- **Accepts**: the family JSON files, attached to the release by `.github/workflows/release.yml`.
- **Fields**: none beyond the release notes line that the workflow already writes per port.
- **Add-ons**: none.
- **Requirements**: none.
- **Steps**:
  1. `package.sh` and the release workflow attach `ports/zed/themes/darkberry.json` and the tint files.
  2. `src/usage/zed.md` tells the reader to copy a file into the user themes folder and pick it with `theme selector: toggle`.
- **Updates**: every release.
- **Contacts**: n/a.
- **Sources**: https://raw.githubusercontent.com/catppuccin/zed/main/README.md (2026-10-08, the accents install steps), https://raw.githubusercontent.com/zed-industries/zed/main/crates/zed/src/main.rs (2026-10-08, the folder watch).
- **Confidence**: verified for the mechanism. The release workflow line is Darkberry's own to add.

## Not applicable

- **Built-in themes in `zed-industries/zed`**: Zed ships only its own families under `assets/themes/`, and moved the old bundled themes into the `zed-legacy-themes` extension. There is no documented path for a third-party theme into the binary. Checked the themes docs and the extensions docs on 2026-10-08.
- **Zed Theme Builder** at https://zed.dev/theme-builder: a design tool with import and export, not a listing. Its export is a family JSON or a `theme_overrides` block.
- **`theme_overrides` in `settings.json`**: a per-user patch on an installed theme, not a way to ship one.
- **Theme request issues** at https://github.com/zed-industries/extensions/issues?q=label%3Atheme: a wish list, not a submission path. No request for Darkberry existed on 2026-10-08.
- **MCP registry and ACP registry**: for server and agent extensions only.
- **Package managers**: not checked. Zed's docs name no other channel for themes.

## Open questions

1. Which repository is the submodule. The monorepo with `path = "ports/zed"` needs no mirror but is invisible to zed-themes.com and makes the registry CI clone 30 ports. A mirror repo `shythulu/zed` follows Catppuccin's shape and needs a push step in the release workflow.
2. How many extensions. One `darkberry-theme` with 4 themes, plus `darkberry-with-tints-theme` with 20, matches the VS Code port. The registry asks for functionality not already available, so the with-tints one may be refused as a near-duplicate. Five per-tint extensions would be worse on that rule. Theme names are global in Zed, so every one of the 20 names must stay unique.
3. The id. `darkberry-theme` follows the prerequisites. `darkberry` is shorter and also free. The id can never change.
4. Version coupling. The registry version must rise on every PR. A Zed-only fix would force a `src/palette.json` bump that also touches VS Code, or the Zed manifest needs its own version source.
5. Who opens the PR. The AI policy wants the body and every reply written by a person. It names shythulu's fork on a personal account.
6. `text.accent` and `icon.accent`. `ui.accent` has a 3:1 floor as a fill, and these keys draw text.
7. `background.appearance`. Catppuccin pins `opaque` to keep the macOS window shadow. Darkberry has no transparency story elsewhere.
8. A no-italics variant. Catppuccin ships one. The Darkberry style guide fixes italic comments, so the question is whether to double the theme count for it.
9. Screenshots. The registry shows none. zed-themes.com renders its own. The port README still needs the five `.webp` files under `ports/zed/assets/`.
