#!/usr/bin/env sh
# Build everything, then package each port into dist/: the VS Code .vsix, a Firefox .xpi
# per flavour, and zips of the kitty, Ghostty and Obsidian theme files.
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
ls dist
