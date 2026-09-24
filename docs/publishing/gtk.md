# Publishing the GTK 3 port

`ports/gtk/<Darkberry Flavour>/gtk-3.0/gtk.css` (four flavours) plus `ports/gtk/<tint>/<Darkberry
Flavour>/gtk-3.0/gtk.css` (tints) hold one GTK 3 theme folder per flavour that `@import`s Adwaita
and recolours it via CSS; a user copies a flavour folder into `~/.themes/` and selects it. There is
no build/package step — the folder itself is the installable unit.

## Venues

### gnome-look.org (Pling / OpenDesktop network) — "GTK3/4 Themes"

- **URL**: https://www.gnome-look.org/browse?cat=135&ord=latest (category page, confirmed live
  with GTK3/4 theme listings). Uploading is done via the shared Pling account, not a
  gnome-look.org-specific form: an upload to category 135 on `pling.com` (or any sibling site)
  surfaces automatically on `gnome-look.org`'s matching category, per a moderator reply in the
  forum thread cited below. Account pages: https://www.pling.com/register,
  https://www.pling.com/login (`www.pling.com/u/account` redirects to
  `www.opendesktop.org/u/account`, confirming pling.com/opendesktop.org/gnome-look.org share one
  account/content system).
- **Kind**: official/dominant community gallery — this is the de facto GNOME/GTK theme store (also
  branded OpenDesktop.org and, for KDE, store.kde.org) that GNOME Tweaks-adjacent tooling and most
  "download a GTK theme" links point to.
- **Accepts**: a product entry per theme with a title, a rich-text/BBCode-style description, a
  **Source** field (link to a git repo or the original work being adapted — present on every
  product page checked), one or more preview images, a downloadable content file (themes are
  typically a `.tar.gz`/`.zip` of the installable `~/.themes/<name>/` folder), and a licence field:
  confirmed MIT-licensed content already exists in this exact category (e.g. "Apex Limine Theme",
  https://www.gnome-look.org/p/2345086, listed as "MIT License, version v1.0"), so MIT is an
  accepted licence choice, not just GPL/CC as the general Pling marketing copy implies. Exact
  preview-image pixel dimensions and file-size/format limits could not be confirmed — the upload
  form itself sits behind login and an anti-bot challenge (see Confidence).
- **Requirements**: a free Pling/OpenDesktop account (register at pling.com; login also offers
  GitHub OAuth per the login page's "for old GitHub login" note); registration requires agreeing
  to Terms of Service and a privacy policy (checkbox on the register page; exact ToS text was not
  reachable — see Confidence). No fee. No signing key. Moderation exists (comments/ratings are
  public, "All contributors are responsible for their uploads" appears in every page footer) but
  no pre-publish review gate was documented.
- **Steps** (as far as verified without an authenticated session):
  1. Register/log in at https://www.pling.com (shared across the whole OpenDesktop network).
  2. Start a new product/content submission in category "GTK3/4 Themes" (id 135) — the exact
     "Add content" URL/button could not be reached (see Confidence); it is reachable from the
     account menu once logged in, per the forum thread
     https://forum.opendesktop.org/t/how-to-upload-grub-theme-to-gnome-look-org/18168.
  3. Fill in title, description, Source (link to https://github.com/shythulu/DarkBerry), licence
     (MIT), and upload preview image(s) plus the packaged theme file(s) — one product per flavour,
     or one product covering all four with flavour folders inside one archive, is a judgement call
     (see Open questions).
  4. Publish.
- **Updates**: edit the existing product entry and upload a new version/file; the network re-shows
  the update on all sibling sites (gnome-look.org, opendesktop.org, pling.com) automatically, per
  the same category-sharing behaviour noted above.
- **Contacts**: community forum at https://forum.opendesktop.org (category
  https://forum.opendesktop.org/c/pling/16 for Pling-specific questions); no dedicated support
  email found.
- **Sources**: https://www.gnome-look.org/browse?cat=135&ord=latest (crawled via a
  JS-capable/stealth fetch, 2026-09-24, listing live GTK3/4 themes); an existing product page
  https://www.gnome-look.org/p/2363855/ (crawled 2026-09-24, showing the Source/description/credit
  fields); https://www.gnome-look.org/p/2345086 (found via web search 2026-09-24, MIT licence
  confirmed in its title/summary text); https://www.pling.com/register and
  https://www.pling.com/login (crawled 2026-09-24);
  https://forum.opendesktop.org/t/how-to-upload-grub-theme-to-gnome-look-org/18168 (fetched
  2026-09-24).
