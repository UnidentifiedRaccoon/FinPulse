# T-046 — Logout Redirect

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree:

## Goal

After a learner presses `Выйти` and logout succeeds, clear the local authenticated session state and return the SPA to the login/registration entry screen instead of leaving the learner on the current route.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md

## Intended write set

- src/App.tsx
- src/App.logout.test.tsx
- harness/tasks/review/T-046-logout-redirect.md

## Out-of-scope

- Backend auth contract changes
- Content JSON/schema changes
- Navigation redesign

## Plan

1. Make the app-level logout handler report successful logout.
2. Redirect successful logout actions to `/` with history replacement from the app shell.
3. Add focused regression coverage and run verification.

## Checks

- [x] npm run test:run -- src/App.logout.test.tsx
- [x] npm run verify
- [x] Browser smoke on http://localhost:5174/program

## Result packet

- Files changed: `src/App.tsx`, `src/App.logout.test.tsx`, `harness/tasks/review/T-046-logout-redirect.md`
- Checks run: `npm run test:run -- src/App.logout.test.tsx`; `npm run verify`; Browser smoke on desktop viewport confirmed logout redirects from `/program` to `/` with no console errors.
- Risks: Existing local worktree has unrelated active/review T-045 changes in harness and navigation files; this task did not modify them.
- Follow-up: None.
