Works in VS Code, Cursor, VSCodium and Windsurf.

1. Download `darkberry-theme-<version>.vsix` from [Releases](https://github.com/shythulu/DarkBerry/releases), or build it with `./package.sh`.
2. Install it via Extensions > `...` > Install from VSIX, or:

   ```sh
   code --install-extension darkberry-theme-<version>.vsix
   ```

3. Pick a flavour with Ctrl+K Ctrl+T.

To publish it under your own name, change `publisher` in `build.mjs` before building.
