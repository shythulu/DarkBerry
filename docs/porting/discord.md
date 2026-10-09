# Porting and publishing Discord

Discord is a chat app with no theme API. Its own appearance settings stop at dark, light and the
Nitro gradient themes. A Discord theme is therefore a CSS file that a client mod injects into the
Electron app: BetterDiscord, Vencord, Equicord and Replugged all load one. BetterDiscord, Vencord and
Equicord share one file shape, `<Name>.theme.css` with a JSDoc-style META comment at the top.
Replugged wants a `manifest.json` beside the CSS instead. The web client takes the same CSS as a
Stylus userstyle. Reach is large but informal: the betterdiscord.app store's top theme shows 2.8M
downloads, Vencord has 14,208 GitHub stars, and catppuccin/discord has 1,442. The catch is that every
one of these mods breaks Discord's Terms of Service, which is covered under *Risk* below.

## Porting

### Format

One theme is one vanilla CSS file named `*.theme.css`. BetterDiscord's spec is at
https://docs.betterdiscord.app/themes/introduction/structure (2026-10-08). Vencord reads the same
header with its own parser, `src/main/themes/index.ts` (2026-10-08).

Rules the file must follow:

1. The META block is a `/** ... */` comment and must be the very first thing in the file. BetterDiscord
   may not load the theme otherwise. Vencord splits on the first `/**`.
2. The body is plain CSS in one file. Sass must be compiled, multiple files must be bundled.
3. An `@import` is allowed, but only after the META and before any other rule.
4. If the META or the CSS is missing, the theme does not load.

META fields, from BetterDiscord's table. Vencord's parser reads the ones marked in the last column.

| Field | Required | What it is | Vencord reads it |
|---|---|---|---|
| `@name` | yes | Display name. Spaces allowed. | yes |
| `@author` | yes | The developer's name | yes |
| `@description` | yes | One line, shown in the store and the themes tab | yes |
| `@version` | yes | Semver recommended | yes |
| `@invite` | no | Discord invite code for a support server | yes |
| `@authorId` | no | Discord snowflake of the developer | no |
| `@authorLink` | no | Link for the author's name on addon pages | no |
| `@donate` | no | Donation link | no |
| `@patreon` | no | Patreon link | no |
| `@website` | no | Developer's or addon's site | yes |
| `@source` | no | GitHub source link | yes |
| `@license` | no | Not in BetterDiscord's list. Vencord reads it. Rosé Pine does not set it. | yes |
| `@updateUrl` | no | Not in BetterDiscord's list. Rosé Pine sets it. No mod docs mention it. | no |

Where the file goes, and how a user turns it on. Every mod has a Settings > Themes tab with an
"Open Themes Folder" button, so the user drops the file there and toggles it.

| Mod | Windows | macOS | Linux | Source |
|---|---|---|---|---|
| BetterDiscord | `%appdata%\BetterDiscord\themes` | `~/Library/Application Support/BetterDiscord/themes` | `~/.config/BetterDiscord/themes` | docs `themes/introduction/quick-start.md` (2026-10-08) |
| Vencord | `%APPDATA%\Vencord\themes` | `~/Library/Application Support/Vencord/themes` | `~/.config/Vencord/themes` | derived from `src/main/utils/constants.ts`: `THEMES_DIR` is `<Discord userData>/../Vencord/themes` (2026-10-08). The expanded paths are mine, not Vencord's docs. |
| Replugged | `%APPDATA%/replugged/themes` | `~/Library/Application Support/replugged/themes` | `~/.config/replugged/themes` | replugged wiki *Installing plugins and themes* (2026-10-08) |

Vencord has a second route that needs no file. Settings > Vencord > Themes > Online Themes takes
raw URLs, one per line. A line can start with `@light` or `@dark` so the theme follows Discord's own
switch. Vencord says to use direct links, "raw or github.io" (`OnlineThemesTab.tsx`, 2026-10-08).
This is why Catppuccin publishes compiled CSS on GitHub Pages.

One theme per file. BetterDiscord and Vencord list each `.theme.css` as its own card. So each tint
gets a subfolder, the usual Darkberry shape.

Packaging around the file:

