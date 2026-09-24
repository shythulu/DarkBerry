<h3 align="center">
	<img src="../../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Blueberry for <a href="https://github.com/tinted-theming/base24">Base24</a>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=1d273e&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=1d273e&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=1d273e&colorB=a3daa3&style=for-the-badge"></a>
</p>

<p align="center">
	<a href="../">🫐 <img src="https://img.shields.io/badge/Darkberry-fd7ca5?style=for-the-badge" alt="Darkberry"/></a>
	<a href="../lingonberry/">🍒 <img src="https://img.shields.io/badge/Lingonberry-f06a6a?style=for-the-badge" alt="Lingonberry"/></a>
	<a href="../cloudberry/">🍊 <img src="https://img.shields.io/badge/Cloudberry-f7ab84?style=for-the-badge" alt="Cloudberry"/></a>
	<a href="../crowberry/">🍇 <img src="https://img.shields.io/badge/Crowberry-ddb0ec?style=for-the-badge" alt="Crowberry"/></a>
	💙 <img src="https://img.shields.io/badge/Blueberry-8fb0f2?style=for-the-badge" alt="Blueberry"/>
</p>

<p align="center">
	<img src="../../../assets/previews/blueberry/preview.png"/>
</p>

## Previews

<details>
<summary>🕯️ Wisp</summary>
<img src="../../../assets/previews/blueberry/wisp.png"/>
</details>
<details>
<summary>🌾 Fen</summary>
<img src="../../../assets/previews/blueberry/fen.png"/>
</details>
<details>
<summary>🪦 Mire</summary>
<img src="../../../assets/previews/blueberry/mire.png"/>
</details>
<details>
<summary>🌑 Blackwater</summary>
<img src="../../../assets/previews/blueberry/blackwater.png"/>
</details>

## Usage

Darkberry as a [Tinted Theming](https://github.com/tinted-theming) scheme. Tinted
Theming's builders turn one scheme file into config for seventy-odd applications.

1. Copy a flavour from this folder into a builder's schemes directory.
2. Build:

   ```sh
   tinty install                      # or: tinted-builder-rust build .
   ```

Base24 is the format most templates understand. It has twenty-four fixed slots, `base00`
to `base17`, and every Base16 and Base24 template reads them. The catch is that each slot
means two things at once, an editor colour and an ANSI colour, and Darkberry does not
always want the same colour for both. Where they clash, the file keeps the ANSI meaning,
so a terminal built from it matches the kitty, Ghostty and Konsole ports. Where the spec
names a slot for legibility, it keeps the legible colour instead. The header comment in
each file lists the slots that had to compromise and why. If your template supports it,
the [Tinted8](../tinted8) port is the more faithful of the two.

All four flavours were built with `tinted-builder-rust` 0.21.0, which rejects unknown
fields, and every value was rendered back out and compared against the source.

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
	<a href="https://github.com/shythulu/DarkBerry/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=e0e7f6&colorA=1d273e&colorB=be4c8d"/></a>
</p>
