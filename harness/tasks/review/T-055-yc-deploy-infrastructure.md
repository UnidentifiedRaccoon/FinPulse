# T-055 — Yandex Cloud deploy infrastructure

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: main working tree

## Goal

Reuse or create the minimal Yandex Cloud resources required for FinPulse single-container deployment.

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

- `harness/tasks/review/T-055-yc-deploy-infrastructure.md`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Reading Lockbox payloads or printing secret values.
- Running `yc config list`.
- Broad IAM grants beyond the deploy/runtime needs.

## Plan

1. Inventory existing registry, serverless container, service accounts, IAM, and public URL resources.
2. Create only missing minimal resources.
3. Record resource IDs, IAM roles, and risks.

## Checks

- [x] Safe `yc ... get/list` commands only for metadata.
- [x] Resource creation commands, if needed.

## Result packet

- Files changed: `harness/tasks/review/T-055-yc-deploy-infrastructure.md`, `docs/operations/yandex-cloud-finpulse-deploy.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`
- Checks run: safe YC metadata inventory; resource create commands; metadata readback for registry, container, service accounts, WIF, federated credential, and IAM bindings.
- Resource IDs touched: registry `crp5j8penr0hui0ttaum`; container `bbabho5nujsp32c8mvc7`; runtime SA `aje0lujm0q1obpn9fbu9`; deploy SA `ajeboe0h7j2k9vtfi06j`; WIF federation `ajeuttdtpqdudd97n6ei`; federated credential `ajeci1l3l7qhus6vjqhk`; Lockbox secret metadata `e6qdr1f6uh0k9aj2v34c`; network `enpanp4tbmpj9gckolkg`; subnet `e9bl6as7h109ghbo9c33`.
- Risks: no app revision/image deployed locally because Docker daemon was unavailable; DB start URL remains a sensitive state-changing endpoint and must live in GitHub secret `YC_DB_START_URL`.
- Follow-up: first push to `main` should build/push the image and create the first production revision.
