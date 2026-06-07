# T-093 — Lesson goal card

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: existing workspace

## Goal

Remove the duplicated lesson description from the first lesson screen and make the lesson goal the single full introductory card.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `build-web-apps:react-best-practices` skill
- `build-web-apps:frontend-testing-debugging` skill
- `browser:control-in-app-browser` skill

## Intended write set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `docs/DESIGN_SYSTEM.md`
- `harness/tasks/review/T-093-lesson-goal-card.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime JSON/content/schema changes
- Backend/API/auth/progress changes
- Lesson flow, card order, or practice-card behavior changes
- New product mechanics, rewards, diagnostics, analytics, or personalization

## Plan

1. Inspect the current lesson brief component and focused tests.
2. Render only `learningGoal` as a standalone first-screen goal card.
3. Update focused coverage and design-system guidance.
4. Run focused tests and the standard verification entry point.
5. Move the task to review and update harness state.

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run verify`
- [x] Browser 390px smoke on a lesson first screen

## Result packet

Files changed:

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `docs/DESIGN_SYSTEM.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-093-lesson-goal-card.md`

Checks run:

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx` passed: 1 file, 21 tests.
- `npm run verify` without a database URL reached backend tests and failed because `FINPULSE_TEST_DATABASE_URL, FINPULSE_DATABASE_URL, or DATABASE_URL` was not set.
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify` passed: content validation, runtime import guard, typecheck, lint, 9 test files / 78 tests, production build.
- Browser 390px smoke passed on `http://localhost:5173/lessons/mandatory-and-desired`: the first screen shows only the `Цель урока` card, does not show `В этом уроке` or the old description copy, has no horizontal overflow, and has no console warnings/errors.
- Browser interaction proof passed: selecting `Иногда` enables `Далее`, and clicking it moves to `2 из 7` with no console warnings/errors.

Risks:

- Lessons with `description` but no `learningGoal` will no longer show an intro block in the lesson reader. Current active T1 lessons include `learningGoal`; descriptions remain available for navigation surfaces.

Follow-up:

- None.
