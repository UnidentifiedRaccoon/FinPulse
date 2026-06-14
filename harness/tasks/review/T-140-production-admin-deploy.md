# T-140 — Production admin deploy path

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: main worktree

## Goal

Prepare the internal Next.js admin progress board for production deployment without migrating or embedding the learner Vite SPA into Next.js.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/DEVELOPMENT.md`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `docs/engineering/contributing.md`

## Intended write set

- `docs/{DECISIONS,ARCHITECTURE,DEVELOPMENT,PRODUCT}.md`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `.github/workflows/{deploy,deploy-admin}.yml`
- `Dockerfile.admin`
- `package.json`
- `package-lock.json`, if scripts require lockfile metadata refresh
- `.env.example`
- `harness/**`

## Out-of-scope

- Creating Yandex Cloud resources from this local shell.
- Migrating the learner app to Next.js.
- Organizations, RBAC, answer-text review, analytics dashboards, or admin write/CMS features.
- Changing admin read model/API contracts.

## Plan

1. Add an ADR/update documenting the selected production topology.
2. Add admin production Docker/start workflow.
3. Update backend/admin deployment docs and GitHub Actions.
4. Run focused verification and record remaining production resource prerequisites.

## Checks

- [x] npm run test:admin
- [x] npm run typecheck:admin
- [x] npm run build:admin
- [x] npm run lint
- [x] npm run build:container
- [x] npm run verify, if PostgreSQL is available
- [x] git diff --check
- [x] docker build --file Dockerfile.admin
- [x] docker build --tag finpulse:codex-smoke .
- [x] local admin container smoke
- [x] in-app Browser local admin smoke

## Result packet

- Files changed: `docs/{DECISIONS,ARCHITECTURE,DEVELOPMENT,PRODUCT}.md`, `docs/operations/yandex-cloud-finpulse-deploy.md`, `.github/workflows/{deploy,deploy-admin}.yml`, `Dockerfile.admin`, `.dockerignore`, `.env.example`, `package.json`, `package-lock.json`, `harness/**`.
- Checks run: `npm run test:admin`; `npm run typecheck:admin`; `FINPULSE_ADMIN_API_BASE_URL=https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net npm run build:admin`; `npm run lint`; `npm run build:container`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test FINPULSE_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`; `git diff --check`; `docker build --file Dockerfile.admin --build-arg FINPULSE_ADMIN_API_BASE_URL=https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net --tag finpulse-admin:codex-smoke .`; `docker build --tag finpulse:codex-smoke .`; `docker run` smoke for admin HTML plus proxied `/api/health`; in-app Browser smoke on `http://localhost:3002/`.
- Risks: admin remains single-user/global all-users with no organizations/RBAC; `npm audit` still reports existing dependency advisories and was not remediated in this scope; GitHub workflow deploy/merge still needs to complete before the production admin URL serves the new app revision.
- Follow-up: merge this branch, wait for backend `Deploy`, then run `Deploy Admin`.
