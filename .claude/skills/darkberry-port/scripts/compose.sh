#!/usr/bin/env bash
# compose.sh <dir> [width] [height]
# Turns <dir>/{wisp,fen,mire,blackwater}.png into <dir>/<flavour>.webp and
# <dir>/preview.webp, the four flavours in slanted slices as catppuccin/catwalk lays them
# out, all at width x height (default 1200x750). Needs ImageMagick (convert).
set -e
d=${1:?usage: compose.sh <dir> [width] [height]}; W=${2:-1200}; H=${3:-750}; S=$((W/16))
command -v convert >/dev/null || { echo "ImageMagick's convert is needed (brew install imagemagick / apt install imagemagick)"; exit 1; }
for f in wisp fen mire blackwater; do [ -f "$d/$f.png" ] || { echo "missing $d/$f.png"; exit 1; }; done
# A transparent margin (a window shadow) is trimmed first; a frame of another shape is then scaled to cover the target and cropped at the centre, never stretched.
# A frame taller than the target keeps its top (menu bar, toolbar, tabs), a wider one its middle.
fw=$(convert "$d/mire.png" -trim +repage -format "%w" info:); fh=$(convert "$d/mire.png" -trim +repage -format "%h" info:)
if [ $((fh * W)) -gt $((fw * H)) ]; then g=north; else g=center; fi
for f in wisp fen mire blackwater; do convert "$d/$f.png" -trim +repage -resize "${W}x${H}^" -gravity $g -extent "${W}x${H}" "$d/$f.webp"; done
i=0
for f in wisp fen mire blackwater; do
  x0=$((i*W/4)); x1=$(((i+1)*W/4))
  [ $i = 0 ] && l0=0 || l0=$((x0+S)); [ $i = 0 ] && l1=0 || l1=$((x0-S)); [ $i = 3 ] && r0=$W || r0=$((x1+S)); [ $i = 3 ] && r1=$W || r1=$((x1-S))
  convert -size "${W}x${H}" xc:black -fill white -draw "polygon $l0,0 $r0,0 $r1,$H $l1,$H" "$d/mask-$i.png"
  convert "$d/$f.webp" "$d/mask-$i.png" -alpha off -compose CopyOpacity -composite "$d/slice-$i.png"; i=$((i+1))
done
convert "$d/slice-0.png" "$d/slice-1.png" -composite "$d/slice-2.png" -composite "$d/slice-3.png" -composite -background none -quality 90 "$d/preview.webp"
rm -f "$d"/mask-*.png "$d"/slice-*.png
echo "wrote $d/{wisp,fen,mire,blackwater,preview}.webp"
