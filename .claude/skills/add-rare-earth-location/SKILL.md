---
name: add-rare-earth-location
description: Find, verify, and add a new location to the rare-earth tool (rare-earth/index.html world map of curious Google Earth coordinates). Use when the user wants to add a place, fill an empty region, or asks "what's interesting in <region>". Codifies the coordinate-verification workflow so dots land ON their subject.
---

# Adding a location to rare-earth

`rare-earth/index.html` is a world map of curious Google Earth coordinates. Each dot links
to a Google Earth view of something strange seen from orbit. This skill is the process for
adding one **accurately** — the hard part is not finding places, it's getting the coordinate
to land on the actual subject.

## The one rule that matters

**Verify every coordinate against satellite imagery before shipping. The crosshair must sit
ON the subject, with the whole subject framed.** Published coordinates lie constantly — not
by being random, but by describing the general place instead of the specific thing. Real
misses caught this way:

- **Wikipedia's "Whampoa" coordinate** was the housing estate, not the concrete ship — and
  was *further* from the ship than the value already in the file.
- **Global Energy Monitor's Panda Solar Farm** coordinate is flagged "approximate"; it lands
  ~490m south, off the artwork entirely.
- **The common Uffington White Horse value (51.5732)** sits ~480m below the figure in open
  fields. The horse is at 51.5779.
- Two of the original eight dots (Homebush, Boat in the City) shipped pointing at the wrong
  building despite a comment claiming they'd been "verified in a real browser."

A wrong coordinate still resolves to a plausible-looking place, so "it opens somewhere in
Sydney" is not evidence. Only imagery is.

## Workflow

### 1. Find candidates

The map's themes: **natural wonders, man-made oddities, mysterious patterns.** The best
additions are legible from orbit and have a story. Categories already represented — aim to
complement, not duplicate:

- Word/shape buildings (Antibody spells ANTIBODY), solar-array art (Panda), tree art
  (Guitar Forest), geometric cities (Palmanova star fort)
- Mysterious/ancient patterns (Alien Face, Badlands Guardian, El Ojo, Uffington geoglyph)
- Dense human accumulation (Boneyard aircraft, Nouadhibou boats)

Use WebSearch. If filling an empty region, search "Google Earth curiosities <region>". Check
which continents/regions are thin — run the coverage check in step 6.

### 2. Get a starting coordinate

Prefer a Wikipedia article's `#coordinates` (fetch the page, read the coordinate element).
Gazetteers (GEM, latitude.to) are starting points only. **Treat every source as a hypothesis
to test in step 3, never as the answer.** A coordinate for the right *place* is often wrong
for the specific *subject*.

### 3. Verify against imagery (the core step)

Use the bundled `verify.html` (ESRI World Imagery + centered crosshair) via the `/browse`
skill. See `references/verify-imagery.md` for the exact commands. In short:

```
$B goto "file://<abs-path>/verify.html?lat=<LAT>&lon=<LON>&z=16&name=<NAME>"
# wait ~4s for tiles, then screenshot and Read it
```

- **Frame the WHOLE subject before judging.** Antibody was once "corrected" 110m south off a
  too-tight zoom that showed only the `BODY` letters; the original coordinate was already
  centred on the full word. Zoom out (lower `z`) until you can see where the subject ends,
  then confirm it sits under the crosshair.
- If the crosshair is off, read the offset from the image, adjust lat/lon, re-render. Repeat
  until it's centred on the subject.
- **ESRI ≠ Google Earth.** Some subjects (Alien Face, El Ojo, Uffington) are faint or absent
  in ESRI imagery but clear on Google Earth, which is what the dot links to. If ESRI is murky
  but the coordinate is confirmed by another means (the circular water ring at El Ojo, the
  cited source for Alien Face), that's acceptable — note it. Never invent a feature you can't
  see; confirm the location some other way instead.

### 4. Build the earthUrl

Format: `https://earth.google.com/web/@<LAT>,<LON>,<ALT>a,<DIST>d,35y,<HEADING>h,0t,0r`

