# Darkberry design language

What a Darkberry port looks like, as rules a reviewer can check from four 1200x750
screenshots, the template and a pixel histogram. `STYLE_GUIDE.md` is the colour contract:
which role each meaning takes and which contrast floors the build enforces. This file is
the look: how much of each colour a frame holds, what the eye lands on first, and what
"still the app's own theme" looks like. Where the two files overlap, the style guide wins
and this file points at its section. The numbers here were measured from the reference
frames under `ports/{vscode,kitty,neovim,gtk,btop,firefox}/assets/` and from
`src/palette.json` with `lib/color.mjs`; the method is at the end.

## 1. Character

Darkberry is a quiet wine-dark room with berries on the table. The room is the neutrals:
one purple, stepped into panes and surfaces that differ by a few units. The berries are
syntax, prompts and small signals. Chrome never carries a berry as a fill except for the
handful of things the style guide names: buttons, badges, the active terminal tab.

| It is | It is not |
|---|---|
| Low-contrast between surfaces, full contrast between text and surface | A flat single-colour background with grey chrome |
| Fourteen accents at reading strength, each with one job, the same job in every flavour | An accent that changes meaning per app, or a rainbow status bar |
| One pink family for everything interactive: jam fills, tint text, petal cursor, berry keywords | Blue focus rings, blue title bars, blue links left over from the app |
| Wisp as the same design with the lights on: text is the dark purple, the page is pale pink | Wisp as an inverted dark theme, or a white theme with pink buttons |

## 2. The surface ladder

Panes step away from the text colour, surfaces step toward it. On the dark flavours that
means panes get darker and surfaces get lighter. On Wisp both get darker than the page,
and surface0 sits below crust. The direction flips, the order never does.

| Rung | Role or palette name | Used for | Wisp L | Fen L | Mire L | Blackwater L |
|---|---|---|---|---|---|---|
| crust | `ui.pane.tertiary` | tab strip, panel backdrop, titlebar when inactive | 90.5 | 27.8 | 19.6 | 15.6 |
| mantle | `ui.pane.secondary` | sidebar, status bar, title bar, gutter, popups | 93.8 | 31.3 | 22.1 | 17.6 |
| base | `ui.background` | editor, terminal, page | 97.4 | 35.6 | 25.3 | 20.0 |
| surface0 | structural | inputs, hover fills, meter tracks | 86.2 | 40.6 | 27.5 | 23.8 |
| surface1 | structural | hairlines, word highlight, indent guides | 81.2 | 45.8 | 31.1 | 27.9 |
| surface2 | structural | active indent guide, unfilled meter | 76.6 | 50.9 | 35.6 | 32.6 |

L is OKLch lightness times 100. Step sizes between neighbours, as OKLab distance times
100 and as contrast ratio:

| Step | Wisp | Fen | Mire | Blackwater |
|---|---|---|---|---|
| crust to mantle | 3.3 / 1.11 | 3.5 / 1.12 | 2.5 / 1.05 | 2.0 / 1.03 |
| mantle to base | 3.7 / 1.12 | 4.4 / 1.17 | 3.2 / 1.09 | 2.5 / 1.05 |
| base to surface0 | 11.3 / 1.42 | 5.0 / 1.23 | 2.3 / 1.07 | 3.8 / 1.09 |
| surface0 to surface1 | 5.1 / 1.18 | 5.2 / 1.25 | 3.7 / 1.12 | 4.2 / 1.12 |
| surface1 to surface2 | 4.6 / 1.17 | 5.0 / 1.24 | 4.7 / 1.18 | 4.8 / 1.18 |

What that looks like in a frame:

- A pane step is visible but quiet: 2 to 4.4 units. The sidebar reads as a different
  panel from the editor without a drawn border. Mire and Blackwater are the quietest.
- A surface step is one notch louder, 2.3 to 5.2 units, so an input field or a hover row
  reads as a thing on the pane, not as another pane.
- Wisp's base-to-surface0 jump is 11 units, twice any other step. An input on Wisp is a
  visibly darker box. That is expected.
- Flat means the frame has no mantle or crust at all, or a pane the app paints in base
  where the role table says mantle. In the references, base plus mantle plus crust cover
  86 to 92 percent of an editor or terminal frame and mantle alone covers 8 to 35 percent
  wherever the app has a sidebar or status bar.