- **Confidence**: partly verified. The category, its liveness, MIT-licence acceptance, and the
  shared-account/shared-category mechanism are confirmed from live pages. gnome-look.org and
  opendesktop.org run an anti-bot challenge (Anubis) that blocked plain fetches of the home page,
  the terms page, and any guessed "add content" URL (`/content/add`, `/content/add?catid=135`) —
  a stealth headless-browser fetch got through to some pages but was rate-limited after several
  requests. Unverified: exact "Add content" URL/menu path once logged in, exact preview-image
  size/format limits, exact ToS wording, and whether a per-flavour or one-bundle submission is
  the house norm on this category.

### Curated GTK/GNOME "awesome" lists

- **URL**: https://github.com/valpackett/awesome-gtk and https://github.com/Kazhnuz/awesome-gnome
- **Kind**: community repo (curated README list)
- **Accepts**: N/A for this port — see Not applicable below.
- **Requirements / Steps / Updates / Contacts**: N/A.
- **Sources**: raw READMEs of both repos fetched 2026-09-24.
- **Confidence**: verified (both READMEs read directly) that neither list has a GTK-app-theme
  section — see Not applicable.

## Not applicable

- **GNOME Extensions (extensions.gnome.org)**: hosts GNOME Shell JavaScript extensions only, not
  GTK application themes. Confirmed by a web search turning up items like "GTK3 Theme Switcher"
  and "Legacy (GTK3) Theme Scheme Auto Switcher" — these are *extensions that switch which GTK
  theme is active*, not theme files themselves, and extensions.gnome.org has no theme-upload path.
- **GNOME Software (as an app-store listing)**: GNOME Software surfaces AppStream-catalogued
  Flatpaks/packages, not raw `~/.themes/` folders; there is no "GTK theme" content type in it.
  Checked 2026-09-24, no separate submission path found beyond the Flathub route above.
- **awesome-gtk** (https://github.com/valpackett/awesome-gtk): explicitly about GTK *applications*,
  not themes, and its README carries a "Distros: Please do not theme any apps" badge linking to
  stopthemingmy.app — a stance against third-party GTK theming. Confirmed no themes/theming
  section in the raw README, fetched 2026-09-24.
- **awesome-gnome** (https://github.com/Kazhnuz/awesome-gnome): "Look and Feel" only lists Icons,
  Cursors, and "Themes for non-GTK apps" (e.g. Firefox, Steam skins) — no section for GTK
  application themes like Darkberry. Confirmed via raw README, fetched 2026-09-24.

## Open questions

- Whether to submit one gnome-look.org product per flavour (four products) or one product with
  all four flavour folders in a single archive — the category page shows both patterns in the
  wild; a submitting agent (or shylo) should pick one and stay consistent with how the site/vscode
  ports are listed elsewhere.
- Whether tints (`ports/gtk/<tint>/`) get their own gnome-look.org product(s) or are folded into
  the flavour listing's description/screenshots as a bonus — not decided here.
- Whose Pling/pling.com account to use (a personal account vs. a project account under
  "shythulu") — no existing account was found or created during this research.
- The exact "Add content" flow, required preview-image dimensions, and full Terms of Service text
  need a human (or an authenticated, anti-bot-tolerant session) to confirm before first submission,
  since gnome-look.org/opendesktop.org actively block automated fetches on several pages.
- Consider a Flathub `org.gtk.Gtk3theme.<name>` extension only if Darkberry needs to reach
  Flatpak-sandboxed GTK apps specifically (confirmed real and current via
  https://docs.flathub.org/docs/for-app-authors/submission, fetched 2026-09-24: submit via a PR
  against the `new-pr` branch of github.com/flathub/flathub, 2FA required after approval, no
  re-review needed for updates) — left out of Venues above as a narrower, opt-in case rather than
  a general listing venue, since it only helps themed apps running inside Flatpak sandboxes.
