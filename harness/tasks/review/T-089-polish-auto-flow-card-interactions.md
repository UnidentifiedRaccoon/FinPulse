# T-089 — Polish Auto-Flow Card Interactions

## Status

review

## Goal

Make the seventh `/design/practice-card-variants` experiment feel more interactive and compact: category buttons on the auto-flow cards need visible hover/focus/press states, and the cards themselves should be smaller by reducing vertical spacing and removing the item icon.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `harness/tasks/review/T-089-polish-auto-flow-card-interactions.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Reduced the auto-flow card height from the previous large card treatment to a compact focused card.
- Removed the expense icon from active cards in variant 7 and tightened the counter/title spacing.
- Added an `interactive` mode for `CategoryButtons` and used it only in variant 7.
- Interactive buttons now have compact typography plus hover, focus-visible, shadow, border, and press-scale affordances.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `http://127.0.0.1:5174/design/practice-card-variants`: variant 7 active card is 208px tall, has no SVG expense icon, choice button classes include hover/focus/active states, clicking advances to the next card, no horizontal overflow, no console warnings/errors.
