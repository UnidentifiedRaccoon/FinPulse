# T-129 — Lesson goal variants iteration

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13

## Goal

Update the standalone lesson goal experiment after user feedback: remove the second variant, add two more diverse goal-card variants, and keep answer feedback in the bottom action area instead of under selected answers.

## Expected write set

- `src/pages/LessonGoalFeedbackVariantsPage.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-129-lesson-goal-variants-iteration.md`
- `harness/tasks/review/T-129-lesson-goal-variants-iteration.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No production `LessonSession`, `LessonFeedback`, or content JSON changes.
- No backend, auth, progress, rewards, diagnostics, analytics, or persistence changes.
- No changes to active T-128 schema cleanup work.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `git diff --check -- src/pages/LessonGoalFeedbackVariantsPage.tsx src/App.test.tsx harness/tasks/active/T-129-lesson-goal-variants-iteration.md`
- [x] `npm run verify` attempted; content validation, runtime import guard, typecheck, lint, and frontend tests reached green, then backend tests failed at the documented local precondition: missing `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- [x] Browser smoke on `/design/lesson-goal-feedback-variants`: current viewport and 390x844 both render five variants, no `note` variant, no horizontal overflow, no console warnings/errors, each simulated phone has one goal region, feedback appears only in the footer/action area, and every phone frame has matching `scrollHeight` / `clientHeight`.

## Result packet

- Files changed: `src/pages/LessonGoalFeedbackVariantsPage.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: focused App test, typecheck, lint, build, diff check, full verify attempt, Browser smoke at current viewport and 390px.
- Risks: production lesson UI is unchanged; the page remains a design experiment before selecting a production goal-card treatment.
- Follow-up: choose one goal-card variant or request another iteration before applying to `LessonSession`.
