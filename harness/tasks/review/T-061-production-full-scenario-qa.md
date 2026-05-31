# T-061 — Production Full Scenario QA

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-01
Completed: 2026-06-01
Branch/worktree: current workspace

## Goal

Run the `docs/QA_USER_SCENARIO_MAP.md` scenarios against the production FinPulse deployment, capture evidence, classify bugs, and only make minimal fixes if confirmed production bugs require code changes.

Production target:
- App URL: `https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net/`
- Backend wake endpoint: `POST https://functions.yandexcloud.net/d4e0o3h9gnq59inscpns`

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/QA_USER_SCENARIO_MAP.md`
- `harness/tasks/review/T-050-full-scenario-qa.md`

## Intended write set

Initial testing/orchestration:
- `harness/tasks/review/T-061-production-full-scenario-qa.md`
- `harness/tasks/review/T-061-production-full-scenario-qa-artifacts/**`
- `harness/WORKBOARD.md`

Fix write set for confirmed production privacy bug:
- `server/app.ts`
- `server/app.test.ts`
- `server/modules/auth/routes.ts`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/index.css`
- `src/pages/ModulePage.tsx`
- `src/pages/LessonPage.tsx`
- `src/pages/UnitPage.tsx`
- `harness/tasks/review/T-061-production-full-scenario-qa.md`
- `harness/tasks/review/T-061-production-full-scenario-qa-artifacts/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Do not expand MVP scope: diagnostics, rewards, recommendations, analytics, full account cabinet, backend/admin, payments.
- Do not edit content JSON unless a production blocker proves it is necessary.
- Do not change production infrastructure unless production is blocked and the change is explicitly scoped here first.
- Do not reveal secrets or credential payloads in reports or artifacts.

## Orchestration Split

- Agent A: auth/session/logout/entry.
- Agent B: program/module/unit navigation and route behavior.
- Agent C: lesson reader and card types.
- Agent D: progress persistence, private answers, profile, privacy isolation.
- Agent E: responsive, screenshots, accessibility, keyboard, overflow.
- Agent F: API/error-state validation and regression checks.

## Checks

- [x] Production wake/readiness smoke.
- [x] Browser QA on production M-390 and D-1440 P0 flows.
- [x] M-360 overflow sweep for auth/module/lesson/profile.
- [x] API protected-route and validation smoke.
- [x] Full current module traversal.
- [x] Focused regression tests for fixed areas.
- [x] `npm run verify` with temporary local PostgreSQL.

## Result packet

- Files changed:
  - `server/app.ts`
  - `server/app.test.ts`
  - `server/db/reflectionAnswersRepository.ts`
  - `server/modules/auth/routes.ts`
  - `server/modules/reflections/routes.ts`
  - `src/App.tsx`
  - `src/App.test.tsx`
  - `src/index.css`
  - `src/pages/LessonPage.tsx`
  - `src/pages/ModulePage.tsx`
  - `src/pages/UnitPage.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-061-production-full-scenario-qa*`
- Checks run:
  - Production wake: `POST https://functions.yandexcloud.net/d4e0o3h9gnq59inscpns`
  - Production smoke: `/api/health`, `/api/readyz`
  - Browser/plugin attempt, then headless system Chrome/Playwright fallback for screenshots and viewport matrix
  - Subagent production passes A-F
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test:run -- server/app.test.ts src/App.test.tsx src/App.logout.test.tsx src/features/auth/AuthControls.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `npm run verify` with temporary local PostgreSQL
- Scenarios tested:
  - Covered all P0 auth/session/logout, registration/login, shell, program/module/unit routing, lesson reader/cards, progress persistence, private answers/profile, two-user privacy, API boundaries, responsive M-360/M-390/M-430/D-1024/D-1440, keyboard, and full 15-lesson traversal.
- Bugs found and fixed:
  - High `ROUTE-01`: logout followed by browser Back could restore cached private profile UI.
  - High `PROFILE-03`: artifact/template profile rows lost content labels and fell back to `Строка N`.
  - Medium `LOGOUT/API`: `POST /api/auth/logout` with `Content-Type: application/json` and empty body returned 500 instead of clearing session.
  - Medium `A11Y-07`: key token contrast missed 4.5:1 for normal text.
  - Low `LESSON-07`: invalid lesson route attempted a viewed-progress write before lesson load succeeded.
  - Low `A11Y-10`: a few compact navigation targets were 40px instead of the 44px comfort target.
  - Low `REG-05/06`: invalid registration message was misleadingly generic.
- Screenshots:
  - `harness/tasks/review/T-061-production-full-scenario-qa-artifacts/`
- Blocked scenarios:
  - Production-unsafe fixture/fault injection remained blocked where it would require mutating production content, forcing API/DB outage, or serving malformed payloads.
- Risks:
  - Production QA created test learner accounts and persisted QA progress/reflection rows.
  - In-app Browser screenshot capture timed out; screenshots were captured through headless system Chrome fallback.
  - Anonymous direct content routes currently show the auth entry screen; privacy is safe, but this should be clarified against the product principle if anonymous reading is still required.
