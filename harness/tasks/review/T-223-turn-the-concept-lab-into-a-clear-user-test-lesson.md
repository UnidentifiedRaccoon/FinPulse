# T-223 — Turn the concept lab into a clear user-test lesson

Status: review
Owner: Codex
Started: 2026-08-19
Branch/worktree: current workspace; publish through `codex/ci/t-222-concept-lab-pages` and scoped `gh-pages` only after verification

## Goal

Make the concept-lab public entry a clean, mobile-first FinPulse lesson that an
ordinary participant can complete without seeing research terminology, while
preserving the comparison library on a separate team-only route.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/RISK_POLICY.md`
- `docs/PRODUCT.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/engineering/contributing.md`
- `src/pages/EntryPage.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/LevelPage.tsx`
- `src/features/lesson-reader/LessonScreenShell.tsx`
- `src/features/lesson-reader/LessonProgressHeader.tsx`
- `src/features/lesson-reader/LessonBottomAction.tsx`
- `docs/methodology/lore_v2/lore_story_v2_book.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `skills/tj-course-editor/SKILL.md` (Map mode, after concept freeze)
- `skills/tj-course-editor/references/source-inventory.md`
- `skills/tj-course-editor/references/adaptation-and-safety.md`
- `skills/tj-course-editor/references/mechanism-ledger.md`
- `impeccable` finish pass and independent browser review
- `demos/finpulse-concept-lab/**`

## Intended write set

- `demos/finpulse-concept-lab/src/App.tsx`
- `demos/finpulse-concept-lab/index.html`
- `demos/finpulse-concept-lab/src/components/LabHeader.tsx`
- `demos/finpulse-concept-lab/src/components/Ui.tsx`
- `demos/finpulse-concept-lab/src/routes/UserTestLessonPage.tsx`
- `demos/finpulse-concept-lab/src/routes/NotFoundPage.tsx`
- `demos/finpulse-concept-lab/src/styles.css`
- `demos/finpulse-concept-lab/src/App.test.tsx`
- `demos/finpulse-concept-lab/README.md`
- `demos/finpulse-concept-lab/design/**`
- `harness/tasks/**/T-223-turn-the-concept-lab-into-a-clear-user-test-lesson.md`
- `concept-lab/**` on the existing remote `gh-pages` publication branch only

## Out-of-scope

- No edits to canonical story or methodology sources.
- No edits to the primary learner app, admin, API, content fixtures, or database.
- No merge or push to `main`; do not trigger the Yandex Cloud workflow.
- No new backend, persistence, analytics, accounts, or external services.
- No redesign of the internal concept implementations beyond moving their
  library off the public entry route.

## Plan

1. Audit the current public flow against the accepted v1 learner journey and a
   naive-user walkthrough.
2. Freeze one concise C2-derived end-user flow and generate a complete visual
   concept before implementation.
3. Implement the clean entry and sequential lesson, leaving the research
   library available only at `/lab`.
4. Verify behavior, accessibility, mobile layout, copy safety, and visual
   fidelity against the concept.
5. Update the isolated source branch and scoped GitHub Pages artifact, then
   smoke-test the live URL without touching `main`.

## Checks

- [x] `npm --prefix demos/finpulse-concept-lab run test` — 46/46 pass
- [x] `npm --prefix demos/finpulse-concept-lab run build`
- [x] `npm run check:harness` — pass with the grandfathered T-038 warning
- [x] `npm run verify:fast` — fast iteration gate pass
- [x] Browser QA at 359, 390, 429 and 1366 CSS px; full eight-step
  wrong-answer path, URL state, reload/back, touch targets and console checked
- [x] Live GitHub Pages smoke test; new asset hash served, learner and `#/lab`
  routes pass, console clean, and the existing root report remains unchanged

## Result packet

- Files changed: the scoped concept-lab entry, learner route, route links,
  styles, tests, metadata, README, design record, generated concept and three
  browser render proofs; this task packet; remote `/concept-lab/**` artifacts.
- Checks run (pass/fail/blocked/skipped): demo tests pass 46/46; demo TypeScript
  and Vite build pass; harness check pass; `verify:fast` pass (not claimed as
  full release verification); independent learner QA pass; PR #36 full CI
  verification pass; GitHub Pages build and live smoke pass.
- Risks: the internal comparison library remains reachable at `#/lab` for the
  team and is intentionally not an access-controlled secret. The existing
  `main` push workflow still deploys Yandex Cloud, so this work must not be
  merged until that workflow has a separate protection decision.
- Follow-up: test the public lesson with participants who have no project
  context; keep PR #36 draft and protect the Yandex workflow before any future
  merge to `main`. Published artifact: Pages commit `af89267`; source commit
  `af8769d` on `codex/ci/t-222-concept-lab-pages`.
