# T-024 — Progress PUT CORS

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: feat/learning-path-storybook-catalog

## Goal

Fix the `Failed to fetch` banner that appears after authenticated lesson progress writes from the local direct API dev origin.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- User sees `Failed to fetch` on the main/program screen after trying authenticated flows.

## Intended write set

- server/app.ts
- server/app.test.ts
- src/pages/LessonPage.tsx
- src/features/lesson-reader/LessonSession.tsx
- src/App.test.tsx
- harness/tasks/active/T-024-progress-put-cors.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Changing the progress persistence model.
- Adding diagnostics, analytics, or account/profile features.
- Reworking lesson reader UX.

## Plan

1. Confirm the failed flow is a CORS preflight block for progress `PUT` requests.
2. Allow `PUT` in backend CORS methods for local/API clients.
3. Stabilize lesson progress callbacks and viewed-write effects so successful progress writes do not loop or duplicate under dev StrictMode.
4. Add focused backend/frontend tests.
5. Verify through focused tests, full verification, and browser smoke.

## Checks

- [x] npm run test:run -- server/app.test.ts src/App.test.tsx
- [x] npm run verify
- [x] Browser smoke: authenticated lesson progress write no longer leaves `Failed to fetch`

## Result packet

- Files changed: `server/app.ts`, `server/app.test.ts`, `src/pages/LessonPage.tsx`, `src/features/lesson-reader/LessonSession.tsx`, `src/App.test.tsx`, harness state.
- Checks run: `curl` preflight check for progress `PUT`; `npm run test:run -- server/app.test.ts src/App.test.tsx`; `npm run verify`; Browser smoke on `http://127.0.0.1:5174/`.
- Risks: Dev `StrictMode` can still run mount effects more aggressively than production, but viewed-write guards prevent duplicate initial progress writes per lesson/card session.
- Follow-up: None.
