# T-120 — Lesson card full-width padding experiment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13

## Goal

Add a standalone mobile design experiment for a lesson card that stretches to the full available screen width, so the inner card padding is the only horizontal reading padding on narrow screens.

## Expected write set

- `src/pages/MobileLessonCardPaddingExperimentPage.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-120-lesson-card-full-width-padding-experiment.md`
- `harness/tasks/review/T-120-lesson-card-full-width-padding-experiment.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No production `LessonSession` layout change in this pass.
- No runtime JSON/content changes.
- No backend, auth, progress, rewards, diagnostics, or analytics changes.
- No restoration of the removed `/design/mobile-section-compact` route from T-121.

## Plan

1. Add a public standalone `/design/lesson-card-full-width` route.
2. Render a real T1 categorization card inside an isolated full-width mobile lesson shell.
3. Add focused App coverage so the route stays public and full-bleed.
4. Run focused tests, verification, and browser smoke.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser DOM/geometry smoke on `/design/lesson-card-full-width`: in-app Browser at 390x844 on temporary `http://127.0.0.1:5174` confirmed `main` is `max-w-none px-0 py-0`, card geometry `left=0`, `width=390`, `rightGap=0`, table width `356`, no horizontal overflow, expected headings/CTA, and no console warnings/errors. Existing Vite dev server is still available on `http://localhost:5173/`; the temporary 5174 server was stopped.
- [x] Browser screenshot attempted; capture timed out in the Browser/CDP runtime.

## Result packet

- Files changed: `src/pages/MobileLessonCardPaddingExperimentPage.tsx`, `src/App.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, task file.
- Checks run: focused App tests, typecheck, lint, production build, full verify with PostgreSQL test URL, in-app Browser DOM/geometry smoke.
- Risks: screenshot capture timed out, so visual QA evidence is DOM/geometry based; production `LessonSession` remains unchanged until a design decision is made.
- Follow-up: compare the standalone route visually on target mobile sizes before deciding whether to apply the full-width card shell to production lessons.
