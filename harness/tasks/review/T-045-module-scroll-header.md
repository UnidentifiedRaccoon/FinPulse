# T-045 — Module Scroll Header

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Completed: 2026-05-30
Branch/worktree:

## Goal

Make the module path sticky header match the visible section while scrolling, remove the title top margin, and add comfortable padding to the module back button.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md

## Intended write set

- src/pages/ModulePage.tsx
- src/features/program-navigation/LessonPathMap.tsx
- src/App.test.tsx
- harness/tasks/review/T-045-module-scroll-header.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Content JSON/schema changes
- Backend/API/auth/progress changes
- New product scope

## Plan

1. Add scroll-aware active section detection for the module path.
2. Update sticky header spacing and module button padding/copy.
3. Add focused regression coverage and run verification.

## Checks

- [x] npm run test:run -- src/App.test.tsx
- [x] npm run verify
- [x] Browser smoke on /modules/financial-goals

## Result packet

- Files changed: `src/pages/ModulePage.tsx`, `src/features/program-navigation/LessonPathMap.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-045-module-scroll-header.md`
- Checks run: `npm run test:run -- src/App.test.tsx`; `npm run verify`; Browser smoke at `http://localhost:5173/modules/financial-goals` for 1280x720 and 390x844
- Risks: Header active-section threshold is viewport-position based; very unusual section heights may need tuning after more content design settles.
- Follow-up: None.
