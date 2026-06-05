# T-076 — Mobile Vertical Calculation Steps

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: current worktree

## Goal

Apply the user-approved vertical-step solution for mobile calculation blocks so formula cards no longer render as a broken horizontal zigzag on narrow lesson screens.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/DESIGN_SYSTEM.md
- Browser mobile audit on `/lessons/where-money-goes` and `/lessons/reserve-amount`

## Intended write set

- src/features/lesson-reader/card-renderers/TheoryCard.tsx
- src/pages/LessonBlockVariantsPage.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- docs/DESIGN_SYSTEM.md
- harness/tasks/active/T-076-mobile-vertical-calculation-steps.md
- harness/tasks/review/T-076-mobile-vertical-calculation-steps.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Runtime JSON/content changes.
- Backend/API/auth/progress/reflection behavior.
- Redesigning non-calculation passive text/chip/checklist blocks.
- New dependencies.

## Plan

1. Replace mobile calculation grids with vertical step rows while preserving desktop horizontal formulas.
2. Mirror the pattern in the design preview variant.
3. Update focused tests and the design-system rule.
4. Run focused and full verification plus Browser smoke on the affected lesson cards.

## Checks

- [x] npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify
- [x] Browser smoke on `/lessons/where-money-goes` at 390px
- [x] Browser smoke on `/lessons/reserve-amount` at 390px
- [x] Browser smoke on `/design/lesson-block-variants` at 390px

## Result packet

- Files changed:
  - `src/features/lesson-reader/card-renderers/TheoryCard.tsx`
  - `src/pages/LessonBlockVariantsPage.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `docs/DESIGN_SYSTEM.md`
  - `harness/tasks/review/T-076-mobile-vertical-calculation-steps.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - Focused lesson/app Vitest passed: 2 files, 41 tests.
  - Typecheck, lint, and production build passed.
  - Full verify passed with local PostgreSQL: content validation, runtime import guard, typecheck, lint, 8 Vitest files / 68 tests, production build.
  - Browser 390px smoke passed for `where-money-goes`, `reserve-amount`, and `/design/lesson-block-variants`.
- Risks:
  - The desktop formula still uses the compact horizontal grid from the `sm` breakpoint upward; the current change intentionally targets the approved mobile vertical layout.
  - Calculation extraction remains narrow to current known formulas; unrecognized formulas still render as soft insight text without structured steps.
- Follow-up:
  - If future formulas need custom labels/units, consider explicit content metadata instead of expanding text heuristics indefinitely.
