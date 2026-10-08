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

Checked on Thunderbird 157. The theme reaches the folder pane, message list, cards,
Spaces toolbar and calendar through a theme experiment. The message itself is web content,
so its body keeps the sender's colours.
