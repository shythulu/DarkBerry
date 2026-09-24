Install from [addons.mozilla.org](https://addons.mozilla.org/firefox/search/?q=darkberry).
Each flavour is its own listing there, and updates arrive on their own.

The `.xpi` files attached to each [release](https://github.com/shythulu/DarkBerry/releases)
are the unsigned build output, kept for the record. Firefox Release and Beta refuse
unsigned add-ons, themes included, so an `.xpi` from here installs in only two ways. For a
look, load it as a temporary add-on from `about:debugging` > This Firefox. It lasts until
Firefox closes. To keep it, use Developer Edition, Nightly or an unbranded build with
`xpinstall.signatures.required` set to `false`. [docs/AMO.md](../../docs/AMO.md) covers
how the listing is maintained.
