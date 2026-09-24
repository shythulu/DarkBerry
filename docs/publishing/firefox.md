# Publishing the Firefox port

`ports/firefox/<flavour>/manifest.json` (Wisp, Fen, Mire, Blackwater) is a WebExtension
static theme (manifest v2, `theme.colors`), packaged by `package.sh` into one `.xpi` per
flavour; the four tints (`blueberry`, `cloudberry`, `crowberry`, `lingonberry`) repeat the
same four flavours one directory deeper, at `ports/firefox/<tint>/<flavour>/manifest.json`.

## Venues

### addons.mozilla.org (AMO)

- **URL**: https://addons.mozilla.org/ (submission at https://addons.mozilla.org/developers/)
- **Kind**: official gallery — the only Firefox theme store; "Firefox Color" and any other
  theme gallery are AMO listings, not separate venues (see Not applicable).
- **Accepts**: a `.zip`/`.xpi`/`.crx` up to 200 MB containing `manifest.json` with
  `browser_specific_settings.gecko.id`, `name`, `version`, `description`, `theme.colors`.
  AMO-side listing fields on submission: name, add-on URL slug, summary, full description,
  licence, up to 2 Firefox categories (+2 for Android), support email/website, homepage.
  Icon: 32x32 and 64x64 PNG/JPEG (SVG scales best). Screenshots: recommended 1280x800,
  1.6:1 ratio if using another size, PNG/JPEG, no hard limit on count. AMO also auto-generates
  a colour swatch preview from `theme.colors`, but an actual screenshot ranks better.
- **Requirements**: a Mozilla account (free); listed vs. self-distributed ("On this site" vs
  "On your own") chosen per add-on — this project uses listed, which is what gets Mozilla
  signing and auto-updates; automated review, usually live within minutes for themes since
  they carry no executable code; API credentials (JWT issuer + secret, one-time, secret shown
  once) for the JWT auth `web-ext sign` uses, from the same developer account, no separate fee.
- **Steps** (per flavour, first submission only — already done for Wisp/Fen/Mire/Blackwater
  per `docs/AMO.md`): 1. `./package.sh`, take the flavour's `.xpi` from `dist/`. 2. Sign in,
  open the developer hub. 3. *Submit a New Add-on* > "On this site". 4. Upload the `.xpi`.
  5. Set category (Appearance), licence (MIT), homepage, summary, screenshot. 6. Publish.
- **Updates**: CI only — the `amo` job in `.github/workflows/release.yml` runs
  `web-ext sign --channel listed --api-key … --api-secret …` per flavour on every tagged
  release once `AMO_JWT_ISSUER`/`AMO_JWT_SECRET` repo secrets exist; AMO rejects a version
  number it has already seen, so a botched release needs a version bump, not a retry.
- **Contacts**: repo issues at https://github.com/shythulu/DarkBerry/issues; AMO's own
  developer support/review queue has no public issue tracker, only the developer hub.
- **Sources**: `/Users/shylo/dev/DarkBerry/docs/AMO.md` and
  `/Users/shylo/dev/DarkBerry/.github/workflows/release.yml` (repo, read 2026-09-24);
  https://github.com/mozilla/extension-workshop/blob/master/src/content/documentation/publish/submitting-an-add-on.md
  (fetched 2026-09-24); https://extensionworkshop.com/documentation/develop/create-an-appealing-listing/
  (fetched 2026-09-24, icon/screenshot sizes).
- **Confidence**: verified for everything already in `docs/AMO.md`/the workflow; icon and
  screenshot pixel sizes verified against Mozilla's own Extension Workshop docs today.

### Zen Browser Mods (theme-store)

- **URL**: https://www.zen-browser.app/mods (marketplace); submissions via
  https://github.com/zen-browser/theme-store (issue-driven)
