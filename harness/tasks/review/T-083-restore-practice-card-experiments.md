# T-083 — Restore practice card experiment page

Status: review

## Goal

Restore the separate design preview page for third-screen practice experiments so the product discussion can compare variants independently from production lesson-reader behavior.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Notes

- Restore `/design/practice-card-variants`.
- Keep production lessons unchanged in this task.
- Use `where-money-goes` card 3 as the concrete base exercise.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `/design/practice-card-variants`:
  - route renders without auth shell;
  - five experiment variants are present;
  - card-flow variant next arrow changes the focused item from `Покупка телефона` to `Аренда жилья`;
  - no horizontal overflow;
  - no console warnings/errors.
