# Listing Darkberry on addons.mozilla.org

Firefox refuses unsigned add-ons on release and beta, and that applies to themes as much as
extensions — Mozilla's current guidance is explicit that "extensions and themes need to be
signed." Listing on AMO solves it properly: Mozilla signs each version, serves the download,
and pushes updates to everyone who installed it. Nothing has to be hosted here.

The `amo` job in `.github/workflows/release.yml` handles every version after the first. The
first submission of each flavour is a one-time job for a human, because it asks for
categories, preview images and licence agreement that CI has no business answering.

## Four add-ons, not one

Each flavour is a separate add-on with its own ID, because each carries its own colours:

| flavour | add-on id |
|---|---|
| Wisp | `darkberry-wisp@darkberry-theme` |
| Fen | `darkberry-fen@darkberry-theme` |
| Mire | `darkberry-mire@darkberry-theme` |
| Blackwater | `darkberry-blackwater@darkberry-theme` |

Keep the IDs as they are. AMO ties a listing to its ID, so changing one orphans the listing
and every install that came from it.

## One-time setup

**1. Build the files to upload.**

```sh
./package.sh
ls dist/*.xpi
```

**2. Create an account** at [addons.mozilla.org](https://addons.mozilla.org/) and go to the
[developer hub](https://addons.mozilla.org/developers/).

**3. Submit each of the four `.xpi` files**, once each, via *Submit a New Add-on*:

- Choose **"On this site"** — that's the listed channel. The other option is
  self-distribution, which is what we deliberately moved away from.
- Category: **Appearance** (themes are categorised separately from extensions).
- Licence: **MIT**, matching `LICENSE`.
- Homepage: `https://shythulu.github.io/DarkBerry/` — already in each manifest as
  `homepage_url`, so the field should prefill.
- Summary: the manifest `description` is a reasonable starting point; AMO's limit is short,
  so trim rather than pad.
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
