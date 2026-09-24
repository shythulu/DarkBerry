1. Copy a `.tmTheme` file from this folder into `$(bat --config-dir)/themes/` (usually `~/.config/bat/themes/`).
2. Run `bat cache --build`.
3. Pick it:

   ```sh
   bat --theme="Darkberry Mire" file.rs        # or: export BAT_THEME="Darkberry Mire"
   ```

Any bat that has `bat cache --build` can load it. The theme was written against 0.24 and
checked on 0.26.1. Your terminal has to advertise truecolor (`COLORTERM=truecolor`), or
bat rounds every colour to the nearest xterm-256 index and the whole thing goes muddy.
The same `.tmTheme` also works in delta, gitui and Sublime Text, which read the caret,
selection and gutter keys that bat ignores.
