# T-119 — Remove stale second section

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Branch/worktree: current stacked review workspace

## Goal

Remove the stale second runtime section and its two lessons so the active app contains only the two current methodologist-approved lessons in `money-and-operations`.

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

## Intended write set

- `src/content/levels/t1_start/level.json`
- `src/content/levels/t1_start/sections/section_01_money_and_operations.json`
- deleted `src/content/levels/t1_start/sections/section_02_planning_and_management.json`
- `docs/levels/t1-start/sections/money-and-operations/lesson_02_mandatory-and-desired.md`
- deleted `docs/levels/t1-start/sections/planning-and-management/lesson_01_why-emergency-fund.md`
- deleted `docs/levels/t1-start/sections/planning-and-management/lesson_02_reserve-amount.md`
- `docs/CONTENT_MODEL.md`
- `docs/QA_USER_SCENARIO_MAP.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `server/app.test.ts`
- `server/content-contract.test.ts`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-119-remove-stale-second-section.md`
- `harness/tasks/review/T-119-remove-stale-second-section.md`

## Out-of-scope

- No new lessons or replacement second section.
- No architecture/schema changes.
- No changes to unrelated active task files T-117/T-118.
- Historical task notes may keep old audit references.

## Plan

1. Remove the second section reference and files from active runtime/source content.
2. Update the first section's final bridge text so it does not point to a removed lesson.
3. Update API/app tests and active docs to expect one section and two lessons.
4. Run content validation, focused tests, full verify, and API/UI smoke.

## Checks

- [x] `npm run check:content`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run test:run -- src/App.test.tsx server/app.test.ts server/content-contract.test.ts`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] API smoke for current and removed routes
- [x] Headless Chrome/CDP mobile UI smoke for current and removed routes

## Result packet

- Files changed: active T1 level/section JSON, first-section source Markdown bridge copy, removed stale second-section runtime/source files, active content/API/App tests, active docs/harness.
- Checks run: content validation; focused App/API/content-contract tests with local PostgreSQL URL; full verify with local PostgreSQL URL; API smoke for one-section/two-lesson graph and removed 404s; headless Chrome/CDP 390px UI smoke for current level and removed section/lesson routes. The in-app Browser plugin had no registered `iab` target in this session, so Chrome/CDP was used for the final UI smoke.
- Risks: historical review/task notes still mention the removed old lessons as audit trail; this is intentional and not active content.
- Follow-up: add a new second section only after fresh актуальные methodologist materials are ready.
