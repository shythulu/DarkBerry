# Publishing the Chrome port

`ports/chrome/<Flavour>/manifest.json` (Darkberry Wisp/Fen/Mire/Blackwater) is a Manifest V3
Chrome theme extension (`theme.colors`, no code or permissions); the four tints repeat the
same four flavours one directory deeper, at `ports/chrome/<tint>/<Flavour>/manifest.json`,
giving up to 20 near-identical items. No packaging script currently zips a flavour on its own
for a store upload — the release workflow only zips the whole `ports/chrome` tree for manual
"Load unpacked" installs.

## Venues

### Chrome Web Store

- **URL**: https://chromewebstore.google.com/ (dashboard at
  https://chrome.google.com/webstore/devconsole)
- **Kind**: official gallery / store — the only distribution channel Chrome itself offers.
- **Accepts**: a `.zip` (max 2 GB) of one flavour's `manifest.json` + assets, uploaded as a
  separate item per flavour (repetitive-content policy — see Open questions — makes "one item
  per colour variant" risky, but is how most existing colour-family themes are structured
  anyway). Required images: 128x128 PNG store icon; at least one screenshot at 1280x800 or
  640x400 (max 5), full-bleed, no padding/border; 440x280 PNG/JPEG small promo tile. Optional:
  1400x560 marquee promo tile, YouTube video. Listing fields: detailed description, category,
  language, and a mandatory Privacy tab (single-purpose description, permission justification,
  remote-code declaration, data-usage certification) even though a static theme requests no
  permissions and collects no data.
- **Requirements**: a Google account with 2-Step Verification turned on — mandatory before any
  publish or update; a one-time developer registration fee per account (widely reported as
  US$5, but the exact figure is shown at payment time in the dashboard, not stated on the
  docs page itself — treat the amount as unverified); review before the item goes live
  (themes are lower-risk than code-bearing extensions but not exempt from review).
- **Steps**: 1. Register the developer account once and pay the fee at the dashboard link
  above; enable 2-Step Verification on that Google account first. 2. Zip one flavour's
  `manifest.json` and its assets. 3. Dashboard → *New Item* → upload the zip. 4. Fill Store
  Listing (description, category, language, icon, ≥1 screenshot, small promo tile).
  5. Fill the Privacy tab (single purpose, no permissions/remote code, no data collected).
  6. Set Distribution (visibility, regions). 7. Submit for review (or stage for deferred
  publish). 8. Repeat per flavour — and per tint, if those are also submitted.
- **Updates**: upload a new package with an incremented `manifest.json` version to the same
  item via the dashboard (or the Chrome Web Store Publish API for automation); goes through
  review again. No CI job exists for this yet, unlike the Firefox `amo` job in
  `.github/workflows/release.yml`.
- **Contacts**: repo issues at https://github.com/shythulu/DarkBerry/issues; Google has no
  per-item human contact — only the review-appeal flow, the developer support ticket form, and
  the community group at https://groups.google.com/a/chromium.org/g/chromium-extensions.
- **Sources**: https://developer.chrome.com/docs/webstore/register (fetched 2026-09-24, fee
  amount not stated); https://developer.chrome.com/docs/webstore/images (fetched 2026-09-24,
  icon/screenshot/promo sizes); https://developer.chrome.com/docs/webstore/cws-dashboard-listing
  (fetched 2026-09-24, listing fields); https://developer.chrome.com/docs/webstore/publish
  (fetched 2026-09-24, zip/size limit, review flow); https://developer.chrome.com/docs/webstore/program-policies/two-step-verification
  (fetched 2026-09-24, 2SV mandatory); https://developer.chrome.com/docs/webstore/program-policies/spam-faq/
  (fetched 2026-09-24, repetitive-content wording).
- **Confidence**: partly verified — every field, size and process step above is confirmed on
  developer.chrome.com; the exact fee amount is unverified against a primary source (only
  secondary reporting gives "$5 USD one-time").

### Microsoft Edge Add-ons

- **URL**: https://microsoftedge.microsoft.com/addons (submission via Partner Center at
  https://partner.microsoft.com/dashboard/microsoftedge)
- **Kind**: official gallery / store — themes are curated in the same catalogue as extensions,
  not a separate section with different rules.
- **Accepts**: the same Manifest V3 `theme.colors` file Chrome uses, since Edge is Chromium-
  based and documents extension code/manifest keys as directly compatible; the only required
  change is dropping any `update_url` (not present here) and rebranding "Chrome" wording used
  in the name or description — Darkberry's Chrome manifests currently say "Darkberry for
  Chrome and Edge" in `description`, which Edge's own porting guide says must be changed to
  reference Microsoft Edge to pass certification. Upload is a `.zip` per flavour. Per-language
  listing fields: description (250–10,000 characters, required — the manifest's short
  description is too short and needs expanding in Partner Center); extension logo (1:1,
  recommended 300x300, minimum 128x128, required); small promo tile 440x280 (optional); large
  promo tile 1400x560 (optional); up to 6 screenshots at 640x480 or 1280x800 (optional);
  category (required); privacy declarations as below.
