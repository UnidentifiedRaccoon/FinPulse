# T-012 — Frontend API migration

Status: done
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/stage-2-backend-mvp

## Goal

Migrate rendered frontend data from direct runtime content imports to the Stage 2 backend API, and add minimal auth/progress UI.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/done/T-010-stage-2-backend-adr.md`
- `harness/tasks/done/T-011-stage-2-backend-api.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/DECISIONS.md`
- `src/pages/**`
- `src/content/**`
- `src/features/lesson-reader/**`
- `server/**`

## Intended write set

- `src/**`
- focused frontend tests
- `vite.config.ts`
- `harness/WORKBOARD.md`
- this task file

## Out-of-scope

- Backend schema/auth contract changes unless frontend verification exposes a bug
- Broad UI redesign
- Persisted freeform reflection/artifact answers
- Diagnostics/scoring/analytics

## Plan

1. Add typed API client and async query hook.
2. Update app shell/routes to load content through `/api/**`.
3. Add minimal register/login/logout controls.
4. Wire lesson open/card interactions to progress API for authenticated users.
5. Add focused frontend tests.

## Checks

- [x] `npm run verify`
- [ ] browser smoke after dev server startup

## Result packet

- Files changed: `src/**`, `vite.config.ts`, `harness/WORKBOARD.md`, `harness/tasks/done/T-012-frontend-api-migration.md`
- User flows changed: pages fetch program/module/unit/lesson data from backend API; header exposes minimal register/login/logout; authenticated lesson/card interactions write viewed/completed progress.
- Checks run: `npm run verify`
- Risks: Browser smoke still pending in T-013; freeform reflection/artifact answers remain transient by ADR.
- Follow-up: T-013 browser smoke, security/content contract review, docs polish, PR.
