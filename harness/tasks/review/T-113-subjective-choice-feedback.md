# T-113 — Subjective choice feedback

Status: review
Owner: Codex
Started: 2026-06-13
Completed: 2026-06-13

## Goal

Show learner-facing feedback immediately after selecting an option on subjective `single_choice` / `scenario` cards that do not have an objective correct answer.

## Files changed

- `src/features/lesson-reader/LessonSession.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Result

- Subjective choice cards now render bottom feedback as soon as an option is selected.
- Objective choice cards still wait for `Проверить` before showing correct/retry feedback.
- The first `where-money-goes` screen now displays `Спасибо за честность! Идём дальше.` immediately after selecting an answer.

## Verification

- `npm run test:run -- src/App.test.tsx`
- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- Browser smoke on `http://localhost:5173/lessons/where-money-goes`: selected `Да, постоянно так`; feedback appeared, `Далее` stayed enabled, no `Проверить` button was present, and no horizontal overflow was detected.
