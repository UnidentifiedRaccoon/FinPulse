# T-097 — Screen four personal data pattern

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree:

## Goal

Make the fourth screen in current Unit 2 lessons follow the same personal real-data working pattern as Unit 1: the learner records their own situation/calculation on screen 4, then reflects on meaning on screen 5 and fixes a first step on screen 6.

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
- `docs/methodology/AUTHORING.md`
- `harness/tasks/review/T-097-screen-four-personal-data-pattern.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Renderer/schema changes
- New card types
- Reworking Unit 1 lessons
- Changing third-screen objective practice behavior

## Plan

1. Convert U2.1 screen 4 from a checked external scenario to a personal emergency-situation artifact.
2. Move U2.2 target-amount calculation from screen 5 to screen 4 and make screen 5 a reflection.
3. Document the screen-4 authoring rule.
4. Validate content and run focused checks.

## Checks

- [x] npm run check:content
- [x] npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx server/app.test.ts server/content-contract.test.ts
- [x] npm run verify

## Result packet

Files changed:

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `docs/modules/t1-start/unit_02_planning_management/lesson_01_why-emergency-fund.md`
- `docs/modules/t1-start/unit_02_planning_management/lesson_02_reserve-amount.md`
- `docs/methodology/AUTHORING.md`
- `harness/tasks/review/T-097-screen-four-personal-data-pattern.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

Checks run:

- `npm run check:content`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx server/app.test.ts server/content-contract.test.ts`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`

Risks:

- `reserve-amount` keeps the target-amount artifact id `card_t1u2l2_05_target_amount` while moving it to order 4, preserving existing saved target-amount answers at the cost of an order/id mismatch.
- `why-emergency-fund` screen 4 uses a new card id because the old checked external scenario was replaced with a personal artifact.

Follow-up:

- Optional Browser smoke can verify the exact mobile presentation if this content change needs visual approval.
