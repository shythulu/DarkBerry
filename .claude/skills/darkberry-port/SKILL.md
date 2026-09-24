---
name: darkberry-port
description: Wizard for contributing a new Darkberry port (a theme for one more app, with the tints coming for free), from the Catppuccin starting point through the template, build wiring, an install-and-look prototyping loop, consented window screenshots, a WCAG and appearance review, and the pull request. Use this whenever someone wants to theme an app with Darkberry, add a port, "make Darkberry work in X", port a Catppuccin theme, or fix, re-screenshot or review an existing port's appearance, even if they only ask where to start.
---

# Darkberry port wizard

You are walking a contributor through one port: a Darkberry theme for one app, laid out
the way every folder under `ports/` is. The build does the repetitive part (four flavours,
four tints, READMEs, packaging); the contributor's judgement is needed for the colour
mapping and for how the result actually looks in the app. Treat this as a conversation
with checkpoints, not a script to run end to end. Say what step you are on, and at each
checkpoint ask before moving on.

The rules of the repository are in `STYLE_GUIDE.md` (colour rules, the twelve-step porting
procedure under *Porting an application*) and `docs/PORT_CREATION.md` (folder layout,
registry, tints). Read both before the first step; this skill sequences them and adds the
prototyping, screenshot and review practice around them, it does not repeat them.

## The steps

1. **Intake.** Which app, on which platform, and is it already in `src/ports.json`? An
   existing port means a fix or re-screenshot, so skip to the step that applies. Say up
   front what the whole road looks like, in particular that there is a prototyping and
   screenshot step near the end which needs the app installed and running here, so the
   contributor is not surprised later. Mention that tint screenshots are optional and
   come after Darkberry's own (the tint *files* come from the build regardless); the
   decision is taken at step 7, once they have seen what one set costs.
2. **Prerequisites.** Confirm the app is installed and which version (`--version`, the
   About box), since the version floor goes into the template header. Confirm
   `node build.mjs` passes on a clean checkout. Confirm a screenshot route exists for the
   platform (see `references/capture.md`); if none does, the contributor will take the
   screenshots themselves, which is fine, say so now. Confirm ImageMagick is installed
   (`convert -version`; `brew install imagemagick`, `apt install imagemagick`, or the
   Windows installer), and explain why it is needed rather than just asking for it: the
   README shows only `.webp` files, which keeps the repository small and the images sharp,
   and the main preview is the four flavours cut into slanted slices and layered, the way
   Catppuccin's catwalk composes its previews, so every port's README has the same shape.
   `scripts/compose.sh` does both with ImageMagick. A contributor who would rather run
   the commands themselves gets the exact sequence from *By hand* in
   `references/capture.md`; the result has to be the same five files either way.
3. **The Catppuccin starting point.** Catppuccin has probably ported this app already:
   `resources/ports.yml` in `catppuccin/catppuccin` lists them, and `catppuccin/<app>` holds
   the template. Fetch it (or ask the contributor for it) and record the repo, branch and
   commit for the template header. Its key list is the map of what the app can theme; its
   colour choices are a first draft of the meaning of each key, to be re-expressed as
   Darkberry roles, not copied. Where Catppuccin has no port, the app's own default theme
   or its docs are the key list, and say so in the header.
4. **Map keys to roles.** STYLE_GUIDE steps 2 to 5. Do this with the contributor: go
   through the keys in groups (backgrounds, text, selection and search, status, syntax,
   ANSI), name the meaning of each, and pick the role from the meaning → role table. Write
   the counts and the odd decisions into the notes file. Roles are shared by every port,
   so a meaning that no role covers is a conversation about adding a role, not a hex.
5. **Template, override file, wiring, assertions.** STYLE_GUIDE steps 6 to 11, then the
   registry entry and usage file from `docs/PORT_CREATION.md`. Run `node build.mjs`; it
   writes the port for Darkberry and every tint, the READMEs and the tint bar. If the
   app's format can hold every tint in one unit (one extension or one file contributing
   many themes, as VS Code and the GIMP palette do), the routing in `build.mjs`'s
   `route()` needs a case for it; the default is a subfolder per tint.
6. **Prototype in the app.** Install the Mire flavour the way the usage file says, open
   the app with real content (code with strings, comments and numbers; a diff; a search
   with hits; a selection; something in an error state), and look. Then Wisp, the light
   flavour, which shows a different set of problems. Fix what looks wrong at the right
   layer (STYLE_GUIDE *Where a change belongs*), rebuild, reinstall, look again. Only
   move on when the contributor is happy with what they see, because the screenshots are
   the record of this state.
