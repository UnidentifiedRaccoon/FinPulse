# T-067 — Clean learner-facing copy and statuses

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-04
Branch/worktree: existing workspace

## Goal

Remove editor/source-adaptation wording from learner-facing runtime lesson text and hide local completion statuses that read like exercise content, such as `Рабочий блок заполнен.`.

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

## Intended write set

- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Source Markdown rewrites
- Content schema changes
- New card types or financial data lookup UI
- Persistence/API changes

## Plan

1. Remove learner-visible source/provenance and runtime-adaptation sentences from active runtime JSON.
2. Keep accessibility status announcements but make local draft/completion status text screen-reader-only.
3. Update focused tests for the cleaned artifact/reflection status behavior.
4. Run content validation, focused tests, full verify, and Browser smoke on the affected lesson card.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke at 390px on affected artifact/reflection cards

## Result packet

- Files changed:
  - `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
  - `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
  - `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
  - `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - `rg` scan for learner-facing source/runtime/adaptation markers in active runtime JSON
  - `npm run check:content`
  - `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
  - Browser smoke at 390px on `/lessons/where-money-goes`: artifact and reflection card interactions passed; no forbidden learner-facing copy, no horizontal overflow, no console warnings/errors.
- Risks:
  - Source Markdown still contains source/reference notes by design; only runtime learner-facing JSON was cleaned.
  - Status text remains in `sr-only` live regions for accessibility, but is not visible in the UI.
- Follow-up:
  - Continue applying this content hygiene rule when importing new lessons.
