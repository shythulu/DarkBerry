# Publishing the T3 Code port

`ports/t3code/darkberry-<flavour>.json` is one T3 Code theme file (`ThemeFile` v1: `version`,
`id`, `name`, `appearance`, `colors` with 57 keys) per dark flavour, Fen, Mire and Blackwater,
each carrying Wisp as its `variants.light` block, and the same again under each tint's folder
with the tint's own Wisp. T3 Code loads such a file from `~/.t3/userdata/themes/` or from Settings →
Appearance → Import theme, and that is the install path the port's README documents. None of
the venues below is run by T3 Tools: the upstream repository takes no themes (see *Not
applicable*), so "publishing" means being found from inside the app or in the community gallery.

## Venues

### Open VSX, through T3 Code's own theme search

- **URL**: in-app, Settings → Appearance → "Search community themes"; the registry behind it is
  https://open-vsx.org/ (API `https://open-vsx.org/api/-/search`).
- **Kind**: official in the sense that the app wires it up itself: `apps/web/src/openVsxThemes.ts`
  queries Open VSX for VS Code theme extensions, and `apps/web/src/vscodeThemeImport.ts` converts
  a chosen theme into the 57 keys from about 36 VS Code colour keys (`editor.background`,
  `sideBar.background`, `button.background`, `list.activeSelectionBackground`,
  `terminal.selectionBackground`, `textLink.foreground` and so on). The result is an automatic
  conversion of the VS Code port, not the hand-tuned port in `ports/t3code/`.
- **Accepts**: a VS Code theme extension published to Open VSX, which is the same `.vsix` the
  Visual Studio Marketplace takes. `ports/vscode/` and `ports/vscode/with-tints/` already are
  that; `docs/publishing/vscode.md` has the Open VSX account, agreement, token and `ovsx publish`
  steps.
- **State on 2026-10-06**: `shythulu/darkberry-with-tints-theme` 0.3.0 is on Open VSX (0
  downloads); the plain `darkberry-theme` is not. Both are on the Visual Studio Marketplace under
  the publisher `Slacklab`, which the in-app search does not query. So a search for "Darkberry"
  inside T3 Code today finds only the with-tints extension.
- **Steps**:
  1. Publish `dist/darkberry-theme-<version>.vsix` to Open VSX under `shythulu` (`npx ovsx
     publish dist/darkberry-theme-<version>.vsix -p <token>`), as `vscode.md` step 6 says.
  2. In T3 Code, Settings → Appearance → Search community themes → "Darkberry", confirm both
     listings appear, import one and compare it with the hand-tuned file for the same flavour.
  3. Mention in the VS Code listing copy (`copy/vscode.md`) that T3 Code imports it, and that
     `ports/t3code/` holds the tuned version.
- **Updates**: the same as the VS Code port: bump `version`, `./package.sh`, `ovsx publish` again.
- **Contacts**: Open VSX namespace and operations issues at
  https://github.com/EclipseFdn/open-vsx.org; the registry software at
  https://github.com/eclipse-openvsx/openvsx.
- **Sources**: `apps/web/src/components/settings/ThemeSearchSection.tsx`,
  `apps/web/src/openVsxThemes.ts` and `apps/web/src/vscodeThemeImport.ts` in
  https://github.com/pingdotgg/t3code at `main` (fetched 2026-10-06); Open VSX search API for
  `darkberry` and the Marketplace `extensionquery` API (both queried 2026-10-06).
- **Confidence**: verified. The search, the registry it queries and the conversion are read from
  the app's source; the listing state from the two registries' APIs.

### T3 Themes, the community gallery

- **URL**: https://t3themes.com/ (gallery), https://t3themes.com/submit (prefilled pull request),
  https://github.com/SunkenInTime/t3-themes (the repository the gallery is built from).
- **Kind**: community gallery, not affiliated with T3 Tools. Every theme is screenshotted inside
  the real app in light and dark; visitors sign in with GitHub to like, and copy a theme's JSON to
  paste into Settings → Appearance → Import theme. Catppuccin Frappé, Macchiato and Mocha are
  already listed there, by a third party.
- **Accepts**: one file, `themes/<id>.json`, in T3 Code's `ThemeFile` v1 format plus two
  gallery-only fields: `author` (the PR opener's GitHub username; only the author may change or
  delete the theme later) and `description` (200 characters or fewer). Rules, enforced by the
  app's own parser vendored at `src/vendor/t3code/themePalette.ts`: `version` exactly `1`; `id`
  matching `^[a-z0-9][a-z0-9-]{0,47}$` and not a reserved id (`system`, `light`, `dark`,
  `t3-chat`, `grove`, `ocean`, `ember`, `iris`, any `t3-*` alias); `name` 48 characters or fewer;
  `appearance` `light` or `dark`; `colors` with at least one valid role; optional `variants`
  keyed by the other appearance only. Values must be literal CSS colours (hex is fine). The
  filename must equal the `id`. Omitted roles fall back to the pink T3 Chat palette, so the
  guide asks for the surfaces, foregrounds, accents and `border` at minimum; the port sets all 57.
  A `variants` block for the other appearance is "strongly encouraged": it gets the theme both
  screenshots and the hover crossfade on its card. The port's files already carry one.
- **Requirements**: a GitHub account; one theme per pull request; the diff must touch only the
  new `themes/<id>.json`; `npm install && npm run validate` must print `✓ N theme file(s) valid`.
  No fee, no signing. Screenshots are generated in CI after merge.
- **Steps**:
  1. Three entries, `darkberry-fen`, `darkberry-mire` and `darkberry-blackwater`, each with Wisp
     as its light half, as the port ships them (decided 2026-10-07).
  2. Add `"author": "shythulu"` and a `description` to a copy of the built file; keep `id`,
     `name`, `appearance`, `colors` as built. The `$comment` header is ignored by the parser but
     is noise in a gallery file, so drop it in the copy.
  3. Either paste the JSON at https://t3themes.com/submit, which validates and previews it and
     opens the pull request, or fork the repository, add `themes/<id>.json`, run `npm run
     validate`, and open the PR by hand.
  4. Repeat for the other two files, one PR each.
- **Updates**: a later PR from the same GitHub account changing the file in place; the filename
  and `id` stay stable.
- **Contacts**: issues and pull requests at https://github.com/SunkenInTime/t3-themes.
- **Sources**: https://github.com/SunkenInTime/t3-themes `README.md` and
  `docs/contributing-a-theme.md` at `e3022c7b` (fetched 2026-10-06); https://t3themes.com/submit
  (fetched 2026-10-06); `themes/catppuccin-mocha.json` in the same repository.
- **Confidence**: verified for the file rules and the PR mechanics, which are read from the
  contributing guide and the vendored parser; the submit page's exact form fields and whether
  sign-in is needed to open the prefilled PR were not exercised.

### The themes folder and `t3 theme set` (install, not publishing)

- **URL**: none; `~/.t3/userdata/themes/<id>.json` on the machine running the desktop app or the
  server, documented at `docs/user/appearance.md` in the upstream repository.
- **Kind**: the app's own distribution mechanism for a machine's themes. The desktop app's local
  environment watches the folder and lists each file under Settings → Appearance; on a server,
  `t3 theme set <id>` makes it the default for connected clients, `t3 theme show` lists what is
  published, `t3 theme clear` removes the default. A file is capped at 32 KiB, 32 files per
  folder; symlinked files are skipped; invalid files are silently not published.
- **Accepts**: the built files as they are. The parser ignores the `$comment` header and an
  embedded `id` (the filename is the id).
- **Steps**: the port's usage file. Nothing to submit.
- **Sources**: `docs/user/appearance.md`, `apps/server/src/environmentTheme.ts`,
  `apps/server/src/cli/theme.ts` and `packages/contracts/src/server.ts` at `v0.0.40` (fetched
  2026-10-06).
- **Confidence**: verified from source; the folder path was confirmed on this machine
  (`~/.t3/userdata/themes/` existed, empty, on T3 Code 0.0.40).

## Not applicable

- **Upstream `pingdotgg/t3code`.** `CONTRIBUTING.md` (fetched 2026-10-06) says the maintainers
  "are not actively seeking outside contributions", that features and intentional behaviour
  changes need prior explicit maintainer approval in an Ideas discussion before a PR, and that
  "unsolicited features, opinionated rewrites, and unrelated cleanup" are not accepted. The five
  built-in themes (T3 Chat, Grove, Ocean, Ember, Iris) are hardcoded in
  `packages/shared/src/themePalettes.ts`, and that file's history shows no community theme ever
  added. A PR adding Darkberry as a built-in would be closed on those rules; the Ideas category at
  https://github.com/pingdotgg/t3code/discussions/categories/ideas is the only opening, with low
  odds.
- **A theme catalogue inside the app** other than the Open VSX search: none exists at 0.0.40 or
  `main`.

## Open questions

- **Gallery file shape**: settled 2026-10-07. The port ships one file per dark flavour with Wisp
  as `variants.light`, so the gallery gets three entries with both screenshots each and no
  standalone Wisp entry. Each tint's files carry that tint's own Wisp the same way.
- **Namespace mismatch.** The Marketplace publisher is `Slacklab`, the Open VSX namespace is
  `shythulu`. T3 Code shows the Open VSX namespace in its search results. Decide whether to keep
  both, or move one before publishing the plain extension to Open VSX.
- **What the in-app search finds is the VS Code conversion.** Once both extensions are on Open
  VSX, T3 Code users will import an automatic conversion that differs from `ports/t3code/` (the
  conversion derives the status surfaces, sidebar rows and send button from VS Code keys). Decide
  whether the VS Code README should say so and point at the tuned files.
- **Tints in the gallery.** Twelve more entries, or none; the gallery has no notion of a family,
  and `description` is the only place to say "Cloudberry is Darkberry's peach tint".
