# Publishing the micro port

`ports/micro/` holds one `.micro` colorscheme file per flavour at its root (`darkberry-wisp.micro`, `darkberry-fen.micro`, `darkberry-mire.micro`, `darkberry-blackwater.micro`), plus a `<tint>/` subfolder per tint with the same four files renamed for that tint. A `.micro` colorscheme is a small text file of `color-link <group> "<fg>,<bg>"` lines (see `runtime/help/colors.md` in the micro repo); users copy one into `~/.config/micro/colorschemes/` and run `set colorscheme <name>`, exactly as `ports/micro/README.md` documents.

## Venues

### Official plugin channel

- **URL**: https://github.com/micro-editor/plugin-channel (list consumed by micro: `https://raw.githubusercontent.com/micro-editor/plugin-channel/master/channel.json`)
- **Kind**: official store, built into micro's `plugin` command
- **Accepts**: a colorscheme shipped as a Lua "plugin". The plugin repo needs a `.lua` file whose first line sets `VERSION = "x.y.z"` and that calls `AddRuntimeFile("<name>", "colorscheme", "<file>.micro")` per scheme (e.g. `novln/micro-gotham-colors`: `gotham-colors.lua` + `gotham.micro` + `repo.json`), the `.micro` file(s) alongside it, a `repo.json` at the repo root (`Name`, `Description`, `Website`, `Tags[]`, `Versions[{Version, Url (zip of a tagged release), Require:{micro:">=x.y.z"}}]`), and a LICENSE file.
- **Requirements**: GitHub account to open a PR; no fee, no signing; maintainer review (JoeKar and others) before the zip is uploaded to the channel repo's own `plugins` GitHub Release.
- **Steps**: 1) Build a plugin repo (DarkBerry's monorepo layout doesn't match the flat plugin shape needed, so this likely wants a small dedicated repo) with `repo.json`, a `.lua` registering each flavour, the `.micro` files, and MIT `LICENSE`. 2) Tag a release and zip it. 3) Fork `plugin-channel`; add either a `plugins/<name>.json` file (legacy in-repo pattern used by `gotham-colors`/`monokai-dark`) or a direct link to your repo's raw `repo.json` (pattern used by newer entries) into `channel.json`. 4) Add a row to the README plugin table. 5) Open a PR with the zip linked or attached. 6) Maintainer reviews and uploads the zip to the `plugins` release if accepted.
- **Updates**: open a new PR bumping `Versions` in your `repo.json`/`plugins/<name>.json` with the new version and zip link; maintainer re-uploads.
- **Contacts**: PRs/issues at https://github.com/micro-editor/plugin-channel; maintainers active in issues include JoeKar and Neko-Box-Coder.
- **Sources**: https://github.com/micro-editor/plugin-channel/blob/master/README.md, https://raw.githubusercontent.com/micro-editor/plugin-channel/master/channel.json, https://github.com/novln/micro-gotham-colors, https://raw.githubusercontent.com/micro-editor/micro/master/runtime/help/plugins.md — checked 2026-09-24.
- **Confidence**: partly verified. Format and PR mechanics confirmed from the README and a real colorscheme-plugin example, but the channel is slow: the last merged commit is 2025-02-09 and PRs opened as far back as 2025-12-29 (#123) are still open as of 2026-09-24 — turnaround time is effectively unverified and likely very long.

### Colorscheme community list (GitHub Discussion)

- **URL**: https://github.com/micro-editor/micro/discussions/4167
- **Kind**: official-adjacent docs/community listing — a Discussion on the editor's own repo that maintainer JoeKar now explicitly points new-colorscheme submitters to, after closing direct add-to-core PRs.
- **Accepts**: one top-level comment per colorscheme with a link to the theme's repo and a screenshot. Rules posted by the thread's opener (usfbih8u): stay on topic (link + screenshot only), search the thread first (Ctrl+F, check by URL) to avoid duplicates, only post if it's new, use reactions rather than reply comments to express preference. No file format or metadata is enforced — it just links out to wherever DarkBerry already lives.
- **Requirements**: a GitHub account to comment; no fee, no signing, and no approval gate (it is a discussion, not merged content).
- **Steps**: 1) Search the discussion for "darkberry" and for `github.com/shythulu/DarkBerry` to confirm it isn't listed. 2) Post one comment linking to `https://github.com/shythulu/DarkBerry` (or straight to `ports/micro/`) with a screenshot, e.g. `ports/micro/assets/preview.webp`. 3) No further step — nothing is merged or reviewed.
- **Updates**: no formal mechanism; the comment author can edit their own comment, or post a follow-up if the port changes materially.
- **Contacts**: the discussion thread itself; repo issues at https://github.com/micro-editor/micro/issues; thread opener usfbih8u, maintainer JoeKar.
- **Sources**: https://github.com/micro-editor/micro/discussions/4167, https://github.com/micro-editor/micro/pull/3745 (closing comment), https://github.com/micro-editor/micro/pull/4164 (JoeKar/Neko-Box-Coder/usfbih8u discussion of routing new colorschemes here) — checked 2026-09-24.
- **Confidence**: partly verified. Rules and the routing rationale are confirmed via the PR threads that led to the discussion's creation; the discussion's own original-post text was read through a summarizing fetch rather than the raw page, so exact wording (and any screenshot size/format expectation, which appears unspecified) is unverified.

