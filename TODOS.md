# TODOS

## periodic-table: Accessibility pass
**What:** Add screen reader support to theme buttons (`aria-pressed`), element cells
(`aria-label="Hydrogen, atomic number 1"`), and the detail panel (`aria-live="polite"`).

**Why:** The tool targets anyone on the internet. Without it, theme toggles are
unlabeled buttons and the grid is an undifferentiated set of divs for screen readers.

**Context:** Skipped from v1 scope. Do this 1–2 hour pass after layout is stable.
Surfaced by `/plan-eng-review` (2026-06-13).

**Depends on:** T1–T5 complete (periodic-table v1 shipped).

---

## periodic-table: V2 themes (rare, ancient, toxic, semiconductor)
**What:** Write element membership + facts for 4 reserved v2 themes. Add each as a
button. Architecture is already wired — adding a theme = one new key in ELEMENTS data
+ one entry in THEMES array + one `<button>`.

**Why:** "Don't breathe this" (toxic) and "Modern Electronics" (semiconductor) are
strong lenses. Each adds discovery value at near-zero implementation cost.

**Context:** Theme keys reserved in v1 design doc but no data written. Do this after
v1 ships and you've validated the overall experience. Surfaced by `/plan-eng-review` (2026-06-13).

**Depends on:** periodic-table v1 shipped and stable.

---

## sql-quine: v2 quine builder
**What:** Let the user assemble the REPLACE layers piece by piece. The tool shows the quine "snap" into self-replication the moment the final layer is complete.

**Why:** Once v1 teaches the mechanism (animation), v2 lets the user build one themselves. That transition from comprehension to construction is where the tool becomes memorable rather than just informative.

**Context:** Scoped out of v1 because users need to understand the concept before they can enjoy building one — v1 teaches it, v2 builds on that. Approach C from the original design doc (`/office-hours` 2026-06-29). Architecture from v1 (sql.js already loaded, REPLACE chain structure already displayed) is the right starting point. Surfaced by `/plan-eng-review` (2026-06-30).

**Depends on:** sql-quine v1 shipped and validated.

---

## golden-ratio: perspective correction (Approach B)
**What:** Hand-rolled 4-point homography (~20 lines, no OpenCV — too heavy for this repo's
zero-install ethos) to de-skew angled facade photos before measuring, plus multiple
measurement presets (full facade, window bands, door-to-height) selectable up front.

**Why:** Outside-voice review during /plan-eng-review flagged perspective/keystone distortion
from ground-level phone photography as the biggest actual source of measurement error —
bigger than the gaming problem v1's honesty mechanism (lock-on-release + attempt log)
targets. A genuinely golden facade shot at a typical phone angle can measure far from 1.618
purely from distortion, and vice versa. v1 ships with only a UI hint ("shoot straight-on")
as a stopgap.

**Context:** Approach B from the original design doc (`/office-hours` 2026-07-07). Reuses
Approach A's canvas/upload/attempt-log foundation entirely, adds a math module. Do this after
v1 ships and you've confirmed the perspective-error problem is actually hitting real users
(not just a theoretical concern) — the hint may turn out to be sufficient in practice.
Surfaced by `/plan-eng-review` (2026-07-08).

**Depends on:** golden-ratio v1 shipped and validated.

---

## golden-ratio: keyboard-accessible measurement
**What:** An alternative input method (e.g. numeric width/height fields, or arrow-key
nudging of a focused rectangle) for placing the measurement rectangle without pointer/touch
drag.

**Why:** The canvas drag-to-measure interaction is inherently pointer/touch-based and is
documented in the design doc as not keyboard-operable in v1 — a real, known accessibility
gap rather than a silently ignored one. Upload Photo, example links, and Measure Again are
keyboard-focusable in v1; the core measurement action itself is not.

**Context:** Surfaced by `/plan-design-review` (2026-07-08) during the Responsive &
Accessibility pass. Do this once v1 ships and the core interaction is validated — the right
input pattern (numeric fields vs. keyboard-nudge) may become clearer after seeing how the
drag UX actually feels in practice.

**Depends on:** golden-ratio v1 shipped and validated.

---

## golden-ratio: desktop side-by-side layout enhancement
**What:** At wide viewports (900px+), move the RESULT and ATTEMPTS panels from stacked
(below the canvas) to a side-by-side layout next to the canvas.

**Why:** v1 ships mobile-first, single-column at every viewport width — the correct default
given the tool's "point your phone at a building" pitch. A wider desktop layout is a pure
progressive enhancement, not a requirement; desktop users just see more whitespace in v1.

**Context:** Surfaced by `/plan-design-review` (2026-07-08). Low priority — do this only if
the tool sees enough desktop usage to justify it. Reuses the same RESULT/ATTEMPTS panel
components from v1, just repositioned above the breakpoint.

**Depends on:** golden-ratio v1 shipped and validated.

---

## golden-ratio: live viewfinder mode (Approach C)
**What:** `getUserMedia` camera mode alongside upload — tap 4 points on a live/paused camera
frame, ratio appears instantly while framing the shot, instead of uploading a file after the
fact.

**Why:** Flagged by the independent second-opinion subagent during /office-hours as the
coolest version of this tool not yet considered — the "whoa" moment happens while framing the
shot on the street, not after digging through a camera roll. Most novel differentiator vs.
every existing golden-ratio overlay tool (all of which are upload-based).

**Context:** Approach C from the original design doc (`/office-hours` 2026-07-07). Deferred
because it cuts directly against the explicit "keep it small, architecture only, done well"
v1 decision — biggest build, most platform risk (cross-browser/mobile camera API quirks,
HTTPS required when hosted). Same measurement UX as Approach A once a frame is captured.
Surfaced by `/plan-eng-review` (2026-07-08).

**Depends on:** golden-ratio v1 shipped and validated.

---

## rare-earth: sat-thumbnail hover previews
**What:** Show a small pre-baked satellite-crop thumbnail image in the hover tooltip
alongside the text blurb, instead of text-only.

**Why:** Flagged by the independent second-opinion subagent during `/office-hours` as the
coolest version of this tool not yet considered — turns rare-earth from "index of links"
into "browsable curiosity cabinet." Hovering would preview the actual weirdness (Richat
Structure's bullseye, Nazca lines) before clicking through to Google Earth — the highest
"whoa" factor of any considered enhancement for this tool.

**Context:** Approach C from the original design doc (`/office-hours` 2026-07-10). Deferred
because ~20 satellite thumbnail images raise licensing/attribution questions and would be
the first tool in this repo needing a companion asset folder instead of a single `.html`
file — a bigger structural change than v1's scope. Surfaced by `/plan-eng-review`
(2026-07-11).

**Depends on:** rare-earth v1 shipped and stable.

---

## rare-earth: Google Maps fallback link
**What:** Add a secondary `?q={lat},{lon}` Google Maps link alongside the primary Google
Earth 3D link on each dot.

**Why:** Mitigates the risk (flagged by the outside voice during `/plan-eng-review`) that a
Google Earth link verified working on desktop/mobile at authoring time could still fail for
some real visitor's specific device/browser combination — the design doc itself
acknowledges broken Earth links "fail silently."

**Context:** v1 ships a single Google Earth link per dot — manual desktop+mobile
verification of every link before shipping (Next Steps #3) is the v1 mitigation. Deferred
adding a second link because it doubles the interactive surface per dot on a design system
that discourages extra chrome, for a risk that hasn't been proven real in practice yet.
Surfaced by `/plan-eng-review` (2026-07-11).

**Depends on:** rare-earth v1 shipped; revisit only if broken/unreliable Earth links turn
out to be a real problem for actual visitors.