- Too much depth means a pane drawn in a surface step, a drop shadow, or a border between
  panes stronger than `surface1` where the table says a hairline. Pane borders in the
  references are `surface1`, 1.2 to 1.7:1 on base, and only split or window edges go to
  `ui.border.inactive` at 3.3 to 4.4:1.

## 3. The accent budget

Colour lives in syntax and in small signals. Chrome stays neutral. This was measured, not
assumed. Share of the frame covered by the fill family (`jam`, `tint`, `berry`) and by any
of the sixteen accents, in the four Darkberry flavours:

| Reference | jam + tint + berry | All accents | base + mantle + crust | Where the accent is |
|---|---|---|---|---|
| VS Code | 0.13 to 0.15 % | 0.47 to 0.66 % | 88 to 90 % | Sign In button, badge count, active tab line, current line number |
| kitty | 0.19 to 0.26 % | 1.4 to 1.7 % | 91 to 92 % | prompt directory in tint, cursor, ANSI stripes |
| Neovim | 0.00 to 0.05 % | 0.23 to 0.64 % | 90 to 93 % | current line number, headings, directory names |
| btop | 0.01 to 0.03 % | 1.7 to 1.8 % | 86 to 88 % | box outlines in pale accents, meters, process names |
| GTK demo | 0.52 to 1.05 % | 0.83 to 1.37 % | 80 to 87 % | every widget at once: checks, switches, sliders, row selection |
| Firefox | 2.06 to 2.21 % | 2.3 to 2.6 % | 60 to 82 % | the page content, which is the Darkberry site; the chrome itself holds none |

Rules a reviewer applies from the table:

- The fill family covers under 0.3 percent of an editor or terminal frame, under 1.1
  percent of a widget gallery. A port whose jam share passes 2 percent on a frame of
  ordinary content has filled something it should not have.
- All accents together stay under 2 percent of chrome-plus-code frames. Syntax is where
  the number climbs, and a frame that is mostly code may reach 3 to 4 percent. That is
  the content, not the chrome, and it is fine.
- Fill, in jam under `ui.on.fill`, goes on buttons, badges, progress bars, a selected row
  and a multiplexer's session segment. Nothing larger than a button.
- Tint goes on the active terminal tab as a fill, on the editor tab as a line, and as
  text for prompt segments and directory names. Tint is berry on the dark flavours and a
  deeper pink on Wisp, 4.3 units from berry.
- Never accent-filled: a whole status bar, a title bar, a sidebar, a tab strip, a gutter,
  a scrollbar, a selection, a current line, a window border on something unfocused. VS
  Code's status bar is mantle, not blue, and its activity bar is base. kitty's titlebar
  is mantle. The tmux status strip is crust with mantle segments; only `#S` is a jam pill.
- Pale accents may outline boxes in a TUI, as btop does, because the style guide allows a
  palette colour for a box outline. They stay as one-cell lines, never fills.

## 4. Signal hierarchy

What the eye lands on first, in order, and how each is drawn. Measurements are on base,
Wisp / Fen / Mire / Blackwater.

| Rank | Signal | Drawn as | Measured |
|---|---|---|---|
| 1 | Cursor | `ui.cursor`, a petal block or bar, text under it `ui.cursor.text` | 5.7 / 7.7 / 9.4 / 10.7 contrast on base; the brightest single thing in a frame |
| 2 | Current search hit | `ui.mark1` lavender fill under `ui.mark.text` | the only opaque accent fill in a text area |
| 3 | Selection | `ui.selection`, berry tinted into base, text keeps its colour | 8.7 to 11.5 units from base |
| 4 | Active tab | editors: `ui.tab.active` with a one-line `ui.tab.indicator`; terminals: the tab filled in `ui.tab.indicator` | tint is 4.75 to 7.5:1 on base |
| 5 | Focus | `ui.focus`, a dusty rose ring | 8.4 to 14.5 units from jam, so a focus ring never reads as a button |
| 6 | Other search hits | `ui.search.matches`, mark1 at 22 % | 10.2 to 14.3 units from base; 2.9 to 4.4 units from the selection, told apart by hue |
| 7 | Current line | `ui.line.current` | 0.8 to 3.9 units from base; Mire's is the faintest |
| 8 | Status, diff, diagnostics | the four status roles as text, undercurl or gutter mark; diff lines as 10 to 18 % tints | present but never louder than the selection |

