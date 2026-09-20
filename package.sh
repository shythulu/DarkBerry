#!/usr/bin/env sh
# Build everything, then package the VS Code .vsix and Firefox .xpi files into dist/.
set -e
cd "$(dirname "$0")"
rm -f dist/*.vsix dist/*.xpi
node build.mjs "$@"
cp LICENSE ports/vscode/LICENSE
cp README.md ports/vscode/README.md
(cd ports/vscode && npx --yes @vscode/vsce package --allow-missing-repository --skip-license -o ../../dist/)
VERSION=$(node -p "require('./src/palette.json').version")
for dir in ports/firefox/*/; do
  name=$(basename "$dir")
  (cd "$dir" && rm -f "../../../dist/darkberry-$name-$VERSION.xpi" && zip -qr "../../../dist/darkberry-$name-$VERSION.xpi" manifest.json)
done
ls dist
