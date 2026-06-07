# T-082 — Practice flow scope and dev restart

Status: review

## Goal

Fix the T-081 regression where the card-flow pattern was applied too broadly to ordinary choice cards. Keep the card-flow treatment scoped to target practice screens and restart local development so the in-app browser shows the corrected app.

## Intended write set

- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `src/features/lesson-reader/card-renderers/MultiSelectCard.tsx`
- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/card-renderers/PracticeCardFlow.tsx`
- `docs/DESIGN_SYSTEM.md`
- focused tests as needed
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Notes

- Ordinary hooks/scenarios must keep the previous list-style choice UI.
- The card-flow pattern should only affect target practice cards, especially the third screen exercises.
- Local dev must be restarted after the fix.

## Verification

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Restarted local dev on `http://127.0.0.1:5174/` with API on `http://127.0.0.1:3001`.
- Browser 390px smoke:
  - `/lessons/why-emergency-fund`: first screen is list-style choice; third screen is card-flow `multi_select`; no horizontal overflow; checkbox enables `Проверить`.
  - `/lessons/where-money-goes`: first screen is list-style choice; third screen is card-flow categorization; all five items can be assigned and enable `Проверить`; no horizontal overflow.
  - `/lessons/mandatory-and-desired`: first screen is list-style choice; third screen is card-flow categorization; no horizontal overflow.
  - `/lessons/reserve-amount`: first screen is list-style choice; third screen is card-flow `single_choice`; no horizontal overflow.
  - Console warnings/errors: none observed.