| Route | Packaging | Notes |
|---|---|---|
| BetterDiscord, Vencord, Equicord | none | The `.theme.css` is the artifact. |
| Vencord Online Themes, Stylus `@import` | a public URL serving `text/css` | GitHub Pages is what BetterDiscord's own *Remote Imports* tutorial recommends (2026-10-08). |
| Replugged | a folder or `.asar` with `manifest.json` and `main` CSS | Manifest keys at https://guide.replugged.dev/docs/manifest (2026-10-08): `id` in reverse-DNS, `name`, `description`, `author`, `version`, `license`, `type: "replugged-theme"`, `main`, optional `splash`, `updater`, `image`, `source`. The `id` cannot change after release. |
| Stylus (web client) | a `.user.css` with a `/* ==UserStyle== */` block and an `@-moz-document` scope | userstyles.world needs at least `@name`, `@namespace`, `@version` (FAQ, 2026-10-08). Discord's CSP blocks an external `@import`, so Catppuccin tells Stylus users to enable "CSP Patching" under Settings > Advanced. Rosé Pine avoids the import by compiling a self-contained `.user.less`. |

### How Catppuccin and Rosé Pine do it

| | Catppuccin | Rosé Pine |
|---|---|---|
| Repo | https://github.com/catppuccin/discord | https://github.com/rose-pine/discord |
| Licence | MIT | MIT |
| Variants | 4 flavours, each in 14 accents: 56 compiled files on Pages. 4 stub files in `themes/`. | 3 variants, 3 files in `dist/` |
| Build | Sass. `build.js` clones each flavour's SCSS 14 times, swapping `$brand`. `sass` compiles `src/` to `dist/dist/`. Colours come from the `@catppuccin/palette` npm package. Code blocks come from `@catppuccin/highlightjs`. | `rose-pine-bloom` fills `$name`, `$id`, `$base`, `$love` and so on in one `template.theme.css`. |
| Metadata | A META comment at the top of each `src/catppuccin-<flavour>.theme.scss`: `@name`, `@author`, `@authorId`, `@version`, `@description`, `@website`, `@invite`. | A META comment at the top of the template: `@name`, `@author`, `@version`, `@description`, `@source`, `@updateUrl`. |
| Distribution | Three routes. BetterDiscord: `themes/<flavour>.theme.css`, an 11-line file that is META plus `@import url("https://catppuccin.github.io/discord/dist/catppuccin-<flavour>.theme.css")`. Custom CSS or Online Themes: that same Pages URL, with `-<accent>` optional. Stylus: `discord.user.css`, whose `@var select` dropdowns build the Pages URL. The Pages site is deployed by `.github/workflows/gh-pages.yml` on every push to `src/`. | GitHub release `v0.0.1` (2025-12-27) with the three CSS files attached. README says install Vencord or BetterDiscord and drop the file in. The web version is a separate userstyle at `rose-pine/userstyles/styles/discord/rose-pine.user.less`. |
| Store listings | None found. `betterdiscord.app/themes/Catppuccin` returns 404 while `/themes/ClearVision` returns 200. The themes.equicord.org API lists 136 themes with no Catppuccin. | None found, same checks. |
| Scoping | `.visual-refresh.theme-dark` gets the flavour. `.visual-refresh.theme-light` always gets Latte, in every flavour file. | `:root` variables, no light/dark split. |
| Selectors | Partial class matches, `div[class^="item_"][class*="addFriend_"]`, which survive Discord's hash churn. | Exact hashed classes, `.content_c48ade`, which break when Discord rebuilds. |
| Unusual | Rainbow threads: thread rows cycle through six accents, with a `--ctp-rainbow-thread-disabled` escape hatch. Dark flavours put `$crust` text on accent fills because accents fail contrast against `$text`. Each compiled file is 171 KB minified. | Hides Discord's window buttons behind a `--windows-hover` toggle and swaps the DM icon for the Rosé Pine logo. |
| Last commit | `b9b5547` 2026-02-07 | `e31f74b` 2026-06-26 |

Files a Darkberry template would be derived from:

- https://raw.githubusercontent.com/catppuccin/discord/main/src/components/_variables.scss (the variable
  map, the bulk of the theme)
- https://raw.githubusercontent.com/catppuccin/discord/main/src/catppuccin-mocha.theme.scss (the META
  header and the dark/light scoping)
- https://raw.githubusercontent.com/catppuccin/discord/main/src/components/tweaks/_dark.scss (the
  text-on-accent fixes for dark flavours)
- https://raw.githubusercontent.com/catppuccin/discord/main/src/components/_details.scss (switches,
  status dots, system message icons)
- https://raw.githubusercontent.com/catppuccin/discord/main/src/components/_sidebar.scss (rainbow
  threads)

Rosé Pine's template, for the META shape only: https://raw.githubusercontent.com/rose-pine/discord/main/template.theme.css

### Mapping

