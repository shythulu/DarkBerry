# Porting and publishing iTerm2

iTerm2 is the most used third-party terminal on macOS. Its stable release is 3.7.3, built
2026-09-22, for macOS 13 and later. A theme for it is a colour preset: one `.itermcolors`
file, an Apple property list of 16 ANSI slots plus up to 13 named colours. The user imports
the file once from Settings > Profiles > Colors. The main outside venue is
mbadolato/iTerm2-Color-Schemes, 27,250 stars and 724 schemes, which iTerm2's own
"Visit Online Gallery" menu item opens. Darkberry already documents that venue for Ghostty
and kitty. iTerm2 is also the one port whose native file is that venue's source format, so
the generated file can be submitted as is.

## Porting

### Format

One `.itermcolors` file is one preset. It is an XML property list whose top-level dict maps
colour names to colour dicts. iTerm2 reads it with `NSDictionary dictionaryWithContentsOfFile`,
so binary plist would also load. Every port ships XML.

Primary sources, all read 2026-10-08:

| Topic | Source |
|---|---|
| Colors settings page, presets, light and dark modes | https://iterm2.com/documentation-preferences-profiles-colors.html |
| Preset key list, import logic, mode handling | https://github.com/gnachman/iTerm2/blob/master/sources/Settings/iTermColorPresets.m |
| Key name constants | https://github.com/gnachman/iTerm2/blob/master/sources/Settings/Profiles/ITAddressBookMgr.h |
| Preset menu and gallery link | https://github.com/gnachman/iTerm2/blob/master/sources/Settings/ProfilesColorsPreferencesViewController.m |
| Dynamic profiles | https://iterm2.com/documentation-dynamic-profiles.html |
| Python API key names, including the light and dark variants | https://iterm2.com/python-api/profile.html |

#### One colour

Each colour is a dict of five keys. iTerm2 ignores any other key in the file.

| Key | Type | Value | Required |
|---|---|---|---|
| `Red Component` | real | 0 to 1 | yes |
| `Green Component` | real | 0 to 1 | yes |
| `Blue Component` | real | 0 to 1 | yes |
| `Alpha Component` | real | 0 to 1, default 1 | no, but every port writes it |
| `Color Space` | string | `sRGB` or `P3` | no, but every port writes `sRGB` |

Example, Catppuccin's shape:

```xml
<key>Background Color</key>
<dict>
  <key>Red Component</key><real>0.11764705882352941</real>
  <key>Green Component</key><real>0.11764705882352941</real>
  <key>Blue Component</key><real>0.1803921568627451</real>
  <key>Alpha Component</key><integer>1</integer>
  <key>Color Space</key><string>sRGB</string>
</dict>
```

#### The preset keys

`colorKeysWithModes:` in `iTermColorPresets.m` is the full list a preset can carry. Any key
missing from the file keeps the profile's current value. Three keys are optional in the
app too: importing a preset that lacks them clears them from the profile.

| Key | What it paints | Optional in the app | Catppuccin sets | Rosé Pine sets |
|---|---|---|---|---|
| `Ansi 0 Color` to `Ansi 15 Color` | the 16 ANSI slots, 0 to 7 normal, 8 to 15 bright | no | yes | yes |
| `Foreground Color` | default text | no | yes | yes |
| `Background Color` | the terminal background | no | yes | yes |
| `Bold Color` | bold text, only when the profile's "Use Bright Bold" is on | no | yes | yes |
| `Link Color` | underlined URLs | no | yes | yes |
| `Match Background Color` | the find-match highlight | yes | no | no |
| `Selection Color` | selection fill | no | yes | yes |
| `Selected Text Color` | text on the selection, only when "Use Selected Text Color" is on | no | yes | yes |
| `Cursor Color` | the cursor | no | yes | yes |
| `Cursor Text Color` | text under a block cursor | no | yes | yes |
| `Tab Color` | the tab's tint, only when "Use Tab Color" is on | yes | no | yes |
| `Underline Color` | all underlines, only when "Use Underline Color" is on | yes | no | no |
| `Cursor Guide Color` | the horizontal rule on the cursor's row, usually with alpha | no | yes, text at 0.07 | yes, 0.25 alpha |
| `Badge Color` | the translucent badge text at the top right, usually with alpha | no | no | yes, 0.71 alpha |

