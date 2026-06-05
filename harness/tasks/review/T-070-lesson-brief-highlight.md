# T-070 — Lesson brief highlight

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: existing workspace

## Goal

Make the lesson intro/goal block more visually explicit and memorable across all lessons while staying within the current FinPulse mobile-first design system.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `frontend-design` skill
- `build-web-apps:shadcn` skill and `npx shadcn@latest info --json`

## Intended write set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/features/lesson-reader/*.stories.tsx`, if useful for visual coverage
- `src/features/storybook/fixtures.ts`, if useful for visual coverage
- `harness/tasks/review/T-070-lesson-brief-highlight.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime JSON/content/schema changes
- Backend/API/auth/progress changes
- New product mechanics, rewards, diagnostics, analytics, personalization, or external services
- Broad redesign of the lesson reader

## Plan

1. Inspect the existing lesson brief implementation and current design tokens.
2. Convert the quiet intro into a reusable highlighted lesson focus block.
3. Add focused coverage for the new semantics/structure.
4. Run focused checks and UI smoke at mobile width when possible.
5. Move the task to review and update harness state.

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser visual smoke at mobile width

## Result packet

Files changed:

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-070-lesson-brief-highlight.md`

Checks run:

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx` passed: 1 file, 10 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run verify` without a database URL reached backend tests and failed because `FINPULSE_TEST_DATABASE_URL, FINPULSE_DATABASE_URL, or DATABASE_URL` was not set.
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify` passed: content validation, runtime import guard, typecheck, lint, 8 test files / 61 tests, production build.
- Browser visual smoke passed on `/lessons/where-money-goes` with a local authenticated QA user at 360px and 390px: no horizontal overflow, no console warnings/errors, and the intro/goal block remains visible and aligned with the card shell.

Risks:

- The highlighted brief is intentionally more prominent, so the first card starts lower on very narrow screens than before. At 390px all first-card options remain visible before the sticky CTA; at 360px the page remains scroll-safe with no horizontal overflow.

Follow-up:

- None.
