# Publishing the lsd port

`ports/lsd/` holds four `darkberry-<flavour>.yaml` files (Wisp/Fen/Mire/Blackwater) plus
`.256.yaml` companions for lsd 1.0, and a `<tint>/` subfolder per tint with the same pair.
Each is a standalone `colors.yaml` the user copies to `~/.config/lsd/colors.yaml` after
setting `color: {theme: custom}` in `~/.config/lsd/config.yaml`; there is no packaging step.

## Venues

### lsd-rs GitHub Discussions — "Show and tell"

- **URL**: https://github.com/orgs/lsd-rs/discussions (repo discussions at
  `github.com/lsd-rs/lsd/discussions` redirect here; org has no separate theme repo).
  New-post link: `https://github.com/orgs/lsd-rs/discussions/new?category=show-and-tell`.
- **Kind**: community repo/docs listing — informal showcase category, not a curated gallery.
  lsd has no built-in theme collection, no official gallery repo, and no theme review process;
  this discussion category is the only place in the project itself where people post themes.
- **Accepts**: free-form post. No fixed format, file-naming rule, metadata schema or preview-image
  size is defined. Existing example ("Solarized Light/Dark Theme", discussion #917) is prose plus
  a link to the author's own theme repo — i.e. posts point out to an external repo rather than
  attaching the theme file itself.
- **Requirements**: a free GitHub account (signed in) to post; no fee, no signing key, no formal
  review — discussions are not moderated for acceptance, just for conduct.
- **Steps**:
  1. Sign in to GitHub.
  2. Open the "Show and tell" category new-discussion link above (or Discussions tab on
     https://github.com/lsd-rs/lsd → New discussion → category "Show and tell").
  3. Title it something like "Darkberry theme for lsd" and link
     https://github.com/shythulu/DarkBerry/tree/main/ports/lsd (or the site page
     https://shythulu.github.io/DarkBerry/), noting the four flavours/tints, MIT licence, and
     the lsd-version caveat (1.1+ needs hex `colors.yaml`; 1.0 needs the `.256.yaml` file).
  4. Optionally attach or embed a preview screenshot (no size requirement observed).
- **Updates**: edit the discussion post directly; no separate re-submission process.
- **Contacts**: same GitHub Discussions thread; repo issue tracker at
  https://github.com/lsd-rs/lsd/issues for anything code-related (not for theme listing).
- **Sources**: https://github.com/lsd-rs/lsd (README, `doc/colors.md`), GraphQL discussion
  category listing and discussion #917 "Solarized Light/Dark Theme" (org-level, redirected from
  the repo), fetched 2026-09-24.
- **Confidence**: partly verified. Category and precedent post confirmed live; exact posting UI
  and any unwritten moderation norms unverified (would need an authenticated GitHub session to
  complete a real post).

## Not applicable

- **Official theme gallery / built-in collection**: none. `lsd-rs` org repos are only `lsd`,
  `lsd-rs.github.io` (project site, mirrors the README, no theme listing), and `winget-pkgs`
  (a Windows package-manager fork, unrelated to themes). Checked org repo list via GitHub API
  2026-09-24.
- **Official store or marketplace**: lsd is a CLI tool with no plugin/theme store.
- **Package registry (crates.io)**: crates.io hosts the `lsd` binary crate itself
  (https://crates.io/crates/lsd); it has no mechanism for distributing `colors.yaml` theme
  files, and lsd does not consume themes from crates.io.
- **App docs listing**: `README.md` and `doc/colors.md` document the default palette and how to
  write a custom `colors.yaml`/`icons.yaml`, but list no community themes and link to none.
- **GitHub wiki**: `lsd-rs/lsd` has `has_wiki: false` — no wiki exists to list themes on.
- **Curated third-party list ("awesome-lsd")**: searched and found none. What exists instead is a
  scatter of independent, unaffiliated theme repos other authors made for lsd (e.g.
  `catppuccin/lsd`, `draculatheme.com/lsd`, `bradleyhop/lsd-solarized-theme`) — each is its own
  standalone repo/site, not a directory Darkberry could list itself in. DarkBerry's own repo
  and site already fill that same role for this port, so nothing further to submit to here.

## Open questions

- Whether to post to "Show and tell" at all, given it has no discoverability guarantee beyond
  the discussion feed — a submitting agent (or shylo) should decide if it's worth the post.
- Whose GitHub account makes the post (shylo's, presumably, since the repo is under
  `shythulu`) — no account/registration decision was needed for research, but posting needs a
  human signed in.
