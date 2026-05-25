# T-010 — Stage 2 backend ADR

Status: planned
Owner: unassigned
Model: GPT-5.5 / xhigh
Started: TBD
Branch/worktree: docs/t010-stage-2-backend-adr

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

- [ ] ADR added or updated
- [ ] Architecture docs updated if the ADR changes implementation guidance
- [ ] No backend code added
- [ ] `npm run verify`

## Result packet

- Files changed:
- Decision:
- Checks run:
- Risks:
- Follow-up:
