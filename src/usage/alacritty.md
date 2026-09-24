1. Copy a flavour from this folder to `~/.config/alacritty/themes/`.
2. Import it from `~/.config/alacritty/alacritty.toml`:

   ```toml
   [general]
   import = ["~/.config/alacritty/themes/darkberry-mire.toml"]
   ```

You need Alacritty 0.13 or newer, the first release that reads TOML. On 0.13 exactly, put
the `import` line at the top of the file instead of under `[general]`. Alacritty reloads
its config on save, so switching flavours means changing that one line. The theme file
covers the ANSI colours, cursor, selection, search, hints and vi mode, so there is nothing
else to set.
