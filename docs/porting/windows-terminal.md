# Porting and publishing Windows Terminal

Windows Terminal is Microsoft's open-source (MIT) terminal for Windows 10 and 11, and the default terminal on Windows 11. A theme for it is two JSON objects. The first is a colour scheme: one entry in the `schemes` array, with a name, foreground, background, cursor, selection and the sixteen ANSI colours. The second is a UI theme: one entry in the `themes` array, which paints the tab row, the tabs and the window chrome. A colour scheme can ship as a JSON fragment file dropped into a `Fragments` folder, so the user never edits `settings.json`. A UI theme cannot: the fragment loader reads only schemes, profiles and actions, so the theme object is pasted into `settings.json` by hand. Reach is every Windows developer machine, plus the two community collections that feed each other: mbadolato/iTerm2-Color-Schemes and windowsterminalthemes.dev.

## Porting

### Format

**Two objects, two files.** Catppuccin and Rosé Pine both ship one scheme file and one theme file per variant. Darkberry would do the same.

| Object | Lives in | Keys | Can ship as a fragment | Schema |
|---|---|---|---|---|
| Colour scheme | `settings.json` → `schemes[]`, or a fragment file → `schemes[]` | 20 (name, 3 optional extras, 16 ANSI) | Yes | `SchemeList` in [profiles.schema.json](https://raw.githubusercontent.com/microsoft/terminal/main/doc/cascadia/profiles.schema.json) |
| UI theme | `settings.json` → `themes[]` only | name + `tab`, `tabRow`, `window` sub-objects | No | `Theme`, `TabTheme`, `TabRowTheme`, `WindowTheme` in the same schema |

Docs: [Color schemes](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/color-schemes), [Themes](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/themes), [JSON fragment extensions](https://learn.microsoft.com/en-us/windows/terminal/json-fragment-extensions).

**Colour scheme keys.** Every value except `name` is a hex string, `#rgb` or `#rrggbb`. The schema sets `additionalProperties: false`, so no author, licence or comment key is allowed inside the object.

| Key | Required | Notes |
|---|---|---|
| `name` | Yes | Unique across the user's schemes. Shown in the Color scheme dropdown. Min length 1. |
| `foreground` | In practice | Default text. The docs' example always sets it. |
| `background` | In practice | Pane background. |
| `cursorColor` | No | Schema default `#FFFFFF`. |
| `selectionBackground` | No | The renderer forces it opaque and paints selected text white or black by lightness (see Mapping). |
| `black` `red` `green` `yellow` `blue` `purple` `cyan` `white` | Yes in a fragment | ANSI 0 to 7. The key is `purple`, not `magenta`. |
| `brightBlack` … `brightWhite` | Yes in a fragment | ANSI 8 to 15. |

The fragment docs say a scheme added by a fragment "must define a name for itself and define every color in the color table". The scheme docs call only `cursorColor` and `selectionBackground` optional. Every published scheme sets all twenty keys.

**UI theme keys.** Theme colours accept `#rgb`, `#rrggbb`, `#rrggbbaa`, the string `"accent"` (the OS accent), the string `"terminalBackground"` (the active pane's background) or `null`. Every sub-object has `additionalProperties: false`.

| Key | Required | Accepts | Notes |
|---|---|---|---|
| `name` | Yes | string | `dark`, `light` and `system` are reserved. Shown in the Theme dropdown. |
| `window.applicationTheme` | No | `system` `dark` `light` | Buttons, menus, command palette. Default `dark`. |
| `window.useMica` | No | bool | Windows build 22621 or newer. Default false. |
| `window.frame` | No | theme colour | Active window border. Windows 11 only. Docs mark it Preview-only. |
| `window.unfocusedFrame` | No | theme colour | Inactive window border. Same caveats. |
| `window.experimental.rainbowFrame` | No | bool | Overrides both frames. Not for a theme. |
| `window.showWorkspacesButton` | No | bool | In the schema, not the docs. Not a colour. |
| `tabRow.background` | No | theme colour | The title bar when `showTabsInTitlebar` is true, which is the default. |
| `tabRow.unfocusedBackground` | No | theme colour | Same bar when the window is inactive. |
| `tab.background` | No | theme colour | The active tab. Always drawn opaque. A profile `tabColor` overrides it. |
| `tab.unfocusedBackground` | No | theme colour | Inactive tabs. `terminalBackground` or `accent` here get 30% alpha automatically. |
| `tab.showCloseButton` | No | `always` `hover` `never` `activeOnly` | Not a colour. Default `always`. |
| `tab.iconStyle` | No | enum | In the schema, not the docs. Not a colour. |

**Where the files live.** Windows only.

| File | Install type | Path |
|---|---|---|
| `settings.json` | Store or winget (stable) | `%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json` |
| `settings.json` | Store (Preview) | `%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json` |
| `settings.json` | Unpackaged (Scoop, Chocolatey, zip) | `%LOCALAPPDATA%\Microsoft\Windows Terminal\settings.json` |
| Fragment, one user | Any | `%LOCALAPPDATA%\Microsoft\Windows Terminal\Fragments\<app-name>\<any>.json` |
| Fragment, all users | Any | `%ProgramData%\Microsoft\Windows Terminal\Fragments\<app-name>\<any>.json` |
| Fragment, Store package | MSIX app extension | `<PublicFolder>\Fragments\*.json` inside a package declaring `com.microsoft.windows.terminal.settings` |

`<app-name>` is any folder name unique to the publisher, so `Darkberry`. The terminal reads every `.json` in that folder. Files must be UTF-8 (the docs warn that PowerShell's default redirect writes UTF-16).

**How a user activates one.**

1. Scheme: copy the fragment file into `%LOCALAPPDATA%\Microsoft\Windows Terminal\Fragments\Darkberry\`, or paste the object into `schemes` in `settings.json`.
2. Pick it: Settings > Profiles > Defaults > Appearance > Color scheme, or `"colorScheme": "Darkberry Mire"` under `profiles.defaults`. A pair `{ "dark": "Darkberry Mire", "light": "Darkberry Wisp" }` follows the app theme.
3. Theme: paste the theme object into `themes` in `settings.json`, then set `"theme": "Darkberry Mire"` or a `{ "dark", "light" }` pair. Themes also appear in the Theme dropdown on the Appearance page.
4. Since 1.24 the Settings > Extensions page lists every fragment source and can toggle it.

**One theme per file, or many.** Both arrays and a fragment file hold any number of entries. Microsoft's own [schemes-fragment notebook](https://github.com/microsoft/terminal/tree/main/src/tools/schemes-fragment) writes all 724 iTerm2-Color-Schemes entries into one fragment. Darkberry keeps the repo rule: one installable unit per flavour, tints in subfolders. On disk a user can still drop all twenty fragment files into the one `Fragments\Darkberry\` folder, so the tint subfolders cost nothing at install time.

**Packaging.** None for the plain files. The Store route needs an MSIX with an `appxmanifest` declaring the app extension. No theme-only sample exists: [microsoft/terminal#10970](https://github.com/microsoft/terminal/issues/10970) asked for one in 2021 and is still open.

**Version floors.**

| Feature | First release | Source |
|---|---|---|
| `schemes` | 1.0 | Always present. |
| JSON fragments | Preview 1.7, 2021-03-01 | [Preview 1.7 post](https://devblogs.microsoft.com/commandline/windows-terminal-preview-1-7-release/) |
| `themes` (tab, tabRow, window.applicationTheme) | Preview 1.16, 2022-09-13 | [Preview 1.16 post](https://devblogs.microsoft.com/commandline/windows-terminal-preview-1-16-release) |
| `useMica` | Preview 1.17, 2023-01-25 | [Preview 1.17 post](https://devblogs.microsoft.com/commandline/windows-terminal-preview-1-17-release) |
| `frame`, `unfocusedFrame` | Preview-only per the docs page | Not verified against current stable |
| Settings > Extensions page, relative media paths in fragments | Preview 1.24, 2025-08-26 | [Preview 1.24 post](https://devblogs.microsoft.com/commandline/windows-terminal-preview-1-24-release) |

An older terminal ignores a `themes` key it does not know. Nothing in the scheme object is version-gated.

**One doc to distrust.** Microsoft's [tips-and-tricks](https://learn.microsoft.com/en-us/windows/terminal/tips-and-tricks) page (2025-11-10) shows an `"import": [...]` key that pulls `themes` from separate files. Neither the settings schema nor the settings loader source has an `import` key. The loader's own comment says fragments "don't support anything but color schemes and profiles". Treat `import` as not real until a release note says otherwise.

### How Catppuccin and Rosé Pine do it

| | Catppuccin | Rosé Pine |
|---|---|---|
| Repo | https://github.com/catppuccin/windows-terminal | https://github.com/rose-pine/windows-terminal |
| Licence | MIT | MIT |
| Commit read | `4d8bb2f00fb8`, 2023-06-26 (last push 2023-12-26) | `89e1a277e4ac`, 2026-06-22 |
| Files | 8: `<flavour>.json` (scheme) and `<flavour>Theme.json` (UI theme) per flavour | 6: `<variant>.scheme.json` and `<variant>.theme.json` per variant |
| Build | Hand-written | Hand-written |
| Metadata | Only `name` inside each file. No author, licence or comment fields. | Same |
| Scheme name | `Catppuccin Mocha` | `rose-pine`, `rose-pine-moon`, `rose-pine-dawn` (slugs) |
| Distribution | README only: paste into `schemes` and `themes`, pick in Settings. No fragment, no installer. | Same, plus the `{ "dark", "light" }` pair examples for `colorScheme` and `theme`. |
| Unusual | Bright ANSI 8 to 15 repeat the normal colours except black and white. `selectionBackground` is `surface2`. Theme sets `tab.unfocusedBackground: null`. | Same bright-equals-normal pattern. Theme sets `useMica: false` explicitly. Light variant uses `applicationTheme: "light"`. |
| Template source | https://raw.githubusercontent.com/catppuccin/windows-terminal/main/mocha.json and https://raw.githubusercontent.com/catppuccin/windows-terminal/main/mochaTheme.json | https://raw.githubusercontent.com/rose-pine/windows-terminal/main/rose-pine.scheme.json and https://raw.githubusercontent.com/rose-pine/windows-terminal/main/rose-pine.theme.json |

Catppuccin's `resources/ports.yml` lists the port as `windows-terminal`, category `terminal`, platform `windows`, icon `windowsterminal`.

### Mapping

Taken from Catppuccin's `mocha.json` and `mochaTheme.json`. The Darkberry column follows `src/ports/kitty.conf`, which STYLE_GUIDE.md names as the reference for ANSI and terminal chrome.

**Colour scheme.**

| Windows Terminal key | Catppuccin | Darkberry role |
|---|---|---|
| `foreground` | text | `{ui.text}` |
| `background` | base | `{ui.background}` |
| `cursorColor` | rosewater | `{ui.cursor}` |
| `selectionBackground` | surface2 | `{ui.selection}` |
| `black` / `brightBlack` | surface1 / surface2 | `{ansi.0}` / `{ansi.8}` |
| `red` / `brightRed` | red / red | `{ansi.1}` / `{ansi.9}` |
| `green` / `brightGreen` | green / green | `{ansi.2}` / `{ansi.10}` |
| `yellow` / `brightYellow` | yellow / yellow | `{ansi.3}` / `{ansi.11}` |
| `blue` / `brightBlue` | blue / blue | `{ansi.4}` / `{ansi.12}` |
| `purple` / `brightPurple` | pink / pink | `{ansi.5}` / `{ansi.13}` |
| `cyan` / `brightCyan` | teal / teal | `{ansi.6}` / `{ansi.14}` |
| `white` / `brightWhite` | subtext1 / subtext0 | `{ansi.7}` / `{ansi.15}` |

No key exists for cursor text, URL colour, bold colour, split borders, bell, marks or indexed colours 16 and 17. Those kitty roles have no home here.

**UI theme.** Catppuccin's choice first, then what the kitty rule would give. The second column is a decision for the port, listed under Open questions.

| Windows Terminal key | Catppuccin | Darkberry, as Catppuccin | Darkberry, as kitty |
|---|---|---|---|
| `name` | `Catppuccin Mocha` | `%FULL%` | same |
| `tab.background` | base, `ff` alpha | `{ui.tab.active}ff` | `{ui.tab.indicator}ff` (STYLE_GUIDE step 11: active tab is an opaque indicator) |
| `tab.unfocusedBackground` | null | `null` | `{ui.tab.inactive}ff` |
| `tabRow.background` | mantle | `{ui.pane.secondary}ff` | `{ui.pane.tertiary}ff` (kitty's `tab_bar_background`) |
| `tabRow.unfocusedBackground` | crust | `{ui.pane.tertiary}ff` | same |
| `window.applicationTheme` | `dark` (`light` for Latte) | `%SCHEME%` | same |
| `window.useMica` | unset | `false`, as Rosé Pine | same |
| `window.frame` / `unfocusedFrame` | unset | unset | `{ui.border.active}` / `{ui.border.inactive}` if the port decides to carry Preview-only keys |
| `tab.showCloseButton` | `always` | unset (equals the default) | same |

**Host-owned pairings.** Two fills get a foreground the app picks.

| Fill | What the app paints over it | Evidence |
|---|---|---|
| `selectionBackground` | White when the colour's lightness is under 0.5, else black. The alpha is forced to `ff`. | `src/renderer/atlas/AtlasEngine.cpp` lines 327 to 333 (main, 2026-10-08) |
| `tab.background`, `tab.unfocusedBackground` | The tab label colour is computed by the app. The 1.17 notes say it "accounts for transparent tab backgrounds when calculating the text foreground color". The exact rule was not found in `TerminalTab.cpp`. The new-tab button beside the tabs uses black at lightness 0.6 or over, else white (`TerminalPage.cpp` `_SetNewTabButtonColor`). | Partly verified |

So `ui.selection` on the three dark flavours gets white text, and on Wisp gets black text. Both pairs need measuring with `lib/color.mjs` `contrast()` for the template header.

### Build plan

**Templates.** Two files in `src/ports/`.

| Template | Output | Shape |
|---|---|---|
| `src/ports/windows-terminal.json` | one fragment file per flavour | `{ "$comment": "<header>", "schemes": [ { "name": "%FULL%", ...20 keys } ] }` |
| `src/ports/windows-terminal.theme.json` | one theme file per flavour | `{ "$comment": "<header>", "themes": [ { "name": "%FULL%", "tab": {...}, "tabRow": {...}, "window": { "applicationTheme": "%SCHEME%", "useMica": false } } ] }` |

The header goes in a root-level `$comment`, not inside the scheme or theme object, because both objects forbid extra keys in the schema. The root of a fragment is not schema-checked by the app. Whether the loader tolerates a root `$comment` in a fragment is untested. Verify it on Windows before shipping. If it fails, the header moves to the port README.

The theme file wraps the object in a `themes` array so the header has somewhere to live. The user still copies the inner object into `settings.json`, the same step Catppuccin's README gives.

**Output tree.**

```
ports/windows-terminal/
  README.md
  assets/
  Darkberry Wisp.json          fragment: schemes[1]
  Darkberry Wisp.theme.json    themes[1]
  Darkberry Fen.json
  Darkberry Fen.theme.json
  Darkberry Mire.json
  Darkberry Mire.theme.json
  Darkberry Blackwater.json
  Darkberry Blackwater.theme.json
  lingonberry/  cloudberry/  crowberry/  blueberry/
    README.md, assets/, Lingonberry Wisp.json, Lingonberry Wisp.theme.json, ...
```

File naming follows STYLE_GUIDE step 9, third case. The app reads the name from inside the file and the file name is free, so `%FULL%.<ext>`. The alternative `%SLUG%.json` (`darkberry-mire.json`, Rosé Pine's style) is an open question.

**build.mjs wiring.**

1. `const wtT = read("src/ports/windows-terminal.json"), wtThemeT = read("src/ports/windows-terminal.theme.json")`.
2. In the flavour loop: parse `fill(ctx, wtT, "windows-terminal")`, run `applyOverrides("windows-terminal", "json", obj.schemes[0], ctx)`, then `out(\`ports/windows-terminal/${full}.json\`, obj)`. Same for the theme file with kind `"json"` on the three sub-objects, or a small loop over `tab`, `tabRow`, `window`.
3. `route()` needs no change: the port is one-theme-per-file, so tints go to `ports/windows-terminal/<tint>/`.
4. Trace: `walk("windows-terminal", JSON.parse(wtT).schemes[0], "schemes")` and the same for the theme.
5. `src/overrides/windows-terminal.json` as `{ "overrides": [] }`.
6. Assertions, one `mustBe()` each:
   - `selectionBackground` is `{ui.selection}`
   - `cursorColor` is `{ui.cursor}`
   - `foreground` is `{ui.text}` and `background` is `{ui.background}`
   - the sixteen ANSI keys are `{ansi.N}` as kitty
   - `tab.background` is whichever role open question 1 settles on
   - `applicationTheme` is `%SCHEME%`
7. Converters: none. The schema's colour pattern accepts lower-case hex. The alpha suffix `{ui.background}ff` gives the `#rrggbbaa` the theme keys take.
8. `src/ports.json` entry: `{ "key": "windows-terminal", "name": "Windows Terminal", "url": "https://aka.ms/terminal", "emoji": "🪟", "categories": ["terminal"], "platform": ["windows"] }`. Catppuccin's description emoji is also 🪟. `src/usage/windows-terminal.md` carries the four activation steps above.

**What build.mjs cannot do.**

| Gap | Why |
|---|---|
| An MSIX for the Store | Needs an `appxmanifest`, `makeappx`, and either Store signing or a code-signing certificate. Windows tooling, not Node. |
| A per-user installer | A `install.ps1` that copies the fragment into `Fragments\Darkberry\` is a static file, not a template. It could sit in the port folder, but STYLE_GUIDE has no slot for it. |
| The theme object as a fragment | The loader does not read `themes` from fragments. No build change fixes that. |
| Screenshots | Windows only, so they need a Windows machine. The Store build of Windows Terminal reads `%LOCALAPPDATA%\Microsoft\Windows Terminal\Fragments\` like every other install. |

## Venues

### mbadolato/iTerm2-Color-Schemes (community multi-terminal repo)

Already described in [docs/publishing/kitty.md](../publishing/kitty.md). Summary for this port: it is the best-reach venue, because three things read its `windowsterminal/` folder.

- **URL**: https://github.com/mbadolato/iTerm2-Color-Schemes
- **Kind**: community repo. One YAML or `.itermcolors` source per scheme, 724 schemes as of 2026-10-08, with a generated `windowsterminal/<Name>.json` per scheme from `tools/templates/windowsterminal.json`.
- **Accepts**: a source file, not the Windows Terminal JSON. `yaml/<Name>.yml` in the Gogh-derived format, or `schemes/<Name>.itermcolors`. The generated Windows Terminal file carries the 20 scheme keys and nothing else: no UI theme object, no tab row colours.
- **Fields**: Name (the source file name, spaces kept: `Darkberry Mire.yml`); Author (YAML `author`); Screenshots (generated by `tools/screenshot_gen`, part of the PR).
- **Add-ons**: an optional `CREDITS.md` line.
- **Requirements**: GitHub account, local Python or Docker to run `tools/gen.py`. No fee, no signing.
- **Steps**: as kitty.md. Convert from the kitty `.conf` with `tools/kitty_to_yaml.py`, or hand-write the YAML, run `gen.py -s "Darkberry Mire"`, open one PR.
- **Updates**: edit the source, regenerate, new PR.
- **Reach beyond the repo**: three readers pull `windowsterminal/*.json`. windowsterminalthemes.dev merges it daily by cron. Microsoft's `src/tools/schemes-fragment` notebook imports it into one fragment. Ghostty bundles the repo. One merge here lands Darkberry in all three.
- **Name check**: no `Darkberry` or `DarkBerry` exists in `windowsterminal/` as of 2026-10-08. Nearest are `Banana Blueberry` and `Blue Berry Pie`.
- **Contacts**: https://github.com/mbadolato/iTerm2-Color-Schemes/issues and /pulls.
- **Sources**: https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/windowsterminal (2026-10-08, count and name check), https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/windowsterminal/Catppuccin%20Mocha.json (2026-10-08, output shape), https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/README.md (2026-10-08, "Windows Terminal color schemes" section and the `windowsterminal/*.json` output line), https://api.github.com/repos/mbadolato/iTerm2-Color-Schemes/contents/tools/templates (2026-10-08, `windowsterminal.json` template exists).
- **Confidence**: verified (output shape, name check, downstream readers). Partly verified: the YAML round-trip, as in kitty.md.

### windowsterminalthemes.dev (atomcorp/themes)

- **URL**: https://windowsterminalthemes.dev/ and https://github.com/atomcorp/themes
- **Kind**: community gallery site. Preview, copy or download themes. 1,521 stars. The site's list is built by a server cron that merges `iTerm2-Color-Schemes/windowsterminal/` with the repo's own `app/src/custom-colour-schemes.json`.
- **Accepts**: a direct PR adding one object per scheme to `app/src/custom-colour-schemes.json`, in the same 20-key shape, plus a `credits.json` entry. The README and the site both say the preferred route is iTerm2-Color-Schemes, "then everyone can benefit".
- **Fields**: Name (`name` in the scheme object); Author (`credits.json`: `{ "themeNames": ["Darkberry Mire", ...], "sources": [{ "name": "shythulu", "link": "https://github.com/shythulu" }] }`); Title (free; recent PRs use `Add <Name> theme`).
- **Add-ons**: none. No screenshot, no description field.
- **Requirements**: GitHub account to fork and PR. No CLA, fee or signing. CircleCI exists but there is no CONTRIBUTING file and no contributor-run check.
- **Steps**:
  1. Fork https://github.com/atomcorp/themes.
  2. Append the four flavour objects to `app/src/custom-colour-schemes.json`.
  3. Add one `credits.json` entry listing all four names.
  4. Open a PR titled `Add Darkberry themes`.
- **Updates**: another PR editing the same objects.
- **Activity**: the last merged theme PR is #104, 2024-06-20. Last push 2024-11-24. Six theme PRs are open from 2024-12 to 2026-09 with no response. The cron merge from iTerm2-Color-Schemes is independent of PR review, so the iTerm2 route reaches this site without a maintainer.
- **Name clash**: PR #107 "Added DarkBerry Theme" (2024-12-19, author SmileyPanix, open) proposes an unrelated scheme named `DarkBerry` with different colours. Darkberry's names are `Darkberry <Flavour>`, so they do not collide, but a visitor could confuse them if #107 ever merges.
- **Contacts**: https://github.com/atomcorp/themes/issues and /pulls.
- **Sources**: https://raw.githubusercontent.com/atomcorp/themes/master/README.md (2026-10-08), https://raw.githubusercontent.com/atomcorp/themes/master/app/src/custom-colour-schemes.json (2026-10-08, shape), https://raw.githubusercontent.com/atomcorp/themes/master/app/src/credits.json (2026-10-08, shape), https://windowsterminalthemes.dev/ (2026-10-08, Contribute section), https://github.com/atomcorp/themes/pull/107 (2026-10-08), `gh pr list -R atomcorp/themes --state all` (2026-10-08).
- **Confidence**: verified (format, routes, PR history). Unverified: the licence. GitHub cannot classify the root `license` file and `package.json` says MIT.

### Microsoft Store (MSIX app extension)

- **URL**: https://learn.microsoft.com/en-us/windows/terminal/json-fragment-extensions#microsoft-store-applications and https://partner.microsoft.com/
- **Kind**: official app store. A package declaring the `com.microsoft.windows.terminal.settings` app extension is read by Windows Terminal like a fragment folder.
- **Accepts**: an MSIX whose `appxmanifest` has `<uap3:AppExtension Name="com.microsoft.windows.terminal.settings" Id="<id>" PublicFolder="Public">`, with the fragment files in `Public\Fragments\`. Only colour schemes, profiles and actions: the UI theme object still cannot ship this way.
- **Fields**: Name, Summary, Description, Category, Publisher, Icon, Screenshots, Version, Licence (Partner Center's listing form, labels unverified).
- **Add-ons**: the package identity and publisher certificate, which the Store issues.
- **Requirements**: a Partner Center developer account. A one-time registration fee applies, amount unverified. A Windows machine with the Windows SDK to run `makeappx` and `signtool`. Store certification review. No Microsoft sample for a theme-only package exists. Issue #10970 (2021-08-17, open, milestone Backlog) asked for one. A contributor offered a UWP-template sample. The maintainer invited a `samples/` PR in 2022-08, and none arrived.
- **Steps** (first submission, unverified end to end):
  1. Register a Partner Center account and reserve the name `Darkberry for Windows Terminal`.
  2. Build a minimal MSIX with the manifest above, the fragment files under `Public\Fragments\`, and the Store-assigned identity.
  3. Sign with the Store flow or a test certificate for local sideload testing on Windows.
  4. Submit through Partner Center with listing text from `docs/COPY.md`.
- **Updates**: a new package version through Partner Center.
- **Contacts**: https://github.com/microsoft/terminal/issues for the extension mechanism, Partner Center support for the listing.
- **Sources**: https://learn.microsoft.com/en-us/windows/terminal/json-fragment-extensions (2026-10-08), https://github.com/microsoft/terminal/issues/10970 and its comments via `gh api` (2026-10-08), https://learn.microsoft.com/en-us/windows/uwp/launch-resume/how-to-create-an-extension (linked from the docs, not read).
- **Confidence**: partly verified. The mechanism is documented and the manifest snippet is primary. Unverified: account fee, listing form labels, whether certification accepts a package with no executable, and whether winget can list the result.

## Not applicable

- **Microsoft's Theme gallery and Custom scheme gallery** (https://learn.microsoft.com/en-us/windows/terminal/custom-terminal-gallery/theme-gallery, https://learn.microsoft.com/en-us/windows/terminal/custom-terminal-gallery/custom-schemes, both read 2026-10-08). Hand-curated docs pages with three example themes and a handful of schemes. The only submission route is "Show us on Twitter @WindowsDocs". A docs PR to MicrosoftDocs/terminal would be documentation, not a theme listing.
- **winget**. winget lists installers (exe, msi, msix, portable zip with an executable), not JSON files. A Darkberry entry would need the signed MSIX from the Store route first. No theme-only winget package was found (search 2026-10-08).
- **Windows Terminal's own repo**. `defaults.json` ships seven first-party schemes (Campbell, Campbell Powershell, Vintage, One Half Dark and Light, Tango Dark and Light). The docs point users elsewhere for more. No contribution path for third-party schemes.
- **Gogh**. Its README (read 2026-10-08) covers Linux and macOS, plus Cygwin/Mintty on Windows. `apply-colors.sh` has no Windows Terminal target. Submitting there reaches other terminals, not this one.

## Open questions

1. **Active tab colour.** Catppuccin paints `tab.background` with `base`, the same as the pane. STYLE_GUIDE step 11 says an active tab is an opaque `ui.tab.indicator`, which is the tint. The app picks the tab label colour itself, so the tint needs a contrast check it cannot be given through the file. Pick one before writing the assertion.
2. **Tab row surfaces.** Catppuccin uses `mantle` for the row and `crust` when unfocused. Kitty's template uses `crust` for the bar and `mantle` for inactive tabs. The Mapping table shows both. Pick one.
3. **Header placement.** A root `$comment` in a fragment file is the only place the header fits, because the scheme and theme objects forbid extra keys. Test on Windows that the loader still reads the scheme with that key present.
4. **File names.** `%FULL%.json` (STYLE_GUIDE step 9) or `%SLUG%.json` (Rosé Pine's style, no spaces). Spaces are legal in both the Fragments folder and the Store package.
5. **Preview-only keys.** `window.frame` and `window.unfocusedFrame` are marked Preview-only on a docs page last updated 2023-09-28. Decide whether to carry them, and check current stable on Windows.
6. **Venue order.** Submit to iTerm2-Color-Schemes first and let windowsterminalthemes.dev pick it up by cron. The direct atomcorp PR goes into a queue that has not merged since 2024-06. It adds nothing the cron does not.
7. **Tints.** Twenty YAML sources in iTerm2-Color-Schemes, or four. The repo keeps everything flat, so `Lingonberry Mire` sits beside `Darkberry Mire`. Same decision as kitty.md.
8. **The DarkBerry PR #107 on atomcorp/themes.** Whether to comment on it to note the name is in use elsewhere, or leave it. It is unrelated work by another author.
9. **Store packaging.** Whether an MSIX is worth a Partner Center account and Windows build tooling for a port that also installs by copying one file.
10. **Whose GitHub account** opens the PRs, as in kitty.md.
