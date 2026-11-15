# Reviewing a port: the panel

The review is done by a panel of independent sub-agents, not by you. You built the port
with the contributor, so you share their blind spots. Reviewers who have not seen the
conversation, each looking for one kind of problem, catch what a single pass misses. Your
job is to gather the evidence, brief them, check what they report, and take the agreed
list to the contributor.

The order matters. Measurements come first and are run once, by you, so the panel spends
its time judging rather than re-measuring. Then the panel runs in parallel. Then you
verify and merge.

```
1. evidence bundle (you, scripts)  ->  2. panel x3 (parallel)  ->  3. verify + merge (you)  ->  4. contributor
```

## 1. Build the evidence bundle

Make a folder for this review in the review folder beside the repository
(STYLE_GUIDE *Verification* names it; that path is from another machine, so if it does
not exist here, use `../DarkBerry-review/` beside the repo and say so). Call it
`review-<port>-<yyyy-mm-dd>/`. Never inside the repository: `docs/` is generated.

You are the only one who runs `node build.mjs` without `--check`, because the full build
rewrites `ports/`, `docs/` and `assets/`. It takes no `--help`: any unknown argument
still runs a full build. Its arguments are `--check`, `--no-tints` and a palette path.

Put these in the bundle, each as a file the panel can read:

| File | How | Why the panel needs it |
|---|---|---|
| `build.txt` | `node build.mjs`, then `node build.mjs --check <variant>` for each `src/variants/*.json` | Errors and warnings; whether `docs/CHECKS.md` is current |
| `stale.txt` | After the full build, `git status --short ports/<key>/` (every tint subfolder included); without git, `grep` one changed key across `ports/<key>/*/` | A generated file the build changed was stale when committed; `release.yml` fails on it, and a tint folder the build skipped still carries the old mapping |
| `diff.txt` | `git diff main --stat`, then the full diff of any file outside the port's own set (template, override, usage file, registry entry, its `mustBe()` lines, `ports/<key>/`) | A change to `src/roles.json`, `lib/`, `route()` or a shared assertion touches every port |
| `pixel-<flavour>.txt` | `node scripts/pixel-audit.mjs <frames>/<flavour>.png` per frame; `--tint <id>` for tint frames; `--ignore x0,y0-x1,y1` for image content the theme does not paint (a picture, a video) | Panes, accent and fill shares; which flat regions are theme colours, blends, or not the theme; a WARNING when a frame is not the flavour or tint it is named for |
| `cvd-<flavour>.txt` | `node scripts/cvd.mjs --roles <flavour>` | Hue-only pairs under colour-vision deficiency simulation |
| `pairs.txt` | `node scripts/contrast.mjs '<fg>' '<bg>' ...` (quote the `#`) for every host-owned pairing in the template header, every key that puts text on a fill, and any text-on-fill you can see in the frames | The pairings the build cannot check |
| `applied.txt` | Load the generated file in the real app and read back what it applied (STYLE_GUIDE *Verification* step 3 lists the commands per app); where the app cannot report it, say so | A misspelt key or a format the app rejects silently falls back to the app's default |
| `gallery-<flavour>.png` | `node scripts/gallery.mjs gallery.html --standalone`, then a headless browser at `gallery.html#<flavour>` (or `#<tint>-<flavour>`); the command is in the script's header. Without a browser, hand the reviewer the HTML file | The gold standard: every common UI pattern drawn from the roles the table assigns, so a port's tab strip or menu is compared with the same pattern drawn right |
| `inputs.md` | Paths: template, override file, usage file, registry entry, the `mustBe()` lines (`grep -n 'mustBe("<port>"' build.mjs`), frames, state frames, reference frames; plus anything unrelated that failed (a missing `sassc`), so no reviewer reports it as a port defect | So every reviewer starts from the same files |

