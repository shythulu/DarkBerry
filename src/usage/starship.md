1. Copy a flavour from this folder over `~/.config/starship.toml`.

It's a two-line prompt drawn with box characters. The top line says where you are. The
bottom line is the caret, with the last command's result on the right margin. The frame is
plain Unicode, so it renders without a Nerd Font. Only the module icons need one.

The `[palettes]` block in each file has two kinds of entry, on purpose. Entries named after
a role (`error`, `warning`, `success` and so on) take their colour from `src/roles.json`,
so anything that means "this failed" is the same red as an error everywhere else. Entries
named after a palette colour cover things no role describes, like a language's brand
colour or a git state that only needs to look different from the one next to it.
