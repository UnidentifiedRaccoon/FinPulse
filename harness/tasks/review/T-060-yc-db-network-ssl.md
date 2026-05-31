# T-060 — YC DB network and SSL deploy fix

## Status

review

## Goal

Fix the remaining production startup failure after the container revision can deploy: Serverless Container must reach Managed PostgreSQL through VPC and use libpq-compatible SSL handling.

## Intended write set

- `server/db/connection.ts`
- `server/db/connection.test.ts`
- `.github/workflows/deploy.yml`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `docs/ARCHITECTURE.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/review/T-060-yc-db-network-ssl.md`

## Out of scope

- Printing or committing the database password.
- Changing product routes or database schema.

## Plan

1. Keep VPC attachment but document the Serverless service subnet CIDR allowed in the DB security group.
2. Pass DB password from GitHub Actions secret `FINPULSE_DATABASE_PASSWORD` instead of runtime Lockbox fetch because VPC-attached containers do not have reliable public Lockbox egress without NAT.
3. Add libpq-compatible SSL query support so `sslmode=require` accepts the Yandex Managed PostgreSQL certificate chain.
4. Verify locally, publish through PR, merge to `main`, and confirm production smoke checks pass.

## Result

- Files changed: `server/db/connection.ts`, `server/db/connection.test.ts`, `.github/workflows/deploy.yml`, `docs/operations/yandex-cloud-finpulse-deploy.md`, `docs/ARCHITECTURE.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `harness/tasks/review/T-060-yc-db-network-ssl.md`.
- Checks run: deploy workflow YAML parse passed; focused `server/db/connection.test.ts` passed; `npm run typecheck` passed; `npm run verify` passed with a temporary local PostgreSQL test database; `npm run build:container` passed.
- Cloud state updated: GitHub secret `FINPULSE_DATABASE_PASSWORD` set from Lockbox without printing payload; DB security group `finpulse-db-sg` allows `198.19.0.0/16` on port `6432` for Serverless Container VPC traffic.
