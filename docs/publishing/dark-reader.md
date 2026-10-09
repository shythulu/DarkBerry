# Publishing the Dark Reader port

`ports/dark-reader/Darkberry <Flavour>.txt` is three plain-text files, one per dark flavour
(Fen, Mire, Blackwater), each holding the three values a user types into Dark Reader's Colors
panel: Background, Text and Selection. The same three files sit under each tint's folder. Dark
Reader takes colours as settings, not as a file, so there is nothing to install or upload: the
one place to be listed is Dark Reader's own built-in Color Scheme list.

## Venues

### Dark Reader's Color Scheme list (`src/config/color-schemes.drconf` in darkreader/darkreader)

- **URL**: https://github.com/darkreader/darkreader/blob/main/src/config/color-schemes.drconf
- **Kind**: official. The list ships inside the extension and appears in every install's
  Colors panel under Color Scheme, the list the port's usage FAQ already points to.
- **Accepts**: one block per scheme: a name line, a `DARK` section with `background:` and
  `text:`, an optional `LIGHT` section with the same two keys, and a `================================`
  separator. A dark-only block is accepted: `Matte Black` has no `LIGHT` section (added in
  PR #14604, merged 2025-09-05). Blocks after `Default` are in alphabetical order. The list
  carries Background and Text only; Selection stays a manual step (see the usage FAQ).
- **Fields**: Name (the block's name line: `Darkberry Fen`, `Darkberry Mire`, `Darkberry
  Blackwater`); Licence (no field: the repository is MIT, so the entry is contributed under
  MIT).
- **Add-ons**: the `DARK` values, `ui.background` and `ui.text` from the flavour's file; no
  `LIGHT` section, for the reason the template header gives (Dark Reader's light mode recolours
  pages toward the text colour, which does not look like Wisp).
- **Requirements**: a GitHub account to open a pull request. No fee, signing or account beyond
  that.
- **Steps**:
  1. Fork darkreader/darkreader.
  2. Add one block per dark flavour to `src/config/color-schemes.drconf`, in alphabetical
     position, values copied from `ports/dark-reader/Darkberry <Flavour>.txt`.
  3. Open a pull request.
- **Updates**: a follow-up pull request editing the same blocks; the change reaches users with
  the next Dark Reader release.
- **Contacts**: https://github.com/darkreader/darkreader/issues.
- **Sources**: `src/config/color-schemes.drconf`, `CONTRIBUTING.md` and the commit history of
  the scheme file, read via `gh api repos/darkreader/darkreader/...` (2026-10-09); PRs #14604
  and #15305 (2026-10-09).
- **Confidence**: partly verified. The file format, the dark-only precedent, the ordering and
  the licence are read from the live repository. `CONTRIBUTING.md` covers site fixes only and
  says nothing about new schemes, so whether maintainers take three entries from one theme is
  unverified.

## Not applicable

- **Browser extension stores** (Chrome Web Store, addons.mozilla.org, Edge Add-ons): they list
  Dark Reader itself, not colour settings for it.
- **Settings-file sharing**: Dark Reader's Import Settings replaces every setting the file
  names, so a shared settings file would reset a user's other options (the usage FAQ says the
  same). No gallery of such files was looked for.

## Open questions

- Three entries (`Darkberry Fen`, `Darkberry Mire`, `Darkberry Blackwater`) or one
  (`Darkberry`, Mire only)? Every existing entry is one name per theme family; Catppuccin has a
  single `Catppuccin` block. Three gives users the flavour choice; one matches the precedent.
- The tints (twelve more dark blocks) are left out: they would crowd a list of about twenty
  entries. The usage FAQ already says tints are copied by hand.
- Whose GitHub account opens the pull request.
