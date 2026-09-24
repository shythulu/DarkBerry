# Darkberry style guide

Darkberry is a four-flavour colour theme (Wisp, light; Fen, Mire, Blackwater, dark) that
follows Catppuccin's shape: one palette, one statement of what each colour means, and
ports that apply it. The middle layer is machine-readable and the build checks it, because
nobody reviews drift by eye here. This file is the contract for anyone adding or changing
a port. Read it whole before touching `src/`.

## The three layers

| Layer | File | Decides | A change affects |
|---|---|---|---|
| 1. Palette | `src/palette.json` (tints: `src/variants/*.json`) | What each colour **is**: 12 neutrals, 14 accents, plus `jam`, `onjam`, `tint` | Every app |
| 2. Roles | `src/roles.json` | What each colour **means**: `ui.*`, `syntax.*`, `terminal.*`, the ANSI mapping | Every app that shows that meaning |
| 3. Overrides | `src/overrides/<port>.json` | Rare, port-only exceptions, each with a `why` | One app |

Templates in `src/ports/` and `src/vscode/template.json` reference roles inside
`{braces}`. A template may name a palette colour only for **structural chrome**: a
surface or decoration that carries no meaning any other port shares (a scrollbar track, a
hairline between panels, a template placeholder, a box outline, a sparkline). Anything a
second port could also show is a role.

## Rules the build enforces

`node build.mjs` fails on any of these and writes the results to `docs/CHECKS.md`.

1. **No literal hex outside the palette.** A hex value in a role, template or override is
   an error. A new colour goes into the palette, where every port can use it.
2. **Shared meanings go through roles.** Every VS Code token rule uses a `syntax.*` role;
   VS Code's cursor, focus, link, badge, button, status foregrounds and ANSI keys must be
   roles (`mustBeRole`); and `mustBe()` pins keys that carry a shared meaning in
   specific ports (selection, current line, fill, focus, tab indicator, bold text, text
   on the error fill, search hits, diff lines, borders, ANSI). See *Port assertions*
   below for what to add.
3. **Deviations from Catppuccin carry a `why`.** Every role records Catppuccin's choice in
   `catppuccin`; `"="` means aligned. A role whose `catppuccin` is not `"="` and has no
   `why` fails. A role with no `catppuccin` field is never checked, so give every role one.
4. **Overrides are justified** (`why` required) and may only reference palette colours,
   roles or `mix()` of them.
5. **Readable text.** Each text role declares `minContrast` (4.5 for text you read, 3 for
   structural glue) and must reach it on `ui.background`, `ui.pane.secondary` and
   `ui.pane.tertiary`. Backgrounds that carry code declare `carriesCode`, the share of
   each syntax role's minimum they must preserve: `ui.line.current` 85%; `ui.selection`,
   `ui.search.matches`, `ui.diff.added`, `ui.diff.changed`, `ui.diff.removed` and
   `ui.diff.text` 65%. That share is why those tints are as weak as they are (a search
   tint at 35% left comments at 81% on Fen; 22% is the ceiling): a new tinted background
   gets `carriesCode` and the strongest mix that passes in all five tints.
6. **Non-text UI at 3:1** (WCAG 1.4.11) on `ui.background`: `ui.accent`, `ui.focus`,
   `ui.border.active`, `ui.border.inactive`, `ui.cursor`.
7. **On-colour pairs at 4.5:1**: every role with `minContrastWith` (`ui.on.accent` on
   `ui.accent`, `ui.on.fill` on `ui.fill`, `ui.on.error` on `ui.error`, `ui.mark.text` on
   `ui.mark1..3`, `ui.on.tab.indicator` on `ui.tab.indicator`, `ui.on.badge` on `ui.badge`).
8. **Distinct syntax colours.** Every pair of syntax roles (an alias such as
   `syntax.deprecated` is checked through its target) must be at least 5 apart in OKLab
   distance ×100; a pair of `key` roles under 7 warns. Calibrated on Catppuccin, whose
   closest core pair is 5.7 (Frappé). The same 5 is the floor for adjacent steps of a
   gradient (below), measured by hand with `lib/color.mjs`'s `deltaE()`.
9. **The fill equation** (`lib/derive.mjs`). `jam` keeps its hue and chroma in every
   flavour and tint; its lightness moves away from the background until jam clears `base`
   by 3.3:1 (`FILL_ON_BACKGROUND`), and `onjam` is white or `crust`, whichever reads better
   on jam, at 4.5:1 or more (`TEXT_ON_FILL`). The build fails if a palette's `jam`/`onjam`
   are not what the equation gives; `node tools/settle.mjs <palette>` fixes them. No
   flavour gets an accent exception in `roles.json`.

