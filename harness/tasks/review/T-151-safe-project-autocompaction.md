# T-151 — Safe project autocompaction

Status: review

## Goal

Compact project memory files so future agents can load the current state without
re-reading a duplicated task log.

## Intended write set

- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/review/T-151-safe-project-autocompaction.md`

## Safety boundaries

- No app code changes.
- No runtime JSON/content changes.
- No schema, validator, API, deploy, or methodology contract changes.
- Preserve detailed history in existing `harness/tasks/review/T-*.md` files.

## Changes

- Replaced `harness/PROJECT_STATE.md` with a compact current-state snapshot:
  active stack, locked assumptions, runtime content, architecture, verification
  caveats, canonical docs, and open questions.
- Replaced `harness/WORKBOARD.md` with a lightweight coordination board:
  current autocompaction task, recent review snapshot, done seed tasks, and board
  hygiene rules.
- Removed duplicated per-task prose from the two summary files while leaving the
  detailed task archive untouched.

## Verification

- `git diff --check` passed.
- `rg -n "[[:blank:]]+$" ...` found no trailing whitespace in touched Markdown
  files.
- Manual Markdown sanity read passed for `harness/PROJECT_STATE.md`,
  `harness/WORKBOARD.md`, and this task file.
