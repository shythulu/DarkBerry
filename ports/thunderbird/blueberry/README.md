<h3 align="center">
	<img src="../../../assets/logos/blueberry-logo.svg" width="100" alt="Logo"/><br/>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
	Blueberry for <a href="https://www.thunderbird.net/">Thunderbird</a>
	<img src="../../../assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/shythulu/DarkBerry/stargazers"><img src="https://img.shields.io/github/stars/shythulu/DarkBerry?colorA=1d273e&colorB=be4c8d&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/issues"><img src="https://img.shields.io/github/issues/shythulu/DarkBerry?colorA=1d273e&colorB=e8c98a&style=for-the-badge"></a>
	<a href="https://github.com/shythulu/DarkBerry/contributors"><img src="https://img.shields.io/github/contributors/shythulu/DarkBerry?colorA=1d273e&colorB=a3daa3&style=for-the-badge"></a>
</p>

<p align="center">
	<a href="../"><img src="https://img.shields.io/badge/Darkberry-fd7ca5?style=for-the-badge" alt="Darkberry"/></a>
	<a href="../lingonberry/"><img src="https://img.shields.io/badge/Lingonberry-f06a6a?style=for-the-badge" alt="Lingonberry"/></a>
	<a href="../cloudberry/"><img src="https://img.shields.io/badge/Cloudberry-f7ab84?style=for-the-badge" alt="Cloudberry"/></a>
	<a href="../crowberry/"><img src="https://img.shields.io/badge/Crowberry-ddb0ec?style=for-the-badge" alt="Crowberry"/></a>
	<img src="https://img.shields.io/badge/Blueberry-8fb0f2?style=for-the-badge" alt="Blueberry"/>
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

Not on a theme store yet. The files are in [ports/thunderbird/blueberry](https://github.com/shythulu/DarkBerry/tree/main/ports/thunderbird/blueberry); install them by hand:

1. Download a flavour's `.xpi` from a [release](https://github.com/shythulu/DarkBerry/releases)
   (`darkberry-thunderbird-mire-<version>.xpi` and so on), or zip the two files in one of this
   folder's flavour folders (`manifest.json` and `theme.css`) into a file of your own.
2. In Thunderbird, open Tools > Add-ons and Themes, choose Install Add-on From File from the
   gear menu, and pick the file.
3. Enable the flavour under Themes.

Thunderbird does not require add-ons to be signed, so the unsigned file installs and stays
installed. To try a flavour without packaging it, open Tools > Developer Tools > Debug
Add-ons > Load Temporary Add-on and pick its `manifest.json`; it lasts until Thunderbird
restarts.

Checked on Thunderbird 157. A theme experiment carries the theme into the folder pane, the
message list and cards, the Spaces toolbar, the address book and the calendar.

Three things keep their own colours:

- The message body. It is web content, so it shows the sender's colours.
- The Settings tab. Thunderbird applies no theme there.
- Calendar events and categories. Each calendar's colour is set in its Properties, and each
  category's under Settings > Calendar > Categories.

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
	<a href="https://github.com/shythulu/DarkBerry/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=e0e7f6&colorA=1d273e&colorB=be4c8d"/></a>
</p>