Discord exposes a few hundred CSS custom properties. Catppuccin sets about 230 of them in
`_variables.scss`, then patches around 60 selectors in the other files. The structure is one
`& { --var: value; }` block, so the template is a flat list of `--key: {role};` lines. The table gives
the groups and the keys that carry a shared meaning. The full list is in the `_variables.scss` link
above.

Accent names swap positionally. Catppuccin's fourteen accents and Darkberry's `accentOrder` line up:

| Catppuccin | rosewater | flamingo | pink | mauve | red | maroon | peach | yellow | green | teal | sky | sapphire | blue | lavender |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Darkberry | blossom | petal | berry | plum | cranberry | cherry | apricot | honey | gooseberry | juniper | frost | bilberry | blueberry | lavender |

Keys with a shared meaning. `$brand` is Catppuccin's accent variable, `$blue` by default and swapped
by `build.js`.

| Discord key | Catppuccin value | Darkberry |
|---|---|---|
| `--brand-500`, `--control-brand-foreground`, `--mention-foreground`, `--text-brand` | `$brand` | `ui.accent` |
| `--brand-100` to `--brand-900` | `lighten($brand, n)` / `darken($brand, n)` ladder | `mix(ui.accent, text, t)` and `mix(ui.accent, crust, t)` |
| `--brand-05a` to `--brand-95a` | `$brand` at alpha 0.05 to 0.95 | `{ui.accent}0d` to `{ui.accent}f2` |
| `--control-primary-background-default` | `$brand`, text forced to `$crust` in `_dark.scss` | `ui.fill` under `ui.on.fill` |
| `--control-critical-primary-background-default` | `$red`, text `$base` | `ui.error` under `ui.on.error` |
| `--notice-background-critical/info/positive/warning` | `$red` / `$blue` / `$green` / `$yellow`, text `$crust` | `ui.error` / `ui.info` / `ui.success` / `ui.warning`, text `ui.on.error` |
| `--__adaptive-focus-ring-color` | `$brand` | `ui.focus` |
| `::selection` | `rgba($brand, 0.6)` | `ui.selection` |
| `--text-link` | `$blue` | `ui.link` |
| `--text-default`, `--text-strong`, `--white`, `--icon-default` | `$text` | `ui.text` |
| `--text-muted`, `--chat-text-muted` | `$subtext0` | `ui.text.muted` |
| `--text-subtle`, `--icon-subtle`, `--input-placeholder-text-default` | `$subtext1` | `ui.text.subtle` |
| `--channels-default`, `--channel-icon`, `--icon-muted` | `darken($subtext0, 5%)` | `ui.text.muted` |
| `--text-feedback-positive`, `--status-positive`, `--icon-status-online` | `$green` | `ui.success` |
| `--text-feedback-critical`, `--status-danger`, `--icon-status-dnd`, `--badge-notification-background` | `$red` | `ui.error` |
| `--text-feedback-warning`, `--status-warning`, `--icon-status-idle` | `$yellow` | `ui.warning` |
| `--text-feedback-info`, `--icon-feedback-info` | `$blue` / `$sky` | `ui.info` |
| `--background-feedback-critical/warning/info` | the accent at alpha 0.15 | `ui.error.surface` / `ui.warning.surface` / `ui.info.surface` |
| `--message-mentioned-background-default` | `$yellow` at alpha 0.1 | `ui.warning.surface` |
| `--mention-background` | `$brand` at alpha 0.3 | `{ui.accent}4d` |
| `--chat-background`, `--home-background`, `--modal-background`, `--background-code` | `$base` | `ui.background` |
| `--background-base-lower`, `--bg-surface-raised`, `--channeltextarea-background`, `--__header-bar-background` | `$mantle` | `ui.pane.secondary` |
| `--background-base-lowest`, `--input-background-default`, `--chat-border`, `--border-normal` | `$crust` | `ui.pane.tertiary` |
| `--app-frame-background` | `darken($crust, 2%)` | `mix(crust, mantle, ...)` or `crust` |
| `--background-surface-highest`, `--card-background-default`, `--border-muted`, `--spoiler-revealed-background` | `$surface0` | `surface0` (structural) |
| `--background-accent`, `--control-secondary-background-default` | `$surface1` | `surface1` (structural) |
| `--spoiler-hidden-background`, switch track | `$surface2` | `surface2` (structural) |
| `--border-subtle` | `$base` | `ui.border.inactive` |
| `--input-border-default`, `--checkbox-border-default`, `--interactive-muted`, `--textbox-markdown-syntax` | `$overlay0` | `overlay0` (structural) |
| `--interactive-background-selected` | `$overlay0` at alpha 0.2 | `ui.selection`, see *Open questions* |
| `--interactive-background-hover` | `$overlay2` at alpha 0.15 | `{overlay2}26` (structural) |
| `--scrollbar-thin-thumb`, `--scrollbar-auto-thumb` | `$brand` | `surface2` (structural chrome, not the accent) |
| `--text-status-offline`, `--icon-status-offline` | `$subtext1` | `ui.text.subtle` |
| `--guild-boosting-pink`, `--premium-perk-pink` | `$pink` | `berry` |
| `--guild-boosting-purple`, `--premium-perk-purple`, `--twitch` | `$mauve` | `plum` |
| `--premium-perk-yellow` | `$yellow` | `honey` |
| `--premium-perk-green`, `--spotify` | `$green` | `gooseberry` |
| `--premium-perk-orange` | `$peach` | `apricot` |
| `--premium-tier-1-blue-for-gradients` | `$sapphire` | `bilberry` |
| `--playstation` | `darken($blue, 10%)` | `blueberry` |
| Rainbow thread cycle | `$red, $peach, $yellow, $green, $blue, $mauve` | `cranberry, apricot, honey, gooseberry, blueberry, plum` |
| Code blocks | `@catppuccin/highlightjs` mixin | an `.hljs-*` block on `syntax.*` roles, the scope map from `src/vscode/template.json` |