### Unofficial plugin channel

- **URL**: https://github.com/Neko-Box-Coder/unofficial-plugin-channel (list: `https://raw.githubusercontent.com/Neko-Box-Coder/unofficial-plugin-channel/main/channel.json`)
- **Kind**: community-run plugin channel, functions identically to the official one once a user adds it
- **Accepts**: the same plugin shape as the official channel (own repo with `repo.json` + `.lua` + `.micro` files + LICENSE). `channel.json` there points straight at each plugin's own raw `repo.json` URL (confirmed by inspecting its contents), so version bumps live entirely in your own repo and need no further PR to the channel. New entries also need a row in the channel's own `README.md` (alphabetical) and a line in `PLUGINS_TO_STABLE.md` flagging it for eventual promotion.
- **Requirements**: GitHub (or Gitea) account for your plugin repo and to open the PR; no fee/signing; maintainer review (Neko-Box-Coder) before merge.
- **Steps**: 1) Same plugin-repo prep as the official channel. 2) Fork `unofficial-plugin-channel`. 3) Add a row to `README.md` (alphabetical). 4) Add your repo's raw `repo.json` URL to `channel.json` (alphabetical). 5) Add the plugin name to `PLUGINS_TO_STABLE.md`. 6) Open a PR to `main` using the repo's PR template.
- **Updates**: bump `Versions` in your own `repo.json` directly — no PR to the channel needed since it dereferences your URL live.
- **Contacts**: PRs/issues at https://github.com/Neko-Box-Coder/unofficial-plugin-channel.
- **Sources**: https://raw.githubusercontent.com/Neko-Box-Coder/unofficial-plugin-channel/main/README.md, https://raw.githubusercontent.com/Neko-Box-Coder/unofficial-plugin-channel/main/channel.json, merged-PR history of that repo — checked 2026-09-24.
- **Confidence**: verified. README fetched directly and merges are current (last merge 2026-08-28, several merges through 2026 generally within weeks of the PR).

### micro-garden/pub-colorschemes

- **URL**: https://github.com/micro-garden/pub-colorschemes
- **Kind**: third-party community repo, distributed both as an installable plugin and as raw `.micro` files
- **Accepts**: `.micro` files dropped into `colorschemes/`, vendored (copied) rather than linked, with a "Credits" entry in `README.md` crediting the original author/repo. No documented naming rule beyond the existing `<author>-<name>[-tc].micro` pattern; MIT-licensed.
- **Requirements**: unclear — the repo has zero merged PRs and zero open issues in its history, so no PR-based intake is evidenced. The README lists sole author Aki Kareha (`aki@kareha.org`) as contact.
- **Steps**: 1) Email Aki Kareha (or open an issue, if the repo allows it) linking DarkBerry's micro port and asking for inclusion, since no PR path has ever been used. 2) Alternatively, open a PR adding the four `darkberry-*.micro` files to `colorschemes/` and a Credits line — untested, since no external PR has ever been merged there.
- **Updates**: unverified — no update mechanism is documented.
- **Contacts**: `aki@kareha.org`; repo https://github.com/micro-garden/pub-colorschemes.
- **Sources**: https://raw.githubusercontent.com/micro-garden/pub-colorschemes/main/README.md, repo metadata via `gh api repos/micro-garden/pub-colorschemes` (pushed 2025-10-26, 0 open issues) — checked 2026-09-24.
- **Confidence**: unverified. No external contribution has ever visibly landed in this repo, so whether it accepts outside submissions at all (versus only the author's own vendoring) is unknown.

## Not applicable

- **Bundling into micro's core `runtime/colorschemes/`** (direct PR to `micro-editor/micro`): checked open/closed PRs #3745, #3737, #4164, #4001, #4096. Maintainers are now explicitly declining new bundled colorschemes, citing binary size and long-term maintenance burden, and redirect all such proposals to Discussion #4167 (see PR #3745's closing comment, 2026-08-09, and the #4164 thread, 2026-08-08).
- **"Awesome" curated list for micro**: no maintained awesome-list repo for micro themes/plugins was found via web or GitHub search (checked 2026-09-24).
- **Hunter-Github/micro-colorschemes**: a personal hand-curated link list with no documented contribution process (README checked 2026-09-24); it only points at other authors' repos, so it isn't a real submission venue.
- **Package registry**: micro has no npm/crates-style package registry for colorschemes; the plugin channels above are the closest equivalent.

## Open questions

- Whether to build a small dedicated `micro-darkberry` plugin repo (repo.json + `.lua` + copies of the flavour `.micro` files) for the plugin-channel routes, since DarkBerry's monorepo layout doesn't match the flat structure `AddRuntimeFile` expects — or whether GitHub's release-zip mechanism can point at a subfolder of `shythulu/DarkBerry` directly.
- Whether shylo wants to pursue the official plugin channel at all given its multi-month-plus merge backlog, or treat the Discussion comment and the unofficial channel as the practical submissions and leave the official-channel PR as optional/low-priority.
- Whose GitHub account posts the Discussion comment and opens the plugin-channel PRs (presumably shythulu — confirm before submitting).
- Whether to list only the four base flavours or also the four tints as separate entries/plugin versions — the port's own usage instructions only demonstrate `darkberry-mire`.
