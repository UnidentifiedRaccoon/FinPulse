# T-030 — Lesson popup simplification

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Simplify the lesson detail popup opened from the module path so its text fits comfortably on mobile and only shows the lesson title plus reading time with an icon.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/App.test.tsx`

## Intended write set

- `src/features/program-navigation/LessonPathMap.tsx`
- `src/App.test.tsx`
- `harness/tasks/review/T-030-lesson-popup-simplification.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON or content schema changes.
- Navigation, progress, auth, backend, or routing contract changes.
- T-029 button hover color task and its files.

## Plan

1. Remove the module/section label, lesson description, and main skill block from the popup.
2. Keep the lesson title, show duration as compact metadata with an icon, and preserve the primary/secondary actions.
3. Update tests that assert the removed description text.
4. Run focused tests, full verification, and mobile rendered QA.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run verify`
- [x] Browser mobile smoke check for `/modules/financial-goals` lesson popup
- [x] Browser desktop smoke check for `/modules/financial-goals` lesson popup

## Result packet

- Files changed: `src/features/program-navigation/LessonPathMap.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-030-lesson-popup-simplification.md`
- Checks run: `npm run test:run -- src/App.test.tsx`; `npm run verify`; Browser smoke at 390x844 and default desktop viewport.
- Risks: Browser validation required restarting the local backend because the existing `:3001` process was no longer responding; no app regression found after restart.
- Follow-up: None.