### Build plan

What to add:

| File | Purpose |
|---|---|
| `src/ports/discord.css` | The theme. Flat CSS, no Sass. Catppuccin's `lighten`, `darken` and `adjust-color` become `{mix(a,b,t)}` and alpha suffixes. |
| `src/overrides/discord.json` | `{ "overrides": [] }`, kind `lines`, key `--text-default:` style as Obsidian. |
| `src/usage/discord.md` | Install steps for BetterDiscord, Vencord local and online, Equicord, Stylus. A FAQ with the ban question, as Catppuccin's README has. |
| `src/ports.json` entry | `{ "key": "discord", "name": "Discord", "url": "https://discord.com", "emoji": "🎮", "categories": ["social_networking"], "platform": ["linux", "macos", "windows", "web"] }`. Catppuccin files it under `social_networking`, which `src/categories.json` does not have yet. Add the category or the build fails. |

Template shape. The META block must be the first bytes of the file. So the Darkberry provenance
comment goes second, as a plain `/* */` block:

```css
/**
 * @name %FULL%
 * @author %AUTHOR%
 * @description %DESCRIPTION%
 * @version %VERSION%
 * @website %HOMEPAGE%
 * @source %REPOSITORY%
 * @license MIT
 */
/* %FULL% for Discord. %NOTE%
   Generated by build.mjs from src/ports/discord.css. Do not edit ports/discord/.
   ... install paths, host-owned pairings, Differs from Catppuccin ... */
.visual-refresh.theme-dark, .visual-refresh .theme-dark,
.visual-refresh.theme-light, .visual-refresh .theme-light {
  --text-default: {ui.text};
  ...
}
```

Both of Discord's schemes get the one flavour, the way `src/ports/obsidian.css` does it. Catppuccin
instead hands light mode to Latte. Vencord users who want a pair can list Wisp with `@light` and
Mire with `@dark` in Online Themes.

Output tree:

```
ports/discord/
  README.md
  assets/
  darkberry-wisp.theme.css
  darkberry-fen.theme.css
  darkberry-mire.theme.css
  darkberry-blackwater.theme.css
  lingonberry/
    README.md
    assets/
    lingonberry-wisp.theme.css ... lingonberry-blackwater.theme.css
  cloudberry/  crowberry/  blueberry/   (the same)
```

The name is `%SLUG%.theme.css`. The mods read `@name` from inside the file, which argues for `%FULL%`.
But Vencord's Online Themes and a Stylus `@import` reference the file by URL. A URL with a space is a
worse experience, so rule 9's first case wins.

Wiring in `build.mjs`:

1. `const discordT = read("src/ports/discord.css")` beside the others.
2. In the flavour loop: `out(\`ports/discord/${slug}.theme.css\`, applyOverrides("discord", "lines", fill(ctx, discordT, "discord"), ctx))`.
3. `route()` already sends a tint build to `ports/discord/<tint>/`. No special case.
4. Trace: add `["discord", discordT]` to the generic loop. `--key: value;` lines trace the same way
   `obsidian.css` does today.
