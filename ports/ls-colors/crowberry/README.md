<h3 align="center">
	<img src="../../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Crowberry for <a href="https://www.gnu.org/software/coreutils/manual/html_node/dircolors-invocation.html">LS_COLORS</a>
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

1. Copy a flavour from this folder to `~/.config/darkberry/`.
2. Source it in your shell rc:

   ```sh
   . ~/.config/darkberry/darkberry-mire.sh
   ```

It exports `LS_COLORS`, which lsd, GNU `ls`, eza, fd, dust, delta and zsh's completion menu
all read, so the one file themes every listing on the machine. Directories take the accent;
source, configuration, prose, media and archives each take a hue; build leavings and backups
sit under the reading colour. Executables stay green and symlinks stay cool, because those
two meanings are older than any theme.

BSD `ls`, which is what macOS ships without coreutils, reads `LSCOLORS` instead, a different
format limited to the eight ANSI colours, which cannot carry these. Use lsd or GNU `ls` there.

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
