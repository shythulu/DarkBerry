# Publishing the Obsidian port

`ports/obsidian/<Darkberry Flavour>/` (plus the four tint folders) each hold a self-contained
Obsidian theme: `manifest.json` (name, version, minAppVersion, author, authorUrl) and
`theme.css`, one theme per flavour, each painting both of Obsidian's own light/dark modes so
Obsidian's Appearance switch never changes the flavour.

## Venues

### Obsidian community theme directory

- **URL**: submission portal `https://community.obsidian.md/` (sign-in + "add your theme");
  browsable directory the app reads from is mirrored to
  `https://github.com/obsidianmd/obsidian-releases/blob/master/community-css-themes.json`;
  docs at `https://docs.obsidian.md/Themes/App+themes/Submit+your+theme`,
  `https://docs.obsidian.md/Themes/App+themes/Build+a+theme`,
  `https://docs.obsidian.md/Themes/App+themes/Theme+guidelines`,
  `https://docs.obsidian.md/Reference/Manifest`.
- **Kind**: official gallery (in-app "Community themes" browser).
- **Accepts**: a GitHub repo whose **default-branch root** holds `manifest.json` and
  `theme.css` (not a subfolder), a `README.md` (its excerpt shows on the listing page), and a
  `LICENSE` file (any licence accepted; MIT is fine). `manifest.json` required fields:
  `name`, `author`, `version` (semver `x.y.z`, must match the GitHub release tag),
  `minAppVersion`; `authorUrl` and `fundingUrl` are optional. Theme names must be English,
  Basic Latin, short, must not contain "Theme", must not collide with an existing listed
  name, and **cannot be changed after acceptance**. A screenshot is required; recommended
  512×288px, referenced by filename in the directory entry. Directory entry schema (from the
  live `community-themes.json`): `name`, `author`, `repo` (`owner/repo`, no path/branch
  field), `screenshot`, `modes` (`["dark","light"]`), optional `legacy`.
- **Requirements**: a GitHub account (for the repo and to sign in to community.obsidian.md);
  no fee; no code signing; automated checks plus a human reviewer merge the listing (forum
  reports ~1 month turnaround); submissions must conform to
  `https://docs.obsidian.md/Developer+policies` (page returned "does not exist" when fetched
  2026-09-24 — unverified content, only the URL is confirmed live elsewhere).
- **Steps**:
  1. Push the theme to its own GitHub repo with `manifest.json` and `theme.css` at repo root.
  2. Add a screenshot (512×288 recommended) and a `README.md`/`LICENSE`.
  3. Set the final `version` in `manifest.json`, then cut a GitHub Release tagged with that
     exact version (Obsidian fetches `manifest.json`/`theme.css` from the release matching
     the tag, not from the repo tree directly).
  4. Sign in at `https://community.obsidian.md/`, link the GitHub account, and use "add your
     theme" to submit — this is the current front door; it writes the entry into
     `community-themes.json`, which `obsidianmd/obsidian-releases`' `mirror-community-json.yml`
     workflow copies into `community-css-themes.json` on an hourly cron. Older guidance
     (forum posts, some docs mirrors) describes forking `obsidian-releases` and hand-editing
     `community-css-themes.json` via PR with the repo's theme PR template — that file is now
     a generated mirror, so a manual PR there is likely superseded; treat the
     community.obsidian.md portal as authoritative and the PR route as legacy/unverified.
  5. Automated review runs against the repo; the directory page shows what needs fixing.
     Once checks and a human reviewer pass, the theme appears in-app.
- **Updates**: bump `version` in `manifest.json`, cut a new GitHub Release tagged to match;
  no new submission/PR needed — Obsidian and the mirrored directory pick up the new release.
- **Contacts**: issues about the directory/mirror go to
  `https://github.com/obsidianmd/obsidian-releases` (repo says it does not take plugin/theme
  support issues — file those against the theme's own repo instead); general questions to
  `https://obsidian.md/community`; after acceptance, announce in the forum
  `https://forum.obsidian.md/c/share-showcase/9` and Discord `https://discord.gg/veuWUTm`
  (`#updates`, requires the `developer` role).
- **Confidence**: partly verified. Verified from primary sources: manifest fields, root-of-repo
  requirement, release-tag mechanism, screenshot size, directory JSON schema (fetched
  2026-09-24), and the mirror workflow's source code (`mirror-community-json.yml`, fetched
  2026-09-24) confirming `community.obsidian.md` is upstream of the GitHub JSON. Unverified:
  `Developer+policies` page content (fetch failed 2026-09-24), whether a manual PR to
  `obsidian-releases` is still accepted alongside the portal, exact automated-review checklist
  beyond the four guideline bullets (CSS variables, low-specificity selectors, no remote
  assets, no `!important`).

## One repo, one theme — the open structural question

The directory's schema has **no path or branch field**: `repo` is just `owner/repo`, and both
the manifest fetch and the release-asset fetch assume repo root. Checked the live
`community-themes.json`/`community-css-themes.json` for a precedent of one repo serving
several directory entries (as this four-flavour repo would need) — found none. Multi-flavour
theme authors solve it one of two ways, both present in the current data:
- **Separate repos per flavour/variant** — e.g. Gruvbox has distinct entries
  `insanum/obsidian_gruvbox` and `alljavi/material_gruvbox_obsidian`; Everforest has three
  separate repos/entries for its variants.
- **One repo, one directory entry, flavour switching happens inside the theme** — Catppuccin
  ships a single entry (`{"name":"Catppuccin","author":"catppuccin","repo":"catppuccin/obsidian","screenshot":"assets/screenshot.png","modes":["dark","light"]}`)
  and lets the user pick Latte/Frappé/Macchiato/Mocha via Obsidian's own light/dark toggle
  plus the community Style Settings plugin, not via four separate listings.
Darkberry's port currently ships four independent `manifest.json`/`theme.css` pairs (Wisp,
Fen, Mire, Blackwater), matching neither pattern outright — it is closer to the "separate
repo per flavour" model but lives in one monorepo subfolder per flavour, not repo root.

## Not applicable

- **Obsidian in-app plugin API / marketplace fees** — Obsidian has no paid store and charges
  no submission fee for themes or plugins; checked `docs.obsidian.md` and
  `community.obsidian.md`, neither mentions a fee.
- **`obsidian-releases` direct file hosting** — the repo explicitly does not accept issues for
  individual plugins/themes (its own README) and, per the mirror workflow, no longer treats
  `community-css-themes.json` as hand-edited; use the portal instead.

## Open questions

- Whose GitHub account and which org owns the four (or more, with tints) per-flavour repos
  that the official directory requires at root level — new standalone repos under
  `shythulu`, or a sync/subtree-export step from this monorepo's `ports/obsidian/<flavour>/`
  folders into throwaway repos?
- Does Darkberry want four separate community-directory listings (`Darkberry Wisp`,
  `Darkberry Fen`, `Darkberry Mire`, `Darkberry Blackwater`, each its own name/repo/screenshot),
  or one listing named `Darkberry` with an in-theme flavour switcher, matching Catppuccin's
  approach instead of four independent manifests? This changes both the submission count and
  the theme.css structure and should be decided by a human before submitting anything.
- Who signs in to `community.obsidian.md` and links GitHub (a personal step, not automatable
  from CI) to actually click "add your theme" for each entry, and who watches for automated
  review feedback on the directory page afterward.
- Whether to also submit the four tint variants (Blueberry, Cloudberry, Crowberry,
  Lingonberry) as directory listings, or keep those install-from-repo only — unresolved here,
  since the task scope was the four core flavours.
