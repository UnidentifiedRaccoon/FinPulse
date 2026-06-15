# T-144 — Categorization Result Horizontal Scroll

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: main working tree

## Goal

Make the checked/result matrix on Level 1 categorization screens use one
consistent scrollable table pattern with the item column and header pinned, so
long category names, taller exercises, and future 3+ category exercises stay
usable on mobile.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- relevant lesson-reader tests
- frontend testing/debugging and React best-practices skills

## Intended write set

- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/active/T-144-categorization-result-horizontal-scroll.md`
- `harness/tasks/review/T-144-categorization-result-horizontal-scroll.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime JSON/content edits.
- Lesson methodology/DOCX edits.
- API, persistence, auth, admin, or route changes.
- Changes owned by stacked T-141/T-143 methodology work or T-142 Node refresh.

## Plan

1. Update only the final categorization result matrix to use one bounded
   horizontal/vertical overflow region, a sticky header, and a sticky first
   column.
2. Show the pinned-column side shadow only after the matrix has horizontal
   scroll offset.
3. Add focused test coverage for the scroll region, pinned header/column, and
   conditional shadow state.
4. Run focused lesson-reader tests and rendered mobile QA on the affected lesson.
5. Update task/state bookkeeping.

## Checks

- [x] Focused lesson-reader tests
- [x] Typecheck
- [x] Lint
- [x] Content validation
- [x] Browser mobile QA
- [x] Full `npm run verify` attempted; backend suites require
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL` in
  this shell
- [x] `git diff --check`

## Result packet

- Files changed: `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`,
  `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `harness/**`.
- Checks run: focused `LessonCardRenderer.test.tsx`, full project typecheck,
  lint, `npm run check:content`, `npm run verify` attempt, Browser mobile QA on
  `/lessons/safe-payment`, console health, and `git diff --check`.
- Result: the matrix now has one bounded `overflow-auto` region, sticky header,
  sticky `Пункт` column, and a side shadow that is absent at `scrollLeft = 0`,
  appears after horizontal scroll, and disappears when scrolled back to the left
  edge. Browser QA confirmed current content has both horizontal and vertical
  overflow on 390x844 (`scrollWidth 425` / `clientWidth 354`, `scrollHeight 709`
  / `clientHeight 448`) and the header remains pinned while the matrix scrolls
  vertically.
- Risks: full verify is still gated by a PostgreSQL test database URL in this
  shell; frontend/content/type/lint checks passed.
- Follow-up: reuse this result-matrix pattern if future categorization screens
  introduce 3+ categories or longer category names.
