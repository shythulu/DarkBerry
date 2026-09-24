# Publishing the ports

One file per port, written 2026-09-24 by research agents from primary sources, for a later
agent (or person) to submit Darkberry to the places each app's themes are listed. Each file
has the same shape: **Venues** in order of reach, each with the URL, what it accepts, the
account and signing requirements, numbered steps, the update path, contacts, sources with
dates and a confidence level; **Not applicable**, the venues checked and ruled out; and
**Open questions**, the decisions a human has to make before submitting. Nothing has been
submitted anywhere except Firefox (see `../AMO.md`).

Confidence means: *verified*, read from the venue's own docs or repo; *partly verified*,
the mechanism is confirmed but some field (an image size, a form label, a review bar) is
not; *unverified*, only secondary evidence. Anything unverified needs a look in a browser
before it is relied on; several Pling-network sites (store.kde.org, gnome-look.org) block
automated fetches outright.

## Venues by port

| Port | Best venue | Others | Notes |
|---|---|---|---|
| [kitty](kitty.md) | kitty-themes (verified) | iTerm2-Color-Schemes, Gogh | Official collection takes PRs directly |
| [Ghostty](ghostty.md) | iTerm2-Color-Schemes (verified) | ghostty.style, Awesome-Ghostty | Ghostty bundles that repo weekly; submit a YAML source, not the generated file |
| [Alacritty](alacritty.md) | alacritty/alacritty-theme (verified) | rajasegar/alacritty-themes | **Author submissions are refused**; someone else must open the PR |
| [Konsole](konsole.md) | KDE Store (partly) | Konsole upstream, iTerm2-Color-Schemes, AUR | Upstream bundle is GPL; licence question open |
| [tmux](tmux.md) | awesome-tmux (partly) | tmux-plugins/list | No official venue; a TPM-style plugin repo would help |
| [Starship](starship.md) | starship presets (verified) | GitHub topic, curated lists | **AI policy**: disclosure required, no unsupervised agent PRs |
| [lsd](lsd.md) | lsd-rs Discussions "Show and tell" (partly) | none | No gallery exists; low reach |
| [LS_COLORS](ls-colors.md) | eza-themes (partly) | vivid | vivid needs the theme re-derived into its own schema |
| [btop++](btop.md) | btop themes/ folder (partly) | none | A Catppuccin PR was closed over licensing; check before opening |
| [bat](bat.md) | Package Control (verified) | delta themes.gitconfig | bat itself takes no new themes; Package Control needs a dedicated repo |
| [Neovim](neovim.md) | awesome-neovim (partly) | neovimcraft, dotfyle, vimcolorschemes | Plugin managers need a root `colors/` folder or a mirror repo |
| [micro](micro.md) | unofficial plugin channel (verified) | Discussion #4167, official channel (stalled) | Core repo no longer takes colorschemes |
| [VS Code](vscode.md) | Visual Studio Marketplace (partly) | Open VSX, vscodethemes, awesome-vscode | Needs an `icon` in package.json first |
| [Kate](kate.md) | KSyntaxHighlighting on KDE Invent (verified) | KDE Store | MIT-only bundling rule matches; free KDE Identity account |
| [Notepad++](notepadpp.md) | nppThemes (partly) | Community forum | **nppThemes relicenses to GPLv3** |
| [Obsidian](obsidian.md) | community theme directory (partly) | none | One repo per listing; four flavours means four repos or a switcher |
| [Nimbalyst](nimbalyst.md) | install from GitHub URL (partly) | marketplace catalog (unverified) | Loader wants an extension manifest, not the flat theme.json the port ships |
| [Firefox](firefox.md) | AMO (verified) | Zen Browser mods | Already listed; tints would be 16 more listings; Zen wants CC BY-NC-SA |
| [Chrome](chrome.md) | Chrome Web Store (partly) | Edge Add-ons (verified) | Store policy treats near-identical themes as spam; decide the item count |
| [KDE Plasma](kde.md) | KDE Store (partly) | none | Upstream ships only first-party schemes |
| [GTK 3](gtk.md) | gnome-look.org (partly) | Flathub GTK3 theme extension (opt-in) | Pling site blocks automated fetches; one product per flavour or one bundle is undecided |
| [JankyBorders](borders.md) | none exists (verified) | yabai/SketchyBar/AeroSpace Discussions | Documented absence |
| [darktable](darktable.md) | pixls.us forum (partly) | darktable upstream, Darktable CSS site | Upstream is GPL and lists no theme contribution path |
| [GIMP](gimp.md) | pixls.us forum (verified) | gnome-look.org, GIMP Chat, topic tags | No upstream path; extensions.gimp.org not live |
| [GIMP Palette](gpl.md) | Inkscape bundled palettes (verified) | Lospec, Krita, denilsonsa/gimp-palettes | Lospec wants the per-flavour files, not the combined one |
| [Base24](base24.md) | tinted-theming/schemes (verified) | Tinted Gallery (automatic) | Files already match the current format |
| [Tinted8](tinted8.md) | tinted-theming/schemes (partly) | none | No outside Tinted8 submission has happened yet; default branch is `spec-0.11` |

## Decisions that cut across ports

Settle these once, before any submission:

- **Whose accounts.** GitHub for PRs (most venues), a KDE Identity for KDE Invent, a Pling
  account for the KDE Store and gnome-look, a Visual Studio Marketplace publisher plus an
  Azure DevOps token, an Eclipse account for Open VSX, a Google developer account with a
  registration fee and 2-step verification for the Chrome Web Store, a Microsoft Partner
  Center account for Edge, the existing AMO credentials for Firefox.
- **Scope per venue.** Four flavours, or the twenty flavour-and-tint combinations? Stores
  that list one theme per item (Chrome, Firefox, Obsidian) multiply the work and, on Chrome,
  risk the spam policy; repos that hold many files (schemes, iTerm2-Color-Schemes,
  kitty-themes) take all of them in one PR.
- **Licence.** Darkberry is MIT. nppThemes relicenses to GPLv3, Zen Browser requires
  CC BY-NC-SA, and bundling into GPL projects (Konsole, darktable) raises the same question.
  Decide which of those are acceptable.
- **Who submits.** Alacritty's repo refuses submissions from the theme's author, and
  Starship's repo bans unsupervised agent PRs and requires AI-assistance disclosure. Both
  need a person in the loop, by design.
- **Repository shape.** Several venues (Obsidian, Package Control, Neovim plugin managers,
  micro's plugin channels) expect a small dedicated repository per theme rather than a
  folder in this one. A generated mirror repo per port would satisfy all of them.

## Port changes the research surfaced

Fix in the port before submitting, not in the venue:

- VS Code: add an `icon` (a square PNG) to both `package.json` files.
- Nimbalyst: the port ships `theme.json` per flavour; Nimbalyst's documented loader reads
  an extension `manifest.json` with a `contributions.themes` list. The usage text also
  lacks the on-disk path (`~/.config/Nimbalyst`, `~/Library/Application Support/Nimbalyst`,
  `%APPDATA%\Nimbalyst`).
- Chrome: the manifest description says "for Chrome and Edge"; Edge Add-ons requires
  Edge-branded wording.
- Firefox: the release workflow now signs only folders that hold a manifest, so the tint
  folders are skipped until they have AMO listings.
