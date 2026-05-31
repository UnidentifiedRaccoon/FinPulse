# T-053 — Yandex Cloud FinPulse DB control layer

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: main

## Goal

Deploy an on-demand Yandex Cloud Managed PostgreSQL control layer for FinPulse with a public start webhook and 2-hour autostop lease.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/engineering/contributing.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `infra/yandex-cloud/finpulse-db-control/**`
- `docs/operations/yandex-cloud-finpulse-db-control.md`
- `harness/tasks/active/T-053-yandex-cloud-finpulse-db-control.md`
- `harness/tasks/review/T-053-yandex-cloud-finpulse-db-control.md`
- `harness/WORKBOARD.md` if task board state is updated
- `harness/PROJECT_STATE.md` if durable project state changes

## Out-of-scope

- Frontend deployment
- Backend container deployment
- New product scope
- Next.js/SSR migration
- Printing `yc config list`

## Plan

1. Verify PostgreSQL migration prerequisite and committed migration/schema files.
2. Inspect VRK/Ncfg resource patterns and the VRK DB control function.
3. Prepare FinPulse control function, tests, and runbook locally.
4. Present the paid-resource plan for explicit approval.
5. After approval, create/read back YC resources, deploy functions/triggers, and verify.

## Checks

- [x] Verify PostgreSQL migration files exist and backend tests can run or document blocker.
- [x] Run unit tests for FinPulse DB control function behavior.
- [x] Run `./scripts/verify.sh` or document why broader verification is not applicable/blocked.
- [x] Dry-run/readback YC resources with safe `yc ... --format json` commands.

## Result packet

- Files changed: `infra/yandex-cloud/finpulse-db-control/index.py`, `infra/yandex-cloud/finpulse-db-control/test_index.py`, `docs/operations/yandex-cloud-finpulse-db-control.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `python3 -m unittest infra/yandex-cloud/finpulse-db-control/test_index.py` passed; `python3 -m py_compile infra/yandex-cloud/finpulse-db-control/index.py infra/yandex-cloud/finpulse-db-control/test_index.py` passed; `npm run check:content --if-present` passed; `npm run check:runtime-imports --if-present` passed; `npm run verify` ran content validation, runtime import guard, typecheck, and lint, then failed in backend Vitest because no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL` is set locally.
- YC resources created: folder `finpulse` (`b1gpl04msqva2tsff46k`), service account `finpulse-db-control-sa` (`ajem5k91i11pjjnbmfea`), security group `finpulse-db-sg` (`enpfi1mqc28vo7tc71kn`), cluster `finpulse-db` (`c9quhk2n9q3c3vvsp83g`), connection `a59otq7kc4275f8onsdm`, Lockbox secret metadata `e6qdr1f6uh0k9aj2v34c`, start function `d4e0o3h9gnq59inscpns`, autostop function `d4e5g59hleegbl8avgcm`, timer trigger `a1s15loslil2cb3ipsaj`, initial backup `c9quhk2n9q3c3vvsp83g:mdbpmgko239s422m5tk9`.
- Verification run: public start URL invoked once and returned `action=extend-requested`; labels updated to `active_until=1780262473`, `managed_by=finpulse-db-control`; autostop function invoked manually after stop and returned `noop` / `already-stopped`; final cluster status is `STOPPED`.
- Risks: public start URL is unauthenticated by design and can start a paid DB window for anyone who has it; stopped cluster still has storage/backup costs; security group includes temporary operator IP `89.125.48.147/32` that may need rotation; folder is lowercase `finpulse` because YC rejected uppercase `FinPulse`.
- Follow-up: connect future backend/container deployment to Connection Manager/Lockbox without printing payloads; consider making the start URL private or adding a token if public start risk becomes unacceptable.