Two colour wells on the settings page are profile keys, not preset keys, so a preset cannot
set them: `Active Pane Border Color` and `IME Cursor Color`. The "Use ..." switches are
also profile keys. A preset can carry a tab colour, but the user still has to turn
"Use Tab Color" on.

#### Light and dark pairs

iTerm2 3.5.0, released 2024-05-20, added "Use separate colors for light and dark mode".
The settings page then shows an "Editing: Light / Dark" switch. In the file this is a
suffix on every key: `Foreground Color (Light)` and `Foreground Color (Dark)`.

iTerm2 tells the two shapes apart by one key: a file with `Foreground Color (Light)` is a
paired preset. What happens on "Color Presets > name", from `iTermColorPresets.m` and
`ProfilesColorsPreferencesViewController.m`:

| File carries | Profile's mode switch off | Profile's mode switch on |
|---|---|---|
| plain keys only | fills the profile, no prompt | asks "Update Both Modes" or "Update <this> Mode Only" |
| `(Light)` and `(Dark)` pairs | fills both modes and turns the switch on, no prompt | asks "Update Both Modes" or "Update <this> Mode Only" |

The switch is the profile key `Use Separate Colors for Light and Dark Mode`. A preset never
sets it directly. iTerm2 sets it when it fans a paired preset into both modes.

