# T-118 — Level card display cleanup

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Completed: 2026-06-13

## Goal

Make the program overview level card show a learner-facing title, a top-right level badge, and the full level description without changing runtime content JSON or routes.

## Expected write set

- `src/features/program-navigation/LevelPathNode.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-118-level-card-display.md`
- `harness/tasks/review/T-118-level-card-display.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No runtime JSON/content renaming.
- No backend/API/route changes.
- No changes to T-117 or T-119.

## Result

The program overview level card now displays methodical Russian `Старт` instead of the technical `T1 Старт`, keeps `Уровень 1` as a top-right badge, and renders the full level description without line clamping.

Runtime content still keeps the source title `T1 Старт`; this remains the internal content/API title and methodical T1 marker.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Authenticated Chrome headless mobile smoke on `http://localhost:5174/program`

## Notes

- Plain `npm run verify` without a database URL still fails at the known backend-test precondition: `FINPULSE_TEST_DATABASE_URL, FINPULSE_DATABASE_URL, or DATABASE_URL is required`.
- In-app Browser was attempted first but became unavailable after the connection dropped, so visual smoke used local headless Chrome via CDP.
