# T-057 — GitHub Actions deploy workflow

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: main working tree

## Goal

Add a push-to-main GitHub Actions workflow that verifies, builds, pushes, deploys, and smoke-tests FinPulse.

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

- `.github/workflows/deploy.yml`
- `harness/tasks/review/T-057-github-actions-deploy.md`

## Out-of-scope

- Committing fake GitHub secrets.
- Printing secret payloads in logs.
- Changing the existing verify workflow unless required by deploy integration.

## Plan

1. Add a main-branch deploy workflow.
2. Authenticate to Yandex Cloud through GitHub OIDC and Yandex Workload Identity Federation.
3. Build/push image, start DB, deploy serverless container, and run smoke checks.
4. Document all required secrets in operations docs.

## Checks

- [x] YAML/static review.
- [x] Smoke commands encoded in workflow.

## Result packet

- Files changed: `.github/workflows/deploy.yml`, `harness/tasks/review/T-057-github-actions-deploy.md`
- Checks run: Ruby YAML parse for `.github/workflows/deploy.yml`; full repo verify run covers app build/tests used by the workflow.
- Resource IDs touched: deploy workflow references registry `crp5j8penr0hui0ttaum`, container `bbabho5nujsp32c8mvc7`, runtime SA `aje0lujm0q1obpn9fbu9`, deploy SA `ajeboe0h7j2k9vtfi06j`, Lockbox secret metadata `e6qdr1f6uh0k9aj2v34c`, network `enpanp4tbmpj9gckolkg`, and subnet `e9bl6as7h109ghbo9c33`.
- Risks: workflow has not run in GitHub yet; it needs GitHub secret `YC_DB_START_URL` before first deploy.
- Follow-up: add `YC_DB_START_URL` in GitHub repository secrets, then trigger `workflow_dispatch` or push to `main`.
