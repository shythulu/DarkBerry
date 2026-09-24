# Publishing the GIMP port

Port folder `ports/gimp/` ships one `gimp-dark.css` (or `gimp-light.css` for Wisp) per flavour, plus tint sub-folders (`ports/gimp/<tint>/`), each an MIT-licensed drop-in replacement for a copy of GIMP's `Default` theme CSS that the user places under `~/.config/GIMP/<version>/themes/`. The port ships no GIMP-authored (GPL-3) files itself — its CSS only `@import`s the user's own local copy of GIMP's GPL-3 `common.css` / `System/gimp.css`.

## Venues

### gnome-look.org (Pling network)
- **URL**: https://www.gnome-look.org/browse?cat=268 (GIMP Themes category; the same listing mirrors to https://pling.com and https://www.opendesktop.org, which share one account and category system)
- **Kind**: community gallery — the closest thing to a de facto standard theme storefront for this kind of content, but not run by the GIMP project
- **Accepts**: GIMP theme packages; the category exists and is populated ("Browse Gimp Themes Latest")
- **Requirements**: free Pling/openDesktop account (registration is network-wide, one account covers all sub-sites); each upload needs a license tag, and MIT is a recognised value on the network (`pling.com/find/?lic=mit-license` is a real, working filter)
- **Steps** (reconstructed from other uploaders' reports, not confirmed on this exact category page — see Confidence):
  1. Register/log in at pling.com.
  2. Use the site's product-creation ("Add content") flow; uploading to Pling under a category surfaces the listing on the matching sub-site (e.g. GIMP Themes shows on gnome-look.org).
  3. Pick category "GIMP Themes" (cat 268).
  4. Fill in title, description, screenshots, license (MIT), and attach an archive or link to the GitHub release.
  5. Submit — other users report listings appear without manual review, but this was not confirmed for this category.
- **Updates**: edit the same product page and upload a new file version (network-wide pattern, not confirmed for this category specifically).
- **Contacts**: forum.opendesktop.org "Products" board for support; no maintainer email found.
- **Sources**: https://www.gnome-look.org/browse?cat=268 (2026-09-24, title/category confirmed via search index only — the page itself served an Anubis bot-check to automated fetch); https://forum.opendesktop.org/t/how-to-upload-grub-theme-to-gnome-look-org/18168 (2026-09-24); https://pling.com/find/?lic=mit-license (2026-09-24)
- **Confidence**: partly verified — category's existence and name confirmed; exact upload form fields and any review step could not be directly verified because gnome-look.org, pling.com and opendesktop.org all returned an Anubis bot-check page instead of content to automated fetches on 2026-09-24.

### GIMP Chat forum (gimpchat.com)
- **URL**: https://gimpchat.com/
- **Kind**: community repo — a general GIMP help/showcase forum, not a dedicated theme catalog
- **Accepts**: theme sharing happens informally inside forum threads (e.g. "GIMP Themes - Getting Started", posted under the "Gimp Help" subforum, `f=8`); there is no separate curated theme board
- **Requirements**: free forum registration (Register/Login on every page)
- **Steps**:
  1. Register an account.
  2. Start a new topic (no dedicated theme board exists; past theme threads sit in "Gimp Help").
  3. Post a description, screenshots, and a link to the GitHub repo/release.
  4. Answer questions in-thread.
- **Updates**: reply in the same thread announcing new versions, or edit the first post.
- **Contacts**: forum moderators only; no dedicated theme-submission contact found.
- **Sources**: https://gimpchat.com/viewtopic.php?f=23&t=10531 (2026-09-24); https://gimpchat.com/viewtopic.php?f=8&t=1469 (2026-09-24)
- **Confidence**: partly verified — forum and registration requirement confirmed directly; there is no formal submission process to verify beyond that, since none exists (posting is informal).

### pixls.us community forum (discuss.pixls.us)
- **URL**: https://discuss.pixls.us/c/software/gimp/24
- **Kind**: community repo — a Discourse forum for Free/Open-Source photography and imaging tools, not run by the GIMP project
- **Accepts**: finished GIMP themes posted as new topics in the GIMP category; live examples found: "A new neutral grey theme for GIMP 3", "HyperflatGraphite: a new dark theme for GIMP 3.x", "GIMP 'Dracula' inspired theme"
- **Requirements**: free Discourse account; content must be the poster's own work or permitted ("You may not post anything digital that belongs to someone else without permission"); no AI-generated filler content per site guidelines
- **Steps**:
  1. Register/log in at discuss.pixls.us.
  2. Create a new topic in Software > GIMP (https://discuss.pixls.us/c/software/gimp/24).
  3. Title it clearly, following the pattern of comparable topics ("<Name>: a new theme for GIMP 3").
  4. Include description, screenshots, license (MIT for the CSS; note that it imports the user's own local copy of GIMP's GPL-3 CSS and redistributes nothing GPL), and a link to the GitHub repo/release/site.
  5. Respond to replies in-thread.
- **Updates**: reply in the same topic announcing new versions/tints, or edit the first post.
- **Contacts**: forum moderators via the site; guidelines at https://discuss.pixls.us/guidelines; no maintainer email found.
- **Sources**: https://discuss.pixls.us/c/software/gimp/24 (2026-09-24); https://discuss.pixls.us/t/a-new-neutral-grey-theme-for-gimp-3/56244 (2026-09-24); https://discuss.pixls.us/t/hyperflatgraphite-a-new-dark-theme-for-gimp-3-x/56763 (2026-09-24); https://discuss.pixls.us/guidelines (2026-09-24)
- **Confidence**: verified for the venue and pattern of use (several live, directly comparable postings); exact registration mechanics (e.g. SSO options) unverified.

### GitHub topic tags and curated lists
- **URL**: https://github.com/topics/gimp-theme and https://github.com/topics/gimp-themes; example list: https://github.com/marekpistorius/awesome-gimp
- **Kind**: curated list / discovery tag, not a gallery
- **Accepts**: any public GitHub repo tagged with the topic; awesome-gimp accepts entries by pull request ("Contributions are always welcome!" plus a CONTRIBUTING.md)
- **Requirements**: public GitHub repo (already have one); a GitHub account to open a PR against awesome-gimp
- **Steps**:
  1. Add `gimp-theme`, `gimp-themes`, `gimp3` and `gimp` as GitHub topics on shythulu/DarkBerry for discoverability.
  2. Fork marekpistorius/awesome-gimp (or Ditectrev/awesome-gimp), and add an entry per its CONTRIBUTING.md.
  3. Open a pull request.
- **Updates**: none needed beyond keeping the GitHub repo/README current — the list only links out.
- **Contacts**: repo maintainers via GitHub issue/PR review.
- **Sources**: https://github.com/topics/gimp-theme (2026-09-24, confirmed populated with 4 repos); https://github.com/marekpistorius/awesome-gimp (2026-09-24)
- **Confidence**: partly verified — topic pages and awesome-gimp's general PR-based contribution model confirmed; the exact CONTRIBUTING.md wording and whether a dedicated "Themes" section exists were not read in full (unverified).

## Not applicable

- **GIMP upstream (gimp.org / developer.gimp.org)** — no submission or hosting mechanism for third-party themes. developer.gimp.org states GIMP "welcome[s] third-party made themes" but only ships and documents its own Dark/Gray/Light/System themes; no directory, upload form, or review process exists.
- **registry.gimp.org** — retired by the GIMP project (old Drupal install, no maintainer stepped up) and never replaced with an equivalent site.
- **A `.gex` extension store / extensions.gimp.org** — GIMP 3.0 added the `.gex` extension wrapper format (can bundle themes) with stated "plans for a new online infrastructure" for browsing/uploading extensions, but no such site is live: `extensions.gimp.org` does not resolve (checked 2026-09-24).
- **GIMP's own docs pages** (developer.gimp.org/core/specifications/theme/, docs.gimp.org preference pages) — documentation only, not a listing venue.

## Open questions

- Whether to register on gnome-look.org/Pling at all, given the account and upload flow could not be directly exercised (Anubis bot-check blocked automated verification), and whether its single license-tag field can just be set to MIT since the port redistributes no GPL files, only an MIT CSS that imports the user's own local GIMP install.
- Which gimpchat.com subforum to post in — no dedicated "finished themes" board was found, only ad hoc threads under general help/showcase areas.
- Whether submitting to awesome-gimp-style lists is worth the effort, given they read as unmoderated, low-traffic personal lists rather than something GIMP users are known to browse.
- A submitting agent (or a human) will need a real browser session for gnome-look.org/pling.com/opendesktop.org, since all three served an Anubis bot-check to automated fetches during this research and the exact upload form fields remain unconfirmed.
