# Porting and publishing userstyles

A userstyle is one CSS file that restyles one website. The Stylus browser extension loads it. The file is UserCSS: a `/* ==UserStyle== */` metadata comment, then CSS inside `@-moz-document` blocks. One file can hold all four flavours, because a `@var select` line lets the user pick one in Stylus's config dialog. Stylus reports 136,397 daily users on Firefox and "1,000,000 users" on the Chrome Web Store. This port is not one theme but a family of small ones, one file per site, so the first job is choosing sites.

## Porting

### Format

One theme is one plain-text file whose name ends in `.user.css`, `.user.less` or `.user.styl`. The suffix is what makes Stylus open its installer. The spec is Stylus's wiki page [Writing UserCSS](https://github.com/openstyles/stylus/wiki/Writing-UserCSS).

The file has two parts.

| Part | Holds |
|---|---|
| `/* ==UserStyle== ... ==/UserStyle== */` | Metadata lines, each `@key value`. Must come first. |
| `@-moz-document domain("example.org") { ... }` | The CSS. Several `domain()`, `url-prefix()` or `regexp()` targets can share one block. A style with no `@-moz-document` applies everywhere, and userstyles.world refuses it. |

Every metadata field:

| Field | Required | What it is | Rule |
|---|---|---|---|
| `@name` | yes | Display name | `@name` plus `@namespace` must be unique per style. |
| `@namespace` | yes | Disambiguates same-named styles | Usually the author's nickname or homepage. Spaces allowed. |
| `@version` | yes | Drives update checks | Semver, or any dot-separated digits and CalVer since Stylus 1.5.18. Stylus only installs an update when this changes. |
| `@description` | no | One line | Shown on the install page and in galleries. |
| `@author` | no | Who wrote it | Fixed order: `name <email> (url)`. Email and URL optional. |
| `@homepageURL` | no | Link shown in Manage and Edit | Not the update URL. |
| `@supportURL` | no | "Feedback" link in the config dialog | |
| `@updateURL` | no | Where updates are fetched | Default is wherever the style was installed from. userstyles.world overrides it with its own. |
| `@license` | essential | SPDX identifier | No licence means nobody may copy or modify it. |
| `@preprocessor` | no | `default`, `uso`, `less` or `stylus` | Decides how `@var` values reach the CSS. |
| `@var` | no | One user-switchable variable per line | `@var <type> <name> <label> <default>`. Types: text, color, checkbox, select, range, number. |

How `@preprocessor` changes the CSS:

| Preprocessor | Picked when | A `@var` becomes | Referenced as |
|---|---|---|---|
| `default` | Set, or no `@var` lines | `:root { --name: value }` on every section | `var(--name)` |
| `uso` | Set, or `@var` lines with no `@preprocessor` | A userstyles.org placeholder | `/*[[name]]*/` |
| `less` | Set | A Less variable | `@name` |
| `stylus` | Set | A stylus-lang variable | `name` |

The flavour selector is a `@var select`. Its value is a JSON array of `"key:Label"` strings, and a trailing `*` marks the default. Stylus keeps the user's choice across updates as long as the keys do not change.

```
@var select darkFlavor "Dark Flavor" ["latte:Latte", "frappe:Frappé", "macchiato:Macchiato", "mocha:Mocha*"]
```

Where it lives and how it is installed:

| Question | Answer |
|---|---|
| Disk location | None. Stylus keeps installed styles in extension storage. There is no theme folder on any OS. |
| Install from a URL | Open the raw file URL in a browser with Stylus. Stylus opens an installer tab with an "Install style" button. The raw URL must serve plain text, so GitHub's "raw" link works and the blob page does not. |
| Install from a local file | Firefox: drag the file into a tab or press Ctrl+O. Chrome: drag it onto a Stylus page, or allow file URLs and open it. |
| Preview while editing | The installer offers "Live reload" for `file://` and `localhost` URLs. Saves in an editor re-apply on the page. |
| Configure | Manage page, gear icon on the style. The dialog shows one control per `@var`. |
| Update | Stylus polls the install or `@updateURL` location and installs when `@version` is higher. |
| Bulk install | Manage page, Backup section, Import, pick a Stylus export JSON. Catppuccin and Rosé Pine ship one. |

