# T-158 — Column Header And Iconless Items

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28
Moved to review: 2026-06-28

## Goal

Refine the column-based categorization result so column headers read as
separate header strips and answer items are text-only movable cards without
radio/checkbox-like markers.

## Write set

- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/pages/CategorizationColumnsExperimentPage.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/App.test.tsx`
- `harness/tasks/review/T-158-column-header-iconless-items.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Added a tinted, bordered header strip inside each column for the production
  first-lesson column result and the `/design/categorization-columns` preview.
- Removed the decorative circle/check marker from column result answer items.
- Kept move selection visible before checking through the existing blue
  background/border/shadow affordance.
- Kept post-check feedback iconless: correct and retry states are communicated
  by green/yellow card styling only.
- Preserved selection, move, append-to-bottom, check, progress, persistence,
  API, and content behavior.

## Checks

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
  passed.
- `npm run test:run -- src/App.test.tsx` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- Browser QA on `/lessons/where-money-goes` at 390x844 and 1280x800 passed:
  header strips render with the soft surface and bottom border, answer items
  have no marker icons, selected state is visible before checking, green/yellow
  result states render after checking, no Vite overlay, no console warnings or
  errors, and no body horizontal overflow.
- `git diff --check` passed.

## Caveat

- Full `npm run verify` was skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
