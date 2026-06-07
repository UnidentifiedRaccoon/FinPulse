# T-079 — Practice Card Design Variants

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Completed: 2026-06-07
Branch/worktree: current worktree

## Goal

Add a separate design preview page with five mobile-first UX variants for the `where-money-goes` categorization exercise, so the user can choose a direction before production lesson UI changes.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- Existing `/design/lesson-block-variants` route and page
- Current `where-money-goes` categorization card data
- frontend-design, react-best-practices, frontend-testing-debugging skills

## Intended write set

- src/pages/PracticeCardVariantsPage.tsx
- src/App.tsx
- src/App.test.tsx
- harness/tasks/active/T-079-practice-card-design-variants.md
- harness/tasks/review/T-079-practice-card-design-variants.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Runtime lesson reader replacement.
- Runtime JSON/content model changes.
- Backend/API/auth/progress/reflection changes.
- New dependencies, analytics, diagnostics, scoring, or recommendations.

## Plan

1. Add a standalone unauthenticated design route.
2. Build five interactive variants based on the `where-money-goes` categorization exercise.
3. Add a focused route/render test.
4. Run focused checks, full verify, and Browser smoke at mobile/desktop widths.

## Checks

- [x] npm run test:run -- src/App.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify
- [x] Browser smoke on `/design/practice-card-variants` at 390px and 1280px

## Result packet

- Files changed: `src/pages/PracticeCardVariantsPage.tsx`; `src/App.tsx`; `src/App.test.tsx`; `harness/WORKBOARD.md`; `harness/PROJECT_STATE.md`; `harness/tasks/review/T-079-practice-card-design-variants.md`.
- Checks run: focused App test, typecheck, lint, build, full verify with local PostgreSQL, Browser mobile/desktop smoke.
- Browser evidence: `/design/practice-card-variants` rendered 5 variants, no Vite overlay, no console warnings/errors, no horizontal overflow at 390px or 1280px; first row-switch variant completed with `Верно` feedback and `Далее` button after checking.
- Risks: production lesson reader remains unchanged until the user selects one variant.
- Follow-up: choose a variant or combine specific interaction details before applying it to the runtime `categorization` card renderer.
