1. Copy a flavour from this folder to `~/.config/darkberry/`.
2. Source it in your shell rc:

   ```sh
   . ~/.config/darkberry/darkberry-mire.sh
   ```

The file exports `LS_COLORS`. lsd, GNU `ls`, eza, fd, dust, delta and zsh's completion
menu all read that variable, so this one file colours every listing on the machine.
Directories get the accent. Source, config, prose, media and archives each get their own
hue. Build output and backups drop below the body-text colour so they fade. Executables
stay green and symlinks stay a cool colour, because people have read them that way since
long before anyone had a theme.

macOS ships BSD `ls`, which reads `LSCOLORS` instead. That's a different format limited to
the eight ANSI colours, and it can't hold this theme. Use lsd or GNU `ls` from coreutils
there.
