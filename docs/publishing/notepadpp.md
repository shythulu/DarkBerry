# Publishing the Notepad++ port

`ports/notepadpp/` holds one Style Configurator theme XML per flavour (`Darkberry Wisp.xml`,
`Darkberry Fen.xml`, `Darkberry Mire.xml`, `Darkberry Blackwater.xml`), plus the four tints in
their own subfolders (`wisp/`, `fen/`, `mire/`, `blackwater/` under each tint directory).
Install is manual: drop a `.xml` into `%APPDATA%\Notepad++\themes\`, then pick it in
Settings > Style Configurator.

## Venues

### nppThemes (official Themes Collection)

- **URL**: https://github.com/notepad-plus-plus/nppThemes
- **Kind**: official gallery (community repo maintained under the `notepad-plus-plus` GitHub org)
- **Accepts**: raw Style Configurator XML files dropped into the repo's `themes/` folder.
  Rules from the README:
  - The XML prolog/declaration (`<?xml version="1.0" encoding="UTF-8" ?>`) must be the first
    line, encoding UTF-8.
  - A comment block may follow the prolog (theme name, author, date, credits) but **must not**
    contain a licence or copyright notice that contradicts the collection's licence.
  - No required preview image, no documented file-naming pattern beyond the XML being a valid,
    working theme — the filename becomes the name shown in Style Configurator.
  - A `.validators/` folder (`theme.xsd` + `validator_xml.py`) runs schema validation; a
    `.github/workflows/CI_build.yml` workflow exists but its exact checks were not read.
  - **Licensing conflict to flag**: the README states "Any Theme uploaded to the Collection is
    automatically released under the terms of the GPL v3, as put forth in the Collection's
    LICENSE file." Darkberry is MIT-licensed; submitting here would relicense that one file
    under GPLv3, which the rest of the project is not. This needs a human decision (see Open
    questions).
- **Requirements**: a GitHub account. No fee, no signing keys, no 2FA requirement stated. Review
  is manual and/or automated by "the Theme Collection team" — acceptance is discretionary, and
  they explicitly disclaim responsibility for maintaining individual themes afterward.
- **Steps**:
  1. Fork https://github.com/notepad-plus-plus/nppThemes.
  2. Add the theme XML file(s) to the `themes/` folder in the fork.
  3. Open a pull request against `main`.
  4. (Alternative to a PR) open a new issue at
     https://github.com/notepad-plus-plus/nppThemes/issues and attach the XML file instead.
  5. Wait for the Theme Collection team's manual/automated review and merge decision.
- **Updates**: no versioning mechanism described — ship a changed file the same way (new PR or
  issue) to replace/update an existing theme.
- **Contacts**: repo issues at https://github.com/notepad-plus-plus/nppThemes/issues; no email
  or chat channel listed in the README.
- **Sources**: https://github.com/notepad-plus-plus/nppThemes (2026-09-24);
  https://raw.githubusercontent.com/notepad-plus-plus/nppThemes/main/README.md (2026-09-24);
  https://github.com/notepad-plus-plus/nppThemes/tree/main/.validators (2026-09-24);
  https://github.com/notepad-plus-plus/nppThemes/tree/main/.github (2026-09-24)
- **Confidence**: partly verified. The submission rules and licence clause are read directly
  from the README (verified). The exact contents of `CI_build.yml` and any issue-template
  fields under `.github/ISSUE_TEMPLATE/` were not opened (unverified) — worth a look before
  submitting in case there's a required issue form.

### Notepad++ Community forum

- **URL**: https://community.notepad-plus-plus.org/, theme threads live under
  https://community.notepad-plus-plus.org/category/5/notepad-plugin-development
- **Kind**: community forum (discovery/discussion, not a formal registry)
- **Accepts**: no fixed format. Existing theme threads (e.g.
  https://community.notepad-plus-plus.org/topic/26557/3-new-themes,
  https://community.notepad-plus-plus.org/topic/15421/twodark-theme) post preview screenshots
  inline, a short description, and a link to the theme's own GitHub repo/download rather than
  attaching the XML directly. No mandated image size or metadata fields found.
- **Requirements**: a forum account (free registration). No fee, no review/approval gate to
  post a topic; moderators can act after the fact per normal forum rules (not read in detail).
- **Steps**:
  1. Register/log in at https://community.notepad-plus-plus.org/.
  2. Start a new topic in "Notepad++ & Plugin Development"
     (https://community.notepad-plus-plus.org/category/5/notepad-plugin-development).
  3. Include preview images (e.g. from `assets/previews/` or `docs/specimen.html`), a short
     description of the four flavours/tints, and links to the GitHub repo
     (https://github.com/shythulu/DarkBerry) and the site
     (https://shythulu.github.io/DarkBerry/).
  4. A regular contributor/moderator in past threads (PeterJones) has redirected posters toward
     nppThemes as the preferred central listing — expect the same suggestion.
- **Updates**: edit the original post or reply in the same topic; the forum has no
  release/versioning mechanism of its own.
- **Contacts**: the forum itself; no separate email found. Moderator contact is via the forum.
- **Sources**: https://community.notepad-plus-plus.org/categories (2026-09-24);
  https://community.notepad-plus-plus.org/topic/26557/3-new-themes (2026-09-24)
- **Confidence**: partly verified. Category and posting norms are confirmed from real threads.
  Formal forum posting rules/ToS were not read (unverified).

## Not applicable

- **Bundling into `notepad-plus-plus/notepad-plus-plus` (`PowerEditor/installer/themes`)** —
  this is the set of ~20 themes shipped inside the Notepad++ installer itself. Checked the repo
  tree and `CONTRIBUTING.md`: the contributing guide has no path for adding a new bundled
  theme, and a forum contributor was pointed at nppThemes instead of this repo when offering
  new themes — nppThemes exists specifically so new community themes don't need to go here.
  Treat this as closed to new third-party themes in practice.
- **NPP_Curated_Look** (https://github.com/daemonPainter/NPP_Curated_Look) — a personal curated
  collection (themes vendored as git submodules), not an official venue. No `CONTRIBUTING.md`,
  no issue template, no documented submission process found. Adding Darkberry here would mean
  filing an ad-hoc issue/PR and hoping the maintainer responds — not a reliable public listing.
- **A Notepad++ plugin marketplace/registry** — Notepad++'s Plugins Admin lists installable
  *plugins* (DLLs via `plugins.json` in the `notepad-plus-plus/nppPluginList` repo), not themes.
  Themes are plain XML dropped into a folder, not a plugin, so this mechanism does not apply.

## Open questions

- **Licence conflict at nppThemes**: submitting there auto-relicenses that XML file under
  GPLv3, while the rest of Darkberry is MIT. A human needs to decide whether that's acceptable
  for this one distribution channel, or whether to skip nppThemes and rely on the forum post +
  the project's own GitHub/site for discovery.
- **Whose GitHub/forum account submits**: the PR/issue to nppThemes and the forum post should
  presumably go under `shythulu`, but that's for a human to confirm before a submitting agent
  acts under that identity.
- **CI_build.yml contents and any `.github/ISSUE_TEMPLATE/` form fields at nppThemes** were not
  opened — check both before submitting in case there's a required template.
