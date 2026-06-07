# T-101 — Cleanup audit findings

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: current workspace

## Goal

Remove confirmed dead, experiment-only, stale, and redundant project code found by the audit, while keeping the mascot component and mascot assets.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- audit results from five read-only explorer agents

## Intended write set

- `src/App.tsx`
- `src/App.test.tsx`
- `src/pages/LessonBlockVariantsPage.tsx`
- `src/pages/PracticeCardVariantsPage.tsx`
- `src/content/loadProgram.ts`
- `src/content/selectors.ts`
- `src/content/program.ts`
- `src/content/order.ts` or equivalent pure helper module
- `src/test/**`
- `src/features/program-navigation/{CurrentStepCta,PathProgressSummary,PathStepNode}.tsx`
- corresponding Storybook stories for removed-only components
- `server/db/index.ts`
- `server/db/usersRepository.ts`
- `server/modules/content/contentService.ts`
- `package.json`
- `package-lock.json`
- `.dockerignore`
- `scripts/verify.sh`
- `src/features/lesson-reader/card-renderers/{CategorizationCard,MultiSelectCard}.stories.tsx`
- unused brand artifacts
- `docs/QA_USER_SCENARIO_MAP.md`
- `docs/CONTENT_MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `README_HARNESS.md`
- `package.scripts.snippet.json`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Explicitly preserved

- `src/shared/ui/Mascot.tsx`
- `public/assets/mascot/**`

## Out-of-scope

- T-100 content flow changes except where tests need to stop referencing removed design routes.
- Backend API contract changes beyond removing unused helpers.
- Product scope changes.

## Plan

1. Remove production design preview routes/pages and their tests.
2. Move the legacy direct content loader to test-only helpers.
3. Delete unused selectors, server barrel, unused story-only navigation components, and unused dependency metadata.
4. Add ignored local data artifacts to Docker context ignores and remove stale local SQLite.
5. Update stale docs/harness records.
6. Run verification commands and record results.

## Checks

- [x] `npm run check:content`
- [x] `npm run check:runtime-imports`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test:run`
- [x] `npm run build`
- [x] `npm run build:storybook`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`

## Result packet

- Files changed: removed `/design/lesson-block-variants` and `/design/practice-card-variants` runtime routes/pages; removed story-only navigation components and stale direct content loader/selectors/server barrel; moved test loader to `src/test`; split pure content ordering helpers into `src/content/order.ts`; removed unused repository/content-service methods, unused `zustand`, stale scaffold snippet, obsolete wordmark/source brand artifacts, and local sqlite data; updated Docker ignore, verify, Storybook coverage, and stale docs.
- Checks run: `npm run check:content`; `npm run check:runtime-imports`; `npm run typecheck`; `npm run lint`; focused frontend/content tests; `npm run build`; `npm run build:storybook`; full `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`.
- Risks: first plain backend/full test attempts failed because no DB env/database existed; local PostgreSQL was available, so `finpulse_test` was created with documented local credentials and the full verify then passed. Storybook still emits its existing non-fatal `unable to find package.json for radix-ui` warning.
- Follow-up: historical review-task notes still mention removed experiment pages as an audit trail; current runtime routes no longer expose them.