- **ALT** = ground elevation in metres. Get it from a terrain lookup, don't guess:
  `curl -s "https://api.opentopodata.org/v1/aster30m?locations=<LAT>,<LON>"`
- **DIST** = camera distance; controls framing. Rough guide from what's shipped: ~500–800 for
  a <200m subject (El Ojo, Uffington), ~2000–2500 for a ~1km one (Panda, Guitar, Palmanova),
  ~3000 for a wide scene. Verify the frame if unsure.
- **HEADING** = usually `0` (north up). Set it only when the subject has an axis that reads
  wrong north-up: Antibody uses `90h` because the buildings spell the word along a
  south-to-north line, so north-up stands it on end. Don't normalise a deliberate heading.

### 5. Add the entry, plot straight from lat/lon

Append to the `LOCATIONS` array in `rare-earth/index.html`:

```js
{ name: '<Name>', lat: <LAT>, lon: <LON>, blurb: '<one or two sentences, factual with a touch of wonder>',
  earthUrl: 'https://earth.google.com/web/@...' },
```

- **NO `pixelNudge`.** The basemap is generated from Natural Earth with the *same* projection
  as `projectPoint`, so dots and coastlines align by construction. Dots plot straight from
  lat/lon. If a dot looks misplaced, the coordinate is wrong — fix the coordinate, never add
  a position fudge. (See memory `rare-earth-basemap-nudge` for the history.)
- Blurb voice: concise, factual, one vivid detail. Match the existing entries. No email, no
  attribution.

### 6. Verify in the tool

```
node rare-earth/math.test.js                      # must pass
grep -c "pixelNudge:" rare-earth/index.html        # must be 0
```

Then load `rare-earth/index.html` in `/browse` and check:
- dot count went up by the number you added
- the new dot's tooltip shows the right name + coordinate
- **the dot sits on land in the right country** (zoom the SVG viewBox to the region:
  `document.getElementById('map').setAttribute('viewBox','<x> <y> <w> <h>')`)
- `$B console --errors` is clean

### 7. Commit

Follow the repo's commit style (see `git log`). Direct to `main` is this repo's convention.
State what was added and — for any coordinate that differed from a published source — why, so
the correction is on record. End the message with the `Co-Authored-By` trailer.

## Autonomous / scheduled mode

When run unattended (a scheduled routine, no human to answer questions), the interactive
steps change:

- **No `AskUserQuestion`.** Never wait for a human. Decide with an explicit quality bar and
  proceed.
- **Quality bar — add a candidate only if ALL hold:** it's a genuine, notable curiosity (has
  a story / is famous enough to be documented); not already in `LOCATIONS` (dedupe by
  name AND by coordinate within ~2km); the imagery check in step 3 put the crosshair on the
  subject; and you can see the subject (or independently confirm it). If in doubt, drop it.
  **Adding nothing is a correct outcome** — the well of good curiosities is shallow and most
  runs should add 0–2, never a filler quota.
- **Output is a PR, never a direct push to `main`.** Branch, commit, push, open a PR with
  `gh`. Put the before/after context in the PR body: each place's name, coordinate, why it's
  interesting, and the imagery screenshot proving the crosshair is on the subject. A human
  merges. If zero survivors, open no PR; report "nothing cleared the bar this run."
- **First-run capability self-check (mandatory).** Before adding anything, confirm the
  environment can actually do the job: (a) web search works, (b) a headless browser can
  render `verify.html` / ESRI tiles and screenshot them, (c) `gh`/git can push a branch and
  open a PR. If any is missing, open a GitHub issue titled "rare-earth automation:
  environment gap" listing what's unavailable, then STOP — do **not** add unverified places.
  The imagery check is the whole quality gate; skipping it silently is the one unacceptable
  failure mode.

## Don't

- Don't trust a gazetteer over imagery.
- Don't add a `pixelNudge` to "fix" placement — that whole mechanism was removed.
- Don't invent a feature you can't actually see in imagery.
- Don't judge a coordinate from a zoom so tight you can't see the whole subject.
- Don't put the user's email or personal attribution anywhere (repo-wide rule).
