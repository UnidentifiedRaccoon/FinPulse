# T-075 — Apply Explanatory Block Pattern

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: current worktree

## Goal

Apply the selected lesson-block variant 2 without the leading icon to the real lesson reader, align similar passive explanatory blocks to the same pattern, and document the rule in the design system.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- harness/PARALLEL_AGENT_PROTOCOL.md
- docs/DESIGN_SYSTEM.md
- shadcn project rules

## Intended write set

- src/features/lesson-reader/card-renderers/TheoryCard.tsx
- src/features/lesson-reader/card-renderers/shared.tsx
- src/features/lesson-reader/LessonCardRenderer.tsx
- src/pages/LessonBlockVariantsPage.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- src/App.test.tsx
- docs/DESIGN_SYSTEM.md
- harness/tasks/active/T-075-apply-explanatory-block-pattern.md
- harness/tasks/review/T-075-apply-explanatory-block-pattern.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Runtime JSON/content changes.
- Backend/API/auth/progress/reflection behavior.
- Interactive answer-row redesigns beyond using existing shared list primitives for passive blocks.
- New dependencies.

## Plan

1. Analyze passive lesson-reader block renderers and extract a shared explanatory pattern based on variant 2 without a leading icon.
2. Apply the pattern to theory, callout, summary, read-only scenario, and read-only single-choice blocks.
3. Update design-system rules, focused tests, and run verification plus Browser smoke.

## Checks

- [x] npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify
- [x] Browser smoke on `/design/lesson-block-variants` at 390px
- [x] Browser smoke on `/lessons/where-money-goes` at 390px
- [x] Browser smoke on `/lessons/reserve-amount` at 390px

## Result packet

- Files changed:
  - `src/features/lesson-reader/card-renderers/TheoryCard.tsx`
  - `src/features/lesson-reader/card-renderers/shared.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.tsx`
  - `src/pages/LessonBlockVariantsPage.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `docs/DESIGN_SYSTEM.md`
  - `harness/tasks/review/T-075-apply-explanatory-block-pattern.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - Focused lesson/app Vitest passed: 2 files, 41 tests.
  - Full verify passed with local PostgreSQL: content validation, runtime import guard, typecheck, lint, 8 Vitest files / 68 tests, production build.
  - Browser 390px preview smoke: selected variant 2 has formula cells, `variantSvgCount: 0`, no horizontal overflow, no console warnings/errors.
  - Browser 390px `where-money-goes` smoke: target theory card has calculation cells, text chips, no card SVG, no horizontal overflow, no console warnings/errors.
  - Browser 390px `reserve-amount` smoke: formula and example paragraphs are both formatted, no card SVG, no horizontal overflow, no console warnings/errors.
- Risks:
  - Calculation-step extraction is intentionally narrow and only recognizes current explicit formulas in active T1 content; other future formulas still fall back to the same soft insight surface without structured cells.
  - In-app Browser screenshot capture timed out once, so Browser evidence is DOM/layout/console based.
- Follow-up:
  - When new lesson content adds different formulas, add pattern-specific extraction cases or move to explicit content metadata if the heuristic becomes too broad.