- **Requirements**: free registration, no fee; a Partner Center account with a Microsoft
  Account (MSA, or GitHub sign-in that creates one) as Primary Owner, individual or company
  type — individual verification is quick (name-availability check), company verification can
  take days to weeks; Developer Agreement acceptance; a Privacy page per item declaring single
  purpose, permission justifications, whether remote code is used (no), data-usage
  certification, and a privacy policy URL only if user data is collected (a colour-only theme
  should need none); certification review takes up to 7 business days.
- **Steps**: 1. Register/verify a Partner Center Edge developer account (MSA-backed).
  2. Partner Center → *Create new extension* → upload the flavour's zip. 3. Availability
  (Public/Hidden, markets). 4. Properties (category, website, support contact). 5. Privacy
  (single purpose, no permissions/remote code, no data collected). 6. Store listing per
  language (name and short description are read from the manifest and are read-only here;
  fill description ≥250 characters, logo, optional screenshots/tiles). 7. Submit with
  certification notes. 8. Wait up to 7 business days. Repeat per flavour — and per tint, if
  submitted.
- **Updates**: upload a new package with an incremented manifest version on the Packages page
  of the same extension entry, then resubmit; goes through certification again. No CI
  automation exists for this yet.
- **Contacts**: repo issues; Edge's own support ticket form at
  https://support.microsoft.com/supportrequestform/e7a381be-9c9a-fafb-ed76-262bc93fd9e4 and
  the contact page linked from the docs below.
- **Sources**: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
  (fetched 2026-09-24, steps and field sizes); https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account
  (fetched 2026-09-24, "There is no registration fee..."); https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension
  (fetched 2026-09-24, rebranding requirement).
- **Confidence**: verified against Microsoft's own docs for fee, steps and field sizes;
  unverified whether Edge's review applies anything like Chrome's repetitive-content policy to
  4 or 20 near-identical colour-variant items — no equivalent example was found in Edge's
  developer policies.

## Not applicable

- **Brave** — no separate extension or theme store; Brave's own support content directs users
  to the Chrome Web Store for themes and is Chromium-compatible with the same packages.
  Checked brave.com support content and Chrome Web Store listings branded "for Brave"
  (fetched 2026-09-24); the Chrome Web Store entry above is Brave's distribution too.
- **Vivaldi (themes.vivaldi.net)** — has its own gallery, but Vivaldi's theme format is a
  proprietary JSON file (plus an optional background image) exported from Settings > Themes >
  Library, not a Chrome `manifest.json`; Darkberry's Chrome theme file cannot be uploaded there
  as-is. Checked https://help.vivaldi.com/desktop/appearance-customization/shareable-vivaldi-themes/
  (fetched 2026-09-24) — the exact JSON schema isn't published, so whether a faithful
  conversion from the palette is even feasible is unverified. Separately, since Vivaldi is
  Chromium-based, a user can load the Chrome-format theme folder unpacked via developer mode,
  same as Chrome/Edge — that is not a gallery listing, just local install.
- **Opera Add-ons (addons.opera.com)** — publishing docs describe an "Upload Extensions form"
  and Opera's help pages mention extensions that "give it a new look," but a live search at
  https://addons.opera.com/en/search/?type=themes returned no results and the site nav has no
  themes category, only Extensions and Wallpapers. Checked that URL and
  https://help.opera.com/en/extensions/publishing-guidelines/ (fetched 2026-09-24) — could not
  confirm a working, browsable themes section exists today; this is marked unverified rather
  than a confirmed non-venue.

## Open questions

- Chrome's spam policy names "multiple extensions which merely provide different wallpapers"
  as a repetitive-content violation that should be one item. Darkberry Chrome is 4 flavours ×
  5 palettes (Darkberry plus 4 tints) = up to 20 near-identical items. A human needs to decide
  before submitting anything: list only the 4 base Darkberry flavours (still some risk), list
  all 20, or build a single item with an in-extension flavour picker (not straightforward for
  a declarative MV3 theme — would need a background service worker swapping the applied theme,
  a real architecture change to this port).
- Whether the 4 tints get listed on either store at all, independent of the policy question
  above — mirrors the same open question already raised in `docs/publishing/firefox.md`.
- Whose Google account (2-Step Verification required, pays the one-time fee) and whose
  Microsoft/Partner Center account (individual vs. company) submissions go through.
- The Edge rebranding requirement: current manifests' `description` says "Darkberry for
  Chrome and Edge." Decide whether to edit that string per build target or leave the manifest
  alone and only change the listing text entered directly in Partner Center.
