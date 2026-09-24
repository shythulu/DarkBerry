1. Copy a flavour from this folder to `~/.config/alacritty/themes/`.
2. Import it from `~/.config/alacritty/alacritty.toml`:

   ```toml
   [general]
   import = ["~/.config/alacritty/themes/darkberry-mire.toml"]
   ```

Needs Alacritty 0.13 or newer, the first release that reads TOML; on 0.13 itself put the
`import` line at the top of the file rather than under `[general]`. Alacritty reloads the
config on save, so switching flavours is editing that one line. Nothing else is needed:
the file carries the ANSI set, cursor, selection, search, hint and vi-mode colours.
