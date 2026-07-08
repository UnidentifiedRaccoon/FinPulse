# T-178 — Lore source pack

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-05
Branch/worktree: current workspace

## Goal

Prepare Gate 1 / Source Pack for the FinPulse production financial lore
pipeline without generating lessons, macro arcs, section grids, emotional
models, competency tables, or runtime features.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/adult_financial_competencies_2026.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `/Users/elena/Downloads/production_model_financial_lore_pipeline.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`

## Intended write set

- `docs/methodology/production_model_financial_lore_pipeline.md`
- `docs/methodology/lore_source_pack.md`
- `docs/methodology/README.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-178-lore-source-pack.md`, then
  `harness/tasks/review/T-178-lore-source-pack.md`

## Out-of-scope

- Generating 80 lessons.
- Creating Macro Arc, Section Grid, Emotional Model, or Competency Table.
- Runtime JSON, schemas, frontend/backend code, or database changes.
- Diagnostics, HR analytics, B2B dashboards, game rewards, streaks, or new
  mechanics.

## Plan

1. Copy the provided pipeline file into `docs/methodology/`.
2. Create the Gate 1 / Source Pack with approved inputs, open questions,
   temporary hypotheses, generation risks, and human decisions before Gate 2.
3. Wire both methodology sources from the methodology README and board
   foundation.
4. Update project coordination docs.
5. Run documentation checks and attempt the baseline verify.

## Checks

- [x] `git diff --check`
- [x] trailing-whitespace check for new Markdown files
- [x] `npm run verify` attempted; passed content validation, runtime import
  guard, typecheck, and lint, then stopped in backend tests because this shell
  has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or
  `DATABASE_URL`

## Result packet

- Files changed:
  - `docs/methodology/production_model_financial_lore_pipeline.md`
  - `docs/methodology/lore_source_pack.md`
  - `docs/methodology/README.md`
  - `docs/methodology/finpulse_board_course_foundation.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `harness/tasks/review/T-178-lore-source-pack.md`
- Checks run:
  - copied `/Users/elena/Downloads/production_model_financial_lore_pipeline.md`
    to `docs/methodology/production_model_financial_lore_pipeline.md`; SHA-256
    matched (`82da235c75740de9b7f8e4dcb6c7b032b80e0f5436ea2b078a24ff84b871c857`)
  - `rg -n "[ \t]+$" docs/methodology/production_model_financial_lore_pipeline.md docs/methodology/lore_source_pack.md`
    found no trailing whitespace
  - `git diff --check` passed
  - `npm run verify` passed content validation, runtime import guard,
    typecheck, and lint, then failed in backend tests because no backend test
    DB URL env var is set
- Open:
  - Human approval is still needed for the Source Pack decisions before Gate 2.
  - Hero, city, new work, NPCs, list of 20 emotions, level objects, future-game
    screen map, and corporate/B2B status remain explicit open questions.
- Recommended next step:
  - After Source Pack approval, proceed to Gate 2 / Competency Table.
  - Do not proceed directly to story, Macro Arc, Section Grid, Emotional Model,
    80 lesson generation, or screen scripts.
