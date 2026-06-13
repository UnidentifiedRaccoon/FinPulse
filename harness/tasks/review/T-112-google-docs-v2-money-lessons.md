# T-112 — Google Docs v2 money lessons

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Branch/worktree: current workspace

## Goal

Replace the first two T1 money-and-operations lessons with the v2 Google Docs methodologist builds, preserving current lesson slugs and production card ids where possible.

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

Google Docs v2 sources exported to local temporary TXT files:
- `/tmp/finpulse_lesson1_v2.txt`
- `/tmp/finpulse_lesson2_v2.txt`

## Intended write set

- `docs/levels/t1-start/sections/money-and-operations/lesson_01_where-money-goes.md`
- `docs/levels/t1-start/sections/money-and-operations/lesson_02_mandatory-and-desired.md`
- `src/content/levels/t1_start/sections/section_01_money_and_operations.json`
- `src/App.test.tsx`
- `server/app.test.ts`
- `harness/tasks/active/T-112-google-docs-v2-money-lessons.md`
- `harness/tasks/review/T-112-google-docs-v2-money-lessons.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Changing the content model or card schema.
- Adding new lessons, backend scope, diagnostics, rewards, analytics, reminders, or personalized recommendations.
- Replacing current production card ids unless a v2 source conflict makes that necessary.

## Plan

1. Extract canonical screen specs from the screen tables in both v2 Google Docs.
2. Resolve table-vs-JSON conflicts in favor of the screen tables.
3. Update the two local Markdown sources with the v2 lesson builds.
4. Update the active runtime Section JSON for the two lessons, preserving slugs and card ids.
5. Run content validation and available verification.
6. Move this task to review and update harness state.

## Checks

- [x] `npm run check:content`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`

## Result packet

- Files changed:
  - `docs/levels/t1-start/sections/money-and-operations/lesson_01_where-money-goes.md`
  - `docs/levels/t1-start/sections/money-and-operations/lesson_02_mandatory-and-desired.md`
  - `src/content/levels/t1_start/sections/section_01_money_and_operations.json`
  - `src/App.test.tsx`
  - `server/app.test.ts`
  - `harness/tasks/review/T-112-google-docs-v2-money-lessons.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - `npm run check:content` — passed.
  - `npm run test:run -- src/App.test.tsx` — passed.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run test:run -- server/app.test.ts` — passed.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify` — passed.
- Table/JSON conflicts resolved:
  - Used screen-table titles instead of generic JSON-card titles.
  - Removed Google Docs JSON-card video/multimedia notes from runtime theory.
  - Lesson 1 screen 4 uses Кирилл scenario from the table instead of the old Марина subscription scenario.
  - Lesson 1 screen 6 uses table wording `больше или меньше`, not JSON-card wording `больше или лишнее`.
  - Lesson 1 screen 7 uses the table variant `про наблюдение за собой`, not JSON-card `просто вижу`.
  - Lesson 2 screen 4 uses Аня basket scenario from the table instead of the old Илья sale scenario.
  - Lesson 2 screen 5 uses 3 expenses from the concrete screen table despite the brief mentioning 5 expenses.
  - Lesson 2 screen 4 statistics excludes JSON-card trailing comma and JSON-only extra source/details not present in the table.
  - Screen 4 incorrect-option feedback was added as schema-required neutral feedback because tables only supplied correct feedback.
- Risks:
  - Lesson 2 v2 bridge points to missing У1.3 «Безопасный платёж». Runtime summary temporarily bridges to the next active lesson, `Зачем нужна подушка`; the source Markdown keeps the v2 bridge and notes the runtime adaptation.
- Follow-up:
  - Decide later whether to add У1.3 or revise the section route once that lesson exists.
