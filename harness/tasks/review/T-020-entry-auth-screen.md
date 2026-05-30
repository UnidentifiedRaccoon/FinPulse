# T-020 — Entry auth screen

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree:

## Goal

Make the root entry screen focus on login/registration, and show a lightweight welcome screen when an existing learner session is present.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md

## Intended write set

- src/App.tsx
- src/pages/EntryPage.tsx
- src/features/auth/AuthControls.tsx
- src/components/ui/input.tsx
- src/components/ui/field.tsx
- src/components/ui/label.tsx
- src/components/ui/separator.tsx
- src/App.test.tsx
- src/features/auth/AuthControls.test.tsx
- harness/tasks/review/T-020-entry-auth-screen.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Full user cabinet/profile.
- Backend auth model changes.
- Blocking direct lesson/module URLs for anonymous visitors.

## Plan

1. Add a root entry page that switches between auth form and welcome content based on session state.
2. Move the existing program overview to `/program` while keeping direct learning routes intact.
3. Update tests and run verification.

## Checks

- [x] npm run test:run -- src/App.test.tsx src/features/auth/AuthControls.test.tsx
- [x] npm run typecheck
- [x] npm run verify
- [x] Browser smoke on `/` anonymous auth screen, registration-to-welcome, `/program`, and 390px mobile auth screen

## Result packet

- Files changed: `src/App.tsx`, `src/pages/EntryPage.tsx`, `src/features/auth/AuthControls.tsx`, shadcn form primitives under `src/components/ui/`, focused app/auth tests, harness state.
- Checks run: `npm run test:run -- src/App.test.tsx src/features/auth/AuthControls.test.tsx`; `npm run typecheck`; `npm run verify`; Browser smoke at `http://localhost:5173/`.
- Risks: Direct `/modules/**` and `/lessons/**` routes remain public by design; this only changes the root entry route.
- Follow-up: None for this task.
