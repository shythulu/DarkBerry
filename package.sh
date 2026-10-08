#!/usr/bin/env sh
# Build everything, then package each port into its own ports/<port>/dist/. Every port gets
# two zips: the plain Darkberry one (the port's top-level files) and a with-tints one that
# also carries the <tint>/ subfolders. VS Code gets two .vsix files the same way, and Firefox
# and Thunderbird an .xpi per flavour of every tint. Screenshots (assets/) and earlier
# packages (dist/) stay out of every package.
set -e
cd "$(dirname "$0")"
rm -rf ports/*/dist
node build.mjs "$@"
VERSION=$(node -p "require('./src/palette.json').version")
REPO=$(node -p "require('./src/palette.json').repository")
PORTS=$(node -p "require('./src/ports.json').ports.map((p) => p.key).join(' ')")
TINTS=$(node -p "Object.keys(require('./src/tints.json')).filter((k) => k !== '\$comment' && k !== 'darkberry').join(' ')")
for port in $PORTS; do mkdir -p "ports/$port/dist"; done

# VS Code: the READMEs are generated with paths relative to their folder, which vsce would
# otherwise resolve against the repository root.
cp LICENSE ports/vscode/LICENSE; cp LICENSE ports/vscode/with-tints/LICENSE
(cd ports/vscode && npx --yes @vscode/vsce package --skip-license -o dist/ \
  --baseContentUrl "$REPO/blob/main/ports/vscode" --baseImagesUrl "$REPO/raw/main/ports/vscode")
(cd ports/vscode/with-tints && npx --yes @vscode/vsce package --skip-license -o ../dist/ \
  --baseContentUrl "$REPO/blob/main/ports/vscode/with-tints" --baseImagesUrl "$REPO/raw/main/ports/vscode/with-tints")

# Firefox: one theme per .xpi. Tint folders hold a flavour folder each.
for dir in ports/firefox/*/; do
  name=$(basename "$dir")
  [ "$name" = assets ] || [ "$name" = dist ] && continue
  if [ -f "$dir/manifest.json" ]; then
    (cd "$dir" && zip -qr "../dist/darkberry-$name-$VERSION.xpi" manifest.json)
  else
    for sub in "$dir"*/; do
      flavour=$(basename "$sub"); [ "$flavour" = assets ] && continue
      (cd "$sub" && zip -qr "../../dist/$name-$flavour-$VERSION.xpi" manifest.json)
    done
  fi
done

# Thunderbird: the same shape as Firefox, one theme per .xpi, named apart from Firefox's.
for dir in ports/thunderbird/*/; do
  name=$(basename "$dir")
  [ "$name" = assets ] || [ "$name" = dist ] && continue
  if [ -f "$dir/manifest.json" ]; then
    (cd "$dir" && zip -qr "../dist/darkberry-thunderbird-$name-$VERSION.xpi" manifest.json theme.css)
  else
    for sub in "$dir"*/; do
      flavour=$(basename "$sub"); [ "$flavour" = assets ] && continue
      (cd "$sub" && zip -qr "../../dist/$name-thunderbird-$flavour-$VERSION.xpi" manifest.json theme.css)
    done
  fi
done

# Every other port: the plain zip takes the port's top-level entries except assets/, dist/ and the
# tint folders (a theme can itself be a folder, as Chrome's and Obsidian's are); the
# with-tints zip takes everything but the screenshots and dist/.
skip=$(printf '%s\n' assets dist $TINTS)
for port in $PORTS; do
  [ "$port" = vscode ] || [ "$port" = firefox ] || [ "$port" = thunderbird ] && continue
  (cd "ports/$port" && ls | grep -vxF "$skip" | tr '\n' '\0' | xargs -0 zip -qr "dist/darkberry-$port-$VERSION.zip")
  (cd "ports/$port" && zip -qr "dist/darkberry-$port-with-tints-$VERSION.zip" . -x "assets/*" "*/assets/*" "dist/*")
done
ls ports/*/dist
