# T-123 — Apply full-width mobile card rhythm

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Updated: 2026-06-13

## Goal

Apply the approved full-width mobile card rhythm from T-120 to production card surfaces: lessons, completion, profile, program/level pages, and lesson path surfaces. On narrow screens, cards fill the available viewport/content width so their own inner padding is the primary horizontal reading padding.

## Write set

- `src/App.tsx`
- `src/App.test.tsx`
- `src/pages/EntryPage.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/LevelPage.tsx`
- `src/pages/SectionPage.tsx`
- `src/pages/LessonPage.tsx`
- `src/features/lesson-reader/LessonBottomAction.tsx`
- `src/features/lesson-reader/LessonCardFrame.tsx`
- `src/features/lesson-reader/LessonProgressHeader.tsx`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/program-navigation/LevelPathNode.tsx`
- `harness/tasks/review/T-123-apply-full-width-card-rhythm.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Changes

- Removed the app shell's mobile horizontal padding for authenticated program/profile and lesson routes.
- Removed compensating negative margins and outer lesson padding from the lesson reader; header/footer keep their own `px-4`, while lesson cards, goal cards, and completion cards fill the mobile content width.
- Removed outer `px-4` wrappers around level/section path body cards and program/profile card lists; headings and non-card controls keep explicit local padding.
- Added explicit `w-full` to key card surfaces and state cards to codify the full-width contract.
- Fixed profile separators so local `mx-4` does not combine with shadcn's horizontal `w-full` and create overflow.
- Added focused App test assertions for full-width shell/card classes on program, profile, and lesson routes.

## Checks

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [x] `npx vitest run src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx src/features/auth/AuthControls.test.tsx src/features/program-navigation/learningPath.test.ts src/content/program.test.ts`
- [x] `npm run build`
- [x] Mobile Chrome/Playwright smoke at 390x844 for `/program`, `/profile`, `/levels/t1-start` completed state, `/lessons/where-money-goes`, and a one-card lesson completion flow: all measured target cards at `x=0`, `width=390`, and `scrollWidth=390`.
- [ ] Full `npm run verify` with a PostgreSQL test DB URL. Plain `npm run verify` reached tests after content/runtime/typecheck/lint and failed only because backend tests require `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL` in this shell.

## Result packet

Files changed: app shell, production lesson reader layout, program/profile/path card surfaces, and focused App tests.

Checks run: see above.

Risks: desktop/tablet spacing is intentionally conservative through existing max-width shells and `sm:px-4` on lesson inner content. Browser smoke was DOM/geometry based using system Chrome because the Playwright bundled browser was not installed.

Follow-up: if the team wants all non-card dividers and controls edge-to-edge too, that should be a separate visual decision; this task kept non-card text/control padding local.
