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
surface that carries no meaning any other port shares (a scrollbar track, a hairline
between panels, a template placeholder). Anything a second port could also show is a
role.

## Rules the build enforces

`node build.mjs` fails on any of these and writes the results to `docs/CHECKS.md`.

1. **No literal hex outside the palette.** A hex value in a role, template or override is
   an error. A new colour goes into the palette, where every port can use it.
2. **Shared meanings go through roles.** Every VS Code token rule uses a `syntax.*` role;
   VS Code's cursor, focus, link, badge, button, status foregrounds and ANSI keys must be
   roles (`mustBeRole`); and `mustBe()` pins keys that carry a shared meaning in
   specific ports (selection, current line, fill, focus, tab indicator, bold text, text
   on the error fill). See *Port assertions* below for what to add.
3. **Deviations from Catppuccin carry a `why`.** Every role records Catppuccin's choice in
   `catppuccin`; `"="` means aligned. A role whose `catppuccin` is not `"="` and has no
   `why` fails. A role with no `catppuccin` field is never checked, so give every role one.
4. **Overrides are justified** (`why` required) and may only reference palette colours,
   roles or `mix()` of them.
5. **Readable text.** Each text role declares `minContrast` (4.5 for text you read, 3 for
   structural glue) and must reach it on `ui.background`, `ui.pane.secondary` and
   `ui.pane.tertiary`. Backgrounds that carry code (`ui.selection`, `ui.line.current`)
   declare `carriesCode`, the share of each syntax role's minimum they must preserve
   (65% and 85%).
6. **Non-text UI at 3:1** (WCAG 1.4.11) on `ui.background`: `ui.accent`, `ui.focus`,
   `ui.border.active`, `ui.border.inactive`, `ui.cursor`.
7. **On-colour pairs at 4.5:1**: every role with `minContrastWith` (`ui.on.accent` on
   `ui.accent`, `ui.on.fill` on `ui.fill`, `ui.on.error` on `ui.error`, `ui.mark.text` on
   `ui.mark1..3`, `ui.on.tab.indicator` on `ui.tab.indicator`, `ui.on.badge` on `ui.badge`).
8. **Distinct syntax colours.** Every pair of syntax roles (an alias such as
   `syntax.deprecated` is checked through its target) must be at least 5 apart in OKLab
   distance ×100; a pair of `key` roles under 7 warns. Calibrated on Catppuccin, whose
   closest core pair is 5.7 (Frappé).
9. **The fill equation** (`lib/derive.mjs`). `jam` keeps its hue and chroma in every
   flavour and tint; its lightness moves away from the background until jam clears `base`
   by 3.3:1 (`FILL_ON_BACKGROUND`), and `onjam` is white or `crust`, whichever reads better
   on jam, at 4.5:1 or more (`TEXT_ON_FILL`). The build fails if a palette's `jam`/`onjam`
   are not what the equation gives; `node tools/settle.mjs <palette>` fixes them. No
   flavour gets an accent exception in `roles.json`.

What the build cannot see, and you check by hand: ANSI colours on the background, status
colours (`ui.success` etc.) as text, `ui.text.subtle` as text, and every fill whose
foreground the host application chooses (below, *Host-owned pairings*).

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
build wired up, assertions for the shared meanings, the install text in three places, and
a verified screenshot per light and dark flavour.

1. **Study the app's own default theme and its Catppuccin port.** Fetch the current
   Catppuccin template (`catppuccin/<app>` on GitHub; `resources/ports.yml` in
   `catppuccin/catppuccin` lists them) and the app's own default theme file. Record the
   Catppuccin repo, branch and commit you read.
2. **Enumerate every colour key the app exposes**, not only the ones Catppuccin sets.
   Diff the key sets both ways and write the counts down; they go in the verification
   notes. Coverage is thinnest where an app's defaults are coarsest (Kate's per-language
   `custom-styles`, Notepad++ lexers, VS Code bracket pairs), so read the app's docs for
   keys neither theme sets.
3. **Map each key to a role** with the meaning → role table below. Search the table for
   the meaning before the key name: a "highlight" may be a search hit, a selection or a
   mark. Reuse an existing role under another name (`ui.mark1` for search, `ui.on.error`
   for an error bar, `tint` for accent-as-text) before reaching past the roles.
