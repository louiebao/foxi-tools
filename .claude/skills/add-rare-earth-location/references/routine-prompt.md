# Monthly routine prompt

The prompt for the scheduled cloud routine that adds places to rare-earth once a month. It
is stored in the routine's config on claude.ai. Now that the skill is committed to the repo,
the cloud agent's checkout contains it — so the prompt points at the skill as the single
source of truth instead of duplicating the workflow, and restates only the non-negotiable
guardrails inline so they can't be skimmed past. Kept here for versioning; after changing it,
update the routine via `/schedule` or `RemoteTrigger`.

---

You start with zero context, running unattended once a month in a checkout of
louiebao/foxi-tools, to add newly-found curious Google Earth coordinates to the rare-earth
map (`rare-earth/index.html`).

**Follow the skill.** Read `.claude/skills/add-rare-earth-location/SKILL.md` in the checkout
and do exactly what its "Autonomous / scheduled mode" section says. That file is the
canonical workflow — find candidates, verify each coordinate against imagery, apply the
quality bar, add entries, open a PR. Use `verify.html` in that same skill directory as the
imagery-check harness.

**Non-negotiables** (restated so they are never skipped, even if you skim the skill):

1. **Self-check first.** Confirm you can (a) web-search, (b) render ArcGIS World Imagery in a
   headless browser and screenshot it, (c) `gh`/git push a branch and open a PR. If any is
   missing — including the skill file itself being absent from the checkout — open a GitHub
   issue titled "rare-earth automation: environment gap" describing what's wrong, then STOP.
   Add nothing.
2. **Verify or drop.** Every coordinate must be checked against imagery with the crosshair on
   the actual subject. Never ship a coordinate you could not see; drop it. The imagery check
   is the entire quality gate.
3. **PR, never `main`.** Open a pull request for a human to merge. Never push to `main`. If
   nothing clears the quality bar, open no PR and report "nothing cleared the bar this run" —
   adding zero is a correct outcome.
4. **No `pixelNudge`.** Plot dots straight from lat/lon; a misplaced dot means a wrong
   coordinate, not a placement to fudge.
