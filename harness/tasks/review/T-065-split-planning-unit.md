# T-065 — Split planning lessons into Unit 2

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-04
Branch/worktree: existing workspace

## Goal

Move the two emergency-fund lessons imported in T-064 out of `money-and-operations` into a separate runtime unit matching the source documents: `Юнит 2. Планирование и управление`.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `docs/modules/t1-start/unit_01_money_operations/**`
- `docs/modules/t1-start/unit_02_planning_management/**`
- `src/content/modules/t1_start/module.json`
- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `server/content-contract.test.ts`
- `server/app.test.ts`
- `src/App.test.tsx`
- `docs/methodology/CONTENT_BACKLOG.md`
- `harness/tasks/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content schema changes
- New card types or UI behavior changes
- Backend/auth/persistence contract changes
- Adding further Unit 2 lessons beyond the two already imported

## Plan

1. Move source Markdown for `У2.1` and `У2.2` into a Unit 2 source folder.
2. Add a second module unit ref and split runtime JSON into Unit 1 and Unit 2 files.
3. Update focused tests and harness/backlog state.
4. Run validation and Browser smoke.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- server/content-contract.test.ts server/app.test.ts src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke on `/program`, `/modules/t1-start`, both unit routes, and four lesson routes at 390px

## Result packet

- Files changed:
  - Moved Unit 2 source Markdown to `docs/modules/t1-start/unit_02_planning_management/`.
  - Split runtime unit JSON into `unit_01_money_and_operations.json` and `unit_02_planning_and_management.json`.
  - Updated module refs, focused content/API/app tests, backlog, workboard, and project state.
- Checks run:
  - `npm run check:content`
  - `npm run test:run -- server/content-contract.test.ts server/app.test.ts src/App.test.tsx`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
  - Browser smoke at 390px for `/program`, `/modules/t1-start`, both unit routes, and four lesson routes; no horizontal overflow, no console warnings/errors, module lesson dialog opens.
- Risks:
  - Existing learner progress can make path-map status labels differ by local account state, but unit membership and route content are stable.
- Follow-up:
  - None for this split.
