# Publishing the Alacritty port

`ports/alacritty/` holds four `darkberry-<flavour>.toml` files (Wisp, Fen, Mire, Blackwater) at
the top level plus a `<tint>/` subfolder per tint (blueberry, cloudberry, crowberry,
lingonberry) each with its own four `<tint>-<flavour>.toml` files — sixteen files total, each a
complete, self-contained Alacritty colour config (`[colors.*]` tables plus two
`[[colors.indexed_colors]]` entries) meant to be copied into `~/.config/alacritty/themes/` and
pulled in with `import = [...]`.

## Venues

### alacritty/alacritty-theme (official gallery)

- **URL**: https://github.com/alacritty/alacritty-theme
- **Kind**: official gallery — a GitHub repo maintained by the Alacritty org (maintainers
  listed as indrajit/eendroroy, the original author, and Christian Dürr/chrisduerr), accepting
  themes as pull requests. This is Alacritty's de facto theme store; the project ships no other
  gallery, marketplace or package registry.
- **Accepts**: a `{theme}.toml` file added to the `themes/` directory (existing names are
  lower_snake_case, e.g. `catppuccin_mocha.toml`, `rose_pine_dawn.toml`, `everforest_dark_hard.toml`
  — multi-word flavour families are one file per variant, so Darkberry's 16 files fit the
  existing pattern, e.g. `darkberry_wisp.toml`, `darkberry_lingonberry_wisp.toml`). Also
  required: a screenshot generated with the repo's own `print_colors.sh` script (prints the 16
  ANSI colours to the terminal; the contributor screenshots that terminal window — existing
  images are plain PNGs sized to whatever the contributor's terminal window was, e.g. 701×161 for
  `catppuccin_mocha.png`, no fixed pixel requirement found), saved as `images/{theme}.png`, and a
  new row added to the table in `README.md` in alphabetical order (`**_name_**<br>[source](url)`
  plus the image). No author-name, licence or version metadata fields are used anywhere in the
  repo's own bookkeeping beyond that optional "source" link to the theme's own upstream repo.
- **Requirements**: no account approval, fee, or signing — a GitHub PR is the whole process.
  The one hard rule: **"submissions by theme authors are not accepted, to ensure there's at
  least some community interest."** This means shythulu (or any DarkBerry maintainer) opening
  the PR directly is against the stated policy; it needs a third party (a user of the theme) to
  submit it, or at minimum the PR should not read as self-promotion from the author. The repo
  itself is Apache-2.0 licensed; it does not require contributed theme files to be relicensed,
  only that they be added under a PR the maintainers accept.
- **Steps**:
  1. A non-author community member forks https://github.com/alacritty/alacritty-theme.
  2. Add each Darkberry file to `themes/` as `{theme}.toml` (strip or keep the build-generated
     header comment — not specified either way; existing theme files carry no header comments,
     so trimming DarkBerry's explanatory header to just the `[colors.*]` tables would match
     house style more closely — unverified whether this matters to reviewers).
  3. Run `print_colors.sh` in a terminal configured with that theme, screenshot it, save as
     `images/{theme}.png`.
  4. Add one row per theme to the table in `README.md`, alphabetically by theme name.
  5. Open a PR against `master`.
- **Updates**: a follow-up PR editing the same `.toml`/`.png`/README row; no versioning beyond
  git history.
- **Contacts**: issues at https://github.com/alacritty/alacritty-theme/issues (2 open at time of
  research); maintainers chrisduerr and eendroroy via the repo.
- **Sources**: https://raw.githubusercontent.com/alacritty/alacritty-theme/master/README.md
  (fetched 2026-09-24, "Contributing" section with the exact wording quoted above, and the theme
  table showing multi-variant families like catppuccin/everforest/rose_pine/tokyo_night);
  https://raw.githubusercontent.com/alacritty/alacritty-theme/master/print_colors.sh (fetched
  2026-09-24); https://raw.githubusercontent.com/alacritty/alacritty-theme/master/themes/catppuccin_mocha.toml
  (fetched 2026-09-24, format comparison); image dimensions checked on
  `images/catppuccin_mocha.png` (fetched 2026-09-24, 701×161 PNG, no metadata on required size);
  https://api.github.com/repos/alacritty/alacritty-theme (fetched 2026-09-24, default branch
  `master`, Apache-2.0 license, 2 open issues). No `CONTRIBUTING.md` exists separately (checked,
  404 at that path on `master`) — the rules above are the complete text from `README.md`.
