# T-116 — Second-screen CTA labels

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Branch/worktree: current stacked review workspace

## Goal

Use the methodologist source button microcopy for T1 screen 2 theory CTAs, with validation so future lesson JSON cannot silently fall back to a generic label when the source provides one.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/tasks/review/T-115-card-cta-labels.md`

## Intended write set

- `src/content/levels/t1_start/sections/section_01_money_and_operations.json`
- `src/content/levels/t1_start/sections/section_02_planning_and_management.json`
- `scripts/check-content-json.mjs`
- `src/App.test.tsx`
- `harness/tasks/active/T-116-second-screen-cta-labels.md`
- `harness/tasks/review/T-116-second-screen-cta-labels.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- No new card types or UI interactions.
- No broad migration of every screen button label.
- No backend, persistence, route, or design-system changes.

## Plan

1. Add screen-2 `ctaLabel` values from the local source methodology files.
2. Add content validation for T1 screen-2 source CTA labels.
3. Update focused app tests for the second-screen CTA.
4. Run content validation, focused tests, and full verification if available.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] API CTA smoke: screen 2 of `where-money-goes`, `mandatory-and-desired`, `why-emergency-fund`, and `reserve-amount` returns `Понятно, дальше`.
- [x] Browser smoke on `http://localhost:5173/lessons/mandatory-and-desired`: after the first-screen CTA, screen 2 shows `Понятно, дальше`, no generic `Далее`, and console errors are empty.

## Result packet

- Files changed: `src/content/levels/t1_start/sections/section_01_money_and_operations.json`, `src/content/levels/t1_start/sections/section_02_planning_and_management.json`, `scripts/check-content-json.mjs`, `src/App.test.tsx`, harness task/state files.
- Checks run: `npm run check:content`; `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`; API CTA smoke; Browser smoke.
- Risks: validation is intentionally scoped to T1 screen 2 CTA labels, not every source button row.
- Follow-up: migrate additional non-system screen CTA labels in a separate scoped content pass if desired.
