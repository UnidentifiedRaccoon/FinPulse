# T-091 — Fix Auto-Card Shadow Clipping

Status: review

## Goal

Fix the seventh `/design/practice-card-variants` experiment where the rounded auto-flow card shadow looked square/clipped around the card corners after adding the page-turn animation.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/index.css`
- `harness/tasks/active/T-091-fix-auto-card-shadow-clipping.md`
- `harness/tasks/review/T-091-fix-auto-card-shadow-clipping.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Removed the rectangular `overflow-hidden` clipping from the auto-flow card stage.
- Moved stage spacing into the CSS component class with negative margin plus inner padding so the rounded card shadow has room to render.
- Added a larger rounded stage radius and `isolation` so the animated card paints cleanly without creating page overflow.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `http://127.0.0.1:5174/design/practice-card-variants`: inspected the fifth auto-flow card, confirmed `stageOverflow: visible`, stage radius `28px`, card radius `20px`, padding buffer around the card, no horizontal overflow, no console warnings/errors, and the card shadow no longer appears square-clipped.
