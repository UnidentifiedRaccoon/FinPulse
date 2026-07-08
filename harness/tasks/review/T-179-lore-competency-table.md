# T-179 — Lore competency table

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-05
Branch/worktree: current workspace

## Goal

Prepare Gate 2 / Competency Table for the FinPulse production financial lore
pipeline and move the task to review. Human approval of Gate 2 remains outside
this task.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/adult_financial_competencies_2026.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `docs/methodology/production_model_financial_lore_pipeline.md`
- `docs/methodology/lore_source_pack.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/domain-map.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`

## Intended write set

- `docs/methodology/lore_competency_table.md`
- `docs/methodology/README.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-179-lore-competency-table.md`, then
  `harness/tasks/review/T-179-lore-competency-table.md`

## Out-of-scope

- Generating 80 lessons.
- Creating Project Bible, Macro Arc, Section Grid, Emotional Model,
  Traceability Matrix, Lesson Cards, or Screen Scripts.
- Runtime JSON, schemas, frontend/backend code, API, persistence, or database
  content changes.
- Diagnostics, HR analytics, B2B dashboards, rewards, streaks, or new game
  mechanics.
- Hero, city, NPC, canonical emotion list, or object-level story design.
- Personal financial, investment, tax, or legal recommendations.

## Plan

1. Create the Gate 2 methodology document with normalization rules,
   competency table, coverage, risks, and human decisions before Gate 3.
2. Wire the new document into the methodology README.
3. Update project state and workboard coordination notes.
4. Run requested documentation checks and attempt `npm run verify`.
5. Record the result packet and move this task file to review.

## Checks

- [x] `git diff --check`
- [x] trailing-whitespace check for new Markdown files
- [x] `npm run verify` attempted; passed content validation, runtime import
  guard, typecheck, and lint, then stopped in backend tests because this shell
  has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or
  `DATABASE_URL`

## Result packet

- Files changed:
  - `docs/methodology/lore_competency_table.md`
  - `docs/methodology/README.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `harness/tasks/review/T-179-lore-competency-table.md`
- Checks run:
  - `git diff --check` passed
  - `rg -n "[ \t]+$" docs/methodology/lore_competency_table.md harness/tasks/review/T-179-lore-competency-table.md`
    found no trailing whitespace after task move
  - `npm run verify` passed content validation, runtime import guard,
    typecheck, and lint; Vitest then reported 12 test files passed and 2
    backend test files failed because backend test DB env vars are not set
- Open:
  - Human approval is still required for Gate 2 / Competency Table.
  - Human decisions before Gate 3 remain open: subset scope, ID scheme,
    mandatory levels 1-2 set, levels 4-5 deferrals, `proxy-check` policy,
    source-update protocol, high-risk topic inclusion, B2B/privacy status, and
    confirmation that the next artifact is Project Bible.
- Recommended next step:
  - After human approval Gate 2, proceed to Gate 3 / Project Bible.
  - Do not proceed directly to Macro Arc, Section Grid, Emotional Model,
    Traceability Matrix, Lesson Cards, Screen Scripts, or 80-lesson generation.
