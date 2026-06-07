# T-080 — Universal Practice Preview Patterns

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Completed: 2026-06-07
Branch/worktree: current worktree

## Goal

Refine the `/design/practice-card-variants` preview so each variant reads as a reusable practice interaction pattern, not a one-off categorization design.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- Current `/design/practice-card-variants` page
- frontend-design, react-best-practices, frontend-testing-debugging skills

## Intended write set

- src/pages/PracticeCardVariantsPage.tsx
- src/App.test.tsx
- harness/tasks/active/T-080-universal-practice-preview-patterns.md
- harness/tasks/review/T-080-universal-practice-preview-patterns.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Production lesson reader replacement.
- Runtime JSON/content model changes.
- Backend/API/auth/progress/reflection behavior changes.
- New card types, diagnostics, scoring, analytics, or recommendations.

## Plan

1. Reframe the preview page and variant labels around reusable practice patterns.
2. Add compact type-compatibility metadata and generic interaction states to each variant.
3. Keep the same `where-money-goes` categorization example as the concrete exercise data.
4. Update tests, run focused checks/full verify, and repeat Browser smoke.

## Checks

- [x] npm run test:run -- src/App.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify
- [x] Browser smoke on `/design/practice-card-variants` at 390px and 1280px

## Result packet

- Files changed: `src/pages/PracticeCardVariantsPage.tsx`; `src/App.test.tsx`; `harness/WORKBOARD.md`; `harness/PROJECT_STATE.md`; `harness/tasks/review/T-080-universal-practice-preview-patterns.md`.
- Checks run: focused App test, typecheck, lint, build, full verify with local PostgreSQL, Browser mobile/desktop smoke.
- Browser evidence: `/design/practice-card-variants` rendered 5 pattern variants, universal fit chips were present, no Vite overlay, no console warnings/errors, no horizontal overflow at 390px or 1280px; the first pattern completed with `Верно` feedback and `Далее` button after checking.
- Risks: production lesson reader remains unchanged until the user selects a pattern direction.
- Follow-up: choose one pattern or combine specific details before applying to the runtime practice renderer.
