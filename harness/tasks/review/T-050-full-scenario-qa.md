# T-050 — Full Scenario QA

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Completed: 2026-05-31
Branch/worktree: current workspace

## Goal

Run the scenario QA map from `docs/QA_USER_SCENARIO_MAP.md`, capture evidence, fix confirmed bugs with minimal changes, and report verified coverage.

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

## Intended write set

Initial testing/orchestration:
- `harness/tasks/active/T-050-full-scenario-qa.md`
- `harness/tasks/review/T-050-full-scenario-qa-artifacts/**`
- `harness/WORKBOARD.md`

Fix write set:
- `src/api/client.ts`
- `src/App.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- `src/App.test.tsx`
- `harness/tasks/review/T-050-full-scenario-qa.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- No MVP scope expansion: diagnostics, rewards, recommendations, analytics, full account cabinet, backend/admin, payments.
- No content JSON edits.
- No broad architecture rewrites.
- Do not revert unrelated review-stack changes already present in the working tree.

## Result packet

- Files changed:
  - `src/api/client.ts`
  - `src/App.tsx`
  - `src/pages/ProgramOverviewPage.tsx`
  - `src/App.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-050-full-scenario-qa.md`
  - `harness/tasks/review/T-050-full-scenario-qa-artifacts/**`
- Checks run:
  - Browser QA on `http://127.0.0.1:5174/` with backend `127.0.0.1:3001`
  - M-390 registration -> program -> module dialog -> full first lesson -> profile -> refresh -> logout/back privacy
  - D-1440 returning login, sidebar shell, route refresh, second-user privacy
  - M-360 overflow sweep for auth, module path, lesson reader, profile
  - M-390 full current module traversal through all 15 lessons
  - API smoke with `curl` for public content, protected 401, reflection validation, unknown lesson, and CORS PUT preflight
  - `npm run test:run -- src/App.test.tsx src/features/auth/AuthControls.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx server/app.test.ts`
  - `npm run verify`
- Scenarios tested:
  - Covered P0 auth/session, registration/login/logout, authenticated shell, program/module path, lesson reader/card types, progress persistence, profile/private answers, two-user privacy, API protections, routing errors, M-360/M-390/D-1440 responsive smoke, and full current module traversal.
- Bugs found and fixed:
  - `PROGRESS-10/11`: required completed progress writes no longer fail open.
  - `PROGRESS-09`: progress/reflection 401 now clears authenticated/private state.
  - `LOGIN-07/API-09`: non-JSON error responses now show a generic readable error.
  - `PROGRAM-05`: empty program module list now renders an empty state.
- Screenshots:
  - `harness/tasks/review/T-050-full-scenario-qa-artifacts/`
- Risks:
  - Subagents A-E were blocked by sandbox server startup; orchestrator covered their P0 browser areas after escalated local server startup.
  - Some P1 synthetic API/error scenarios remain covered by regression tests/code review rather than live Browser interception.
  - Browser post-fix auth typing and screenshot capture hit an in-app browser virtual clipboard/screenshot runtime issue; post-fix rendered DOM smoke still passed with no console errors.
