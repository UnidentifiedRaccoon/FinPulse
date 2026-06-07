# T-092 — Apply Auto Categorization Flow

## Status

review

## Request

Apply the approved seventh `/design/practice-card-variants` pattern to the necessary production lesson blocks, then restart local development on port `5173`.

## Intended write set

- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `docs/DESIGN_SYSTEM.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-092-apply-auto-categorization-flow.md`

## Scope

- Apply the auto-advancing card flow only to objective third-screen `categorization` practice cards.
- Keep `multi_select`, `single_choice`, read-only cards, and non-third-screen categorization behavior unchanged.
- Preserve current `card.id` and content JSON.

## Verification

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `npm run test:run -- src/App.test.tsx`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on:
  - `http://localhost:5173/lessons/where-money-goes`
  - `http://localhost:5173/lessons/mandatory-and-desired`

## Result

- Objective third-screen `categorization` practice now uses the approved auto-advancing card flow.
- Final result tables are editable before rechecking.
- `multi_select`, `single_choice`, read-only cards, and non-third-screen categorization behavior are unchanged.
- Local development is running on `http://localhost:5173/` with the API on `http://127.0.0.1:3001`.
