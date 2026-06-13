# T-117 — Mobile section compact experiment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13

## Goal

Add a standalone mobile design experiment for a compact full-width pinned section header with rounded bottom corners, without changing production level or section routes.

## Expected write set

- `src/pages/MobileSectionCompactExperimentPage.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-117-mobile-section-compact-experiment.md`
- `harness/tasks/review/T-117-mobile-section-compact-experiment.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No production `LevelPage` / `SectionPage` redesign in this pass.
- No runtime JSON/content changes.
- No backend, auth, progress, rewards, diagnostics, or analytics changes.

## Plan

1. Add a dedicated public `/design/mobile-section-compact` route.
2. Render the current T1 section path with a top-pinned, full-bleed compact section header with only the bottom corners rounded.
3. Keep the route isolated from production pages and add focused coverage.
4. Run focused tests and verification.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser DOM smoke on `/design/mobile-section-compact`: in-app Browser opened `http://localhost:5173/design/mobile-section-compact` at 390px, confirmed title `ФинПульс`, meaningful route content, no login gate, no console warnings/errors, no horizontal overflow, and compact header geometry `top=0`, `left=0`, `width=390`.
- [x] Bottom-corner iteration checks: Browser computed styles confirmed `border-bottom-left/right-radius: 22px`, `border-top-left/right-radius: 0px`; clicking the lesson node opened its dialog, and viewport screenshot capture succeeded.

## Result packet

- Files changed: `src/pages/MobileSectionCompactExperimentPage.tsx`, `src/App.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, task file.
- Checks run: focused App tests, typecheck, lint, build, full verify with local PostgreSQL URL, in-app Browser DOM/interaction smoke with screenshot.
- Risks: none specific to this experiment iteration.
- Follow-up: compare the square-bottom and rounded-bottom versions visually before deciding whether to apply the compact pinned header to production `LevelPage` / `SectionPage`.
