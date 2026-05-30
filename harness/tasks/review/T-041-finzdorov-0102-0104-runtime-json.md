# T-041 — Finzdorov 01.02-01.04 runtime JSON

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Convert extracted Finzdorov Module 01 sections 01.02, 01.03, and 01.04 into FinPulse runtime JSON after the existing 01.01 unit.

## Context

Files/docs read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/finzdorov_module_01/0102-videnie-budushchego.md`
- `docs/methodology/finzdorov_module_01/0103-finansovye-tseli.md`
- `docs/methodology/finzdorov_module_01/0104-motivatsiya-dostizheniya-tseley.md`

## Intended write set

- `docs/modules/module_1/lesson_02_future_vision/**`
- `docs/modules/module_1/lesson_03_financial_goals/**`
- `docs/modules/module_1/lesson_04_goal_motivation/**`
- `docs/methodology/CONTENT_BACKLOG.md`
- `src/content/program.json`
- `src/content/modules/module_1/module.json`
- `src/content/modules/module_1/units/unit_02_future_vision.json`
- `src/content/modules/module_1/units/unit_03_financial_goals.json`
- `src/content/modules/module_1/units/unit_04_goal_motivation.json`
- `server/app.test.ts`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-041-finzdorov-0102-0104-runtime-json.md`

## Out-of-scope

- Content schema, UI renderer, backend API, auth, and progress contract changes.
- Product gamification loops, rewards, diagnostics, analytics, recommendations, or artifact persistence.
- Editing T-039/T-040 implementation files.

## Plan

1. Preserve conversion rationale in mapping docs for 01.02-01.04.
2. Add three unit JSON files using only existing card types.
3. Register the new units in Module 01 and update program/module copy.
4. Update API/app tests that assert module structure and add coverage for one new runtime unit/lesson.
5. Run content validation, focused tests, full verification, and browser smoke.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- server/app.test.ts server/content-contract.test.ts src/App.test.tsx`
- [x] `npm run verify`
- [x] Browser smoke: `/program`, `/modules/financial-goals`, `/modules/financial-goals/units/future-vision`, `/lessons/goal-levels` at 390px
- [x] Browser interaction proof: `/lessons/goal-levels` `Далее` advances to the local-goal artifact card

## Result packet

- Files changed:
  - `docs/modules/module_1/lesson_02_future_vision/README.md`
  - `docs/modules/module_1/lesson_03_financial_goals/README.md`
  - `docs/modules/module_1/lesson_04_goal_motivation/README.md`
  - `docs/methodology/CONTENT_BACKLOG.md`
  - `src/content/program.json`
  - `src/content/modules/module_1/module.json`
  - `src/content/modules/module_1/units/unit_02_future_vision.json`
  - `src/content/modules/module_1/units/unit_03_financial_goals.json`
  - `src/content/modules/module_1/units/unit_04_goal_motivation.json`
  - `server/app.test.ts`
  - `src/App.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-041-finzdorov-0102-0104-runtime-json.md`
- Checks run:
  - `npm run check:content`
  - `npm run test:run -- server/app.test.ts server/content-contract.test.ts src/App.test.tsx`
  - `npm run verify`
  - Browser smoke on `http://localhost:5175` with API on `http://127.0.0.1:3002`
- Risks:
  - 01.03 XLS/calculator material is represented as supplemental source only; no calculator UI was added.
  - 01.04 motivation scale is local reflection only; no diagnostics or scoring were added.
- Follow-up:
  - Later review can decide whether PDFs/XLSX should get a dedicated downloadable-materials UI, but that is outside this MVP content conversion.
