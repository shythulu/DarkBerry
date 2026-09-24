# Publishing the Nimbalyst port

`ports/nimbalyst/<Darkberry Flavour>/theme.json` holds one flat object per flavour (`id`,
`name`, `version`, `author`, `description`, `isDark`, `colors`, `tags`); Nimbalyst's own
extension system instead expects a `manifest.json` with those same theme fields nested under
`contributions.themes[]`, so the port's files need repackaging before any of the venues below
will accept them.

## Venues

### Nimbalyst GitHub-URL install (marketplace's "install from source")

- **URL**: in-app only — Settings → Extensions → Marketplace, paste a GitHub repo URL at the
  bottom of the discover pane. No web URL to submit to.
- **Kind**: official, but self-hosted (the repo you point at is the distribution).
- **Accepts**: a git repository whose root (or a folder within it) has a valid
  `manifest.json`. Required manifest fields: `id` (reverse-domain string, e.g.
  `com.shythulu.darkberry-wisp`), `name`, `version` (semver). `main` may be omitted for a
  "manifest-only" theme extension (no JS/build step) — confirmed by the real
  `packages/extensions/example-theme` fixture in the Nimbalyst repo, which ships only a
  `manifest.json`. Optional top-level: `description`, `author`, `styles`, `apiVersion`,
  `requiredReleaseChannel`, `defaultEnabled`, `permissions`. Themes go under
  `contributions.themes[]`, each with `id`, `name`, `isDark` (boolean), `colors` (partial
  override map keyed like `bg`, `bg-secondary`, `text`, `primary`, `link`, `success`,
  `warning`, `error`, `info`, plus optional domain-specific keys such as `code-*`,
  `terminal-*`, `diff-*`; missing domain colors are auto-derived). Theme IDs are namespaced at
  runtime as `extensionId:themeId`. No documented preview-image field or size for themes
  specifically (the Marketplace pane shows "screenshots" for extensions generally, but the
  manifest reference does not name a field for supplying one). No `license` field is
  documented; MIT can only go in a repo `LICENSE` file and the free-text `description`.
- **Requirements**: none — no account, no fee, no signing, no review. Anyone with the repo URL
  can install it. (This is explicitly the fallback path: docs say "the extensions marketplace
  is still a bit underpopulated," which is why the URL-paste exists.)
- **Steps**:
  1. Restructure each flavour's `theme.json` into a `manifest.json`: top-level `id`
     (`com.shythulu.darkberry-<flavour>` or one manifest with all four flavours under one
     `contributions.themes[]` array — undecided, see Open questions), `name`, `version`,
     `author`, `description`; move `isDark`/`colors` into a `contributions.themes[]` entry.
  2. Commit the manifest(s) to a public GitHub repo (this repo already is one).
  3. In Nimbalyst, open Settings → Extensions → Marketplace, scroll to the bottom, paste the
     repo URL (or a subfolder URL, unconfirmed which the field accepts) and install.
- **Updates**: unconfirmed — the docs don't say whether re-pasting the URL re-pulls the repo,
  or whether the user must reinstall for each new `version`. No push mechanism was found.
- **Contacts**: repo issues at https://github.com/Nimbalyst/nimbalyst/issues; Discord
  https://discord.gg/FgD9S2MCYB.
- **Sources**: https://docs.nimbalyst.com/extensions/extension-system-and-marketplace (fetched
  2026-09-24, quote: "you can paste a GitHub repository URL to install any extension directly
  from source" / "The repository must contain a valid `manifest.json` file"); manifest schema
  from https://docs.nimbalyst.com/extensions/building-extensions/manifest-reference (fetched
  2026-09-24) and https://raw.githubusercontent.com/nimbalyst/nimbalyst/main/docs/EXTENSION_THEMING.md
  (fetched 2026-09-24); example fixture at
  https://github.com/nimbalyst/nimbalyst/tree/main/packages/extensions/example-theme (fetched
  2026-09-24).
- **Confidence**: partly verified. Manifest shape and the paste-URL mechanic are confirmed
  from primary docs and a real fixture in the app's own repo; preview-image requirements,
  update behaviour, and whether a subfolder URL works are unverified.