Catppuccin shipped paired files from 2024-04-09 (PR #18) and removed them on 2025-04-26
(PR #30), after issue #27: a user who wanted Mocha only could not get the preset to apply.
A paired file forces the two-mode question on everyone. Darkberry should ship plain files
per flavour, as both reference ports now do, and treat a paired "Wisp + Mire" file as an
extra.

#### Install and location on disk

iTerm2 is macOS only. There is no themes folder. Import copies the colours into iTerm2's
own preferences, under `Custom Color Presets` in `~/Library/Preferences/com.googlecode.iterm2.plist`.
The file is not read again after that.

Two ways in, both verified from the source and docs:

1. Settings > Profiles > pick a profile > Colors > Color Presets... > Import..., choose
   the files. Then Color Presets... again and pick the name.
2. Double-click the file, or `open "Darkberry Mire.itermcolors"`. iTerm2 registers the
   extension as a document type and imports on open, then says where to find it.

The preset name is the file name without the extension. The duplicate check compares
colours, not names. A second import of identical colours prompts "Add duplicate color
preset?".

Because the name comes from the file name, the file must be named as the user should see
it: `Darkberry Mire.itermcolors`, STYLE_GUIDE.md step 9, second case. Catppuccin's
`catppuccin-mocha.itermcolors` shows up as "catppuccin-mocha" in the menu.

#### Dynamic profiles, the alternative

A dynamic profile is a whole profile, not a preset. It lives as a plist in
`~/Library/Application Support/iTerm2/DynamicProfiles/`, in JSON, XML or binary, any
file name. iTerm2 reloads the folder on change. Each profile needs `Guid` and `Name`. Every
other key is optional and inherits from the default profile or a named parent. The colour
keys are the same names as above, and a dynamic profile can also set the profile-only keys:
`Use Separate Colors for Light and Dark Mode`, `Use Tab Color`, `Active Pane Border Color`.

| | `.itermcolors` preset | Dynamic profile |
|---|---|---|
| Unit | colours only | a full profile |
| Install | import once, or double-click | copy a file into the folder |
| Updates | re-import | edit the file, picked up live |
| Several themes in one file | no, one preset per file | yes, a `Profiles` array |
| Can turn on tab colour, pane border, light/dark switch | no | yes |
| Shows up as | a preset in any profile | a new profile named "<Name> (Dynamic)" |
| What Catppuccin and Rosé Pine ship | this | nothing |

One preset per file, so tints are subfolders, as PORT_CREATION.md says. There is no
packaging: no manifest, no archive, no signing.

### How Catppuccin and Rosé Pine do it

| | Catppuccin | Rosé Pine |
|---|---|---|
| Repo | https://github.com/catppuccin/iterm | https://github.com/rose-pine/iterm |
| Licence | MIT | MIT |
| Stars, last push | 957, 2025-04-30 | 143, 2025-11-05 |
| Files | 4, `colors/catppuccin-<flavor>.itermcolors` | 3, `rose-pine.itermcolors`, `rose-pine-moon.itermcolors`, `rose-pine-dawn.itermcolors` at the root |
| Keys per file | 25: 16 ANSI + 9 named | 27: 16 ANSI + 11 named, adds Tab Color and Badge Color |
| Built or hand-written | `build.ts`, Deno, pulls `@catppuccin/palette` 1.7.1 and the `plist` npm package | hand-exported from iTerm2 |
| Metadata | none in the file, the file name is the preset name | same |
| Distribution | download from the repo, no GitHub releases | same, plus PNG screenshots |
| Unusual | 2024 paired light/dark keys, reverted 2025 (PR #30). Alpha written as `<integer>1</integer>` | Badge at 0.71 alpha, cursor guide at 0.25 |
| Derive the template from | https://raw.githubusercontent.com/catppuccin/iterm/main/colors/catppuccin-mocha.itermcolors (commit b2936a6, 2025-04-30) | https://raw.githubusercontent.com/rose-pine/iterm/main/rose-pine-moon.itermcolors (commit 4801702, 2025-11-05) |

Catppuccin's `build.ts` is the clearest statement of the mapping, so the table below is
from it.

### Mapping

Catppuccin's choices on the left, the Darkberry role to swap in on the right. The ANSI
rows and the first nine named rows are Catppuccin's. The last four rows are keys
Catppuccin leaves unset, with a Darkberry role proposed.

| iTerm2 key | Catppuccin | Darkberry role | Note |
|---|---|---|---|
| `Ansi 0 Color` to `Ansi 15 Color` | palette `ansiColorEntries`, normal then bright | `{ansi.0}` to `{ansi.15}` | same mapping and bright formula as kitty, ROLES.md says aligned |
| `Background Color` | base | `{ui.background}` | |
| `Foreground Color` | text | `{ui.text}` | |
| `Bold Color` | text | `{ui.text}` | bold keeps its colour, as kitty and Alacritty |
| `Link Color` | sky | `{ui.link}` | frost |
| `Cursor Color` | rosewater | `{ui.cursor}` | petal |
| `Cursor Text Color` | base | `{ui.cursor.text}` | |
| `Cursor Guide Color` | text, alpha 0.07 | `{ui.line.current}` | opaque tint of the background, or `{ui.text}` with an alpha suffix |
| `Selection Color` | surface2 | `{ui.selection}` | |
| `Selected Text Color` | text | `{ui.text}` | |
| `Match Background Color` | unset | `{ui.search.matches}` | the find highlight |
| `Tab Color` | unset, Rosé Pine: text | `{ui.tab.indicator}` | the tint colour, needs "Use Tab Color" on |
| `Badge Color` | unset, Rosé Pine: rose at 0.71 | `{ui.text.subtle}` with alpha | a human picks the alpha, iTerm2's default is 0.5 |
| `Underline Color` | unset | unset | underlines keep the text colour |

### Build plan

Add one template and one converter. Everything else is the usual wiring.

1. `src/ports/iterm.itermcolors`: an XML plist with every key above as
   `<key>Background Color</key><string>{ui.background}</string>`. One pair per line, so the
   existing `plist` override kind addresses it, as `src/ports/bat.tmTheme` does.
2. A converter in `build.mjs` after `fill()`, next to `toTriplets`: replace each
   `<string>#rrggbb</string>` or `<string>#rrggbbaa</string>` with the five-key colour
   dict. `rgb()` in `lib/color.mjs` already returns 0 to 1 floats. The alpha suffix
   `{ui.text}12` becomes `Alpha Component` 0.07.
3. The header comment. A plist cannot hold `--` in an XML comment. An extra top-level
   string key, the way bat's `comment` works, would pass iTerm2, which reads colour keys
   by name and never iterates the dict. It would break mbadolato's `gen.py`, whose
   `read_itermcolors_file` turns every top-level entry into a colour. So the header has to
   be an XML comment with the `--` of every CLI flag spelled another way, or the extra key
   has to be stripped before submission. Decide before writing the template.
4. Output, in `route()`'s normal per-flavour loop:

   ```
   ports/iterm/
     README.md
     assets/preview.webp, wisp.webp, fen.webp, mire.webp, blackwater.webp
     Darkberry Wisp.itermcolors
     Darkberry Fen.itermcolors
     Darkberry Mire.itermcolors
     Darkberry Blackwater.itermcolors
     lingonberry/  Lingonberry Wisp.itermcolors ... plus README.md and assets/
     cloudberry/
     crowberry/
     blueberry/
   ```

5. Registry entry: `{ "key": "iterm", "name": "iTerm2", "url": "https://iterm2.com",
   "emoji": "🍎", "categories": ["terminal"], "platform": ["macos"] }`. Catppuccin's
   `ports.yml` names it `iTerm2`, category terminal, platform macos. The emoji is a
   suggestion.
6. `src/usage/iterm.md`: the three install routes above, the 3.5.0 floor only for the
   light/dark switch, and "Use Tab Color" for the tab tint.

What `build.mjs` cannot do today:

- A paired file, `Darkberry.itermcolors` with Wisp under `(Light)` and Mire under
  `(Dark)`. The flavour loop fills one flavour context at a time. A paired file needs a
  second pass that fills two contexts into one template, like the VS Code with-tints
  bundle. Leave it out of the first version.
- A dynamic profile JSON holding all four flavours. Same two-context problem, plus a
  stable `Guid` per profile. A UUID v5 of the theme name would do.
- Screenshots: iTerm2 runs only on macOS, so the capture loop needs a Mac. This one does.

## Venues

### mbadolato/iTerm2-Color-Schemes (the gallery iTerm2 links to)

Darkberry's `docs/publishing/ghostty.md` and `docs/publishing/kitty.md` already describe
this repo's workflow, PR template, `AGENTS.md` and YAML format. This block adds only what
is specific to iTerm2. Read those two first.

- **URL**: https://github.com/mbadolato/iTerm2-Color-Schemes
- **Kind**: community repo, but the de facto official gallery. iTerm2's Color Presets
  menu has a "Visit Online Gallery" item hard-coded to https://www.iterm2.com/colorgallery,
  which 302s to https://iterm2colorschemes.com, the repo's GitHub Pages site. 27,250 stars,
  724 schemes, pushed 2026-10-08. The ten most recently merged PRs are theme additions
  dated 2026-10-04.
- **Accepts**: for iTerm2 the choice is wider than for kitty or Ghostty. The repo takes
  either `schemes/<Name>.itermcolors`, the native file, or `yaml/<Name>.yml`. `AGENTS.md`
  prefers YAML "unless the theme is being exported directly from iTerm2". Darkberry's
  generated file is byte-for-byte the same shape as an export, so either path is honest.
  The `.itermcolors` path keeps every key, including `Match Background Color`, which the
  YAML has no field for. The YAML path carries `bold`, `cursor_guide`, `cursor_text`,
  `link`, `selection`, `selection_text`, `tab`, `underline`, `badge` and drops the match
  colour. Their `gen.py` does not regenerate the `.itermcolors` for a `.itermcolors` source,
  so the file lands in `schemes/` as submitted. Both paths run a WCAG pass at 1.75:1 that
  may nudge foreground colours in the derived formats. Only the YAML path can opt out,
  with `wcag_adjust: false`. The `.itermcolors` reader also treats every top-level key as
  a colour, so the submitted file must hold colour keys and nothing else.
- **Fields**: Name (the file name, human readable, spaces kept, `Darkberry Mire.itermcolors`);
  Description (the PR body); Author (`CREDITS.md` line, optional; YAML `author` if the YAML
  path is used); Licence (none per theme, the repo is MIT).
- **Add-ons**: `variant` only exists in YAML; for a `.itermcolors` source `gen.py` guesses
  dark or light from the background. AI-assistance disclosure in the PR, per `AGENTS.md`.
- **Requirements**: GitHub account, Python 3.10 venv or Docker to run `gen.py` before the
  PR. No fee, no signing.
- **Steps**:
  1. Fork, set up the venv as `AGENTS.md` says.
  2. Copy `ports/iterm/Darkberry Mire.itermcolors` to `schemes/Darkberry Mire.itermcolors`,
     one file per flavour submitted.
  3. `cd tools && python gen.py -s "Darkberry Mire"` to produce the 30+ derived formats.
  4. Optional: `python tools/wcag_check.py -s "Darkberry Mire"`, and the screenshot tool.
  5. Optional `CREDITS.md` line. Do not hand-edit `README.md`'s screenshot block.
  6. Open the PR with the template's description, naming the file as the display name.
- **Updates**: a follow-up PR replacing the same `schemes/` file and re-running `gen.py -s`.
- **Contacts**: https://github.com/mbadolato/iTerm2-Color-Schemes/issues, maintainer
  mbadolato.
- **Sources**: `README.md`, `AGENTS.md`, `yaml/README.md`, `.github/pull_request_template.md`,
  `tools/gen.py`, `tools/templates/schemes.itermcolors`, the `pulls?state=closed` list and
  the repo metadata, all via `gh api` and raw GitHub (2026-10-08);
  `ProfilesColorsPreferencesViewController.m` for the gallery URL (2026-10-08);
  `curl -I https://iterm2.com/colorgallery` for the redirect (2026-10-08).
- **Confidence**: verified for the format, the two source paths and the PR flow. Unverified:
  whether a maintainer would rather see the YAML path for a generated file, and whether the
  WCAG nudge would touch any Darkberry colour. Run `wcag_check.py` before the PR.

### Terminal Themes (the gallery's successor, in beta)

- **URL**: https://terminalthemes.com, submit at https://terminalthemes.com/submit
- **Kind**: hosted catalogue, run by the same maintainer, described on its own About page
  as "the rewrite of the iTerm2-Color-Schemes collection". Public beta. The GitHub repo's
  README banner points to it, and the repo's ten PRs merged on 2026-10-04 are titled
  "Add <theme> theme (from Terminal Themes)", so a theme published on the site appears to
  flow back into the repo.
- **Accepts**: an uploaded YAML or `.itermcolors` file, or colours copied from a published
  theme. Duplicate palettes and duplicate names are rejected. New themes stay pending until
  a moderator publishes them.
- **Fields**: Name; Author (claimable by a matching GitHub or GitLab login); Licence (an
  SPDX identifier from the site's allow-list, required). The form itself sits behind the
  login, so its other fields were not seen.
- **Add-ons**: light or dark marking and a WCAG grade on each listing; "Verified" and
  "TT Original" badges; collections. None of these were exercised.
- **Requirements**: a verified account, by email and password, passkey, GitHub, Google or
  GitLab. No fee stated. Moderator review before publishing.
- **Steps**:
  1. Register at https://terminalthemes.com/register and confirm the email.
  2. Open https://terminalthemes.com/submit, upload `Darkberry Mire.itermcolors`, set the
     licence to MIT, one submission per flavour.
  3. Wait for the moderator to publish.
- **Updates**: "Suggest a correction" on a live theme goes into a proposal queue. Owners can
  take a theme down.
- **Contacts**: https://terminalthemes.com/feedback.
- **Sources**: https://terminalthemes.com/, /about, /faq, /submit (2026-10-08). The
  mbadolato PR titles from 2026-10-04 (2026-10-08).
- **Confidence**: partly verified. The submission rules are from the site's own FAQ and
  About pages. The form fields, the licence allow-list and the site-to-repo flow are
  unverified because the form needs an account.

### Gogh

Covered in `docs/publishing/kitty.md`. Differences for iTerm2 only:

- **URL**: https://github.com/Gogh-Co/Gogh
- **Kind**: community installer. On macOS `apply_darwin()` writes a temporary
  `.itermcolors` with 18 keys, the 16 ANSI slots plus background and foreground, and runs
  `open` on it. iTerm2 then imports it. The README's support table marks iTerm2 as
  implemented but without a Docker test.
- **Accepts**: `themes/<Name>.yml` in Gogh's format, uppercase hex, as kitty.md describes.
  Nothing iTerm2-specific is kept: cursor, selection, bold, link, tab and badge are all
  dropped on the way to iTerm2.
- **Sources**: `apply-colors.sh` lines 718 to 1400, `README.md`, `docs/CONTRIBUTING.md`,
  repo metadata 10,329 stars, pushed 2026-10-01 (2026-10-08).
- **Confidence**: verified for the mechanism. Low value for iTerm2 users, because a Gogh
  install of Darkberry is strictly poorer than the file in `ports/iterm/`.

### GitHub topic `iterm2-color-scheme`

- **URL**: https://github.com/topics/iterm2-color-scheme
- **Kind**: a self-applied tag. catppuccin/iterm is listed there.
- **Accepts**: any repository that adds the topic.
- **Fields**: none beyond the repo's own description.
- **Requirements**: write access to the DarkBerry repo settings.
- **Steps**: add `iterm2-color-scheme` and `iterm2` to the repository topics.
- **Sources**: the topic page, surfaced in search (2026-10-08).
- **Confidence**: verified that the page exists and lists theme repos. Reach unknown.

## Not applicable

- **iterm2colorschemes.com as a separate venue.** It is the GitHub Pages build of
  mbadolato/iTerm2-Color-Schemes, generated from `gh-pages/index.j2` by the repo's tooling.
  Nothing is submitted to it directly. Listed under the first venue instead.
- **iTerm2 itself.** The app ships built-in presets in its bundle and documents no way to
  add one. The Color Presets menu's only outward link is the gallery above
  (`kColorGalleryURL` in `ProfilesColorsPreferencesViewController.m`, 2026-10-08).
- **catppuccin/iterm and rose-pine/iterm.** Reference repos for one palette each, not
  collections.
- **Package registries, Homebrew.** A preset is one plist the user imports. No registry
  convention exists for it. Not searched further.
- **Base16 and Tinted Theming's iTerm2 output.** Those build from Darkberry's Base24 and
  Tinted8 ports, documented in `docs/publishing/base24.md` and `tinted8.md`, not from this
  one.

## Open questions

1. Which source path for mbadolato. `schemes/*.itermcolors` keeps every key but cannot
   opt out of the WCAG nudge. `yaml/*.yml` is what `AGENTS.md` prefers, can set
   `wcag_adjust: false`, and drops the match colour. A maintainer may ask for the second
   either way.
2. Scope: four flavours, or twenty with tints. The repo and Terminal Themes both hold flat
   lists, so twenty entries named "Lingonberry Mire" is allowed but noisy.
3. Whether to also ship a paired `Darkberry.itermcolors` with Wisp as light and Mire as
   dark. Catppuccin tried it and reverted. If shipped, it needs the two-context build pass
   above and its own usage text about the "Update Which Modes?" prompt.
4. The `Cursor Guide Color` choice: an opaque `ui.line.current` or `ui.text` with a small
   alpha. Needs a look in the app on each flavour.
5. The `Badge Color` alpha, and whether to set `Tab Color` at all when the user has to
   turn "Use Tab Color" on by hand.
6. Where the header block goes: an XML comment without `--`, or an extra key that the
   submission step strips. The extra key breaks mbadolato's reader as shipped.
7. Which account registers at Terminal Themes and whether to submit there before or after
   the GitHub PR, given that site submissions seem to feed the repo.
