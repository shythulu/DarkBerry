# Publishing the tmux port

`ports/tmux/` holds four `darkberry-<flavour>.conf` files (Wisp, Fen, Mire, Blackwater) plus a
`<tint>/` subfolder per tint (blueberry, cloudberry, crowberry, lingonberry), each the same
shape. Every file is a complete, self-contained tmux status-line theme meant to be copied to
`~/.config/tmux/` and pulled in with `source-file` from `tmux.conf`; it is plain tmux config
syntax, not a TPM plugin package.

## Venues

### awesome-tmux (curated list)

- **URL**: https://github.com/rothgar/awesome-tmux
- **Kind**: community repo (curated "awesome list", not run by the tmux project)
- **Accepts**: one Markdown list item per theme under the `## Themes` section of `README.md`,
  format `- [name](repo-url) Description.` (a short one-line description, no required end
  punctuation style — most entries end in a period, some don't). No preview image, licence
  badge, or metadata fields are used in the list itself; entries link out to the theme's own
  repo/README for that.
- **Requirements**: none beyond a working GitHub repo link — no account approval process
  beyond opening a PR, no fee, no signing. The list carries the `awesome.re` badge, implying
  the general "awesome list" quality bar (a real repo, working links), but no CONTRIBUTING.md
  exists in the repo (checked, 404) and no explicit criteria are written down.
- **Steps**:
  1. Fork https://github.com/rothgar/awesome-tmux.
  2. Edit `README.md`, adding a line under `## Themes`, keeping the existing rough
     alphabetical order, e.g. `- [darkberry](https://github.com/shythulu/DarkBerry) Four
     flavours of a berry-dark theme for tmux, in four tints.`
  3. Open a pull request against `master`.
- **Updates**: same process — a follow-up PR edits the same line if the description or link
  changes. No re-review or versioning beyond that.
- **Contacts**: repo issues at https://github.com/rothgar/awesome-tmux/issues; maintainer is
  GitHub user rothgar (per repo ownership).
- **Sources**: https://raw.githubusercontent.com/rothgar/awesome-tmux/master/README.md
  (fetched 2026-09-24, shows `## Themes` section and entry format); 404 checked at
  https://raw.githubusercontent.com/rothgar/awesome-tmux/master/CONTRIBUTING.md (2026-09-24,
  no such file).
- **Confidence**: partly verified — list format and lack of formal contributing rules are
  confirmed from the live README; the maintainers' actual review bar for new PRs (e.g. whether
  they reject inactive-looking themes) is unverified.

### tmux-plugins/list (curated list)

- **URL**: https://github.com/tmux-plugins/list
- **Kind**: community repo (curated list run by the `tmux-plugins` GitHub org, which also
  publishes TPM itself; not the tmux project)
- **Accepts**: one Markdown list item under `## Themes` in `README.md`, format
  `- [name](repo-url) - Description.` (dash-separated description, ending in a period in
  existing entries). No preview image or metadata fields in the list; no requirement that the
  linked repo be a full TPM plugin (existing entries like `tmux-colors-solarized` and
  `tmux-peacock` are theme repos, not necessarily plugin-manager-installable, though several
  also ship a thin `.tmux` wrapper for TPM's `prefix + I` flow).
- **Requirements**: same as awesome-tmux — no account approval beyond a PR, no fee, no
  signing keys. No CONTRIBUTING.md exists in the repo (checked, 404).
- **Steps**:
  1. Fork https://github.com/tmux-plugins/list.
  2. Edit `README.md`, adding a line under `## Themes`, e.g. `- [darkberry](https://github.com
     /shythulu/DarkBerry) - Four berry-dark flavours for tmux, in four tints.`
  3. Open a pull request against `master`.
- **Updates**: a follow-up PR to the same line.
- **Contacts**: repo issues at https://github.com/tmux-plugins/list/issues; org is
  https://github.com/tmux-plugins.
- **Sources**: https://raw.githubusercontent.com/tmux-plugins/list/master/README.md (fetched
  2026-09-24, `## Themes` section); https://github.com/tmux-plugins/list/blob/master/
  CONTRIBUTING.md (2026-09-24, 404).
- **Confidence**: partly verified — same caveat as awesome-tmux: format is confirmed, review
  bar is not.

### TPM (Tmux Plugin Manager) — plugin convention, not a listing

- **URL**: https://github.com/tmux-plugins/tpm
- **Kind**: not a gallery or store; it is the install mechanism themes/plugins can optionally
  support. Documented for completeness since it's the de facto "app store" pattern for tmux.
- **Accepts**: a repo installable via `set -g @plugin 'user/repo'` in `tmux.conf`. TPM sources
  every `*.tmux` file in the plugin's root on `prefix + I`. Beyond that there is no author
  metadata, licence field, or preview-image convention that TPM itself checks.
  `docs/how_to_create_plugin.md` in that repo covers the mechanics.
- **Requirements**: none — no registration, no TPM-side review. A plugin only needs to exist
  as a public git repo; nothing is submitted to TPM itself.
- **Steps** (if the port were to add TPM support later — optional, not required for listing
  elsewhere): add a `darkberry.tmux` executable script at the repo root that sources the
  chosen flavour's `.conf` file, so `set -g @plugin 'shythulu/DarkBerry'` works. This is a
  packaging change to the port, not a submission step, and is out of scope for this
  publishing task unless asked for.
- **Updates**: N/A — users update via their own TPM `prefix + U`.
- **Contacts**: repo issues at https://github.com/tmux-plugins/tpm/issues.
- **Sources**: https://github.com/tmux-plugins/tpm (fetched 2026-09-24);
  https://raw.githubusercontent.com/tmux-plugins/tpm/master/docs/how_to_create_plugin.md
  (fetched 2026-09-24).
- **Confidence**: verified that TPM has no central submission point; it only defines the
  plugin file convention.

## Not applicable

- **tmux itself (github.com/tmux/tmux)** — the project ships no built-in theme collection and
  its GitHub wiki (checked pages: Home, Getting-Started, Installing, FAQ, Clipboard,
  Control-Mode, Events, Formats, Modifier-Keys, Recipes, Contributing) has no themes or
  gallery page. tmux has no package-registry or marketplace concept of its own.
- **Package registries (npm, crates.io, Homebrew, etc.)** — not checked in detail because tmux
  themes are plain config files with no ecosystem convention of publishing them to a language
  package registry; none of the existing curated-list entries reference one.

## Open questions

- Whose GitHub account opens the PRs to awesome-tmux and tmux-plugins/list — shythulu directly,
  or a bot/alt account — is for the submitting agent/human to decide.
- Whether to also add a `darkberry.tmux` TPM wrapper to `ports/tmux/` before or alongside
  listing, so the theme is `prefix + I`-installable, is a product decision not settled here.
- Neither curated list has a written acceptance bar; a submitting agent should expect possible
  maintainer pushback (e.g. "why is this different from existing berry/dark themes") and have
  a one-line pitch ready.