- **Confidence**: verified for the file format, naming convention, screenshot mechanism and the
  author-submission restriction (all quoted/observed directly from the live repo). Unverified:
  whether reviewers enforce the no-self-submission rule strictly in practice, whether a 16-file
  single-PR submission is acceptable in one go or should be split, and whether the DarkBerry
  build-generated header comment is welcome or should be stripped.

## Not applicable

- **alacritty/alacritty wiki "Color-schemes" page** — checked
  (https://github.com/alacritty/alacritty/wiki/Color-schemes, fetched 2026-09-24): it now just
  points readers to the `alacritty/alacritty-theme` repo above rather than hosting its own list;
  nothing to submit there separately.
- **alacritty/alacritty README** — checked
  (https://raw.githubusercontent.com/alacritty/alacritty/master/README.md, fetched 2026-09-24):
  no theme section or link at all; the official repo doesn't advertise themes itself.
- **eendroroy/alacritty-theme** — this is the pre-transfer copy of the now-official repo (same
  author, "indrajit"); checked via the GitHub API (fetched 2026-09-24): `archived: true`, last
  pushed 2023-01-20. Dead, superseded by `alacritty/alacritty-theme`.
- **Package registries (npm, crates.io, Homebrew, AUR, etc.)** — Alacritty themes are plain TOML
  config files, not installable packages; no ecosystem convention of publishing a single theme
  to a language package registry was found. (`rajasegar/alacritty-themes` bundles 200+ themes
  into an npm CLI tool and an AUR package, but that is a third party repackaging others' theme
  files for a picker tool, not a registry Darkberry would submit a package to — see below.)
- **GitHub Topics (`alacritty-theme`, `alacritty-colorscheme`)** — a passive tag, not a
  submission venue; adding the topic to the DarkBerry repo itself (Settings → topics) aids
  discoverability but nothing is "submitted" anywhere.

## Third-party collections seen but not recommended as primary targets

- **rajasegar/alacritty-themes** (https://github.com/rajasegar/alacritty-themes, 732 stars,
  active, npm package `alacritty-themes` + AUR package `alacritty-themes`) — a CLI theme-picker
  bundling 231 `.toml` files under `themes/`, filenames like `Afterglow.toml`,
  `Alabaster.dark.toml` (PascalCase/dotted, not the alacritty-theme repo's lower_snake_case). No
  `CONTRIBUTING.md` was found (checked, 404); its own README says to get themes "in an
  appropriate format for Alacritty" from the official `alacritty-theme` repo, suggesting it may
  pull from there rather than take independent submissions. Confidence: partly verified — repo
  and package existence and README wording confirmed 2026-09-24; its actual PR-acceptance
  process for a brand-new theme family is unverified.
- **anhsirk0/alacritty-themes** — checked (33 stars): scoped specifically to Modus/Doric/Ef
  theme ports, not a general submission point. Not applicable to Darkberry.

## Open questions

- Who submits the PR to `alacritty/alacritty-theme` — the stated rule excludes the theme's own
  author, so this needs a community member (someone who actually uses Darkberry in Alacritty) to
  open it, not shythulu directly. A submitting agent should surface this rather than open the PR
  from the DarkBerry maintainer's own account.
- Whether to submit all 16 flavour×tint files in one PR or start with the four base Darkberry
  flavours and follow up with tints once those land — the repo has precedent for large
  multi-variant families (everforest has 6, github has 7) but no stated limit either way.
- Whether to keep or strip the generated header comment block in each `.toml` before submission
  — house style in that repo's `themes/` directory has no header comments at all.
- Whether pursuing the `rajasegar/alacritty-themes` npm/AUR route is worth the effort at all,
  given it may just be an automated mirror of the official repo — needs a direct question to
  its maintainer or a look at its sync workflow (`.github/workflows/main.yml`) before investing
  time there.
