# T-032 — Application navigation menu

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Add a responsive application menu: a desktop sidebar and a mobile bottom navigation bar, using the user's Duolingo screenshots as visual reference while keeping FinPulse MVP scope.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- src/App.tsx
- src/App.test.tsx

## Intended write set

- `src/App.tsx`
- `src/App.test.tsx`
- `src/pages/EntryPage.tsx`
- `harness/tasks/review/T-032-application-navigation-menu.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/content model changes.
- Backend/API/auth/progress contract changes.
- Rewards, ratings, shops, diagnostics, dashboards, or full profile scope.
- Reworking the lesson path UI beyond shell spacing required for the new menu.

## Plan

1. Replace the narrow top header shell with responsive app navigation: fixed desktop sidebar and fixed mobile bottom bar.
2. Keep navigation items within current MVP routes/scope and preserve auth controls.
3. Add focused app-shell tests for the new navigation.
4. Run focused tests, full verification, and rendered mobile/desktop smoke checks.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run verify`
- [x] Browser desktop smoke on `/program`
- [x] Browser mobile smoke on `/modules/financial-goals`
- [x] Browser mobile lesson-route conflict check on `/lessons/why-values-matter`

## Result packet

- Files changed: `src/App.tsx`, `src/App.test.tsx`, `src/pages/EntryPage.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-032-application-navigation-menu.md`.
- Checks run: `npm run test:run -- src/App.test.tsx`; `npm run typecheck`; `npm run lint`; `npm run build`; `npm run verify`; Browser smoke on desktop and 390px mobile.
- Risks: Mobile bottom navigation is hidden on lesson-reader routes to avoid overlapping the lesson CTA; lessons still expose their own back navigation.
- Follow-up: Add more menu destinations only after the product scope has real routes for them.