5. `mustBe()` lines: `::selection` on `{ui.selection}`, `--__adaptive-focus-ring-color` on
   `{ui.focus}`, `--control-primary-background-default` on `{ui.fill}` with its text on `{ui.on.fill}`,
   `--control-critical-primary-background-default` on `{ui.error}` with its text on `{ui.on.error}`,
   `--text-link` on `{ui.link}`.
6. Host-owned pairings to list in the header: Discord paints its own white (`--white`) on brand and
   status fills. Catppuccin overrides `--white` to `$crust` inside a long selector list in
   `_dark.scss`. Darkberry sets those to `ui.on.fill` and `ui.on.error` and records the contrast per
   flavour.

What `build.mjs` cannot do today:

| Gap | Why it matters | Who does it |
|---|---|---|
| Serve the CSS at a URL | Vencord Online Themes and the Stylus route both need a public `text/css` URL. | `.github/workflows/pages.yml` already publishes `site/` to darkberry.slacklab.ca. The build would also have to copy `ports/discord/*.theme.css` into `site/`, or the workflow would. Not wired. |
| A Stylus userstyle | One `.user.css` with a flavour dropdown holds every flavour, so it is a with-tints style unit like `ports/gpl/`. | A second template and a `route()` exception. Optional. |
| Replugged packaging | A `manifest.json` with a reverse-DNS `id` per flavour, plus the template's build to `.asar`. | A second JSON template. Optional, low reach. |
| Screenshots | They need a Discord account with a client mod installed. See *Risk*. | A person. |
| Keeping up with Discord | Discord renames hashed classes. Catppuccin's last fix was 2026-02-07. Partial-match selectors reduce breakage but do not remove it. | Periodic re-checks. |

### Risk

Every route here breaks Discord's Terms of Service. The relevant text, fetched 2026-10-07 from
https://discord.com/terms:

- The software licence is granted "solely to access our services".
- "You may not copy, modify, create derivative works based upon, distribute, sell, lease, or
  sublicense any of our software or services."
- The restrictions list includes "using any unauthorized software designed to modify the services".

What the mods say about it, each on its own site (all 2026-10-08):

| Mod | Statement |
|---|---|
| BetterDiscord FAQ | "Is BetterDiscord against Discord's Terms of Service? Yes, but unless you do something egregious ... you'll be fine." |
| Vencord FAQ | "Client modifications are against Discord's Terms of Service. However, Discord is pretty indifferent about them and there are no known cases of users getting banned." It adds that people whose account matters should not use any client mod. |
| Replugged docs | "Long story short... yes." |
| Catppuccin README | "Using third party clients and injecting custom css is against the ToS ... We are not responsible for anything that might happen to your account." |

Consequences for Darkberry:

1. Slacklab would publish a file whose only use is a ToS violation. That is a publisher decision.
2. The port README needs Catppuccin's FAQ disclaimer.
3. BetterDiscord's Usability guideline 3 forbids a theme that encourages "further" ToS violation, so
   the README must not go beyond the disclaimer.
4. Whoever takes the screenshots installs a mod on a real account.

No Discord support article on client mods was found. `support.discord.com` returned 403 to fetches,
so the stance above is the ToS text plus the mods' own words.

## Venues

### BetterDiscord theme store (betterdiscord.app)

- **URL**: https://betterdiscord.app/themes, submission through the site. Docs:
  https://docs.betterdiscord.app/themes/publishing/submit,
  https://docs.betterdiscord.app/themes/publishing/guidelines,
  https://docs.betterdiscord.app/themes/publishing/distribution.
- **Kind**: official store for BetterDiscord, with an in-client store tab. It is also the list
  Vencord's own Themes tab links to as the "BetterDiscord theme list" (`LocalThemesTab.tsx`), so it
  reaches both mods. Best reach of any venue here.
- **Accepts**: one `.theme.css` committed in a public GitHub repository "in its final form", at a path
  that never moves. The site tracks that file for updates. Branch does not matter.
- **Fields**: Name (`@name`, required; `betterdiscord.app/themes/Darkberry` returns 404 against a 200
  control, so the name is free as of 2026-10-08); Summary (`@description`, required, shown on the
  card); Description (the repo README, shown on the theme page, updates without review); Author
  (`@author`, required; `@authorId`, `@authorLink` optional); Version (`@version`, required);
  Repository (`@source`); Homepage (`@website`); Screenshots (one thumbnail per listing; how it is
  supplied is unverified, the form was not seen); Keywords (tags such as `dark`, `light`,
  `customizable`, `purple`, `high-contrast` on existing listings; the form field is unverified).
