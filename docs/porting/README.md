# Candidate ports

Research for ports Darkberry does not have yet. One file per app. Each file has two halves:
how to build the port, and where to publish it.

The apps were picked on 2026-10-08 from the Catppuccin and Rosé Pine port rankings. Every
one below is in Catppuccin's top 15 by GitHub stars, or is the biggest venue by downloads.

## Why these apps

| App | Signal | Count | Source |
|---|---|---|---|
| JetBrains | downloads | 2,179,450 | JetBrains Marketplace, Catppuccin Theme |
| Discord | stars | 1,442 | catppuccin/discord |
| userstyles | stars | 1,135 | catppuccin/userstyles |
| iTerm2 | stars | 957 | catppuccin/iterm |
| Windows Terminal | stars | 932 | catppuccin/windows-terminal |
| qBittorrent | stars | 930 | catppuccin/qbittorrent |
| Zed | stars | 909 | catppuccin/zed |

Left out on purpose: VS Code icons and cursors are not colour themes. Nix is packaging,
not a theme.

## Files

| File | App | Theme is |
|---|---|---|
| [jetbrains.md](jetbrains.md) | JetBrains IDEs | a plugin holding a UI theme JSON and an editor scheme XML |
| [discord.md](discord.md) | Discord | CSS for a client mod such as BetterDiscord or Vencord |
| [userstyles.md](userstyles.md) | Websites via Stylus | one UserCSS file per site |
| [iterm.md](iterm.md) | iTerm2 | an `.itermcolors` plist |
| [windows-terminal.md](windows-terminal.md) | Windows Terminal | a colour scheme object in a JSON fragment |
| [qbittorrent.md](qbittorrent.md) | qBittorrent | a `.qbtheme` Qt resource bundle |
| [zed.md](zed.md) | Zed | a theme family JSON inside an extension |

## Shape of a file

| Section | Holds |
|---|---|
| Porting: Format | The file format, every field, where it lives on disk, one theme per file or many |
| Porting: How Catppuccin and Rosé Pine do it | Their repos, build tools, the file a Darkberry template derives from |
| Porting: Mapping | App keys to Catppuccin palette names |
| Porting: Build plan | Templates to add under `src/ports/`, the output tree, what `build.mjs` cannot do |
| Venues | Same block format as [../publishing/README.md](../publishing/README.md) |
| Not applicable | Venues ruled out, with the reason |
| Open questions | Decisions a person makes before the port ships |

When a port is built, its venue blocks move to `docs/publishing/<key>.md` and the porting
half becomes `src/usage/<key>.md` and the template.
