# Publishing the Ghostty port

`ports/ghostty/` holds four files named `Darkberry Wisp`, `Darkberry Fen`, `Darkberry Mire`,
`Darkberry Blackwater` (no extension) plus a `<tint>/` subfolder per tint (blueberry, cloudberry,
crowberry, lingonberry) with the same four flavours renamed for that tint, e.g. `Blueberry Mire`.
Each file is plain Ghostty theme syntax — `palette = N=#hex` for the 16 ANSI slots, then
`background`, `foreground`, `cursor-color`, `cursor-text`, `selection-background`,
`selection-foreground`, `split-divider-color` — meant to be copied to
`~/.config/ghostty/themes/` and referenced by name from `theme =` in the Ghostty config.

Ghostty ships no theme-submission path of its own: its hundreds of bundled themes are generated
weekly, on the `ghostty-org/ghostty` main branch, from the `mbadolato/iTerm2-Color-Schemes`
project. A theme reaches Ghostty's built-in list by being accepted into that upstream repo, not
by a PR to Ghostty itself.

## Venues

### iTerm2-Color-Schemes (upstream source Ghostty bundles weekly)

- **URL**: https://github.com/mbadolato/iTerm2-Color-Schemes
- **Kind**: community repo, but the de facto official gallery for Ghostty — Ghostty's own docs
  point contributors here, and its CI pulls new themes into Ghostty's bundled set weekly.
- **Accepts**: a source file under `yaml/` (preferred) or `schemes/` (`.itermcolors`, for themes
  exported directly from iTerm2) — never a hand-written file under `ghostty/` or any other
  per-app output directory, those are generated. File name must be the exact human-readable
  display name, no slugifying and no underscores for spaces, e.g. `yaml/Darkberry Wisp.yml`. The
  YAML format (Gogh-based) uses `color_01`–`color_16` (0–7 normal, 8–15 bright), `background`,
  `foreground`, `cursor`, `cursor_text`, `selection`, `selection_text`, plus optional `name`
  (must match the filename if given), `author`, and `variant` (`dark`/`light`) — confirmed
  against the live `yaml/Catppuccin Mocha.yml`. Optional metadata beyond that: an entry in
  `CREDITS.md` crediting the author. No licence field per theme — the whole repo is MIT and a
  contribution is accepted under that licence.
- **Requirements**: a GitHub account to open a pull request; no fee, no signing key, no special
  approval beyond ordinary PR review. `AGENTS.md` explicitly welcomes AI-assisted contributions
  and asks that AI involvement be disclosed in the commit message/PR description (removable by
  the human contributor if they prefer).
- **Steps**:
  1. Fork the repo, set up the Python tooling (`python -m venv .venv && source .venv/bin/activate
     && pip install -r requirements.txt`, or use `./generate-all.sh` via Docker).
  2. Add `yaml/Darkberry Wisp.yml` (and one file per flavour/tint being submitted) following the
     field list above — translate directly from the corresponding `ports/ghostty/` file (palette
     0–15 -> `color_01`–`color_16`, `background`/`foreground`/`cursor-color`/`cursor-text`/
     `selection-background`/`selection-foreground` map 1:1 to the YAML keys, `split-divider-color`
     has no YAML equivalent and is dropped).
  3. Regenerate outputs for just that theme: `cd tools && python gen.py -s "Darkberry Wisp"`.
     This produces the `ghostty/` (and every other app's) port file automatically — do not
     hand-write it.
  4. Optionally check contrast: `python tools/wcag_check.py -s "Darkberry Wisp"`.
  5. Optionally add a `CREDITS.md` line crediting shythulu / linking the Darkberry repo.
  6. Do not hand-edit `README.md`'s screenshot section — CI regenerates it.
  7. Open a pull request; the PR template asks for a description and confirms the file is
     `.itermcolors` or `.yml` named as the display name.
- **Updates**: a follow-up PR editing the same `yaml/` source file and re-running `gen.py -s`;
  CI (`generate-all.yml`) regenerates derived formats and screenshots on merge to `master`.
- **Contacts**: issues at https://github.com/mbadolato/iTerm2-Color-Schemes/issues; maintainer
  is GitHub user mbadolato (Mark Badolato).
- **Sources**: https://ghostty.org/docs/features/theme (2026-09-24, confirms weekly sourcing
  from iTerm2-Color-Schemes); `AGENTS.md`, `README.md`, `yaml/README.md`,
  `.github/pull_request_template.md`, `CREDITS.md`, `LICENSE`, and `yaml/Catppuccin Mocha.yml`
  all read directly via `gh api repos/mbadolato/iTerm2-Color-Schemes/contents/...` (2026-09-24).
- **Confidence**: verified — the whole submission path (file format, naming, generation
  command, PR template) was read from the live repo's own contributor docs and a real example
  theme file, not summarized secondhand.

### ghostty.style (community gallery)

- **URL**: https://ghostty.style (site), https://ghostty.style/upload (submission page),
  https://github.com/aryabyte21/ghostty.style (source)
- **Kind**: community repo/gallery, unofficial — not run by Ghostty's maintainers or by
  mbadolato. Announced by its author in `ghostty-org/ghostty` discussion #10928. Themes live in
  a Supabase database behind the site, not as files in the GitHub repo.
