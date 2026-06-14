# T-125 — Rename T1 marker to Level 1

## Status

review

## Goal

Remove `T1` from active learner-facing content and active runtime/API naming.
Use `Уровень 1` / `Старт` for display and move active technical slugs/paths to
`level-1-start` / `level_1_start`, with `L1` as the short internal lesson tag.

## Intended Write Set

- `src/content/**`
- `docs/levels/**`
- `scripts/check-content-json.mjs`
- `src/App.test.tsx`
- `server/app.test.ts`
- `server/content-contract.test.ts`
- `src/features/**` stories or display helpers if needed
- active methodology/content docs and prompts:
  `docs/CONTENT_MODEL.md`, `docs/methodology/AUTHORING.md`,
  `docs/methodology/CONTENT_BACKLOG.md`, `docs/QA_USER_SCENARIO_MAP.md`,
  `harness/prompts/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Non-Goals

- Do not rewrite historical task records that mention old `T1` or `t1-start`.
- Do not add redirect compatibility for old `/levels/t1-start` unless tests or
  existing route policy require it.
- Do not change lesson/card behavior or content copy unrelated to the marker.

## Plan

1. Rename active runtime/source paths and JSON IDs/slugs/tags.
2. Update validator/test/doc references from T1 to Level 1 / L1.
3. Run content validation and focused tests.
4. Update harness state and move this task to review.

## Result

- Renamed the active level slug/path from `t1-start` / `t1_start` to
  `level-1-start` / `level_1_start`.
- Updated the active display title to `Уровень 1 · Старт`; overview cards still
  display the learner-facing title as `Старт` with the existing `Уровень 1`
  badge.
- Replaced active technical ids/tags from `T1`-based names to `L1`-based names:
  `level_1_start`, `section_l1_s1_*`, `lesson_l1_s1_l*`, `card_l1s1l*`, and
  `L1`.
- Updated active source Markdown paths, content docs, methodology authoring
  notes, QA map, harness prompts, validators, API tests, and frontend tests.
- Kept old `T1`/`t1-start` references in historical review task notes only.

## Checks

- `npm run check:content` passed.
- `npm run check:runtime-imports` passed.
- `npm run test:run -- src/App.test.tsx src/content/program.test.ts` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- `npm run verify` reached backend tests after content/runtime/typecheck/lint and
  failed only because this shell has no `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
