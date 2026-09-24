# Publishing the Starship port

The port ships one complete `starship.toml` preset per flavour (`ports/starship/darkberry-{wisp,fen,mire,blackwater}.toml`), each self-contained with its own `[palettes.darkberry]` table, plus four tint subfolders (`ports/starship/{blueberry,cloudberry,crowberry,lingonberry}/`) holding the same four files recoloured. MIT-licensed, repo `shythulu/DarkBerry`, site `https://shythulu.github.io/DarkBerry/`.

## Venues

### Starship official presets (starship/starship repo + starship.rs)

- **URL**: rendered page https://starship.rs/presets/ ; source https://github.com/starship/starship/blob/master/docs/presets/README.md ; toml directory https://github.com/starship/starship/tree/master/docs/public/presets/toml
- **Kind**: official gallery, and the same files feed the CLI's built-in `starship preset` command — this is the only sanctioned distribution point for a Starship theme.
- **Accepts**: a complete `starship.toml` dropped into `docs/public/presets/toml/<name>.toml`; the filename (without extension) becomes the invocable preset name (`starship preset <name>`) — `build.rs` walks that directory at compile time and auto-registers whatever is there, no source-code changes needed. A matching doc page `docs/presets/<name>.md` embeds the toml via VitePress's `<<< @/public/presets/toml/<name>.toml` and shows `starship preset <name> -o ~/.config/starship.toml`. A screenshot goes in `docs/public/presets/img/<name>.png` — existing screenshots range from 538×170 to 2906×1608 PNG, no fixed size or aspect enforced. One `## [<Title>](./<name>.md)` entry (name, 1–2 sentence description, linked screenshot image) is added to `docs/presets/README.md`, in the same style as the existing entries (e.g. Catppuccin Powerline). Filenames don't have to match the doc slug exactly (existing repo is inconsistent: `nerd-font-symbols.toml` → `nerd-font.md`) but keeping them aligned is the norm.
- **Requirements**: GitHub account; fork + PR; no fee, no signing keys, no CLA/DCO found. PR title must start with a Conventional Commit type (`docs:`, `feat:`, etc. — see `.github/PULL_REQUEST_TEMPLATE.md`). The template has a mandatory **AI-Assistance** checkbox ("Have you used AI-assistance to author this PR? Yes/No" + scope description) per `AI_POLICY.md`. That policy also requires a human-in-the-loop who can "explain what your changes do and defend implementation choices" and answer maintainer questions unaided, and explicitly bans "unsupervised autonomous agents operating in an automated loop" — a human must be the one opening and defending this PR, not an agent acting alone. Maintainer review is otherwise informal (no explicit SLA found).
- **Steps**:
  1. Fork `starship/starship`, branch off `master`.
  2. Copy the four flavour files into `docs/public/presets/toml/` as `darkberry-wisp.toml`, `darkberry-fen.toml`, `darkberry-mire.toml`, `darkberry-blackwater.toml` (matches existing local filenames already).
  3. Add one doc page, e.g. `docs/presets/darkberry.md`, modeled on `docs/presets/catppuccin-powerline.md`: intro, prerequisites (Nerd Font, since module icons need one per the port's own README), one `<<< @/public/presets/toml/<file>.toml` + preset command block per flavour, and a link to `https://shythulu.github.io/DarkBerry/ports/starship/` for the tints.
  4. Add a screenshot `docs/public/presets/img/darkberry.png` (PNG, not the repo's `.webp`).
  5. Add a `## [Darkberry](./darkberry.md)` entry to `docs/presets/README.md`.
  6. Fill in `.github/PULL_REQUEST_TEMPLATE.md` in full, including the AI-Assistance section, and open the PR with a Conventional-Commit-style title (e.g. `docs: add Darkberry starship preset`).
- **Updates**: a follow-up PR editing the same files (e.g. to add tints later); nothing to re-publish separately — the docs site and the CLI's `starship preset --list` both rebuild from the repo.
- **Contacts**: issues https://github.com/starship/starship/issues ; Discord (linked from `CONTRIBUTING.md`) https://discord.gg/8Jzqu3T
- **Sources**: https://starship.rs/presets/ ; https://github.com/starship/starship/blob/master/docs/presets/README.md ; https://github.com/starship/starship/blob/master/CONTRIBUTING.md ; https://github.com/starship/starship/blob/master/AI_POLICY.md ; https://github.com/starship/starship/blob/master/build.rs ; https://github.com/starship/starship/blob/master/.github/PULL_REQUEST_TEMPLATE.md ; https://github.com/starship/starship/blob/master/docs/presets/catppuccin-powerline.md — all fetched/cloned 2026-09-24.
- **Confidence**: verified for file layout, build.rs auto-registration, README/CONTRIBUTING/AI_POLICY/PR-template text (read directly from a clone of `starship/starship` on 2026-09-24). Partly verified: whether maintainers will accept 4 separate flavour files in one PR versus wanting them squashed into one multi-palette file the way Catppuccin's port does (`palette = 'catppuccin_mocha'` with sibling `[palettes.catppuccin_*]` tables in a single file) — no written rule found either way; see Open questions.

### GitHub topic listing (self-service discovery)

- **URL**: https://github.com/topics/starship-preset (also `starship-preset-configuration`, `starship-prompt`)
- **Kind**: community discovery listing, not a submission queue.
- **Accepts**: any public repo tagged with the topic; no format or metadata requirements beyond the repo being public and having the topic set.
- **Requirements**: a GitHub account (already have `shythulu/DarkBerry`); no review, no fee.
- **Steps**: 1. On the DarkBerry repo, open Settings → add topic `starship-preset` (repo topics are also editable from the repo home page's gear icon next to "About"). 2. Repo then appears under that topic's browse/search page.
- **Updates**: none — stays listed as long as the topic and repo remain public.
- **Contacts**: none (no maintainer, self-service).
- **Sources**: https://github.com/topics/starship-preset — fetched 2026-09-24.
- **Confidence**: verified the topic page exists and lists tagged repos; unverified how much discovery traffic it actually drives.

### Third-party curated preset lists

- **URL**: https://github.com/waraga2/sweet-starship-presets ; https://github.com/Maroc02/awesome-starship-prompts
- **Kind**: unofficial community repos, not affiliated with the Starship project.
- **Accepts**: `sweet-starship-presets` (GPL-3.0): README says "you're welcomed to share yours in the discussions tab an we just might archive it here" — no stated file format, naming, licence, or preview-image rule. `awesome-starship-prompts`: a gallery of screenshots linking to external config sources; no `CONTRIBUTING.md` or issue/PR template found in either repo as of this date.
- **Requirements**: GitHub account only; no fee, no signing; review is informal/maintainer discretion, undocumented.
- **Steps**: `sweet-starship-presets` — open a new post in its Discussions tab (https://github.com/waraga2/sweet-starship-presets/discussions) linking the Darkberry starship page/toml and a screenshot. `awesome-starship-prompts` — open an issue or PR proposing an entry (no template exists; state name, screenshot, and config link, following the existing gallery entries' shape).
- **Updates**: edit/re-post the discussion or PR when the preset changes; no versioning scheme.
- **Contacts**: `sweet-starship-presets` Discussions tab; `awesome-starship-prompts` issues at https://github.com/Maroc02/awesome-starship-prompts/issues
- **Sources**: both repos fetched 2026-09-24.
- **Confidence**: partly verified — existence and stated intent confirmed by reading each README on 2026-09-24; exact submission format and review criteria are unverified since neither repo publishes contribution guidelines.

## Not applicable

- **crates.io / any package registry** — Starship presets are plain TOML config, not Rust crates; the CLI bakes in presets at compile time from `docs/public/presets/toml` via `build.rs`, never via a package registry. Checked `build.rs` and the repo's `Cargo.toml`; no registry distribution path exists for presets.
- **An official Starship "store" or marketplace** — none exists beyond `starship.rs/presets/` (which is the same repo as the CLI's built-in list). Checked starship.rs's navigation and the GitHub org for any separate store/marketplace repo; found none.

## Open questions

- Four separate preset files (`darkberry-wisp.toml` etc., matching current filenames, one doc page with four download/embed blocks) versus one multi-palette `darkberry.toml` with `palette = 'darkberry_wisp'`/`'darkberry_fen'`/etc. like Catppuccin's port — no upstream rule forces either; the separate-files route needs no rework of the existing `ports/starship/*.toml`.
- Whether to submit the four tints (16 more files) to `starship/starship` at all, or keep that PR to the four base flavours only and point to the DarkBerry site for tints — 20 presets in one PR risks reading as the "overly verbose"/scope-creep contributions `AI_POLICY.md` says maintainers may close without notice.
- Who is the human account holder opening and defending the PR — `AI_POLICY.md` requires a person who can explain every line and answer maintainer questions unaided, and forbids an unsupervised autonomous agent submitting it.
- Which screenshot becomes `docs/public/presets/img/darkberry.png` — the port's own `assets/preview.webp` needs converting to PNG, or a fresh terminal capture taken to match the doc's screenshot convention.
