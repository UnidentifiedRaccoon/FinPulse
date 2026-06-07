# T-090 — Auto-Flow Card Page-Turn Animation

## Status

review

## Goal

Add a page-turn-like transition to the seventh `/design/practice-card-variants` experiment so selecting a category visually flips/slides the current card into the next one.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/index.css`
- `src/App.test.tsx`
- `harness/tasks/active/T-090-auto-flow-card-page-turn-animation.md`
- `harness/tasks/review/T-090-auto-flow-card-page-turn-animation.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Added short local transition state in variant 7 so selection starts a page-turn delay before advancing.
- Added CSS keyframes/classes for card exit and enter motion with perspective, rotation, translation, and reduced-motion fallback.
- Disabled variant 7 category buttons during the transition to avoid double taps.
- Updated the auto-flow regression test to wait for animated card changes and assert the temporary disabled state.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `http://127.0.0.1:5174/design/practice-card-variants`: first selection animates into the next card with `fr-auto-card-enter` and 3D transform in progress, remaining selections reach the final editable table, `Проверить` remains enabled, no horizontal overflow, no console warnings/errors.
