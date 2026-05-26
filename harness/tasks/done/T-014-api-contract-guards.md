# T-014 — API contract guards

Status: done
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: test/api-contract-guards

## Goal

Add small contract-safety checks after Stage 2 backend merge.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/CONTENT_MODEL.md`
- `docs/DECISIONS.md`
- `docs/engineering/contributing.md`
- `src/content/program.ts`
- `server/modules/content/**`
- `src/api/client.ts`
- rendered app code under `src/App.tsx`, `src/pages/**`, `src/features/**`

## Intended write set

- `src/content/program.ts`
- `server/**` focused contract tests
- `scripts/**`
- `package.json`
- lockfile only if scripts/deps change require it
- `harness/WORKBOARD.md`
- this task file

## Out-of-scope

- Product UX changes
- Runtime frontend validation unless needed
- Backend route redesign
- New dependencies unless unavoidable

## Plan

1. Export focused content schemas needed for API contract tests.
2. Add content API contract tests that parse API responses with shared schemas.
3. Add an import guard script preventing rendered app code from importing runtime content JSON/loaders.
4. Wire the guard into `npm run verify`.

## Checks

- [x] `npm run verify`

## Result packet

- Files changed: `src/content/program.ts`, `server/content-contract.test.ts`, `scripts/check-runtime-content-imports.mjs`, `scripts/verify.sh`, `package.json`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `harness/tasks/done/T-014-api-contract-guards.md`
- Checks run: `npm run verify`
- Risks: Frontend still trusts API responses at runtime; this PR adds shared contract tests rather than client-side runtime parsing.
- Follow-up: Discuss design and UX direction before starting visual/product polish.
