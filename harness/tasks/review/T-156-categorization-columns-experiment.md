# T-156 — Categorization Columns Experiment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28

## Goal

Add an isolated design preview route for the third-screen categorization final
check, replacing the current table mental model with answer columns/buckets for
product review before any production lesson-reader change.

## Intended write set

- `src/pages/CategorizationColumnsExperimentPage.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-156-categorization-columns-experiment.md`
- `harness/tasks/review/T-156-categorization-columns-experiment.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- Production `CategorizationCard.tsx` or `LessonSession.tsx` behavior.
- Runtime content JSON, content schema, API, progress, or persistence changes.
- Product navigation links to the preview route.

## Changes

- Added public preview route `/design/categorization-columns` outside the
  authenticated learner shell and auth bootstrap request.
- Added a local-state experiment page with 2-, 3-, and 4-column final-check
  mocks.
- Implemented click item -> click another column transfer, repeat click to clear
  selection, reset, and local check highlighting.
- Kept production categorization, lesson session, runtime JSON, API, progress,
  and persistence unchanged.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] Browser QA at 390px and desktop
- [x] `git diff --check`
- [x] Full `npm run verify` skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`

## Result packet

- Files changed: `src/pages/CategorizationColumnsExperimentPage.tsx`,
  `src/App.tsx`, `src/App.test.tsx`, and harness task/state files.
- Checks run: focused App tests, typecheck, lint, in-app Browser QA at 390x844
  and 1280x900, environment DB check for full verify, and `git diff --check`.
- Focused App tests also assert the preview route does not call `/api/auth/me`.
- Browser QA result: `/design/categorization-columns` rendered with title
  `ФинПульс`, heading `Финальная сверка колонками`, no Vite overlay, no
  console warnings/errors, and no body horizontal overflow at either viewport.
  The 4-column mock exposed four columns; selecting `Перевод 10% в резерв` and
  clicking `Сначала себе` moved the answer and cleared selection.
- Risks: the page is intentionally temporary experiment code and is not linked
  from product navigation; full verify remains gated by local backend DB env.
