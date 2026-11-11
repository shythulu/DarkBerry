# Roles

Generated from `src/roles.json`. Every port references these names.

| Role | Value | Blackwater | Mire | Fen | Wisp | Catppuccin |
|---|---|---|---|---|---|---|
| `ui.background` | `base` | `#1d121a` | `#2a1e26` | `#4f3143` | `#fbf4f8` | same |
| `ui.pane.secondary` | `mantle` | `#170d13` | `#23161f` | `#402838` | `#f3e6ef` | same |
| `ui.pane.tertiary` | `crust` | `#12090f` | `#1c1119` | `#35212e` | `#ebdae5` | same |
| `ui.text` | `text` | `#ede1e9` | `#efe3eb` | `#f2e6ee` | `#4f3143` | same |
| `ui.text.muted` | `subtext0` | `#c6b7c0` | `#cbbcc5` | `#ccbac5` | `#694e5f` | same |
| `ui.text.subtle` | `overlay1` | `#887882` | `#91828b` | `#a28297` | `#967d8c` | same |
| `ui.accent` | `jam` | `#ba4889` | `#be4c8d` | `#dc67a7` | `#b9488b` | lavender (terminal borders), blue (tags) |
| `ui.on.accent` | `ui.on.fill` | `#ffffff` | `#ffffff` | `#35212e` | `#ffffff` | base (text on accent) |
| `ui.fill` | `jam` | `#ba4889` | `#be4c8d` | `#dc67a7` | `#b9488b` | no equivalent (accents are used as fills directly) |
| `ui.on.fill` | `onjam` | `#ffffff` | `#ffffff` | `#35212e` | `#ffffff` | base (text on accent) |
| `ui.focus` | `mix(cherry,overlay1,0.5)` | `#ae848f` | `#b28a93` | `#c496a6` | `#9e5e70` | lavender |
| `ui.border.active` | `ui.accent` | `#ba4889` | `#be4c8d` | `#dc67a7` | `#b9488b` | lavender |
| `ui.border.inactive` | `overlay1` | `#887882` | `#91828b` | `#a28297` | `#967d8c` | overlay0 |
| `ui.cursor` | `petal` | `#feafd4` | `#feafd4` | `#ffc4dd` | `#a83570` | rosewater |
| `ui.cursor.text` | `dark: crust, light: base` | `#12090f` | `#1c1119` | `#35212e` | `#fbf4f8` | same |
| `ui.selection` | `mix(ui.background,berry,0.18)` | `#452533` | `#502f3d` | `#6e4457` | `#f0cadd` | overlay2 at 20-30% opacity |
| `ui.line.current` | `mix(ui.background,surface0,0.35)` | `#21151d` | `#2d1f28` | `#543648` | `#f1e6ed` | no equivalent (editors tint the line themselves) |
| `ui.row.alternate` | `dark: surface0, light: ui.pane.secondary` | `#271a23` | `#32222c` | `#5d3e51` | `#f3e6ef` | mantle (KDE's View BackgroundAlternate) |
| `ui.link` | `frost` | `#86c0cc` | `#86c0cc` | `#83d4db` | `#026b80` | blue |
| `ui.success` | `gooseberry` | `#a3daa3` | `#a3daa3` | `#b7e6b7` | `#2c6f2d` | same |
| `ui.warning` | `honey` | `#e8c98a` | `#e8c98a` | `#f0d6a0` | `#815b02` | same |
| `ui.error` | `cranberry` | `#f06a6a` | `#f06a6a` | `#ff8a8a` | `#bb262a` | same |
| `ui.on.error` | `dark: crust, light: onjam` | `#12090f` | `#1c1119` | `#35212e` | `#ffffff` | no equivalent |
| `ui.info` | `juniper` | `#9ed0c4` | `#9ed0c4` | `#b0dfd9` | `#006f5f` | same |
| `ui.error.surface` | `dark: mix(ui.pane.secondary,ui.error,0.06), light: mix(ui.background,ui.error,0.06)` | `#241318` | `#2f1b24` | `#4b2e3d` | `#f7e8ec` | no equivalent (alerts tint the status colour themselves) |
| `ui.warning.surface` | `dark: mix(ui.pane.secondary,ui.warning,0.06), light: mix(ui.background,ui.warning,0.06)` | `#24181a` | `#2f2125` | `#4b323e` | `#f4ebe9` | no equivalent (alerts tint the status colour themselves) |
| `ui.info.surface` | `dark: mix(ui.pane.secondary,ui.info,0.06), light: mix(ui.background,ui.info,0.06)` | `#1f191e` | `#2a2129` | `#473342` | `#ececef` | no equivalent (alerts tint the status colour themselves) |
| `ui.success.surface` | `dark: mix(ui.pane.secondary,ui.success,0.06), light: mix(ui.background,ui.success,0.06)` | `#1f191c` | `#2b2227` | `#473340` | `#efecec` | no equivalent (alerts tint the status colour themselves) |
| `ui.bell` | `honey` | `#e8c98a` | `#e8c98a` | `#f0d6a0` | `#815b02` | same |
| `ui.mark1` | `lavender` | `#baa8dc` | `#baa8dc` | `#c9b0e8` | `#7350a8` | same |
| `ui.mark2` | `plum` | `#ddb0ec` | `#ddb0ec` | `#ecbcfc` | `#8c3eb2` | same |
| `ui.mark3` | `bilberry` | `#7fb4e0` | `#7fb4e0` | `#9cc6ea` | `#1d64a4` | same |
| `ui.mark.text` | `ui.cursor.text` | `#12090f` | `#1c1119` | `#35212e` | `#fbf4f8` | same |
| `ui.tab.active` | `ui.background` | `#1d121a` | `#2a1e26` | `#4f3143` | `#fbf4f8` |  |
| `ui.tab.inactive` | `ui.pane.secondary` | `#170d13` | `#23161f` | `#402838` | `#f3e6ef` |  |
| `ui.tab.indicator` | `tint` | `#fd7ca5` | `#fd7ca5` | `#fa99b4` | `#d21570` |  |
| `ui.on.tab.indicator` | `dark: crust, light: base` | `#12090f` | `#1c1119` | `#35212e` | `#fbf4f8` |  |
| `ui.badge` | `ui.fill` | `#ba4889` | `#be4c8d` | `#dc67a7` | `#b9488b` |  |
| `ui.on.badge` | `ui.on.fill` | `#ffffff` | `#ffffff` | `#35212e` | `#ffffff` |  |
| `ui.emphasis` | `cherry` | `#d3919c` | `#d3919c` | `#e7aab5` | `#a53f54` | no single colour (nvim PmenuMatch: text bold; Title: blue) |
| `ui.search.matches` | `mix(ui.background,ui.mark1,0.22)` | `#403345` | `#4a3c4e` | `#6a4d67` | `#ddd0e6` | sky at 30% into base (nvim Search) |
| `ui.diff.added` | `mix(ui.background,ui.success,0.18)` | `#353633` | `#40403d` | `#625258` | `#d6dcd3` | same |
| `ui.diff.changed` | `mix(ui.background,ui.warning,0.1)` | `#312425` | `#3d2f30` | `#5f424c` | `#efe5df` | blue at 7% into base |
| `ui.diff.removed` | `mix(ui.background,syntax.diff.removed,0.18)` | `#43282b` | `#4e3235` | `#6e4652` | `#ead4cf` | red at 18% into base |
| `ui.diff.text` | `mix(ui.background,ui.warning,0.18)` | `#42332e` | `#4c3d38` | `#6c4f54` | `#e5d8cc` | blue at 30% into base |
| `terminal.color16` | `apricot` | `#f2ad8a` | `#f2ad8a` | `#f7bf9e` | `#a24712` | same |
| `terminal.color17` | `blossom` | `#e7c5d8` | `#e7c5d8` | `#eaafd6` | `#934b66` | same |
| `syntax.text` | `text` | `#ede1e9` | `#efe3eb` | `#f2e6ee` | `#4f3143` | same |
| `syntax.keyword` | `berry` | `#fd7ca5` | `#fd7ca5` | `#fa99b4` | `#bf0b64` | mauve |
| `syntax.function` | `petal` | `#feafd4` | `#feafd4` | `#ffc4dd` | `#a83570` | blue |
| `syntax.type` | `plum` | `#ddb0ec` | `#ddb0ec` | `#ecbcfc` | `#8c3eb2` | yellow |
| `syntax.namespace` | `lavender` | `#baa8dc` | `#baa8dc` | `#c9b0e8` | `#7350a8` | yellow (as types) |
| `syntax.constant` | `blueberry` | `#8fb0f2` | `#8fb0f2` | `#a4c3f6` | `#3659ca` | peach |
| `syntax.number` | `honey` | `#e8c98a` | `#e8c98a` | `#f0d6a0` | `#815b02` | peach |
| `syntax.string` | `gooseberry` | `#a3daa3` | `#a3daa3` | `#b7e6b7` | `#2c6f2d` | same |
| `syntax.regex` | `juniper` | `#9ed0c4` | `#9ed0c4` | `#b0dfd9` | `#006f5f` | pink |
| `syntax.variable` | `blossom` | `#e7c5d8` | `#e7c5d8` | `#eaafd6` | `#934b66` | text (maroon for parameters) |
| `syntax.property` | `dark: mix(apricot,subtext0,0.3), light: mix(bilberry,subtext0,0.5)` | `#e5b09a` | `#e6b29c` | `#eabeaa` | `#435982` | blue |
| `syntax.operator` | `dark: subtext0, light: mix(subtext0,subtext1,0.6)` | `#c6b7c0` | `#cbbcc5` | `#ccbac5` | `#604656` | sky |
| `syntax.punctuation` | `dark: overlay1, light: mix(overlay1,overlay2,0.2)` | `#887882` | `#91828b` | `#a28297` | `#8f7685` | overlay2 |
| `syntax.comment` | `overlay2` | `#a58799` | `#ad8da2` | `#bd9fb1` | `#745b6a` | same |
| `syntax.link` | `ui.link` | `#86c0cc` | `#86c0cc` | `#83d4db` | `#026b80` | blue |
| `syntax.error` | `ui.error` | `#f06a6a` | `#f06a6a` | `#ff8a8a` | `#bb262a` | same |
| `syntax.deprecated` | `syntax.comment` | `#a58799` | `#ad8da2` | `#bd9fb1` | `#745b6a` | no equivalent |
| `syntax.unimplemented` | `syntax.comment` | `#a58799` | `#ad8da2` | `#bd9fb1` | `#745b6a` | no equivalent |
| `syntax.diff.removed` | `light: mix(cranberry,honey,0.5), dark: mix(cranberry,apricot,0.5)` | `#f18c7a` | `#f18c7a` | `#fba494` | `#9e4116` | red |

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
| `ui.row.alternate` | `{"dark":"surface0","light":"ui.pane.secondary"}` | mantle (KDE's View BackgroundAlternate) | Every other row of a list or table. Wisp takes mantle, as Catppuccin does; surface0 there was a heavy 1.42:1 stripe. The dark flavours keep surface0, which lifts a row off their base by 1.07 to 1.24:1, about what mantle sinks one on Wisp (1.12:1). |
| `ui.link` | `frost` | blue | Links are teal-blue frost because blueberry already carries constants. |
| `ui.on.error` | `{"dark":"crust","light":"onjam"}` | no equivalent | Text drawn on a full status fill: error bars in micro, Obsidian's destructive buttons, btop's banners. White on cranberry is 2.3:1 in Fen; crust reaches 6:1 on the error, warning and info fills in every dark flavour, white 5:1 on Wisp's. |
| `ui.error.surface` | `{"dark":"mix(ui.pane.secondary,ui.error,0.06)","light":"mix(ui.background,ui.error,0.06)"}` | no equivalent (alerts tint the status colour themselves) | A faint tint of the status colour behind status-coloured text: T3 Code's alerts and Obsidian's callouts. The dark flavours tint ui.pane.secondary, the card surface, because cranberry is only 4.8 to 5.0:1 on Fen's base across the tints and a 6% tint of base drops it to 4.36 (Cloudberry); over mantle the worst case is 5.09. Wisp's mantle is darker than its base, so there the tint comes from the background, 5.16:1. |
| `ui.warning.surface` | `{"dark":"mix(ui.pane.secondary,ui.warning,0.06)","light":"mix(ui.background,ui.warning,0.06)"}` | no equivalent (alerts tint the status colour themselves) | The warning counterpart of ui.error.surface, at the same 6% so the three status surfaces sit at one weight. |
| `ui.info.surface` | `{"dark":"mix(ui.pane.secondary,ui.info,0.06)","light":"mix(ui.background,ui.info,0.06)"}` | no equivalent (alerts tint the status colour themselves) | The info counterpart of ui.error.surface: T3 Code's update banner, at the same 6%. |
| `ui.success.surface` | `{"dark":"mix(ui.pane.secondary,ui.success,0.06)","light":"mix(ui.background,ui.success,0.06)"}` | no equivalent (alerts tint the status colour themselves) | The success counterpart of ui.error.surface: the Union style's positive inline messages, at the same 6%. |
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
| `syntax.operator` | `{"dark":"subtext0","light":"mix(subtext0,subtext1,0.6)"}` | sky | One subtext step above comments. Light flavours sit between subtext0 and subtext1, because subtext0 is 1.6 from Wisp's darkened comment grey and subtext1 is 4.9 from crowberry's text. |
| `syntax.punctuation` | `{"dark":"overlay1","light":"mix(overlay1,overlay2,0.2)"}` | overlay2 | Quieter than comments. Wisp's overlay1 is 2.8:1 on crust, so the light value leans a fifth toward overlay2 to hold 3:1 there contrast. |
| `syntax.link` | `ui.link` | blue | Follows ui.link. |
| `syntax.deprecated` | `syntax.comment` | no equivalent | Deprecated code is comment-coloured; the strikethrough VS Code draws is the distinction, a grey of its own was 1 to 3 units from comment and read as the same colour. |
| `syntax.unimplemented` | `syntax.comment` | no equivalent | Stubs share the comment colour. A separate faint lilac-grey sat under 2 units from punctuation. |
| `syntax.diff.removed` | `{"light":"mix(cranberry,honey,0.5)","dark":"mix(cranberry,apricot,0.5)"}` | red | Removed lines lean warm, toward apricot on dark flavours and honey on Wisp, so they sit six or more units from ui.error instead of three; a softer red never got far enough away. |

Aligned with Catppuccin: ANSI mapping and bright formula, all background, text and status roles, cursor text, inactive borders, marks, and extended terminal colours 16 and 17.
