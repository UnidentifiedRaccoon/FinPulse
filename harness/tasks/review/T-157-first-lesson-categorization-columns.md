# T-157 — First Lesson Categorization Columns

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28

## Goal

Apply the column-based final categorization check to the real first lesson of
the first section, so the product flow can be reviewed with real lesson chrome
and content.

## Intended write set

- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/pages/CategorizationColumnsExperimentPage.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-157-first-lesson-categorization-columns.md`
- `harness/tasks/review/T-157-first-lesson-categorization-columns.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- Runtime JSON/content edits.
- API, progress, persistence, auth, or admin changes.
- Applying the column result to other categorization cards.
- Removing the temporary `/design/categorization-columns` preview route.

## Changes

- Enabled the column result view only for
  `card_l1s1l1_03_sorting_choice`.
- Kept the existing auto-flow answer step and existing result matrix for every
  other categorization card.
- Added click-to-select and click-another-column/click-answer-in-another-column
  transfer behavior in the real lesson result view.
- Updated column ordering so moved answers are appended to the bottom of the
  target column instead of being re-sorted by original question order.
- Removed the extra framed container around the product result columns; the
  columns remain individually framed and the result region remains accessible.
- Removed per-column answer count badges from the column headers.
- Kept the temporary preview route aligned with the same append-to-bottom
  mechanics and count-free column headers.
- Kept check feedback wired through the existing categorization correctness and
  feedback logic.
- Updated focused lesson-reader coverage and the App test helper that completes
  the first lesson.

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] Browser QA on `/lessons/where-money-goes` at 390x844 and 1280x800,
  including append-to-bottom ordering and removed outer result frame
- [x] Follow-up Browser QA on `/lessons/where-money-goes` confirmed count-free
  column headers
- [x] `git diff --check`
- [x] Full `npm run verify` skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`

## Result packet

- Files changed: `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`,
  `src/features/lesson-reader/LessonCardRenderer.test.tsx`,
  `src/pages/CategorizationColumnsExperimentPage.tsx`, `src/App.test.tsx`,
  and harness task/state files.
- Checks run: focused lesson-reader tests, focused App tests, typecheck, lint,
  Browser QA, environment DB check for full verify, and `git diff --check`.
- Browser QA result: first lesson rendered the real categorization result as two
  columns, not the old table; selecting `Кофе навынос` and clicking an answer in
  the other column moved it there, then moved it back. The board had no Vite
  overlay, no console warnings/errors, and no body horizontal overflow at
  390px or desktop.
- Follow-up Browser QA result: selecting `Покупка телефона` and moving it to
  `Проходит мимо внимания` appended it after existing items; moving it back to
  `Замечаю сразу` appended it after `Аренда жилья`. The result region has no
  outer border/background while preserving horizontal scroll and column regions.
- Count-badge Browser QA result: both column headers expose only the heading
  text (`H3`), no count badge span; no Vite overlay, no console warnings/errors,
  and no body horizontal overflow.
- Risks: the rollout is intentionally hard-targeted to one card id; applying it
  to other lessons should be a separate decision after product review.
