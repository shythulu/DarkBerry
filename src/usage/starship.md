1. Copy a flavour from this folder over `~/.config/starship.toml`.

A two-line box-drawing prompt: row one is where you are, row two is the caret with the last
command's result on the right margin. The frame is plain Unicode, so it survives without a
Nerd Font; only the module icons need one.

The palette inside each file is split on purpose. Entries named after a role take their
colour from `src/roles.json`, so anything meaning "this failed" follows `ui.error`. Entries
named after a palette colour cover what no role describes: a language's brand colour, or a
git state that only needs to be distinguishable.
