# Verifying a coordinate against imagery

The exact `/browse` commands for step 3 of the skill. `verify.html` (in the skill root)
renders ESRI World Imagery centred on a lat/lon with a red crosshair.

## Setup

Resolve the browse binary once (from the /browse skill's own setup):

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
# verify.html lives next to the skill:
V="$HOME/.claude/projects/.../add-rare-earth-location/verify.html"   # or the repo copy:
V="$(git rev-parse --show-toplevel)/.claude/skills/add-rare-earth-location/verify.html"
```

`file://` access in browse is scoped to the cwd / TMPDIR. Easiest path: copy `verify.html`
into your scratchpad dir and load it from there, passing the candidate coordinate as query
params.

## Render + read

```bash
$B viewport 900x700
$B goto "file://$V?lat=45.9054&lon=13.3099&z=15&name=Palmanova"
sleep 4                                  # let ESRI tiles load
$B screenshot --viewport /tmp/check.png
# then Read /tmp/check.png and judge whether the crosshair is on the subject
```

Zoom guide (`z`): 14 ≈ 7 km across, 15 ≈ 3.5 km, 16 ≈ 1.8 km, 17 ≈ 900 m, 18 ≈ 450 m.
Start wide enough to see the whole subject, then tighten to place the crosshair precisely.

## Adjusting

If the crosshair is off, estimate the offset in metres from the image and shift lat/lon:

- 1° latitude ≈ 111,320 m (north +, south −)
- 1° longitude ≈ 111,320 × cos(latitude) m (east +, west −)

Re-render until centred. This is how Uffington was moved from the published 51.5732 (open
fields, ~480m low) to 51.5779 (on the horse).

## Terrain elevation (for earthUrl ALT)

```bash
curl -s "https://api.opentopodata.org/v1/aster30m?locations=45.9054,13.3099"
# -> results[0].elevation, in metres
```

## Checking the dot in the finished tool

After adding the entry, zoom the live SVG to the region to confirm the dot is on land:

```bash
$B goto "file://$(git rev-parse --show-toplevel)/rare-earth/index.html"
$B js "document.getElementById('map').setAttribute('viewBox','470 90 100 70'); \
       document.querySelectorAll('.dot-visible').forEach(d=>d.setAttribute('r','0.7'))"
$B screenshot --viewport /tmp/region.png
```

viewBox is `<x> <y> <width> <height>` in the map's 1000×506.2 space. To find a region's box,
project its corners with `x=(lon+180)/360*1000`, `y=(90-lat)/180*506.2`.

## Overlay sanity check (only if the basemap itself is ever suspect)

If you ever doubt the basemap rather than a single dot, overlay the outline path on a true
plate-carrée reference at the same viewBox with `preserveAspectRatio="none"`. Because the
basemap shares `projectPoint`'s projection, they must coincide; a mismatch means the path
was regenerated wrong. This is how the original westward basemap error was diagnosed. Not
needed for normal location adds.
