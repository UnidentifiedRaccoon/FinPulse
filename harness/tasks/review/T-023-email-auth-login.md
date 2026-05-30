# T-023 — Email auth login

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: feat/learning-path-storybook-catalog

## Goal

Allow learner registration/login with email-style identifiers and avoid the misleading `Login and password are required` error for valid-looking email input.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- User reproduced registration with an email address in the login field.

## Intended write set

- server/modules/auth/routes.ts
- server/app.test.ts
- src/features/auth/AuthControls.tsx
- src/features/auth/AuthControls.test.tsx
- harness/tasks/active/T-023-email-auth-login.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Full profile/account model.
- Email verification, password reset, external auth providers.
- Backend scope beyond the existing Stage 2 minimal learner login.

## Plan

1. Update auth validation to accept email-style identifiers while preserving existing username login support.
2. Clarify the entry field copy so email is an expected option.
3. Add focused tests for email registration/auth form behavior.
4. Run verification and browser smoke against the open local dev app.

## Checks

- [x] npm run test:run -- server/app.test.ts src/features/auth/AuthControls.test.tsx
- [x] npm run verify
- [x] Browser smoke: email registration from `http://127.0.0.1:5174/`

## Result packet

- Files changed: `server/modules/auth/routes.ts`, `server/app.test.ts`, `src/features/auth/AuthControls.tsx`, `src/features/auth/AuthControls.test.tsx`, harness state.
- Checks run: `npm run test:run -- server/app.test.ts src/features/auth/AuthControls.test.tsx`; `npm run verify`; Browser smoke with a dummy email registration on `http://127.0.0.1:5174/`.
- Risks: Existing accounts created before this change keep their stored login identifiers unchanged.
- Follow-up: None.
