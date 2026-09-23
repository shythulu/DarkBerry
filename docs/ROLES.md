# Roles

Generated from `src/roles.json`. Every port references these names.

| Role | Value | Wisp | Fen | Mire | Blackwater | Catppuccin |
|---|---|---|---|---|---|---|
| `ui.background` | `base` | `#fbf4f8` | `#4f3143` | `#2a1e26` | `#1d121a` | same |
| `ui.pane.secondary` | `mantle` | `#f3e6ef` | `#402838` | `#23161f` | `#170d13` | same |
| `ui.pane.tertiary` | `crust` | `#ebdae5` | `#35212e` | `#1c1119` | `#12090f` | same |
| `ui.text` | `text` | `#4f3143` | `#f2e6ee` | `#efe3eb` | `#ede1e9` | same |
| `ui.text.muted` | `subtext0` | `#694e5f` | `#ccbac5` | `#cbbcc5` | `#c6b7c0` | same |
| `ui.text.subtle` | `overlay1` | `#967d8c` | `#a28297` | `#91828b` | `#887882` | same |
| `ui.accent` | `jam` | `#b9488b` | `#dc67a7` | `#be4c8d` | `#ba4889` | lavender (terminal borders), blue (tags) |
| `ui.on.accent` | `ui.on.fill` | `#ffffff` | `#35212e` | `#ffffff` | `#ffffff` | base (text on accent) |
| `ui.fill` | `jam` | `#b9488b` | `#dc67a7` | `#be4c8d` | `#ba4889` | no equivalent (accents are used as fills directly) |
| `ui.on.fill` | `onjam` | `#ffffff` | `#35212e` | `#ffffff` | `#ffffff` | base (text on accent) |
| `ui.focus` | `mix(cherry,overlay1,0.5)` | `#9e5e70` | `#c496a6` | `#b28a93` | `#ae848f` | lavender |
| `ui.border.active` | `ui.accent` | `#b9488b` | `#dc67a7` | `#be4c8d` | `#ba4889` | lavender |
| `ui.border.inactive` | `overlay1` | `#967d8c` | `#a28297` | `#91828b` | `#887882` | overlay0 |
| `ui.cursor` | `petal` | `#a83570` | `#ffc4dd` | `#feafd4` | `#feafd4` | rosewater |
| `ui.cursor.text` | `dark: crust, light: base` | `#fbf4f8` | `#35212e` | `#1c1119` | `#12090f` | same |
| `ui.selection` | `mix(ui.background,berry,0.18)` | `#f0cadd` | `#6e4457` | `#502f3d` | `#452533` | overlay2 at 20-30% opacity |
| `ui.line.current` | `mix(ui.background,surface0,0.35)` | `#f1e6ed` | `#543648` | `#2d1f28` | `#21151d` | no equivalent (editors tint the line themselves) |
| `ui.link` | `frost` | `#026b80` | `#83d4db` | `#86c0cc` | `#86c0cc` | blue |
| `ui.success` | `gooseberry` | `#2c6f2d` | `#b7e6b7` | `#a3daa3` | `#a3daa3` | same |
| `ui.warning` | `honey` | `#815b02` | `#f0d6a0` | `#e8c98a` | `#e8c98a` | same |
| `ui.error` | `cranberry` | `#bb262a` | `#ff8a8a` | `#f06a6a` | `#f06a6a` | same |
| `ui.on.error` | `dark: crust, light: onjam` | `#ffffff` | `#35212e` | `#1c1119` | `#12090f` | no equivalent |
| `ui.info` | `juniper` | `#006f5f` | `#b0dfd9` | `#9ed0c4` | `#9ed0c4` | same |
| `ui.bell` | `honey` | `#815b02` | `#f0d6a0` | `#e8c98a` | `#e8c98a` | same |
| `ui.mark1` | `lavender` | `#7350a8` | `#c9b0e8` | `#baa8dc` | `#baa8dc` | same |
| `ui.mark2` | `plum` | `#8c3eb2` | `#ecbcfc` | `#ddb0ec` | `#ddb0ec` | same |
| `ui.mark3` | `bilberry` | `#1d64a4` | `#9cc6ea` | `#7fb4e0` | `#7fb4e0` | same |
| `ui.mark.text` | `ui.cursor.text` | `#fbf4f8` | `#35212e` | `#1c1119` | `#12090f` | same |
| `ui.tab.active` | `ui.background` | `#fbf4f8` | `#4f3143` | `#2a1e26` | `#1d121a` |  |
| `ui.tab.inactive` | `ui.pane.secondary` | `#f3e6ef` | `#402838` | `#23161f` | `#170d13` |  |
| `ui.tab.indicator` | `tint` | `#d21570` | `#fa99b4` | `#fd7ca5` | `#fd7ca5` |  |
| `ui.on.tab.indicator` | `dark: crust, light: base` | `#fbf4f8` | `#35212e` | `#1c1119` | `#12090f` |  |
| `ui.badge` | `ui.fill` | `#b9488b` | `#dc67a7` | `#be4c8d` | `#ba4889` |  |
| `ui.on.badge` | `ui.on.fill` | `#ffffff` | `#35212e` | `#ffffff` | `#ffffff` |  |
| `ui.emphasis` | `cherry` | `#a53f54` | `#e7aab5` | `#d3919c` | `#d3919c` | no single colour (nvim PmenuMatch: text bold; Title: blue) |
| `ui.search.matches` | `mix(ui.background,ui.mark1,0.22)` | `#ddd0e6` | `#6a4d67` | `#4a3c4e` | `#403345` | sky at 30% into base (nvim Search) |
| `ui.diff.added` | `mix(ui.background,ui.success,0.18)` | `#d6dcd3` | `#625258` | `#40403d` | `#353633` | same |
| `ui.diff.changed` | `mix(ui.background,ui.warning,0.1)` | `#efe5df` | `#5f424c` | `#3d2f30` | `#312425` | blue at 7% into base |
| `ui.diff.removed` | `mix(ui.background,syntax.diff.removed,0.18)` | `#ead4cf` | `#6e4652` | `#4e3235` | `#43282b` | red at 18% into base |
| `ui.diff.text` | `mix(ui.background,ui.warning,0.18)` | `#e5d8cc` | `#6c4f54` | `#4c3d38` | `#42332e` | blue at 30% into base |
| `terminal.color16` | `apricot` | `#a24712` | `#f7bf9e` | `#f2ad8a` | `#f2ad8a` | same |
| `terminal.color17` | `blossom` | `#934b66` | `#eaafd6` | `#e7c5d8` | `#e7c5d8` | same |
| `syntax.text` | `text` | `#4f3143` | `#f2e6ee` | `#efe3eb` | `#ede1e9` | same |
| `syntax.keyword` | `berry` | `#bf0b64` | `#fa99b4` | `#fd7ca5` | `#fd7ca5` | mauve |
| `syntax.function` | `petal` | `#a83570` | `#ffc4dd` | `#feafd4` | `#feafd4` | blue |
| `syntax.type` | `plum` | `#8c3eb2` | `#ecbcfc` | `#ddb0ec` | `#ddb0ec` | yellow |
| `syntax.namespace` | `lavender` | `#7350a8` | `#c9b0e8` | `#baa8dc` | `#baa8dc` | yellow (as types) |
| `syntax.constant` | `blueberry` | `#3659ca` | `#a4c3f6` | `#8fb0f2` | `#8fb0f2` | peach |
| `syntax.number` | `honey` | `#815b02` | `#f0d6a0` | `#e8c98a` | `#e8c98a` | peach |
| `syntax.string` | `gooseberry` | `#2c6f2d` | `#b7e6b7` | `#a3daa3` | `#a3daa3` | same |
| `syntax.regex` | `juniper` | `#006f5f` | `#b0dfd9` | `#9ed0c4` | `#9ed0c4` | pink |
| `syntax.variable` | `blossom` | `#934b66` | `#eaafd6` | `#e7c5d8` | `#e7c5d8` | text (maroon for parameters) |
| `syntax.property` | `dark: mix(apricot,subtext0,0.3), light: mix(bilberry,subtext0,0.5)` | `#435982` | `#eabeaa` | `#e6b29c` | `#e5b09a` | blue |
| `syntax.operator` | `dark: subtext0, light: mix(subtext0,subtext1,0.6)` | `#604656` | `#ccbac5` | `#cbbcc5` | `#c6b7c0` | sky |
| `syntax.punctuation` | `dark: overlay1, light: mix(overlay1,overlay2,0.2)` | `#8f7685` | `#a28297` | `#91828b` | `#887882` | overlay2 |
| `syntax.comment` | `overlay2` | `#745b6a` | `#bd9fb1` | `#ad8da2` | `#a58799` | same |
| `syntax.link` | `ui.link` | `#026b80` | `#83d4db` | `#86c0cc` | `#86c0cc` | blue |
| `syntax.error` | `ui.error` | `#bb262a` | `#ff8a8a` | `#f06a6a` | `#f06a6a` | same |
| `syntax.deprecated` | `syntax.comment` | `#745b6a` | `#bd9fb1` | `#ad8da2` | `#a58799` | no equivalent |
| `syntax.unimplemented` | `syntax.comment` | `#745b6a` | `#bd9fb1` | `#ad8da2` | `#a58799` | no equivalent |
| `syntax.diff.removed` | `light: mix(cranberry,honey,0.5), dark: mix(cranberry,apricot,0.5)` | `#9e4116` | `#fba494` | `#f18c7a` | `#f18c7a` | red |

