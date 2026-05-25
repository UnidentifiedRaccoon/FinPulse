# T-010 — Stage 2 backend ADR

Status: done
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/stage-2-backend-mvp

## Goal

Decide whether and how FinPulse should introduce a lightweight backend for the next stage before any backend implementation starts.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/engineering/contributing.md`

## Intended write set

- `docs/DECISIONS.md`
- `docs/ARCHITECTURE.md`, only if the accepted ADR changes current architecture guidance
- `docs/PRODUCT.md`, only if backend/auth changes accepted MVP wording
- `docs/CONTENT_MODEL.md`, only if backend API/progress references content contracts
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Out-of-scope

- Backend implementation
- Frontend API integration
- Auth/account system implementation
- Diagnostics as a product system
- Rewards/gamification
- Analytics dashboards
- Migration away from Vite SPA

## Decision questions

1. Should Stage 2 introduce a Fastify backend?
2. Should SQLite be the initial persistence layer?
3. What state is backend-owned: reading progress, answers, artifacts, session/device identity?
4. Does Stage 2 require auth, anonymous session ids, or no identity yet?
5. Does content remain bundled JSON in the frontend, or move behind an API later?
6. Which database access layer is preferred: raw `better-sqlite3`, Drizzle, Kysely, or another option?
7. What API contract should frontend work target first?

## Checks

- [x] ADR added or updated
- [x] Architecture docs updated if the ADR changes implementation guidance
- [x] Product/content docs updated for Stage 2 scope and API policy
- [x] No backend code added before ADR
- [x] `npm run verify`

## Result packet

- Files changed: `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, `docs/CONTENT_MODEL.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `harness/tasks/done/T-010-stage-2-backend-adr.md`
- Decision: ADR-0006 accepts a narrow Stage 2 Fastify + SQLite backend for learner identity, httpOnly cookie sessions, saved viewed/completed progress, and read-only content API from canonical JSON. Full cabinets, diagnostics, analytics, rewards, admin/CMS, OAuth/email flows, and persisted freeform answers remain out of scope.
- Checks run: `npm run verify`
- Risks: Stage 2 auth is intentionally minimal; production hardening, rate limiting, password reset, and persisted freeform answer policy remain deferred.
- Follow-up: implement T-011 backend API after this ADR gate, then T-012 frontend API migration.
