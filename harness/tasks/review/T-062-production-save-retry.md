# T-062 — Production save retry and DB pool resilience

Status: review

## Goal

Fix intermittent production learner answer/progress save failures where the UI shows `Не сохранено` / `Internal server error` after the on-demand PostgreSQL cluster has been stopped or restarted.

## Intended write set

- `server/db/connection.ts`
- `server/db/connection.test.ts`
- `src/api/client.ts`
- `src/App.test.tsx`
- `harness/tasks/review/T-062-production-save-retry.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## What changed

- Added a `pg` pool idle-error listener so `ECONNRESET` from a stale idle PostgreSQL connection is logged instead of crashing the process.
- Added short client retries for idempotent `GET` and `PUT` requests on transient `500`, `502`, `503`, `504`, and browser network errors.
- Covered permanent failure, transient retry success, and idle pool error handling with tests.

## Evidence

- Production smoke after DB start: `/api/health`, `/api/readyz`, `/` returned `200`.
- Direct production API replay for a new learner returned `200` for card progress, lesson progress, and reflection answer saves.
- Browser replay reached `/lessons/why-values-matter`, card 4, and advanced to card 5 successfully.
- Yandex Cloud logs around the user report showed PostgreSQL `ETIMEDOUT` during startup and unhandled idle pool `ECONNRESET`.

## Checks

- `npm ci` passed; local `node_modules` was missing current dependencies such as `pg`.
- `npm run test:run -- server/db/connection.test.ts src/App.test.tsx` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run verify` was attempted and reached full test execution, but backend suites failed because this local shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
