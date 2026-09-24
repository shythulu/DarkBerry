# Publishing the Visual Studio Code port

`ports/vscode/` is a complete VS Code extension (package.json, `themes/*.json`, README, LICENSE) publishing four themes (Darkberry Wisp/Fen/Mire/Blackwater); `ports/vscode/with-tints/` is a second, separately-published extension with all twenty flavour×tint themes. `./package.sh` (repo root) runs `@vscode/vsce package` on both folders to produce `dist/darkberry-theme-<version>.vsix` and `dist/darkberry-with-tints-theme-<version>.vsix`.

## Venues

### Visual Studio Marketplace

- **URL**: https://marketplace.visualstudio.com/manage (publisher management), https://marketplace.visualstudio.com/vscode (public gallery)
- **Kind**: official gallery (the default source VS Code itself queries)
- **Accepts**: a packaged `.vsix` built by `vsce`/`@vscode/vsce`. Required `package.json` fields: `publisher`, `name`, `version` (semver), `license`, `repository`, `engines.vscode`, `categories` (already `["Themes"]` here). Icon: PNG, minimum 128x128, 256x256+ recommended, SVG icons are rejected; current `package.json` has no `icon` field set (needs adding before publish — see Open questions). Optional `galleryBanner` (1376x80 banner strip) and `galleryBanner.theme`. README.md becomes the marketplace description; image/badge URLs in it must be HTTPS, and badges must come from an allow-listed set of trusted providers (shields.io is allowed). LICENSE and CHANGELOG.md are conventional but not strictly enforced by the tool.
- **Requirements**: a Microsoft account; a "publisher" identity created once at the manage page (an `id`, unchangeable, and a display `name`); an Azure DevOps Personal Access Token (PAT) scoped to Marketplace > Manage, created for "All accessible organizations" (a common failure is scoping it to one org). No listing fee. Verified-publisher status (a checkmark next to the publisher name) additionally needs the extension to have been published 6+ months, a domain registered 6+ months, and a TXT-record DNS proof, reviewed within 5 business days — optional, not required to publish. 2FA/MFA requirement on the Microsoft account was not stated in the docs fetched; not confirmed either way (unverified). Global PATs are being retired 2026-12-01 in favour of Entra ID (OIDC/workload-identity) authentication for automated publishing — relevant if publishing from CI after that date.
- **Steps**:
  1. Create/sign in to a Microsoft account, go to https://marketplace.visualstudio.com/manage, click "Create publisher", set `id` (must match `package.json`'s `publisher`) and `name`.
  2. Get a PAT: https://go.microsoft.com/fwlink/?LinkId=307137 → User settings → Personal access tokens → New Token → Organization "All accessible organizations" → Scopes → Custom defined → Marketplace → Manage.
  3. `npm install -g @vscode/vsce`; `vsce login <publisher-id>` and paste the PAT (or skip login and pass `-p <token>` on publish).
  4. Add an `icon` field to `package.json` pointing at a PNG (both `ports/vscode/` and `ports/vscode/with-tints/`).
  5. Build with the repo's `./package.sh`, or manually: `cd ports/vscode && vsce publish --packagePath ../../dist/darkberry-theme-<version>.vsix`, and the same for `with-tints`. (Or `vsce package` then `vsce publish -p <token>` from inside each folder.)
  6. Repeat for the `with-tints` extension under its own `name`/`displayName` (already distinct in its `package.json`).
- **Updates**: bump `version` in `package.json`, rebuild, `vsce publish` again (or `vsce publish minor`/`patch`/`<version>` to bump and publish in one step). No re-review gate was documented for updates beyond the same automated scanning as new submissions.
- **Contacts**: publisher-management portal's own support link; Microsoft Q&A (learn.microsoft.com/answers) tag `vscode`; no dedicated email found.
- **Sources**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension (fetched 2026-09-24); https://marketplace.visualstudio.com/manage (fetched 2026-09-24, page shell only, needs login to act on).
- **Confidence**: partly verified. Publisher/PAT/vsce steps and icon/file requirements are from the official doc page. 2FA requirement, exact automated-review criteria/timeline, and whether icon is a hard publish blocker (vs. a marketplace-quality warning) are unverified.

### Open VSX Registry

