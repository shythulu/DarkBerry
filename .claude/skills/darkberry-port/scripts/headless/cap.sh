#!/usr/bin/env bash
# Headless port screenshots on a Linux box with no display. Usage: ./cap.sh <port> [flavour ...]
# Every capture runs in its own Xvfb at 1200x750 with a throwaway HOME per flavour, so the
# apps read only the Darkberry files copied into it. Run mksample.sh once first.
# Output: $SHOTS/out/<port>/<flavour>.png, or $SHOTS/out/<tint>/<port>/ with TINT set.
# Apps that are not packages are found through FIREFOX (the firefox binary), CHROMIUM (a
# portable ungoogled-chromium folder: branded Chrome ignores --load-extension), GIMP (an
# extracted GIMP AppImage) and OBSIDIAN (an extracted Obsidian AppImage).
export LIBGL_ALWAYS_SOFTWARE=1
SH=$(cd "$(dirname "$0")" && pwd); ROOT=$(git -C "$SH" rev-parse --show-toplevel); PORTS=$ROOT/ports
SITE=${SITE_URL:-file://$ROOT/site} # the built site the browser shots open; a local server keeps paths out of the address bar
WORK=${SHOTS:-$HOME/.cache/darkberry-shots}; OUT=$WORK/out; SAMPLE=$WORK/sample
W=1200; H=750; FONT="JetBrainsMono Nerd Font"; FS=13
declare -A FULL=([wisp]="Darkberry Wisp" [fen]="Darkberry Fen" [mire]="Darkberry Mire" [blackwater]="Darkberry Blackwater")
declare -A DARK=([wisp]=0 [fen]=1 [mire]=1 [blackwater]=1)

if [ "${1:-}" != "--inner" ]; then
  port=$1; shift; fls=${*:-wisp fen mire blackwater}
  [ -d "$SAMPLE" ] || { echo "no sample project at $SAMPLE; run $SH/mksample.sh first"; exit 1; }
  for fl in $fls; do
    echo "== $port / $fl"
    timeout 400 xvfb-run -a -s "-screen 0 ${W}x${H}x24 +extension GLX +render" dbus-run-session -- bash "$0" --inner "$port" "$fl" 2>&1 | grep -v "^XIO\|after .* requests\|^$\|dbus-daemon\|XGetInputFocus" | tail -8
  done
  exit
fi
port=$2; fl=$3
# TINT=cloudberry selects a tint build: its files live in each port's <tint>/ subfolder under
# the tint's own id and name (cloudberry-mire.conf, "Cloudberry Mire"), and the captures go
# under out/<tint>/. Without it the default Darkberry files are captured.
ID=${TINT:-darkberry}; SUB=${TINT:+/$TINT}; NAME=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['name'])" "$ROOT/src/tints.json" "$ID")
VERSION=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['version'])" "$ROOT/src/palette.json")
full="$NAME ${FULL[$fl]#Darkberry }"; OUT=$OUT${SUB}
SBX=$WORK/home/$ID-$fl; mkdir -p "$SBX" "$OUT/$port"; export HOME=$SBX XDG_CONFIG_HOME=$SBX/.config XDG_DATA_HOME=$SBX/.local/share
mkdir -p "$SBX/.config" "$SBX/.local/share"
DEMO="ID=$ID SUB=$SUB PORTS=$PORTS SAMPLE=$SAMPLE bash $SH/demo.sh $fl"
BAT=$(command -v bat || command -v batcat) # Debian and Ubuntu install bat as batcat

wait_win() { WIN=; for i in $(seq 1 ${WAIT:-60}); do WIN=$(xdotool search --onlyvisible "$@" 2>/dev/null | tail -1); [ -n "$WIN" ] && return; sleep 0.5; done; echo "no window for $*"; }
grab() { # grab [delay] [root]: capture WIN (or the whole screen, for apps with dialogs) into the output file
  sleep "${1:-2}"; [ "${2:-}" = root ] && WIN=root; import -window "$WIN" "$OUT/$port/$fl.png" && echo "captured $(identify -format '%wx%h %k colours' "$OUT/$port/$fl.png")"; }
