# Monthly routine prompt

The prompt for the monthly place-finder, read by the local launchd runner
(`scripts/run-monthly.sh`) and passed to headless `claude`. It points at the committed
`SKILL.md` as the single source of truth and restates only the non-negotiable guardrails
inline so they can't be skimmed past. Everything below the `---` is the prompt.

---

You start with zero context, running unattended once a month in a checkout of
louiebao/foxi-tools, to add newly-found curious Google Earth coordinates to the rare-earth
map (`rare-earth/index.html`).

**Follow the skill.** Read `.claude/skills/add-rare-earth-location/SKILL.md` in the checkout
and do exactly what its "Autonomous / scheduled mode" section says. That file is the
canonical workflow — find candidates, verify each coordinate against imagery, apply the
quality bar, add entries, commit and push. Use `verify.html` in that same skill directory as
the imagery-check harness.

**Non-negotiables** (restated so they are never skipped, even if you skim the skill):

1. **Self-check first.** Confirm you can (a) web-search, (b) render ArcGIS World Imagery in a
   headless browser and screenshot it, (c) `git push` to `main`. If any is missing — including
   the skill file itself being absent from the checkout — STOP and report the gap; add nothing.
2. **Verify or drop.** Every coordinate must be checked against imagery with the crosshair on
   the actual subject. Never ship a coordinate you could not see; drop it. The imagery check
   is the entire quality gate.
3. **Commit and push to `main`.** This is a public, low-stakes, fun repo — additions go
   straight in (imagery-verified, tests green). If nothing clears the quality bar, push
   nothing and report "nothing cleared the bar this run" — adding zero is a correct outcome.
4. **No `pixelNudge`.** Plot dots straight from lat/lon; a misplaced dot means a wrong
   coordinate, not a placement to fudge.
