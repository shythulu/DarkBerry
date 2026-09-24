Carries Darkberry into [Tinted Theming](https://github.com/tinted-theming), whose builders
turn one scheme file into configuration for seventy-odd applications.

1. Copy a flavour from this folder into a builder's schemes directory.
2. Build:

   ```sh
   tinty install                      # or: tinted-builder-rust build .
   ```

Base24 is the widely supported system: twenty-four fixed slots, `base00` to `base17`,
understood by every Base16 and Base24 template. Each slot does two jobs at once, an editor
meaning and an ANSI code, and where those disagree the file keeps the ANSI half so that a
terminal built from it matches the kitty, Ghostty and Konsole ports, and keeps the legible
half wherever the spec asks for legibility by name. The header comment in each file says
which slots were compromised and why. The [Tinted8](../tinted8) port is the more faithful
of the two.

Checked by building all four flavours with `tinted-builder-rust` 0.21.0, whose scheme
struct denies unknown fields; every value was rendered back out and compared.
