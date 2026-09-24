<h3 align="center">
	<img src="../../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Crowberry for <a href="https://github.com/tinted-theming">Tinted8</a>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=2b233b&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=2b233b&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=2b233b&colorB=a3daa3&style=for-the-badge"></a>
</p>

<p align="center">
	<a href="../">🫐 <img src="https://img.shields.io/badge/Darkberry-fd7ca5?style=for-the-badge" alt="Darkberry"/></a>
	<a href="../lingonberry/">🍒 <img src="https://img.shields.io/badge/Lingonberry-f06a6a?style=for-the-badge" alt="Lingonberry"/></a>
	<a href="../cloudberry/">🍊 <img src="https://img.shields.io/badge/Cloudberry-f7ab84?style=for-the-badge" alt="Cloudberry"/></a>
	🍇 <img src="https://img.shields.io/badge/Crowberry-ddb0ec?style=for-the-badge" alt="Crowberry"/>
	<a href="../blueberry/">💙 <img src="https://img.shields.io/badge/Blueberry-8fb0f2?style=for-the-badge" alt="Blueberry"/></a>
</p>

<p align="center">
	<img src="../../../assets/previews/crowberry/preview.png"/>
</p>

## Previews

<details>
<summary>🕯️ Wisp</summary>
<img src="../../../assets/previews/crowberry/wisp.png"/>
</details>
<details>
<summary>🌾 Fen</summary>
<img src="../../../assets/previews/crowberry/fen.png"/>
</details>
<details>
<summary>🪦 Mire</summary>
<img src="../../../assets/previews/crowberry/mire.png"/>
</details>
<details>
<summary>🌑 Blackwater</summary>
<img src="../../../assets/previews/crowberry/blackwater.png"/>
</details>

## Usage

Darkberry as a [Tinted Theming](https://github.com/tinted-theming) scheme. Tinted
Theming's builders turn one scheme file into config for seventy-odd applications.

1. Copy a flavour from this folder into a builder's schemes directory.
2. Build:

   ```sh
   tinty install                      # or: tinted-builder-rust build .
   ```

Tinted8 is the newer spec. A scheme gives eight anchor colours for the builder to expand,
and it can add optional `syntax` and `ui` blocks that say outright what each colour is for
instead of leaving the builder to guess. Darkberry fills both blocks. The syntax block
carries the same token assignments as the VS Code port, and the ui block names the cursor,
gutter, current line, selection and status colours. That makes this the more faithful of
the two Tinted Theming ports. If your template only knows Base16 or Base24, use the
[Base24](../base24) port instead.

All four flavours were built with `tinted-builder-rust` 0.21.0, which rejects unknown
fields, and 105 keys were rendered back out and compared against the source.

## 💝 Thanks to

- [shythulu](https://github.com/shythulu)

&nbsp;

<p align="center">
	<img src="../../../assets/footers/darkberry_on_line.png" />
</p>

<p align="center">
	Copyright &copy; 2026-present <a href="https://github.com/shythulu/DarkBerry" target="_blank">shythulu</a>
</p>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=e9e4f4&colorA=2b233b&colorB=be4c8d"/></a>
</p>