fit() { xdotool windowmove "$WIN" 0 0; xdotool windowsize "$WIN" $W $H; sleep 1; }
kitty_run() { # kitty_run <title> <cmd...>: a Darkberry-themed kitty running a command
  local title=$1; shift
  kitty --config "$PORTS/kitty$SUB/$ID-$fl.conf" -o font_family="$FONT" -o font_size=$FS -o initial_window_width=$W -o initial_window_height=$H \
    -o remember_window_size=no -o window_padding_width=14 -o confirm_os_window_close=0 --title "$title" bash -c "$*; sleep 300" >/dev/null 2>&1 &
  wait_win --classname kitty
}
kde_globals() { # the KDE colour scheme, applied the way plasma-apply-colorscheme does: written into kdeglobals
  { cat "$PORTS/kde$SUB/$full.colors"; printf '\n[General]\nColorScheme=%s\nfont=Noto Sans,10,-1,5,50,0,0,0,0,0\nfixed=%s,11,-1,5,50,0,0,0,0,0\n[KDE]\nSingleClick=false\n' "$full" "$FONT"; } > "$SBX/.config/kdeglobals"
  mkdir -p "$SBX/.local/share/color-schemes"; cp "$PORTS/kde$SUB/$full.colors" "$SBX/.local/share/color-schemes/"
}

case $port in
kitty)
  kitty_run "kitty" "$DEMO"; grab 3 ;;
alacritty)
  # import at the top level: Alacritty 0.13 (Ubuntu 24.04's) ignores it under [general]
  printf 'import = ["%s/alacritty%s/%s-%s.toml"]\n[font]\nsize = %s\n[font.normal]\nfamily = "%s"\n[window]\ndecorations = "None"\n[window.dimensions]\ncolumns = 128\nlines = 34\n[window.padding]\nx = 14\ny = 10\n' "$PORTS" "$SUB" "$ID" "$fl" $FS "$FONT" > "$SBX/alacritty.toml"
  alacritty --config-file "$SBX/alacritty.toml" -e bash -c "$DEMO; sleep 300" >/dev/null 2>&1 &
  wait_win --class Alacritty; grab 3 ;;
ghostty)
  ghostty --gtk-single-instance=false --class=darkberry.ghostty --theme="$PORTS/ghostty$SUB/$full" --font-family="$FONT" --font-size=$FS --window-width=128 --window-height=34 --window-padding-x=14 --window-padding-y=10 \
    --window-decoration=false --gtk-titlebar=false -e bash -c "$DEMO; sleep 300" >/dev/null 2>&1 &
  wait_win --class darkberry.ghostty; fit; grab 3 ;;
konsole)
  kde_globals; mkdir -p "$SBX/.local/share/konsole"; cp "$PORTS/konsole$SUB/$full.colorscheme" "$SBX/.local/share/konsole/"
  printf '[Appearance]\nColorScheme=%s\nFont=%s,%s,-1,5,50,0,0,0,0,0\n[General]\nName=Darkberry\nParent=FALLBACK/\nTerminalColumns=120\nTerminalRows=30\n' "$full" "$FONT" $FS > "$SBX/.local/share/konsole/Darkberry.profile"
  printf '[Desktop Entry]\nDefaultProfile=Darkberry.profile\n[KonsoleWindow]\nShowMenuBarByDefault=true\n[TabBar]\nTabBarVisibility=AlwaysShowTabBar\n' > "$SBX/.config/konsolerc"
  konsole --profile Darkberry -e bash -c "$DEMO; sleep 300" >/dev/null 2>&1 &
  wait_win --class konsole; fit; grab 3 ;;
tmux)
  # the theme with the sample project's name where the status line shows the host name
  sed 's/#h/bog/' "$PORTS/tmux$SUB/$ID-$fl.conf" > "$SBX/theme.conf"
  printf 'source-file %s/theme.conf\nset -as terminal-features ",xterm-kitty:RGB"\nset -g status-interval 1\n' "$SBX" > "$SBX/.tmux.conf"
  T="tmux -L shot -f $SBX/.tmux.conf"
  kitty_run "tmux" "$T new -d -s bog -n brew -c $SAMPLE '$DEMO; sleep 300'; sleep 1; $T split-window -h -l 36 -c $SAMPLE 'tree -C -L 2 --dirsfirst; sleep 300'; $T new-window -n notes -c $SAMPLE 'sleep 300'; $T new-window -n build -c $SAMPLE 'sleep 300'; $T select-window -t brew; $T select-pane -L; $T attach -t bog"
  grab 4 ;;
