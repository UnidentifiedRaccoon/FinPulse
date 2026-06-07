# T-086 — Add auto card-flow practice variant

Status: review

## Goal

Add a seventh `/design/practice-card-variants` experiment that keeps card-flow cards, advances automatically after selecting a category, and only shows the result table plus `Проверить` after all cards are answered.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Notes

- Scope is the experiment page only.
- Production lesson reader behavior and content JSON must stay unchanged.
- Existing variants 1-6 remain available for comparison.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `/design/practice-card-variants`:
  - seven experiment variants render;
  - variant 7 appears as `Вариант 7. Автопоток карточек`;
  - no horizontal overflow;
  - no console warnings/errors;
  - before answers, variant 7 has no `Проверить` button and no result table;
  - selecting each category advances to the next card automatically;
  - after the fifth answer, the result table and enabled `Проверить` button appear.
