<h3 align="center">
	<img src="../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../assets/misc/transparent.png" height="30" width="0px"/>
	Darkberry for <a href="https://github.com/lsd-rs/lsd">lsd</a>
	<img src="../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=32222c&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=32222c&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=32222c&colorB=a3daa3&style=for-the-badge"></a>
</p>

<p align="center">
	🫐 <img src="https://img.shields.io/badge/Darkberry-fd7ca5?style=for-the-badge" alt="Darkberry"/>
	<a href="lingonberry/">🍒 <img src="https://img.shields.io/badge/Lingonberry-f06a6a?style=for-the-badge" alt="Lingonberry"/></a>
	<a href="cloudberry/">🍊 <img src="https://img.shields.io/badge/Cloudberry-f7ab84?style=for-the-badge" alt="Cloudberry"/></a>
	<a href="crowberry/">🍇 <img src="https://img.shields.io/badge/Crowberry-ddb0ec?style=for-the-badge" alt="Crowberry"/></a>
	<a href="blueberry/">💙 <img src="https://img.shields.io/badge/Blueberry-8fb0f2?style=for-the-badge" alt="Blueberry"/></a>
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

1. Copy a flavour from this folder to `~/.config/lsd/colors.yaml`.
2. Set `color: {theme: custom}` in `~/.config/lsd/config.yaml`.

You need lsd 1.1 or newer. Older versions reject hex colours and drop the whole theme
without a word, so on lsd 1.0 (what Ubuntu 24.04 ships) use the `.256.yaml` file beside
each flavour. It's the same theme in xterm-256 indices.

lsd 1.2.0 rejects any key it doesn't know, and when it finds one it throws the whole file
away and falls back to its defaults, again without saying so. `file-type` is one of those
keys in 1.2.0, so it isn't in these files. Every key here is one that 1.2.0 accepts.

That missing key is also why the [LS_COLORS](../ls-colors) port exists, and why you want
both. `colors.yaml` only reaches the metadata columns. File and folder names, which are
most of what a listing shows, stay on lsd's stock blue and green until `LS_COLORS` is set.

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