lsd)
  mkdir -p "$SBX/.config/lsd"; cp "$PORTS/lsd$SUB/$ID-$fl.yaml" "$SBX/.config/lsd/colors.yaml"; printf 'color:\n  theme: custom\nicons:\n  when: always\n' > "$SBX/.config/lsd/config.yaml"
  kitty_run "lsd" ". $PORTS/ls-colors$SUB/$ID-$fl.sh; cd $SAMPLE; printf '\\e[1;35m~/bog\\e[0m \\e[1;36m❯\\e[0m lsd -l --group-directories-first\\n'; lsd -l --group-directories-first --blocks permission,user,size,date,name; echo; printf '\\e[1;35m~/bog\\e[0m \\e[1;36m❯\\e[0m lsd --tree --depth 2 src notes\\n'; lsd --tree --depth 2 src notes"; grab 3 ;;
ls-colors)
  kitty_run "LS_COLORS" "cd $SAMPLE; . $PORTS/ls-colors$SUB/$ID-$fl.sh; printf '\\e[1;35m~/bog\\e[0m \\e[1;36m❯\\e[0m . ~/.config/darkberry/$ID-$fl.sh\\n'; printf '\\e[1;35m~/bog\\e[0m \\e[1;36m❯\\e[0m ls -l --group-directories-first\\n'; ls -l --color=always --group-directories-first --time-style=+%b\\ %e | sed 1d; echo; printf '\\e[1;35m~/bog\\e[0m \\e[1;36m❯\\e[0m tree -C -L 2\\n'; tree -C -L 2 --dirsfirst"; grab 3 ;;
btop)
  mkdir -p "$SBX/.config/btop/themes"; cp "$PORTS/btop$SUB/$ID-$fl.theme" "$SBX/.config/btop/themes/"
  printf 'color_theme = "%s-%s"\ntheme_background = True\nupdate_ms = 1000\nshown_boxes = "cpu mem net proc"\nproc_tree = False\nnet_iface = "lo"\n' "$ID" "$fl" > "$SBX/.config/btop/btop.conf"
  kitty_run "btop" "btop"; grab 9 ;;
bat)
  export BAT_CONFIG_DIR=$SBX/.config/bat; mkdir -p "$BAT_CONFIG_DIR/themes"; cp "$PORTS/bat$SUB/$full.tmTheme" "$BAT_CONFIG_DIR/themes/"; "$BAT" cache --build >/dev/null
  kitty_run "bat" "cd $SAMPLE; printf '\\e[1;35m~/bog\\e[0m \\e[1;36m❯\\e[0m bat --theme=\"$full\" src/main.rs\\n'; $BAT --theme='$full' --style=full --paging=never --color=always --decorations=always --terminal-width 130 --line-range 1:28 src/main.rs"; grab 3 ;;
starship)
  export STARSHIP_CONFIG=$PORTS/starship$SUB/$ID-$fl.toml
  printf 'eval "$(%s init bash)"\nclear\n' "$(command -v starship)" > "$SBX/.bashrc_shot"; touch "$SBX/.sudo_as_admin_successful"
  kitty_run "starship" "cd $SAMPLE; git switch -q main 2>/dev/null; git branch -q -D cloudberry 2>/dev/null; exec bash --rcfile $SBX/.bashrc_shot -i"; sleep 2
  for c in "ls src" "git status --short" "git switch -c cloudberry" "false" "echo brewing"; do xdotool type --window "$WIN" --delay 20 "$c"; xdotool key --window "$WIN" Return; sleep 0.8; done
  grab 2 ;;
neovim)
  mkdir -p "$SBX/.config/nvim/colors"; cp "$PORTS/neovim$SUB/$ID-$fl.lua" "$SBX/.config/nvim/colors/"
  printf 'vim.opt.termguicolors=true\nvim.opt.number=true\nvim.opt.cursorline=true\nvim.opt.signcolumn="yes"\nvim.opt.laststatus=2\nvim.opt.showmode=true\nvim.cmd.colorscheme("%s-%s")\n' "$ID" "$fl" > "$SBX/.config/nvim/init.lua"
  kitty_run "nvim" "cd $SAMPLE; nvim -c 'vsplit README.md' -c 'wincmd l' -c '12' -c 'normal! zt' -c '/potency' -c 'set hlsearch' src/main.rs"; grab 4 ;;
