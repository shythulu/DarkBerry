#!/usr/bin/env bash
# compose.sh <dir> [width] [height]
# Turns <dir>/{wisp,fen,mire,blackwater}.png into <dir>/<flavour>.webp and
# <dir>/preview.webp, the flavours in slanted slices as catppuccin/catwalk lays them
# out, all at width x height (default 1200x750). Needs ImageMagick (convert).
# A port that ships fewer flavours names them: FLAVOURS="fen mire blackwater" compose.sh <dir>
# (Dark Reader, whose registry entry is darkOnly).
set -e
d=${1:?usage: compose.sh <dir> [width] [height]}; W=${2:-1200}; H=${3:-750}; S=$((W/16))
read -r -a FL <<< "${FLAVOURS:-wisp fen mire blackwater}"; N=${#FL[@]}
command -v convert >/dev/null || { echo "ImageMagick's convert is needed (brew install imagemagick / apt install imagemagick)"; exit 1; }
for f in "${FL[@]}"; do [ -f "$d/$f.png" ] || { echo "missing $d/$f.png"; exit 1; }; done
# A transparent margin (a window shadow) is trimmed first; a frame of another shape is then scaled to cover the target and cropped at the centre, never stretched.
# An opaque frame is not trimmed: -trim would also cut a terminal's empty rows or a plain edge, and the frame would be zoomed.
# A frame taller than the target keeps its top (menu bar, toolbar, tabs), a wider one its middle.
trim=(); [ "$(convert "$d/mire.png" -format "%[opaque]" info: | tr A-Z a-z)" = true ] || trim=(-trim +repage) # ImageMagick 6 says true, 7 True
fw=$(convert "$d/mire.png" "${trim[@]}" -format "%w" info:); fh=$(convert "$d/mire.png" "${trim[@]}" -format "%h" info:)
if [ $((fh * W)) -gt $((fw * H)) ]; then g=north; else g=center; fi
for f in "${FL[@]}"; do convert "$d/$f.png" "${trim[@]}" -resize "${W}x${H}^" -gravity $g -extent "${W}x${H}" "$d/$f.webp"; done
i=0
for f in "${FL[@]}"; do
  x0=$((i*W/N)); x1=$(((i+1)*W/N))
  [ $i = 0 ] && l0=0 || l0=$((x0+S)); [ $i = 0 ] && l1=0 || l1=$((x0-S)); [ $i = $((N-1)) ] && r0=$W || r0=$((x1+S)); [ $i = $((N-1)) ] && r1=$W || r1=$((x1-S))
  convert -size "${W}x${H}" xc:black -fill white -draw "polygon $l0,0 $r0,0 $r1,$H $l1,$H" "$d/mask-$i.png"
  convert "$d/$f.webp" "$d/mask-$i.png" -alpha off -compose CopyOpacity -composite "$d/slice-$i.png"; i=$((i+1))
done
layers=("$d/slice-0.png"); for ((j = 1; j < N; j++)); do layers+=("$d/slice-$j.png" -composite); done
convert "${layers[@]}" -background none -quality 90 "$d/preview.webp"
rm -f "$d"/mask-*.png "$d"/slice-*.png
echo "wrote $d/{$(IFS=,; echo "${FL[*]}"),preview}.webp"
