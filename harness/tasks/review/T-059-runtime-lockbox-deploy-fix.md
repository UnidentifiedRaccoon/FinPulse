# T-059 — Runtime Lockbox deploy fix

Status: review

## Goal

Fix the production deploy path after the first `main` deploy runs showed Yandex Serverless Containers rejects the current revision command.

## Intended write set

- `server/db/connection.ts`
- `server/db/connection.test.ts`
- `.github/workflows/deploy.yml`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/review/T-059-runtime-lockbox-deploy-fix.md`

## Out of scope

- Changing database schema or product behavior.
- Printing or committing database passwords, tokens, or Lockbox payloads.
- Replacing the existing Yandex Cloud resource set.

## Plan

1. Remove YC Serverless revision options that failed in production: explicit `PORT`, one-zone `--subnets`, and preview `--secret` binding.
2. Let the backend resolve the DB password from Lockbox at runtime through the attached service account when `FINPULSE_DATABASE_PASSWORD` is absent.
3. Verify locally, publish through PR, merge to `main`, and confirm deploy smoke checks pass.

## Result

- Files changed: `server/db/connection.ts`, `server/db/connection.test.ts`, `.github/workflows/deploy.yml`, `docs/operations/yandex-cloud-finpulse-deploy.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `harness/tasks/review/T-059-runtime-lockbox-deploy-fix.md`.
- Checks run: deploy workflow YAML parsed with Ruby; focused `server/db/connection.test.ts` passed; `npm run verify` passed with a temporary local PostgreSQL test database; `npm run build:container` passed.
- Resource notes: runtime/deploy SAs now have confirmed Lockbox payload access. The active production revision was manually updated during diagnosis to the current image without serverless secret injection; the PR deploy must publish the runtime Lockbox fix and run smoke checks.
