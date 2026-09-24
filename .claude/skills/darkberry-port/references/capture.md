# Capturing a port's screenshots

What a frame needs: the app's own window, nothing else; 1200×750 (or the nearest the app
allows, and the same size for every flavour; ask the contributor to size the window to a
landscape shape near that before the run, because a taller frame is cropped to its top
and a wider one to its middle, and either loses part of the app); the same content in every flavour, in the
same scroll position; content that exercises the theme (code with strings, comments,
numbers and a keyword-heavy block; a selection; a search hit; a diff or an error state
where the app has one; for a terminal, a listing, git output and the sixteen ANSI colours).
Fonts and settings should be the app's defaults plus the theme, so a reader sees the
theme and not a configuration. The four frames are `wisp.png`, `fen.png`, `mire.png`,
`blackwater.png`, and `scripts/compose.sh` makes the rest.

Before each capture, identify the window and read the title and process back to the
contributor. Only then capture. Everything below writes to `$SHOT`, the folder agreed with
the contributor.

## macOS

Front window title and owner:

```sh
osascript -e 'tell application "System Events" to get {name, title of front window} of (first process whose frontmost is true)'
```

Capture one window: `screencapture -x -o -w "$SHOT/mire.png"` turns the cursor into a
camera; the contributor clicks the window they want, which keeps them in control of what
is captured (`-o` leaves out the window shadow, `-x` the sound). For a scriptable app
whose window id is known (`osascript -e 'tell application "Terminal" to id of window 1'`),
`screencapture -x -o -l <id> "$SHOT/mire.png"` captures it without a click. Screen
Recording permission is required for either; macOS asks the first time.

## Linux, X11

```sh
xdotool getactivewindow getwindowname          # title
xdotool getactivewindow getwindowpid | xargs ps -o comm= -p   # process
xdotool search --name '<title fragment>'      # ids by title, when the app is not in front
import -window "$(xdotool getactivewindow)" "$SHOT/mire.png"   # ImageMagick
```

`xdotool windowsize <id> 1200 750` sets the size first, if the app allows it.

## Linux, KDE Plasma (Wayland)

Plasma is its own case because a colour scheme changes the whole desktop, not one app,
and KWin exposes no scriptable "active window title". What worked, and what bit:

- Read the title and class by asking KWin to let the contributor click the window:
  `qdbus6 org.kde.KWin /KWin org.kde.KWin.queryWindowInfo` prints `caption`,
  `resourceClass` and geometry. The prompt lasts only about twenty seconds before D-Bus
  gives up with `NoReply`, so say "click now" as you run it, and loop a few times.
- Capture the active window with Spectacle without touching the desktop:
  `spectacle -a -b -n -o "$SHOT/mire.png"`. By default it keeps the window's shadow margin,
  a band of desktop around the frame; turn that off first with
  `kwriteconfig6 --file spectaclerc --group ImageSave --key includeShadow false` (older
  releases: group `General`), or crop afterwards.
