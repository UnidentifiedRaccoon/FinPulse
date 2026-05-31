# T-052 — PostgreSQL persistence migration

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: local workspace

## Goal

Migrate backend persistence from SQLite/better-sqlite3 to PostgreSQL while preserving the current API contract, MVP product boundaries, and JSON content source-of-truth.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

T-048 is in review, not active. Its reflection answer API and storage shape must be preserved.

## Intended write set

- `docs/DECISIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `README.md`
- `.env.example`
- `.github/workflows/verify.yml`
- `package.json`
- `package-lock.json`
- `server/app.ts`
- `server/app.test.ts`
- `server/index.ts`
- `server/db/**`
- `server/lib/sessions.ts`
- `server/modules/auth/**`
- `server/modules/progress/**`
- `server/modules/reflections/**`
- `harness/tasks/active/T-052-postgres-persistence-migration.md`
- `harness/tasks/review/T-052-postgres-persistence-migration.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- YC resource provisioning, Terraform, Container Registry setup, or deploying infrastructure.
- Frontend changes unless required to preserve the existing API contract.
- Content JSON changes.
- Accounts/admin/CMS/analytics/rewards/diagnostics/personalized recommendations.
- Any temporary SQLite fallback unless it is explicitly documented and requested.

## Plan

1. Document the PostgreSQL decision and deployment implications.
2. Introduce an async PostgreSQL DB boundary with a small repository layer.
3. Replace the SQLite schema bootstrap with PostgreSQL migrations.
4. Move auth/session/progress/reflection routes to async repository calls.
5. Update local dev docs, env examples, and CI PostgreSQL service.
6. Run focused backend tests and `npm run verify`.

## Checks

- [ ] focused backend tests
- [x] focused backend tests
- [x] `npm run verify`
- [x] no `better-sqlite3` runtime dependency/imports remain
- [x] CI has PostgreSQL available for DB tests

## Result packet

- Files changed:
  - `docs/DECISIONS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DEVELOPMENT.md`
  - `README.md`
  - `.env.example`
  - `.github/workflows/verify.yml`
  - `package.json`
  - `package-lock.json`
  - `server/db/**`
  - `server/app.ts`
  - `server/index.ts`
  - `server/lib/sessions.ts`
  - `server/modules/auth/routes.ts`
  - `server/modules/progress/routes.ts`
  - `server/modules/reflections/routes.ts`
  - `server/app.test.ts`
  - `server/content-contract.test.ts`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - `npm run typecheck -- --pretty false` — passed
  - `npm run lint` — passed
  - manual PostgreSQL API smoke — passed: migrations created the expected tables; two users registered; password hash stored; session, lesson progress, card progress, and reflection answer persisted; second user could not see first user's state; persisted session/progress/reflection survived a new app instance against the same schema
  - `FINPULSE_TEST_DATABASE_URL=postgres://elena@127.0.0.1:55432/postgres_test npm run test:run -- server/app.test.ts server/content-contract.test.ts` — passed
  - `FINPULSE_TEST_DATABASE_URL=postgres://elena@127.0.0.1:55433/finpulse_smoke npm run verify` — passed
  - `rg` check for runtime `better-sqlite3`/`FINPULSE_DB_PATH`/SQLite imports — passed
- Risks:
  - Existing local SQLite data is not migrated automatically.
  - Local backend tests now need PostgreSQL availability; CI provides it.
  - Pool sizing and production secret/network configuration remain future deployment work.
- Follow-up:
  - Provision Yandex Managed PostgreSQL, Lockbox/env injection, Container Registry, and Serverless Containers only in a later explicit infrastructure task.
