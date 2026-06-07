# T-094 — Emergency fund practice categorization

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: existing workspace

## Goal

Make the `Где подушка реально выручает?` third-screen practice card match the approved first-lesson auto categorization flow by converting it from `multi_select` to a two-category `categorization` exercise.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/DESIGN_SYSTEM.md`
- `build-web-apps:react-best-practices` skill
- `build-web-apps:frontend-testing-debugging` skill
- `browser:control-in-app-browser` skill

## Intended write set

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `server/app.test.ts`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `docs/DESIGN_SYSTEM.md`
- `harness/tasks/review/T-094-emergency-fund-practice-categorization.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- New runtime interaction types
- Backend/API/auth/progress behavior changes
- Persistence for objective practice answers
- Rewards, diagnostics, analytics, labels, recommendations, or personalization

## Plan

1. Convert the emergency-fund third-screen card to `categorization` with two objective categories.
2. Preserve existing learner-facing feedback on the corresponding items.
3. Update tests and design-system wording for third-screen objective practice.
4. Run focused content/reader/API checks and standard verification where possible.
5. Browser-check the `why-emergency-fund` practice screen on mobile.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx server/app.test.ts`
- [x] `npm run verify`
- [x] Browser 390px smoke on `/lessons/why-emergency-fund`, card 3

## Result packet

Files changed:

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `server/app.test.ts`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `docs/DESIGN_SYSTEM.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-094-emergency-fund-practice-categorization.md`

Checks run:

- `npm run check:content` passed.
- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx server/app.test.ts` without a database URL reached backend setup and failed because `FINPULSE_TEST_DATABASE_URL, FINPULSE_DATABASE_URL, or DATABASE_URL` was not set.
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx server/app.test.ts` passed: 2 files, 33 tests.
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify` passed: content validation, runtime import guard, typecheck, lint, 9 test files / 78 tests, production build.
- Browser 390px smoke passed on a temporary updated dev pair `http://127.0.0.1:5174/` + API `http://127.0.0.1:3002`: card 3 shows category buttons `Подушка помогает` / `Не для подушки`, auto-advances through all five situations, renders the editable result table, enables `Проверить`, shows `Верно`, has no horizontal overflow, and has no console warnings/errors.

Risks:

- The existing dev pair on `localhost:5173` / `127.0.0.1:3001` was already running with stale API content, so the Browser check used a fresh pair on ports `5174` / `3002`. That fresh pair is running for local review at `http://127.0.0.1:5174/`.

Follow-up:

- None.
