# Publishing the Kate port

`ports/kate/*.theme` is four standalone KSyntaxHighlighting colour-theme files (`darkberry-wisp.theme`, `-fen`, `-mire`, `-blackwater`), one per flavour, installed by copying into `~/.local/share/org.kde.syntax-highlighting/themes/`; `ports/kate/<tint>/` holds the same four files re-derived per tint (lingonberry/cloudberry/crowberry/blueberry). Each is a JSON file (`"metadata"` + `"text-styles"`/`"custom-styles"` objects) read by the KSyntaxHighlighting framework, so it lights up Kate, KWrite and every other KTextEditor-based app — nothing to build or sign.

## Venues

### KSyntaxHighlighting framework (KDE Invent)

- **URL**: repo https://invent.kde.org/frameworks/syntax-highlighting ; bundled themes directory https://invent.kde.org/frameworks/syntax-highlighting/-/tree/master/data/themes ; merge requests https://invent.kde.org/frameworks/syntax-highlighting/-/merge_requests
- **Kind**: official gallery — themes merged here ship inside the framework itself and are what populate Settings > Configure Kate > Fonts & Colors and the auto-generated list at https://kate-editor.org/themes/.
- **Accepts**: one `.theme` JSON file per flavour, filed directly in `data/themes/` (confirmed via the GitLab API tree listing, 2026-09-24), lowercase-hyphenated names like the existing `catppuccin-mocha.theme`, `gruvbox-dark.theme`, `github-dark.theme`. Required `"metadata"` fields, confirmed by reading `catppuccin-mocha.theme`'s raw contents via the GitLab API: `copyright` (an array of `"SPDX-FileCopyrightText: <year> <holder>"` strings), `license` (`"SPDX-License-Identifier: MIT"`), `name`, and `revision` (an integer, bumped on each change) — this exactly matches the metadata block already in Darkberry's `.theme` files. Licence **must be MIT** — the framework's README states it will only bundle MIT-licensed themes, and `LICENSES/MIT.txt` is present in the repo. No preview-image file is required in the repo itself, but the precedent submission (Catppuccin, MR !455) attached one screenshot per flavour directly in the MR description, not as a repo file.
- **Requirements**: a free KDE Identity account is enough — per KDE's own wiki, "You do not need a KDE Developer account to browse source code, log into invent.kde.org, submit merge requests." No fee, no signing key. Merge requests go through normal maintainer review before merge (unspecified timeline; the Catppuccin theme set took two follow-up MRs — !476, !478 — after the initial merge to tweak colours and backport).
- **Steps**:
  1. Create a KDE Identity account and sign in at https://invent.kde.org.
  2. Fork `frameworks/syntax-highlighting`, add the four `darkberry-*.theme` files (and per-tint variants, if submitting those too) under `data/themes/`, each with the `copyright`/`license`/`name`/`revision` metadata already present in this repo's files.
  3. Open a merge request against `master`, following the precedent in https://invent.kde.org/frameworks/syntax-highlighting/-/merge_requests/455: describe the theme, link the source project (`https://github.com/shythulu/DarkBerry`), and attach a preview screenshot per flavour in the MR description.
  4. Respond to review comments; the KDE Kate blog post on submissions warns against opening a tracking issue asking for a theme to be added — submit a working MR directly instead (https://kate-editor.org/post/2020/2020-09-18-submit-a-ksyntaxhighlighting-color-theme/).
- **Updates**: a follow-up merge request against the same file(s), bumping `revision` in the metadata — this is exactly how the Catppuccin themes were later tweaked (MR !476). Merged changes ship with the next KSyntaxHighlighting/Frameworks release; there is no separate re-publish step.
- **Contacts**: issue tracker https://invent.kde.org/frameworks/syntax-highlighting/-/issues ; Kate Matrix room https://go.kde.org/matrix/#/%23kate:kde.org (bridged to IRC `#kate`); Kate section of KDE Discuss https://discuss.kde.org ; bug tracker https://bugs.kde.org.
- **Sources**: GitLab API tree listing for `data/themes` and raw contents of `catppuccin-mocha.theme` (fetched 2026-09-24 via `invent.kde.org/api/v4/projects/frameworks%2Fsyntax-highlighting/...`); https://invent.kde.org/frameworks/syntax-highlighting/-/merge_requests/455 (fetched 2026-09-24, via API, description text quoted above); https://github.com/KDE/syntax-highlighting/blob/master/README.md (fetched 2026-09-24); https://kate-editor.org/post/2020/2020-09-18-submit-a-ksyntaxhighlighting-color-theme/ (fetched 2026-09-24); https://community.kde.org/Infrastructure/Get_a_Developer_Account (fetched 2026-09-24); https://kate-editor.org/support/ (fetched 2026-09-24, Matrix/Discuss/bug-tracker contacts).
- **Confidence**: verified. File format, naming, required metadata, licence rule and account requirement are all confirmed against the live repository and its own README/blog post; only the review turnaround time is unverified (no fixed SLA stated anywhere).

### KDE Store (store.kde.org, backed by Pling/OpenDesktop)

- **URL**: https://store.kde.org/browse?cat=472 (category "Kate", per search-result page titles "Kate - KDE Store" / "Browse Kate Latest"); upload form https://store.kde.org/product/add ; FAQ https://store.kde.org/faq-pling
- **Kind**: store — a secondary distribution point (KNewStuff-style "Get New" fetches this backend for some KDE apps, though Kate itself has no built-in "Get New Themes" action; a user would find this via web search or Discover, not from inside Kate).
- **Accepts**: a product page with title, description, category, licence field, one or more preview images, and the `.theme` file(s) attached (plain or archived). Exact preview-image pixel dimensions and the precise MIT licence-dropdown label are **unverified** — the site could not be rendered directly (see below).
- **Requirements**: free registration at store.kde.org/pling.com/opendesktop.org (shared backend/login) — no fee to list content; a separate, optional payout program exists per download/view but is not required. This account is distinct from the KDE Identity account used for invent.kde.org.
- **Steps** (assembled from a first-hand forum account, since the store's own pages could not be fetched — see Confidence):
  1. Register/sign in at store.kde.org.
  2. Go to https://store.kde.org/product/add.
  3. Fill the form: title (e.g. "Darkberry"), category "Kate" (cat 472) — or "Plasma Color Schemes" if "Kate" turns out not to accept `.theme` uploads at submission time, per one older report that no Kate-specific category existed yet — description, licence (MIT), source-code URL (`https://github.com/shythulu/DarkBerry`), tags.
  4. Upload preview image(s) — `ports/kate/assets/wisp.webp`, `fen.webp`, `mire.webp`, `blackwater.webp`, `preview.webp` are candidates; format may need converting from `.webp` if the uploader requires PNG/JPG (unverified).
  5. Attach the four `.theme` files as the downloadable content.
  6. Submit/publish.
- **Updates**: edit the same product page and upload a new file version.
- **Contacts**: the product page's own comment thread; general KDE Discuss https://discuss.kde.org; no dedicated store-support email found.
- **Sources**: web search result titles "Kate - KDE Store" / "Browse Kate Latest" for `store.kde.org/browse?cat=472` (2026-09-24, page itself returned an Anubis anti-bot "Access Denied" page on direct fetch, and its `robots.txt` disallows AI-agent user agents including `Claude-Code` and `anthropic-ai`, checked 2026-09-24, so it was not crawled further); https://store.kde.org/p/1195752/ search snippet, an older Kate/KWrite theme listed under "Plasma Color scheme" for lack of a Kate category at the time it was submitted (undated in the snippet); https://discuss.kde.org/t/how-to-upload-to-kde-store/36690 (fetched 2026-09-24).
- **Confidence**: partly verified. That a store listing route exists, is free, and roughly how the upload form works is corroborated by two independent sources; the existence and exact behaviour of a "Kate" category, and all preview-image/licence-field specifics, could not be directly observed and must be confirmed in a real browser before submitting (the site blocks both its Anubis bot-check and its own robots.txt against automated fetching by AI agents).

## Not applicable

- **kate-editor.org/themes/**: this page lists Kate's ~30 bundled themes, auto-generated from whatever ships inside KSyntaxHighlighting's `data/themes/`. It has no submission form of its own — a theme appears here only as a side effect of being merged into the framework repo above.
- **docs.kde.org katepart color-themes page**: purely a usage/how-to page (import/export via the GUI); it links back to kate-editor.org/themes/ for the bundled list and offers no community-theme index or submission path.

## Open questions

- Whose KDE Identity account opens the merge request against `frameworks/syntax-highlighting` — a personal `shythulu` GitLab-on-invent.kde.org account has to be created first if none exists.
- Whether to submit all four flavours in one merge request (as the Catppuccin precedent did) or one MR per flavour, and whether to submit the four tint sets too, or only the base Darkberry theme, to keep the framework's bundle from ballooning.
- Whose account registers on store.kde.org/pling.com, and whether to opt into its payout program.
- Whether "Kate" (cat 472) actually accepts `.theme` uploads, and the exact preview-image size/format the upload form wants — both unverified; confirm in-browser at submission time, since automated tools are blocked from the site by its own robots.txt and bot-check.
