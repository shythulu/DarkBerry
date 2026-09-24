1. Copy a flavour from this folder to `~/.config/tmux/`.
2. Source it from `tmux.conf`:

   ```
   source-file ~/.config/tmux/darkberry-mire.conf
   ```

3. Reload with `tmux source-file ~/.config/tmux/tmux.conf`.

The file is the whole theme: a two-segment status line (session badge on the left, host and
clock on the right), the window list with the active window on the tab indicator, pane
borders, messages, copy-mode selection and search hits, the clock, pane numbers, popups and
menus. It needs tmux 3.2 or later; the popup and menu styles are 3.3 and 3.4 and are set
with `-q`, so an older tmux skips them. The colours are 24-bit, so tmux must see a truecolor
terminal (kitty, Ghostty and Konsole all are); if not, add
`set -as terminal-features ",xterm-256color:RGB"` to `tmux.conf`. The pane's own text and
background stay the terminal's, so use it with the kitty, Ghostty or Konsole port.