What the build cannot see, and you check by hand: ANSI colours on the background, status
colours (`ui.success` etc.) as text, `ui.text.subtle` as text, gradient steps, and every
fill whose foreground the host application chooses (below, *Host-owned pairings*).

## Where a change belongs

- *"The theme should feel warmer / deeper."* Palette: `tools/variants.mjs` or
  `src/palette.json`, then `docs/specimen.html`.
- *"Functions should be another colour."* Roles: point `syntax.function` at another
  palette colour or a `mix()`. No palette colour works: the palette is missing one.
- *"This colour is wrong in one app only."* Check `docs/USAGE.md` for who else uses it.
  Truly one app: an override with a `why`. An override that keeps coming back is a role.
- *"Italic variables."* Font style is an editor concern: the VS Code template or an
  override, not a colour decision.

---

## Porting an application

The result of this procedure is: a template in `src/ports/`, an empty override file, the
build wired up, assertions for the shared meanings, a registry entry and usage file that
give the port its README (the layout is Catppuccin's; see `docs/PORT_CREATION.md`), the
install line in two more places, a notes file, and a verified screenshot per flavour under
`ports/<port>/assets/`.

1. **Study the app's own default theme and its Catppuccin port.** Fetch the current
   Catppuccin template (`catppuccin/<app>` on GitHub; `resources/ports.yml` in
   `catppuccin/catppuccin` lists them) and the app's own default theme file, or its
   source or man page when the defaults live nowhere else (Alacritty, tmux, btop). Record
   the Catppuccin repo, branch and commit in the header's `Differs from Catppuccin`
   line (`src/ports/tmux.conf` is the shape) and in the notes file. Handed a reference
   file with no provenance and no network: write its path and `commit unknown`, and
   fetch the commit later with `gh api repos/catppuccin/<app>/commits/<branch>`.
2. **Enumerate every colour key the app exposes**, not only the ones Catppuccin sets.
   Diff the key sets both ways and write the counts down in the **notes file**,
   `port-notes-<app>.md` in the review folder beside the repo (see *Verification*).
   Coverage is thinnest where an app's defaults are coarsest (Kate's per-language
   `custom-styles`, Notepad++ lexers, VS Code bracket pairs), so read the app's docs for
   keys neither theme sets. An app with an open key set (syntect's settings block, a
   Lua highlight namespace) counts what the app itself reads, and says so.
3. **Map each key to a role** with the meaning → role table below. Search the table for
   the meaning before the key name: a "highlight" may be a search hit, a selection or a
   mark. Reuse an existing role under another name (`ui.mark2` for a substitution
   preview, `ui.on.error` for text on any status fill, `tint` for accent-as-text) before
   reaching past the roles. Where Catppuccin groups meanings Darkberry splits (booleans
   with numbers, `self` with built-ins), split them the VS Code way.
4. **Keys with no role.**
   - *Structural chrome* (a scrollbar, a hairline, a placeholder surface, a brand colour in
     a prompt, a box outline, a sparkline): name a palette colour and write the meaning
     beside it in a comment, as `src/ports/starship.toml` and `src/ports/btop.theme` do.
     This exemption is for chrome no other port shows the same meaning of. It is not for
     selection, focus, links, status, diff, tabs, cursor or search.
   - *A meaning no role covers* that a second port could also show: add the role to
     `src/roles.json` in the same change (a `catppuccin` field, a `why` if it deviates, a
     `minContrast`, `minContrastWith` or `carriesCode` if text sits on or in it), then
     reference it. Never write a `mix()` inline for a meaning; the table names the two
     mixes a template may carry (dim ANSI, a combined state).
