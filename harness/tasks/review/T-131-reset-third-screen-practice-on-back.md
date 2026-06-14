# T-131 — Reset Third-Screen Practice On Back

Status: review
Owner: Codex
Started: 2026-06-13
Finished: 2026-06-13

## Goal

Reset transient objective third-screen practice state when the learner uses the bottom lesson `Назад` action, so returning with `Далее` starts the screen 3 exercise from the first item instead of resuming stale local progress.

## Intended Write Set

- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/review/T-131-reset-third-screen-practice-on-back.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Result

- Replaced the inline lesson bottom-back callback with a named handler.
- The handler clears stale action errors and removes only current card state for objective `order === 3` practice cards: categorization, multi-select, and objective choice.
- Reflection/artifact drafts, subjective choices, backend viewed/completed progress, routes, and content JSON are unchanged.
- Added a regression test for partial third-screen categorization progress followed by `Назад` and return via `Далее`.

## Verification

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [ ] In-app Browser mobile smoke on `/lessons/where-money-goes`: blocked because the Browser webview timed out attaching while creating a new tab, including after enabling visible mode.

## Risks

- Browser interaction was not completed in this session due to the Browser attach failure; the target behavior is covered by the focused regression test.
