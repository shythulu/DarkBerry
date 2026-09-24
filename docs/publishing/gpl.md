# Publishing the GIMP Palette port

`ports/gpl/` holds one `.gpl` file per flavour (`darkberry-wisp.gpl`, `-fen`, `-mire`,
`-blackwater`, 29 colours each), one per tint, `darkberry.gpl` (all four flavours, 116
colours) and `darkberry-with-tints.gpl` (everything, 580 colours) — plain-text GIMP Palette
format (`GIMP Palette` header, `Name:`/`Columns:` fields, `# comment` lines, `R G B Name`
rows) read natively by GIMP, Inkscape, Krita, MyPaint and Aseprite.

## Venues

### Lospec Palette List

- **URL**: https://lospec.com/palette-list (browse), https://lospec.com/palettes/submit (submit)
- **Kind**: official gallery — the dedicated, widely-used directory for exactly this kind of
  named colour palette.
- **Accepts**: a self-contained, cohesive palette "designed to be used as a whole." Exports
  from the list explicitly include "GIMP .GPL" alongside PNG (1x/8x/32x), JASC `.PAL`, Adobe
  `.ASE`, Paint.NET `.TXT` and `.HEX` — so Darkberry's own `.gpl` is a natural fit, but Lospec
  regenerates the export itself from colours entered in its form; it does not take an
  uploaded `.gpl` file directly.
- **Requirements**: a free account, signed in via Discord, GitHub, Google, Reddit or Twitter.
- **Steps**:
  1. Sign in, go to https://lospec.com/palettes/submit.
  2. Fill Title, optional Hashtag (letters/numbers only, locked after approval), Description
     (supports links/images), tick "I made this palette" (Darkberry is original), Tags, and
     enter the colours (manual hex list, paste, or image upload).
  3. Provide a palette example image — submissions without one are likely rejected as showing
     no evidence of use.
  4. Submit; it enters a moderation queue (the submit page showed "1795 pending" on
     2026-09-24, so approval is not immediate).
- **Updates**: unverified — no documented edit/resubmit flow for an already-approved palette.
- **Contacts**: https://forums.lospec.com (Palette Feedback board).
- **Sources**: https://lospec.com/palettes/submit, https://lospec.com/palette-list (both
  fetched 2026-09-24).
- **Confidence**: partly verified — form fields, sign-in options and the nine submission rules
  are confirmed from the live pages; exact licensing terms Lospec applies to submitted
  palettes and the update/edit process are unverified (not stated on the pages fetched).

### Inkscape bundled palettes (`share/palettes`)

- **URL**: https://gitlab.com/inkscape/inkscape/-/tree/master/share/palettes
- **Kind**: official — ships inside Inkscape itself, available from install with no user
  action beyond picking it from the palette-bar menu.
- **Accepts**: one `.gpl` file per palette, same format as Darkberry's; the directory's own
  `README` says explicitly "They are in Gimp format (.gpl)." Existing entries (Tango,
  Solarized, GNOME_HIG, elementary) show single-theme submissions, one file each, are the
  norm — not combined multi-theme files.
- **Requirements**: a free gitlab.com account (Inkscape's own `CONTRIBUTING.md` walks through
  sign-up). Inkscape's own source is GPL-2.0-or-later; a contributed MIT-licensed file is
  compatible for inclusion, but the one precedent found (the "elementary" palette, added
  2025-12-17) shows the maintainers care about license clarity — that file's commit
  explicitly notes and confirms its licence to match the project. Most existing `.gpl` files
  carry no license header at all, just a plain `#` comment.
