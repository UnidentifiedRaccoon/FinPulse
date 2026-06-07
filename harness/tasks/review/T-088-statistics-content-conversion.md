# T-088 — Statistics content conversion

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: current workspace

## Goal

Make methodologist "Блок статистики" sections a first-class runtime JSON field so future lesson adaptation does not silently drop statistics.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- current T1 source Markdown and runtime unit JSON

## Intended write set

- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/content/program.ts`
- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `src/features/lesson-reader/**`
- focused tests under `src/features/lesson-reader/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Out-of-scope

- New backend routes or persistence.
- Diagnostics, scoring, analytics, recommendations, or personal financial advice.
- A CMS/importer rewrite.

## Plan

1. Add a structured optional card-level `statistics` field to schema, zod model, and manual validator.
2. Render statistics consistently inside lesson cards.
3. Move statistics from the four current source Markdown screen 4 sections into runtime JSON.
4. Document the mandatory authoring conversion rule.
5. Run content validation and focused verification.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- [x] Browser smoke on fresh temporary dev pair `127.0.0.1:3002` / `127.0.0.1:5175`

Note: plain `npm run verify` failed first because this shell had no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`; the repeat with the standard local PostgreSQL URL passed.
The already-running `127.0.0.1:3001` backend had loaded old content before this task, so the Browser smoke used a fresh temporary backend/frontend pair and then stopped it.

## Result packet

- Files changed: content model docs, authoring docs, content schema/manual validator, zod content model, lesson reader shared renderer/test, and current T1 unit JSON statistics fields.
- Checks run: content validation, focused lesson-reader test, typecheck, lint, build, full verify with local PostgreSQL URL, Browser smoke at 390px.
- Risks: future source-detection guard depends on `sourceSection` using the existing `docs/...md / Экран N` format.
- Follow-up: if authoring source format changes, update `sourceSectionRequiresStatistics` in `scripts/check-content-json.mjs`.