4. **Keys with no role.**
   - *Structural chrome* (a scrollbar, a hairline, a placeholder surface, a brand colour in
     a prompt): name a palette colour and write the meaning beside it in a comment, as
     `src/ports/starship.toml` and `src/ports/ls-colors.txt` do. This exemption is for
     surfaces no other port shows the same meaning of. It is not for selection, focus,
     links, status, diff, tabs, cursor or search.
   - *A meaning no role covers* that a second port could also show: add the role to
     `src/roles.json` in the same change (a `catppuccin` field, a `why` if it deviates, a
     `minContrast` or `minContrastWith` if text sits on or in it), then reference it. Never
     write a `mix()` inline for a meaning; a mix in a template is only for a structural
     tint with no name.
5. **Host-owned pairings.** Some fills are painted under a foreground the *app* picks
   (KDE's `[Colors:Selection]` row text, GIMP's `selected-color` under `fg-color`,
   Obsidian's error fill under `--text-on-accent`, Kate's `ReplaceHighlight` under syntax
   text, hover text on darktable's surfaces). The build cannot pair those. For each one:
   set every foreground the app lets you set on that fill to the matching `on.*` role
   (`ui.on.fill`, `ui.on.error`), or choose a fill that `ui.text` reads on (a surface, or
   `ui.selection`), and list the pairing in the template header with its measured
   contrast per flavour (`node -e` over `lib/color.mjs`'s `contrast()`).
6. **Template header.** Every template starts with a comment block (in the app's comment
   syntax; JSON ports carry it in a `$comment` or the app's metadata block) stating:
   the full name via `%FULL%` and `%NOTE%`; `Generated by build.mjs from
   src/ports/<file>. Do not edit ports/<port>/.`; the install path (distro package and
   Flatpak/Snap where they differ) and whether the file must be renamed, made executable,
   or have a `revision`/`version` bumped to be re-imported; the minimum app version and
   which key needs it; any environment the colours need (`MICRO_TRUECOLOR=1`, truecolor);
   what is deliberately left unset and why; the host-owned pairings from step 5; and a
   `Differs from Catppuccin:` block for template-level choices no role records (the accent
   withheld from a bar, an icon colour muted, a titlebar painted). `src/ports/borders.sh`
   and `src/ports/lsd.yaml` are the shape to copy.
7. **Template syntax.** `fill()` in `build.mjs` does the substitution:
   - `{ui.selection}`, `{syntax.keyword}`, `{terminal.color16}`, `{ansi.0}`..`{ansi.15}`:
     a role. `{surface1}`: a palette colour (structural chrome only). `{mix(a,b,t)}`: `a`
     and `b` are roles or palette names, `t` the share of `b`.
   - An alpha suffix of two hex digits directly after the brace, `{ui.selection}80`,
     appends to the hex as `#rrggbbaa`. Qt reads eight-digit hex as `#aarrggbb`, so a
     Kate/KDE alpha needs a converter in `build.mjs`, not a suffix.
   - Placeholders: `%FULL%` (`Darkberry Mire`), `%NAME%`, `%ID%`, `%SLUG%`
     (`darkberry-mire`), `%FLAVOUR%`, `%NOTE%` (the flavour's note), `%VERSION%`,
     `%HOMEPAGE%`, `%SCHEME%` (`dark`/`light`), `%ISDARK%`, `%ACCENT_H%`/`%ACCENT_S%`/
     `%ACCENT_L%` (HSL parts of `ui.accent`, for apps that derive shades).
   - Templates have no dark/light branch. A value that differs by scheme is a role whose
     value is `{ "dark": ..., "light": ... }` (see `ui.cursor.text`), or a `%SCHEME%` in a
     file name or `@import` path.
   - A literal hex anywhere in the template (placeholders stripped first) is an error.
8. **Agree with the reference ports.** ANSI: `{ansi.0}`..`{ansi.15}` and
   `{terminal.color16}`/`{terminal.color17}` exactly as `src/ports/kitty.conf`. Syntax:
   the scope → `syntax.*` mapping in `src/vscode/template.json`, so `int` is
   `syntax.type` in every editor and a decorator is the same colour in Kate as in VS Code.
   Editor chrome (line numbers, gutter, current line): as `src/ports/kate.theme`'s
   `editor-colors`. Terminal chrome (tabs, borders, marks): as kitty.
9. **Output file names.** `ports/<port>/%SLUG%.<ext>` (`darkberry-mire.conf`) when the app
   reads a name from inside the file or an `include`. `ports/<port>/%FULL%.<ext>` or a
   `%FULL%/` folder when the app shows the file or folder name as the theme name (Ghostty,
   KDE, Konsole, Notepad++, Chrome, Obsidian, Nimbalyst). One installable unit per flavour.
10. **Wire the port into `build.mjs`.**
    - Read the template beside the others (`const fooT = read("src/ports/foo.ext")`).
    - In the flavour loop, `out(\`ports/foo/${slug}.ext\`, applyOverrides("foo", "lines",
      fill(ctx, fooT, "foo"), ctx))`. Use `"json"` when the output is parsed JSON and
      overrides replace object keys (see the Kate and Firefox lines). Add a converter
      after `fill()` when the app wants another number format (`toTriplets`, `toArgb`,
      `to256`, `toRgbArrays`, `toBareHex` are the existing ones).
    - Add the port to the trace list (`for (const [port, text] of [["kitty", kittyT], ...`)
      for line-style templates, or a `walk("foo", ...)` call for JSON, so
      `dist/trace.json`, `docs/studio.html` and `tools/where.mjs` see it.
    - Add `"foo"` to the override port list below the trace, and to both the header and
      the column list of `docs/USAGE.md`.
    - Create `src/overrides/foo.json` as `{ "overrides": [] }`.
11. **Port assertions.** For every key that carries a shared meaning, add a `mustBe()` line
    beside the existing ones, so the mapping cannot drift back: text selection →
    `{ui.selection}`, current line → `{ui.line.current}`, a button or badge fill →
    `{ui.fill}`, the focus ring → `{ui.focus}`, the active tab line → an opaque
    `{ui.tab.indicator}`, bold text → `{ui.text}`, text on an error fill → `{ui.on.error}`
    on `{ui.error}`, links → `{ui.link}`. Include the `.background`/`.border` siblings of
    status keys, not only `.foreground`. The regex is anchored on the key as the template
    spells it.
12. **Ship it.** A `zip` line in `package.sh`; an install section in `README.md` (path,
    the app's picker step, the version floor in one line, the environment note); a card in
    `src/site/index.html`'s `cards` list; and `ports/` rebuilt and committed
    (`release.yml` fails when `ports/` is stale).

## Meaning → role table

One answer per meaning. Where the role does not exist yet, the row says so: add it to
`roles.json` in the same change rather than answering ad hoc.

| Meaning | Role | Notes |
|---|---|---|
| Cursor / caret | `ui.cursor`, text under it `ui.cursor.text` | Never a palette colour, never the selection colour |
| Text selection | `ui.selection` under `ui.text` (syntax keeps its own colour) | Terminals, editors, form fields, `::selection`. Never a surface step |
| Inactive / unfocused text selection | none yet: add `ui.selection.inactive` (`carriesCode: 0.65`) | Today GTK, darktable, Tinted8 and VS Code give three different answers |
| Row / list selection (chrome, not text) | `ui.fill` under `ui.on.fill` | KDE, GTK, GIMP. Every foreground the app draws on that row (links, status, visited) switches to `ui.on.fill` |
| Current line | `ui.line.current` | Gutter stays `ui.pane.secondary`; current line number `ui.accent`; other line numbers `ui.text.subtle` |
| Search / find: current match | `ui.mark1` under `ui.mark.text` | Other matches: a 30–40% mix of `ui.mark1` into `ui.background`. Never `ui.fill` under syntax text |
| Bracket match | `ui.accent` on `surface1` | micro and Notepad++ do this; follow them |
| Window / split border, focused | `ui.border.active` | Only for the thing that has focus, never idle button edges |
| Window / split border, unfocused | `ui.border.inactive` | overlay1: edges that must be seen at 3:1 |
| Hairline separators inside a window | `surface1` (structural) | Tab borders, panel dividers, toolbar separators |
| Focus ring | `ui.focus` | Never the accent, never the mix spelled inline |
| Hover | `ui.accent` for a hover *outline* (KDE `DecorationHover`); a surface step for a hover *fill* under `ui.text` | Hover text on jam does not read |
| Tabs | active: `ui.tab.active` with a `ui.tab.indicator` line; inactive: `ui.tab.inactive` with `ui.text.muted`; strip: `ui.pane.tertiary` | kitty fills the whole active tab with the indicator and puts `ui.on.tab.indicator` on it; that is the one exception, stated in its template. The indicator follows `tint`, not the accent |
| Status bar | `ui.text` on `ui.pane.secondary` | Error items `ui.on.error` on `ui.error`; warning items `ui.text` on a 40% `ui.warning` mix |
| Title / header bar | `ui.pane.secondary`; backdrop `ui.pane.tertiary` with `ui.text.muted` | |
| Tooltip | none yet: add `ui.tooltip` | GTK and darktable use crust, Tinted8 a mantle mix; pick one when adding the role |
| Scrollbar | slider `overlay0`, hover `overlay1`, track `ui.pane.secondary` (structural) | |
| Link, inline | `ui.link` | Includes symlinks in listings, Obsidian's `--link-color` family, `url_color` |
| Link, navigation / hover | a mix of `ui.link` toward `ui.text` | |
| Link, visited | none yet: add `ui.link.visited` (plum, `catppuccin: "="`) | KDE and GTK name `plum` directly today |
| Status: success / warning / error / info | `ui.success`, `ui.warning`, `ui.error`, `ui.info` for foregrounds **and** backgrounds, borders, gutters | Text on the error fill is `ui.on.error` |
| Diff | added `ui.success`; modified `ui.warning`; removed `syntax.diff.removed` for text and line backgrounds; `ui.error` only for icons and decorations | |
| Emphasis / secondary accent (match text in lists, headings) | none yet: add `ui.emphasis`, one colour | VS Code uses petal in one place and cherry in three |
| Accent as readable text (prompt segments, directory names, a user name) | `tint` | `jam` is a fill at about 3.5:1 as text; `berry` does not follow the nature tints, `tint` does |
| Bold / intense text | `ui.text` | Konsole draws bold with `ForegroundIntense` |
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
  Wisp and Fen. Where the app shows a tab strip, check the strip on Wisp; a light branch
  in the role is the fix, not a palette name in the template.
- **`ui.text.subtle` (overlay1) is never body text.** It is 3.3–3.5:1 on Wisp and Fen:
  line numbers, indent guides, placeholders. Listing columns people read (lsd `no-access`,
  starship `untracked`, timestamps) take `ui.text.muted`.
- **On-colours**: `ui.on.fill`, `ui.on.error`, `ui.on.tab.indicator` and `ui.cursor.text`
  each carry a light value; use the role, never `crust` or `#ffffff` by name.
- **Scheme-keyed files**: any file whose name or import encodes dark (`gimp-dark.css`,
  `common-dark.css`, `gtk-contained-dark.css`) must switch on `%SCHEME%`, and the light
  flavour must install under the name the app loads for a light scheme.
- Check on Wisp: the sidebar and status bar (text on `mantle`/`crust`), selected text,
  the current line, a search hit, and the tab strip.

## Verification

A port ships after all five steps, in this order.

1. **Build and check every tint.** `node build.mjs`, then `for v in src/variants/*.json;
   do node build.mjs --check "$v"; done` (both workflows run exactly this). Zero errors;
   read every warning. Commit the rebuilt `ports/`.
2. **Port assertions.** The `mustBe()` lines from step 11 exist and pass; prove one by
   breaking the key in the template and watching the build fail, then restore it.
3. **Install on a real host.** The devbox harness (`DarkBerry-review-<date>/devbox-harness/`
   beside the repo): `shoot.sh <flavour> <app>` installs the generated file from
   `~/darkberry/ports/` exactly as the template header says, launches the app under Xvfb
   `:99` with a demo tree, and writes `~/darkberry/shots/<app>-<flavour>.png`;
   `run-all.sh` loops the apps and flavours. Add a case for the new app and shoot Wisp and
   Mire at least. The screenshot must show: selected text, the current line, a search hit,
   a focused field, tabs and a status bar. Doing the install from the header's own text is
   what confirms the README sentence.
4. **Score it.** Per app and flavour, 7 points: applied (0–1: the theme is what is on
   screen), coverage of the app's chrome (0–2), consistency of meanings with the other
   ports (0–2), readability at a glance (0–2). Record scores and the environment gaps that
   are not the theme's fault in a dated `scores-pass<N>.md` in the review folder beside
   the repo (`docs/` is generated, so scores cannot live there); `scores-pass1.md` is the
   format. Anything under 5 is a fix before shipping.
5. **Compare with the Catppuccin counterpart key by key.** From step 2 of porting: every
   key set on one side only, and for every shared key whether Darkberry's role resolves to
   the same slot; grep the template for palette names that shadow a role (`berry` where
   `ui.tab.indicator`, `frost` where `ui.link`, `cranberry`/`honey` where status roles,
   `surface0` where `ui.line.current`, `surface1`/`surface2` where selection); measure
   each host-owned pairing per flavour. Every difference is recorded (next section) or
   fixed.

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
   `node build.mjs src/variants/<file>.json` builds it. Regenerate the variants after
   changing the default palette.
6. Never hand-edit `ports/`, `dist/`, `docs/` or `site/`; they are generated.
