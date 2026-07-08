# T-181 — Lock lore level objects

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-07
Branch/worktree: main workspace

## Goal

Lock the Project Bible level-object list from the human-provided table and keep
the surrounding lore documentation consistent without advancing to Gate 4.

## Intended write set

- `docs/methodology/lore_project_bible.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-181-lock-lore-level-objects.md`
- `harness/tasks/review/T-181-lock-lore-level-objects.md`

## Out-of-scope

- Macro Arc.
- Section Grid.
- Emotional Model.
- Traceability Matrix.
- Lesson Cards or Screen Scripts.
- Runtime JSON, schemas, frontend/backend code, API, database, or persistence
  changes.
- Rewards, streaks, diagnostics, HR analytics, or personal financial
  recommendations.

## Checks

- [x] `git diff --check`
- [x] changed/new Markdown trailing-whitespace check
- [x] `npm run verify` (stopped in backend tests on known missing DB env after
      content validation, runtime import guard, typecheck, and lint passed)

## Result packet

- Files changed:
  - `docs/methodology/lore_project_bible.md`
  - `docs/methodology/finpulse_board_course_foundation.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `harness/tasks/review/T-181-lock-lore-level-objects.md`
- Locked object canon:
  - Level 1: `Комната` / `Личная мастерская`
  - Level 2: `Машина` / `Дом на колёсах`
  - Level 3: `Квартира` / `Студия-лофт`
  - Level 4: `Дом` / `Оранжерея`
  - Level 5: `Гостевой двор` / `Открытая мастерская`
- The Project Bible now treats these as final level objects while keeping NPCs,
  recurring props, lesson details, Macro Arc, Section Grid, Emotional Model,
  Traceability Matrix, Lesson Cards, and Screen Scripts outside this task.
- `npm run verify` passed content validation, runtime import guard, typecheck,
  and lint, then failed in backend tests because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
