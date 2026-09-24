# Publishing the JankyBorders port

The `borders` port lives in `ports/borders/`: one `darkberry-<flavour>.sh` bordersrc per flavour at the
top level (`wisp`, `fen`, `mire`, `blackwater`) plus a tint variant per flavour under
`ports/borders/<tint>/`. Each file is a plain shell script setting `active_color`/`inactive_color`
(and width/style/hidpi defaults) that a user copies over `~/.config/borders/bordersrc`.

## Venues

### JankyBorders repo itself (README / Wiki)

- **URL**: https://github.com/FelixKratz/JankyBorders
- **Kind**: docs listing (none exists)
- **Accepts**: nothing theme-related. The README documents install/config only; it has no examples
  or presets gallery, no "themes" or "community configs" section.
- **Requirements**: n/a
- **Steps**: n/a — there is no submission path.
- **Updates**: n/a
- **Contacts**: maintainer is FelixKratz (github.com/FelixKratz); repo has Issues enabled but
  Discussions is **disabled** (`has_discussions: false` via `gh api repos/FelixKratz/JankyBorders`).
  The Wiki is enabled but contains only two pages: `Home`/index and `Man-Page` (a rendered man page),
  confirmed via `gh api repos/FelixKratz/JankyBorders/contents/docs` and crawling
  `github.com/FelixKratz/JankyBorders/wiki`.
- **Sources**: https://github.com/FelixKratz/JankyBorders (README fetched via `gh api .../readme`,
  2026-09-24); https://github.com/FelixKratz/JankyBorders/wiki (2026-09-24)
- **Confidence**: verified — no venue exists here. This is a documented absence, not an oversight.

### yabai GitHub Discussions — "Show and tell"

- **URL**: https://github.com/koekeishiya/yabai/discussions/categories/show-and-tell
- **Kind**: community repo (informal show-and-tell, not a curated store)
- **Accepts**: screenshots/write-ups of a user's yabai setup, which commonly include border colours
  (JankyBorders is yabai's de facto companion). Not a package feed — nothing is "installed" from
  here, it is just visibility among yabai users.
- **Requirements**: a GitHub account; sign in to create a Discussion in that repo.
- **Steps**:
  1. Go to https://github.com/koekeishiya/yabai/discussions/categories/show-and-tell and click
     "New discussion".
  2. Pick category "Show and tell".
  3. Title it with the theme name (e.g. "Darkberry — a JankyBorders/yabai theme, 4 flavours + tints").
  4. Body: link the site (https://shythulu.github.io/DarkBerry/) and the port folder
     (`ports/borders/`), include a screenshot per flavour, and state the MIT licence.
  5. Post. No approval step — discussions are visible immediately; maintainers may pin notable ones.
- **Updates**: edit the same discussion post, or reply to it, when the port changes.
- **Contacts**: repo owner koekeishiya (github.com/koekeishiya); no email listed in the repo.
- **Sources**: https://github.com/koekeishiya/yabai (has_discussions: true, categories confirmed via
  GitHub GraphQL `discussionCategories` query, 2026-09-24)
- **Confidence**: verified that the category exists and is open; unverified whether maintainers
  apply any additional norms to theme posts specifically (none published).

### SketchyBar GitHub Discussions — "Show and tell"

- **URL**: https://github.com/FelixKratz/SketchyBar/discussions/categories/show-and-tell
- **Kind**: community repo (informal show-and-tell)
- **Accepts**: full desktop setup showcases; SketchyBar users frequently pair SketchyBar with
  JankyBorders and screenshot both together. Same caveat as yabai: visibility only, not a package
  feed.
- **Requirements**: GitHub account.
- **Steps**: same shape as yabai's — https://github.com/FelixKratz/SketchyBar/discussions, category
  "Show and tell", "New discussion", title + screenshots + links, post.
- **Updates**: edit/reply to the same discussion.
- **Contacts**: repo owner FelixKratz (also the JankyBorders author).
- **Sources**: https://github.com/FelixKratz/SketchyBar (has_discussions: true, has_wiki: false;
  categories confirmed via GraphQL, 2026-09-24)
- **Confidence**: verified the category exists; unverified moderation norms.

### AeroSpace GitHub Discussions — "General"

