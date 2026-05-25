# T-013 — Stage 2 verification and PR polish

Status: done
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/stage-2-backend-mvp

## Goal

Finish Stage 2 verification, document local startup, and prepare the draft PR.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/done/T-010-stage-2-backend-adr.md`
- `harness/tasks/done/T-011-stage-2-backend-api.md`
- `harness/tasks/done/T-012-frontend-api-migration.md`
- `docs/engineering/contributing.md`
- `README.md`
- current implementation diff

## Intended write set

- `README.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- this task file
- focused fixes from security/content/browser review, if needed

## Out-of-scope

- New product scope
- Broad refactors
- Production hardening beyond ADR-0006 baseline

## Plan

1. Run read-only security/auth and content/API contract review.
2. Run `npm run verify`.
3. Start dev server and perform browser smoke, including 360px viewport.
4. Update README and harness with verification evidence.
5. Commit polish changes, push branch, and open draft PR.

## Checks

- [x] `npm run verify`
- [x] security/auth review
- [x] content/API contract review
- [x] browser smoke

## Result packet

- Files changed: `README.md`, `server/lib/password.ts`, `server/modules/auth/routes.ts`, `server/app.test.ts`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `harness/tasks/done/T-013-stage-2-verification-pr-polish.md`
- Checks run: `npm run verify`; security/auth review; content/API contract review.
- Browser smoke: live `npm run dev` passed register, content navigation overview -> module -> unit -> lesson, card interaction, DB progress persistence check, logout, console error check, and 360px overflow check. Screenshot: `/tmp/finpulse-stage2-360.png`.
- Risks: ADR-0006 still defers production rate limiting, CSRF hardening beyond sameSite cookies, password reset/email/OAuth, deployment secret policy, and persisted freeform answer policy.
- Follow-up: Open draft PR.