Several themes per file, or one per file: both. All four flavours fit in one file through `@var select`. One file can also target several domains. In practice both reference projects keep one file per site, and `@name` is what the user sees in the Stylus list, so a file per site is the unit.

Packaging: none. The `.user.less` file is the artefact. The optional Stylus export JSON is a bundle, not a package: an array whose first element is a settings object and whose rest are style objects holding `sourceCode` and the parsed metadata.

### How Catppuccin and Rosé Pine do it

| | Catppuccin | Rosé Pine |
|---|---|---|
| Repo | https://github.com/catppuccin/userstyles (1,135 stars, pushed 2026-10-09) | https://github.com/rose-pine/userstyles (50 stars, pushed 2026-09-16) |
| Licence | MIT | MIT |
| Count | 134 styles under `styles/<site>/` | 25 styles under `styles/<site>/` |
| File per site | `catppuccin.user.less` and a generated `README.md` | `rose-pine.user.less`, `README.md`, `LICENSE`, `style.json` (name, author, category) |
| Preprocessor | Less, enforced. The lint rejects anything else. | Less |
| Palette | `@import "https://userstyles.catppuccin.com/lib/std/v1.less"`, a hosted library with the four flavour maps, CSS filter equivalents, `#lib.palette()` and `#lib.defaults()` | A `@rose-pine` map of the three variants pasted at the bottom of every file. No import. |
| Flavour and accent | Three `@var select` lines: `lightFlavor`, `darkFlavor`, `accentColor` (14 accents plus `subtext0:Gray`). `#catppuccin(@flavor)` mixin is called from `prefers-color-scheme` media queries or the site's own theme attribute. | Three `@var select` lines: `lightVariant`, `darkVariant`, `accentColor` (6 accents). Same mixin shape. |
| Registry | `scripts/userstyles.yml`, validated by `scripts/userstyles.schema.json`. Per style: `name`, `link`, `categories` (1 to 3, from catppuccin/catppuccin's category list), `color`, `icon` (Simple Icons slug), `note`, `current-maintainers`, `past-maintainers`. | `style.json` beside each file. |
| Metadata rule | `scripts/lint/metadata.ts` asserts every header value from the registry: `@name` is `<Site> Catppuccin`, `@namespace` is `github.com/catppuccin/userstyles/styles/<site>`, `@updateURL` is the `github.com/.../raw/main/...` URL, `@supportURL` is an issues search by label, `@author` is `Catppuccin`, `@license` MIT, the three `@var` lines byte-identical to the template. | Template with `{{title}}`, `{{author}}`, `{{directory}}` filled by `scripts/init.ts`. |
| Version | CalVer `YYYY.MM.DD[.n]`. CI bumps `@version` in every changed file after merge (`scripts/bump-version`). | Semver by hand. |
| Tooling | Deno. `deno task lint` runs usercss-meta, stylelint with postcss-less and three custom rules. `ci:generate` writes per-style READMEs from a Handlebars template, labels and CODEOWNERS. `ci:stylus-import` writes `dist/import.json`. | Deno. `init.ts`, `update-readme.ts`, `generate-imports.ts`. |
| Distribution | Raw GitHub URLs. Each README has a "Stylus install" badge pointing at `raw.githubusercontent.com`. A rolling release `all-userstyles-export` carries `import.json` (2.6 MB, all 134 styles plus recommended settings). Docs site at userstyles.catppuccin.com. | Raw GitHub URLs. A rolling release `userstyle-imports` carries six `import.json` files, one per default variant and light/dark pairing. |
| userstyles.world | No. Zero mentions in the repo. A `catppuccin` account exists there (ID 19280, joined about two years ago) with no styles. The 268 "catppuccin" search hits are third-party uploads. | No. No `rose-pine` user. The 33 search hits are third-party. |
| Unusual | Styles must be "popular or otherwise commonly known"; niche sites are refused. New styles go through a port-request discussion first. Maintainers become org members and own `/styles/<site>` in CODEOWNERS. The `.user.css` name in the brief is stale: every file is `.user.less` now. | Palette inline, so a file works offline and on hosts that forbid remote imports. |

Files a Darkberry template derives from:

- Catppuccin template: https://raw.githubusercontent.com/catppuccin/userstyles/main/template/catppuccin.user.less
- Catppuccin std library: https://raw.githubusercontent.com/catppuccin/userstyles/main/lib/std/v1.less
- Catppuccin's smallest real style, Claude: https://raw.githubusercontent.com/catppuccin/userstyles/main/styles/claude/catppuccin.user.less
- Rosé Pine template: https://raw.githubusercontent.com/rose-pine/userstyles/main/template/rose-pine.user.less

### Mapping

A userstyle has no fixed keys. Each site has its own CSS variables or selectors, and each style maps them by hand. What is fixed is the palette the mixin exposes. Catppuccin's `#lib.palette()` sets one Less variable per palette colour plus `@accent`. The Darkberry template swaps those names.

| Catppuccin Less variable | Darkberry template reference | Why |
|---|---|---|
| `@base` | `{ui.background}` | Role, not palette name |
| `@mantle` | `{ui.pane.secondary}` | Role |
| `@crust` | `{ui.pane.tertiary}` | Role |
| `@surface0`, `@surface1`, `@surface2` | `{surface0}`, `{surface1}`, `{surface2}` | Structural chrome, palette names allowed |
| `@overlay0`, `@overlay1`, `@overlay2` | `{overlay0}`, `{overlay1}`, `{overlay2}` | Structural chrome |
| `@text` | `{ui.text}` | Role |
| `@subtext1` | `{subtext1}` | Palette |
| `@subtext0` | `{ui.text.muted}` | Role, resolves to subtext0 |
| `@accent` | `{ui.accent}` | Role, resolves to jam, build-checked at 3:1 |
| `@rosewater` | `{blossom}` | Accent slot 1 |
| `@flamingo` | `{petal}` | Accent slot 2 |
| `@pink` | `{berry}` | Accent slot 3 |
| `@mauve` | `{plum}` | Accent slot 4 |
| `@red` | `{cranberry}` or `{ui.error}` | Status red is the role |
| `@maroon` | `{cherry}` | |
| `@peach` | `{apricot}` | |
| `@yellow` | `{honey}` or `{ui.warning}` | Status yellow is the role |
| `@green` | `{gooseberry}` or `{ui.success}` | Status green is the role |
| `@teal` | `{juniper}` or `{ui.info}` | |
| `@sky` | `{frost}` | |
| `@sapphire` | `{bilberry}` | |
| `@blue` | `{blueberry}` or `{ui.link}` | Links are the role, which resolves to frost |
| `@lavender` | `{lavender}` | |

`#lib.defaults()` sets three things every style inherits. They map to roles too.

| Catppuccin default | Darkberry |
|---|---|
| `color-scheme: if(@flavor = latte, light, dark)` | `%SCHEME%` |
| `::selection { background-color: fade(@accent, 30%) }` | `{ui.selection}`, opaque |
| `input::placeholder { color: @subtext0 }` | `{ui.text.muted}` |

A worked example of the per-site layer is the Claude style. It maps claude.ai's own variables: `--bg-100` to `@base`, `--bg-200` to `@mantle`, `--bg-300..500` to `@surface0..2`, `--border-300..500` to `@overlay0..2`, `--text-100` to `@text`, `--text-300` to `@subtext0`, `--danger-100` to `@red`, `--success-000` to `@green`, `--warning-000` to `@yellow`, every `--accent-*` to `@accent`. The Darkberry version of that file replaces the right-hand side with the table above and leaves the left-hand side alone. Link: https://raw.githubusercontent.com/catppuccin/userstyles/main/styles/claude/catppuccin.user.less

Two Catppuccin habits do not carry over. `fade(@accent, 30%)` and `lighten(@green, 5%)` are Less colour operations on a palette value, which STYLE_GUIDE rule 1 forbids in a template. Each becomes a role or a `mix()`. And `#hslify()` splits a hex into `h s% l%` for sites that compose colours from HSL channels. Less can still do that at install time in the user's browser, so it stays.

### Build plan

Templates to add:

| Path | Holds |
|---|---|
| `src/ports/userstyles/<site>.user.less` | One template per site. Metadata header, `@-moz-document`, a `#darkberry(@flavour)` mixin with the site's rules written against Less variables (`@base`, `@text`, `@accent`). |
| `src/ports/userstyles/_palette.less` | The palette map, written once with `{...}` references and rendered per flavour. See below. |
| `src/usage/userstyles.md` | Install steps and the site list. |

The one thing the format needs that no port has yet: all four flavours in one file. `fill()` resolves `{base}` for one flavour context at a time. The palette map must therefore be rendered four times and joined. `ports/gpl/darkberry.gpl` already does this with `ctxs.flatMap` at build.mjs line 387. Concretely, a new `%PALETTE_MAP%` meta key, filled with:

```
@darkberry: {
  @wisp:       { @base: #...; @mantle: #...; ... @accent-default: #...; };
  @fen:        { ... };
  @mire:       { ... };
  @blackwater: { ... };
}
```

Each flavour's row comes from `fill(ctx, paletteTemplate)` for that ctx. The site body is filled once, with no `{...}` references, because its colours come from the map at install time. The hex check (`HEX_LITERAL`) passes, because the template holds references and only the output holds hex.

The header per site:

```
/* ==UserStyle==
@name           <Site> Darkberry
@namespace      github.com/shythulu/DarkBerry/ports/userstyles/<site>
@homepageURL    https://darkberry.slacklab.ca
@supportURL     https://github.com/shythulu/DarkBerry/issues
@updateURL      https://github.com/shythulu/DarkBerry/raw/main/ports/userstyles/<site>/darkberry.user.less
@version        %VERSION%
@description    %NAME% for <Site>. %DESCRIPTION%
@author         %AUTHOR% (%REPOSITORY%)
@license        MIT
@preprocessor   less
@var select lightFlavour "Light flavour" ["wisp:Wisp*", "fen:Fen", "mire:Mire", "blackwater:Blackwater"]
@var select darkFlavour  "Dark flavour"  ["wisp:Wisp", "fen:Fen", "mire:Mire*", "blackwater:Blackwater"]
==/UserStyle== */
```

Output tree. Tints get subfolders, because a tint is a different `@name` and the "one theme per file" rule in PORT_CREATION.md applies:

```
ports/userstyles/
  README.md
  assets/                       preview.webp and <flavour>.webp, of the first site
  import.json                   every site, every tint, for Stylus bulk import (if built)
  <site>/
    darkberry.user.less         four flavours, selected in Stylus
  lingonberry/
    README.md
    <site>/lingonberry.user.less
  cloudberry/ ...  crowberry/ ...  blueberry/ ...
```

The alternative is a `@var select tint` with five entries and a twenty-row map in one file. It is simpler for the user and larger per file. Open question below.

What build.mjs cannot do today:

| Gap | Why | Fix |
|---|---|---|
| Render four flavours into one file | `fill()` is per flavour | `%PALETTE_MAP%` as above, about 15 lines |
| Loop over a folder of site templates | Every template is read by name | A `readdirSync` over `src/ports/userstyles/` |
| Per-site `@version` | `%VERSION%` is the repo version, 0.3.0. Stylus and userstyles.world ignore a changed file whose `@version` did not move. | Either bump the repo version on every style fix, or give each site a CalVer line in a small registry the build stamps. Catppuccin's `bump-version` script is 50 lines. |
| `import.json` | Needs the usercss-meta parser and Stylus's `calcStyleDigest`. Rosé Pine's generator is 60 lines of Deno with one npm dependency. Darkberry's build has none. | Skip, or a separate `tools/stylus-import.mjs` that vendors the parser. |
| Compile check | Nothing here runs Less. A broken file only fails in the user's browser. | `npx lessc` in CI, or Catppuccin's stylelint config. |
| Screenshots | A browser with Stylus and the style installed. | The existing consented-screenshot loop, one site at a time. |

Choosing the first sites. The port is many small styles, so the first three set the pattern and the cost. Pick by three tests, in this order.

| Test | Why |
|---|---|
| Both Catppuccin and Rosé Pine ship it | Two working mappings to crib. The overlap is advent-of-code, brave-search, bluesky, chatgpt, claude, docs.rs, github, nixos-search, proton, status.cafe, twitch, wikiwand, youtube. |
| The site themes itself through CSS variables on `:root` | The style is a variable remap, so it is short and survives redesigns. GitHub and Claude are. YouTube is not, and Catppuccin's YouTube file is the kind that breaks monthly. |
| Shylo uses it daily and can screenshot it signed in | Screenshots and bug reports come free. |

That gives GitHub first, then claude.ai, then one documentation site such as docs.rs or MDN. Three is enough to prove the template, the map rendering and the tint routing before the list grows.

## Venues

### GitHub raw URL (the repository itself)

- **URL**: https://github.com/shythulu/DarkBerry, serving `https://raw.githubusercontent.com/shythulu/DarkBerry/main/ports/userstyles/<site>/darkberry.user.less`
- **Kind**: de facto venue. Both reference projects distribute this way only. Stylus's wiki lists GitHub raw first under "Hosting a UserCSS".
- **Accepts**: any plain-text file whose URL ends in `.user.css`, `.user.less` or `.user.styl`. Opening it with Stylus installed shows the installer.
- **Fields**: Name (`@name`), Summary (`@description`), Author (`@author`, `name (url)` order), Homepage (`@homepageURL`), Support (`@supportURL`), Repository (the `@namespace` and the raw URL), Licence (`@license`, SPDX), Version (`@version`).
- **Add-ons**: a "Stylus install" badge per site in the README, `[![Install with Stylus](https://img.shields.io/badge/Install%20directly%20with-Stylus-00adad.svg)](<raw url>)`. An `import.json` on a rolling GitHub release for bulk install, the way both reference repos do it.
- **Requirements**: none beyond the repository.
- **Steps**:
  1. Build `ports/userstyles/<site>/darkberry.user.less` and push to `main`.
  2. Put the badge and the raw URL in `ports/userstyles/README.md` through `src/usage/userstyles.md`.
  3. Optionally attach `import.json` to a release tagged for the purpose, as Catppuccin's `all-userstyles-export`.
- **Updates**: push a file with a higher `@version`. Stylus polls the URL it installed from, or `@updateURL`, on its update interval. No bump, no update.
- **Contacts**: n/a.
- **Sources**: https://github.com/openstyles/stylus/wiki/Writing-UserCSS (2026-10-08, Installation, Hosting a UserCSS, Badges, `@updateURL`), https://github.com/catppuccin/userstyles/blob/main/.github/workflows/build.yml (2026-10-08, release upload), https://raw.githubusercontent.com/catppuccin/userstyles/main/styles/claude/README.md (2026-10-08, badge), https://github.com/rose-pine/userstyles/releases/tag/userstyle-imports (2026-10-08).
- **Confidence**: verified.

### userstyles.world

- **URL**: https://userstyles.world, source at https://github.com/userstyles-world/userstyles.world (AGPL-3.0, pushed 2026-09-09)
- **Kind**: community gallery, the largest live one. Its index holds 25,099 styles. Stylus's popup "Find styles for this site" reads this site's index (`/api/index/uso-format`) alongside the userstyles.org archive, so a listing here appears inside Stylus without the user visiting the site.
- **Accepts**: one UserCSS style per listing, pasted or imported from a URL ending in `.user.css`, `.user.styl` or `.user.less`. A style with no `@-moz-document` is refused. The content guidelines ask for original work or a licence that allows reposting, and for safe-for-work screenshots.
- **Fields**: Name (`Name`, 50 chars, must not duplicate another listing's name), Summary (`Description`, 160 chars, required, plain text, used for SEO and embeds), Description (`Notes`, 50,000 chars, Markdown, "features, requirements, instructions, links, changelog"), Homepage (`Homepage`, URL), Licence (`License`, free text, empty means "No License"), Screenshots (`Preview image URL` or `Upload preview image`, jpg, png, webp or avif, one image), Category (`Category`, 255 chars, required: the themed site's domain. Drop a `.com` or `.org` TLD, keep any other TLD, keep subdomains. A wrong category keeps the style out of Stylus's inline search).
- **Add-ons**: `Source code` (10,000,000 chars) or `Import URL`. `Mirror style metadata` and `Mirror source code updates` checkboxes on import and edit. `Mirror URL` on edit. The site overrides `@updateURL` with its own `/api/style/<id>.user.css` on purpose, "to avoid the possibility of tracking, as well as broken URLs".
- **Requirements**: an account. Sign-up is username (3 to 32 chars), email and password (8 to 32), or OAuth through GitHub, GitLab or Codeberg. The sign-up page sits behind an Anubis proof-of-work challenge, so it needs a real browser with JavaScript. No fee, no review before publication. Admins remove styles that break the guidelines.
- **Steps**:
  1. Sign up, in a browser, at https://userstyles.world/signup. GitHub OAuth is the shortest path.
  2. Open Import userstyle. Paste the raw GitHub URL of `darkberry.user.less` as the Import URL.
  3. Tick "Mirror source code updates" and "Mirror style metadata".
  4. Fill Category with the site's domain under the rule above, for GitHub `github`.
  5. Add a preview image, Homepage `https://darkberry.slacklab.ca`, License `MIT`.
  6. Save. Check the style's page shows the install button, then that Stylus's popup finds it on the site within 15 minutes.
  7. Repeat per site and per tint. Each is its own listing.
- **Updates**: automatic when mirroring is on. The mirror runs every four hours at four minutes past, in batches of 25, and fetches only when the file's `@version` differs from the one stored. Without mirroring, edit the listing and paste the new code.
- **Contacts**: Discord, Matrix and email links in the site footer. Issues at https://github.com/userstyles-world/userstyles.world/issues.
- **Sources**: https://userstyles.world/docs/faq (2026-10-08, category rule, mirror schedule, `@updateURL` override, inline search delay), https://userstyles.world/docs/content-guidelines (2026-10-08), https://raw.githubusercontent.com/userstyles-world/userstyles.world/main/web/views/style/add.tmpl and `import.tmpl` and `edit.tmpl` (2026-10-08, every form field and limit), `web/views/user/register.tmpl` and `web/views/partials/btn-oauth.tmpl` (2026-10-08, sign-up fields and OAuth providers), https://userstyles.world/api/index/uso-format (2026-10-08, 25,099 entries), https://raw.githubusercontent.com/openstyles/stylus/master/src/popup/search.js (2026-10-08, `USW_INDEX_URL`), https://userstyles.world/user/catppuccin (2026-10-08).
- **Confidence**: verified for the form fields, limits, mirror mechanism and Stylus integration, all read from the site's source and FAQ. Unverified: the live sign-up flow, which the Anubis challenge blocked, and whether a Name that only differs by tint ("GitHub Darkberry" against "GitHub Lingonberry") trips the duplicate-name check. It should not, since the check is on the whole string.

### Greasy Fork

- **URL**: https://greasyfork.org
- **Kind**: the main userscript gallery, which also lists user styles. Its scripts list has a CSS language filter and labels entries "User style". The Stylus wiki names it as one of three style galleries.
- **Accepts**: a UserCSS file, posted as a "script" with language CSS. Code rules: a description is required, no obfuscation or minification, 2 MB size cap, and "the primary functionality of a script must be within the code on Greasy Fork". That last rule is why Catppuccin's hosted `@import` would not fit here and Darkberry's inline palette map does.
- **Fields**: Name (`@name`), Summary (`@description`, required by the rules), Licence (`@license`), Version (`@version`), plus whatever the posting form adds.
- **Add-ons**: not read. The posting form needs an account to view.
- **Requirements**: a Greasy Fork account. No fee. Moderators delete scripts that break the code rules.
- **Steps**: unverified. Expected: sign in, Post a script, choose CSS, paste the file or point at the raw URL, publish.
- **Updates**: unverified. Greasy Fork has a script-sync feature for userscripts, and whether it covers user styles was not confirmed.
- **Contacts**: https://greasyfork.org/en/forum
- **Sources**: https://greasyfork.org/en/help/installing-user-styles (2026-10-08, "Some scripts on Greasy Fork can be installed as user styles. User styles can be installed with Stylus"), https://greasyfork.org/en/help/code-rules (2026-10-08), https://greasyfork.org/en/scripts?language=css (2026-10-08), https://github.com/openstyles/stylus/wiki/Writing-UserCSS (2026-10-08, gallery list).
- **Confidence**: partly verified. Hosting of user styles and the code rules are from the site's own pages. The posting form, its fields and the update path are unverified and need a signed-in browser.

## Not applicable

- **Stylus's own listing**: there is none. Stylus has no gallery. Its popup search merges the userstyles.world index with the userstyles.org archive index, so userstyles.world above is the way into it. Checked `src/popup/search.js` (2026-10-08).
- **userstyles.org archive (uso.kkx.one, uso-archive.surge.sh)**: a read-only archive of the old Stylish site. It takes no submissions. The userstyles.world import form accepts its URLs only as a source.
- **userstyles.org (Stylish)**: the original site. Stylus's wiki links only its archive, and userstyles.world's FAQ treats it as past. Not checked further.
- **catppuccin/userstyles and rose-pine/userstyles**: palette-specific repositories. They take styles in their own palette only.
- **Chrome Web Store and addons.mozilla.org**: they list Stylus, not styles. Darkberry's Firefox and Chrome ports are browser themes, a different format, already covered in `../publishing/firefox.md` and `chrome.md`.

## Open questions

- **Tints as files or as a selector.** Subfolders follow the repo rule and give each tint its own listing and screenshots. One file with a five-entry `@var select tint` gives the user one install and halves the listings, but each userstyles.world listing is one `@name`, so the tints would not be searchable on their own.
- **An accent selector.** Catppuccin and Rosé Pine both offer one. Darkberry's accent is the `ui.accent` role, jam, and every on-colour pairing is build-checked only for it. Offering the fourteen berries as accents means fourteen unchecked pairings per site. The honest choice is no selector until `ui.on.accent` is checked against every berry.
- **Versioning.** Every style fix needs a higher `@version`, or neither Stylus nor userstyles.world picks it up. Either the repo version moves on every style fix, or sites get their own CalVer line that the build stamps.
- **Which account on userstyles.world.** The `catppuccin` username exists there with no styles, so names are first come. `darkberry` or `shythulu` should be claimed before the first listing.
- **`@updateURL` host.** The raw GitHub URL, as both reference projects use, or `https://darkberry.slacklab.ca/...`. The site needs to serve the file as plain text with the `.user.less` suffix for Stylus to accept it.
- **Which three sites first.** GitHub, claude.ai and one docs site are the recommendation above. Confirm before writing the first template, because the first one sets the mixin shape every later site copies.
- **Greasy Fork at all.** It is a third listing per site with an unverified form. Decide after userstyles.world is live whether the extra reach is worth the extra listings.