### Nimbalyst Extension Marketplace (in-app catalog, nimbalyst.com/extensions)

- **URL**: https://nimbalyst.com/extensions/ (public listing/preview of the catalog); the
  actual install surface is in-app at Settings → Extensions → Marketplace.
- **Kind**: official gallery.
- **Accepts**: same manifest/theme format as above (the catalog is populated from extensions
  that went through some publication step — see below).
- **Requirements**: unverified. No developer account signup, submission form, CLI, fee,
  signing key, or review process is documented anywhere checked (docs site, marketplace docs
  page, nimbalyst.com/extensions, the main repo's CONTRIBUTING.md, or general web search for a
  submission form). One doc passage says extensions can be "submit[ted] to the marketplace for
  distribution," but an explicit follow-up query against the same docs confirmed: "the docs I
  can access do not describe any specific submission mechanism: no submission form UI, no
  publish CLI command, no GitHub PR / workflow for adding your extension to the marketplace
  catalog."
- **Steps**: unverified/unknown — no documented path found. The only confirmed way to get a
  theme in front of a user today is the GitHub-URL paste above.
- **Updates**: unverified.
- **Contacts**: repo issues at https://github.com/Nimbalyst/nimbalyst/issues; Discord
  https://discord.gg/FgD9S2MCYB; no dedicated support email or contact form was found on
  nimbalyst.com.
- **Sources**: https://docs.nimbalyst.com/extensions/extension-system-and-marketplace (fetched
  2026-09-24); https://nimbalyst.com/extensions/ (fetched 2026-09-24, no submission
  instructions found on page); web search for a submission form (Typeform/Tally/etc.), fetched
  2026-09-24, no result.
- **Confidence**: unverified — whether formal catalog inclusion is even open to third parties,
  and if so how, could not be established from any source checked. A submitting agent should
  ask in the Discord or open a GitHub issue to find out before assuming this venue is reachable.

### Nimbalyst main repo (`packages/extensions/`)

- **URL**: https://github.com/Nimbalyst/nimbalyst (built-in extensions live under
  `packages/extensions/`, including the `example-theme` fixture used as a reference above).
- **Kind**: community repo / package registry (this is the app's own monorepo, not a
  third-party themes marketplace).
- **Accepts**: unverified whether third-party themes are accepted into this folder at all —
  the folder's contents (`animation`, `browser`, `git`, `example-theme`, etc.) read as
  first-party/built-in extensions, not a community contrib area.
- **Requirements**: standard PR process per `CONTRIBUTING.md` — DCO sign-off
  (`Signed-off-by` trailer, `git commit -s`), commits authored by the person who wrote them,
  Contributor Covenant code of conduct. No mention of a distinct process for adding
  third-party themes.
- **Steps**: unverified — no evidence this path is intended for outside themes; treat as
  unlikely unless confirmed otherwise.
- **Updates**: n/a (unverified whether this venue applies at all).
- **Contacts**: https://github.com/Nimbalyst/nimbalyst/issues; `MAINTAINERS.md` in the repo.
- **Sources**: https://github.com/Nimbalyst/nimbalyst/blob/main/CONTRIBUTING.md (fetched
  2026-09-24); directory listing at
  https://github.com/nimbalyst/nimbalyst/tree/main/packages/extensions (fetched 2026-09-24).
- **Confidence**: unverified — likely not applicable, but not ruled out; would need a
  maintainer's word.

### Community GitHub repos (precedent only, not a separate venue)

- **URL**: e.g. https://github.com/bglti148/nimbalyst-tokyo-night-theme,
  https://github.com/omartelo/rose-pine-nimbalyst — peer examples of the same GitHub-URL
  mechanism above, not a shared registry. Each author just hosts their own repo and shares
  the URL (README, Discord). Not pursued as a distinct venue.
- **Accepts/Requirements/Steps/Updates**: identical to the GitHub-URL venue above.
- **Contacts**: each repo's own issues.
- **Sources**: both repos fetched 2026-09-24, including
  https://raw.githubusercontent.com/bglti148/nimbalyst-tokyo-night-theme/main/manifest.json.
- **Confidence**: verified as a working pattern; not a distinct listing venue.

