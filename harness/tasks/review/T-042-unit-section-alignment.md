# T-042 — Unit section alignment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Completed: 2026-05-30
Branch/worktree: main

## Goal

Align the learning path so each Finzdorov runtime unit renders as one visual section: `01.01`, `01.02`, `01.03`, and `01.04`, without splitting `01.01` into artificial chunks.

## Context

Files/docs read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `src/features/program-navigation/lessonPathSections.ts`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/program-navigation/learningPath.ts`
- `src/features/program-navigation/learningPath.test.ts`
- `src/pages/ModulePage.tsx`
- `src/pages/UnitPage.tsx`
- `src/App.test.tsx`

## Intended write set

- `src/features/program-navigation/lessonPathSections.ts`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-042-unit-section-alignment.md`
- `harness/tasks/review/T-042-unit-section-alignment.md`

## Out-of-scope

- Moving or mixing lesson/card content between runtime JSON units.
- Content schema, backend API, auth, progress, or lesson reader changes.

## Result packet

- Files changed:
  - `src/features/program-navigation/lessonPathSections.ts`
  - `src/features/program-navigation/LessonPathMap.tsx`
  - `src/App.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-042-unit-section-alignment.md`
- Checks run:
  - `npm run test:run -- src/App.test.tsx src/features/program-navigation/learningPath.test.ts`
  - `npm run verify`
  - Browser smoke on `http://127.0.0.1:5175/modules/financial-goals`
  - Browser smoke on `http://127.0.0.1:5175/lessons/goal-levels`
- Risks:
  - Lesson node numbering is still sequential within the rendered path; no JSON/content order was changed.
  - Focused unit routes render their own path from lesson number 1 while keeping the real unit section number.
- Follow-up:
  - None required for this alignment task.
