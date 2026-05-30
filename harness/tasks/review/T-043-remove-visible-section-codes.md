# T-043 — Remove visible section codes

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Completed: 2026-05-30
Branch/worktree: main

## Goal

Remove redundant visible Finzdorov section codes such as `01.02`, `01.03`, and `01.04` from learner-facing section headings while keeping section labels and content ordering intact.

## Context

Files/docs read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/program-navigation/lessonPathSections.ts`
- `src/pages/ModulePage.tsx`
- `src/pages/UnitPage.tsx`
- `src/App.test.tsx`

## Intended write set

- `src/features/program-navigation/lessonPathSections.ts`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/pages/ModulePage.tsx`
- `src/pages/UnitPage.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-043-remove-visible-section-codes.md`
- `harness/tasks/review/T-043-remove-visible-section-codes.md`

## Out-of-scope

- Changing runtime JSON/source titles or lesson/card content.
- Changing content schema, backend API, auth, progress, or lesson reader behavior.

## Result packet

- Files changed:
  - `src/features/program-navigation/lessonPathSections.ts`
  - `src/features/program-navigation/LessonPathMap.tsx`
  - `src/pages/ModulePage.tsx`
  - `src/pages/UnitPage.tsx`
  - `src/App.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-043-remove-visible-section-codes.md`
- Checks run:
  - `npm run test:run -- src/App.test.tsx src/features/program-navigation/learningPath.test.ts`
  - `npm run verify`
  - Browser smoke on `http://127.0.0.1:5175/modules/financial-goals`
- Risks:
  - Numeric lesson-node counters remain inside the path circles because they number lessons, not section titles.
  - Source/runtime JSON titles still keep Finzdorov codes for traceability; only learner-facing section display is stripped.
- Follow-up:
  - None required for this UI cleanup.
