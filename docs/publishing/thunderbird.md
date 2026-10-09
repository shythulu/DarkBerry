# Publishing the Thunderbird port

`ports/thunderbird/<flavour>/` (Wisp, Fen, Mire, Blackwater) holds a WebExtension static
theme (manifest v2, `theme.colors`) plus a `theme_experiment` block and its stylesheet,
`theme.css`. `package.sh` zips the two files into one `.xpi` per flavour,
`ports/thunderbird/dist/darkberry-thunderbird-<flavour>-<version>.xpi`; the four tints
(`blueberry`, `cloudberry`, `crowberry`, `lingonberry`) repeat the same four flavours one
directory deeper and package as `<tint>-thunderbird-<flavour>-<version>.xpi`. Each manifest
carries its own ID, `<tint>-<flavour>-thunderbird@<tint>-theme`, and `strict_min_version`
128.0. Nothing has been submitted anywhere; the release attaches the unsigned `.xpi` files,
which Thunderbird installs without a signature.

## Venues

### addons.thunderbird.net (ATN)

- **URL**: https://addons.thunderbird.net/ (developer hub at
  https://addons.thunderbird.net/developers/)
- **Kind**: official gallery, Thunderbird's own add-on site, run by the Thunderbird project.
- **Accepts**: an `.xpi` of a Thunderbird theme. Whether ATN takes a theme that carries a
  `theme_experiment` block, and whether that sends it to manual rather than automated review,
  is unverified; the port needs the experiment for the folder pane, message list, Spaces
  toolbar and calendar, so a plain static theme would be a lesser port.
- **Fields**: Name (manifest `name`); Summary (manifest `description`, `<Name> for
  Thunderbird. <flavour line>`); Description; Category; Licence; Support; Homepage (manifest
  `homepage_url`); Version (manifest `version`); Icon; Screenshots. ATN's labels, limits and
  sizes for each are unverified; AMO's (`firefox.md`) are not assumed to carry over.
- **Add-ons**: `browser_specific_settings.gecko.id` and `strict_min_version` in the manifest,
  already set.
- **Requirements**: an ATN developer account; listing gives a signed file and update delivery
  to everyone who installed it. Account type, signing and review process unverified.
- **Steps** (per flavour; unverified against the live developer hub):
  1. `./package.sh`, take the flavour's `.xpi` from `ports/thunderbird/dist/`.
  2. Sign in to the developer hub and submit a new add-on, listed on the site.
  3. Upload the `.xpi`, fill the fields above, add a screenshot from
     `ports/thunderbird/assets/`.
  4. Publish, then repeat for the other three flavours.
- **Updates**: a new `.xpi` with a higher `version` per flavour. Thunderbird ignores a file
  whose version is not higher than the installed one, so a fix needs a version bump. No CI job
  exists for ATN; the `amo` job in `.github/workflows/release.yml` signs Firefox only.
- **Contacts**: repo issues at https://github.com/shythulu/DarkBerry/issues.
- **Sources**: `src/ports/thunderbird.json` and `package.sh` (repo, read 2026-10-09).
  `../AMO.md` and `firefox.md` cover addons.mozilla.org, not ATN, and give no ATN facts.
- **Confidence**: unverified. Only the repository side (files, IDs, packaging) is confirmed.
  Every ATN field, limit, licence choice and review rule needs a look in a browser before it is
  relied on.

## Not applicable

- **addons.mozilla.org** lists Firefox add-ons; the manifests here carry a
  `-thunderbird` ID and a Thunderbird-only `theme_experiment`, so AMO is not their venue.
  The Firefox port is listed there separately (`firefox.md`).

## Open questions

- Whether ATN accepts a theme with a `theme_experiment` block, and under what review.
- Which licence ATN offers themes. AMO offers themes only Creative Commons licences
  (`../AMO.md`); if ATN does the same, the MIT-to-CC choice recorded there applies here too.
- Scope: four listings for the default tint only, or twenty with the tints, as for Firefox.
- Whether to add an ATN signing job to `.github/workflows/release.yml`, the way the `amo` job
  signs Firefox, once the first listings exist.
- Whose account submits.
