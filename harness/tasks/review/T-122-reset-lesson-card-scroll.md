# T-122 — Reset lesson card scroll

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13

## Goal

Reset the mobile lesson reader scroll position when moving between lesson cards, so the next screen starts at the top instead of inheriting the previous card's scroll offset.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/engineering/contributing.md`
- `build-web-apps:frontend-testing-debugging`

## Intended write set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/active/T-122-reset-lesson-card-scroll.md`
- `harness/tasks/review/T-122-reset-lesson-card-scroll.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- No content JSON or methodology changes.
- No route, level, section, backend, auth, progress, rewards, diagnostics, or analytics changes.
- No production lesson-card layout redesign.

## Plan

1. Inspect the lesson-card navigation flow and existing scroll helpers.
2. Add a small scroll reset tied to card transitions.
3. Add focused coverage for the reset behavior.
4. Run focused tests, project verification, and a mobile browser smoke check.

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Mobile browser smoke on a lesson card transition

## Result packet

- Files changed: `src/features/lesson-reader/LessonSession.tsx`, `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `harness/tasks/review/T-122-reset-lesson-card-scroll.md`, `harness/PROJECT_STATE.md`
- Checks run: focused lesson-reader test, typecheck, lint, production build, full verify with local PostgreSQL test URL, in-app Browser mobile smoke on `http://localhost:5173/lessons/where-money-goes`
- Risks: Browser screenshot capture timed out with `Page.captureScreenshot`; DOM, scroll position, interaction, page identity, and console evidence passed.
- Follow-up: none