Consequences:

- Selection is louder than the current line in every flavour, by 6.8 to 10.1 units. If a
  frame shows a selection and a current line that look alike, the port has mapped one to
  a surface step.
- The current line is meant to be faint. A current line a reviewer notices before the
  selection is too strong, and on Mire a current line that cannot be found at all is still
  correct.
- Search hits and selection are close in lightness. The reviewer checks hue: lavender is
  a search hit, pink is a selection.
- The cursor is petal, never jam and never the selection colour. In an unfocused pane it
  drops to `ui.text.subtle`.

## 5. Flavours and tints

Across the four Darkberry frames, these stay identical and these change:

| Stays identical | Changes |
|---|---|
| Layout, window size, content, scroll position | Every neutral: panes, surfaces, text, muted text |
| Which element carries which meaning | Accents: Wisp has deep ones, Fen its own brighter set, Mire and Blackwater share one set except jam |
| Bold, italic, underline, undercurl placement | Jam's lightness, settled per flavour by the fill equation |
| The fill family's share of the frame, within 0.1 % | Pane step sizes: Fen's are the widest, Blackwater's the narrowest |

Per flavour:

- Wisp is the same design with text and page swapped in lightness. Syntax colours are
  deeper versions of the same hues, so a keyword is still pink and a string still green.
  Surfaces are darker than the page. The Sign In button is still a jam pill with white
  text. Inactive tabs on crust are 1.1:1 and that is a known gap, recorded in the style
  guide's light flavour rules.
- Fen has the widest pane steps and the lightest base. Accents are brighter than Mire's.
  Jam on Fen takes crust as its on-colour, not white; a Fen button with white text is a
  bug.
- Mire is the reference. Pane steps are 2.5 and 3.2 units. The current line is almost
  invisible by design.
- Blackwater is Mire's accents on deeper surfaces. Pixel-for-pixel, anything that is an
  accent in Mire is the same hex in Blackwater; only base, mantle, crust, the surfaces,
  the text ramp and jam move.

Across tints, as `docs/COPY.md` puts it, a tint changes the room, not the furniture. The
neutrals shift hue, the fourteen accents do not move, and the fill family keeps the same
share of the frame. A reviewer with tint frames compares them to the Darkberry frame of
the same flavour and expects accent pixels to match exactly.

## 6. Typography and decoration

### Recommended fonts

Darkberry recommends one font per job. Ports never set a font; these are what the README,
the site and the pattern gallery show, and what a port's screenshots should use where the
app lets the contributor choose.

| Job | Font | Why |
|---|---|---|
| Code, terminals, editors | Fira Code Nerd Font | Coding ligatures; the Nerd Font icons for prompts, file trees and status lines |
| UI text: menus, buttons, labels, tabs, status bars | Fira Mono Nerd Font | The same letterforms as the code face without ligatures, so UI and code read as one family; the same icons |
| Headings | Manufacturing Consent | The site's display face |
| Section labels | Bodoni Moda SC | The site's eyebrow face |
| Prose | Bodoni Moda | The site's body face |

Fira Mono covers UI only where a display face does not apply: a heading stays in
Manufacturing Consent, a label in Bodoni Moda SC, a paragraph in Bodoni Moda. Without the
Nerd Font installed, plain Fira Code and Fira Mono have the same letters and lack only the
icons.

### Decoration

Font styles are the ones the VS Code template carries, per style guide step 8. The theme
owns these and only these:

| Decoration | Where | Not |
|---|---|---|
| Italic | comments and doc comments, markup italic, `self` and `super`, Python flow keywords | keywords in general, strings, types |
| Bold | headings and titles in `ui.emphasis`, the current line number, bracket match, a selected menu row, a terminal's active tab, Todo | body text, a selection, line numbers, every keyword |
| Underline | the editor's active tab indicator, links | emphasis in code |
| Undercurl | diagnostics in the four status colours, spelling | errors as a fill behind text |
| Strikethrough | deprecated code, markup strikethrough | nothing else |