- **URL**: https://open-vsx.org/ ; namespace/ownership issues at https://github.com/EclipseFdn/open-vsx.org/issues/new/choose ; wiki: https://github.com/eclipse-openvsx/openvsx/wiki/Namespace-Access
- **Kind**: official gallery for non-Microsoft VS Code forks — this is where VSCodium and Cursor's built-in extension search pulls from (Microsoft's marketplace terms restrict use by non-Microsoft VS Code builds), so it's effectively required, not optional, for this port's stated "works in Cursor, VSCodium and Windsurf" claim.
- **Accepts**: the same `.vsix` built by `vsce`/`ovsx` — Open VSX's `ovsx` CLI packages via `vsce` internally, so the same `package.json` fields apply. Extensions are auto-scanned for secrets, blocklist matches, and namespace-similarity before being accepted.
- **Requirements**: an eclipse.org account (its GitHub username must match the account used to log into open-vsx.org); a signed Eclipse Publisher Agreement (https://open-vsx.org/publisher-agreement-v1.1); an access token generated on open-vsx.org; a claimed/created namespace matching `package.json`'s `publisher` field ("shythulu"). No fee. Namespace *creation* (via `ovsx create-namespace`) is separate from namespace *ownership verification* — creating it doesn't make you the verified owner.
- **Steps**:
  1. Register at https://accounts.eclipse.org/user/register with the same username as the GitHub account that will log into open-vsx.org.
  2. Log into https://open-vsx.org via GitHub → Settings → Profile → "Log in with Eclipse" → authorize → accept the Publisher Agreement shown on the profile page.
  3. Settings → Access Tokens → Generate New Token; copy it immediately (shown once).
  4. `npx ovsx create-namespace shythulu -p <token>` (only needed if the namespace doesn't exist yet).
  5. Claim verified ownership of the `shythulu` namespace by opening an issue against https://github.com/EclipseFdn/open-vsx.org using its namespace-claim template; the fastest-processed path is "namespace is already a Marketplace publisher with a published extension whose `package.json` has a `repository` field" — true here once the extension is on the VS Marketplace, since `repository` already points at github.com/shythulu/DarkBerry.
  6. `npx ovsx publish ports/vscode -p <token>` (or `npx ovsx publish dist/darkberry-theme-<version>.vsix -p <token>`); repeat for `ports/vscode/with-tints`.
- **Updates**: bump version, rebuild, `ovsx publish` again — no separate re-review step documented beyond the same automated scan.
- **Contacts**: issues at github.com/EclipseFdn/open-vsx.org (namespace/ops) and github.com/eclipse-openvsx/openvsx (registry software); no chat/email found in what was fetched.
- **Sources**: https://github.com/eclipse-openvsx/openvsx/wiki/Namespace-Access (fetched 2026-09-24); https://open-vsx.org/publisher-agreement-v1.1 (found via search 2026-09-24, not opened); GitHub issues search on `EclipseFdn/open-vsx.org` "Claiming namespace" pattern, e.g. issues #13426, #13310 (fetched 2026-09-24).
- **Confidence**: partly verified. The publisher-agreement/token/create-namespace/publish mechanics are documented directly. The exact namespace-claim issue template fields and the "how long it takes" figure were inferred from example issues, not from the template source itself — unverified in detail.

### vscodethemes.com

- **URL**: https://vscodethemes.com (source at https://github.com/vscodethemes/web)
- **Kind**: community gallery, read-only mirror of the Marketplace
- **Accepts**: nothing submitted directly — it periodically scans the VS Marketplace and indexes any theme whose manifest has a description and whose theme files are `.json` (not `.tmTheme`). This port qualifies once published there.
- **Requirements**: none beyond being live on the VS Marketplace.
- **Steps**: none — publish to the VS Marketplace (above) and wait for the next scan; if it doesn't appear, open an issue on github.com/vscodethemes/web or github.com/vscodethemes.
- **Updates**: automatic on the next scan after a Marketplace update; no manual re-submission.
- **Contacts**: issues at https://github.com/vscodethemes (org) / https://github.com/vscodethemes/web.
- **Sources**: https://vscodethemes.com/ and https://github.com/vscodethemes/web README (fetched 2026-09-24).
- **Confidence**: partly verified — the scan-based mechanism is from the linked repo's README as summarized by the fetch tool; scan frequency and the exact "missing theme" issue flow were not independently opened and read.

### awesome-vscode (curated list)

- **URL**: https://github.com/viatsko/awesome-vscode (rendered: https://viatsko.github.io/awesome-vscode/)
- **Kind**: community repo (curated README list), not a store
- **Accepts**: one Markdown entry per theme, linking to vscodethemes.com if the theme is listed there, otherwise to the Marketplace page. Only one theme entry per publisher is accepted. A screenshot in a house style is requested (a template/sketch file is provided in the repo). Entries must sit in alphabetical order in the themes section.
- **Requirements**: a GitHub account to open a pull request; no fee, no review body beyond the repo's own PR review.
- **Steps**: fork the repo, add one alphabetically-placed entry under the themes section linking to the Marketplace (or vscodethemes) page, include a screenshot per the template, open a PR against `master`.
- **Updates**: a follow-up PR to edit the existing entry (e.g. link or screenshot changes).
- **Contacts**: GitHub issues/PRs on viatsko/awesome-vscode.
- **Sources**: https://github.com/viatsko/awesome-vscode/blob/master/CONTRIBUTING.md (fetched 2026-09-24).
- **Confidence**: verified for the submission rules quoted above; not verified whether the maintainer is currently active/merging PRs.

## Not applicable

- **Windsurf's own extension store**: Windsurf is a VS Code fork; it was not found to run a separate theme marketplace distinct from VS Code/Open VSX compatibility — checked Windsurf's own docs site via search, found no separate gallery. Treated as covered by the VS Marketplace / Open VSX entries above.
- **Cursor's own extension store**: same as Windsurf — Cursor documents using Open VSX for extensions not on its curated allow-list; no separate Cursor-only theme gallery found.

## Open questions

- `package.json` in both `ports/vscode/` and `ports/vscode/with-tints/` has no `icon` field and there is no dedicated square PNG icon asset in `ports/vscode/assets/` (only `.webp` screenshots) — a submitting agent must add a 256x256+ PNG icon and wire it into both manifests before the first Marketplace/Open VSX publish.
- Whose Microsoft account and eclipse.org account to use for the publisher identity "shythulu" — the README already tells forkers to change `publisher` in `build.mjs` for their own name, so confirm this is being published under the project's own `shythulu` accounts, not a maintainer's personal one.
- Whether the project wants CI-based publishing (relevant to the 2026-12-01 PAT retirement pushing Marketplace auth toward Entra ID/OIDC) or a one-off manual `vsce`/`ovsx publish` — affects which token/setup flow to follow.
- No CHANGELOG.md currently in `ports/vscode/` — decide whether to add one; not a hard requirement for either registry but conventional.
- vscodethemes.com and awesome-vscode listing were not confirmed as already covering Darkberry — a submitting agent should check both sites for an existing entry before assuming these are net-new.
