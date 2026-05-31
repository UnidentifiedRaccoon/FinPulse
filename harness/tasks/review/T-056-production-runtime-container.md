# T-056 — Production runtime container

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: main working tree

## Goal

Make the Fastify backend suitable for single-container production deployment with health/readiness separation, predictable startup migrations, and SPA static serving.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/engineering/contributing.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `server/app.ts`
- `server/app.test.ts`
- `server/db/connection.ts`
- `server/db/migrate.ts`
- `.env.example`
- `package.json`
- `package-lock.json`
- `tsconfig.node.json`
- `vite.server.config.ts`
- `Dockerfile`
- `.dockerignore`
- `.gitignore`
- `eslint.config.js`
- `harness/tasks/review/T-056-production-runtime-container.md`

## Out-of-scope

- New product features.
- Backend scope expansion beyond deployment/runtime behavior.
- Frontend UI changes.

## Plan

1. Add `/api/readyz` DB readiness while keeping `/api/health` DB-free.
2. Add optional SPA static serving for production single-container deploy.
3. Add server build and Docker artifact definition.
4. Add focused tests.

## Checks

- [x] Focused backend tests.
- [x] `npm run typecheck`
- [x] `npm run build`
- [ ] Docker build if local Docker is available. Blocked locally because the Docker daemon was not running.

## Result packet

- Files changed: `server/app.ts`, `server/app.test.ts`, `server/db/connection.ts`, `server/db/migrate.ts`, `.env.example`, `package.json`, `tsconfig.node.json`, `vite.server.config.ts`, `Dockerfile`, `.dockerignore`, `.gitignore`, `eslint.config.js`, `harness/tasks/review/T-056-production-runtime-container.md`
- Checks run: `npm run typecheck`; `npm run lint`; `npm run build`; `npm run build:server`; `npm run build:container`; full `npm run verify` with temporary local PostgreSQL; compiled production server smoke for `/api/health`, `/api/readyz`, and `/`. Local `docker build` was not run because the Docker daemon was unavailable.
- Resource IDs touched: none.
- Risks: startup migrations remain an idempotent `schema.sql` bootstrap rather than a versioned migration ledger.
- Follow-up: consider versioned migrations before larger schema evolution.
