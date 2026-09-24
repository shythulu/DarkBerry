# Reviewing a port

Three passes, findings listed worst first, each with what to look at and what the fix
would be. Agree on each finding with the contributor; a finding neither of you can agree
on goes to a prototyping session rather than being settled by assertion.

## 1. The frames against the template

- Four frames, one per flavour, same size, same content and scroll position, only the
  app's window in each. A frame showing another window, a notification or a desktop is
  retaken, not cropped.
- The frame shows the theme working: the surfaces named in the roles table are visible
  (background, a secondary pane, selection, current line, a status area), and at least
  one of each text kind (body, muted, syntax with strings and comments and numbers).
- The four look like the same theme in four flavours: the same layout, with only the
  palette changing. If Wisp looks like a different design, something in the port is
  scheme-specific that should be a role with a dark/light value.

## 2. Appearance in the app

Look for, flavour by flavour:

- Surfaces the theme did not reach: a toolbar, scrollbar, tooltip, dialog or menu still
  in the app's default grey or blue. Decide whether the app exposes a key for it (then map
  it) or hardcodes it (then say so in the template header, as the GTK port does for
  Adwaita's accents).
- Pairings the app chooses: text the app paints over a fill the theme sets, or the
  reverse. Each needs the matching `on.*` role or a fill the text reads on (STYLE_GUIDE
  step 5).
- Meaning drift: the accent used for something that is not the accent's meaning; an error
  colour on something that is not an error; two syntax groups that read as one colour.
  Compare with the VS Code port, which wins on syntax.
- The active tab, the cursor, the search hit and the selection, the four things a reader
  notices first. Each has a named role and an assertion in the build; check that the app
  shows them where the role says.
- Bold, italic and underline where the template asks for them, and nowhere else.

## 3. Contrast

The build already checks every role that declares a floor (`minContrast` in
`src/roles.json`) and writes the results to `docs/CHECKS.md`; read that first. The
screenshot review adds the pairings the build cannot see, the ones the app composes:

- Body text on every surface it lands on in the frame: 4.5:1 (WCAG AA for normal text).
- Large text (headings, the status line at a larger size) and UI components (borders of
  inputs, icons, the focus ring against its surroundings): 3:1.
- Syntax colours against the editor background: the roles' own floors apply, and the
  build's distinctness check (`deltaE` between syntax pairs, reported in `docs/CHECKS.md`
  as warnings) says when two groups are too close to tell apart.
- Text over a selection, a search hit, a current-line highlight and an error fill: read
  the actual pair off the frame (a colour picker, or the role values from
  `docs/ROLES.md`) and run `scripts/contrast.mjs <fg> <bg>`.

A pairing under its floor is a finding even when it "looks fine" on the contributor's
display; the floor is what the build enforces for every other port, and the fix is a
role or override choice, not a display setting.

## Writing up

For each finding: what, where (flavour, surface), the measured number where there is one,
the proposed fix and its layer (palette, role, template, override). Keep it to what needs
a decision; things that are simply right do not need a line.
