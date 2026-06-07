# T-084 — Redesign practice variant scenarios

Status: review

## Goal

Redesign the first four `/design/practice-card-variants` scenarios from scratch using the design and frontend-development skills, while preserving the fifth matrix variant as the currently good reference.

## Intended write set

- `src/pages/PracticeCardVariantsPage.tsx`
- `src/App.test.tsx` if route expectations need a text update
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Notes

- Scope is the experiment page only.
- Production lesson reader behavior must stay unchanged.
- Base exercise remains `where-money-goes`, card 3: distribute five expenses between visible and unnoticed categories.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `/design/practice-card-variants`:
  - five experiment variants render;
  - no horizontal overflow;
  - no console warnings/errors;
  - variant 1 row switch updates `aria-pressed`;
  - variant 2 category choice enables `Дальше` and advances to the next item;
  - variant 3 category stack assigns the active item and updates progress;
  - variant 4 card flow category choice and next arrow advance to the next card;
  - variant 5 matrix remains present and readable after column-width polish.
