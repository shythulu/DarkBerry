Carries Darkberry into [Tinted Theming](https://github.com/tinted-theming), whose builders
turn one scheme file into configuration for seventy-odd applications.

1. Copy a flavour from this folder into a builder's schemes directory.
2. Build:

   ```sh
   tinty install                      # or: tinted-builder-rust build .
   ```

Tinted8 is the newer spec: eight anchor colours that a builder expands, plus optional
`syntax` and `ui` blocks that let a scheme state what it actually means instead of leaving
the builder to guess. Darkberry fills both blocks, so this file is the more faithful of the
two Tinted Theming ports: it carries the syntax assignments token for token from the VS Code
port, and names the cursor, gutter, current line, selection and status colours outright. For
templates that only know Base16 or Base24, use the [Base24](../base24) port.

Checked by building all four flavours with `tinted-builder-rust` 0.21.0, whose scheme
struct denies unknown fields; 105 keys were rendered back out and compared.
