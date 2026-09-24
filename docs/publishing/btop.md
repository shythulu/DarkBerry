# Publishing the btop++ port

`ports/btop/` holds four `darkberry-<flavour>.theme` files (Wisp, Fen, Mire, Blackwater) plus a
`<tint>/` subfolder per tint (blueberry, cloudberry, crowberry, lingonberry), each the same
shape. Every file is a complete, self-contained `theme[key]="#RRGGBB"` file in btop's own
theme format (shared with bpytop/bashtop), meant to be copied to `~/.config/btop/themes/`.

## Venues

### btop's bundled themes/ folder (official gallery)

- **URL**: https://github.com/aristocratos/btop/tree/main/themes (repo:
  https://github.com/aristocratos/btop, licensed Apache-2.0)
- **Kind**: official gallery — themes ship inside the app's own repo and are installed by
  `make install` to the system themes dir; this is the only "built-in" theme collection btop has.
- **Accepts**: one plain `.theme` file per submission, added directly to `themes/`, named
  after the theme (existing convention: lower-case, hyphen or underscore, e.g.
  `kanagawa-dragon.theme`, `catppuccin_mocha.theme`, `gotham.theme` — no fixed rule, just match
  the existing style). No required front-matter format, but merged examples commonly open with
  a comment header naming the theme, original palette/author, and licence/attribution when
  adapted from elsewhere (e.g. `gotham.theme`: "# Credit to Andrea Lopardi ... # Adapted by
  jrebs"). No preview-image file is committed to the repo; a preview image is instead embedded
  in the **pull request description** (merged PR #1602 included a `<img>` screenshot inline).
  No separate metadata file, licence file, or naming registry exists — `CONTRIBUTING.md` has no
  theme-specific section at all.
- **Requirements**: no account beyond a GitHub account to open a PR; no fee; no signing keys;
  no CLA bot in `.github/workflows` (checked: `ci.yml`, `cmake.yml`, `test-snap-can-build.yml`,
  `zizmor.yml` — none run a CLA/DCO check). Ordinary maintainer code review applies.
  `CONTRIBUTING.md` requires: (1) explain in the PR why the addition is wanted (a "cosmetic"
  addition needs "a very good explanation of its value" — precedent shows a one-line "here's a
  new theme, here's a screenshot" is normally enough for pure theme PRs); (2) mark the PR
  `[AI generated]` in the title if any code/content was LLM-generated (multiple merged theme
  PRs used this tag for LLM-assisted colour mapping); (3) one theme/topic per PR, not bundled
  with unrelated changes. **Licensing gotcha, verified**: PR #1170 ("Themes: Add Catppuccin",
  four files) was closed unmerged after a reviewer objected: "We must add the license info in
  the files at least. Would be even better to ask upstream if they allow their work to be
  distributed under Apache-2.0" — the submitter was not the copyright holder. Catppuccin's
  btop theme is still absent from `themes/` today (checked: `catppuccin_mocha.theme` 404s on
  `main`). Since Darkberry's author (shythulu) is the actual copyright holder here, this
  objection doesn't block submission, but the PR should say so explicitly and the file should
  carry a licence/attribution comment, per the reviewer's ask.
- **Steps**:
  1. Fork https://github.com/aristocratos/btop.
  2. Add `darkberry-<flavour>.theme` (pick one flavour, or one PR per flavour — no merged
     precedent bundles more than one file except the since-rejected Catppuccin PR) to `themes/`.
  3. Add a short header comment crediting Darkberry, https://github.com/shythulu/DarkBerry, and
     its MIT licence, since the target repo is Apache-2.0 and the earlier rejection turned on
     exactly this being missing.
  4. Open a PR against `main` titled e.g. "Add Darkberry theme" (add `[AI generated]` only if
     applicable per the disclosure rule above); body explains the theme, states the submitter
     is the copyright holder under Darkberry's MIT licence and is fine with Apache-2.0
     distribution, and embeds a preview screenshot image (drag-and-drop into the PR body, GitHub
     hosts it — no fixed size found in any merged PR).
  5. Respond to review; `CONTRIBUTING.md` gives no SLA, and closed/still-open theme PRs in the
     history (e.g. #1522, #1443, #1683) show turnaround is inconsistent and not guaranteed.
- **Updates**: a follow-up PR editing the same file in `themes/`; no versioning or re-approval
  process beyond ordinary review.
- **Contacts**: issues/PRs at https://github.com/aristocratos/btop; discussions at
  https://github.com/aristocratos/btop/discussions; maintainer email per `CONTRIBUTING.md`:
  jakob@qvantnet.com.
- **Sources**: https://raw.githubusercontent.com/aristocratos/btop/main/CONTRIBUTING.md
  (fetched 2026-09-24); https://raw.githubusercontent.com/aristocratos/btop/main/README.md
  `## Themes` section (fetched 2026-09-24); `gh pr view 1170/1602/1683 --repo aristocratos/btop`
  and `gh api repos/aristocratos/btop/issues/1170/comments` (fetched 2026-09-24); directory
  listing `gh api repos/aristocratos/btop/contents/themes` (fetched 2026-09-24, 41 files, no
  catppuccin entry); raw fetch of `themes/catppuccin_mocha.theme` (404, fetched 2026-09-24);
  raw fetch of `themes/gotham.theme` and `themes/dracula.theme` for header-comment convention
  (fetched 2026-09-24).
- **Confidence**: partly verified — the mechanics (fork, add file, PR) and the licensing
  objection are directly confirmed from a real closed PR; there is no written acceptance bar
  beyond `CONTRIBUTING.md`'s general rules, so whether four flavours in one PR vs. four separate
  PRs is preferred is unverified (no merged multi-file theme PR exists to check against, since
  the one example — Catppuccin — was rejected on licensing, not on being multi-file).

## Not applicable

- **An official btop store/marketplace** — btop is a CLI TUI app with no plugin store or
  marketplace concept; checked README and CONTRIBUTING.md, neither mentions one.
- **Package registries (crates.io, PyPI, npm, Homebrew formula, AUR, etc.)** — btop themes are
  plain files with no ecosystem convention of registry distribution; the bundled `themes/`
  folder is the only place btop itself ships them, and `make install`/the Homebrew/AUR btop
  packages only install what's already in that folder.
- **catppuccin/btop (github.com/catppuccin/btop)** — a real, actively maintained third-party
  repo, but it is scoped to the Catppuccin palette specifically (its own four flavours), not a
  general btop-theme collection that accepts unrelated palettes like Darkberry.
- **A separate "awesome-btop" curated list** — searched GitHub and the web; no such curated
  list exists (only the generic `btop-theme` GitHub Topic, which is self-applied tagging on a
  repo, not a submission-based listing, and the auto-generated aggregator pages found in search
  are not curated or authoritative).
- **btop's own docs/man page as a separate listing** — the README `## Themes` section *is* the
  docs listing, and it only points back at the same `themes/` folder above; there is no
  separate docs site.

## Open questions

- Whether to submit all four flavours as one PR or four separate PRs — no merged precedent
  either way (the only multi-file theme PR, Catppuccin's, was rejected for licensing, not
  file count); a submitting agent should default to one PR unless a maintainer response
  suggests otherwise.
- Whose GitHub account opens the PR (shythulu directly vs. another account) is for the
  submitting agent/human to decide.
- Whether any part of the theme's colour values were LLM-generated in a way that trips the
  `[AI generated]` disclosure rule (the file headers describe a deterministic `build.mjs`
  script and measured OKLab contrast checks, not prompting an LLM for colours, but the
  submitting agent should confirm before asserting non-disclosure in the PR).
- No response time guarantee exists; several theme PRs in btop's history sat open for months
  or were closed without explanation, so the submitting agent should expect to follow up.
