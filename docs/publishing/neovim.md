# Publishing the Neovim port

`ports/neovim/` holds one `.lua` colorscheme file per flavour (`darkberry-wisp.lua`, `darkberry-fen.lua`,
`darkberry-mire.lua`, `darkberry-blackwater.lua`) plus a `<tint>/` folder per tint with the same four files
renamed for that tint (e.g. `lingonberry/lingonberry-mire.lua`). Each file is a self-contained Neovim 0.9+
Lua colorscheme (no plugin API, no `setup()`) meant to be copied by hand into `~/.config/nvim/colors/`.

## Venues

### awesome-neovim (rockerBOO/awesome-neovim)

- **URL**: https://github.com/rockerBOO/awesome-neovim (Colorscheme section); contribution rules at
  https://github.com/rockerBOO/awesome-neovim/blob/main/CONTRIBUTING.md
- **Kind**: community repo (curated "awesome list"); the de facto community index for Neovim plugins.
- **Accepts**: one Markdown bullet per repo, exact format
  `- [username/repo](<URL>) - `<TAGS>` <description>.` Tags (use whichever apply, omit ones that don't):
  `[TS]` Tree-sitter, `[LSP]` LSP semantic tokens, `[L/D]` light+dark variants, `[Lua]` Lua, `[Fnl]` Fennel.
  Description rules: avoid the words "plugin" and "Neovim" unless essential; if "Neovim" appears it must be
  capitalised exactly that way (not "nvim"/"Nvim"/"NeoVim"); acronyms (YAML, TOML, JSON, …) must be correctly
  cased; no emoji.
- **Requirements**: no account beyond a GitHub account to open a PR; no fee, no signing; a human maintainer
  reviews and merges the PR. No explicit licence or star-count requirement was stated in CONTRIBUTING.md.
- **Steps**:
  1. Fork the repo, add one bullet to the Colorscheme section (alphabetical-ish by existing convention;
     one entry only, e.g. `[shythulu/DarkBerry](https://github.com/shythulu/DarkBerry)`).
  2. Run `./scripts/readme-check.sh` locally and fix anything it flags.
  3. Open a PR titled exactly `Add `shythulu/DarkBerry`` using the repo's PR template.
  4. Address review feedback; only one plugin/colorscheme per PR.
- **Updates**: no re-submission needed for new flavours/tints inside the same repo; only re-PR if the
  tags (`[TS]`/`[LSP]`/`[L/D]`/`[Lua]`) change or the repo moves.
- **Contacts**: issues at https://github.com/rockerBOO/awesome-neovim/issues.
- **Sources**: https://raw.githubusercontent.com/rockerBOO/awesome-neovim/main/CONTRIBUTING.md,
  https://github.com/rockerBOO/awesome-neovim (2026-09-24).
- **Confidence**: partly verified — CONTRIBUTING.md rules confirmed directly; exact current alphabetical
  placement and PR template contents not fetched.

### neovimcraft.com

- **URL**: https://neovimcraft.com; source repo https://github.com/neurosnap/neovimcraft
- **Kind**: package/plugin registry (read-only; auto-populated).
- **Accepts**: nothing submitted directly — the site states it scrapes awesome-neovim: "Submit the plugin
  to awesome-neovim… We scrape that repo and [it] is the primary data source for the plugin directory."
- **Requirements**: none of its own; inherits whatever getting into awesome-neovim requires.
- **Steps**: none beyond the awesome-neovim PR above; the entry appears once neovimcraft's next scrape runs.
- **Updates**: automatic, tied to awesome-neovim's content.
- **Contacts**: https://github.com/neurosnap/neovimcraft/issues.
- **Sources**: https://neovimcraft.com (fetched 2026-09-24), https://neovim.io ("Get Plugins" links here,
  fetched 2026-09-24).
- **Confidence**: verified for the mechanism; exact scrape cadence unverified.

### dotfyle.com

- **URL**: https://dotfyle.com
- **Kind**: community repo/index (usage-based, not a submission form).
- **Accepts**: no plugin submission field exists. Dotfyle indexes plugins it finds while parsing Neovim
  configs that users sync via "Add your configuration" (GitHub sign-in, then it parses that repo's plugin
  manager calls and re-syncs daily). A plugin/colorscheme shows up once some synced config references it.
