# T-027 — Add impulsive purchases runtime unit

Status: review
Owner: orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: feat/learning-path-storybook-catalog

## Goal

Add one coherent theoretical reader unit about impulsive purchases and purchase pauses to the runtime JSON graph.

## Context

Read:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `src/content/program.json`
- `src/content/modules/module_1/module.json`
- `src/content/modules/module_1/units/unit_01_values_and_goals.json`
- `docs/modules/module_1/lesson_01/README.md`
- `docs/modules/module_1/lesson_01/*.md`
- `docs/methodology/README.md`

## Intended write set

- `src/content/modules/module_1/module.json`
- `src/content/modules/module_1/units/unit_02_impulsive_purchases.json`
- `server/app.test.ts`
- `harness/tasks/review/T-027-impulsive-purchases-runtime-unit.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- content schema changes
- UI redesign
- backend/API changes
- auth/progress changes
- diagnostics/rewards/analytics/admin/CMS
- external services

## Plan

1. Map the methodology example on impulsive purchases to one short runtime unit.
2. Add the new unit JSON and reference it from Module 1.
3. Validate content JSON.
4. Run full verification.
5. Record result packet.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- server/app.test.ts`
- [x] `npm run verify`

## Result packet

- Files changed: `src/content/modules/module_1/module.json`, `src/content/modules/module_1/units/unit_02_impulsive_purchases.json`, `server/app.test.ts`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `npm run check:content`; `npm run test:run -- server/app.test.ts`; `npm run verify`.
- Risks: the source is `docs/methodology/README.md`, not a new `docs/modules/**` slice, because the existing `docs/modules/module_1/lesson_01` material was already represented in runtime JSON. No schema, UI, backend route, auth, or progress contract changed.
- Follow-up: when new module-specific Markdown sources are added under `docs/modules/**`, convert them into separate runtime units instead of expanding this methodology-based slice.
