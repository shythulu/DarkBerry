1. Copy a `.tmTheme` file from this folder into `$(bat --config-dir)/themes/` (usually `~/.config/bat/themes/`).
2. Run `bat cache --build`.
3. Pick it:

   ```sh
   bat --theme="Darkberry Mire" file.rs        # or: export BAT_THEME="Darkberry Mire"
   ```

Any bat with `bat cache --build` loads it; written against 0.24 and checked on 0.26.1. The
terminal must advertise truecolor (`COLORTERM=truecolor`) or bat rounds every colour to the
nearest xterm-256 index. The same file works in delta, gitui and Sublime Text, which read
the caret, selection and gutter keys bat ignores.