- Running apps do not reliably repaint after `plasma-apply-colorscheme "<Name>"`; some
  keep the old colours for a while. Relaunch the app for each flavour instead: kill the
  instance you started (by the pid from `pgrep -n -x <app>`, never by a `pkill -f`
  pattern, which also matches the shell running the loop), apply the scheme, start it
  again with `setsid -f`, wait a few seconds, capture. Read the contributor's scheme
  first (`kreadconfig6 --group General --key ColorScheme`; empty means the look-and-feel
  package's default, in `/usr/share/plasma/look-and-feel/<package>/contents/defaults`)
  and put it back the same way afterwards. Kate's editor theme is a second layer, set
  with `kwriteconfig6 --file katerc --group "KTextEditor Renderer" --key "Color Theme"
  "<Name>"` (and `Auto Color Theme Selection` false); read both keys first to restore
  them. Spectacle's frames carry a transparent shadow margin whatever the config says;
  `compose.sh` trims it.
- Ask the contributor to keep their hands off the keyboard and mouse for the whole run.
  Every capture is of the live window, so navigating the app between flavours (a
  different settings page, a search typed in) gives four frames of different content,
  which the review rejects. A good KDE frame is System Settings on the Colours page: the
  themed chrome plus the scheme cards.

## Linux, Wayland (other compositors)

There is no window id to script against. On GNOME, `gnome-screenshot -w -f "$SHOT/mire.png"`
captures the focused window; on wlroots compositors (Sway, Hyprland),
`grim -g "$(slurp)" "$SHOT/mire.png"` lets the contributor drag the region, or
`hyprctl activewindow` gives the title and geometry for `grim -g`. Read the title from the
compositor (`hyprctl activewindow`, `swaymsg -t get_tree`) before capturing.

## Windows

Ask the contributor to capture: Alt+PrtScn copies the active window, and Snipping Tool
(Win+Shift+S, window mode) saves one. The title is in the window's caption bar; confirm
it with them. PowerShell can read it too:
`Get-Process | Where-Object MainWindowTitle | Select-Object Name, MainWindowTitle`.

## Headless or remote

The repository's own screenshots were taken on a Linux box with no display, under Xvfb
with the GLX extension, one throwaway HOME per flavour, a session D-Bus for GTK4 and GIMP,
and `import -window` on the app's window. That is the route for a contributor with a
server but no desktop; the harness is described in `docs/PORT_CREATION.md`. It is not the
route for a contributor's own desktop, where the consent rules above apply.

## By hand: the five files the README needs

`scripts/compose.sh <dir>` does all of this; these are its commands, for a contributor who
prefers to run them. Every port's `assets/` holds the same five files, so the shapes below
are what the build looks for.

1. One `.webp` per flavour, all the same size (1200×750 here; a frame of another shape is
   scaled to cover that and cropped at the centre, so a maximised window still works, at
   the cost of its edges):

   ```sh
   for f in wisp fen mire blackwater; do convert "$f.png" -resize 1200x750^ -gravity center -extent 1200x750 "$f.webp"; done
   ```

2. `preview.webp`, the four flavours side by side in slanted slices, wisp on the left
   through blackwater on the right. Each slice is a quarter of the width with its edges
   leaning by a sixteenth of the width (75px at 1200), so the seams run diagonally:

   ```sh
   W=1200; H=750; S=$((W/16)); i=0
   for f in wisp fen mire blackwater; do
     x0=$((i*W/4)); x1=$(((i+1)*W/4))
     [ $i = 0 ] && l0=0 || l0=$((x0+S)); [ $i = 0 ] && l1=0 || l1=$((x0-S))
     [ $i = 3 ] && r0=$W || r0=$((x1+S)); [ $i = 3 ] && r1=$W || r1=$((x1-S))
     convert -size ${W}x${H} xc:black -fill white -draw "polygon $l0,0 $r0,0 $r1,$H $l1,$H" mask-$i.png
     convert "$f.webp" mask-$i.png -alpha off -compose CopyOpacity -composite slice-$i.png
     i=$((i+1))
   done
   convert slice-0.png slice-1.png -composite slice-2.png -composite slice-3.png -composite -quality 90 preview.webp
   rm mask-*.png slice-*.png
   ```

3. Copy `wisp.webp`, `fen.webp`, `mire.webp`, `blackwater.webp` and `preview.webp` into
   `ports/<key>/assets/` (or `ports/<key>/<tint>/assets/`), delete the `.gitkeep` there,
   and run `node build.mjs`; the README switches from the palette strips to these files
   on its own, because it checks which of the five exist.

Without ImageMagick, `cwebp` (from the `webp` package) makes the four flavour files
(`cwebp -q 90 mire.png -o mire.webp`), but not the composite; a port may ship with only
the four, and the README then shows the palette strip as its main preview.

## Afterwards

Once `compose.sh` has run and the `.webp` files are in `ports/<key>/assets/`, with the
contributor watching:

```sh
ls -la "$SHOT"
rm -rv "$SHOT"
ls "$SHOT" 2>&1   # No such file or directory
```
