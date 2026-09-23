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
| `ui.accent` | `fen: berry, dark: jam, light: jam` | `#b9488b` | `#fa99b4` | `#ba4889` | `#ba4889` | lavender (terminal borders), blue (tags) |
| `ui.on.accent` | `fen: crust, dark: onjam, light: onjam` | `#ffffff` | `#35212e` | `#ffffff` | `#ffffff` | base (text on accent) |
| `ui.fill` | `jam` | `#b9488b` | `#ba4889` | `#ba4889` | `#ba4889` | no equivalent (accents are used as fills directly) |
| `ui.on.fill` | `onjam` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | base (text on accent) |
| `ui.focus` | `mix(cherry,overlay1,0.5)` | `#9e5e70` | `#c496a6` | `#b28a93` | `#ae848f` | lavender |
| `ui.border.active` | `ui.accent` | `#b9488b` | `#fa99b4` | `#ba4889` | `#ba4889` | lavender |
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
| `ui.badge` | `ui.fill` | `#b9488b` | `#ba4889` | `#ba4889` | `#ba4889` |  |
| `ui.on.badge` | `ui.on.fill` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` |  |
| `terminal.color16` | `apricot` | `#a24712` | `#f7bf9e` | `#f2ad8a` | `#f2ad8a` | same |
| `terminal.color17` | `blossom` | `#934b66` | `#e6b2d4` | `#e7c5d8` | `#e7c5d8` | same |
| `syntax.text` | `text` | `#4f3143` | `#f2e6ee` | `#efe3eb` | `#ede1e9` | same |
| `syntax.keyword` | `berry` | `#bf0b64` | `#fa99b4` | `#fd7ca5` | `#fd7ca5` | mauve |
| `syntax.function` | `petal` | `#a83570` | `#ffc4dd` | `#feafd4` | `#feafd4` | blue |
| `syntax.type` | `plum` | `#8c3eb2` | `#ecbcfc` | `#ddb0ec` | `#ddb0ec` | yellow |
| `syntax.namespace` | `lavender` | `#7350a8` | `#c9b0e8` | `#baa8dc` | `#baa8dc` | yellow (as types) |
| `syntax.constant` | `blueberry` | `#3659ca` | `#a4c3f6` | `#8fb0f2` | `#8fb0f2` | peach |
| `syntax.number` | `honey` | `#815b02` | `#f0d6a0` | `#e8c98a` | `#e8c98a` | peach |
| `syntax.string` | `gooseberry` | `#2c6f2d` | `#b7e6b7` | `#a3daa3` | `#a3daa3` | same |
| `syntax.regex` | `juniper` | `#006f5f` | `#b0dfd9` | `#9ed0c4` | `#9ed0c4` | pink |
| `syntax.variable` | `blossom` | `#934b66` | `#e6b2d4` | `#e7c5d8` | `#e7c5d8` | text (maroon for parameters) |
| `syntax.property` | `dark: mix(apricot,subtext0,0.3), light: mix(bilberry,subtext0,0.5)` | `#435982` | `#eabeaa` | `#e6b29c` | `#e5b09a` | blue |
| `syntax.operator` | `dark: subtext0, light: subtext1` | `#5a4050` | `#ccbac5` | `#cbbcc5` | `#c6b7c0` | sky |
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
| `ui.accent` | `{"fen":"berry","dark":"jam","light":"jam"}` | lavender (terminal borders), blue (tags) | Jam, the deeper pink already used for fills, carries the accent too, so focus and activity sit at the same weight as buttons and badges. Fen is the exception: jam is 2.4:1 on its plum base, so Fen's accent is berry (5.6:1), the same family as its tint. Fills stay jam everywhere. |
| `ui.on.accent` | `{"fen":"crust","dark":"onjam","light":"onjam"}` | base (text on accent) | Base on jam is 2.4 to 4.5:1. White reads on jam at 4.8:1 in every flavour; on Fen's berry accent crust reads at 7.3:1. |
| `ui.fill` | `jam` | no equivalent (accents are used as fills directly) | A deeper jam colour is kept for buttons, badges and progress bars, so saturated pink never covers large areas. |
| `ui.on.fill` | `onjam` | base (text on accent) | Base on jam fails contrast in every flavour (about 3:1). White passes at 4.8:1. |
| `ui.focus` | `mix(cherry,overlay1,0.5)` | lavender | A soft berry focus ring stays visible without competing with the berry accent. |
| `ui.border.active` | `ui.accent` | lavender | Follows ui.accent. |
| `ui.border.inactive` | `overlay1` | overlay0 | overlay0 is under 3:1 on Wisp, Fen and Blackwater backgrounds, so an unfocused split or window edge was not reliably visible. overlay1 clears 3:1 in every flavour. |
| `ui.cursor` | `petal` | rosewater | A bright rose cursor is easy to find on dark, wine-tinted backgrounds; blossom, the rosewater slot, is too dusty for that. |
| `ui.selection` | `mix(ui.background,berry,0.18)` | overlay2 at 20-30% opacity | Selections are tinted with berry so they read as part of the theme rather than as grey. Mixed from the background rather than a surface step, so syntax colours on selected text keep most of their contrast. |
| `ui.line.current` | `mix(ui.background,surface0,0.35)` | no equivalent (editors tint the line themselves) | The cursor line is a tint of the background rather than a surface step, so syntax colours on the highlighted row keep most of their contrast. |
| `ui.link` | `frost` | blue | Links are teal-blue frost because blueberry already carries constants. |
| `ui.on.error` | `{"dark":"crust","light":"onjam"}` | no equivalent | Text drawn on an error fill (micro's error bar, Kate's marks). White on cranberry is 2.3:1 in Fen; crust reaches 6:1 in every dark flavour. |
| `syntax.keyword` | `berry` | mauve | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.function` | `petal` | blue | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.type` | `plum` | yellow | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.namespace` | `lavender` | yellow (as types) | Namespaces get their own cooler lilac so module names stay distinct from types. |
| `syntax.constant` | `blueberry` | peach | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.number` | `honey` | peach | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.regex` | `juniper` | pink | Darkberry's syntax mapping: warm berry tones carry structure (keywords, functions, types) and cooler tones carry values (constants, strings, regex). |
| `syntax.variable` | `blossom` | text (maroon for parameters) | Identifiers take a muted rose so code keeps a berry cast without shouting. |
| `syntax.property` | `{"dark":"mix(apricot,subtext0,0.3)","light":"mix(bilberry,subtext0,0.5)"}` | blue | A warm grey keeps object keys quieter than functions. The former lavender mix was 1.7 units from namespace in Fen; on Wisp the warm mix collides with diff.removed, so the light value mixes bilberry instead. |
| `syntax.operator` | `{"dark":"subtext0","light":"subtext1"}` | sky | Structural glue recedes: one subtext step above comments. Light flavours take subtext1 because subtext0 is 1.6 from Wisp's darkened comment grey. |
| `syntax.punctuation` | `{"dark":"overlay1","light":"mix(overlay1,overlay2,0.2)"}` | overlay2 | Quieter than comments. Wisp's overlay1 is 2.8:1 on crust, so the light value leans a fifth toward overlay2 to hold 3:1 there. |
| `syntax.link` | `ui.link` | blue | Follows ui.link. |
| `syntax.deprecated` | `syntax.comment` | no equivalent | Deprecated code is comment-coloured; the strikethrough VS Code draws is the distinction, a grey of its own was 1 to 3 units from comment and read as the same colour. |
| `syntax.unimplemented` | `syntax.comment` | no equivalent | Stubs share the comment colour. A separate faint lilac-grey sat under 2 units from punctuation. |
| `syntax.diff.removed` | `{"light":"mix(cranberry,honey,0.5)","dark":"mix(cranberry,apricot,0.5)"}` | red | Removed lines lean warm, toward apricot on dark flavours and honey on Wisp, so they sit six or more units from ui.error instead of three; a softer red never got far enough away. |

Aligned with Catppuccin: ANSI mapping and bright formula, all background, text and status roles, cursor text, inactive borders, marks, and extended terminal colours 16 and 17.