**State frames.** The four README frames cannot show hover, pressed, disabled, an inactive
window, an unfocused split, menus, dialogs, tooltips or a find bar. Where the app has
them, capture one extra Mire and one Wisp frame per group into the bundle (never into
`assets/`), under the same consent rules as step 7. Without them, the review says which
states went unseen.

**Reference frames** for the look-and-feel reviewer: an editor compares with
`ports/vscode/assets/`, a terminal with `ports/kitty/assets/`, a toolkit or desktop app
with `ports/gtk/assets/`, a TUI with `ports/btop/assets/`. The Firefox frames show the
Darkberry site as page content, so they are a poor accent reference.

## 2. Run the panel

Spawn the three reviewers in one message so they run in parallel. Each gets the path to
the bundle, the port key, its brief below, and the finding format. None gets this
conversation or the other reviewers' output, because independence is the point.

Every reviewer is read-only. It may run the scripts and `node build.mjs --check`, nothing
else that writes. It returns its findings as its final message, and you save each one as
`findings-<reviewer>.md` in the bundle. Sub-agents often cannot write outside their
working folder, so do not ask them to.

Give the look-and-feel reviewer the most capable model and effort available: it is the
judgement the scripts cannot back up. The frames reviewer can run at lower effort.

### Reviewer A: template and accessibility

Brief: check that the port says every shared meaning through a role and that everything
a reader sees passes WCAG. Read STYLE_GUIDE.md (*Porting an application* steps 3 to 11,
the meaning → role table, *Light flavour rules*) and `references/wcag.md`.

- Read the template key by key. A palette name (`surface2`, `jam`, `berry`, `frost`,
  `cranberry`) on a key that carries a meaning in the table is a finding: selection,
  current line, focus, cursor, search, status, diff, tabs, links, borders.
- `docs/CHECKS.md` proves the role floors, but only for keys that use the checked role.
  Measure the rest from `pairs.txt` or with `scripts/contrast.mjs`: host-owned pairings,
  text on fills, accent or status colours used as text, anything on `ui.pane.tertiary`.
- WCAG 1.4.1 use of colour, 1.4.11 for controls and state indicators, focus visibility,
  and the CVD results, as `references/wcag.md` describes.
- Every shared-meaning key has a `mustBe()` line in `build.mjs`. List the missing ones.
  One regex that matches one of sixteen lines pins one, not sixteen.
- The template header's claims match the values below them. A comment that says
  "selection is ui.selection" over a line that says `{surface2}` is a finding.
- Every override has a `why`.
- Explain every `near` and `off` cluster in `pixel-*.txt`: which key paints it, or that
  the app hardcodes it (then the header must say so).

### Reviewer B: look and feel

Brief: judge the frames against `docs/DESIGN_LANGUAGE.md`, its reviewer checklist item
by item, with the reference frames and `gallery-<flavour>.png` beside them. For every
pattern the app shows (tabs, a list selection, a menu, a scrollbar, an input), find the
same pattern in the gallery and say where the frame departs from it. View every frame and state frame
(convert webp with `magick in.webp out.png` if your image reader needs PNG). The
measurable items come from `pixel-*.txt`: the "all pixels" line gives the panes, fill
family and accent shares, the per-accent list lets you compare Mire with Blackwater, and
the cluster table is the off-palette test. Judge the rest by eye and say what you saw and
where (frame, box). Four frames must read as one design in four flavours; Wisp gets its
own pass. Say which checklist items the frames could not answer.

### Reviewer C: frames

Brief: decide whether the frames are fit to be the record of this port. Look at every
frame yourself; the scripts catch a wrong flavour, not a painted-over region.

- The flavours the registry entry ships, all the same size, the same content and scroll
  position, the app's window only.
- No `WARNING` in any `pixel-*.txt`. A frame that is another flavour or tint means the
  window did not repaint, and the set is retaken.
- Nothing that looks edited: a region of one flat colour with no icons or text where the
  app draws some, a box that is in one frame and not the others, a frame identical to the
  committed one (`compare -metric AE`) when the contributor says it is new.
