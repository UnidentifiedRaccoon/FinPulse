# T-054 — CI/CD deploy discovery

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: main working tree

## Goal

Map the current FinPulse CI, backend runtime, migration, Docker/infra, and deploy gaps before implementation.

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

- `harness/tasks/review/T-054-deploy-discovery.md`

## Out-of-scope

- Runtime code changes.
- Cloud resource creation.
- Workflow changes.

## Plan

1. Inspect scripts, workflows, backend runtime, migrations, and infra files.
2. Collect deploy gaps and risks.
3. Return a result packet for the orchestrator.

## Checks

- [x] Read-only repo inspection.

## Result packet

- Files changed: `harness/tasks/review/T-054-deploy-discovery.md`
- Checks run: local repo inspection; Discovery subagent read required docs, inspected scripts/workflows/runtime/migrations, and ran `python3 -m unittest infra/yandex-cloud/finpulse-db-control/test_index.py` successfully.
- Resource IDs touched: none.
- Risks: worktree was already heavily dirty; deploy implementation had to avoid reverting unrelated review changes.
- Follow-up: use the single-container deploy shape; add server build, Dockerfile, deploy workflow, operations docs, and runtime smoke checks.
