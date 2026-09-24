1. Copy a `.theme` file from this folder into `~/.config/btop/themes/`, keeping its name.
2. Pick it under Esc > Options > Color theme, or set `color_theme = "darkberry-mire"` in `btop.conf`.

btop lists themes by file name, so keep the names. Needs btop 1.3 or newer for every key,
and 1.4.7 for the process-list banner and followed-row keys, which older releases simply
skip. For a transparent terminal, set `theme_background = False` in `btop.conf` rather than
editing the file; on a terminal without truecolor, set `lowcolor = True`.
