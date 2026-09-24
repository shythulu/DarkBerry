<h3 align="center">
	<img src="../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../assets/misc/transparent.png" height="30" width="0px"/>
	Darkberry for <a href="https://www.gimp.org">GIMP</a>
	<img src="../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=32222c&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=32222c&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=32222c&colorB=a3daa3&style=for-the-badge"></a>
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

GIMP ignores the system GTK theme and uses its own, which is why this port exists beside
the [GTK 3](../gtk) one.

1. Copy GIMP's `Default` theme folder (usually `/usr/share/gimp/3.0/themes/Default`) to `~/.config/GIMP/<version>/themes/Darkberry Mire/`, and its `System` folder beside it: `Default`'s `common.css` imports `../System/gimp.css`. The version folder is GIMP's own (`3.0`, `3.2`, ...).
2. Copy a flavour from this folder into that theme folder as `gimp-dark.css` (`gimp-light.css` for Wisp), so its `@import` of `common-dark.css` resolves.
3. Pick it under Edit > Preferences > Interface > Theme.

For colour work, keep the image surround neutral. A saturated frame shifts how you judge
colour in the picture, which is why GIMP ships greys. Darkberry uses its least saturated
colours there, but a grey theme is still the right tool for grading. The palette itself, for
the colour picker, is the [GIMP Palette](../gpl) port.

## 💝 Thanks to

- [shythulu](https://github.com/shythulu)

&nbsp;

<p align="center">
	<img src="../../assets/footers/darkberry_on_line.png" />
</p>

<p align="center">
	Copyright &copy; 2026-present <a href="https://github.com/shythulu/DarkBerry" target="_blank">shythulu</a>
</p>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=efe3eb&colorA=32222c&colorB=be4c8d"/></a>
</p>