5. **Host-owned pairings.** Some fills are painted under a foreground the *app* picks
   (KDE's `[Colors:Selection]` row text, GIMP's `selected-color` under `fg-color`,
   Obsidian's error fill under `--text-on-accent`, tmux's other search hits under the
   pane's own text, hover text on darktable's surfaces). The build cannot pair those. For
   each one: set every foreground the app lets you set on that fill to the matching `on.*`
   role (`ui.on.fill`, `ui.on.error`), or choose a fill that `ui.text` reads on (a surface,
   or `ui.selection`), and list the pairing in the template header with its measured
   contrast per flavour (`node -e` over `lib/color.mjs`'s `contrast()`).
6. **Template header.** Every template starts with a comment block stating: the full name
   via `%FULL%` and `%NOTE%`; `Generated by build.mjs from src/ports/<file>. Do not edit
   ports/<port>/.`; the install path (distro package and Flatpak/Snap where they differ,
   from the app's docs or the Catppuccin README, marked *unverified* when neither says)
   and whether the file must be renamed, made executable, or have a `revision`/`version`
   bumped to be re-imported (none of those: say so in one sentence, as
   `src/ports/alacritty.toml` does); the minimum app version, which key needs it, and how
   older versions are kept safe (tmux `set -gq`, btop drops unknown keys); any
   environment the colours need (`MICRO_TRUECOLOR=1`, truecolor); what is deliberately
   left unset and why; the host-owned pairings from step 5; and a `Differs from
   Catppuccin:` block for template-level choices no role records (the accent withheld
   from a bar, an icon colour muted, a titlebar painted). `src/ports/alacritty.toml` and
   `src/ports/tmux.conf` are the shape to copy. The comment syntax is the app's; a JSON
   port carries the block in `$comment` or the app's metadata block, and an XML port in a
   metadata string key (`src/ports/bat.tmTheme`'s `comment`), because an XML comment
   cannot hold `--` and every CLI flag in the install text has one.
7. **Template syntax.** `fill()` in `build.mjs` does the substitution:
   - `{ui.selection}`, `{syntax.keyword}`, `{terminal.color16}`, `{ansi.0}`..`{ansi.15}`:
     a role. `{surface1}`: a palette colour (structural chrome only). `{mix(a,b,t)}`: `a`
     and `b` are roles or palette names, `t` the share of `b`.
   - An alpha suffix of two hex digits directly after the brace, `{ui.selection}80`,
     appends to the hex as `#rrggbbaa`. Qt reads eight-digit hex as `#aarrggbb`, so a
     Kate/KDE alpha needs a converter in `build.mjs`, not a suffix.
   - **Every `{...}` in a template is resolved**, and there is no escape. An app whose
     own syntax uses braces (tmux `#{session_name}`, `%if "#{...}"`, shell `${var}`)
     gets the brace-free spelling instead: tmux's single-letter aliases (`#S #h #I #W
     #F`) and `set -gq` in place of `%if`. Ask for a `{{`/`}}` escape in `build.mjs`
     before a port that cannot avoid braces.
   - Placeholders: `%FULL%` (`Darkberry Mire`), `%NAME%`, `%ID%`, `%SLUG%`
     (`darkberry-mire`), `%FLAVOUR%`, `%NOTE%` (the flavour's note), `%VERSION%`,
     `%HOMEPAGE%`, `%SCHEME%` (`dark`/`light`), `%ISDARK%`, `%ADWAITA%` (`-dark` or empty,
     for Adwaita's stylesheet names), `%ACCENT_H%`/`%ACCENT_S%`/
     `%ACCENT_L%` (HSL parts of `ui.accent`, for apps that derive shades). The scan is
     `%(\w+)%`: an unknown name is put back (`%H:%M` survives), a name that is a
     placeholder (`%ID%` in a strftime string) is not.
   - Templates have no dark/light branch. A value that differs by scheme is a role whose
     value is `{ "dark": ..., "light": ... }` (see `ui.cursor.text`), or a `%SCHEME%` in a
     file name or `@import` path.
   - A literal hex anywhere in the template (placeholders stripped first) is an error.
   - **Shape the lines for the `lines` override kind**: an override's `key` is the text
     from the start of the line up to the value (`set -g status-style`, `theme[hi_fg]`,
     `H.Visual`) and its `value` replaces everything after it, so each key sits on one
     line with its whole value. A Lua template is one `H.Group = { ... }` statement per
     line with no trailing comma (`src/ports/neovim.lua`); a plist cannot use `lines` at
     all (the value is on the next line) and has its own kind.
8. **Agree with the reference ports.** ANSI: `{ansi.0}`..`{ansi.15}` and
   `{terminal.color16}`/`{terminal.color17}` exactly as `src/ports/kitty.conf`. Syntax:
   the scope → `syntax.*` mapping in `src/vscode/template.json`, so `int` is
   `syntax.type` in every editor and a decorator is the same colour in Kate as in VS Code
   (booleans are `constant.language` → `syntax.keyword`, not the number colour; a
   `markup.bold` scope is `syntax.constant`, where terminal bold is `ui.text`). Where
   the references disagree, **VS Code wins for syntax and the other port is a bug to
   fix**: escapes are `syntax.number` (Kate `SpecialChar` and micro `constant.specialChar`
   say `syntax.regex`); decorators are `syntax.function` (Kate `Attribute` says
   `syntax.property`). VS Code has no preprocessor scope, so `#include`/`#define` follow
   Kate and micro: `syntax.namespace`. Editor chrome (line numbers, gutter, current line):
   as `src/ports/kate.theme`'s `editor-colors`, except where Kate names a palette colour
   for a meaning the table gives a role (`SearchHighlight`, `BracketMatching`); then the
   table wins. Terminal chrome (tabs, borders, marks): as kitty. Font styles: the ones
   the VS Code template carries (italic comments, markup italic and strikethrough), bold
   headings, undercurl for diagnostics and spelling, nothing bold under a selection.
9. **Output file names.** Three cases. A name the user types or a config references
   (`include`, `source-file`, `:colorscheme`, `color_theme =`): `ports/<port>/%SLUG%.<ext>`
   (`darkberry-mire.conf`; kitty, tmux, Neovim, btop, micro). A file or folder name the
   app shows as the theme name: `%FULL%.<ext>` or a `%FULL%/` folder (Ghostty, KDE,
   Konsole, Notepad++, Chrome, Obsidian, Nimbalyst). A name the app reads from inside the
   file, with the file name free: `%FULL%.<ext>`, so the listing and the file agree
   (bat's `name` element). One installable unit per flavour.
10. **Wire the port into `build.mjs`.** The lists live in `build.mjs`, never in
    `docs/USAGE.md` (generated).
    - Read the template beside the others (`const fooT = read("src/ports/foo.ext")`).
    - In the flavour loop, `out(\`ports/foo/${slug}.ext\`, applyOverrides("foo", "lines",
      fill(ctx, fooT, "foo"), ctx))`. Override kinds: `"lines"` (key at line start, the
      rest of the line replaced), `"json"` (object keys replaced; Kate, Firefox),
      `"plist"` (`<key>k</key><string>` pairs; bat, with `<rule name>/foreground` keys).
      A file shape none of them can address needs a fourth kind in `applyOverrides`.
      Add a converter after `fill()` when the app wants another number format
      (`toTriplets`, `toArgb`, `to256`, `toRgbArrays`, `toBareHex` are the existing ones).
    - **Trace.** The generic loop under `dist/trace.json` (`for (const [port, text] of
      [["kitty", kittyT], ...`) assumes `key = value` or `key value` lines and would
      record every tmux line as `set` and every btop line as `theme`; `walk("foo", ...)`
      covers parsed JSON. Any other shape gets its own three-line loop beside the four
      that exist: LS_COLORS (`glob value` tokens), tmux (`set -g <option> <value>`),
      btop (`theme[name]="..."`), Neovim (`H.Group = {...}` and `H["@capture"]`), and
      bat's plist pairs traced under the rule they sit in. A sectioned format (TOML,
      INI) traces its bare key names ambiguously (`background` under every section);
      known, and the fix is in the loop, not the template. The trace feeds
      `dist/trace.json`, `docs/studio.html` and `tools/where.mjs`.
    - Add `"foo"` to the override port list below the trace (one array), and to the
      `usageMd` header string and the port array of its row template.
    - Create `src/overrides/foo.json` as `{ "overrides": [] }`, then prove the `lines`
      key spelling with a throwaway override before emptying it.
11. **Port assertions.** For every key that carries a shared meaning, add a `mustBe()` line
    beside the existing ones, so the mapping cannot drift back: text selection →
    `{ui.selection}`, current line → `{ui.line.current}`, a button, badge or row
    selection → `{ui.fill}` under `{ui.on.fill}`, the focus ring → `{ui.focus}`, the
    active tab → an opaque `{ui.tab.indicator}`, terminal bold → `{ui.text}`, text on an
    error fill → `{ui.on.error}` on `{ui.error}`, links → `{ui.link}` for a chrome key and
    `{syntax.link}` for a syntax scope (the alias resolves to the same hex), the current
    search hit → `{ui.mark1}` under `{ui.mark.text}`, diff lines → `{ui.diff.*}`, split
    borders → the two border roles, ANSI → `{ansi.N}` as kitty. Include the
    `.background`/`.border` siblings of status keys, not only `.foreground`. The regex is
    anchored on the key as the template spells it; a pair (selection text and
    background, cursor and cursor text) is one regex over both lines, and a key that
    repeats across sections (TOML `background`) is anchored on the section header plus
    the lines under it (`build.mjs`'s Alacritty lines).
12. **Ship it.** An entry in `src/ports.json` (key, name, app URL, emoji, categories,
    platforms; the shape is in `docs/PORT_CREATION.md`) and the install steps in
    `src/usage/<port>.md` (path, the app's picker step or import line, the version floor
    in one line, the environment note when there is one); the build then writes
    `ports/<port>/README.md` from `template/README.md` and the port's line in
    `README.md`. The install line in
    `.github/workflows/release.yml`'s release-notes block; a card in
    `src/site/index.html`'s `cards` list (name, prose, code line, link; copy the
    Alacritty entry; `src/site/` is source, `site/` is generated); screenshots as
    `preview.webp` and `<flavour>.webp` in `ports/<port>/assets/` (and per tint under
    `ports/<port>/<tint>/assets/`); no `zip` line is needed, `package.sh` packages every
    registered port, plain and with tints; and `ports/`,
    `assets/` and `README.md` rebuilt and committed (`release.yml` fails when they are
    stale).

## Meaning → role table

One answer per meaning. Where the role does not exist yet, the row says so: add it to
`roles.json` in the same change rather than answering ad hoc. Contrast figures are Wisp /
Fen / Mire / Blackwater.

| Meaning | Role | Notes |
|---|---|---|
| Cursor / caret | `ui.cursor`, text under it `ui.cursor.text` | Never a palette colour, never the selection colour |
| Cursor, alternative mode (vi mode, a second caret) | `ui.accent` under `ui.on.accent` | A second cursor must differ from the first; the pair is build-checked (4.6:1 or better). Not a mark |
| Cursor in an unfocused pane / terminal | `ui.text.subtle` as the fill | Neovim `TermCursorNC` |
| Text selection | `ui.selection` under `ui.text` (syntax keeps its own colour) | Terminals, editors, form fields, `::selection`, tmux `mode-style`. Never a surface step |
| Inactive / unfocused text selection | none yet: add `ui.selection.inactive` (`carriesCode: 0.65`) | Today GTK, darktable, Tinted8 and VS Code give three different answers |
| Row / list selection (chrome, not text) | `ui.fill` under `ui.on.fill` | KDE, GTK, GIMP, btop's process row, tmux menus, Neovim `PmenuSel`. A TUI row is the same meaning as a toolkit row. Every foreground the app draws on that row (links, status, visited) switches to `ui.on.fill` |
| Current line | `ui.line.current` | Gutter stays `ui.pane.secondary`; current line number `ui.accent`; other line numbers `ui.text.subtle` |
| Search / find: current match | `ui.mark1` under `ui.mark.text` | Never `ui.fill` under syntax text |
| Search / find: other matches | `ui.search.matches` under `ui.text` (syntax keeps its colour) | `ui.mark1` at 22% into the background, the ceiling for `carriesCode`; VS Code, Kate, micro, tmux and Alacritty still spell it their own way and are to move |
| Substitution / replace preview | `ui.mark2` under `ui.mark.text` | A second mark, so it never collides with search |
| Bracket match | `ui.accent`, bold, on `ui.line.current` | `surface1` under the accent is 2.65 / 2.30 / 2.93 / 3.09, under the 3:1 rule 6 asks of the accent; `ui.line.current` gives 3.96 / 3.27 / 3.44 / 3.68. micro, Neovim, Notepad++, Kate and VS Code are to move |
| Same-symbol / word highlight | `surface1` (structural) until a role exists | Neovim `LspReference*`, VS Code `{surface2}99`: two answers, so the next port adds `ui.highlight.word` (`carriesCode: 0.65`) |
| Closed fold | `ui.text.muted` on `ui.selection` | Kate `CodeFolding`, Neovim `Folded` |
| Window / split border, focused | `ui.border.active` | Only for the thing that has focus, never idle button edges |
| Window / split border, unfocused | `ui.border.inactive` | overlay1: edges that must be seen at 3:1. Also any line drawn in characters (tmux pane borders, btop `div_line`): `surface1` is 1.2:1 on Mire |
| Hairline separators inside a window | `surface1` (structural) | 1px GUI borders: tab borders, panel dividers, popup borders, toolbar separators |
| Indent guides | `surface1`, active guide `surface2` (structural) | Kate `IndentationLine`, bat `guide`/`activeGuide` |
| Focus ring | `ui.focus` | Never the accent, never the mix spelled inline |
| Hover | `ui.accent` for a hover *outline* (KDE `DecorationHover`); a surface step for a hover *fill* under `ui.text` | Hover text on jam does not read |
| Tabs | active: `ui.tab.active` with a `ui.tab.indicator` line; inactive: `ui.tab.inactive` with `ui.text.muted`; strip: `ui.pane.tertiary` | Editors and browsers draw the indicator as a line. **Terminals** (kitty, tmux) fill the whole active tab with the indicator under `ui.on.tab.indicator`; that is the terminal-chrome rule of step 8, not an exception. The indicator follows `tint`, not the accent |
| Tab activity / bell / attention | activity `ui.info`, bell `ui.bell`, as bold text on the tab's own surface | 5.1:1 or better on `ui.tab.inactive`. Catppuccin fills the tab; a fill would need `on.*` roles that do not exist |
| Status bar | `ui.text` on `ui.pane.secondary` | Includes a terminal's search prompt and scroll indicator (Alacritty `footer_bar`, `line_indicator`) |
| Status item / banner (error, warning, info, paused, following) | `ui.on.error` on the full status fill (`ui.error`, `ui.warning`, `ui.info`, `ui.success`) | 6.1:1 or better on all four fills in every flavour. `ui.text` on a 40% warning mix is 3.60 on Fen; do not use it |
| Combined state (paused **and** following) | `{mix(a,b,0.5)}` of the two state fills, under `ui.on.error`, with a comment and the measured pair | The one inline mix of two roles a template may carry: a role for it would be one port's. btop `proc_banner_bg` |
| One bar that is both tab strip and status bar (multiplexers) | the strip: `ui.pane.tertiary`; status segments on it sit on `ui.pane.secondary` | tmux `status-style` crust, `status-right` and messages mantle |
| Title / header bar | `ui.pane.secondary`; backdrop `ui.pane.tertiary` with `ui.text.muted` | |
| Menu / popup / floating window | surface `ui.pane.secondary` under `ui.text`, border `surface1`, selected item `ui.on.fill` on `ui.fill`, its scrollbar track `surface0` and thumb `overlay0` | Neovim `Pmenu`, `NormalFloat`; GTK popover. A multiplexer popup that holds a shell keeps `ui.background` (tmux `popup-style`) |
| Tooltip | none yet: add `ui.tooltip` | GTK and darktable use crust, Tinted8 a mantle mix; pick one when adding the role |
| Scrollbar | slider `overlay0`, hover `overlay1`, track `ui.pane.secondary` (structural) | On a surface that is already `ui.pane.secondary`, the track is `surface0` |
| Unfilled part of a meter or bar | `surface2` (structural) | A darker track reads as a hole in a terminal meter (btop `meter_bg`) |
| Gradient (a meter's low → mid → high) | Catppuccin's triple, slot for slot; adjacent steps at least 5 apart (OKLab ×100) in every flavour, moved one slot when a step fails | Only a meaning that is an alarm ends in `ui.error` (temperature); a full disk is a hue walk, not an error. Measure every triple, record the worst step in the header |
| Big overlay digits (clock, pane numbers) | `tint` on the pane; pane numbers `ui.text.muted`, active `ui.accent` | Large text, 3.5:1 or better on base |
| Hint labels (URL / keyboard hints) | first character `ui.mark2`, rest `ui.mark3`, under `ui.mark.text` | `ui.mark1` stays search. Alacritty `hints`, kitty's hints kitten, Ghostty |
| Link, inline | `ui.link` (`syntax.link` in a syntax scope) | Includes symlinks in listings, Obsidian's `--link-color` family, `url_color` |
| Link, navigation / hover | a mix of `ui.link` toward `ui.text` | |
| Link, visited | none yet: add `ui.link.visited` (plum, `catppuccin: "="`) | KDE and GTK name `plum` directly today |
| Status: success / warning / error / info | `ui.success`, `ui.warning`, `ui.error`, `ui.info` for foregrounds **and** backgrounds, borders, gutters | A fourth diagnostic severity (hint) takes `ui.success` |
| Diff, text and gutter marks | added `ui.success`; modified `ui.warning`; removed `syntax.diff.removed`; `ui.error` only for icons and decorations | |
| Diff, line backgrounds | `ui.diff.added`, `ui.diff.changed`, `ui.diff.removed`; the changed span `ui.diff.text` | Tints of the text colours (18 / 10 / 18 / 18%) that carry code; an app with alpha still uses the roles. VS Code's `{gooseberry}33` is to move |
| Emphasis / secondary accent (match text in lists, titles) | `ui.emphasis` | cherry, 5.6:1 or better on every background |
| Accent as readable text (prompt segments, directory names, shortcut letters) | `tint`, on `ui.background` only (4.75 / 5.6 / 6.6 / 7.5) | On `ui.pane.secondary` it is 4.26 on Wisp: there, accent text becomes a badge, `ui.on.fill` on `ui.fill`. `jam` is a fill at about 3.5:1 as text; `berry` does not follow the nature tints, `tint` does |
| Bold / intense text (terminal) | `ui.text` | Konsole `ForegroundIntense`, Alacritty `bright_foreground` |
| Dim / faint text (SGR 2) | `ui.text.muted` | Konsole `ForegroundFaint`, Alacritty `dim_foreground`. Catppuccin's overlay1 is never body text on Wisp |
| Dim / faint ANSI (SGR 2 colours) | `{mix(ansi.N,ui.background,0.4)}` per slot, until `terminal.dim0..7` roles exist | The one stated mix a template may carry for a meaning; Konsole `ColorNFaint` and Alacritty `[colors.dim]` share it. Catppuccin leaves it to the app, which halves the colour |
| Text over a graph (scales, uptime) | `ui.text` | btop `graph_text` |
| Structural chrome with no shared meaning | a palette colour, with a comment naming the meaning | The only place a palette name is allowed |
| Marks (terminal marks, bookmarks, user highlights) | `ui.mark1`, `ui.mark2`, `ui.mark3` under `ui.mark.text` | Five user marks need five colours; add roles before repeating |
| ANSI 0–15, 16, 17 | `ansi.N`, `terminal.color16`, `terminal.color17` | Exactly as kitty |

## Light flavour rules (Wisp)

Every port is checked on Wisp as well as Mire. Wisp's accents sit close to 4.5:1 on
`base`, so anything that works by "a bit lighter" on the dark flavours needs its own look.

- **Bright ANSI** is generated by Catppuccin's light formula (lightness ×1.09), so bright
  white and dim text are faint on cream, as in Catppuccin Latte. Do not compensate in a
  port; if a bright slot is used as body text (Base24 `base07`), give the light flavour a
  readable value.
- **Inactive tabs**: `ui.tab.inactive` (mantle) on `ui.pane.tertiary` (crust) is 1.1:1 on
  Wisp and Fen; kitty, tmux and Neovim all show it, and the text on the tab still reads
  (`ui.text.muted`, 6.1:1). Known and unfixed in the roles: a new port leaves the roles
  alone and records it; the fix is a light branch in the role, not a palette name in
  the template (no surface step clears 1.4:1 on crust, so the strip has to move too).
- **`ui.text.subtle` (overlay1) is never body text.** It is 3.3–3.5:1 on Wisp and Fen:
  line numbers, indent guides, placeholders. Listing columns people read (lsd `no-access`,
  starship `untracked`, timestamps, completion detail columns) take `ui.text.muted`.
- **On-colours**: `ui.on.fill`, `ui.on.error`, `ui.on.tab.indicator` and `ui.cursor.text`
  each carry a light value; use the role, never `crust` or `#ffffff` by name.
- **Scheme-keyed files**: any file whose name or import encodes dark (`gimp-dark.css`,
  `common-dark.css`, `gtk-contained-dark.css`) must switch on `%SCHEME%`, and the light
  flavour must install under the name the app loads for a light scheme.
- Check on Wisp: the sidebar and status bar (text on `mantle`/`crust`), selected text,
  the current line, a search hit, the tab strip, `tint` wherever it sits on a pane, and
  box outlines drawn in the pale accents.

## Verification

A port ships after all five steps, in this order. The harness, the scores and the notes
live **outside the repo**, in the review folder beside it:
`/Users/shylo/dev/DarkBerry-review-2026-09-22/` (`devbox-harness/`, `scores-pass<N>.md`,
`port-notes-<app>.md`, `catppuccin-refs/`). `docs/` is generated, so none of it can live
there.

1. **Build and check every tint.** `node build.mjs`, then `for v in src/variants/*.json;
   do node build.mjs --check "$v"; done` (both workflows run exactly this). Zero errors;
   read every warning (23 syntax-pair warnings are the standing count). Commit the
   rebuilt `ports/`.
2. **Port assertions.** The `mustBe()` lines from step 11 exist and pass; prove one by
   breaking the key in the template and watching the build fail, then restore it, and
   quote the failure in the notes file.
3. **Install on a real host.** The devbox harness: `devbox-harness/shoot.sh <flavour>
   <app>` installs the generated file from `~/darkberry/ports/` exactly as the template
   header says, launches the app under Xvfb `:99` with a demo tree, and writes
   `~/darkberry/shots/<app>-<flavour>.png`; `run-all.sh` loops the apps and flavours. Add
   a case for the new app and shoot Wisp and Mire at least. The screenshot must show:
   selected text, the current line, a search hit, a focused field, tabs and a status bar.
   Doing the install from the header's own text is what confirms the README sentence.
   **When the harness does not know the app, or the host is out of reach**, the minimum
   is to load the generated file in the real program and read back what it applied:
   `tmux -f <file> new-session -d` then `show-options -g`; `bat cache --build` then
   `--list-themes`; btop under tmux with `capture-pane -e` for the SGR values;
   `luac -p` and `:colorscheme` for Neovim; `tomllib` for TOML. Record in the notes file
   what was checked, in which version, and that the screenshot and score are still owed.
4. **Score it.** Per app and flavour, 7 points: applied (0–1: the theme is what is on
   screen), coverage of the app's chrome (0–2), consistency of meanings with the other
   ports (0–2), readability at a glance (0–2). Record scores and the environment gaps that
   are not the theme's fault in a dated `scores-pass<N>.md` in the review folder;
   `scores-pass2.md` is the format. Anything under 5 is a fix before shipping.
5. **Compare with the Catppuccin counterpart key by key.** From step 2 of porting: every
   key set on one side only, and for every shared key whether Darkberry's role resolves to
   the same slot; grep the template for palette names that shadow a role (`berry` where
   `ui.tab.indicator`, `frost` where `ui.link`, `cranberry`/`honey` where status roles,
   `surface0` where `ui.line.current`, `surface1`/`surface2` where selection or search);
   measure each host-owned pairing per flavour. Every difference is recorded (next
   section) or fixed. The comparison table goes in the notes file.

## Recording deviations

- **A role that differs from Catppuccin**: the role's `catppuccin` field holds the
  style-guide value and its `why` says what the deviation buys, in one or two sentences
  that a reader can check (name the numbers). When the port's own Catppuccin counterpart
  differs from the style guide, append it: `"catppuccin": "mauve; kitty active tab mauve;
  KDE hover surface1"`. Several roles sharing one reason point at a `$why` (`syntax.$why`).
- **A per-port exception**: `src/overrides/<port>.json`, one entry per key, `value` in
  template syntax, `why` required. An override that a second port wants is a role.
- **A template-level choice with no role** (accent withheld from a bar, a titlebar
  painted, an icon muted): the `Differs from Catppuccin:` block in the template header.
- **What the guide could not answer**: the notes file, `port-notes-<app>.md`, one
  numbered item per gap with what you did instead. The next pass over this guide is
  written from those files.
- `docs/ROLES.md` (generated) lists every role, its value per flavour and Catppuccin's
  choice, then the *Deviations from Catppuccin* table built from the `why` fields;
  `docs/CHECKS.md` (generated) reports every contrast and distinctness check with the
  failing ones marked. Keep the `why` text true about which ports use the role.

## Workflow

0. To explore first, open `docs/studio.html` and export a patch; it enforces the same rules
   as the build, including a reason for any new deviation. Apply it with
   `node tools/apply-patch.mjs patch.json`.
1. Edit `src/palette.json`, `src/roles.json`, a template or an override.
2. `node build.mjs` (or `./package.sh` to also build the `.vsix`, `.xpi` and zips).
   `node build.mjs --check [palette]` runs every check and writes nothing; use it on every
   file in `src/variants/`.
3. Read `docs/CHECKS.md` and open `docs/specimen.html` (editor, terminal and browser in all
   four flavours on one page).
4. If the build rejects a syntax pair or the fill: `node tools/settle.mjs <palette>` nudges
   the accent behind the closest pair and re-settles `jam`/`onjam`; neutrals never move.
5. Variants: every variant is a variation on `src/palette.json`. `node tools/variants.mjs`
   regenerates all the nature tints (`spread.mjs` then `settle.mjs` run on each);
   `node tools/variants.mjs <variant> [hue step] [chroma step]` makes one;
   `node build.mjs` builds every variant into each port's `<tint>/` subfolder after the
   default (`node build.mjs src/variants/<file>.json` does one; `--no-tints` skips them),
   so a tint that breaks a rule fails the build. Regenerate the variants after changing
   the default palette.
6. Never hand-edit `ports/`, `assets/`, `dist/`, `docs/` or `site/`; they are generated.
   The exceptions are the screenshots in `ports/<port>/assets/` and the hand-written
   files in `docs/` (`AMO.md`, `PORT_CREATION.md`).
