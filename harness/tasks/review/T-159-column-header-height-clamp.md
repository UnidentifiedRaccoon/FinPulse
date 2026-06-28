# T-159 — Column Header Height And Clamp

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28
Moved to review: 2026-06-28

## Goal

Make categorization column headers more neutral and stable: darker gray header
background, 57px minimum header height, and two-line ellipsis for long labels.

## Write set

- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/pages/CategorizationColumnsExperimentPage.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/App.test.tsx`
- `harness/tasks/review/T-159-column-header-height-clamp.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Updated production column-result headers to use a neutral gray `#e9edf2`
  background instead of the blue-tinted soft surface.
- Set production column-result header minimum height to `57px`.
- Added explicit two-line WebKit clamp styles to production column header labels.
- Applied the same neutral header background and title clamp to the
  `/design/categorization-columns` preview; preview hints are clamped to one
  line so the header stays compact.
- Preserved categorization logic, move ordering, checking, progress,
  persistence, API, and runtime content.

## Checks

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
  passed.
- `npm run test:run -- src/App.test.tsx` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- Browser QA on `/lessons/where-money-goes` at 390x844 and 1280x800 passed:
  production column headers render with `rgb(233, 237, 242)`, `57px` height,
  two-line clamp style attributes, no Vite overlay, no console warnings or
  errors, and no body horizontal overflow.
- Browser QA on `/design/categorization-columns` passed for all 9 preview
  columns: neutral gray header background, title clamp, hint clamp, no Vite
  overlay, no console warnings or errors, and no body horizontal overflow.
- `git diff --check` passed.

## Caveat

- Full `npm run verify` was skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