- The frames show what step 7 asks for: selected text, the current line, a search hit,
  a focused field, tabs and a status area, where the app has them.
- Nothing private: notifications, other windows, real names, e-mail addresses, tokens,
  personal paths or hostnames, branch names that say more than intended. A frame with
  any of these is retaken, never cropped or blurred.

### The finding format

Every reviewer returns findings in this shape, worst first, and nothing else:

```
### <id>: <one-line claim>
- Severity: blocker | major | minor | note
- Inherited: yes | no   (yes when STYLE_GUIDE or the roles prescribe the failing choice)
- Rule: <WCAG SC, STYLE_GUIDE section, or DESIGN_LANGUAGE checklist item>
- Where: <flavour(s)>, <surface or frame box x0,y0-x1,y1>, <file:line if a template key>
- Evidence: <the measurement, the quoted line, or what was seen>
- Fix: <the change> (layer: palette | role | template | override | capture)
```

| Severity | Means |
|---|---|
| blocker | A floor the build enforces elsewhere is broken here; the theme is not on a major surface; a frame is invalid or leaks something private; selection, cursor, focus, search or status says its meaning with the wrong role |
| major | An `off` cluster or untinted grey over 1% of a frame that nobody explains; the accent budget broken; a shared-meaning key with no `mustBe()`; a header claim that is false |
| minor | An unexplained `near` or `off` cluster between 0.2% and 1%; a small inconsistency with the reference port |
| note | A known exception STYLE_GUIDE already records, or an observation with no user-visible effect |

Severity is about what the user sees, not whose fault it is. A text pair under 4.5:1 is
a blocker whether the template chose it or the meaning → role table told the template
to. When the guide prescribes it, mark it `Inherited: yes`: the contributor cannot fix
it alone, but the verdict still has to show it.

A finding without evidence is not a finding. Tell the reviewers that, so they leave out
impressions they cannot point at.

## 3. Verify and merge

You own the final list, so check it before anyone acts on it.

1. **Re-measure every blocker and major.** Run the contrast, the pixel audit or the grep
   yourself. A finding whose number does not reproduce is dropped, and you say why. A
   look-and-feel blocker with no number gets one more pair of eyes: a fresh sub-agent with
   the frame and the claim, asked to give the box or say it cannot see it.
2. **Merge duplicates.** Two reviewers often find one cause from two sides (A sees
   `{jam}` on the footer key, B sees an accent-filled bar). Keep one finding, cite both
   pieces of evidence, take the higher severity.
3. **Fill the coverage grid.** One row per DESIGN_LANGUAGE checklist item, per WCAG
   criterion in `references/wcag.md`, and per brief bullet for A and C: who answered it
   and the result. A blank row is a gap: answer it yourself or re-run that reviewer on it.
   This is what catches the finding nobody raised.
4. **Split the list.** Port findings go to the contributor. Inherited findings go to both
   the contributor's list (marked inherited) and a "for the maintainer" list. Palette
   facts with no on-screen failure in this port go to the maintainer only.
5. **Score each flavour** on the STYLE_GUIDE *Verification* step 4 scale (applied 0 to 1,
   coverage 0 to 2, consistency 0 to 2, readability 0 to 2), with the merged findings as
   the reasons.
6. **Verdict**, one of:
   - **Ready**: no blocker, every flavour 5 or more.
   - **Ready once the maintainer decides**: the only blockers are inherited.
   - **Fix first**: any port blocker, or a flavour under 5.

Write `review.md` in the bundle folder: the verdict line, the score table, the merged
findings worst first, the coverage grid, the states that went unseen, the maintainer
list, and the findings you dropped with the reason.

## 4. Take it to the contributor

Show the verdict and the score table, then the findings worst first. Agree on each. A
finding the contributor disputes goes to a prototyping session (SKILL.md *Prototyping
variations*), not an argument. After fixes, re-run only what the fix touches: the build
and reviewer A for a template change; all of section 1 and reviewers B and C for a new
set of frames.
