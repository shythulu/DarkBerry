<h3 align="center">
	<img src="../../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Blueberry for <a href="https://www.gimp.org">GIMP</a>
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
	<img src="assets/preview.webp"/>
</p>

## Previews

<details>
<summary>🕯️ Wisp</summary>
<img src="assets/wisp.webp"/>
</details>
<details>
<summary>🌾 Fen</summary>
<img src="assets/fen.webp"/>
</details>
<details>
<summary>🪦 Mire</summary>
<img src="assets/mire.webp"/>
</details>
<details>
<summary>🌑 Blackwater</summary>
<img src="assets/blackwater.webp"/>
</details>

## Usage

GIMP ignores the system GTK theme and uses its own, so the [GTK 3](../gtk) port doesn't
reach it. This one does.

1. Copy GIMP's `Default` theme folder (usually `/usr/share/gimp/3.0/themes/Default`) to `~/.config/GIMP/<version>/themes/Darkberry Mire/`. Copy its `System` folder to the same place too, because `Default`'s `common.css` imports `../System/gimp.css`. `<version>` is GIMP's own folder name (`3.0`, `3.2` and so on).
2. Copy a flavour from this folder into that new theme folder as `gimp-dark.css` (`gimp-light.css` for Wisp). It imports `common-dark.css` from beside it, which is why step 1 has to come first.
3. Pick it under Edit > Preferences > Interface > Theme.

One honest warning. A coloured frame around a photo changes how you judge the colours
inside it, which is why GIMP ships grey themes. Darkberry uses its least saturated colours
around the image, but for serious grading, switch back to a grey theme and come back to me
when you're done. The palette itself, for the colour picker, is the
[GIMP Palette](../gpl) port.

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
