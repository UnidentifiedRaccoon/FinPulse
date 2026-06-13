# T-121 — Apply compact path header

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13

## Goal

Move the approved compact mobile section header from the standalone experiment into the production level and section path pages, then remove the experiment route/page.

## Expected write set

- `src/App.tsx`
- `src/pages/LevelPage.tsx`
- `src/pages/SectionPage.tsx`
- `src/pages/MobileSectionCompactExperimentPage.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-121-apply-compact-path-header.md`
- `harness/tasks/review/T-121-apply-compact-path-header.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No lesson-card layout changes.
- No runtime JSON/content changes.
- No backend, auth, progress, rewards, diagnostics, or analytics changes.

## Plan

1. Add the compact top-pinned header to production level and section path pages.
2. Make authenticated `/levels/**` shell content full-bleed so the path header reaches the viewport/content edge.
3. Remove the standalone `/design/mobile-section-compact` route and page.
4. Update focused coverage for the production header and removed route.
5. Run focused tests, verification, and browser smoke.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser DOM/interaction smoke on `/levels/t1-start`: in-app Browser at 390x844 confirmed compact header geometry `left=0`, `top=0`, `width=390`, heading font `20px`, bottom radii `22px`, no horizontal overflow, no console warnings/errors, and lesson dialog opening from the path. Screenshot capture timed out in Browser/CDP.

## Result packet

- Files changed: `src/App.tsx`, `src/pages/LevelPage.tsx`, `src/pages/SectionPage.tsx`, deleted `src/pages/MobileSectionCompactExperimentPage.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, task file.
- Checks run: focused App test, typecheck, lint, production build, full verify with PostgreSQL test URL, in-app Browser DOM/interaction smoke.
- Risks: the workspace also contains an active T-120 lesson-card experiment; it was not changed by this task. Browser screenshot capture timed out, so visual QA evidence is DOM/geometry/interaction based.
- Follow-up: none.
