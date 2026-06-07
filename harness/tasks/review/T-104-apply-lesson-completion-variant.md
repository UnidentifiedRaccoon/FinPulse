# T-104 — Apply lesson completion variant

Status: review

## Goal

Apply the approved fifth lesson-completion design to the production lesson reader and remove the temporary experiment page.

## Intended write set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/index.css`
- `src/pages/LessonCompletionVariantsPage.tsx`
- `harness/tasks/active/T-104-apply-lesson-completion-variant.md`
- `harness/tasks/review/T-104-apply-lesson-completion-variant.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Result

- Production lesson completion now uses the approved hybrid variant: centered mascot and halo, `Урок пройден`, centered description, completed-card progress, and `К следующему уроку` / `К списку уроков` actions when a next lesson exists.
- The final-lesson state keeps a single `К списку уроков` action.
- Removed the temporary `/design/lesson-completion-variants` route and deleted its page file.
- Removed experiment-only completion CSS animations that are no longer used.

## Verification

- `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- Browser 390px smoke on `/lessons/where-money-goes`: completed the 8-card lesson, saw `Урок пройден`, mascot rendered, both CTAs present, no horizontal overflow, and no console warnings/errors.
- Browser redirect smoke for `/design/lesson-completion-variants`: route resolved to `/program` with no experiment heading and no console warnings/errors.