- **Requirements**: a GitHub account to sign in and sync a config; no fee.
- **Steps** (indirect — there is no direct listing step):
  1. Sign in to dotfyle.com with GitHub.
  2. Use "Add your configuration" to sync an nvim config (e.g. the maintainer's own dotfiles) that installs
     `shythulu/DarkBerry` (or a future single-purpose mirror) as a colorscheme plugin.
  3. Dotfyle's daily re-sync then attributes/lists the plugin from that config.
- **Updates**: automatic on the next daily sync of any config that references it.
- **Contacts**: https://github.com/codicocodes/dotfyle (site's GitHub org/issues).
- **Sources**: https://dotfyle.com (fetched 2026-09-24, homepage copy: "sign up with GitHub to sync your
  Neovim config… parses the contents of the files… to identify meta data… syncs this on a daily basis").
- **Confidence**: partly verified — the sync mechanism is documented on the homepage; a dedicated FAQ/about
  page returned a server error (HTTP 500) when fetched, so edge cases (e.g. whether a colorscheme with no
  `require()`-based setup is even detected as a "plugin" by its parser) are unverified.

### vimcolorschemes.com

- **URL**: https://vimcolorschemes.com; about page https://vimcolorschemes.com/about
- **Kind**: community repo (auto-scan, no manual submission form for normal listing).
- **Accepts**: no format submission — it "scans GitHub every day for color schemes to include." A repo
  qualifies if it has at least 1 GitHub star and its README or description contains "vim" or "neovim" plus
  one of theme/color scheme/colour scheme/colorscheme/colourscheme.
- **Requirements**: none beyond the above; if a qualifying repo doesn't appear, file a GitHub issue with a
  link to it.
- **Steps**:
  1. Do nothing if the repo already satisfies the keyword rule (DarkBerry's root README says "Neovim" in
     the port list and "theme" in its title/tagline, but the repo description is
     "A lucious, dark & dusty berry-derived theme…" with no "vim"/"neovim" in it — the keyword match against
     a multi-app monorepo is unverified).
  2. If it doesn't appear within a few days, open an issue on vimcolorschemes' GitHub with a link to
     `https://github.com/shythulu/DarkBerry`.
- **Updates**: automatic re-scan; no re-submission needed for new flavours/tints.
- **Contacts**: GitHub issue tracker linked from https://vimcolorschemes.com/about.
- **Sources**: https://vimcolorschemes.com/about (fetched 2026-09-24).
- **Confidence**: partly verified — the inclusion rule is confirmed; whether the scanner treats a
  multi-app monorepo (only one subfolder of which is the Neovim port) as a match, or lists it correctly
  scoped to Neovim, is unverified.

### GitHub topics (discoverability, not a venue by itself)

- **URL**: repo settings at https://github.com/shythulu/DarkBerry (topics field).
- **Kind**: docs listing / discoverability aid used by GitHub's own topic pages
  (e.g. https://github.com/topics/neovim-colorscheme) and referenced by curated lists.
- **Accepts**: free-text GitHub topic tags on the repo.
- **Requirements**: push access to the repo; no review.
- **Steps**: add topics such as `neovim-colorscheme`, `neovim-theme`, `colorscheme` alongside the existing
  `theme`, `theme-ui`, `themes` topics, from the repo's About panel on GitHub.
- **Updates**: edit anytime, no re-submission.
- **Contacts**: n/a (self-service).
- **Sources**: https://github.com/topics/neovim-colorscheme (fetched 2026-09-24); current repo topics
  checked via `gh repo view shythulu/DarkBerry --json repositoryTopics` on 2026-09-24 (`theme`, `theme-ui`,
  `themes` only).
- **Confidence**: verified for mechanism; not a required or reviewed venue, just improves discovery.

## Not applicable

- **vim-awesome.com** — sources listings from GitHub, Vim.org and scraping public dotfiles for plugin-manager
  references, not from direct submission for a new colorscheme; no documented PR/data-file path was found
  in its repo (https://github.com/vim-awesome/vim-awesome), and it is largely vim-plugin (not
  neovim-Lua-colorscheme) oriented. Checked 2026-09-24; unverified whether contacting it via GitHub
  issues/Gitter would work, but there is no defined "submit a colorscheme" flow to give a later agent.
- **vim.org / vim online scripts** (https://www.vim.org/scripts/index.php) — a legacy Vim (not Neovim)
  script archive for single-file uploads (typically `.vim`); it predates Neovim's Lua colorscheme
  convention and `termguicolors`-based true-colour schemes, and awesome-neovim/neovimcraft do not treat it
  as a source. Checked 2026-09-24; still active (6,012+ scripts, updates dated September 2026) but not a
  fit for a Neovim-0.9+, Lua-only, no-`.vim`-file theme.
- **Neovim's own docs/gallery** — https://neovim.io has no theme gallery or built-in colorscheme
  submission path; its "Get Plugins" link points to neovimcraft.com (covered above), and Neovim core ships
  only its own small set of built-in colorschemes maintained by core contributors, not a community
  submission target. Checked 2026-09-24.
- **LuaRocks** — colorscheme files here are plain `colors/*.lua` scripts with no `lua/` module or `require()`
  API, so there is nothing to package as a Lua rock; not investigated further as it's not how any
  awesome-neovim colorscheme entries are distributed.

## Open questions

- **Repo layout for plugin managers**: lazy.nvim/packer install a colorscheme by putting the plugin repo on
  `runtimepath` and expecting a `colors/*.lua` (or `.vim`) file at the repo **root**. DarkBerry's Neovim
  files live at `ports/neovim/*.lua`, not under a root-level `colors/` folder, so pointing lazy.nvim/packer
  straight at `shythulu/DarkBerry` will not work today. Before or alongside any awesome-neovim submission, a
  human/agent needs to decide: (a) add a root-level `colors/` directory to this monorepo that mirrors
  `ports/neovim/*.lua` (build-step generated or symlinked), or (b) publish a separate single-purpose mirror
  repo (e.g. `shythulu/darkberry.nvim`) that awesome-neovim/dotfyle/vimcolorschemes would actually point to.
  This wasn't resolved by this research and blocks a submission that expects a working plugin install.
- **Which flavours/tints to list**: awesome-neovim wants one entry per repo, not per flavour/tint — decide
  whether the description should mention all four flavours and mention the tints, or just point at the repo.
- **Whose GitHub/dotfyle account** does the "sync a config" step for dotfyle.com use — the theme author's
  own dotfiles, or wait for third-party adoption instead of forcing it.
- **vimcolorschemes.com keyword match**: confirm (by checking the live site after a few days, or opening
  its GitHub issue) whether the monorepo's README/description trips the auto-scanner's "vim/neovim + theme"
  keyword rule, given the description text doesn't currently say "vim" or "neovim".