## Nimbalyst's on-disk themes/extensions directory

Confirmed application-data root per platform (from official docs, fetched 2026-09-24):

- macOS: `~/Library/Application Support/Nimbalyst`
- Windows: `%APPDATA%\Nimbalyst`
- Linux: `~/.config/Nimbalyst`

The docs do not name the extensions subfolder directly ("I cannot find information in the
docs that states the exact on-disk path for the extensions folder under `userData`"). Two
real community theme repos disagree on it:

- `bglti148/nimbalyst-tokyo-night-theme`'s README: macOS
  `~/Library/Application Support/Nimbalyst/extensions/` — matches the official app-data root
  above plus `/extensions`.
- `omartelo/rose-pine-nimbalyst`'s README: Linux `~/.config/@nimbalyst/electron/extensions`,
  macOS `~/Library/Application Support/@nimbalyst/electron/extensions`, Windows
  `$env:APPDATA\@nimbalyst\electron\extensions`.

A separate docs query about this discrepancy returned: "the top-level app data folder name is
documented as `Nimbalyst` across all platforms. For development builds, an additional
`@nimbalyst/electron` subfolder exists within the same location." That suggests the
`@nimbalyst/electron` path is for unpackaged/dev builds and `Nimbalyst/extensions` is correct
for the released app, but this inference is not itself confirmed in writing anywhere.

**Confidence: partly verified.** Use `Nimbalyst/extensions` (per platform, as above) as the
working assumption, but a submitting agent should confirm the live path from within a
released Nimbalyst install (Settings → Extensions → "Install from folder" dialog will show or
accept the real path) before relying on it in a README or a script.

## Not applicable

- No dedicated "theme store" separate from the general Extension Marketplace exists — themes
  are one of several extension contribution types (alongside editors, AI tools, panels),
  checked at https://docs.nimbalyst.com/extensions/extension-system-and-marketplace and
  https://nimbalyst.com/features/extensions/ (fetched 2026-09-24).
- No standalone `theme.json`-only loading mechanism (separate from an extension's
  `manifest.json`) is supported — checked against
  https://docs.nimbalyst.com/extensions/building-extensions/manifest-reference (fetched
  2026-09-24): "I can't find any docs that define or support a standalone `themes/theme.json`
  file format that's loaded independently of an extension's `manifest.json`." This means the
  port's current `theme.json` files, as laid out today, are not in a format Nimbalyst's
  documented loader recognizes at all.
- No package-registry venue (npm, etc.) — Nimbalyst extensions are installed by folder or by
  pointing at a git repo, not published to a package registry; nothing referencing npm/yarn
  installation of a Nimbalyst theme was found in the docs or in either community example repo.

## Open questions

- The port's `theme.json` files need to become one or more `manifest.json` files with
  `contributions.themes[]` before any venue above will load them — decide whether to ship one
  manifest per flavour (four separate extension `id`s, mirroring the AMO port's one-add-on-per-
  flavour pattern) or one manifest whose `contributions.themes[]` lists all four Darkberry
  flavours (plus the four tints) as entries under a single extension `id`. This also decides
  what "an update" means (bump one shared `version`, or four independent ones).
  This repackaging is themeing-file work, not a publishing-venue question — leaving it to
  whoever writes/edits the port itself, since this doc's own instructions were to touch only
  this one file.
- Whether the Marketplace catalog (nimbalyst.com/extensions, in-app Settings → Extensions →
  Marketplace) accepts third-party submissions at all, and if so how, was not found anywhere
  public. Ask in the Discord (https://discord.gg/FgD9S2MCYB) or open a GitHub issue against
  https://github.com/Nimbalyst/nimbalyst before assuming the GitHub-URL-paste path is a
  second-class option next to a "real" marketplace listing — it may currently be the only
  option.
- Confirm the live extensions directory path (`Nimbalyst/extensions` vs
  `@nimbalyst/electron/extensions`) against an actual installed copy of Nimbalyst rather than
  the two conflicting community READMEs cited above.
- Whose GitHub account/repo the manifest should live in and be installed from is already
  settled by the project (`shythulu/DarkBerry`); no separate developer account is needed for
  the GitHub-URL venue since it requires none.