- **URL**: https://github.com/nikitabobko/AeroSpace/discussions/categories/general
- **Kind**: community repo (informal; no dedicated show-and-tell category)
- **Accepts**: per the AeroSpace README's "Community, discussions, issues" section, Discussions is
  where users "discuss bugs, propose new features, ask your questions, show off your setup, or just
  chat." There are 7 channels; the ones fetched are `announcements`, `announcements-releases`,
  `feature-ideas`, `general`, `potential-bugs`, `questions-and-answers` — no `show-and-tell` slug, so
  "General" is the fitting channel for a theme showcase.
- **Requirements**: GitHub account. Note AeroSpace explicitly does not accept Issues directly for
  feature requests — Discussions is the front door — but that process is for AeroSpace itself, not
  relevant to just showing a theme.
- **Steps**:
  1. https://github.com/nikitabobko/AeroSpace/discussions → "New discussion" → category "General".
  2. Title + screenshots + links (site, `ports/borders/`, licence), same as above.
  3. Post.
- **Updates**: edit/reply to the same discussion.
- **Contacts**: repo owner nikitabobko.
- **Sources**: https://github.com/nikitabobko/AeroSpace README (fetched via `gh api .../readme`,
  2026-09-24); category list via GraphQL (2026-09-24)
- **Confidence**: partly verified — category list confirmed live; whether "General" is actually
  where people post showcases (vs. some other channel) is inferred from the README wording, not from
  reading example posts.

### DarkBerry repo's own GitHub Topics

- **URL**: https://github.com/shythulu/DarkBerry (repo settings → Topics)
- **Kind**: docs listing (self-controlled discovery, not a third-party venue)
- **Accepts**: any topic tags; the repo currently has `theme`, `theme-ui`, `themes` only (checked via
  `gh api repos/shythulu/DarkBerry --jq .topics`, 2026-09-24). Adding `yabai`, `jankyborders`,
  `sketchybar`, `aerospace-wm`, `macos` would surface the repo under
  https://github.com/topics/jankyborders and similar topic pages, which is the closest thing to a
  "gallery" that exists for this app (that topic page currently lists only individual dotfiles repos,
  not a curated theme index).
- **Requirements**: push access to the DarkBerry repo (already held).
- **Steps**: repo Settings → add topics (or `gh repo edit shythulu/DarkBerry --add-topic jankyborders
  --add-topic yabai --add-topic sketchybar`). No review/approval.
- **Updates**: same command, any time.
- **Contacts**: n/a (self-service).
- **Sources**: `gh api repos/shythulu/DarkBerry`, https://github.com/topics/jankyborders (both
  2026-09-24)
- **Confidence**: verified this works and is free, but it is not really a "publishing venue" in the
  sense the other sections are — it just improves discoverability of the existing GitHub repo/site.

## Not applicable

- **JankyBorders Wiki "gallery"** — the Wiki has exactly two pages (index, Man-Page); there is no
  presets/themes page to add to.
- **JankyBorders Discussions** — disabled at the repo level (`has_discussions: false`); no forum to
  post to.
- **awesome-sketchybar** (github.com/nicolas-martin/awesome-sketchybar) — scope is plugins only
  (Cpu/Indicator/Media/Music/Yabai/etc. bar plugins), generated from a single 2021 SketchyBar
  discussion thread; no colour-theme category and no open submission process was found in its
  README.
- **"awesome-yabai" / "awesome-aerospace" curated lists** — searched GitHub repo search and web
  search; no such maintained list exists. `awesome.ecosyste.ms/projects?keyword=yabai` is a
  read-only aggregator scraped from other awesome-lists, not something you submit to directly, and
  no underlying awesome-list for yabai/borders themes was found to submit to.
- **Homebrew tap** (`FelixKratz/homebrew-formulae`) — distributes the `borders` binary itself, not
  configuration/themes; not a fit for a bordersrc theme.
- **Catppuccin's own JankyBorders integration** (e.g. `catppuccin/nix` issue #545 requesting a
  `jankyborders` module) — this is Catppuccin's own port infrastructure for Catppuccin's colours,
  not a general theme marketplace; not applicable to a non-Catppuccin theme like Darkberry.

## Open questions

- Whether to post to all three Discussions boards (yabai, SketchyBar, AeroSpace) or only the ones
  whose window manager a Darkberry user is actually likely to pair with borders on — a submitting
  agent (or shylo) should decide scope before posting three near-duplicate showcases.
- Whether adding GitHub Topics to the DarkBerry repo is wanted at all, since it's cosmetic and not
  something the user asked for.
- If JankyBorders ever enables Discussions or adds a themes page to its Wiki in the future, re-check
  before assuming this file is still accurate.