- **Add-ons**: `@invite` for a support server. The site assigns an addon ID, which gives
  `https://betterdiscord.app/Download?id=XXX` and the in-app `betterdiscord://store/id` link.
- **Requirements**: a Discord account, connected on the site. A GitHub account with the repo; the site
  may auto-decline an account "with no plugins or themes detected on GitHub". Account authorisation
  takes up to 2 days. Review takes "no more than a month" and can be a day. No fee, no signing.
  Guidelines that bite: *Code 1*, "You may not submit an automatically-generated theme"; *Design 1*,
  "A simple recoloring via CSS variables ... is not considered notable." Darkberry is a build-generated
  recolour. Both are rejection risks and need an answer before submitting.
- **Steps**:
  1. Merge the port so `ports/discord/darkberry-mire.theme.css` exists on `main`. Pick the path once.
  2. Go to https://betterdiscord.app, click Connect, connect the Discord account.
  3. On the Themes page click "+ Submit a Theme" and wait for the account to be authorised.
  4. Fill the theme form. The form's fields were not seen, so expect the META fields, the repo file
     path and a thumbnail.
  5. Wait for review. A denial comes with a reason and may open an issue on the repo. Fix and resubmit.
- **Updates**: push a change to the same file on GitHub. A webhook sends it to the site and it goes
  through review again. Never force-push over it, move it, or rename the GitHub user: the site loses
  track of the addon.
- **Contacts**: the BetterDiscord Discord server, linked from https://betterdiscord.app/invite.
  GitHub issues go to the theme's own repo, which is where the review team opens them.
- **Sources**: https://docs.betterdiscord.app/themes/introduction/structure (2026-10-08),
  https://docs.betterdiscord.app/themes/publishing/submit (2026-10-08),
  https://docs.betterdiscord.app/themes/publishing/guidelines (2026-10-08),
  https://docs.betterdiscord.app/themes/publishing/distribution (2026-10-08),
  https://docs.betterdiscord.app/themes/tutorials/remote (2026-10-08),
  https://raw.githubusercontent.com/BetterDiscord/docs/main/docs/themes/introduction/quick-start.md
  (2026-10-08, folder paths), https://betterdiscord.app/themes (2026-10-08, tags and download counts),
  https://raw.githubusercontent.com/Vendicated/Vencord/main/src/components/settings/tabs/themes/LocalThemesTab.tsx
  (2026-10-08, the Vencord link).
- **Confidence**: partly verified. Format, folder paths, submission flow, review and update mechanism
  are from the docs. Unverified: the submission form's fields, the thumbnail format, and whether a
  generated recolour passes the guidelines.

### Equicord Theme Library (themes.equicord.org)

- **URL**: https://themes.equicord.org, submit at https://themes.equicord.org/theme/submit. Source and
  API: https://github.com/Equicord/Equithemes.org, API base https://api.themes.equicord.org/.
- **Kind**: community library "for Equicord and Vencord", run by the Equicord project. The
  Equithemes README says the API feeds Equicord's in-client Theme Library as well as the site. 136
  themes and snippets as of 2026-10-08, including Nord and Tokyo Night.
- **Accepts**: a direct http(s) link to a `.theme.css` whose first line is a META block with `@name`.
  The site fetches the file at submission and serves it as the download. Type is `theme` or `snippet`.
- **Fields**: Title (3 to 40 characters, required); Description (required); Screenshots (one preview
  image, required, 10 MB or smaller, displayed at 854 by 480; or generated by the site from the theme
  URL); Repository (`Source URL`, required, used as the download link; the META fields inside it
  supply the rest).
- **Add-ons**: contributors as Discord user IDs, validated against Discord. Tags from the site's list.
  A README badge `https://themes.equicord.org/badge.png` pointing at the theme's page.
- **Requirements**: a Discord account to log in on the site. Submissions land in a `pending`
  collection and a moderator approves or rejects them. A banned account is refused. No fee, no
  signing. Approval criteria are not published.
- **Steps**:
  1. Have the compiled `.theme.css` at a stable raw URL on `main`.
  2. Log in at https://themes.equicord.org with Discord.
  3. Open https://themes.equicord.org/theme/submit. Title, description, preview image, source URL,
     tags, contributors.
  4. Submit and wait for a moderator.
- **Updates**: the site stores the fetched content, and a monthly `update-themes.js` workflow
  refreshes `themes.json`. Whether a merged change is picked up automatically or needs a new
  submission is unverified.
