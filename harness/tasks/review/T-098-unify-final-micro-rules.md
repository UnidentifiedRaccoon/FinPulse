# T-098 — Unify final micro-rule options

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: existing workspace

## Goal

Align the final screen pattern in the current Unit 2 lessons with Unit 1: screen 6 offers two ready micro-rule options plus `Свой вариант`, instead of requiring only a freeform template.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`

## Intended write set

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `docs/modules/t1-start/unit_02_planning_management/lesson_01_why-emergency-fund.md`
- `docs/modules/t1-start/unit_02_planning_management/lesson_02_reserve-amount.md`
- `harness/tasks/active/T-098-unify-final-micro-rules.md`
- `harness/tasks/review/T-098-unify-final-micro-rules.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Renderer/schema changes
- Backend/API/database/auth/progress changes
- Reworking Unit 1 lessons
- Changing objective practice screens

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`

## Result packet

Files changed:

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `docs/modules/t1-start/unit_02_planning_management/lesson_01_why-emergency-fund.md`
- `docs/modules/t1-start/unit_02_planning_management/lesson_02_reserve-amount.md`
- `harness/tasks/review/T-098-unify-final-micro-rules.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

Checks run:

- `npm run check:content`
- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`

Risks:

- Existing saved answers for the two Unit 2 screen-6 cards, if any, may have been stored in `templateValues`; after this content-only change new answers are saved as `selectedVariant`, matching Unit 1 artifact variant behavior.

Follow-up:

- Optional Browser smoke can verify the exact mobile presentation if visual approval is needed.