## Deviations from Catppuccin

| Role | Darkberry | Catppuccin | Why |
|---|---|---|---|
| `ui.accent` | `jam` | lavender (terminal borders), blue (tags) | Jam, the deeper pink already used for fills, carries the accent too, so focus and activity sit at the same weight as buttons and badges. Jam's lightness is set per flavour by the fill equation (lib/derive.mjs) so it clears every background by 3.3:1. |
| `ui.on.accent` | `ui.on.fill` | base (text on accent) | Text on the accent is text on the fill: onjam, chosen by the fill equation as white or crust, whichever reads on that flavour's jam. |
| `ui.fill` | `jam` | no equivalent (accents are used as fills directly) | A deeper jam colour is kept for buttons, badges and progress bars, so saturated pink never covers large areas. |
| `ui.on.fill` | `onjam` | base (text on accent) | Base on jam failed contrast in every flavour. onjam is white or crust per flavour, whichever reads best on that flavour's jam (the fill equation in lib/derive.mjs), and must reach 4.5:1. |
| `ui.focus` | `mix(cherry,overlay1,0.5)` | lavender | A soft berry focus ring stays visible without competing with the berry accent. |
| `ui.border.active` | `ui.accent` | lavender | Follows ui.accent. |
| `ui.border.inactive` | `overlay1` | overlay0 | overlay0 is under 3:1 on Wisp, Fen and Blackwater backgrounds, so an unfocused split or window edge was not reliably visible. overlay1 clears 3:1 in every flavour. |
| `ui.cursor` | `petal` | rosewater | A bright rose cursor is easy to find on dark, wine-tinted backgrounds; blossom, the rosewater slot, is too dusty for that. |
| `ui.selection` | `mix(ui.background,berry,0.18)` | overlay2 at 20-30% opacity | Selections are tinted with berry so they read as part of the theme rather than as grey. Mixed from the background rather than a surface step, so syntax colours on selected text keep most of their contrast. |
| `ui.line.current` | `mix(ui.background,surface0,0.35)` | no equivalent (editors tint the line themselves) | The cursor line is a tint of the background rather than a surface step, so syntax colours on the highlighted row keep most of their contrast. |
| `ui.link` | `frost` | blue | Links are teal-blue frost because blueberry already carries constants. |
| `ui.on.error` | `{"dark":"crust","light":"onjam"}` | no equivalent | Text drawn on an error fill (micro's error bar, Obsidian's destructive buttons). White on cranberry is 2.3:1 in Fen; crust reaches 6:1 in every dark flavour. |
| `ui.emphasis` | `cherry` | no single colour (nvim PmenuMatch: text bold; Title: blue) | Match text in lists and titles take one secondary accent, cherry, the colour VS Code's port already gives three of its four emphasis keys; it clears 5.6:1 on every background. |
| `ui.search.matches` | `mix(ui.background,ui.mark1,0.22)` | sky at 30% into base (nvim Search) | Every search hit but the current one is the mark colour faded 22% into the background, so the hits belong to the same family as the current match (ui.mark1); 22% is the most the tint can be while every syntax role keeps 65% of its minimum on it in all five tints (35% left comments at 81%). |
| `ui.diff.changed` | `mix(ui.background,ui.warning,0.1)` | blue at 7% into base | A changed line follows ui.warning, the colour modified lines carry in every port, at 10% so the changed span inside it (ui.diff.text, 18%) still stands out. |
| `ui.diff.removed` | `mix(ui.background,syntax.diff.removed,0.18)` | red at 18% into base | A removed line follows syntax.diff.removed, the warm red the removed text itself uses, so the line and its text agree and ui.error stays for errors. |
| `ui.diff.text` | `mix(ui.background,ui.warning,0.18)` | blue at 30% into base | The changed span inside a changed line is the same warning tint at nearly twice the strength of ui.diff.changed, without a second hue; 18% is the most it can be while every syntax role keeps 65% of its minimum on it in all five tints. |
| `syntax.keyword` | `berry` | mauve | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.function` | `petal` | blue | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.type` | `plum` | yellow | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.namespace` | `lavender` | yellow (as types) | Namespaces get their own cooler lilac so module names stay distinct from types. |
| `syntax.constant` | `blueberry` | peach | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.number` | `honey` | peach | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.regex` | `juniper` | pink | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.variable` | `blossom` | text (maroon for parameters) | Identifiers take a muted rose so code keeps a berry cast without shouting. |
| `syntax.property` | `{"dark":"mix(apricot,subtext0,0.3)","light":"mix(bilberry,subtext0,0.5)"}` | blue | A warm grey keeps object keys quieter than functions. The former lavender mix was 1.7 units from namespace in Fen; on Wisp the warm mix collides with diff.removed, so the light value mixes bilberry instead. |
| `syntax.operator` | `{"dark":"subtext0","light":"mix(subtext0,subtext1,0.6)"}` | sky | Structural glue recedes: one subtext step above comments. Light flavours sit between subtext0 and subtext1, because subtext0 is 1.6 from Wisp's darkened comment grey and subtext1 is 4.9 from crowberry's text. |
| `syntax.punctuation` | `{"dark":"overlay1","light":"mix(overlay1,overlay2,0.2)"}` | overlay2 | Quieter than comments. Wisp's overlay1 is 2.8:1 on crust, so the light value leans a fifth toward overlay2 to hold 3:1 there. |
| `syntax.link` | `ui.link` | blue | Follows ui.link. |
| `syntax.deprecated` | `syntax.comment` | no equivalent | Deprecated code is comment-coloured; the strikethrough VS Code draws is the distinction, a grey of its own was 1 to 3 units from comment and read as the same colour. |
| `syntax.unimplemented` | `syntax.comment` | no equivalent | Stubs share the comment colour. A separate faint lilac-grey sat under 2 units from punctuation. |
| `syntax.diff.removed` | `{"light":"mix(cranberry,honey,0.5)","dark":"mix(cranberry,apricot,0.5)"}` | red | Removed lines lean warm, toward apricot on dark flavours and honey on Wisp, so they sit six or more units from ui.error instead of three; a softer red never got far enough away. |

Aligned with Catppuccin: ANSI mapping and bright formula, all background, text and status roles, cursor text, inactive borders, marks, and extended terminal colours 16 and 17.
