#!/bin/bash
# Monthly rare-earth place-finder — invoked by the launchd agent
# com.foxi.rare-earth-monthly. Runs Claude Code headless to find, verify (local
# browser), and open a PR for new curious coordinates. Everything runs on this
# Mac, which is why it works where the cloud routine's egress proxy did not.
#
# The launchd plist (~/Library/LaunchAgents/com.foxi.rare-earth-monthly.plist) is
# machine-specific and not tracked; this script is portable (paths are derived).
set -u

# launchd hands us a minimal PATH; add the user + Homebrew bins we need
# (claude, git, node) without hardcoding a home directory. ~/.bun/bin is
# required: the browse binary cold-starts its daemon by spawning `bun`, which
# lives there and is otherwise off-PATH — without it the imagery check (the
# quality gate) fails on a fresh run. Verified by cold-start reproduction.
export PATH="$HOME/.local/bin:$HOME/.bun/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"          # .../add-rare-earth-location
REPO="$(cd "$SKILL_DIR" && git rev-parse --show-toplevel)"
LOG="$HOME/Library/Logs/rare-earth-monthly.log"
exec >>"$LOG" 2>&1

echo "===== $(date '+%Y-%m-%d %H:%M:%S') run start ====="

command -v claude >/dev/null || { echo "FATAL: claude CLI not on PATH"; exit 1; }

cd "$REPO" || { echo "FATAL: repo not found at $REPO"; exit 1; }
# Delivery is a direct push to main over the existing (passphraseless) SSH key —
# no gh, no new credentials. Bail early if non-interactive push auth is broken,
# since there'd be no terminal to enter a passphrase.
GIT_SSH_COMMAND='ssh -o BatchMode=yes' git ls-remote origin >/dev/null 2>&1 \
  || { echo "FATAL: non-interactive SSH to origin failed; cannot push"; exit 1; }
git checkout main >/dev/null 2>&1
git pull --ff-only origin main || echo "WARN: git pull failed; continuing on local main"

# The workflow prompt is the shared, version-controlled one (single source of
# truth): the text after the '---' in routine-prompt.md. It tells the agent to
# follow SKILL.md's autonomous mode and restates the non-negotiables.
PROMPT="$(sed -n '/^---$/,$p' "$SKILL_DIR/references/routine-prompt.md" | tail -n +2)"
[ -n "$PROMPT" ] || { echo "FATAL: empty prompt"; exit 1; }

# Headless, unattended: no human to approve tool calls, so permissions are
# bypassed for this fixed, version-controlled workflow only.
claude --dangerously-skip-permissions -p "$PROMPT"
rc=$?

echo "===== $(date '+%Y-%m-%d %H:%M:%S') run end (claude exit $rc) ====="
exit "$rc"
