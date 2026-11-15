# Vendored sources

Third-party files the build compiles, copied unchanged. Each folder keeps its own licence;
none of it is under the repository's MIT licence.

| Folder | From | Licence | Used by |
|---|---|---|---|
| `adwaita-gtk3/` | GTK 3.24.52 (`6a0b360d`), `gtk/theme/Adwaita/` | LGPL-2.1-or-later (`COPYING`) | `src/ports/gtk-3.0.scss` |
| `adwaita-gtk4/` | GTK 4.24.1 (`2ea935e3`), `gtk/theme/Default/` | LGPL-2.1-or-later (`COPYING`) | `src/ports/gtk-4.0.scss` |
| `union-breeze/` | Union 6.8.0 (`3e1b08ad`), `src/input/css/styles/breeze/` | BSD-2-Clause (`LICENSE`) | `src/ports/union.css` |

Each folder holds `_drawing.scss`, `_common.scss` and `_colors-public.scss`, and every
file under `assets/` that the compiled normal-contrast stylesheets reference (`build.mjs`
fails if one is missing). The knob PNGs are redrawn in each flavour's colours by
`recolourKnob()` in `build.mjs`; the rest are copied as they are. GTK's own `_colors.scss` is
not copied: the Darkberry template takes its place. To move to a newer GTK, copy the same
files from the new tag, update this table and the template headers, and check that
`sassc -M -t compact` on GTK's own entry file still reproduces the CSS GTK ships.

`union-breeze/contents/` is Breeze's Union style as KDE ships it. The build copies it into
every flavour's style folder with two kinds of change, both in `build.mjs`:

1. Every `custom-color("kcolorscheme", ...)` becomes a `var(--kcs-...)` that the Darkberry
   template defines, so the style no longer reads the active colour scheme.
2. A short list of rewrites (`UNION_REWRITES`), each with a reason and the number of
   places it must change. The build fails when a count is off.

A lookup the template does not define also fails the build. To move to a newer Union,
copy `src/input/css/styles/breeze/contents/` from the new tag, update this table and the
template header, and fix whatever the build then reports.
