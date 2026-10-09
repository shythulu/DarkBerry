1. Copy a `.micro` file from this folder into `~/.config/micro/colorschemes/`.
2. `set colorscheme darkberry-mire`.

The files carry hex colours, so micro needs true colour. It turns it on when the terminal
sets `COLORTERM=truecolor`; otherwise force it with `set truecolor on` (micro 2.0.15) or
`MICRO_TRUECOLOR=1` (older releases).
