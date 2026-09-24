<h3 align="center">
	<img src="../../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Cloudberry for <a href="https://github.com/tinted-theming">Tinted8</a>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=3b2316&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=3b2316&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=3b2316&colorB=a3daa3&style=for-the-badge"></a>
</p>

<p align="center">
	<a href="../">🫐 <img src="https://img.shields.io/badge/Darkberry-fd7ca5?style=for-the-badge" alt="Darkberry"/></a>
	<a href="../lingonberry/">🍒 <img src="https://img.shields.io/badge/Lingonberry-f06a6a?style=for-the-badge" alt="Lingonberry"/></a>
	🍊 <img src="https://img.shields.io/badge/Cloudberry-f7ab84?style=for-the-badge" alt="Cloudberry"/>
	<a href="../crowberry/">🍇 <img src="https://img.shields.io/badge/Crowberry-ddb0ec?style=for-the-badge" alt="Crowberry"/></a>
	<a href="../blueberry/">💙 <img src="https://img.shields.io/badge/Blueberry-8fb0f2?style=for-the-badge" alt="Blueberry"/></a>
</p>

<p align="center">
	<img src="../../../assets/previews/cloudberry/preview.png"/>
</p>

## Previews

<details>
<summary>🕯️ Wisp</summary>
<img src="../../../assets/previews/cloudberry/wisp.png"/>
</details>
<details>
<summary>🌾 Fen</summary>
<img src="../../../assets/previews/cloudberry/fen.png"/>
</details>
<details>
<summary>🪦 Mire</summary>
<img src="../../../assets/previews/cloudberry/mire.png"/>
</details>
<details>
<summary>🌑 Blackwater</summary>
<img src="../../../assets/previews/cloudberry/blackwater.png"/>
</details>

## Usage

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
	<a href="https://github.com/shythulu/DarkBerry/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=f5e3da&colorA=3b2316&colorB=be4c8d"/></a>
</p>
