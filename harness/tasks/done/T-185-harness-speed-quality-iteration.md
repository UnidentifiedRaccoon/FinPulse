# T-185 — Harness speed and quality iteration

Status: done
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-10
Branch/worktree: current workspace; preserve existing T-183/T-184 changes

## Goal

Reduce agent orientation and verification waste while adding automated guards
against stale policy, task-lifecycle drift, and repeated summary-log growth.

## Context

Read before editing:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- current harness prompts, policies, task templates, scripts, and Git history

## Intended write set

- `.gitignore`
- `AGENTS.md`
- `docs/DEVELOPMENT.md`
- `docs/engineering/contributing.md`
- `.github/workflows/verify.yml`
- `harness/AGENT_ROLES.md`
- `harness/FEATURE_MATRIX.json` (remove unused stale contract)
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/PROJECT_STATE.md`
- `harness/RISK_POLICY.md`
- `harness/TRACE_LOG_TEMPLATE.md` (remove unused stale contract)
- `harness/WORKBOARD.md`
- `harness/prompts/*.md`
- `harness/runs/.gitkeep` (remove unused empty run lane)
- `harness/schemas/{feature-matrix,task}.schema.json` (remove unused schemas)
- `harness/tasks/{active,review,done}/T-*.md` only for lifecycle repair and this task
- `scripts/check-harness.mjs`
- `scripts/check-harness.node-test.mjs`
- `scripts/create-agent-task.mjs`
- `scripts/move-agent-task.mjs`
- `scripts/verify.sh`
- `package.json`

## Out-of-scope

- Learner/admin/backend runtime behavior.
- Educational content, methodology canon, runtime JSON, database, and deploy.
- Rewriting historical task packets beyond proven lifecycle inconsistencies.
- Commit, push, PR, or production actions.

## Plan

1. Measure context, lifecycle, history, and verification friction.
2. Compact current-state entry points without losing current decisions.
3. Remove duplicated/stale policy from prompts and route context by task type.
4. Add harness integrity checks, task-ID automation, and verification tiers.
5. Repair current lifecycle drift, run tests, and obtain an independent review.

## Checks

- [x] `node --test scripts/check-harness.node-test.mjs` — 12/12 pass
- [x] `npm run check:harness` — pass; only grandfathered T-038 warning
- [x] `npm run verify:fast` — 118 non-DB tests pass
- [x] `npm run verify` — 139 tests and web/admin/server/Storybook builds pass
- [x] unavailable-DB preflight repro — exits 2 before typecheck
- [x] `bash -n scripts/verify.sh`
- [x] `git diff --check`
- [x] independent verifier review — accept

## Result packet

- Files changed: compact context/state/role/risk/prompt docs; project-native
  contributing/development guidance; harness validator/tests; task create/move
  automation; fast/full verification and PR CI; lifecycle repairs; unused stale
  harness contracts removed.
- Checks run (pass/fail/blocked/skipped): PASS — 12 harness tests, harness
  integrity, lint, fast verify (118 tests), full verify (139 tests plus all four
  builds), DB fail-fast repro, shell syntax, diff check, and independent review.
- Risks: historical duplicate T-038 remains as one explicit grandfathered
  warning; the 169-packet legacy review archive and old binary evidence were not
  mass-migrated; CI trigger behavior was statically reviewed but not remotely
  dispatched in this local task.
- Follow-up: optional later task to archive accepted legacy review packets and
  define external retention for old bulk visual evidence; no blocker for the
  new strict T-185+ lifecycle.
