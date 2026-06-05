# T-077 — Container-Aware Calculation Steps

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: current worktree

## Goal

Make lesson calculation formulas container-aware so narrow lesson cards keep the vertical stepper layout even when the browser viewport is wide enough to trigger desktop breakpoints.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/DESIGN_SYSTEM.md
- T-075 / T-076 review stack

## Intended write set

- src/features/lesson-reader/card-renderers/TheoryCard.tsx
- src/pages/LessonBlockVariantsPage.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- src/index.css
- docs/DESIGN_SYSTEM.md
- harness/tasks/active/T-077-container-aware-calculation-steps.md
- harness/tasks/review/T-077-container-aware-calculation-steps.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Runtime JSON/content changes.
- Backend/API/auth/progress/reflection/database behavior.
- Non-calculation passive block redesign.
- New dependencies.

## Plan

1. Replace calculation viewport breakpoints with a native CSS container query.
2. Keep vertical `step -> operator -> step -> result` as the default layout.
3. Enable horizontal grids only when the calculation container is at least `36rem` wide.
4. Mirror the production pattern in the lesson block variants preview.
5. Update focused tests, design-system wording, and harness state.

## Checks

- [x] npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify
- [x] Browser smoke on `/lessons/reserve-amount`
- [x] Browser smoke on `/lessons/where-money-goes`
- [x] Browser smoke on `/design/lesson-block-variants`

## Result packet

- Files changed:
  - `src/features/lesson-reader/card-renderers/TheoryCard.tsx`
  - `src/pages/LessonBlockVariantsPage.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `src/index.css`
  - `docs/DESIGN_SYSTEM.md`
  - `harness/tasks/review/T-077-container-aware-calculation-steps.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - Focused lesson/app Vitest passed: 2 files, 41 tests.
  - Typecheck, lint, and production build passed.
  - Full verify passed with local PostgreSQL: content validation, runtime import guard, typecheck, lint, 8 Vitest files / 68 tests, production build.
  - Browser smoke passed on `http://localhost:5173`: `reserve-amount` at 1036px, `where-money-goes` at 1036px, and `/design/lesson-block-variants` at 390px.
- Browser evidence:
  - `reserve-amount`: calculation container width `404px`, `container-type: inline-size`, `display: flex`, strict vertical steps, no horizontal overflow, no warnings/errors.
  - `where-money-goes`: calculation container width `404px`, `container-type: inline-size`, `display: flex`, strict vertical steps, no horizontal overflow, no warnings/errors.
  - Preview: calculation container width `282px`, `container-type: inline-size`, `display: flex`, strict vertical steps, no horizontal overflow, no warnings/errors.
- Risks:
  - Horizontal formula mode now depends on browser support for native CSS container queries.
  - Calculation extraction remains narrow to current known formulas from T-075/T-076.
