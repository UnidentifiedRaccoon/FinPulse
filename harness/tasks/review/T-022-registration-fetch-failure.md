# T-022 — Registration fetch failure

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: feat/learning-path-storybook-catalog

## Goal

Fix the registration flow that surfaces `Failed to fetch`/`fail to fetch` in the app and explain the root cause.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- T-020 entry auth screen introduced the root auth form.

## Intended write set

- server/app.ts
- server/app.test.ts
- README.md
- .env.example
- harness/tasks/active/T-022-registration-fetch-failure.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Full account/profile features.
- Backend scope expansion beyond existing Stage 2 auth/session API.
- Changes to educational content JSON.

## Plan

1. Reproduce the registration request failure locally and inspect the network/runtime path.
2. Make the smallest coherent fix in the backend CORS/API layer.
3. Add or update focused test coverage.
4. Run verification and browser smoke for registration.

## Checks

- [x] npm run test:run -- server/app.test.ts
- [x] npm run verify
- [x] Browser smoke: `http://localhost:5173/` anonymous `/` -> register -> welcome state
- [x] Browser smoke: `http://127.0.0.1:5174/` with `VITE_API_BASE_URL=http://127.0.0.1:3001` -> register -> welcome state

## Result packet

- Files changed: `server/app.ts`, `server/app.test.ts`, `.env.example`, `README.md`, harness state.
- Checks run: `npm run test:run -- server/app.test.ts`; `npm run verify`; Browser smoke on same-origin Vite proxy and direct API base URL local loopback origin.
- Risks: A copied old `.env` with `FINPULSE_CORS_ORIGIN=http://localhost:5173` will still force a single-origin override until updated or cleared.
- Follow-up: None.
