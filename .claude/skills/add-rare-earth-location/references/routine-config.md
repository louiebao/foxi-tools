# Monthly scheduling (local)

The monthly place-finder runs on the Mac via a launchd job. Everything — research, imagery
verification (local browser), commit, push — happens locally.

## The job

- **Agent:** `com.foxi.rare-earth-monthly` — `~/Library/LaunchAgents/com.foxi.rare-earth-monthly.plist`
  (machine-specific, not tracked).
- **Runs:** `scripts/run-monthly.sh` (tracked, portable) on the **6th of each month at 08:23
  local**. launchd runs a missed job on next wake, so a sleeping Mac still catches up.
- **What it does:** headless `claude --dangerously-skip-permissions -p "<prompt>"` in the repo
  — follows `SKILL.md` autonomous mode, verifies with the local browser, commits, and pushes
  straight to `main`. The prompt is the text after the `---` in `routine-prompt.md`.
- **Delivery:** direct push to `main` over the existing passphraseless SSH key — **no gh, no
  new credentials** (owner's call: public, low-stakes, fun repo). The runner FATALs early if
  non-interactive SSH push is broken.
- **Log:** `~/Library/Logs/rare-earth-monthly.log`.

## Operate it

```bash
launchctl list | grep foxi                                        # is it registered?
launchctl kickstart -k gui/$(id -u)/com.foxi.rare-earth-monthly   # run now
launchctl unload ~/Library/LaunchAgents/com.foxi.rare-earth-monthly.plist  # turn off
tail -f ~/Library/Logs/rare-earth-monthly.log                     # watch a run
```

To change the schedule, edit `StartCalendarInterval` in the plist and reload
(`launchctl unload` then `launchctl load -w`).
