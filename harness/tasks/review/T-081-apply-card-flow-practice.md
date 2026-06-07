# T-081 — Apply card-flow practice pattern

Status: review

## Goal

Apply the selected card-flow interaction pattern to production choice-like practice cards and remove the temporary practice-card design preview route.

## Intended write set

- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `src/features/lesson-reader/card-renderers/MultiSelectCard.tsx`
- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/card-renderers/PracticeCardFlow.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/pages/PracticeCardVariantsPage.tsx`
- `docs/DESIGN_SYSTEM.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

Runtime content JSON is not planned for edits unless source review finds learner-facing material that must change.

## Notes

- Keep the current content model and answer-checking behavior.
- Keep bottom lesson CTA behavior: disabled `Проверить` until the answer is actionable, then `Далее`/completion after checking.
- Remove preview-only labels, fit chips, pattern descriptions, and design metadata from learner-facing practice.
- Preserve accessible controls and mobile-first ergonomics; no drag-and-drop.
- Source lesson Markdown for U1.1, U1.2, U2.1, and U2.2 was reviewed. Runtime JSON already matches the intended exercises, so no content JSON edits were needed.

## Verification

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- `npm run lint`
- `npm run check:content`
- `npm run verify` failed first because the shell had no database URL for backend tests.
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser smoke at 390px:
  - `/lessons/where-money-goes`
  - `/lessons/mandatory-and-desired`
  - `/lessons/why-emergency-fund`
  - `/lessons/reserve-amount`
  - `/design/practice-card-variants` redirects to `/design/lesson-block-variants`
  - no horizontal overflow and no console warnings/errors.
- After the final `flex-wrap` hardening for progress dots, full verify passed again. A repeat in-app Browser smoke/reset attempt timed out in the Browser runtime, so the post-hardening browser rerun was not completed.
