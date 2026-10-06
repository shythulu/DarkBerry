Each flavour is two files: a `.theme` for the editor and a `.colors` scheme for the window
around it (menus, tabs, sidebars, status bar).

1. Copy the `.theme` files into `~/.local/share/org.kde.syntax-highlighting/themes/` and
   the `.colors` files into `~/.local/share/color-schemes/`.
2. Settings > Window Color Scheme, then pick a flavour, such as Darkberry Mire.
3. Settings > Configure Kate > Fonts & Colors, then pick the same flavour.

The window scheme applies to Kate alone, so the rest of the desktop keeps its colours; for
every KDE application at once, use the [KDE Plasma](../kde) port, which is the same scheme.
On Windows and macOS the two folders sit under `%LOCALAPPDATA%` and
`~/Library/Application Support` instead of `~/.local/share`.
