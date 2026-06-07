# T-100 — External example screen

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Completed: 2026-06-07
Branch/worktree: current workspace

## Goal

Expand the first four active T1 lessons from seven runtime cards to eight by adding a new fourth screen with an external example, one-of-three choice, and source-backed statistics.

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
- current T1 runtime unit JSON and source Markdown

## Intended write set

- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `docs/modules/t1-start/unit_01_money_operations/lesson_01_where-money-goes.md`
- `docs/modules/t1-start/unit_01_money_operations/lesson_02_mandatory-and-desired.md`
- `docs/modules/t1-start/unit_02_planning_management/lesson_01_why-emergency-fund.md`
- `docs/modules/t1-start/unit_02_planning_management/lesson_02_reserve-amount.md`
- `docs/methodology/AUTHORING.md`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/App.test.tsx`
- `server/app.test.ts`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Out-of-scope

- Schema, backend, API, persistence, or renderer changes.
- New card types or new persisted answer kinds.
- Diagnostics, scoring, analytics, recommendations, reminders, or gamification.
- Rewriting unrelated lesson content.

## Plan

1. Update source Markdown to use eight screens and move statistics to the new external example screen 4.
2. Insert `scenario` order-4 cards in runtime JSON and shift existing personal-work/reflection/rule/summary cards to orders 5-8 while preserving existing ids.
3. Update authoring guidance and tests for the new T1 ladder.
4. Run content validation, focused tests, full verify, and browser smoke if feasible.

## Checks

- [x] `npm run check:content`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx server/content-contract.test.ts`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx server/content-contract.test.ts server/app.test.ts`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- [x] Browser smoke at 390px on all four lessons

## Result packet

- Files changed:
  - `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
  - `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
  - `docs/modules/t1-start/unit_01_money_operations/lesson_01_where-money-goes.md`
  - `docs/modules/t1-start/unit_01_money_operations/lesson_02_mandatory-and-desired.md`
  - `docs/modules/t1-start/unit_02_planning_management/lesson_01_why-emergency-fund.md`
  - `docs/modules/t1-start/unit_02_planning_management/lesson_02_reserve-amount.md`
  - `docs/methodology/AUTHORING.md`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `src/App.test.tsx`
  - `server/app.test.ts`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - this task file
- Checks run:
  - `npm run check:content` passed.
  - Focused lesson/app/content-contract tests passed; follow-up focused run with `server/app.test.ts` also passed after updating the first-lesson contract expectation for eight cards.
  - Full `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify` passed.
  - Browser smoke used a fresh temporary pair (`FINPULSE_API_PORT=3003`, Vite `5176`) because the pre-existing local dev pair was still serving older runtime content. At 390px, all four lessons showed `1 из 8` through the new screen 4, new screen 4 had three scenario options, `Проверить`, correct feedback, statistics, and the old personal-work card on screen 5. No horizontal overflow or console warnings/errors were observed.
- Risks:
  - Existing reflection/artifact/summary ids were preserved while orders/source sections shifted, so saved answer/progress keys should remain stable.
  - Scenario card progress can be saved like other cards, but the new objective choice answer itself is not persisted as a private reflection/artifact answer.
  - The full verify build still reports the existing Vite large-chunk warning.
- Follow-up:
  - None for T-100.
