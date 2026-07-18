# Monthly routine — config

Status: **created** (id `trig_019xx3oRopcE7u22nVC1V1Zg`), first run 2026-08-06 08:23 Melbourne.

## Prerequisites

1. **GitHub connected** — done (was HTTP 401 until the account was linked to claude.ai Code).
2. **Egress allowlist** — the cloud environment's proxy must allow **`server.arcgisonline.com`**
   (the satellite tiles). The first manual run failed here: the proxy 403'd both the tiles and
   `unpkg.com`. `verify.html` was since rewritten library-free, so `unpkg.com` is no longer
   needed — `server.arcgisonline.com` is the only host to allow. Without it, the routine's
   self-check will (correctly) file an "environment gap" issue and add nothing.

Re-run to validate after allowlisting: `RemoteTrigger action:run` on the id above.

## Config

- **name:** rare-earth monthly place finder
- **schedule:** `23 22 5 * *` UTC = **08:23 on the 6th of each month, Australia/Melbourne**
  (AEST/UTC+10; shifts to 09:23 during AEDT summer — immaterial for a monthly job)
- **repo:** https://github.com/louiebao/foxi-tools
- **model:** claude-sonnet-5
- **environment_id:** env_015XQBqjn8R8WpBiJHppVRAw (Default)
- **allowed_tools:** Bash, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch
- **output:** PR-gated (never pushes to main); first-run capability self-check files an issue
  and stops if the cloud env can't browse/verify/push.
- **prompt:** `routine-prompt.md` — now reference-based: it points the cloud agent at the
  committed `SKILL.md` (single source of truth) and restates the guardrails inline. The skill
  is tracked in git, so the cloud agent's checkout has it.

Generate a fresh UUID for `events[].data.uuid` on each create attempt.