Nothing is bold under a selection. Neovim's `Visual` is `ui.selection` alone and its
header says why: bold under a selection changes the text width. Terminal bold is `ui.text`,
never a brighter ANSI colour.

## 7. Anti-patterns

How each one shows up, and where to look.

| Anti-pattern | How to spot it | Where |
|---|---|---|
| App-default blue or grey in chrome | A hue in the frame that is not plum, pink, or one of the fourteen berries; a status bar or title bar the colour of the app's stock theme | `pixel-audit.mjs`: an `off` cluster (over 6 units from every palette entry and role), or a `near!` cluster (an untinted grey; every Darkberry neutral carries the plum hue, so a grey that lands near one is still the app's own) |
| Off-palette colour | Same test, in a text area or a widget. The references have no such colour over 0.2 % except image content | histogram, then the template for a hex or an unmapped key |
| Accent overuse | A bar, strip or pane filled in jam or tint; the fill family over 0.3 % on an editor frame, over 2 % on any frame | histogram, then the frame |
| Inverted light flavour | Wisp's panes are lighter than its page, or Wisp's accents are the dark flavours' pastels on white | frame: mantle must be darker than base on Wisp; template: a hardcoded dark value |
| Light flavour not themed | Wisp shows the app's stock light theme with pink syntax | frame, and the usage file for the light install name |
| Borders too strong | Pane dividers in overlay1 or an accent where the table says `surface1`; a border on an unfocused window in jam | frame; template `border` keys |
| Borders too weak | A split or a drawn character line in surface1, which is 1.2:1 on Mire | template: `ui.border.inactive` for anything that must be seen |
| Selection equals current line | Two rows that differ by under 5 units; a selection drawn in surface0 or surface1 | frame; template: `ui.selection` and `ui.line.current` |
| Search hit equals selection | A search hit in pink, or a selection in lavender | frame |
| Cursor in the accent | A jam or berry block cursor | template: `ui.cursor` |
| Focus ring in the accent | The focused input's outline is jam | template: `ui.focus` |
| Row selection without on-colour | A selected list row in jam with body text, or link text, still in the pane's colour | frame, host-owned pairing per style guide step 5 |
| Bright ANSI used as body text | Faint text on Wisp where the app read a bright slot | frame on Wisp |
| Scheme-specific layout | Wisp's frame has different panels, sizes or content from Mire's | the four frames side by side |

## 8. Reviewer checklist

Each item is one check with a pass criterion, where to look, and which rule it enforces.
Measurable means a number from the histogram or the template decides it. Judgement means
the reviewer looks and decides.

1. Four frames, same size, same content, same scroll position, only colours change.
   Pass: a diff of any two frames shows colour change only. Frames. Section 5. Measurable.
2. base, mantle and crust together cover 80 percent or more of the frame, and mantle is
   present wherever the app has a sidebar, status bar or title bar. Image-heavy frames
   are excused. Histogram. Section 2. Measurable.
3. No pane is drawn in surface0 or above. Pass: the only surface-step areas are inputs,
   hover rows, tracks and hairlines. Frame and template. Section 2. Judgement.
4. On Wisp, mantle and crust are darker than base. Frame. Sections 2 and 5. Measurable.
5. Fill family under 0.3 percent on an editor or terminal frame, under 1.1 percent on a
   widget gallery, never over 2 percent; all accents under 2 percent on a chrome-plus-code
   frame. Histogram. Section 3. Measurable.
6. No status bar, title bar, tab strip, sidebar, gutter or scrollbar is filled in jam,
   tint or any accent. Frame and template keys. Section 3. Judgement.
7. Every jam fill in the frame is a button, badge, progress bar, selected row or session
   segment. Frame. Section 3. Judgement.
8. No colour over 0.2 percent of the frame sits more than 6 units from every palette
   entry or role, and no untinted grey covers a region, image content excluded. Pass:
   `pixel-audit.mjs` shows no `off` and no `near!` cluster. Histogram. Section 7. Measurable.
9. The build passed, so the template has no literal hex. Template. Style guide rule 1.
   Measurable.
10. The cursor is `ui.cursor` in the template and reads as the brightest thing in the
    frame. Section 4. Measurable on the template, judgement on the frame.
