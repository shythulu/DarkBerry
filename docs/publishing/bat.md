# Publishing the bat port

`ports/bat/` holds four `Darkberry <Flavour>.tmTheme` files (Wisp/Fen/Mire/Blackwater) at its
root, plus the same four files per tint under `ports/bat/<tint>/` (blueberry, cloudberry,
crowberry, lingonberry). Format is Sublime Text / TextMate `.tmTheme` (plist XML), the format
bat, delta, gitui and Sublime Text itself all read.

## Venues

### Sublime Text Package Control

- **URL**: https://packagecontrol.io/docs/submitting_a_package (docs) · https://github.com/wbond/package_control_channel (the channel repo PRs land in)
- **Kind**: package registry (official store for Sublime Text; `.tmTheme` is a Sublime Text format, so this is the closest thing bat's theme format has to an "app store", independent of bat itself)
- **Accepts**: a GitHub or Bitbucket repo whose **root is the package root** (one package per repo). Name rules: avoid the word "Sublime" in the name, use CamelCase or underscore_notation, ASCII only, no `. / \ < > : " | ? *` in the name or file names, not confusingly similar to an existing package name. No `.pyc` files, no `package-metadata.json` committed. No licence/README/preview-image requirement is stated by the docs.
- **Requirements**: free GitHub (or Bitbucket) account to fork `package_control_channel` and open the PR; no fee, no signing key, no 2FA beyond normal GitHub account security. Manual (human) review of every PR before merge; no stated turnaround time.
- **Steps**:
  1. Search https://packagecontrol.io for existing similar packages first (they ask you to avoid duplicates).
  2. Host the theme in its own GitHub/Bitbucket repo, package files at repo root, tagged with a semantic-version tag (branch-based releases are no longer accepted).
  3. Fork https://github.com/wbond/package_control_channel, add an entry to the right JSON file under `repository/`, e.g. `{"name": "Darkberry", "details": "https://github.com/<repo>", "releases": [{"sublime_text": "*", "tags": true}]}`.
  4. Install the `ChannelRepositoryTools` Sublime package and run `ChannelRepositoryTools: Test Default Channel` until it passes.
  5. Open a pull request from the fork against `package_control_channel` with a description.
- **Updates**: push a new semver tag to the theme's own repo; Package Control polls each listed repo roughly hourly and republishes automatically — no further PR needed for new releases, only for name/URL changes.
- **Contacts**: issues/PRs on https://github.com/wbond/package_control_channel; no email or chat channel documented.
- **Sources**: https://packagecontrol.io/docs/submitting_a_package (fetched 2026-09-24); https://github.com/wbond/package_control_channel (fetched 2026-09-24).
- **Confidence**: verified (fetched the current docs page directly).

### delta's `themes.gitconfig`

- **URL**: https://github.com/dandavison/delta/blob/main/themes.gitconfig
- **Kind**: community repo (a curated list bundled in delta's own upstream repo, PR-accepted)
- **Accepts**: a `[delta "<name>"]` gitconfig block appended to `themes.gitconfig`. Per the file's own header comment: (1) the theme's name inside delta must be some kind of wild organism (mammal, bird, plant, mollusc, any language) — not "Darkberry" or a flavour name as-is; (2) only include style settings essential to the look (get the active set via `delta --show-config`); (3) must set `dark = true` or `light = true` so `delta --show-themes` picks it up; (4) an author-attribution comment line is optional but conventional. The block would set `syntax-theme = "Darkberry Mire"` (etc.), which only resolves if the user has separately installed the matching `.tmTheme` into bat's theme cache — delta does not carry the `.tmTheme` file itself, only a reference to a syntect/bat theme name.
- **Requirements**: free GitHub account, no fee, no signing, ordinary PR review by the delta maintainers.
- **Steps**:
  1. Pick an organism name per flavour (e.g. one entry per Darkberry flavour, since each is a distinct look).
  2. Append a `[delta "<organism>"]` block to `themes.gitconfig` with `syntax-theme = "Darkberry <Flavour>"`, `dark = true`, and whichever delta UI colours (decorations, line numbers, etc.) match Darkberry.
  3. Open a PR against https://github.com/dandavison/delta.
- **Updates**: a follow-up PR editing the same block.
- **Contacts**: https://github.com/dandavison/delta/issues and PRs; no separate chat documented.
- **Sources**: `themes.gitconfig` header comment, cloned from https://github.com/dandavison/delta (fetched 2026-09-24).
- **Confidence**: verified (read the file's literal contribution instructions).

## Not applicable

- **bat's own bundled theme collection** (`assets/themes/*` submodules in https://github.com/sharkdp/bat) — CONTRIBUTING.md ("Adding new syntaxes/languages or themes" section, https://github.com/sharkdp/bat/blob/master/CONTRIBUTING.md, fetched 2026-09-24) states plainly: "Note: We are currently not accepting new default themes." There is no `theme_request` issue template either (only `syntax_request.md`), confirming the closure applies to themes.
- **gitui's own repo** (https://github.com/gitui-org/gitui, moved from `extrawurst/gitui`) — `THEMES.md` documents loading a `.tmTheme` file placed in gitui's config dir and referencing it by name in `theme.ron` (`syntax: Some("Darkberry Mire")`, landed via PR #2565), but gitui keeps no in-repo gallery or submission list of community themes; it just points readers to the Catppuccin org's own `catppuccin/gitui` repo and to `filmgirl/TextMate-Themes` as external sources. Checked https://github.com/gitui-org/gitui/blob/master/THEMES.md (fetched 2026-09-24).
- **filmgirl/TextMate-Themes** (https://github.com/filmgirl/TextMate-Themes) — a personal collection gitui's docs link to; no CONTRIBUTING guide, no stated PR process, low recent activity. Checked 2026-09-24; not usable as a submission venue as found.
- **bat GitHub Discussions/issues** — no theme-gallery or theme-request path exists there beyond the closed CONTRIBUTING.md policy above; skipped as redundant with the bundled-collection finding.

## Open questions

- Package Control requires the package repo root to *be* the package (one package per repo). DarkBerry is a monorepo with many ports, so submitting to Package Control means either standing up a small dedicated repo/mirror just for the Sublime Text `.tmTheme` files (a decision a human should make — new repo under whose account, and whether it auto-syncs from `ports/bat/` or is hand-copied) or skipping this venue. Flag to the human before doing any Package Control work.
- delta's organism-naming rule means the submitted entry name won't say "Darkberry" — decide on four organism names (one per flavour, or per tint too) and whether to credit "Darkberry" only in the author-comment line.
- Confirm whether Darkberry wants tint variants (Blueberry/Cloudberry/Crowberry/Lingonberry) submitted anywhere beyond the base Darkberry flavours, since both venues above default to listing one canonical name per look.