- **Kind**: community repo / store, specific to the Zen Browser fork of Firefox.
- **Accepts**: an issue titled `[create-theme]: <theme-name>` filled from a template with a
  600x400 PNG screenshot, a README describing the mod, and a JSON preferences block if the
  theme exposes options. Name must be unique and under 25 characters, description under 100.
  Whether it accepts a Firefox WebExtension static theme (`manifest.json`/`theme.colors`) as
  submitted, or wants Zen's own mod format instead, could not be confirmed from the docs or
  repo README fetched — Zen mods are commonly userChrome.css-based customisations, which is a
  different mechanism from a WebExtension theme, so the two are not obviously interchangeable.
- **Requirements**: no account beyond a GitHub account to open the issue; mod must be
  open source; all themes in the repo are put under CC BY-NC-SA 4.0 by submitting, which
  conflicts with Darkberry's MIT licence unless dual-licensing this port specifically is
  acceptable — that is a licensing decision, not a technical one.
- **Steps**: 1. Open a `[create-theme]` issue on `zen-browser/theme-store` with the template
  filled in. 2. A bot validates and opens a PR with generated files/folders. 3. Maintainers
  merge. (Exact generated file format not confirmed — see above.)
- **Updates**: open a new PR with the theme name in the title; the bot updates the existing
  files and merges to main directly (no re-review process described).
- **Contacts**: https://github.com/zen-browser/theme-store/issues
- **Sources**: https://docs.zen-browser.app/themes-store/themes-marketplace,
  https://docs.zen-browser.app/themes-store/themes-marketplace-submission-guidelines,
  https://github.com/zen-browser/theme-store (all fetched 2026-09-24).
- **Confidence**: partly verified — submission process, name/description limits and
  screenshot size are from Zen's own docs; unverified whether it wants a WebExtension
  `manifest.json` theme or a different mod format, and whether MIT and the repo's CC
  BY-NC-SA requirement can coexist for one submission.

## Not applicable

- **Firefox Color** — was Mozilla's own GUI theme *builder* extension (Test Pilot era), not a
  separate submission venue; it produces themes for a user's own browser, not a store, and
  hasn't shipped updates in years. Checked: https://addons.mozilla.org/en-US/firefox/addon/firefox-color/
  and its version history (fetched 2026-09-24, last release info visible there).
- **A separate "Firefox themes gallery"** — the themes category at
  https://addons.mozilla.org/en-US/firefox/themes/ is AMO itself, filtered by type; not a
  distinct venue from the AMO section above.
- **Floorp** — no separate theme store; its own docs say themes come from
  addons.mozilla.org like any other Firefox add-on. Checked:
  https://docs.floorp.app/docs/features/interface-and-themes/ (fetched 2026-09-24).
- **LibreWolf, Waterfox** — both distribute their own branded themes as ordinary AMO
  listings, not through a fork-specific store. Checked via AMO search results for each
  browser's theme listings (fetched 2026-09-24); no dedicated store found for either.

## Open questions

- Whether the four tints (`blueberry`/`cloudberry`/`crowberry`/`lingonberry`, 16 more
  flavour+tint manifests) should also get their own AMO listings. As written, the `amo` job
  loops every `ports/firefox/*/` directory including the tint folders, but a tint folder has
  no `manifest.json` at that level (it's one level deeper, per flavour) — `web-ext sign` on a
  tint directory would fail. Confirm intentionally whether tints stay AMO-listed at all
  before relying on that job, and if they should be, someone needs to do 16 one-time manual
  submissions first (new add-on IDs) the same way the four base flavours were done.
- Whether to pursue Zen Browser's mod store despite the unresolved format and licence
  questions above — needs a human to read `zen-browser/theme-store`'s actual example
  submission (not just its docs) to see whether a WebExtension `manifest.json` is accepted
  as-is, and to decide whether MIT + the store's CC BY-NC-SA requirement is acceptable.
- Whose Mozilla developer account and Zen GitHub account submissions go through (same AMO
  account already used for the base flavours, presumably; unconfirmed for Zen).
