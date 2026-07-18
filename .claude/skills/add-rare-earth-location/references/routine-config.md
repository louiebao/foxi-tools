# Monthly routine — config (ready to create)

The `RemoteTrigger create` body below is validated and ready. It failed only on a missing
GitHub connection (HTTP 401: "Connect your GitHub account before saving a routine that uses
a GitHub repository").

## Prerequisite (one-time, user action)

Connect your GitHub account to claude.ai Code / install the Claude GitHub App on the repo:
https://claude.ai/code/onboarding?magic=github-app-setup

Once connected, re-run the create (via `/schedule` or `RemoteTrigger action:create`) with the
body below — it will succeed unchanged.

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
