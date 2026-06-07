# T-085 — Add hybrid practice variant

Status: review

## Goal

Add a sixth `/design/practice-card-variants` experiment that combines the small focused card from the card-flow pattern with the immediate all-item matrix/list feedback from the matrix pattern.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Notes

- Scope is the experiment page only.
- Production lesson reader behavior and content JSON must stay unchanged.
- The fourth and fifth variants remain available for comparison.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `/design/practice-card-variants`:
  - six experiment variants render;
  - variant 6 appears as `Вариант 6. Карточка + матрица`;
  - no horizontal overflow;
  - no console warnings/errors;
  - selecting `Покупка телефона: Замечаю сразу` on the small card updates the phone row in the matrix to `✓` under `Сразу`;
  - the focused card advances to `Аренда жилья`.