- **Steps**:
  1. Create a gitlab.com account if needed; fork https://gitlab.com/inkscape/inkscape.
  2. Add `share/palettes/darkberry-<flavour>.gpl` for each of Wisp/Fen/Mire/Blackwater
     (matching this port's existing per-flavour files), with a `#` comment citing the site
     (https://shythulu.github.io/DarkBerry/) and licence (MIT).
  3. Open a merge request against `master`.
- **Updates**: a follow-up merge request editing the same file(s) — this directory is
  actively maintained (last new palette merged 2025-12-17, "Add elementary palette").
- **Contacts**: chat https://chat.inkscape.org/channel/team_devel, IRC
  `irc://irc.libera.chat/#inkscape-devel`, mailing list inkscape-devel@lists.inkscape.org,
  issues via https://gitlab.com/inkscape/inbox/-/issues.
- **Sources**: GitLab repository-tree and commits API for `inkscape/inkscape` path
  `share/palettes` (fetched 2026-09-24), raw `share/palettes/README` and `CONTRIBUTING.md`
  (fetched 2026-09-24).
- **Confidence**: verified — directory, format, README wording and recent (Dec 2025) merge
  activity all confirmed live via the GitLab API and raw file fetches.

### GIMP bundled palettes (`data/palettes`)

- **URL**: https://gitlab.gnome.org/GNOME/gimp/-/tree/master/data/palettes
- **Kind**: official — ships inside GIMP itself.
- **Accepts**: `.gpl` files, same format. In principle a good match.
- **Requirements**: a free gitlab.gnome.org account; no `CONTRIBUTING.md` exists in the repo
  root (checked, none found) and no written policy on new palettes was found.
- **Steps**: unverified as a live path — see confidence note.
- **Updates**: n/a.
- **Contacts**: GIMP developer docs at https://developer.gimp.org, GitLab issues on the
  `GNOME/gimp` project.
- **Sources**: GitLab commits API for `GNOME/gimp` path `data/palettes` (fetched 2026-09-24).
- **Confidence**: unverified as an active venue — commit history shows the last *new* palette
  added was the Tango icon palette in 2005; every commit since (2006-2023) is maintenance
  (renames, meson port, removing an "Untitled" colour name), none adds a new theme. Treat as
  effectively closed to new bundled palettes barring contrary word from a maintainer.

### Krita bundled palettes (`krita/data/palettes`)

- **URL**: https://invent.kde.org/graphics/krita/-/tree/master/krita/data/palettes
- **Kind**: official — ships inside Krita itself.
- **Accepts**: `.gpl` files, but the bundled set is small (14 files) and mostly utility
  palettes (UI swatches, CMYK/RGB grids, pixel-art ramps), not a gallery of named themes.
- **Requirements**: a free KDE Identity / invent.kde.org account. Krita's own docs
  (`docs.krita.org/en/resources_page.html`) route contributors to the forum first: "Have a
  resource you made and want to share it with other artists? Let us know on Krita Artists
  [https://krita-artists.org/c/resources/10/l/top] or visit our chat channel" — no open
  PR-first process.
- **Steps**:
  1. Post in the Krita Artists "Resources" category, proposing the palette.
  2. If a maintainer agrees, follow up with a merge request against
     `krita/data/palettes/` on invent.kde.org.
- **Updates**: a follow-up merge request, same route.
- **Contacts**: https://krita-artists.org, KDE chat linked from
  https://community.kde.org/Get_Involved.
- **Sources**: invent.kde.org repository-tree and commits API for `graphics/krita` path
  `krita/data/palettes` (fetched 2026-09-24), https://docs.krita.org/en/resources_page.html
  (fetched 2026-09-24).
- **Confidence**: partly verified — directory contents and forum-first guidance confirmed
  live; whether the team wants a new named theme bundled is unverified (last addition was
  "animation color set" in 2021).

### denilsonsa/gimp-palettes

- **URL**: https://github.com/denilsonsa/gimp-palettes
- **Kind**: curated community repo — a personal-maintainer collection covering GIMP,
  Inkscape, Krita, MyPaint, Aseprite and Drawpile, with a live HTML preview page.
- **Accepts**: one `.gpl` file per palette in `palettes/`, following the standard format;
  README has an explicit, current "Contributing" section with concrete rules (see Steps).
- **Requirements**: a free GitHub account; repo has no LICENSE file (checked, none), so its
  own redistribution terms for accepted palettes are unclear — worth asking the maintainer.
  Actively maintained (commits as recent as 2026-08-16).
- **Steps** (from the README's own "Contributing" section):
  1. Fork the repo; add `.gpl` file(s) to `palettes/`.
  2. Verify with `./gpl_to_html.py -o preview.html palettes/*.gpl` (Python 3) that `Name:` and
     `Columns:` (guideline: ≤ 20-24) render correctly, and that colours have names.
  3. Cite the source (Darkberry's GitHub/site URL) in a comment line.
  4. Confirm the file opens correctly in GIMP (note: GIMP strips manually-added comments on
     open — keep a separate copy).
  5. Add an alphabetically-sorted entry to `README.md` citing the source.
  6. Open a pull request.
- **Updates**: a follow-up pull request editing the same file(s) and README entry.
- **Contacts**: https://github.com/denilsonsa/gimp-palettes/issues.
- **Sources**: raw `README.md` and commit history via GitHub API (both fetched 2026-09-24).
- **Confidence**: verified — contributing steps and activity confirmed live.

### Robert-96/gimp-color-palettes

- **URL**: https://github.com/Robert-96/gimp-color-palettes
- **Kind**: curated community repo — collection for GIMP, Inkscape, Aseprite, Drawpile,
  Krita, MyPaint with a GitHub Pages preview.
- **Accepts**: one `.gpl` file per palette; MIT licensed (compatible with Darkberry's MIT).
- **Requirements**: a free GitHub account. No `CONTRIBUTING.md` (checked, 404); process
  inferred from commit history. Active (palettes added January 2025).
- **Steps** (inferred, not documented):
  1. Fork the repo; add `.gpl` file(s) alongside the existing ones.
  2. Add an entry/link per the repo's existing README conventions.
  3. Open a pull request.
- **Updates**: a follow-up pull request.
- **Contacts**: https://github.com/Robert-96/gimp-color-palettes/issues.
- **Sources**: raw `README.md`, license and commit history via GitHub API (fetched 2026-09-24).
- **Confidence**: partly verified — format, licence and recent activity confirmed live; the
  exact submission process is unverified since no CONTRIBUTING doc exists.

### KDE Store / gnome-look.org (Pling network)

- **URL**: https://store.kde.org (mirrors to https://www.gnome-look.org, same Pling network).
- **Kind**: community repo / self-service store — a general desktop-add-on download hub;
  search results confirm it hosts individual `.gpl` uploads (e.g. a "Material Design Palette"
  listing, a hosted `Heraldry.gpl`).
- **Accepts / Requirements / Steps / Updates / Contacts**: unverified — see Confidence.
- **Sources**: web search snippets referencing https://store.kde.org/p/1416698 and a hosted
  `Heraldry.gpl` (searched 2026-09-24); direct fetches against store.kde.org and
  gnome-look.org via WebFetch and a headless-browser crawl (2026-09-24) were both blocked by
  the sites' Anubis anti-bot challenge (a JavaScript proof-of-work gate), returning only the
  challenge page, not the content.
- **Confidence**: unverified — the site could not be reached by any available tool; a
  submitting agent with an interactive browser will need to check the upload flow by hand.

## Not applicable

- **Coolors** (https://coolors.co) — its community "Explore"/upload feature is invite-only
  ("users can only start uploading designs upon invitation"), it doesn't import `.gpl` files
  (palettes are built or extracted in-app), and it has no venue that redistributes an actual
  palette file.
- **Adobe Color** (https://color.adobe.com) — "Publish to Color" shares a theme built in
  Adobe's own tool/format (ACO/ASE/ACT), not an uploaded `.gpl`; there is no import path from
  a `.gpl` file into a publishable Adobe Color theme, so listing here would mean manually
  re-entering the palette in a different, closed ecosystem rather than publishing this port.

## Open questions

- Lospec: submit each flavour (Wisp/Fen/Mire/Blackwater, 29 colours each) as its own,
  separate palette entry — the combined `darkberry.gpl` (116 colours, four flavours) and
  `darkberry-with-tints.gpl` (580 colours) both read as "consisting of multiple smaller
  palettes," which Lospec's own rules say against; a submitting agent/human should confirm
  this reading before submitting, and decide whether the four *tints* also warrant separate
  Lospec entries or are skipped there.
- Inkscape MR: whether to open one merge request covering all four flavour files, or one per
  flavour, is unsettled by precedent (existing merges add one palette at a time).
- GIMP and Krita: both look effectively closed to new named palettes right now; a human should
  decide whether opening an issue/forum post is worth it versus focusing on Lospec, Inkscape
  and the two curated GitHub lists.
- denilsonsa/gimp-palettes has no LICENSE file for the repo as a whole; worth asking the
  maintainer how contributed files are licensed before assuming MIT compatibility.
- KDE Store / gnome-look.org needs a human or interactive-browser agent to open the site by
  hand (Anubis blocks non-browser and headless-crawl fetches); decide then if it's worth it.
- Whose GitHub/GitLab/KDE-Identity account opens these PRs/MRs/forum posts (shythulu directly
  vs. another account) is for the submitting agent/human to decide.
