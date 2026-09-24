1. Copy a flavour from this folder to `~/.config/lsd/colors.yaml`.
2. Set `color: {theme: custom}` in `~/.config/lsd/config.yaml`.

Needs lsd 1.1 or newer; below that lsd rejects hex strings and silently drops the whole
theme, so for lsd 1.0 (Ubuntu 24.04) use the `.256.yaml` companion, the same theme as
xterm-256 indices. Written against lsd 1.2.0, whose theme struct rejects unknown keys.
Notably `file-type` is skipped in that version, so a theme carrying it is discarded whole
and lsd falls back to its defaults without saying so. Every key here is one lsd 1.2.0
accepts.

That skipped key is why the [LS_COLORS](../ls-colors) port exists, and why you want both
halves. colors.yaml reaches only the metadata columns; the file and folder names, which are
most of what a listing actually shows, are left on lsd's stock blue and green until
LS_COLORS is set.
