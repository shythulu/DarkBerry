1. Copy a flavour from this folder to `~/.config/darkberry/`.
2. Source it in your shell rc:

   ```sh
   . ~/.config/darkberry/darkberry-mire.sh
   ```

It exports `LS_COLORS`, which lsd, GNU `ls`, eza, fd, dust, delta and zsh's completion menu
all read, so the one file themes every listing on the machine. Directories take the accent;
source, configuration, prose, media and archives each take a hue; build leavings and backups
sit under the reading colour. Executables stay green and symlinks stay cool, because those
two meanings are older than any theme.

BSD `ls`, which is what macOS ships without coreutils, reads `LSCOLORS` instead, a different
format limited to the eight ANSI colours, which cannot carry these. Use lsd or GNU `ls` there.
