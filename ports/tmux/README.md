<h3 align="center">
	<img src="../../assets/logos/darkberry.png" width="100" alt="Logo"/><br/>
	<img src="../../assets/misc/transparent.png" height="30" width="0px"/>
	Darkberry for <a href="https://github.com/tmux/tmux">tmux</a>
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

1. Copy a flavour from this folder to `~/.config/tmux/`.
2. Source it from `tmux.conf`:

   ```
   source-file ~/.config/tmux/darkberry-mire.conf
   ```

3. Reload with `tmux source-file ~/.config/tmux/tmux.conf`.

The file is the whole theme: a two-segment status line (session badge on the left, host and
clock on the right), the window list with the active window on the tab indicator, pane
borders, messages, copy-mode selection and search hits, the clock, pane numbers, popups and
menus. It needs tmux 3.2 or later; the popup and menu styles are 3.3 and 3.4 and are set
with `-q`, so an older tmux skips them. The colours are 24-bit, so tmux must see a truecolor
terminal (kitty, Ghostty and Konsole all are); if not, add
`set -as terminal-features ",xterm-256color:RGB"` to `tmux.conf`. The pane's own text and
background stay the terminal's, so use it with the kitty, Ghostty or Konsole port.

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
