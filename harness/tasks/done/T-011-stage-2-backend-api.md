# T-011 — Stage 2 backend API

Status: done
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/stage-2-backend-mvp

## Goal

Implement the minimal Fastify + SQLite backend accepted by ADR-0006.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/done/T-010-stage-2-backend-adr.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/DECISIONS.md`
- `docs/engineering/contributing.md`
- `package.json`
- `src/content/**`

## Intended write set

- `server/**`
- backend tests
- `package.json`
- lockfile
- `.env.example`
- `.gitignore`
- `tsconfig*.json` and `vite.config.ts` only as needed for backend tests/typecheck

## Out-of-scope

- Frontend API migration
- Broad UI refactors
- Persisted freeform reflection/artifact answers
- Diagnostics/scoring/analytics
- Admin/CMS
- OAuth/email/password reset

## Plan

1. Add Fastify, cookie/session, password hashing, SQLite, and backend test tooling.
2. Add deterministic SQLite schema/migration and configurable DB path.
3. Implement health, auth, content, and progress routes.
4. Add integration tests for auth/session/progress/content contracts.
5. Update verification scripts if needed.

## Checks

- [x] `npm run verify`
- [x] backend auth/content/progress tests

## Result packet

- Files changed: `.env.example`, `.gitignore`, `eslint.config.js`, `package.json`, `package-lock.json`, `tsconfig.node.json`, `server/**`, `harness/WORKBOARD.md`, `harness/tasks/done/T-011-stage-2-backend-api.md`
- API routes added: `GET /api/health`, auth register/login/logout/me, content program/modules/module/unit/lesson, authenticated progress get/put lesson/card.
- DB schema summary: `users`, `sessions`, `lesson_progress`, and `card_progress` with foreign keys and per-user progress primary keys.
- Checks run: `npm run verify`
- Risks: Auth is local-MVP only; production hardening, rate limits, CSRF beyond same-site cookies, password reset, and deployment secrets remain deferred by ADR-0006.
- Follow-up: T-012 frontend API migration.
