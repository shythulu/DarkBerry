Install from [addons.mozilla.org](https://addons.mozilla.org/firefox/search/?q=darkberry).
Each flavour is its own theme there, and updates arrive automatically.

The `.xpi` files attached to a [release](https://github.com/shythulu/DarkBerry/releases) are
the unsigned build output, kept for archival. Firefox refuses unsigned add-ons on release
and beta, themes included, so those install only through `about:debugging` > This Firefox >
Load Temporary Add-on, or permanently on Developer Edition, Nightly or an unbranded
Release/Beta build with `xpinstall.signatures.required` set to `false`. See
[docs/AMO.md](../../docs/AMO.md) for how the listing is maintained.
