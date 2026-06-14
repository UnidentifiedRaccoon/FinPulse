# T-130 — Apply Checkpoint Lesson Goal

Status: review
Owner: Codex
Started: 2026-06-13

## Goal

Apply the selected `checkpoint` lesson-goal treatment from `/design/lesson-goal-feedback-variants` to the production lesson reader while leaving the existing bottom action feedback behavior unchanged. Remove the temporary experiment page and route afterward.

## Intended Write Set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/pages/LessonGoalFeedbackVariantsPage.tsx`
- `docs/DESIGN_SYSTEM.md` if the production goal pattern is documented there
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-130-apply-checkpoint-lesson-goal.md`

## Notes

- Keep content JSON and backend behavior unchanged.
- Keep selected-answer/action feedback in its existing production shape, including the icon treatment.
- Remove the standalone experiment route after applying the selected production treatment.

## Verification

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `git diff --check -- src/features/lesson-reader/LessonSession.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.tsx src/App.test.tsx docs/DESIGN_SYSTEM.md harness/tasks/review/T-130-apply-checkpoint-lesson-goal.md`
- [x] Fallback Chrome/Playwright 390px smoke: production lesson shows the checkpoint goal block without a goal icon; selected bottom feedback still renders the existing icon and text; the removed experiment route no longer renders experiment content.
- [x] `npm run verify` attempted first and reached backend tests after content validation, runtime import guard, typecheck, lint, and frontend tests, then failed because the shell had no database URL.
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
