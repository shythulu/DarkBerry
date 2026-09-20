# Darkberry style guide

Darkberry follows the same structure as [Catppuccin](https://github.com/catppuccin/catppuccin/tree/main/docs): one palette, one style guide that says what each colour means, and ports that apply it. The difference is that Darkberry's middle layer is machine-readable and checked by the build, because there is no review team to catch drift by eye.

## The three layers

| Layer | File | Decides | Changes affect |
|---|---|---|---|
| 1. Palette | `src/palette.json` | What each colour **is** | Every app |
| 2. Roles | `src/roles.json` | What each colour **means** (`ui.accent`, `syntax.function`, ANSI mapping) | Every app that shows that meaning |
| 3. Overrides | `src/overrides/<port>.json` | Rare, port-only exceptions | One app |

Port templates (`src/ports/`, `src/vscode/template.json`) reference roles inside `{braces}`. They may also name palette colours for purely structural chrome (a toolbar field, a scrollbar) that has no shared meaning.

## Rules the build enforces

1. **No literal colours outside the palette.** A hex value in a role, template or override fails the build. New colours go into the palette, where every port can use them.
2. **Shared meanings go through roles.** Every VS Code syntax rule must use a `syntax.*` role. Cursor, selection, links, status colours, badges and all terminal ANSI colours must use roles in every port.
3. **Deviations from Catppuccin are explained.** Every role records Catppuccin's choice; a role that differs without a `why` fails the build. The full list is in `docs/ROLES.md`.
4. **Overrides are justified.** Each needs a `why`, and may only reference palette colours, roles or mixes of them.
5. **Readable text.** Each syntax role declares a minimum contrast on the background (4.5:1 for text you read, 3:1 for structural glue like punctuation). Text on fills must reach 4.5:1.
6. **Distinct syntax colours.** Key syntax roles (keywords, functions, types, namespaces, constants, numbers, strings, regex, variables, errors) must be at least 5 apart in OKLab distance, and warn under 7. This is calibrated on Catppuccin: its closest pair of core syntax colours is 5.7, in Frappé.

Results are written to `docs/CHECKS.md` on every build.

## Where a change belongs

- *"I want the theme to feel more violet / warmer / deeper."* Palette. Use `tools/variants.mjs` or edit `src/palette.json`, then check `docs/specimen.html`.
- *"Functions should be a different colour."* Roles: point `syntax.function` at another palette colour or a `mix()`. If no palette colour works, the palette is missing one; add it there.
- *"This one colour looks wrong in the editor only."* First check `docs/USAGE.md` to see who else uses that palette colour. If it's genuinely editor-only, add an override with a reason.
- *"Italic variables."* Font style is editor-only, so it's a VS Code template or override concern, not a colour decision.

## Aligned with Catppuccin

- Four flavours, twelve neutrals with Catppuccin's names and jobs (base, mantle, crust, surfaces, overlays, subtexts, text) and fourteen accents.
- `dist/palette.json` uses Catppuccin's palette schema (hex, RGB, HSL, OKLCH, order, accent flag, flavour emoji, `ansiColors` with normal and bright), plus two extra colours, `jam` and `onjam`.
- Terminal ANSI colours are palette-level and use Catppuccin's mapping exactly: black and white from surfaces or subtexts depending on dark or light, and brights generated with Catppuccin's formula (CIE LCh lightness ×0.94 and chroma +8 for dark flavours, lightness ×1.09 for light, hue +2°). The implementation reproduces 23 of Catppuccin's 24 published brights exactly and the last within one RGB step.
- Background, text, status, cursor-text, inactive-border, mark and extended terminal colours follow Catppuccin's style guide.

## Deliberate deviations

The accent, fill, focus, cursor, selection and link roles, and the whole syntax mapping, are Darkberry's own identity rather than Catppuccin's. Each one, with its reason, is listed in `docs/ROLES.md` → *Deviations from Catppuccin*.

## Workflow

0. To explore before committing, use `docs/studio.html` and export a patch. It enforces the same rules as the build, including a reason for any new deviation from Catppuccin.
1. Edit `src/palette.json`, `src/roles.json` or an override.
2. `node build.mjs` (or `./package.sh` to also build the `.vsix` and `.xpi` files).
3. Read `docs/CHECKS.md` and open `docs/specimen.html`, which shows editor, terminal and browser together in all four flavours, like Catppuccin's catwalk previews.
4. Never hand-edit `ports/`, `dist/` or `docs/`; they're generated.

For variants: every variant is a variation on Darkberry, the default palette. `node tools/variants.mjs` regenerates all of them (the nature tints) and keeps their syntax colours distinct; `node tools/variants.mjs <variant> [hue step] [chroma step]` makes one, and `node build.mjs src/variants/<file>.json` builds it. Regenerate the variants after changing the default palette, so they pick up the change.
