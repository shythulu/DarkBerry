<h3 align="center">
	<img src="../../../assets/logos/cloudberry-logo.svg" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Cloudberry for <a href="https://www.gtk.org">GTK</a>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=3b2316&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=3b2316&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=3b2316&colorB=a3daa3&style=for-the-badge"></a>
</p>

<p align="center">
	<a href="../"><img src="https://img.shields.io/badge/Darkberry-fd7ca5?style=for-the-badge" alt="Darkberry"/></a>
	<a href="../lingonberry/"><img src="https://img.shields.io/badge/Lingonberry-f06a6a?style=for-the-badge" alt="Lingonberry"/></a>
	<img src="https://img.shields.io/badge/Cloudberry-f7ab84?style=for-the-badge" alt="Cloudberry"/>
	<a href="../crowberry/"><img src="https://img.shields.io/badge/Crowberry-ddb0ec?style=for-the-badge" alt="Crowberry"/></a>
	<a href="../blueberry/"><img src="https://img.shields.io/badge/Blueberry-8fb0f2?style=for-the-badge" alt="Blueberry"/></a>
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

Not on a theme store yet. The files are in [ports/gtk/cloudberry](https://github.com/shythulu/DarkBerry/tree/main/ports/gtk/cloudberry); install them by hand:

1. Copy a flavour folder from this folder into `~/.themes/` (or `~/.local/share/themes/`).
2. Select it as your GTK theme: `gsettings set org.gnome.desktop.interface gtk-theme "Darkberry Mire"`, or your desktop's appearance settings.
3. For Flatpak apps, let them read the folder: `flatpak override --user --filesystem=~/.themes`.

Needs GTK 3.24 for `gtk-3.0`; `gtk-4.0` is checked on GTK 4.24.

The theme reaches Inkscape and any other GTK 3 or GTK 4 app that follows the system theme.
Each flavour is GTK's own Adwaita stylesheet compiled with Darkberry's colours, the way
Catppuccin's GTK port compiled Colloid with its own, so every widget takes the palette.
Apps built on libadwaita (most of GNOME's own) ignore the GTK theme and are not reached.
GIMP and darktable use their own themes; see the [GIMP](../gimp) and
[darktable](../darktable) ports.

## Created by

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
