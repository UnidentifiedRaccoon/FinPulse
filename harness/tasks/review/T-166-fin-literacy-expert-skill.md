# T-166 — Fin literacy expert project skill

Status: review
Owner: Codex
Created: 2026-07-04

## Goal

Commit the provided `fin-literacy-expert` skill into the FinPulse repo and make
it usable by agent sessions as a project-owned Codex skill.

## Intended write set

- `skills/fin-literacy-expert/**`
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-166-fin-literacy-expert-skill.md`
- `harness/tasks/review/T-166-fin-literacy-expert-skill.md`
- local symlink outside git: `/Users/elena/.codex/skills/fin-literacy-expert`

## Notes

- Preserve the user-provided skill content unless a small metadata/integration
  fix is required.
- Keep the project copy as the source of truth so the skill is git-tracked.
- Use a symlink for local Codex discovery instead of duplicating the skill.

## Result

- Added `skills/fin-literacy-expert` with the provided `SKILL.md` and
  task-scoped `references/**`.
- Added `agents/openai.yaml` with implicit invocation enabled.
- Documented the skill in `AGENTS.md` and `harness/PROJECT_STATE.md`.
- Added local discovery symlink:
  `/Users/elena/.codex/skills/fin-literacy-expert` ->
  `/Users/elena/cursor/FinPulse/skills/fin-literacy-expert`.

## Checks

- `find skills/fin-literacy-expert -maxdepth 3 -type f -print`
- Node metadata/frontmatter smoke check
- `wc -l skills/fin-literacy-expert/SKILL.md skills/fin-literacy-expert/references/*.md skills/fin-literacy-expert/agents/openai.yaml`
- `git diff --check -- AGENTS.md harness/PROJECT_STATE.md harness/WORKBOARD.md harness/tasks/review/T-166-fin-literacy-expert-skill.md skills/fin-literacy-expert`

Attempted `python3 /Users/elena/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/fin-literacy-expert`; it could not run because this Python environment lacks `yaml`/PyYAML.
