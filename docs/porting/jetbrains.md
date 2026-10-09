# Porting and publishing JetBrains IDEs

JetBrains IDEs share the IntelliJ Platform, so one theme covers IntelliJ IDEA, PyCharm, WebStorm, Rider, GoLand, CLion, PhpStorm, RubyMine, DataGrip and Android Studio. A theme is a plugin. The plugin is a `.jar` holding `META-INF/plugin.xml`, one `<name>.theme.json` per UI theme and one editor scheme `.xml` per theme. The venue is the JetBrains Marketplace, which the IDE's own Plugins tab reads. Reach is large: Catppuccin's listing shows 2,179,450 downloads (2026-10-08). JetBrains Fleet was discontinued in December 2025. Catppuccin themed it, so it is covered at the end under Not applicable.

## Porting

### Format

A theme plugin is a zip with the `.jar` extension. It needs no code and no Gradle. The SDK's sample is [theme_basics](https://github.com/JetBrains/intellij-sdk-code-samples/tree/main/theme_basics): a `resources/` folder with `META-INF/plugin.xml`, `theme_basics.theme.json` and `Lightning.xml`.

| File | Format | Required | Docs |
|---|---|---|---|
| `META-INF/plugin.xml` | XML | yes | [Plugin Configuration File](https://plugins.jetbrains.com/docs/intellij/plugin-configuration-file.html) |
| `<name>.theme.json`, one per UI theme | JSON | yes | [Theme Structure](https://plugins.jetbrains.com/docs/intellij/theme-structure.html), [Customizing Themes](https://plugins.jetbrains.com/docs/intellij/themes-customize.html) |
| `<name>.xml`, one editor scheme per theme | XML | optional, but every real theme ships one | [Editor Schemes](https://plugins.jetbrains.com/docs/intellij/themes-extras.html) |
| `META-INF/pluginIcon.svg` (and `pluginIcon_dark.svg`) | SVG, 40×40 | needed for the Marketplace | [Plugin Logo](https://plugins.jetbrains.com/docs/intellij/plugin-icon-file.html) |
| background images | PNG | optional | [Background Images](https://plugins.jetbrains.com/docs/intellij/themes-extras.html) |

The `.theme.json` file:

| Key | Meaning | Notes |
|---|---|---|
| `name` | Shown in Settings > Appearance > Theme | Docs say it matches the file name's first part; Catppuccin uses "Catppuccin Mocha" in `mocha.theme.json`, so the IDE does not enforce it |
| `author` | Theme author | Free text, Catppuccin puts an email in it |
| `dark` | `true` builds on Darcula, `false` on Light | Decides every default the theme does not set |
| `editorScheme` | Path to the editor scheme XML inside the jar | `"/themes/mire.xml"` |
| `parentTheme` | Inherit another theme's keys | `"Islands Dark"` or `"Islands Light"` for the 2025.3+ Islands UI |
| `colors` | Named colours, used by name inside `ui` | Catppuccin defines its whole palette here, then `primaryBackground` and so on |
| `ui` | `Element.property` keys, grouped by element | Values are hex or a name from `colors`. `*` sets defaults for every element |
| `icons` | `ColorPalette` recolours the built-in icons, or swaps icon files | Catppuccin sets `ColorPalette` only |
| `background`, `emptyFrameBackground` | Image, transparency, fill, anchor | Not used by either reference port |

The `ui` keys are discovered from the platform's `*.themeMetadata.json` files. The full list is [IntelliJPlatform.themeMetadata.json](https://github.com/JetBrains/intellij-community/blob/master/platform/platform-resources/src/themes/metadata/IntelliJPlatform.themeMetadata.json) plus [JDK.themeMetadata.json](https://github.com/JetBrains/intellij-community/blob/master/platform/platform-resources/src/themes/metadata/JDK.themeMetadata.json). Naming is `Object[.SubObject].[state][Part]Property`, per [Exposing Theme Metadata](https://plugins.jetbrains.com/docs/intellij/themes-metadata.html). An eight-digit hex value is `RRGGBBAA`, so `00` at the end is transparent.

The editor scheme XML:

| Element | Meaning |
|---|---|
| `<scheme name="Darkberry Mire" version="142" parent_scheme="Darcula">` | `parent_scheme` is `Default` for light, `Darcula` for dark. `name` is what Settings > Editor > Color Scheme lists |
| `<colors><option name="CARET_COLOR" value="f5e0dc"/>` | Editor-wide colours: caret, gutter, line numbers, selection, diff lines, VCS file status, `ScrollBar.*` |
| `<attributes><option name="DEFAULT_KEYWORD"><value><option name="FOREGROUND" value="…"/>…` | Syntax and console attributes. `FOREGROUND`, `BACKGROUND`, `FONT_TYPE` (1 bold, 2 italic, 3 both), `EFFECT_TYPE`, `EFFECT_COLOR` |
| `<option name="X" baseAttributes="DEFAULT_KEYWORD"/>` | Inherit another attribute |

Hex values in the XML carry no `#` in every example the docs and both reference ports give. Whether a leading `#` is tolerated is unverified. The same XML exported from the IDE has the `.icls` extension and can be imported on its own through Settings > Editor > Color Scheme > gear > Import Scheme. That gives a plugin-free path for the editor colours only. The UI theme needs the plugin.

`plugin.xml`:

| Element | Required | Rule |
|---|---|---|
| `<id>` | yes in practice | Reverse-domain, fixed forever. Catppuccin: `com.github.catppuccin.jetbrains` |
| `<name>` | yes | Marketplace name. See the venue's name rules |
| `<version>` | yes | Semver. The Marketplace refuses a repeated version |
| `<vendor url="" email="">` | yes | Vendor name or organisation ID. `url` and `email` show on the listing |
| `<description>` | yes | HTML in CDATA. First sentence in English; the first 40 characters become the card summary |
| `<change-notes>` | no | HTML. Must not be the template placeholder text |
| `<idea-version since-build="231"/>` | yes | Lowest build. Leave `until-build` off unless publishing per IDE release |
| `<depends>com.intellij.modules.platform</depends>` | yes | Makes the plugin compatible with every IntelliJ-based IDE |
| `<themeProvider id="…" path="/themes/mire.theme.json"/>` | one per UI theme | `id` must be unique and never change. `targetUi="islands"` marks an Islands variant (values from `TargetUIType.kt`: `NEW`, `CLASSIC`, `NEXT`, `UNSPECIFIED`, `ISLANDS`) |
| `<bundledColorScheme id="…" path="/themes/mire"/>` | one per extra scheme | Path without `.xml`. `id` must equal the scheme's `name`. Only needed for schemes no `themeProvider` references |
| `<idea-plugin url="">` | no | Plugin homepage on the listing |

Where it lives and how it is installed:

| OS | Plugins directory |
|---|---|
| Windows | `%APPDATA%\JetBrains\<Product><Version>\plugins` |
| macOS | `~/Library/Application Support/JetBrains/<Product><Version>/plugins` |
| Linux | `~/.local/share/JetBrains/<Product><Version>` |

1. Settings > Plugins > gear > Install Plugin from Disk, pick the `.jar` or `.zip`, restart if asked.
2. Settings > Appearance & Behavior > Appearance > Theme picks the UI theme. Picking it switches the editor scheme named in `editorScheme` too.
3. Settings > Editor > Color Scheme picks an editor scheme on its own.

One `.theme.json` is one UI theme. One plugin holds any number of them: Catppuccin's holds 8 UI themes and 8 editor schemes. So the tints can be one bundle, as VS Code's `with-tints/` is, or one plugin per tint. The plugin jar is the packaging. Catppuccin's Gradle build produces `build/libs/<name>-<version>.jar`, which the Marketplace and the IDE accept directly.

### How Catppuccin and Rosé Pine do it

`rose-pine/jetbrains` does not exist (checked `gh api orgs/rose-pine/repos`, 2026-10-08). The Rosé Pine site's [JetBrains IDEs page](https://rosepinetheme.com/themes/jetbrains-ides) links `bomgar/rose-pine-jetbrains` (2026-10-08), so that is the reference. An older unrelated listing, "Rosé Pine" by Jon Morgan (`jmorjsm/rose-pine-intellij`, plugin 18141, 49,953 downloads, last version 0.1.0 on 2023-12-14), has more downloads but is abandoned.

| | Catppuccin | Rosé Pine (community) |
|---|---|---|
| Repo | https://github.com/catppuccin/jetbrains | https://github.com/bomgar/rose-pine-jetbrains |
| Licence | MIT | MIT |
| Checked at | `01b38e9`, 2026-07-18, 579 stars | `7eb5fc7`, 2026-10-02, 14 stars, created 2025-08-10 |
| Variants | 4 flavours × 2 UI (classic, Islands) = 8 `.theme.json`; 4 flavours × 2 schemes (italics, no italics) = 8 `.xml` | 3 variants × 2 UI (classic, Islands) = 6 `.theme.json`; 3 `.xml` |
| Build | [Whiskers](https://whiskers.catppuccin.com) renders `templates/ui.theme.tera` (598 lines) and `templates/editor.tera` (3,274 lines) into `src/main/resources/themes/`, which is gitignored. Gradle Kotlin with IntelliJ Platform Gradle Plugin 2.18.1 builds, signs, verifies and publishes | [Bloom](https://github.com/rose-pine/build) renders `template/rose_pine.theme.json` (504 lines), `template/rose_pine.xml` (3,075 lines) and `template/rose_pine_islands.theme.json` via a `justfile` into `src/main/resources/`, committed. Gradle from the IntelliJ Platform Plugin Template |
| Metadata | `plugin.xml` (id, name, vendor, description, 8 `themeProvider`, 8 `bundledColorScheme`) and `gradle.properties` (version 3.6.1, since-build 231, until-build 262.*) | `plugin.xml` (6 `themeProvider` with UUID ids, no `bundledColorScheme`) and `gradle.properties` (version 1.1.6, since-build 243) |
| Distribution | Marketplace plugin 18682 "Catppuccin Theme", vendor organisation "Catppuccin" (non-trader, GB), 2,179,450 downloads. `publish.yml` runs `publishPlugin` on a `v*` tag and drafts a GitHub release with the jar | Marketplace plugin 28154 "Rose Pine Theme", 10,983 downloads, latest 1.1.5 on 2026-03-31. `release.yml` runs `publishPlugin` with signing secrets on a GitHub release |
| Unusual | `colors` block carries the whole palette plus semantic names. Islands variants use `targetUi="islands"` and `parentTheme`. Scheme `ERROR_HINT` is a hard-coded `781732` on dark flavours because the stock red looked better | `arc: 7` on `*` rounds every control. Islands variants are a separate template, not a flag |

Template files a Darkberry template derives from:

- UI theme: https://raw.githubusercontent.com/catppuccin/jetbrains/main/templates/ui.theme.tera
- Editor scheme: https://raw.githubusercontent.com/catppuccin/jetbrains/main/templates/editor.tera
- Rosé Pine UI theme, for a second opinion on key choice: https://raw.githubusercontent.com/bomgar/rose-pine-jetbrains/main/template/rose_pine.theme.json

Catppuccin's rendered per-flavour files are not in git. The built jar on the Marketplace is the only rendered artefact.

### Mapping

Catppuccin's `ui` block has 55 element groups and 307 leaf values. Its editor scheme has 90 `<colors>` options and 511 `<attributes>` options, 137 of them inherited through `baseAttributes`. The full key sets are in the two template URLs above. The tables below give the named colours the `ui` block is built from, the editor colours that carry a shared meaning, and the syntax attributes, which is enough to write the Darkberry template by swapping names. Darkberry's accent order matches Catppuccin's (`rosewater`→`blossom`, `flamingo`→`petal`, `pink`→`berry`, `mauve`→`plum`, `red`→`cranberry`, `maroon`→`cherry`, `peach`→`apricot`, `yellow`→`honey`, `green`→`gooseberry`, `teal`→`juniper`, `sky`→`frost`, `sapphire`→`bilberry`, `blue`→`blueberry`, `lavender`→`lavender`). The role column is the suggested Darkberry role, not Catppuccin's choice.

Named colours in `ui.theme.tera`:

| Named colour | Catppuccin value | Darkberry role |
|---|---|---|
| `accentColor` | `mauve` | `ui.accent` |
| `secondaryAccentColor` | `yellow` | `ui.warning` |
| `primaryForeground`, `panelForeground` | `text` | `ui.text` |
| `primaryBackground` | `base` | `ui.background` |
| `secondaryBackground` | `surface0` | `surface0` (structural) |
| `panelBackground` | `mantle` | `ui.pane.secondary` |
| `inactiveBackground`, `toolbarBackground` | `crust` | `ui.pane.tertiary` |
| `hoverBackground` | `overlay2` mixed into `base` at 0.3 | `surface1` (structural) |
| `selectionBackground` | `overlay2` mixed into `base` at 0.2 | `ui.selection` |
| `selectionInactiveBackground` | `base` | `ui.background` |
| `borderColor` | `base` dark, `crust` light | `ui.border.inactive` or structural |
| `separatorColor` | `surface0` | `surface0` (structural) |
| `searchMatchBackground` | accent (30% alpha on light) | `ui.search.matches` |
| `textFieldBackground` | `surface2` dark, `surface1` light | structural |
| `gitLogBackground`, `dragAndDropBackground` | accent at 5% and 15% alpha | `ui.accent` with alpha suffix |
| `tabBackground` | accent mixed into `base` at 0.2 | `ui.tab.active` |
| `*.focusColor` | `accentColor` | `ui.focus` |
| `*.infoForeground` | `subtext0` | `ui.text.muted` |
| `Banner.errorBackground` and kin | `red`, `blue`, `peach` at 10% alpha | `ui.error.surface`, `ui.info.surface`, `ui.warning.surface` |
| `Link.*` | `blue` | `ui.link` |
| `Counter`, badges | accent under `base` | `ui.badge` under `ui.on.badge` |
| `Button.default.*` | accent under `base` | `ui.fill` under `ui.on.fill` |

Editor `<colors>` with a shared meaning:

| Scheme key | Catppuccin value | Darkberry role |
|---|---|---|
| `CARET_COLOR` | `rosewater` | `ui.cursor` |
| `CARET_ROW_COLOR` | `surface1` mixed into `base` at 0.15–0.2 | `ui.line.current` |
| `SELECTION_BACKGROUND` | `surface2` mixed into `base` at 0.4–0.6 | `ui.selection` |
| `GUTTER_BACKGROUND`, `CONSOLE_BACKGROUND_KEY` | `base` | `ui.background` |
| `LINE_NUMBERS_COLOR` | `overlay0` | `ui.text.subtle` |
| `LINE_NUMBER_ON_CARET_ROW_COLOR` | `lavender` | `ui.text` |
| `ADDED_LINES_COLOR`, `MODIFIED_LINES_COLOR`, `DELETED_LINES_COLOR` | `green`, `peach`, `maroon` | `ui.diff.added`, `ui.diff.changed`, `ui.diff.removed` |
| `FILESTATUS_MODIFIED`, `FILESTATUS_ADDED`, `FILESTATUS_DELETED` | `blue`, `green`, `surface2` | `ui.diff.changed`, `ui.diff.added`, `ui.text.subtle` |
| `TAB_UNDERLINE` | `mauve` | `ui.tab.indicator` |
| `TAB_UNDERLINE_INACTIVE` | `text` | `ui.tab.inactive` |
| `INDENT_GUIDE`, `RIGHT_MARGIN_COLOR`, `METHOD_SEPARATORS_COLOR` | `surface0` | structural |
| `WHITESPACES` | `overlay2` | structural |
| `DOC_COMMENT_LINK` | `blue` | `ui.link` |
| `NOTIFICATION_BACKGROUND`, `DOCUMENTATION_COLOR` | `mantle` | `ui.pane.secondary` |
| `ScrollBar.thumbColor`, `ScrollBar.Mac.thumbColor` | `surface0`, hover `surface1` | structural |
| `VCS_ANNOTATIONS_COLOR_1..5` | accent mixed into `base`, 0.4 down to 0.1 | `ui.accent` mixes |

Editor `<attributes>` (the `DEFAULT_*` keys most language plugins inherit):

| Attribute | Catppuccin foreground | Font | Darkberry role |
|---|---|---|---|
| `TEXT` | `text` on `base` | | `syntax.text` |
| `DEFAULT_KEYWORD` | `mauve` | | `syntax.keyword` |
| `DEFAULT_STRING` | `green` | | `syntax.string` |
| `DEFAULT_VALID_STRING_ESCAPE` | `pink` | | `syntax.number` (the style guide's escape rule) |
| `DEFAULT_NUMBER`, `DEFAULT_CONSTANT`, `DEFAULT_IDENTIFIER` | `peach` | | `syntax.number`, `syntax.constant`, `syntax.variable` |
| `DEFAULT_LINE_COMMENT`, `DEFAULT_BLOCK_COMMENT`, `DEFAULT_DOC_COMMENT` | `overlay2` | italic | `syntax.comment` |
| `DEFAULT_DOC_COMMENT_TAG` | `red` | italic | `syntax.keyword` |
| `DEFAULT_FUNCTION_DECLARATION`, `DEFAULT_FUNCTION_CALL` | `blue` | italic | `syntax.function` |
| `DEFAULT_CLASS_NAME`, `DEFAULT_INTERFACE_NAME` | `yellow` | italic | `syntax.type` |
| `DEFAULT_PARAMETER` | `maroon` | italic | `syntax.variable` |
| `DEFAULT_LOCAL_VARIABLE`, `DEFAULT_INSTANCE_FIELD`, `DEFAULT_LABEL` | `text` | | `syntax.variable`, `syntax.property` |
| `DEFAULT_STATIC_FIELD`, `DEFAULT_TAG` | `teal` | | `syntax.property`, `syntax.keyword` |
| `DEFAULT_OPERATION_SIGN` | `sky` | | `syntax.operator` |
| `DEFAULT_BRACES`, `DEFAULT_PARENTHS` | `overlay2` | | `syntax.punctuation` |
| `DEFAULT_ATTRIBUTE` | `yellow` | | `syntax.property` |
| `DEFAULT_METADATA` (annotations, decorators) | `yellow` | italic | `syntax.function` (the style guide's decorator rule) |
| `DEFAULT_PREDEFINED_SYMBOL` | `lavender` | italic | `syntax.constant` |
| `DEFAULT_TEMPLATE_LANGUAGE_COLOR` | `flamingo` | | `syntax.namespace` |
| `ERRORS_ATTRIBUTES`, `WARNING_ATTRIBUTES`, `TYPO` | undercurl in `red`, `peach`, `green` | | `ui.error`, `ui.warning`, `ui.success` |
| `TEXT_SEARCH_RESULT_ATTRIBUTES`, `SEARCH_RESULT_ATTRIBUTES` | `blue` mixed into `base` at 0.3 | | `ui.search.matches` |
| `MATCHED_BRACE_ATTRIBUTES` | `text` on `surface2` | | `ui.mark1` |
| `IDENTIFIER_UNDER_CARET_ATTRIBUTES` | effect `surface2` | | `ui.mark2` |
| `DIFF_INSERTED`, `DIFF_DELETED`, `DIFF_MODIFIED` | `green`, `red`, `blue` mixed into `base` at 0.25 | | `ui.diff.*` mixes |
| `CONSOLE_BLACK_OUTPUT` … `CONSOLE_WHITE_OUTPUT` | `surface1`/`subtext1`, `red`, `green`, `yellow`, `blue`, `pink`, `teal`, `text` | | `ansi.0`..`ansi.7` as `src/ports/kitty.conf` |
| `CONSOLE_*_BRIGHT_OUTPUT` | not set by Catppuccin | | `ansi.8`..`ansi.15` |
| `CONSOLE_ERROR_OUTPUT`, `LOG_ERROR_OUTPUT` | `maroon` | | `ui.error` |
| `INLINE_PARAMETER_HINT` | `text` on `surface0` | | structural |

### Build plan

Templates to add:

| Template | Output | Notes |
|---|---|---|
| `src/ports/jetbrains.theme.json` | `ports/jetbrains/themes/%SLUG%.theme.json` | `name` is `%FULL%`, `dark` is `%ISDARK%`, `editorScheme` is `/themes/%SLUG%.xml`. The header block goes in a `$comment`-style key only if the IDE ignores unknown top-level keys, which is unverified. Otherwise the header goes in `author` or is dropped |
| `src/ports/jetbrains.xml` | `ports/jetbrains/themes/%SLUG%.xml` | `<scheme name="%FULL%" parent_scheme="…">`. The parent scheme differs by scheme, so it needs a `%SCHEME%`-driven name or a role. The `#` must be stripped from every value, which needs a converter in `build.mjs` like the Kate alpha one |
| generated in `build.mjs` | `ports/jetbrains/META-INF/plugin.xml`, `META-INF/pluginIcon.svg` | As `ports/vscode/package.json` is generated. `themeProvider` ids `ca.slacklab.darkberry.<flavour>` and `ca.slacklab.darkberry.<tint>.<flavour>`, fixed forever |

Output tree, following the VS Code shape because one plugin holds many themes:

```
ports/jetbrains/
  README.md
  assets/                        preview.webp, <flavour>.webp
  META-INF/plugin.xml            4 themeProvider entries, id ca.slacklab.darkberry
  META-INF/pluginIcon.svg        40×40 export of the logo
  themes/darkberry-wisp.theme.json
  themes/darkberry-wisp.xml
  ...                            fen, mire, blackwater
  dist/darkberry-theme-<version>.jar      written by package.sh
  with-tints/                    the same again with 20 themes, id ca.slacklab.darkberry-with-tints
```

What `build.mjs` cannot do today:

- Make the jar. A jar is a zip with `META-INF/` at the root, so `package.sh` can do it with `zip -r` or `jar cf`. No Java is needed for an unsigned jar.
- Sign the jar. Signing needs Java and the [Marketplace ZIP Signer CLI](https://github.com/JetBrains/marketplace-zip-signer) with a self-generated certificate chain and private key. The SDK says the CLI is the route "when working with Themes" without Gradle. An unsigned plugin installs with a warning dialog in the IDE.
- Strip `#` from hex values in the XML. A converter per file, as Kate's `#aarrggbb` converter.
- Run Plugin Verifier. The Marketplace runs it on upload, so this is a review step, not a build step.
- Islands variants. They need a second `.theme.json` per flavour with `parentTheme` and a `targetUi="islands"` provider, and raise the minimum IDE to 2025.3. Leave for a later change.

## Venues

### JetBrains Marketplace

- **URL**: https://plugins.jetbrains.com/ (public), https://plugins.jetbrains.com/plugin/add (first upload), https://plugins.jetbrains.com/author/me/tokens (API tokens)
- **Kind**: official store. The IDE's Settings > Plugins > Marketplace tab reads it, and the Marketplace page says it reaches "over 10 million users". Catppuccin Theme has 2,179,450 downloads there.
- **Accepts**: one `.jar` or `.zip` up to 400 MB with `META-INF/plugin.xml` inside. Every new plugin and every update goes through automated checks (Plugin Verifier) and a manual review before it is public.
- **Fields**: Name (`<name>`, approval guidelines say 30 characters max, the listing-best-practices page says 60 max and recommends 20; no "Plugin", "IntelliJ", "JetBrains" or product names; title case); Summary (the first 40 characters of `<description>` become the card text, English); Description (`<description>` HTML in CDATA, English first, editable on the site after upload); Keywords and Category (Tags on the upload form, at least one; Catppuccin carries Theme, Editor, Editor Color Schemes, User Interface; the API marks Theme as `privileged`, see Confidence); Author and Publisher (the Vendor profile: Vendor ID fixed forever, public name, email and website editable; `<vendor url email>` in `plugin.xml`); Homepage (`<idea-plugin url>` and the vendor website); Repository (source code URL on the upload form, required when the licence is open source, editable under Technical Information); Support (bug tracker URL under Technical Information); Licence (upload form, mandatory, a link; MIT); Version (`<version>`, semver, never repeated); Icon (`META-INF/pluginIcon.svg`, SVG only, 40×40 with 2 px padding, optional `pluginIcon_dark.svg`, must not be the template logo); Screenshots (Media section of the plugin's admin page after upload; required for theme plugins; 1280×800 at 16:10 recommended, 1200×760 minimum, all the same aspect ratio, no device photos or desktop backgrounds; Catppuccin shows 5).
- **Add-ons**: `<change-notes>` (no placeholder text, English first); `<idea-version since-build>`; `<depends>com.intellij.modules.platform</depends>`; stable `themeProvider` ids; the trader or non-trader declaration on the Vendor profile (EU consumer law; a trader must give a registration number, ID, address and banking details); optional forum, privacy policy, documentation and custom contact links; optional YouTube video; optional donation link; a custom release channel and a hidden flag on upload; plugin signing (certificate chain and private key, the Gradle `signPlugin` task or the ZIP Signer CLI).
- **Requirements**: a JetBrains Account (free); acceptance of the [Developer Agreement](https://plugins.jetbrains.com/legal/developer-agreement) at first upload; a Vendor profile with trader status declared; no fee; signing is recommended, not stated as mandatory (see Confidence); the first upload must be manual through the web form; later uploads can use Gradle `publishPlugin` or `curl -F file=@… https://plugins.jetbrains.com/api/updates/upload` with a permanent token.
- **Steps**:
  1. Build `dist/darkberry-theme-<version>.jar` with `package.sh`. Optionally sign it with the ZIP Signer CLI.
  2. Install it from disk in a fresh IDE and check both the theme and the editor scheme.
  3. Sign in at https://plugins.jetbrains.com/ with the JetBrains Account.
  4. Open https://plugins.jetbrains.com/plugin/add, accept the Developer Agreement, create the Vendor profile (`Slacklab` is free as of 2026-10-08) and declare trader status.
  5. Upload the jar. Set licence MIT with its link, the source code URL, the tags, the default channel.
  6. On the plugin's admin page add the screenshots under Media, and the bug tracker and source links under Technical Information.
  7. Wait for the review notification. Chase marketplace@jetbrains.com after 2 business days (updates page) or 3–4 working days (approval guidelines).
  8. Repeat for the `with-tints` jar as a second plugin, if that scope is chosen.
- **Updates**: bump `<version>`, rebuild, upload through the plugin page's Upload Update, Gradle `publishPlugin`, or the upload API with a token. Each update is reviewed again. Installed IDEs are notified once it is verified.
- **Contacts**: marketplace@jetbrains.com (upload and review), plugins-admin@jetbrains.com (approval questions), https://platform.jetbrains.com/c/marketplace/8 (forum).
- **Sources**: https://plugins.jetbrains.com/docs/marketplace/uploading-a-new-plugin.html (2026-10-08); https://plugins.jetbrains.com/docs/marketplace/best-practices-for-listing.html (2026-10-08); https://plugins.jetbrains.com/legal/approval-guidelines (2026-10-08, version 1.2); https://plugins.jetbrains.com/docs/marketplace/organizations.html (2026-10-08); https://plugins.jetbrains.com/docs/marketplace/trader-status.html (2026-10-08); https://plugins.jetbrains.com/docs/marketplace/plugin-updates.html (2026-10-08); https://plugins.jetbrains.com/docs/marketplace/publishing-and-listing-your-plugin.html (2026-10-08); https://plugins.jetbrains.com/docs/marketplace/plugin-upload.html (2026-10-08); https://plugins.jetbrains.com/docs/intellij/publishing-plugin.html (2026-10-08); https://plugins.jetbrains.com/docs/intellij/plugin-signing.html (2026-10-08); https://plugins.jetbrains.com/docs/intellij/plugin-icon-file.html (2026-10-08); https://plugins.jetbrains.com/api/plugins/18682 and `/api/vendors/slacklab` and `/api/searchPlugins?search=darkberry` (2026-10-08).
- **Confidence**: partly verified. Fields, limits, review and update paths are from the Marketplace's own docs. Unverified: whether the "Theme" tag can be self-selected (the API shows it as `privileged`); whether an unsigned upload is accepted or only warned about (the signing page says a warning shows at install, a forum thread from 2025–2026 shows the public-key upload is still "not available yet"); whether 30 or 60 is the enforced name limit; whether a second near-identical "with tints" plugin passes review; real review turnaround.

### GitHub release and Install Plugin from Disk

- **URL**: https://github.com/shythulu/DarkBerry/releases
- **Kind**: self-distribution. The IDE installs a local `.jar` or `.zip` from Settings > Plugins > gear > Install Plugin from Disk. Catppuccin's README offers this as its "Manual" route.
- **Accepts**: the same jar.
- **Fields**: Title and Description of the release (COPY.md's release-note caption).
- **Add-ons**: none.
- **Requirements**: none beyond the existing release workflow.
- **Steps**: attach `dist/darkberry-theme-<version>.jar` and the with-tints jar in `.github/workflows/release.yml`, and add the install line to the release notes.
- **Updates**: the next release. Users get no update notice.
- **Contacts**: the repository's issues.
- **Sources**: https://www.jetbrains.com/help/idea/managing-plugins.html (2026-10-08); https://plugins.jetbrains.com/docs/intellij/deploying-theme.html (2026-10-08).
- **Confidence**: verified.

### Custom plugin repository on darkberry.slacklab.ca

- **URL**: an `updatePlugins.xml` served over HTTPS, for example https://darkberry.slacklab.ca/jetbrains/updatePlugins.xml
- **Kind**: self-hosted repository the IDE can add under Settings > Plugins > gear > Manage Plugin Repositories. Users then see and update the plugin from inside the IDE without the Marketplace.
- **Accepts**: an XML list of `<plugin id url version>` with `<idea-version since-build>`, pointing at the jar's HTTPS URL.
- **Fields**: Name, Description, Version (the optional `<name>`, `<description>`, `<change-notes>` and `version` in the XML).
- **Add-ons**: `<depends>` entries.
- **Requirements**: HTTPS hosting, which the site already has. Signing: a custom repository does not re-sign, so users either accept the warning or add the public key under Settings > Plugins > Manage Plugin Certificates.
- **Steps**:
  1. Write `updatePlugins.xml` in `src/site/` with one `<plugin>` per jar.
  2. Publish the jars beside it.
  3. Put the repository URL in the usage text.
- **Updates**: edit the version and URL in the XML.
- **Contacts**: none, it is ours.
- **Sources**: https://plugins.jetbrains.com/docs/intellij/custom-plugin-repository.html (2026-10-08); https://www.jetbrains.com/help/idea/managing-plugins.html (2026-10-08).
- **Confidence**: verified from the docs, not tried.

## Not applicable

- **JetBrains Fleet**: Catppuccin has [catppuccin/fleet](https://github.com/catppuccin/fleet) (MIT, 115 stars, `2d3d95a`, 2025-12-13) and Marketplace plugin 25081 "Catppuccin Fleet Theme" (17,493 downloads, last version 1.2.2 on 2025-06-11). JetBrains stopped Fleet downloads on 2025-12-22 and ships no further updates ([The Future of Fleet](https://blog.jetbrains.com/fleet/2025/12/the-future-of-fleet/), 2026-10-08). The format, for the record: one JSON per theme with `meta` (`theme.name`, `theme.kind` Light or Dark, `theme.version`), `colors` (dotted keys such as `background.primary`, values are palette names like `Mauve` or hex), optional `textAttributes` and `palette`. User themes live in `%APPDATA%\JetBrains\Fleet`, `~/.config/JetBrains/Fleet` or `~/Library/Application Support/JetBrains/Fleet` ([Color Themes](https://www.jetbrains.com/help/fleet/color-themes.html), [JSON keys reference](https://www.jetbrains.com/help/fleet/theme-plugin-json-keys-reference.html), 2026-10-08). A plugin needs Kotlin: Catppuccin's `CatppuccinTheme.kt` calls `registerTheme(ThemeId(...))` per flavour, built with the `fleetPlugin` Gradle plugin and uploaded with `uploadPlugin`. Whether the Marketplace still accepts Fleet uploads is unverified. No reach, so no port.
- **A standalone editor-scheme listing**: the Marketplace lists editor schemes only as plugins too (the IDE's "Export > Color scheme plugin .jar" makes one). It is the same venue, not a second one.
- **Android Studio**: reads the same Marketplace. The compatible-products list on the listing is set by `plugin.xml`, not by a separate store.
- **IDE Provisioner / enterprise repositories**: for organisations distributing plugins internally. Not a public venue.
- **Third-party JetBrains theme galleries**: none with reach were found. The Marketplace's own [Themes](https://plugins.jetbrains.com/search?products=idea&includeTags=theme) tag page is the gallery.

## Open questions

- Scope: one plugin with the four flavours plus a second "Darkberry with Tints" plugin with twenty, as VS Code does, or one plugin per tint. The IDE's theme dropdown lists every installed theme flat, so twenty in one plugin is usable. Review of a near-duplicate second plugin is unverified.
- Vendor: `Slacklab` as the Vendor ID, and trader or non-trader. A non-trader is "a natural person acting outside their trade". Slacklab is a company site, which points at trader, and a trader must supply a registration number, identity document and banking details. A person decides this.
- Signing: generate a key pair and keep it as a CI secret, or ship unsigned and accept the install warning.
- Plugin ids: `ca.slacklab.darkberry` and the `themeProvider` ids are fixed forever once published. Confirm them before the first upload.
- `since-build`: Catppuccin uses 231 (2023.1), Rosé Pine 243 (2024.3). Whether older builds ignore unknown `ui` keys silently is unverified, so the floor needs a test in the oldest supported IDE.
- Islands variants: now, or after the classic theme ships. They double the theme count and need 2025.3.
- Italics: Catppuccin ships italics and no-italics scheme variants. Darkberry's style guide says italic comments, so one scheme per flavour is the default. Confirm.
- Hex format in the editor XML: no `#` in every example. Confirm in the IDE before adding a converter, or test whether `#` is tolerated.
- Icon: a 40×40 SVG export of the logo with 2 px padding, a new asset beside the 256 px PNG.
- Description source: `plugin.xml` or the README. The Marketplace can take either, and the choice sticks across updates.
