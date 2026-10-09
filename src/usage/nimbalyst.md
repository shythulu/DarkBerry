1. Copy a flavour's folder from this folder into Nimbalyst's `themes` directory:
   - macOS: `~/Library/Application Support/@nimbalyst/electron/themes/`
   - Linux: `~/.config/@nimbalyst/electron/themes/`
   - Windows: `%APPDATA%\@nimbalyst\electron\themes\`
2. Pick it under Settings > Themes.

Nimbalyst 0.79.1 creates the macOS folder itself; the Linux and Windows paths follow the
same app-data layout. Nimbalyst treats every folder in `themes` that holds a `theme.json` as a
theme.
