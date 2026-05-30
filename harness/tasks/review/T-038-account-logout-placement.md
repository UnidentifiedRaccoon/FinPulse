# T-038 — Account logout placement

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Adjust account/logout placement after review: desktop sidebar separates account navigation from logout, while mobile bottom navigation never contains logout and keeps logout inside the account route.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `src/App.tsx`
- `src/pages/EntryPage.tsx`
- `src/App.test.tsx`

## Intended write set

- `src/App.tsx`
- `src/App.test.tsx`
- `src/pages/EntryPage.tsx`
- `harness/tasks/review/T-038-account-logout-placement.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/content model changes.
- Backend/API/auth/progress contract changes.
- New account/profile functionality.
- Lesson-route bottom CTA behavior.

## Plan

1. Add account as a separate desktop sidebar navigation item.
2. Keep desktop logout as a separate footer action.
3. Remove logout from mobile bottom navigation.
4. Add mobile-only logout at the bottom of the authenticated account route.
5. Update focused tests and run verification/browser smoke.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run verify`
- [x] Browser desktop smoke on `/program`
- [x] Browser mobile smoke on `/program` and `/`

## Result packet

- Files changed: `src/App.tsx`, `src/App.test.tsx`, `src/pages/EntryPage.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-038-account-logout-placement.md`.
- Checks run: `npm run test:run -- src/App.test.tsx`; `npm run verify`; Browser desktop `/program`; Browser mobile `/program`; Browser mobile `/`.
- Risks: The root `/` account route still doubles as the authenticated welcome/continue screen; no new account profile scope was added.
- Follow-up: If a real account page is introduced later, move the mobile logout into that page's own bottom action area.