- **Contacts**: the Equicord Discord server, linked from the site. Issues at
  https://github.com/Equicord/Equithemes.org/issues.
- **Sources**: https://raw.githubusercontent.com/Equicord/Equithemes.org/master/README.md
  (2026-10-08), `src/pages/theme/submit.tsx` and `src/pages/api/submit/theme.ts` in that repo
  (2026-10-08, the validation rules), `.github/workflows/themes.yml` (2026-10-08),
  https://api.themes.equicord.org/themes (2026-10-08, the listing), https://themes.equicord.org
  (2026-10-08).
- **Confidence**: verified for the form and its limits, which come from the source code. Unverified:
  moderation criteria, turnaround, and the update path after approval.

### userstyles.world (web client through Stylus)

- **URL**: https://userstyles.world. Docs: https://userstyles.world/docs/faq,
  https://userstyles.world/docs/content-guidelines. Source:
  https://github.com/userstyles-world/userstyles.world.
- **Kind**: community catalogue of UserCSS styles, the replacement for userstyles.org. Stylus's inline
  search reads it. This is the only route that reaches the web client at discord.com.
- **Accepts**: a UserCSS file. The FAQ's minimum is `@name`, `@namespace`, `@version` in a
  `/* ==UserStyle== */` block and an `@-moz-document` scope. Catppuccin's `discord.user.css` scopes to
  `regexp("https?://(canary\\.|ptb\\.|)discord.com/.*")` and `@import`s the Pages CSS. That import
  needs Stylus "CSP Patching" on, so a self-contained style is the kinder shape. Rosé Pine compiles a
  `.user.less` with `@var select` dropdowns for variant and accent.
- **Fields**: Name (`@name` and the site's name field); Summary (`@description`); Description (the
  site's description and notes fields, Markdown); Licence (`@license` and the site's licence field;
  MIT); Version (`@version`); Author (`@author`); Homepage (`@homepageURL`); Category (the site's
  category; the FAQ says to use the service's domain without `.com`, so `discord`); Screenshots (the
  site hosts them).
- **Add-ons**: `@updateURL` and the site's import mirror. A style can be created by hand or imported
  from a GitHub, GitLab or Codeberg URL, with optional source mirroring.
- **Requirements**: an account by email, or OAuth through GitHub, GitLab or Codeberg. No review before
  publishing. Broken styles are removed. The content guidelines ask for the author's own work or a
  permissive licence, and no NSFW screenshots. No fee.
- **Steps**:
  1. Decide the style shape: self-contained per flavour, or one style with a flavour dropdown.
  2. Add a `.user.css` to the repo at a stable raw URL.
  3. Sign in, choose import, give the raw URL, fill name, category `discord`, licence, screenshots.
  4. Test in Stylus after publishing. The FAQ asks for this.
- **Updates**: push to the mirrored URL. With mirroring on, the site refreshes from it. Otherwise edit
  the style on the site.
- **Contacts**: Matrix and Discord links in the site footer, issues at the GitHub repo.
- **Sources**: https://userstyles.world/docs/faq (2026-10-08),
  https://userstyles.world/docs/content-guidelines (2026-10-08),
  https://github.com/userstyles-world/userstyles.world readme (2026-10-08, feature list),
  https://raw.githubusercontent.com/catppuccin/discord/main/discord.user.css (2026-10-08),
  https://raw.githubusercontent.com/rose-pine/userstyles/main/styles/discord/rose-pine.user.less
  (2026-10-08), https://github.com/catppuccin/discord README Stylus section (2026-10-08).
- **Confidence**: partly verified. The header minimum, the category rule and the account options are
  from the site. Unverified: the exact form fields, screenshot sizes, and whether Catppuccin or Rosé
  Pine have a Discord style listed there.

### Replugged addon store

- **URL**: https://replugged.dev/store/themes. Docs: https://guide.replugged.dev/docs/store,
  https://guide.replugged.dev/docs/manifest,
  https://guide.replugged.dev/docs/themes/getting-started.
- **Kind**: official store for Replugged, served from Replugged's own servers since v4.3.0. The docs
  say there is "no frontend yet" and that the `#theme-links` channel in their Discord server is still
  the listing. Reach is small: 730 GitHub stars.
- **Accepts**: a theme in Replugged's own format, a `manifest.json` with `type: "replugged-theme"`
  and a `main` CSS, built with their template. The manifest's `updater.type` must be `"store"` and
  `updater.id` must equal the theme `id` before review.
