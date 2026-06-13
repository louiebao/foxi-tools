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
