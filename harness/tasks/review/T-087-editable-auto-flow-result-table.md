# T-087 — Editable Auto-Flow Result Table

Status: review

## Goal

Let the seventh `/design/practice-card-variants` experiment keep the final result table editable: after all auto-flow cards are answered, the learner can switch any item between the two categories directly in the table before pressing `Проверить`.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-087-editable-auto-flow-result-table.md`
- `harness/tasks/review/T-087-editable-auto-flow-result-table.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Variant 7 now passes an `onSelect` handler to the final result matrix.
- Result matrix cells render as accessible category buttons with `aria-pressed` when editable.
- Switching a final-table cell updates the saved assignment in-place and keeps `Проверить` enabled.
- Added an App regression test that completes variant 7 and switches the phone answer in the final table.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `http://127.0.0.1:5174/design/practice-card-variants`: completed variant 7, switched `Покупка телефона` from `Сразу` to `Мимо`, confirmed `Проверить` remained enabled, no horizontal overflow, no console warnings/errors.