- **Fields**: Name (`name`); Summary (`description`, shown in the store); Author (`author.name`, plus
  `discordID` and `github`); Version (`version`); Licence (`license`, SPDX); Repository (`source`);
  Screenshots (`image`, URLs that must be on Discord's CDN or Imgur).
- **Add-ons**: `id` in reverse-DNS, fixed for life, for example `ca.slacklab.darkberry.mire`. An
  optional `splash` CSS for the loading screen. Install link
  `https://replugged.dev/install?identifier=<id>`, which only works after approval.
- **Requirements**: a Discord account in the Replugged server. A new developer posts a source link in
  `#theme-dev` and pings staff. After approval they get posting rights and access to
  `#addon-reviews`. No fee, no signing. Updates are reviewed for malicious code only.
- **Steps**:
  1. Build the Replugged shape: one folder per flavour with `manifest.json` and `main.css`.
  2. Set `updater` to `store` and release a tagged version.
  3. Post the source link in `#theme-dev` and ping staff.
  4. After approval, publish the install link.
- **Updates**: a post in `#addon-reviews` per release.
- **Contacts**: https://discord.gg/HnYFUhv4x4.
- **Sources**: https://guide.replugged.dev/docs/store (2026-10-08),
  https://guide.replugged.dev/docs/manifest (2026-10-08),
  https://guide.replugged.dev/docs/themes/getting-started (2026-10-08),
  https://raw.githubusercontent.com/replugged-org/theme-template/main/manifest.json (2026-10-08),
  https://github.com/replugged-org/replugged/wiki/Installing-plugins-and-themes (2026-10-08, paths),
  https://docs.replugged.dev/index.html (2026-10-08, ToS FAQ).
- **Confidence**: verified for the manifest and the process as documented. Unverified: whether the
  chat-based review is still active in 2026, and turnaround.

## Not applicable

- **Discord itself.** No theme API, no store. Nitro themes are Discord's own gradients. Checked the
  ToS and the client's settings; nothing to submit to.
- **A Vencord theme list.** None exists. Vencord's Themes tab links users to the BetterDiscord list and
  a GitHub search (`LocalThemesTab.tsx`, 2026-10-08). The BetterDiscord store above is the Vencord
  venue.
- **catppuccin/userstyles.** Has no `styles/discord` entry (404 on 2026-10-08). Catppuccin's Discord
  userstyle lives in catppuccin/discord. Not a Darkberry venue in any case.
- **GitHub topics** `betterdiscord-theme`, `vencord-themes`, `equicord-themes`. Tagging the repo costs
  nothing, but a topic is not a listing. Mentioned for completeness.
- **Mobile mods** such as Aliucord, Revenge and Kettu. Vencord's FAQ names them. They have their own
  theme formats and were not researched.

## Open questions

1. Whether Slacklab publishes a Discord port at all. Every install path breaks Discord's ToS, and the
   port cannot be screenshotted without someone modding a real account.
2. How to answer BetterDiscord's guidelines. A build-generated recolour fails a plain reading of
   *Code 1* and *Design 1*. Options: ask in their server first, add structural design beyond colours,
   or skip the store and rely on Equicord's library and the repo.
3. One listing or four. Each `.theme.css` is a card, so four flavours are four store submissions and
   tints would be sixteen more. Catppuccin lists nothing and ships from its repo instead.
4. Hosting the compiled CSS at darkberry.slacklab.ca for Online Themes and Stylus. Needs the Pages
   workflow to publish `ports/discord/`. Without it, the Stylus route and the Vencord URL route do not
   exist.
5. Light mode. One flavour per file as Obsidian does, or Catppuccin's choice of handing Discord's light
   switch to Wisp. The build plan assumes the former.
6. The selected channel row. Catppuccin uses translucent `overlay0` with the row text unchanged.
   Darkberry's rule for a row selection is `ui.fill` under `ui.on.fill`. Discord keeps its own text
   colour on that row, so `ui.selection` is the safer pick. Someone has to choose and record a `why`.
7. Accent variants. Catppuccin builds fourteen per flavour. Darkberry's variant axis is the tint, so
   the plan ships one accent, `ui.accent`.
8. Rainbow threads. Keep Catppuccin's six-colour cycle as structural chrome, or leave thread rows
   plain.
9. Whether to build the Stylus userstyle and the Replugged folders at all, given their reach.
10. Whose Discord account connects on betterdiscord.app, themes.equicord.org and the Replugged server.
11. Maintenance. Discord's class hashes change and Catppuccin patches a few times a year. Decide who
    re-checks the port and how often.