micro)
  mkdir -p "$SBX/.config/micro/colorschemes"; cp "$PORTS/micro$SUB/$ID-$fl.micro" "$SBX/.config/micro/colorschemes/"
  printf '{ "colorscheme": "%s-%s", "softwrap": false, "ruler": true, "diffgutter": true }\n' "$ID" "$fl" > "$SBX/.config/micro/settings.json"
  kitty_run "micro" "cd $SAMPLE; MICRO_TRUECOLOR=1 micro src/main.rs"; sleep 3; xdotool key --window "$WIN" ctrl+e; xdotool type --window "$WIN" --delay 40 "vsplit README.md"; xdotool key --window "$WIN" Return; sleep 1; xdotool key --window "$WIN" ctrl+w; xdotool key --window "$WIN" ctrl+f; xdotool type --window "$WIN" --delay 40 "potency"; sleep 1
  grab 2 ;;
kate|kde)
  kde_globals; mkdir -p "$SBX/.local/share/org.kde.syntax-highlighting/themes"; cp "$PORTS/kate$SUB/$ID-$fl.theme" "$SBX/.local/share/org.kde.syntax-highlighting/themes/"
  printf '[KTextEditor Renderer]\nAuto Color Theme Selection=false\nColor Theme=%s\nText Font=%s,12,-1,5,50,0,0,0,0,0\n[KTextEditor View]\nLine Numbers=true\nDynamic Word Wrap=false\n[General]\nShow Menu Bar=true\n[MainWindow]\nMenuBar=Enabled\n' "$full" "$FONT" > "$SBX/.config/katerc"
  QT_QPA_PLATFORMTHEME= kate -n "$SAMPLE/Cargo.toml" "$SAMPLE/README.md" "$SAMPLE/src/main.rs" >/dev/null 2>&1 &
  # Kate 26 opens an "LSP server start requested" dialog over the editor, so the main window
  # is the first Kate window that is not the dialog, and the dialog is unmapped.
  sleep 10; for i in $(seq 1 60); do
    WIN=$(for w in $(xdotool search --onlyvisible --class kate); do xdotool getwindowname "$w" | grep -q "LSP server" || echo "$w"; done | head -1)
    [ -n "$WIN" ] && break; sleep 0.5
  done
  for d in $(xdotool search --name "LSP server start requested"); do xdotool windowunmap "$d"; done
  fit; xdotool key --window "$WIN" ctrl+f; sleep 1; xdotool type --window "$WIN" --delay 30 "potency"; sleep 1
  # the KDE shot is Kate's settings dialog, which shows the colour scheme on ordinary widgets
  [ "$port" = kde ] && { xdotool key --window "$WIN" Escape; sleep 0.5; xdotool key --window "$WIN" ctrl+shift+comma; sleep 5; grab 1 root; exit; }
  grab 2 ;;
gtk)
  mkdir -p "$SBX/.themes" "$SBX/.local/share/themes" "$SBX/.config/gtk-3.0"; cp -r "$PORTS/gtk$SUB/$full" "$SBX/.themes/"; cp -r "$PORTS/gtk$SUB/$full" "$SBX/.local/share/themes/"
  printf '[Settings]\ngtk-theme-name=%s\ngtk-icon-theme-name=Adwaita\ngtk-font-name=Noto Sans 10\n' "$full" > "$SBX/.config/gtk-3.0/settings.ini"
  GTK_THEME="$full" gtk3-widget-factory >/dev/null 2>&1 &
  WAIT=120 wait_win --class gtk3-widget-factory; sleep 4; fit; sleep 2; grab 2 ;;
darktable)
  mkdir -p "$SBX/.config/darktable/themes"; cp /usr/share/darktable/themes/darktable.css "$SBX/.config/darktable/themes/"; cp "$PORTS/darktable$SUB/$ID-$fl.css" "$SBX/.config/darktable/themes/"
  cp "$SAMPLE/assets/photo.jpg" "$SBX/photo.jpg"
  darktable --conf ui_last/theme=$ID-$fl --conf ui_last/view=darkroom "$SBX/photo.jpg" >/dev/null 2>&1 &
  WAIT=240 wait_win --class darktable; sleep 12; fit; sleep 4; grab 2 ;;
