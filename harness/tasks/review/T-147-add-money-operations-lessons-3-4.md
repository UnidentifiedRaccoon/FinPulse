# T-147 — Add Money Operations Lessons 3 And 4

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-15
Moved to review: 2026-06-15
Branch/worktree: current workspace

## Goal

Add the two methodologist-provided Level 1 Section 1 lessons to the active
money-and-operations runtime content: У1.3 «Безопасный платёж» and У1.4
«Цифровой след и защита».

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

Google Docs TXT exports were downloaded to `/tmp` only:

- `/tmp/finpulse_lesson3_safe_payment.txt`
- `/tmp/finpulse_lesson4_digital_footprint.txt`

## Intended write set

- `docs/levels/level-1-start/sections/money-and-operations/lesson_03_safe-payment.md`
- `docs/levels/level-1-start/sections/money-and-operations/lesson_04_digital-footprint-and-protection.md`
- `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`
- `src/App.test.tsx`
- `server/app.test.ts`
- `server/content-contract.test.ts`
- `docs/QA_USER_SCENARIO_MAP.md`
- `harness/tasks/active/T-147-add-money-operations-lessons-3-4.md`
- `harness/tasks/review/T-147-add-money-operations-lessons-3-4.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content model, schema, validator, API route, backend persistence, or UI
  behavior changes.
- Diagnostics, scoring, rewards, analytics, recommendations, reminders,
  backend/admin/CMS scope, or new card types.
- Reverting stacked T-141 through T-146 working-tree changes.

## Result

- Added normalized source Markdown for У1.3 `safe-payment` and У1.4
  `digital-footprint-and-protection`, preserving the methodologist screen tables
  and the У1.4 source bridge to Раздел 2.
- Added both lessons to the active `money-and-operations` section JSON with 8
  cards each, source-backed `ctaLabel` values on screens 1-7, statistics only on
  screen 4, updated `sourceSection` paths, and no new card types.
- Updated the У1.2 summary bridge so runtime now points to У1.3.
- Adapted the У1.4 runtime summary to close the currently available section
  while keeping the author bridge in source Markdown.
- Updated frontend/backend/content tests and the QA map for four active lesson
  entries and the new `previous`/`next` chain.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run test:run -- src/App.test.tsx src/content/program.test.ts`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] Runtime structural audit for new lesson ids, 8-card count, CTAs,
  statistics placement, source paths, and У1.2 bridge
- [ ] `npm run test:run -- server/content-contract.test.ts server/app.test.ts`
  - Blocked locally by missing `FINPULSE_TEST_DATABASE_URL`,
    `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- [ ] `npm run verify`
  - Not run because this shell has no PostgreSQL test database URL; the backend
    tests are a known local precondition.
- [ ] Browser smoke on the section route and both new lesson routes
  - Blocked locally: in-app Browser failed with `native pipe is closed`;
    Playwright CLI was available but the cached browser executable was missing,
    and no system Chrome/Chromium was available.

## Result packet

- Files changed: source Markdown for У1.3/У1.4, active section JSON, App/API
  tests, QA map, and harness state.
- Checks run: content validator, focused App/content tests, typecheck, lint,
  backend test attempt, structural lesson audit, browser-tool fallback attempts.
- Risks: backend/content tests and rendered browser smoke still need a local
  PostgreSQL test URL and working browser runtime or Playwright browser cache.
- Follow-up: run full `npm run verify` plus 390px browser smoke in an environment
  with `FINPULSE_TEST_DATABASE_URL` and a working browser runner.
