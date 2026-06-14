# T-128 — Reflection schema legacy cleanup

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Updated: 2026-06-13
Branch/worktree:

## Goal

Fix `PUT /api/reflections/card_l1s1l1_04_expense_diary` returning 500 when a local PostgreSQL `reflection_answers` table still has legacy `module_*` / `unit_*` NOT NULL columns from before the Level/Section migration.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- Browser/frontend debugging skill

## Intended write set

- `server/db/schema.sql`
- `server/app.test.ts`
- `harness/tasks/review/T-128-reflection-schema-legacy-cleanup.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime content/source JSON edits.
- Reintroducing module/unit API or storage surfaces.
- Branches, commits, pushes, or PRs.

## Changes

- Added an idempotent `reflection_answers` cleanup to `server/db/schema.sql`: missing `level_*` / `section_*` columns are added/backfilled, known `t1-start` values are normalized, and legacy `module_slug`, `unit_slug`, `module_title`, and `unit_title` columns are dropped.
- Added a backend regression test that starts from a legacy `reflection_answers` table and verifies `PUT /api/reflections/card_l1s1l1_04_expense_diary` saves the current artifact answer successfully.
- Applied the migration to the local dev database used by `localhost:5173`; the old legacy columns are gone there now.

## Checks

- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run test:run -- server/app.test.ts`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] HTTP smoke on `http://localhost:5173/api/reflections/card_l1s1l1_04_expense_diary` returned `200 OK`.
- [x] Browser 390x844 UI flow on `http://localhost:5173/lessons/where-money-goes`: filled the three expense fields, clicked `Далее`, reached screen 6, no `Не сохранено` / `Internal server error`, console warnings/errors empty.
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`

## Result packet

- Files changed: `server/db/schema.sql`, `server/app.test.ts`, `harness/tasks/review/T-128-reflection-schema-legacy-cleanup.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`.
- Checks run: see above.
- Risks: existing historical answers with removed old card IDs remain historical profile rows; this fix targets the schema failure that blocked current Level/Section reflection saves.
- Follow-up: no immediate follow-up required.
