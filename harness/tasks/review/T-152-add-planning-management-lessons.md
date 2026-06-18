# T-152 — Add Planning Management Lessons

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-18
Branch/worktree: current workspace

## Goal

Add Level 1 Section 2 `planning-and-management` with the four
methodologist-provided lessons У1.5-У1.8.

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
- `docs/engineering/contributing.md`

Google Docs TXT exports were downloaded to `/tmp` only:

- `/tmp/finpulse_u1_5_why_reserve_matters.txt`
- `/tmp/finpulse_u1_6_reserve_target_amount.txt`
- `/tmp/finpulse_u1_7_pay_yourself_first.txt`
- `/tmp/finpulse_u1_8_budget_draft.txt`

## Intended write set

- `docs/levels/level-1-start/sections/planning-and-management/*.md`
- `src/content/levels/level_1_start/level.json`
- `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`
- `src/content/levels/level_1_start/sections/section_02_planning_and_management.json`
- `src/App.test.tsx`
- `server/app.test.ts`
- `server/content-contract.test.ts`
- `docs/QA_USER_SCENARIO_MAP.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- this task file

## Out-of-scope

- Runtime schema, validator, renderer, API route, persistence, auth, admin, or UI behavior changes.
- Reintroducing legacy `why-emergency-fund` / `reserve-amount` runtime slugs.
- Diagnostics, scoring, reminders, recommendations, analytics, backend/CMS, or new card types.

## Plan

1. Preserve normalized source Markdown for four lessons.
2. Add the Section 2 ref and runtime JSON with four Level 1 eight-card lessons.
3. Update section/lesson route expectations and legacy-removed assertions.
4. Run content validation and focused verification.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx src/content/program.test.ts src/features/program-navigation/learningPath.test.ts`
- [x] `npm run test:run -- server/app.test.ts`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke on new section and lessons
  - Passed at 390px for `/levels/level-1-start`,
    `/levels/level-1-start/sections/planning-and-management`,
    `/lessons/why-reserve-matters`, `/lessons/reserve-target-amount`,
    `/lessons/pay-yourself-first`, and `/lessons/budget-draft`.
  - Used Vite plus a temporary read-only content/auth/progress/reflection API
    stub because the normal local Fastify dev server requires PostgreSQL.

## Result packet

- Files changed:
  - Added normalized source Markdown for four У1.5-У1.8 lessons under
    `docs/levels/level-1-start/sections/planning-and-management/`.
  - Added runtime Section 2 JSON and the Level 1 section ref.
  - Updated У1.4 summary bridge, content/API/frontend tests, QA map,
    content backlog, project state, and workboard.
- Checks run:
  - `npm run check:content` — pass.
  - `npm run test:run -- src/App.test.tsx src/content/program.test.ts src/features/program-navigation/learningPath.test.ts` — pass, 48 tests.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run test:run -- server/app.test.ts` — pass, 15 tests.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify` — pass.
  - `npm run lint` — pass.
  - `npm run typecheck` — pass.
  - `npm run build` — pass.
  - Browser smoke at 390px — pass with temporary API stub.
- Risks:
  - Backend integration tests still need a PostgreSQL test database URL in
    shells without local PostgreSQL.
- Follow-up:
  - Re-run GitHub Verify after pushing the test expectation fix.
