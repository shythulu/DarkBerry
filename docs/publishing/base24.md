# Publishing the Base24 port

`ports/base24/` holds one Base24 scheme YAML per flavour at the folder root (`darkberry-wisp.yaml`, `darkberry-fen.yaml`, `darkberry-mire.yaml`, `darkberry-blackwater.yaml`), plus the four tints (Lingonberry, Cloudberry, Crowberry, Blueberry) each in their own subfolder as `<tint>-<flavour>.yaml`. Each file is the Tinted Theming "common scheme format" (`system`, `name`, `slug`, `author`, `description`, `variant`, `palette.base00`..`base17` as `#`-prefixed hex) for Tinted Theming's Base24 builders (`tinty`, `tinted-builder-rust`).

## Venues

### tinted-theming/schemes (canonical scheme collection)

- **URL**: https://github.com/tinted-theming/schemes
- **Kind**: official gallery source / canonical community repo — this is the single repo every current Base16/Base24 builder (`tinty`, `tinted-builder-rust`, `tinted-builder-go`, `tinted-builder-python`) and the gallery site pull schemes from. It replaced the old per-scheme-repo model.
- **Accepts**: one scheme YAML per flavour, placed in `base24/` at the repo root (flat, no subfolders; e.g. existing multi-flavour families sit as `catppuccin-frappe.yaml`, `catppuccin-latte.yaml`, `catppuccin-macchiato.yaml`, `catppuccin-mocha.yaml`, `gruvbox-dark.yaml`, `gruvbox-light.yaml` — Darkberry's existing `darkberry-<flavour>.yaml` naming already matches this convention). Darkberry's existing `slug`/`description` fields are valid: they are optional fields of the current common scheme format (Builder Guidelines v0.11.2, see tinted-theming/home), not rejected extras.
- **Requirements**: a GitHub account to open a PR. No CLA, fee, or signing key found. The repo itself is MIT-licensed (`LICENSE`, copyright Tinted Theming); there is no separate contributor licence statement, so licensing a contributed scheme MIT (which Darkberry already is) matches the repo's own licence but this inbound-licensing expectation is not spelled out anywhere — treat as the norm, not a written rule.
- **Steps**:
  1. Fork https://github.com/tinted-theming/schemes.
  2. Add each flavour's YAML file to `base24/` at the repo root (e.g. `base24/darkberry-wisp.yaml`), keeping the existing field structure. Required fields per `scripts/lint`: `author`, `name`, `palette`, `system`, `variant`; every `base0x` colour must start with `#`. `.yamllint.yml` also lints (`extends: default`, line length max 180, `document-start` and `comments` rules disabled).
  3. Repeat for `fen`/`mire`/`blackwater`; a submitting agent should decide whether to also submit the four tints (16 more files) in the same PR or hold them back (see Open questions).
  4. Commit and open a PR against `main`.
  5. The `Test` GitHub Actions workflow (`.github/workflows/test.yml`) runs `yamllint` and `scripts/lint` on PRs — confirmed running and passing on merged PRs (e.g. PR #122, 2026-09-12) even though the workflow file's declared trigger (`on.pull_request.branches: ["spec-**"]`) reads as if it should only fire for PRs targeting `spec-**` branches; the observed behaviour on `main`-targeted PRs contradicts the file as read, so treat the discrepancy as unexplained rather than resolved.
  6. A maintainer (team `@tinted-theming/schemes`, per `.github/CODEOWNERS`) reviews and merges. Recent merge cadence is active — PRs merged as recently as 2026-09-23 and 2026-09-12, roughly every 1-4 weeks.
- **Updates**: edit the same file(s) and open a new PR; there is no separate versioning step.
- **Contacts**: issues/PRs at https://github.com/tinted-theming/schemes/issues and /pulls (CODEOWNERS: `@tinted-theming/schemes`); broader project chat is the Matrix room `#tinted-theming:matrix.org` (linked from `tinted-theming/home`'s CONTRIBUTING.md).
- **Sources**: https://github.com/tinted-theming/schemes (README.md, CONTRIBUTING section, 2026-09-24), https://github.com/tinted-theming/schemes/blob/main/.github/workflows/test.yml (2026-09-24), https://github.com/tinted-theming/schemes/blob/main/scripts/lint (2026-09-24), https://github.com/tinted-theming/schemes/blob/main/.yamllint.yml (2026-09-24), https://github.com/tinted-theming/schemes/blob/main/.github/CODEOWNERS (2026-09-24), https://github.com/tinted-theming/schemes/pull/122 and /pull/124 (2026-09-24, merge cadence and passing CI), https://github.com/tinted-theming/home/blob/main/builder.md (Builder Guidelines v0.11.2, common scheme format fields, 2026-09-24), https://github.com/tinted-theming/home/blob/main/CONTRIBUTING.md (Matrix link, 2026-09-24).
- **Confidence**: verified (required fields, file location, naming convention, CI checks, and merge cadence all confirmed from primary sources and recent merged PRs). Unverified: whether reviewers expect all four flavours in one PR vs. one PR per flavour, and whether they expect tints included.

### Tinted Gallery (tinted-theming.github.io/tinted-gallery)

- **URL**: https://tinted-theming.github.io/tinted-gallery/ (source: https://github.com/tinted-theming/tinted-gallery)
- **Kind**: official gallery site.
- **Accepts**: nothing submitted directly — no separate submission exists for this venue. Its build (`.github/workflows/pages_v2.yaml`) runs `tinty install` (which pulls from `tinted-theming/schemes`) and `tinty gallery --dump`, on every push to `main` and daily via cron (`0 0 * * *`).
- **Requirements**: none for a scheme author; this is fully automatic once a scheme is merged into `tinted-theming/schemes`.
- **Steps**: none — a scheme appears here automatically after merging into `tinted-theming/schemes` (within one day, or immediately on the next push to that repo's `main` if the gallery's own workflow is manually dispatched sooner).
- **Updates**: automatic, same mechanism.
- **Contacts**: issues at https://github.com/tinted-theming/tinted-gallery/issues.
- **Sources**: https://github.com/tinted-theming/tinted-gallery/blob/main/build.sh (2026-09-24, confirms it clones `tinted-theming/schemes` and iterates every `base24/*.yaml`), https://github.com/tinted-theming/tinted-gallery/blob/main/.github/workflows/pages_v2.yaml (2026-09-24, confirms daily cron + push-to-main trigger and that it runs via `tinty install`/`tinty gallery`).
- **Confidence**: verified.

## Not applicable

- **chriskempson/base16-schemes-source** (https://github.com/chriskempson/base16-schemes-source) — still nominally open to PRs per its README, but it is a Base16-only list of separate per-scheme GitHub repositories (`base16-[scheme-name]-scheme`), superseded for Base16 itself by `tinted-theming/schemes`; it has no Base24 equivalent and does not take single-file scheme submissions, so it does not fit this port.
- **Base24/base24-schemes-source** (https://github.com/Base24/base24-schemes-source) — archived (`archived: true` via the GitHub API, last pushed 2020-06-19). Dead; does not take submissions.
- **tinted-theming/base24 repo's own docs** (`file.md`, `base24schema.json`, `builder.md` at https://github.com/tinted-theming/base24) — these describe the legacy flat scheme format (`scheme:`/`author:`/`base00:` at top level, hex without `#`) from the original `Base24/base24-builder-python` era, not the current common scheme format Darkberry's files already use (confirmed current in `tinted-theming/home/builder.md` v0.11.2). Not a submission venue; flagged only so a submitting agent doesn't reformat the file to match this stale spec.
- **tinted-theming/base24 README's "Supported Applications" / "Existing Base16 Templates" lists** — these list template/builder repositories (consumers of schemes for one app each), not scheme listings; nothing to submit a colour scheme to there.

## Open questions

- Whether to submit all four flavours in a single PR to `tinted-theming/schemes`, or split into one PR per flavour — no stated rule either way; recent merged PRs did both (e.g. PR #124 added a whole family, PR #122 added one scheme).
- Whether to also submit the four tints (16 additional files) in the same pass, or keep the initial submission to the four core flavours and follow up later.
- Whether reviewers will ask about the header comment block Darkberry's files carry (build provenance, spec version, ANSI-vs-legibility trade-off notes) — none of the existing `base24/*.yaml` files in the target repo carry comments of this length; confirm this is acceptable style before submitting, or ask a human whether to trim it.
- No explicit inbound-licence statement was found for `tinted-theming/schemes` contributions; confirm with a maintainer (or via the PR itself) that MIT-licensed contributions are acceptable as-is rather than assuming.