gimp|gpl)
  # GIMP 3.2 keeps its config under GIMP/3.2 while its data lives under share/gimp/3.0
  G=$(readlink -f "${GIMP:?set GIMP to an extracted GIMP AppImage}"); data=$(ls "$G/usr/share/gimp" | head -1); ver=$("$G/AppRun" --version 2>/dev/null | grep -oE "[0-9]+\.[0-9]+" | head -1)
  C=$SBX/.config/GIMP/$ver; mkdir -p "$C/themes/$full" "$C/palettes"; cp -r "$G/usr/share/gimp/$data/themes/Default/." "$C/themes/$full/"; cp -r "$G/usr/share/gimp/$data/themes/System" "$C/themes/" # Default's common.css imports ../System/gimp.css
  if [ "${DARK[$fl]}" = 1 ]; then cp "$PORTS/gimp$SUB/$ID-$fl.css" "$C/themes/$full/gimp-dark.css"; scheme=dark; else cp "$PORTS/gimp$SUB/$ID-$fl.css" "$C/themes/$full/gimp-light.css"; scheme=light; fi
  printf '(theme "%s")\n(theme-color-scheme %s)\n' "$full" $scheme > "$C/gimprc"
  cp "$PORTS/gpl/"*.gpl "$C/palettes/"; if [ -n "$TINT" ]; then printf '(palette "%s")\n' "$NAME" > "$C/contextrc"; else printf '(palette "%s")\n' "$full" > "$C/contextrc"; fi
  # the palette shot docks the palette editor and list on the right and makes them the current page
  sed -e 's/(size 800 600)/(size 1200 750)/' "$G/usr/etc/gimp/$data/sessionrc" > "$C/sessionrc"
  if [ "$port" = gpl ]; then sed -e 's/(size 800 600)/(size 1200 750)/' -e 's/(dockable "gimp-brush-grid"/(dockable "gimp-palette-editor"\n                (tab-style automatic)\n                (aux-info\n                    (show-button-bar "true")))\n            (dockable "gimp-palette-list"\n                (tab-style automatic)\n                (aux-info\n                    (show-button-bar "true")))\n            (dockable "gimp-brush-grid"/' -e 's/(right-docks-width "205")/(right-docks-width "300")/' "$G/usr/etc/gimp/$data/sessionrc" > "$C/sessionrc"; fi
  cp "$SAMPLE/assets/photo.jpg" "$SBX/photo.jpg"
  "$G/AppRun" --no-splash "$SBX/photo.jpg" >"$SBX/gimp.log" 2>&1 &
  WAIT=240 wait_win --class gimp; sleep 15; for w in $(xdotool search --name "Welcome"); do wmctrl -i -c "$w"; done; sleep 3; wait_win --class gimp --name GIMP; fit; sleep 3; grab 2 root ;;
vscode)
  E=$SBX/vsext/shythulu.darkberry-theme-$VERSION; mkdir -p "$E" "$SBX/vsdata/User"
  if [ -n "$TINT" ]; then cp -r "$PORTS/vscode/with-tints/." "$E/"; else cp -r "$PORTS/vscode/." "$E/"; rm -rf "$E/with-tints"; fi
  printf '{ "workbench.colorTheme": "%s", "editor.fontFamily": "%s", "editor.fontSize": 14, "editor.minimap.enabled": true, "window.titleBarStyle": "custom", "workbench.startupEditor": "none", "update.mode": "none", "telemetry.telemetryLevel": "off", "workbench.tips.enabled": false, "security.workspace.trust.enabled": false, "editor.renderWhitespace": "none", "extensions.autoUpdate": false, "chat.commandCenter.enabled": false }\n' "$full" "$FONT" > "$SBX/vsdata/User/settings.json"
  code --no-sandbox --disable-gpu --user-data-dir "$SBX/vsdata" --extensions-dir "$SBX/vsext" --disable-workspace-trust "$SAMPLE" "$SAMPLE/src/main.rs" >/dev/null 2>&1 &
  WAIT=240 wait_win --class code; sleep 14; fit; xdotool key --window "$WIN" Escape; sleep 1; xdotool key --window "$WIN" Escape; sleep 1; xdotool key --window "$WIN" ctrl+alt+b; sleep 2; grab 2 ;;
