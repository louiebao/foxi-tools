# Monthly scheduling

**Active mechanism: a local launchd job on the Mac.** The cloud routine was abandoned — its
egress proxy blocks `server.arcgisonline.com`, so imagery verification (the quality gate)
can't run there. Everything works locally, so the schedule moved to the Mac.

## Local launchd job (active)

- **Agent:** `com.foxi.rare-earth-monthly` — `~/Library/LaunchAgents/com.foxi.rare-earth-monthly.plist`
  (machine-specific, not tracked).
- **Runs:** `scripts/run-monthly.sh` (tracked, portable) monthly on the **6th at 08:23 local**.
  launchd runs a missed job on next wake, so a sleeping Mac still catches up.
- **What it does:** headless `claude --dangerously-skip-permissions -p "<routine-prompt>"` in
  the repo — follows `SKILL.md` autonomous mode, verifies with the local browser, opens a PR
  via `gh`.
- **Prerequisite:** `gh auth login` (one-time). The runner FATALs early if gh isn't
  authenticated, rather than half-running.
- **Log:** `~/Library/Logs/rare-earth-monthly.log`.

Operate it:
```bash
launchctl list | grep foxi                                   # is it registered?
launchctl kickstart -k gui/$(id -u)/com.foxi.rare-earth-monthly   # run now (validation)
launchctl unload ~/Library/LaunchAgents/com.foxi.rare-earth-monthly.plist  # disable
tail -f ~/Library/Logs/rare-earth-monthly.log                # watch a run
```

## Cloud routine (disabled, kept for reference)

`trig_019xx3oRopcE7u22nVC1V1Zg` on claude.ai — set `enabled: false`. To revive it you'd need
the cloud egress to allow `server.arcgisonline.com`. `verify.html` is library-free now, so
that single host is all it would need.

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
