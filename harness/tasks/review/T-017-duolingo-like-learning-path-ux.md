# T-017 — Duolingo-like learning path UX

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main workspace

## Goal

Rework the current reader/catalog UI into a mobile-first learning path experience: home path, module lesson path, focused lesson flow, tactile progress states, and immediate feedback without adding out-of-scope gamification or backend changes.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/DESIGN_SYSTEM.md
- harness/PARALLEL_AGENT_PROTOCOL.md

## Intended write set

- `src/App.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/ModulePage.tsx`
- `src/pages/UnitPage.tsx`
- `src/features/program-navigation/**`
- `src/features/lesson-reader/**`
- `src/index.css`
- `src/App.test.tsx`
- focused tests under `src/features/**`
- `harness/tasks/active/T-017-duolingo-like-learning-path-ux.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content model or JSON content changes unless verification proves they are required.
- New backend, auth scope, accounts beyond existing minimal login, diagnostics, rewards, streaks, leaderboards, analytics, or personalized recommendations.
- Copying Duolingo assets, characters, exact UI, text, or proprietary elements.

## Plan

1. Map existing program/module/unit/lesson content and saved progress into home path and module path states.
2. Add reusable path UI and update overview/module/unit pages for mobile-first current/completed/locked states.
3. Polish focused lesson flow only where it supports the requested trainer feel and existing tests.
4. Run verification and browser/mobile smoke, then update harness state.

## Checks

- [x] `npm run verify`
- [x] browser mobile smoke check at 390x844 for home, module path, checked-answer lesson feedback

## Result packet

- Files changed: `src/App.tsx`, `src/App.test.tsx`, `src/index.css`, `src/pages/ProgramOverviewPage.tsx`, `src/pages/ModulePage.tsx`, `src/pages/UnitPage.tsx`, `src/features/program-navigation/**`, focused `src/features/lesson-reader/**` components/tests, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`.
- Checks run: `npm run typecheck`; focused `vitest` for app/lesson/path tests; `npm run lint`; `npm run verify`; in-app browser DOM/interaction smoke; Chrome CDP mobile screenshots/metrics at 390x844.
- Risks: locked is visual guidance only; lessons remain linkable to preserve public educational content. Existing minimal auth remains in scope, but the mobile form is collapsed to avoid crowding the first viewport.
- Follow-up: Persisted progress states should be tested with a signed-in user before any PR that depends on completed-path visuals.
