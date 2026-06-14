# T-139 — Internal admin progress board

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: main

## Goal

Add the first read-only internal curator board for all learner progress as a separate Next.js admin surface, without migrating the learner Vite SPA.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `.gitignore`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/engineering/contributing.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

User decisions:
- admin app location: `apps/admin`
- first deployment stance: local development surface now; future Yandex-hosted deployment TBD
- first auth stance: separate admin login with exactly one env-configured admin
- curators may see user login/email
- reflection/artifact answer text must not be shown by default

## Intended write set

- `docs/DECISIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/PRODUCT.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-139-internal-admin-progress-board.md`
- `harness/tasks/review/T-139-internal-admin-progress-board.md`
- `package.json`
- `package-lock.json`
- `.env.example`
- `server/app.ts`
- `server/app.test.ts`
- `server/db/connection.ts`
- `server/db/adminReadModelRepository.ts`
- `server/lib/adminSession.ts`
- `server/modules/admin/**`
- `apps/admin/**`

## Out-of-scope

- Organizations, tenants, RBAC, invitations, and curator access policies.
- Showing or reviewing reflection/artifact answer text.
- Analytics dashboards beyond progress aggregates.
- Content editing/CMS.
- Migrating the learner app from Vite to Next.js.
- Production deployment wiring for admin.

## Plan

1. Record ADR-0010 for the separate Next.js internal admin surface.
2. Add backend admin session/auth and protected read-only admin progress endpoints.
3. Add `apps/admin` Next.js UI with login, aggregate cards, users table/search, resizable split detail view, and sticky table reading controls.
4. Add focused backend/frontend tests for auth, aggregation, privacy, rendering, and future org-filter note.
5. Update architecture/product/state docs.
6. Run typecheck, lint, relevant tests, build, and verify if PostgreSQL is available.

## Checks

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] backend admin tests
- [x] frontend admin tests
- [x] `npm run build`
- [x] `npm run verify`, if PostgreSQL is available

## Result packet

- Files changed: `docs/{DECISIONS,ARCHITECTURE,DEVELOPMENT,PRODUCT}.md`, `.env.example`, `package*.json`, `eslint.config.js`, `server/{app.ts,app.test.ts}`, `server/db/{connection.ts,adminReadModelRepository.ts}`, `server/lib/adminSession.ts`, `server/modules/{admin,content}/**`, `apps/admin/**`, `harness/**`.
- Checks run: `npm run typecheck`; `npm run lint`; `npm run test:admin`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run`; `npm run build`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`.
- Browser QA: in-app Browser login -> dashboard -> user detail passed on `http://localhost:3002`; desktop and 390x844 DOM/geometry checks passed with no console errors/warnings and no private answer text. Follow-up admin UI smoke verified resizable split behavior: keyboard resize, drag resize, persisted width after reload, sticky table header/login column after horizontal/vertical scroll, and collapse on close. Browser screenshot capture timed out twice on the initial admin pass but succeeded in the follow-up split-view smoke.
- Risks: admin is global all-users and local-first only; single env-configured admin has no rate limiting, audit log, organization filtering, or RBAC; curator-visible login/email is PII; future Yandex deployment needs a separate topology/security decision.
- Follow-up: decide production/Yandex admin hosting, secret injection, org/RBAC schema, and whether answer-text review will ever be a separate explicit scope.
