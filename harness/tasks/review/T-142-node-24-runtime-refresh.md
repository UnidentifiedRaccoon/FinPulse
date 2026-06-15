# T-142 — Node 24 runtime refresh

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: codex/feat-admin-production-deploy

## Goal

Align local metadata, dependency lockfile, and CI/deploy workflows around Node 24.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- harness/PARALLEL_AGENT_PROTOCOL.md
- package.json
- package-lock.json
- .github/workflows/*
- Dockerfile
- Dockerfile.admin

## Intended write set

- package.json
- package-lock.json
- .nvmrc
- .github/workflows/verify.yml
- .github/workflows/deploy.yml
- .github/workflows/deploy-admin.yml
- Dockerfile
- Dockerfile.admin
- src/App.test.tsx
- harness/tasks/review/T-142-node-24-runtime-refresh.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Learner UI changes
- Content JSON or methodology changes
- Backend/API behavior changes
- Production secret or cloud resource changes

## Plan

1. Audit current Node/workflow/Docker/package state.
2. Refresh direct dependencies and lockfile for the Node 24 toolchain.
3. Add explicit Node 24 project metadata and run verification.

## Checks

- [x] `npm outdated --json`
- [x] `npm ci`
- [x] `docker run --rm -v "$PWD":/app -w /app node:24-alpine npm install --package-lock-only`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test FINPULSE_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test ./scripts/verify.sh`
- [x] `npm run build:container`
- [x] `docker build --build-arg NODE_VERSION=24 --tag finpulse-node24-check .`
- [x] `docker build --file Dockerfile.admin --build-arg NODE_VERSION=24 --build-arg FINPULSE_ADMIN_API_BASE_URL=http://127.0.0.1:3001 --tag finpulse-admin-node24-check .`
- [x] `npm audit --omit=dev --json`

## Result packet

- Files changed: `package.json`, `package-lock.json`, `.nvmrc`, `.github/workflows/verify.yml`, `.github/workflows/deploy.yml`, `.github/workflows/deploy-admin.yml`, `Dockerfile`, `Dockerfile.admin`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-142-node-24-runtime-refresh.md`
- Checks run: full verify with local PostgreSQL, focused App tests, local and Docker npm clean installs, container build script, learner/admin Docker builds, outdated/audit checks.
- Risks: `npm audit --omit=dev` still reports the upstream Next/PostCSS moderate advisory, and full audit reports Storybook dev advisories; npm currently suggests major downgrades rather than a safe forward fix.
- Follow-up: watch for patched Next/Storybook releases and rerun dependency refresh when they land.
