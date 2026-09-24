1. Copy a flavour from this folder to `~/.config/tmux/`.
2. Source it from `tmux.conf`:

   ```
   source-file ~/.config/tmux/darkberry-mire.conf
   ```

3. Reload with `tmux source-file ~/.config/tmux/tmux.conf`.

The one file is the whole theme. It styles the status line (session badge on the left,
host and clock on the right), the window list with the active window on the tab colour,
pane borders, messages, copy-mode selection and search hits, the clock, pane numbers,
popups and menus.

You need tmux 3.2 or later. The popup and menu styles arrived in 3.3 and 3.4, and they're
set with `-q`, so an older tmux skips them instead of failing. The colours are 24-bit, so
tmux has to know it's on a truecolor terminal. kitty, Ghostty and Konsole all advertise
one. If yours doesn't, add this to `tmux.conf`:

```
set -as terminal-features ",xterm-256color:RGB"
```

The text and background inside each pane are the terminal's own, so pair this with the
kitty, Ghostty or Konsole port.