firefox)
  # the start pages are the built site (npm ci, then npm run site in the repository)
  cd "$SBX"; npx --yes web-ext run --source-dir "$PORTS/firefox$SUB/$fl" --firefox "$(readlink -f "${FIREFOX:?set FIREFOX to a firefox binary}")" --no-input --start-url "$SITE/index.html#$fl/$ID" --start-url "$SITE/specimen.html" --pref "browser.aboutwelcome.enabled=false" --pref "datareporting.policy.firstRunURL=" >/dev/null 2>&1 &
  WAIT=240 wait_win --class firefox; sleep 12; fit; sleep 3; grab 2 ;;
chrome)
  U=$(readlink -f "${CHROMIUM:?set CHROMIUM to a portable ungoogled-chromium folder}")
  rm -rf "$SBX/chrome" "$SBX/crx"; mkdir -p "$SBX/crx" "$SBX/chrome/External Extensions"; cp -r "$PORTS/chrome$SUB/$full" "$SBX/crx/theme"
  "$U/chrome" --no-sandbox --disable-gpu --pack-extension="$SBX/crx/theme" >/dev/null 2>&1
  # Chromium's extension id: the first 32 hex digits of the key's SHA-256, spelled a to p
  EXT_ID=$(openssl rsa -in "$SBX/crx/theme.pem" -pubout -outform DER 2>/dev/null | sha256sum | head -c 32 | tr '0-9a-f' 'a-p')
  printf '{ "external_crx": "%s/crx/theme.crx", "external_version": "%s" }\n' "$SBX" "$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['version'])" "$PORTS/chrome$SUB/$full/manifest.json")" > "$SBX/chrome/External Extensions/$EXT_ID.json"
  "$U/chrome" --no-sandbox --test-type --disable-gpu --user-data-dir="$SBX/chrome" --load-extension="$PORTS/chrome$SUB/$full" --no-first-run --no-default-browser-check --disable-sync --window-size=$W,$H --window-position=0,0 \
    "$SITE/index.html#$fl/$ID" "$SITE/specimen.html" >/dev/null 2>&1 &
  WAIT=240 wait_win --class chromium; sleep 10; pkill -f "$SBX/chrome"; sleep 3
  # a second start with the theme already installed comes up without the install infobar
  "$U/chrome" --no-sandbox --test-type --disable-gpu --user-data-dir="$SBX/chrome" --load-extension="$PORTS/chrome$SUB/$full" --no-first-run --no-default-browser-check --disable-sync --disable-session-crashed-bubble --hide-crash-restore-bubble --window-size=$W,$H --window-position=0,0 \
    "$SITE/index.html#$fl/$ID" "$SITE/specimen.html" >/dev/null 2>&1 &
  WAIT=240 wait_win --class chromium; sleep 10; fit; sleep 3; grab 2 ;;
obsidian)
  O=$(readlink -f "${OBSIDIAN:?set OBSIDIAN to an extracted Obsidian AppImage}"); V=$SBX/vault; mkdir -p "$V/.obsidian/themes" "$SBX/.config/obsidian"; cp -r "$PORTS/obsidian$SUB/$full" "$V/.obsidian/themes/"; cp "$SAMPLE/README.md" "$SAMPLE/notes/"*.md "$V/"
  [ "${DARK[$fl]}" = 1 ] && base=obsidian || base=moonstone
  printf '{ "cssTheme": "%s", "theme": "%s", "baseFontSize": 16 }\n' "$full" $base > "$V/.obsidian/appearance.json"
  printf '{ "vaults": { "bog": { "path": "%s", "ts": 0, "open": true } } }\n' "$V" > "$SBX/.config/obsidian/obsidian.json"
  "$O/AppRun" --no-sandbox --disable-gpu "obsidian://open?path=$V&file=README" >/dev/null 2>&1 &
  WAIT=240 wait_win --class obsidian; sleep 12; fit; xdotool key --window "$WIN" ctrl+o; sleep 1; xdotool type --window "$WIN" --delay 40 "README"; sleep 1; xdotool key --window "$WIN" Return; sleep 3; grab 2 ;;
*) echo "no capture for $port" ;;
esac
pkill -P $$ >/dev/null 2>&1; pkill -f "tmux -L shot" >/dev/null 2>&1; true
