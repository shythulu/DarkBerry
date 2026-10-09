# Listing Darkberry on addons.mozilla.org

Firefox refuses unsigned add-ons on release and beta, and that applies to themes as much as
extensions — Mozilla's current guidance is explicit that "extensions and themes need to be
signed." Listing on AMO solves it properly: Mozilla signs each version, serves the download,
and pushes updates to everyone who installed it. Nothing has to be hosted here.

The `amo` job in `.github/workflows/release.yml` handles every version after the first. The
first submission of each flavour is a one-time job for a human, because it asks for
categories, preview images and licence agreement that CI has no business answering.

## Twenty add-ons, not one

Each flavour of each tint is a separate add-on with its own ID, because each carries its
own colours. The ID is `<tint>-<flavour>@<tint>-theme`:

| flavour | Darkberry | a tint, Cloudberry for example |
|---|---|---|
| Wisp | `darkberry-wisp@darkberry-theme` | `cloudberry-wisp@cloudberry-theme` |
| Fen | `darkberry-fen@darkberry-theme` | `cloudberry-fen@cloudberry-theme` |
| Mire | `darkberry-mire@darkberry-theme` | `cloudberry-mire@cloudberry-theme` |
| Blackwater | `darkberry-blackwater@darkberry-theme` | `cloudberry-blackwater@cloudberry-theme` |

Keep the IDs as they are. AMO ties a listing to its ID, so changing one orphans the listing
and every install that came from it.

## Listing convention

The manifest's `name` and `description` prefill AMO's name and summary, and the build writes
them in this shape (`LISTING` and `SUMMARY` in `build.mjs`, used by `src/ports/firefox.json`):

| field | Darkberry | a tint |
|---|---|---|
| Name | `Darkberry - Blackwater` | `Cloudberry - Blackwater (A Darkberry Tint)` |
| Summary | `Darkberry - Blackwater: Darkest. Deeper wine surfaces, same accents as Mire.` | `Cloudberry tint of Darkberry - Blackwater: dark, neutrals leaned toward cloudberry` |
| Support website | `https://darkberry.slacklab.ca/` | same |
| Licence | CC BY-NC-SA 4.0 | same |

The licence is set on AMO, not in the manifest. AMO lets a theme carry only a Creative
Commons licence, so the repository's MIT licence cannot be chosen there; the answers that
give CC BY-NC-SA 4.0 are: others may share it with credit, may not use it commercially, and
may make derivatives if they share alike.

## One-time setup

**1. Build the files to upload.**

```sh
./package.sh
ls ports/firefox/dist/*.xpi
```

**2. Create an account** at [addons.mozilla.org](https://addons.mozilla.org/) and go to the
[developer hub](https://addons.mozilla.org/developers/).

**3. Submit each `.xpi` file**, once each, via *Submit a New Add-on*:

- Choose **"On this site"** — that's the listed channel. The other option is
  self-distribution, which is what we deliberately moved away from.
- Category: **Appearance** (themes are categorised separately from extensions).
- Licence: **Creative Commons BY-NC-SA 4.0** (see *Listing convention* above; AMO offers themes
  only the CC licences).
- Homepage: `https://darkberry.slacklab.ca/` — already in each manifest as
  `homepage_url`, so the field should prefill.
- Summary: prefilled from the manifest `description`, which the build already writes in the
  listing shape above. Support website: `https://darkberry.slacklab.ca/`.
- Preview image: AMO generates one from the theme's colours, but an actual screenshot of a
  browser wearing the flavour reads far better in search results. `docs/specimen.html` has
  browser mockups you can capture.

Themes go through automated review and usually appear within minutes.

**4. Create API credentials** at
[addons.mozilla.org/developers/addon/api/key/](https://addons.mozilla.org/en-US/developers/addon/api/key/).
You get a JWT issuer and a JWT secret. The secret is shown once.

**5. Add them as repository secrets:**

```sh
gh secret set AMO_JWT_ISSUER
gh secret set AMO_JWT_SECRET
```

That's it. The `amo` job stops skipping itself the moment those exist.

## What happens on every release after that

Pushing a version tag runs the `package` job, which publishes the GitHub Release, and then
the `amo` job, which submits all four flavours as a new version with
`web-ext sign --channel listed`.

The two jobs are deliberately separate. AMO being slow, down, or unhappy with a submission
should not stop the VS Code, kitty, Ghostty, Obsidian, KDE and Konsole artifacts from
shipping. If the `amo` job fails, the release is already published and you can re-run just
that job once the problem is fixed.

## Things that will trip you up

**A version number can only be submitted once.** AMO rejects a re-upload of a version it has
already seen, even if the file differs. This is why the workflow checks the tag against
`src/palette.json` before building — a botched release means bumping the version, not
retrying the tag.

**The `.xpi` files on the GitHub Release are unsigned.** They are build output kept for
archival and reproducibility. Anyone who wants a working install should go to AMO. The
release notes say so.

**Signing is a Firefox concern only.** The `.vsix` installs unsigned, and the kitty, Ghostty,
Obsidian, KDE and Konsole artifacts are plain configuration files with no signing concept.
If you want provenance across the whole release, that is checksums and a detached GPG
signature — a separate mechanism from AMO.
