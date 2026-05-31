# T-047 — Profile entry route

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Send authenticated learners to `/program` by default and replace the old authenticated welcome screen with a Duolingo-like profile surface at `/profile`.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md

## Intended write set

- `src/App.tsx`
- `src/pages/EntryPage.tsx`
- `src/api/client.ts`
- `server/lib/sessions.ts`
- `server/modules/auth/routes.ts`
- `server/app.test.ts`
- `src/App.test.tsx`
- `src/App.logout.test.tsx`
- `src/features/auth/AuthControls.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-047-profile-entry-route.md`

## Out-of-scope

- Achievements, subscriptions, followers, ratings, rewards, diagnostics, analytics, or account management.
- Backend profile editing.
- Content JSON changes.

## Plan

1. Expose learner registration date through the existing auth user shape.
2. Route authenticated `/` to `/program` and make `/profile` the profile tab.
3. Replace the welcome screen with profile identity and progress statistics.
4. Update tests and run verification.

## Checks

- [x] npm run test:run -- server/app.test.ts src/App.test.tsx src/App.logout.test.tsx src/features/auth/AuthControls.test.tsx
- [x] npm run verify
- [x] Browser smoke on `http://localhost:5175/` and `/profile` at default viewport and 390px

## Result packet

- Files changed: `src/App.tsx`, `src/pages/EntryPage.tsx`, `src/api/client.ts`, `server/lib/sessions.ts`, `server/modules/auth/routes.ts`, `server/app.test.ts`, `src/App.test.tsx`, `src/App.logout.test.tsx`, `src/features/auth/AuthControls.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-047-profile-entry-route.md`
- Checks run: focused auth/app tests, `npm run verify`, Browser smoke with screenshots saved at `/tmp/finpulse-profile-desktop.png` and `/tmp/finpulse-profile-mobile.png`.
- Risks: Existing unrelated workspace changes remain untouched; profile editing/avatar upload remains out of scope.
- Follow-up: None for this task.
