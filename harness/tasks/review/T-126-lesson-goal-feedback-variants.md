# T-126 — Lesson goal and feedback block variants

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13

## Goal

Add a standalone mobile design experiment page with four compact screen mocks comparing icon-free alternatives for the lesson goal block and answer-feedback hint block.

## Expected write set

- `src/pages/LessonGoalFeedbackVariantsPage.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-126-lesson-goal-feedback-variants.md`
- `harness/tasks/review/T-126-lesson-goal-feedback-variants.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No production `LessonSession`, `LessonFeedback`, or content JSON changes.
- No backend, auth, progress, rewards, diagnostics, analytics, or persistence changes.
- No new dependencies or external assets.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run verify` attempted; content validation, runtime import guard, typecheck, lint, and frontend tests reached green, then backend tests failed at the documented local precondition: missing `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- [x] Browser smoke on `/design/lesson-goal-feedback-variants` at 390x844: four variants rendered, each contains one `Цель урока` region and one `status` feedback block, document width equals viewport width, no horizontal overflow, no console warnings/errors.
- [x] Browser fit check: every simulated phone frame had matching `scrollHeight` / `clientHeight`, and each CTA footer stayed inside the bounded device block.

## Result packet

- Files changed: `src/pages/LessonGoalFeedbackVariantsPage.tsx`, `src/App.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: focused App tests, typecheck, lint, production build, full verify attempt, Browser mobile smoke and phone-fit checks.
- Risks: production lesson UI is unchanged; the page is an experiment surface for choosing a direction before applying anything to `LessonSession` / `LessonFeedback`.
- Follow-up: pick one variant or combine pieces before making a production UI change.
