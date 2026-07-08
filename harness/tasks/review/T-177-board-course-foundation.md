# T-177 — Board course foundation

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-05
Branch/worktree: current workspace

## Goal

Add a durable project documentation file for the FinPulse "Доска" game frame
and connect it to the adult financial competencies source and the lore
production pipeline.

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
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/domain-map.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `docs/methodology/adult_financial_competencies_2026.md`
- `/Users/elena/Downloads/finpulse_board_course_foundation.md`
- `/Users/elena/Downloads/production_model_financial_lore_pipeline.md`

## Intended write set

- `docs/methodology/finpulse_board_course_foundation.md`
- `docs/methodology/README.md`
- `docs/methodology/METHODOLOGY.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-177-board-course-foundation.md`

## Out-of-scope

- Runtime JSON content.
- New frontend/backend gameplay mechanics.
- Diagnostics, rewards, streaks, HR analytics, or B2B dashboards in the current MVP.
- Committing the full lore production pipeline unless separately requested.

## Plan

1. Adapt the provided board foundation into a project methodology document with explicit MVP boundaries.
2. Link the board frame to the adult competencies catalog and the lore production pipeline contract.
3. Update methodology index/state docs.
4. Run lightweight documentation checks.

## Checks

- [x] `git diff --check`
- [x] trailing-whitespace check for new Markdown files
- [x] `npm run verify` attempted; passed content validation, runtime import guard, typecheck, and lint, then failed in tests because backend test DB env is missing and one full-suite admin preview test did not leave the loading skeleton
- [x] `npm run test:admin -- apps/admin/src/components/admin/ContentEditor.test.tsx`

## Result packet

- Files changed:
  - `docs/methodology/finpulse_board_course_foundation.md`
  - `docs/methodology/README.md`
  - `docs/methodology/METHODOLOGY.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `harness/tasks/review/T-177-board-course-foundation.md`
- Checks run:
  - `git diff --check` passed
  - `rg -n "[ \\t]+$" docs/methodology/finpulse_board_course_foundation.md harness/tasks/review/T-177-board-course-foundation.md` found no trailing whitespace after moving the task file to review
  - `npm run verify` passed content validation, runtime import guard, typecheck, and lint, then failed in the test stage on the known missing backend DB env requirement plus one admin route-preview full-suite failure
  - `npm run test:admin -- apps/admin/src/components/admin/ContentEditor.test.tsx -t "resets only the current learner preview screen"` passed
  - `npm run test:admin -- apps/admin/src/components/admin/ContentEditor.test.tsx` passed
- Risks:
  - The full `production_model_financial_lore_pipeline.md` source-pack file was referenced but not committed in this task.
  - The board frame is target methodology only; runtime adoption still needs a separate product/content-model decision.
- Follow-up:
  - If the team wants the full lore pipeline in-repo, add `production_model_financial_lore_pipeline.md` under `docs/methodology/` and update the board file link from source-pack reference to a relative Markdown link.
