# T-058 — Deploy operations docs

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: main working tree

## Goal

Document FinPulse production deployment resources, workflow, manual operations, rollback, smoke checks, and required secrets.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/engineering/contributing.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/operations/yandex-cloud-finpulse-db-control.md`

## Intended write set

- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `README.md`
- `docs/DEVELOPMENT.md`
- `docs/ARCHITECTURE.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-058-deploy-operations-docs.md`

## Out-of-scope

- Duplicating secret payloads.
- Changing product scope or architecture beyond the deploy decision.

## Plan

1. Document architecture and created/reused resources.
2. List GitHub secrets and manual deploy/rollback commands.
3. Record smoke checks and DB stopped handling.
4. Update harness state and workboard.

## Checks

- [x] Documentation review.
- [x] Link/resource ID consistency check.

## Result packet

- Files changed: `docs/operations/yandex-cloud-finpulse-deploy.md`, `README.md`, `docs/DEVELOPMENT.md`, `docs/ARCHITECTURE.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-058-deploy-operations-docs.md`
- Checks run: documentation/resource ID consistency review; official Yandex Cloud WIF docs checked; full `npm run verify` still passed after docs/runtime changes.
- Resource IDs touched: all deploy resources documented in `docs/operations/yandex-cloud-finpulse-deploy.md`.
- Risks: production URL exists as a container URL but has no app revision until the first workflow deploy succeeds.
- Follow-up: record first GitHub Actions deploy run result and revision ID after `main` deploy.
