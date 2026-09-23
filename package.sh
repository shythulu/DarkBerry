#!/usr/bin/env sh
# Build everything, then package each port into dist/: the VS Code .vsix, a Firefox .xpi
# per flavour, and zips of the kitty, Ghostty, Obsidian, KDE, Konsole, Nimbalyst, micro, Kate,
# Chrome, Notepad++ and btop theme files.
set -e
cd "$(dirname "$0")"
rm -f dist/*.vsix dist/*.xpi dist/*.zip
node build.mjs "$@"
cp LICENSE ports/vscode/LICENSE
cp README.md ports/vscode/README.md
(cd ports/vscode && npx --yes @vscode/vsce package --allow-missing-repository --skip-license -o ../../dist/)
VERSION=$(node -p "require('./src/palette.json').version")
for dir in ports/firefox/*/; do
  name=$(basename "$dir")
  (cd "$dir" && zip -qr "../../../dist/darkberry-$name-$VERSION.xpi" manifest.json)
done
(cd ports/kitty && zip -qr "../../dist/darkberry-kitty-$VERSION.zip" .)
(cd ports/ghostty && zip -qr "../../dist/darkberry-ghostty-$VERSION.zip" .)
(cd ports/obsidian && zip -qr "../../dist/darkberry-obsidian-$VERSION.zip" .)
(cd ports/kde && zip -qr "../../dist/darkberry-kde-$VERSION.zip" .)
(cd ports/konsole && zip -qr "../../dist/darkberry-konsole-$VERSION.zip" .)
(cd ports/nimbalyst && zip -qr "../../dist/darkberry-nimbalyst-$VERSION.zip" .)
(cd ports/micro && zip -qr "../../dist/darkberry-micro-$VERSION.zip" .)
(cd ports/kate && zip -qr "../../dist/darkberry-kate-$VERSION.zip" .)
(cd ports/chrome && zip -qr "../../dist/darkberry-chrome-$VERSION.zip" .)
(cd ports/notepadpp && zip -qr "../../dist/darkberry-notepadpp-$VERSION.zip" .)
(cd ports/gtk && zip -qr "../../dist/darkberry-gtk-$VERSION.zip" .)
(cd ports/darktable && zip -qr "../../dist/darkberry-darktable-$VERSION.zip" .)
(cd ports/gimp && zip -qr "../../dist/darkberry-gimp-$VERSION.zip" .)
(cd ports/gpl && zip -qr "../../dist/darkberry-gpl-$VERSION.zip" .)
(cd ports/starship && zip -qr "../../dist/darkberry-starship-$VERSION.zip" .)
(cd ports/borders && zip -qr "../../dist/darkberry-borders-$VERSION.zip" .)
(cd ports/lsd && zip -qr "../../dist/darkberry-lsd-$VERSION.zip" .)
(cd ports/ls-colors && zip -qr "../../dist/darkberry-ls-colors-$VERSION.zip" .)
(cd ports/tinted8 && zip -qr "../../dist/darkberry-tinted8-$VERSION.zip" .)
(cd ports/base24 && zip -qr "../../dist/darkberry-base24-$VERSION.zip" .)
(cd ports/btop && zip -qr "../../dist/darkberry-btop-$VERSION.zip" .)
ls dist
