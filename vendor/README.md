# Vendored sources

Third-party files the build compiles, copied unchanged. Each folder keeps its own licence;
none of it is under the repository's MIT licence.

| Folder | From | Licence | Used by |
|---|---|---|---|
| `adwaita-gtk3/` | GTK 3.24.52 (`6a0b360d`), `gtk/theme/Adwaita/` | LGPL-2.1-or-later (`COPYING`) | `src/ports/gtk-3.0.scss` |
| `adwaita-gtk4/` | GTK 4.24.1 (`2ea935e3`), `gtk/theme/Default/` | LGPL-2.1-or-later (`COPYING`) | `src/ports/gtk-4.0.scss` |

Each folder holds `_drawing.scss`, `_common.scss` and `_colors-public.scss`, and every
file under `assets/` that the compiled normal-contrast stylesheets reference (`build.mjs`
fails if one is missing). The knob PNGs are redrawn in each flavour's colours by
`recolourKnob()` in `build.mjs`; the rest are copied as they are. GTK's own `_colors.scss` is
not copied: the Darkberry template takes its place. To move to a newer GTK, copy the same
files from the new tag, update this table and the template headers, and check that
`sassc -M -t compact` on GTK's own entry file still reproduces the CSS GTK ships.
