# T-132 — Inline lesson completion

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: current workspace

## Goal

Fold the ordinary lesson-completion moment into the final summary card so saving the Navigator result and seeing "lesson complete" feels like one action, not two screens.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/METHODOLOGY.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `react-best-practices` skill
- `frontend-testing-debugging` skill

## Intended write set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-132-inline-lesson-completion.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime JSON/content changes.
- New backend, account, diagnostic, reward, analytics, or recommendation scope.
- Broad lesson-reader redesign beyond the completion transition.

## Plan

1. Replace the separate completion screen with a final-card completed state.
2. Keep lesson/card progress saves and error handling unchanged.
3. Update tests around final summary, next-lesson actions, and app flow.
4. Run focused verification and browser smoke.

## Checks

- [ ] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run verify`
- [x] browser smoke for final lesson completion

## Result packet

- Files changed: `src/features/lesson-reader/LessonSession.tsx`, `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: focused lesson/App tests; typecheck; lint; build; plain `npm run verify` attempted and failed only because no backend test DB URL was set; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify` passed; in-app Browser 390x844 full lesson completion smoke passed; in-app Browser 973x844 geometry/console smoke passed.
- Risks: the browser smoke used the currently running local dev server and authenticated session; visual QA covered the active first lesson path only.
- Follow-up: none for this task.