11. A selection and a current line are both visible, the selection is pink, the current
    line is at most 4 units from base, and the two differ by 5 units or more. Pass: read
    the colours off the frame and run `deltaE`. Frame. Section 4. Measurable.
12. The current search hit is an opaque lavender fill and the other hits a faint lavender
    tint. Frame and template `ui.mark1`, `ui.search.matches`. Section 4. Judgement on the
    frame, measurable on the template.
13. The active tab shows tint: a line in an editor or browser, a filled tab in a terminal.
    Inactive tabs are mantle with muted text. Frame and template. Section 4. Judgement.
14. The focus ring is `ui.focus`, not jam. Template. Section 4. Measurable.
15. Unfocused split or window edges are `ui.border.inactive`; in-window dividers are
    `surface1`. Template. Section 2. Measurable.
16. Jam's on-colour is the role, so Fen shows crust text on jam and the others white.
    Frame on Fen. Section 5. Judgement.
17. Accent pixels are the same hex in Mire and Blackwater, and Wisp shows no pastel
    accent. Histogram. Section 5. Measurable.
18. Italic and bold appear only where the section 6 table lists them, and never under a
    selection. Template font-style keys and frame. Section 6. Measurable on the template.
19. Diagnostics are undercurl in the status colours, not fills. Template and frame.
    Section 6. Judgement.
20. Wisp's frame is the same layout as Mire's with a themed light scheme, not the app's
    stock light theme. Frames side by side. Section 7. Judgement.
21. Every host-owned pairing in the template header has its measured contrast per
    flavour. Template header. Style guide step 5. Measurable.
22. With tint frames: accent pixels match the Darkberry frame of the same flavour
    exactly. Histogram. Section 5. Measurable.
23. Syntax shows the roles the table names: strings, comments, numbers, keywords,
    functions and types each in their own colour, matching the VS Code reference frame
    for the same construct. Glyphs are never flat, so no script checks this. Frame beside
    the reference. Style guide step 8. Judgement.

## Where the references disagree

The style guide says VS Code wins for syntax, kitty for terminal chrome, and the meaning
to role table for editor chrome. Five places where the VS Code template does not show the
table's answer, so a reviewer should not copy them from its frame:

| Meaning | Table says | VS Code template says | Canonical |
|---|---|---|---|
| Search hits | `ui.mark1` current, `ui.search.matches` others | `mix(surface1,berry,0.15)` at 50 % and `jam` at 25 % | table; Neovim's frame shows it right |
| Bracket match | `ui.accent` bold on `ui.line.current` | `gooseberry` at 10 % with an `overlay1` border | table; Neovim's `MatchParen` shows it right |
| Row selection in a list | `ui.fill` under `ui.on.fill` | `mix(surface1,berry,0.25)` under body text | table; GTK, tmux and Neovim's `PmenuSel` show it right |
| Gutter | `ui.pane.secondary` | `base` | table; Neovim's frame shows it right |
| Current line number | `ui.accent` | `subtext0` | table; Neovim's frame shows it right |

The Firefox frames are a poor accent reference because the page content is the Darkberry
site, whose wordmark is jam. Judge a browser port's chrome against the strip above the
page only. The striped URL bar in those frames is Firefox's remote-control marking from
the capture harness, not the theme.

## How the numbers were measured

- Frames: the shares in this file were first measured by quantising every pixel to 5
  bits per channel and assigning it to the nearest palette entry. Reviewers use
  `.claude/skills/darkberry-port/scripts/pixel-audit.mjs` instead, which matches within
  4 units rather than 6, so its shares run up to about 3 points lower for panes and a few
  hundredths lower for accents (VS Code Mire: panes 87.0, fill family 0.11). The limits
  below leave room for that. Its "all pixels" line is the panes, fill
  family and accent shares (items 2, 5, 17), and its cluster table is the off-palette
  test (item 8).
- Colour maths: `contrast`, `deltaE` and `toOklch` from `lib/color.mjs`, on the hex
  values in `src/palette.json` and the mixes in `src/roles.json`.
- A reviewer repeating a check needs only ImageMagick for the histogram and
  `node -e` with `lib/color.mjs` for a pair of colours read off the frame.