7. **Screenshots**, under the consent rules below and the mechanics in
   `references/capture.md`. One frame per flavour, of the app window alone, showing the
   same content in each, 1200×750 or the nearest the app allows. Set the content up once,
   then ask the contributor not to touch the app until the run is over: the frames are of
   the live window, and a page change or a keystroke between flavours means retaking all
   of them. Darkberry's four frames come first, on their own, and get reviewed (step 8)
   before anything else is captured: whatever went wrong with them (a stray keystroke, a
   window that did not repaint, a shadow margin) would go wrong sixteen more times in a
   tint run. Once the four are agreed, tell the contributor how long they took and ask
   whether to go on to the tints, which cost four times that again; the tints are the
   same capture with the tint's files and go under `ports/<key>/<tint>/assets/`.
8. **Review**, with `references/review.md`: the screenshots against the template's
   expectations, the appearance of the port in the app, and contrast against WCAG and the
   roles' own floors. Present the findings as a short list, worst first, and agree on each
   with the contributor. Anything not agreed goes back to a prototyping session (step 6
   with variations, see below) rather than being argued.
9. **Compose and place.** `scripts/compose.sh <dir>` turns the four frames into the
   per-flavour `.webp` files and the `preview.webp` (the four flavours in slanted slices,
   as catppuccin/catwalk composes them). They go into `ports/<key>/assets/`, or
   `ports/<key>/<tint>/assets/` for a tint. Rebuild so the README picks them up, and open
   the README to confirm the images render.
10. **Pull request.** See *The pull request* below.

## Consent before any screenshot

A screenshot can capture things the contributor did not mean to share: other windows,
notifications, a second monitor, a password manager. So before the first capture, and
again if the setup changes:

- Say exactly what will be captured (which window, how many frames), where the files
  will be written, and that they will be deleted afterwards. Ask for a yes.
- Ask them to close or minimise every other window, on every monitor, and to silence
  notifications, and wait for them to say it is done.
- Agree on the temporary folder. Propose one (a fresh folder under the system temp
  directory, named for the port) and use whatever they choose. Never write frames into
  the repository or their home folder.
- Capture only the app's own window where the platform allows it, never the full screen
  unless the contributor explicitly prefers that. Before each capture, read the window
  title and owning process back to them (the commands are in `references/capture.md`)
  and only proceed when it is the app they expect.
- When the frames have been composed and placed, delete the temporary folder in their
  view: list what is in it, remove it with a command whose output shows each file going,
  and show that the folder is gone.

If they would rather not have you capture anything, that is a normal answer. Tell them
what a frame needs to contain (from step 7 and `references/capture.md`), let them take
the screenshots themselves however they like, and review what they hand you exactly as you
would your own. The same deletion offer applies to any copies you make.

## Prototyping variations

When a finding is not agreed, or something looks wrong and the cause is not obvious, set
up a short session: name the thing being judged (one surface, one pairing, one syntax
group), propose two or three variations that stay inside the rules (a different role for
the meaning, an override with a written reason, a mix the table allows), build each,
install it, look, and let the contributor say which reads best. Keep the notes of what
was tried and why the choice won, because the template header's *Differs from
Catppuccin* block and the override's `reason` are where that ends up. Do not resolve a
disagreement by picking a colour that is not in the palette or that no role describes;
that moves the problem into the next port.

## The pull request

If the contributor has not done this before, do it with them step by step and explain
each command in a sentence: a branch named `port/<key>`, `node build.mjs` and a check
that `git status` shows only intended files (the template, override, usage file, registry
entry, `build.mjs` and `package.sh` changes, the generated `ports/` folder for the port
and its tints, the screenshots), a commit whose message says what the port covers and
what deliberately differs from Catppuccin, a push, and `gh pr create` (or the GitHub
page) with the notes file's key counts and the four screenshots in the description. If
they know git, just say what the branch and commit should contain and let them drive.

## Bundled helpers

- `scripts/compose.sh <dir> [width] [height]`: four `<flavour>.png` frames in `<dir>` to
  `.webp` files and `preview.webp`. Needs ImageMagick; says so if it is missing.
- `scripts/contrast.mjs <fg> <bg> [more pairs]`: contrast ratios through
  `lib/color.mjs`, the same maths the build uses, for judging a pairing during
  prototyping.
- `references/capture.md`: per-platform window capture and title checks.
- `references/review.md`: the review checklist and the thresholds.