- **Accepts**: a Ghostty theme submitted through the web upload form, validated in real time
  against Ghostty's own config reference (catches bad hex colours, invalid keys, wrong enum
  values). Exact required metadata fields (author name, tags, preview generation) are not
  documented in the repo's README and were not verified by using the form itself.
- **Requirements**: unverified — the README does not say whether an account/sign-in is needed to
  upload, and the repo has no `CONTRIBUTING.md`. No fee is implied; the project takes Ko-fi
  donations for hosting.
- **Steps** (best available from the README, not from using the form): open
  https://ghostty.style/upload and submit the theme's Ghostty config file per flavour/tint; the
  site validates and (per its feature list) allows tagging and light/dark marking.
- **Updates**: unverified — no documented edit/re-submit flow was found.
- **Contacts**: GitHub issues at https://github.com/aryabyte21/ghostty.style/issues; author is
  GitHub user aryabyte21.
- **Sources**: https://github.com/ghostty-org/ghostty/discussions/10928 (2026-09-24);
  https://github.com/aryabyte21/ghostty.style README read via `gh api` (2026-09-24).
- **Confidence**: partly verified — the site's existence, ownership, and general upload feature
  are confirmed from its own README and the Ghostty discussion thread; the exact submission
  form fields, account requirement, and update process are unverified since the form itself
  wasn't exercised.

### Awesome-Ghostty (curated list)

- **URL**: https://github.com/wyattgill9/Awesome-Ghostty (maintained fork; the original,
  https://github.com/fearlessgeekmedia/Awesome-Ghostty, says in its own README it is "no longer
  maintained" and points to this fork)
- **Kind**: community repo (curated "awesome list"), not run by Ghostty's maintainers.
- **Accepts**: one Markdown list item under `## Themes` in `README.md`, format
  `* [Name](repo-url) - optional short description`. Confirmed from the live `## Themes` section:
  most entries link straight to the theme's own GitHub repo (e.g. `catppuccin/ghostty`,
  `rose-pine/ghostty`), roughly alphabetically ordered but not strictly. No preview image or
  metadata fields live in the list itself.
- **Requirements**: a GitHub account to open a PR; no fee, no signing, no formal review criteria
  found (no `CONTRIBUTING.md` in the repo).
- **Steps**:
  1. Fork https://github.com/wyattgill9/Awesome-Ghostty.
  2. Edit `README.md`, adding a line under `## Themes`, e.g.
     `* [Darkberry](https://github.com/shythulu/DarkBerry) - four berry-dark flavours, four tints.`
  3. Open a pull request.
- **Updates**: a follow-up PR editing the same line.
- **Contacts**: issues at https://github.com/wyattgill9/Awesome-Ghostty/issues.
- **Sources**: `gh api repos/fearlessgeekmedia/Awesome-Ghostty/contents/README.md` (2026-09-24,
  shows the "no longer maintained, forked here" notice) and
  `gh api repos/wyattgill9/Awesome-Ghostty/contents/README.md` (2026-09-24, shows the live
  `## Themes` list and format).
- **Confidence**: partly verified — list format and the maintained-fork pointer are confirmed
  live; actual PR review bar is unverified.

## Not applicable

- **`ghostty-org/ghostty` itself** — does not accept theme files directly; its docs
  (https://ghostty.org/docs/features/theme, fetched 2026-09-24) say built-in themes are sourced
  from iTerm2-Color-Schemes and synced in weekly, so a theme PR against Ghostty's own repo would
  be redirected upstream.
- **A Ghostty package/marketplace or extension store** — none exists; Ghostty has no plugin or
  extension system and themes are plain config files, not packages. Checked
  https://ghostty.org/docs and the features index for any such store; none found.
- **Package registries (Homebrew, npm, crates.io, etc.)** — not checked in exhaustive detail
  because Ghostty themes are single config files with no ecosystem convention of shipping them
  through a language/OS package registry; none of the venues above reference one.
- **terminalthemes.com** — a newer browsing app by the same iTerm2-Color-Schemes maintainer
  (mbadolato), surfaced in search results as a "beta" viewer. It appears to browse the same
  underlying scheme set rather than accept independent submissions, so it is not a separate
  venue from iTerm2-Color-Schemes above; not independently verified since it wasn't fetched.

## Open questions

- Whether to submit all sixteen combinations (four flavours x four tints) to
  iTerm2-Color-Schemes, or just the four base Darkberry flavours first and the tints later, is a
  scope decision for whoever submits — the repo has no stated limit on themes per PR, but
  `AGENTS.md` asks contributors to "keep diffs focused" (one theme at a time is safer).
  Darkberry's own file-naming convention (`"<Tint> <Flavour>"`, e.g. `Blueberry Mire`) already
  matches iTerm2-Color-Schemes' naming rule (human-readable, no slugifying), so no renaming is
  needed either way.
- Which GitHub account opens the iTerm2-Color-Schemes and Awesome-Ghostty pull requests
  (shythulu directly, or otherwise) is for the submitting agent/human to decide.
- Whether it's worth using ghostty.style at all given its unverified account/process and
  single-maintainer, donation-funded status — a human call, not a research gap that more
  fetching would close without actually using the form.
