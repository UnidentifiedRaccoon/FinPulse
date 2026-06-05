# T-064 — Add next money operations lessons

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-04
Branch/worktree: existing workspace

## Goal

Add three methodologist-provided Google Doc lessons to the active T1 runtime after `where-money-goes`, preserving local source Markdown and adapting source-only mechanics into current MVP card types.

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
- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `server/content-contract.test.ts`
- `server/app.test.ts`
- `src/App.test.tsx`
- `docs/methodology/CONTENT_BACKLOG.md`
- `harness/tasks/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content schema changes
- New UI card types
- Backend/admin/auth/persistence contract changes
- Diagnostics, scoring, psychotype inference, reminders, rewards, analytics, or recommendations
- Splitting the current runtime into a new Unit 2 without an explicit follow-up decision

## Plan

1. Export and preserve the three Google Docs as local Markdown.
2. Adapt each scripted lesson into supported runtime cards.
3. Update lesson count/slug/title assumptions in focused tests.
4. Update backlog, workboard, and project state.
5. Run content validation, focused tests, typecheck, lint, build, and Browser smoke.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- server/content-contract.test.ts server/app.test.ts src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke on `/program`, `/modules/t1-start`, and four lesson routes at 390px

## Result packet

T-065 supersedes the original placement of `why-emergency-fund` and `reserve-amount` in `money-and-operations`: those two source files and runtime lessons now belong to `planning-and-management`.

- Files changed:
  - `docs/modules/t1-start/unit_01_money_operations/lesson_02_mandatory-and-desired.md`
  - `docs/modules/t1-start/unit_01_money_operations/lesson_03_why-emergency-fund.md`
  - `docs/modules/t1-start/unit_01_money_operations/lesson_04_reserve-amount.md`
  - `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
  - `server/content-contract.test.ts`
  - `server/app.test.ts`
  - `src/App.test.tsx`
  - `docs/methodology/CONTENT_BACKLOG.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-064-add-next-money-operations-lessons.md`
- Runtime lessons added:
  - order 2, `mandatory-and-desired` — `Обязательное и желаемое`
  - order 3, `why-emergency-fund` — `Зачем нужна подушка`
  - order 4, `reserve-amount` — `Сколько держать в резерве`
- Card types used:
  - `mandatory-and-desired`: `single_choice`, `theory`, `single_choice`, `artifact`, `reflection`, `artifact`, `summary`
  - `why-emergency-fund`: `single_choice`, `theory`, `single_choice`, `scenario`, `reflection`, `artifact`, `summary`
  - `reserve-amount`: `single_choice`, `theory`, `single_choice`, `single_choice`, `artifact`, `artifact`, `summary`
- Checks run:
  - `npm run check:content` — passed
  - `npm run test:run -- src/App.test.tsx` — passed after updating path-state assertions for newly locked future lessons
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run test:run -- server/content-contract.test.ts server/app.test.ts src/App.test.tsx` — 3 files / 39 tests passed
  - `npm run typecheck` — passed
  - `npm run lint` — passed
  - `npm run build` — passed
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify` — 8 files / 59 tests passed
  - Browser smoke at 390px on `/program`, `/modules/t1-start`, `/lessons/where-money-goes`, `/lessons/mandatory-and-desired`, `/lessons/why-emergency-fund`, `/lessons/reserve-amount` — passed with no console warnings/errors and no horizontal overflow
- Risks:
  - The second and third new source documents identify themselves as `У2.1` and `У2.2` under `Юнит 2 · Планирование и управление`; they are kept in `money-and-operations` because this task explicitly requested the existing runtime unit.
  - Source video placeholders were not converted to `video` cards because no playable embed/source URL was provided.
  - Source sorting, multi-select, calculation, reminder, and psychotype-adaptive feedback mechanics were adapted to current cards or deferred to preserve MVP scope.
- Follow-up:
  - Decide whether to introduce a separate runtime unit for `Планирование и управление` before adding more `У2.*` lessons.
