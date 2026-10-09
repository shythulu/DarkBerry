# Describing Darkberry

One set of words for every place the theme is described: file headers, manifests, store
listings, collection PRs, release notes, the site. Each thing that can be described (the
project, each flavour, each tint) has a name, a line and a paragraph here, and the field
map at the end says which of those goes in which venue's form. The strings in the
**Canonical** sections are the ones the build ships: they live in `src/palette.json`,
`src/variants/*.json` and `src/tints.json`, and `%DESCRIPTION%`, `%AUTHOR%` and
`%PUBLISHER%` in a template resolve to them. Change the words there, not in `ports/`.

## Vocabulary

| Word | Means | Not |
|---|---|---|
| **Darkberry** | The project, and also its default tint. "Darkberry Mire" is the default tint's Mire; "Lingonberry Mire" is a tint's. When both senses are in play, say "the default tint". | "DarkBerry" (the GitHub repository's name only), "Dark Berry" |
| **flavour** | One of the four lightness levels: Wisp, Fen, Mire, Blackwater. Always the British spelling, as in `src/palette.json`. | variant, mode, scheme, theme |
| **tint** | One of the five background families: Darkberry, Lingonberry, Cloudberry, Crowberry, Blueberry. A tint changes the room, not the furniture: the neutrals shift, the fourteen accents stay. | variant (that is the file's name for it, `src/variants/`; the public word is tint), edition (the build's internal word), palette |
| **port** | The theme for one application. "The kitty port", "Darkberry for kitty". | plugin, extension, skin (use the app's word only where the app's own listing field asks for it) |
| **accents** / **the berries** | The fourteen named accent colours. "Berries" in prose, "accents" where the sentence is technical. | colours (too broad), highlights |
| **neutrals** | The twelve Catppuccin-named greys: text, subtext, overlay, surface, base, mantle, crust. | backgrounds (only three of them are) |
| **light / dark** | Wisp is light; Fen, Mire and Blackwater are dark. "Soft dark" is Fen's own label, "darkest" is Blackwater's. | "lighter" and "darker" as names |

Theme names are `<Tint> <Flavour>` with a space: `Darkberry Mire`, `Blueberry Wisp`. Slugs
are `<tint>-<flavour>`: `darkberry-mire`. The flavour never stands alone in a name a
stranger reads; "Mire" alone is fine inside a README that has already said Darkberry.

The flavour emoji are 🕯️ Wisp, 🌾 Fen, 🪦 Mire, 🌑 Blackwater. Tints have no emoji: a tint
is told apart by its badge colour and its logo. Every port and category has one
(`src/ports.json`, `src/categories.json`). Emoji go in READMEs, the site and release
notes, before the name, never instead of it. They stay out of manifests, store fields,
file names and any list that forbids them (awesome-neovim does).

## Three lengths, two registers

Every subject gets three strings, and they nest: the name is in the line, the line is
in the paragraph.

| Length | Fits | Rule |
|---|---|---|
| **Name** | Every name field | The name and nothing else. Never "Theme" in it (Obsidian rejects it); never a tagline. |
| **Line** | Every one-line field: a manifest `description`, kitty's `blurb`, a README list bullet, a release-note caption, Zen's 100-character box | Under 100 characters. Catalogue voice, then one image. |
| **Paragraph** | A README excerpt, a form's long description, a forum post's first paragraph | Three to six sentences. May open in the bog-witch voice, then say what the thing is. |

The two voices:

- **Catalogue**: what it is, in plain words. "Darkest. Deeper surfaces, the same berries as
  Mire." A reader skimming search results gets the facts.
- **Bog-witch**: the image. "Blood in bog water." One per line, at the end, after the
  facts. A paragraph may carry two or three. A name carries none.

A line about a flavour never names a background colour, because the tints repaint it: the
image sentence is Darkberry's own, and a tint swaps its own sentence in. So "Wine-dark, the
overnight dredges" belongs to Darkberry Mire; Lingonberry Mire gets "Backgrounds steeped in
raspberry red" in its place, and the catalogue half stays.

## Canonical strings

### The project

- **Name**: Darkberry
- **Line** (`description` in `src/palette.json`; the VS Code extension's description):
  Darkberry: a bog-witch berry theme in four flavours, one light and three dark. Wine-dark
  plum with berry accents.
- **One-liner** for lists and posts: A bog-witch berry theme in four flavours. Wine-dark
  plum, soft on the eyes, checked for contrast.
- **Site lede**: A bog-witch berry theme for editors, terminals and browsers.
- **Paragraph**:

  > Darkberry is a colour theme in four flavours, built around one dark purple
  > (`#4b3540`). The dark flavours sit in that colour; the light one keeps a cousin of it
  > for text. The accents are fourteen berries: blossom, petal, berry, plum, cranberry,
  > cherry, apricot, honey, gooseberry, juniper, frost, bilberry, blueberry and lavender.
  > Each keeps its job in every flavour, so a string is honey in Wisp and honey in
  > Blackwater. Text reaches 4.5:1 on every background, controls 3:1, and every pair of
  > syntax colours stays a measured distance apart; the build fails if any of that slips.
  > The palette follows Catppuccin's shape, so a Catppuccin port is a short walk from a
  > Darkberry one, and the same palette file generates every port here, so a terminal can
  > match its editor.

### The flavours

Each flavour's `description` is the catalogue sentence and its `tagline` the image, both in
`src/palette.json` (and copied into each variant file). `%DESCRIPTION%` joins them for the
default tint and joins the description to the tint's line for a tint.

| | Description (catalogue) | Tagline (Darkberry's image) |
|---|---|---|
| 🕯️ **Wisp** | Light. A pale page, the berries deepened to read on it. | The light theme that doesn't hurt. |
| 🌾 **Fen** | Soft dark. The gentlest dark flavour, a shade above Mire. | Rosy and dusky, for reading at night. |
| 🪦 **Mire** | Dark. The main flavour, berries at full strength. | Wine-dark, the overnight dredges. |
| 🌑 **Blackwater** | Darkest. Deeper surfaces, the same berries as Mire. | Blood in bog water. |

Paragraphs, for a listing that has one flavour per item (Firefox, Chrome, Obsidian):

- **Wisp.** The light flavour. The page is a pale pink-grey and the text a violet-leaning
  cousin of Darkberry's purple, so the theme is still Darkberry with the lights on. Every
  berry is deepened until it reads on white at 4.5:1, which is why Wisp's accents look
  inkier than the dark flavours'. For people who work in daylight and want the same colours
  their terminal has at night.
- **Fen.** The softest of the three dark flavours. Its background is within a shade of
  Darkberry's own purple, so nothing on screen is far from anything else: rosy, dusky, low
  contrast between surfaces but not between text and surface. The one to read in at night.
- **Mire.** The main dark flavour and the one the others are measured against. Deep wine
  surfaces, the fourteen berries at full strength, the panels a step darker than the page.
  If you install one flavour, install this one.
- **Blackwater.** The darkest flavour: Mire's accents on surfaces pushed further down, for
  OLED screens and dark rooms. Blood in bog water. Everything that is a tint of the
  background in Mire is a deeper tint of it here; nothing else moves.

### The tints

Each tint's line is its `note` in `src/tints.json`; it is also the sentence that replaces
a flavour's tagline in that tint. The tints ship together (the with-tints packages, the
`<tint>/` folders), so a line about a tint always says it is a tint of Darkberry: a tint
name alone tells a stranger nothing.

| | Line | Short (listing summary) |
|---|---|---|
| **Darkberry** | The default. Wine-dark plum. | Darkberry: a bog-witch berry theme in four flavours. Wine-dark plum with berry accents. The default tint. |
| **Lingonberry** | Backgrounds steeped in raspberry red. | Lingonberry is Darkberry with its backgrounds steeped in raspberry red. Same four flavours, same berry accents. |
| **Cloudberry** | Backgrounds warmed toward ripe peach. | Cloudberry is Darkberry with its backgrounds warmed toward ripe peach. Same four flavours, same berry accents. |
| **Crowberry** | Backgrounds cooled to inky violet. | Crowberry is Darkberry with its backgrounds cooled to inky violet. Same four flavours, same berry accents. |
| **Blueberry** | Backgrounds cooled to a dusty slate blue. | Blueberry is Darkberry with its backgrounds cooled to a dusty slate blue. Same four flavours, same berry accents. |

Paragraphs:

- **Darkberry.** Dark purple with the lights down. The dark flavours sit inside the one
  purple, Mire a little below it and Blackwater further down, and Wisp lifts it to a pale
  pink-grey with that purple kept for text. This is the default tint, the one the plain
  packages ship on their own, and the one the other four are measured against.
- **Lingonberry.** Darkberry's plum pushed toward red until the backgrounds read as dark
  raspberry. It is the smallest move from the original, about twenty degrees of hue, so it
  still feels like Darkberry, only warmer. Fen is the rosiest flavour in the set and
  Blackwater goes the colour of dried blood. The cool accents (juniper, frost, bilberry)
  stand up more against a red backdrop than they do on plum.
- **Cloudberry.** The furthest the tints go from purple. Backgrounds move to a brown-orange
  that reads like a lamp left on in the next room, and Wisp becomes a warm cream page.
  Apricot is the one accent nudged here, because it would otherwise vanish into the
  background. Pick this one if purple-tinted dark themes have never quite sat right.
- **Crowberry.** Darkberry's purple with the red taken out. The backgrounds move toward
  blue and come out indigo-violet rather than wine, and Wisp is a faint lavender page. It
  still reads as a purple theme, which Blueberry does not, so this is the one for people
  who liked Darkberry but wanted it cooler.
- **Blueberry.** Darkberry's berries on slate blue backgrounds, so they sit warm on top,
  and the plums and pinks read hotter than they do anywhere else in the set. Wisp becomes a
  blue-white page like good paper. Coming from a blue-grey theme (Nord, One Dark, Dark
  Modern) and want the berries without the purple: start here.

The with-tints packages get this line, which the build composes from `src/tints.json`:
*Darkberry's four flavours in five tints: Darkberry, Lingonberry, Cloudberry, Crowberry
and Blueberry. Twenty themes.* And this paragraph, for a listing:

> This is Darkberry with four more tints beside the plum original, twenty themes in all.
> Install it instead of the plain Darkberry package, not beside it, or the four Darkberry
> themes show up twice. A tint changes the room, not the furniture: the backgrounds,
> panels, greys and text shift toward another berry, and the fourteen accents stay exactly
> where they are, so a keyword is the same colour in every tint and switching tints never
> changes how your code reads. Every tint passes the same checks as the original, and the
> build refuses to ship one that fails.

### A port

A port's line is `<Name> for <App>. <flavour line>`, which is what the manifest templates
compose: "Darkberry for Firefox. Dark. The main flavour, berries at full strength. Wine-dark,
the overnight dredges." The app's name is spelt the way the app spells
it (`name` in `src/ports.json`: kitty, Ghostty, Notepad++, btop++). A port that serves
several apps names the family, not a brand that another store objects to: the Chrome
manifest says "for Chromium browsers", and the Chrome Web Store and Edge Add-ons forms add
their own brand.

A port's paragraph is the project paragraph with one sentence in front saying what the
port covers and what the app leaves to itself, taken from the template header's
*Deliberately left unset* line. No port paragraph restates the flavours; it links to them.

### Fixed phrases

Use these as they are, so every listing makes the same claim in the same words:

- Contrast: *text at 4.5:1 on every background, controls and focus rings at 3:1, every
  pair of syntax colours a measured distance apart; the build fails if any of that slips.*
- Lineage: *The palette follows Catppuccin's shape: twelve neutrals with Catppuccin's names
  and jobs, the same palette file format, the same terminal colour rules.* Never "based on
  Catppuccin" or "a Catppuccin fork": the colours are Darkberry's own.
- Tints: *A tint changes the room, not the furniture.*
- Matching: *The same palette file generates every port, so your terminal can match your
  editor.* Name three or four ports after it, the ones the reader of that listing is likely
  to have.
- Licence: *MIT.* Where a venue relicenses (nppThemes to GPLv3, Zen to CC BY-NC-SA, bundling
  into Konsole or darktable), that is a decision recorded in `publishing/<port>.md`, not a
  change to this word.
- Lightness: *one light and three dark* for the flavours, never "light and dark modes".

## Identity

| Field | Value | Where it comes from |
|---|---|---|
| Author | `shythulu` (the GitHub account; lowercase where it is a handle, Shythulu at the start of a sentence) | `author` in `src/palette.json`, `%AUTHOR%` |
| Publisher | `Slacklab` | `PUBLISHER` in `build.mjs`; the Visual Studio Marketplace and Open VSX account |
| Publisher site | https://www.slacklab.ca | `PUBLISHER_URL` in `build.mjs`, `%PUBLISHER_URL%`; wherever a field links the author or publisher (Obsidian's `authorUrl`) |
| Homepage | https://darkberry.slacklab.ca | `homepage`, `%HOMEPAGE%`; wherever a field links the theme (`homepage_url`, `homepage`) |
| Repository | https://github.com/shythulu/DarkBerry | `repository`, `%REPOSITORY%` |
| Licence | MIT | `LICENSE` |
| Support | the repository's issues | |

The author is a person, the publisher an account, and "Darkberry" is neither: an `author`
field never says Darkberry. **Created by** in a README lists maintainers (`src/ports.json`),
which is a different list.

## Pictures

- **Logo**: `assets/logos/<tint>-logo.svg`, and the PNG beside it where a venue wants a
  raster (the VS Code icon is this PNG at 256 px). The `-words` variants carry the name
  under the mark, for a banner. Icons a store scales (AMO 32 and 64, Chrome 128, Edge 300)
  are exports of the same SVG, square, on the tint's `base` colour, never transparent.
- **Screenshots**: one per flavour, `ports/<port>/assets/<flavour>.webp`, and
  `preview.webp` with the four layered. The review rules in the port skill apply: same
  window, same content, same scroll position, only the palette changing. A store that
  fixes a size gets a crop of the same frame, not a new capture:

  | Venue | Size |
  |---|---|
  | addons.mozilla.org | 1280×800, or 1.6:1 |
  | Chrome Web Store | 1280×800 or 640×400, plus a 440×280 small tile |
  | Edge Add-ons | 640×480 or 1280×800, up to 6 |
  | Obsidian directory | 512×288 |
  | Zen theme store | 600×400 PNG |
  | kitty-themes, Gogh, iTerm2-Color-Schemes | generated by their tools; none from here |

  The frame shows the theme working: a secondary pane, a selection, a current line, body
  and muted text, syntax with strings, comments and numbers. A main preview shows Mire;
  a per-flavour image shows its own flavour.
- **Badges**: the three shields in every README (stars, issues, contributors) and the tint
  bar, colours from the palette, as `template/README.md` has them. No others.

## Field map

What a submitter types, and which canonical string it is. The field names are the common fields in
`publishing/README.md`; a venue's section there lists only its labels, limits and add-ons. Venues that take only a file and
a PR (the schemes repos, iTerm2-Color-Schemes, Gogh, btop's folder, KSyntaxHighlighting)
want the PR body: the port's line, the four screenshots, a link to the README. Limits and
exact field names are in `publishing/<port>.md`; this table says what goes in them.

| Field kind | String | Examples |
|---|---|---|
| Name | Name | AMO name, Chrome and Edge name (from the manifest), Obsidian name (no "Theme", fixed forever), kitty `## name`, Konsole `Description=`, KDE `Name=`, Base24 `name` |
| Summary | Line, composed as `<Name> for <App>. <flavour line>` where the field is per port and per flavour; the tint's short where it is per tint | AMO summary, Edge short description, kitty `## blurb`, Base24 and Tinted8 `description`, Nimbalyst `description`, eza-themes and awesome-* bullets, Starship's 1–2 sentences, Zen's 100 characters, release-note captions |
| Description | Paragraph (port paragraph, then the flavour or tint paragraph the item is about) | AMO full description, Chrome detailed description, Edge description (250–10,000 characters), Obsidian README excerpt, Marketplace and Open VSX README, KDE Store and gnome-look description, forum posts |
| Keywords | `theme, dark, light, berry, plum, wine`, plus the app's own word for a theme where its store filters on one (`colorscheme`, `color scheme`) | VS Code `keywords`, micro `Tags`, Lospec tags, KDE Store tags |
| Category | The venue's own vocabulary; themes go under Appearance / Themes / the colour-scheme category | AMO Appearance, VS Code Themes, KDE Store 112/462/472, gnome-look 135/268 |
| Author | Identity table | Obsidian, bat, Base24, Tinted8, Nimbalyst, Notepad++, kitty `## author`, Gogh and iTerm2 YAML `author` |
| Publisher | Identity table | VS Code `publisher`, Open VSX namespace |
| Title | The venue's form if it has one (`theme: Darkberry Mire` for Gogh, ``Add `shythulu/DarkBerry` `` for awesome-neovim, `Add Darkberry to the collection.` for dexpota), otherwise `Add Darkberry (<n> flavours)` | |
| Forum post title | `Darkberry: a berry theme for <App> in four flavours`, or the venue's pattern (`<Name>: a new theme for GIMP 3`) | pixls.us, GIMP Chat, Notepad++ community, Discussions |
| Organism name | Where the venue wants a creature, not a brand (delta): `bogberry`, and say in the comment line that it is Darkberry | delta `themes.gitconfig` |

Venues with rules this file does not override, because they are the venue's:
awesome-neovim's capitalisation and no-emoji rule; Starship's and btop's AI-disclosure
lines; Alacritty's refusal of author-submitted PRs; Edge's objection to the word Chrome.
They are in `publishing/<port>.md`, and a submission reads that file after this one.

## Adding a subject

A new tint needs a line (its `note` in `src/tints.json`), a short and a paragraph here. A
new flavour needs a `description` and a `tagline` in `src/palette.json`, copied into every
variant, and a paragraph here. A new port needs nothing here: its line and paragraph
compose from the rules above, and its venue limits go in `publishing/<port>.md`.
