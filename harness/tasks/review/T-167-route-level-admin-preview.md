# T-167 - Route-level admin learner preview

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Completed: 2026-07-04
Branch/worktree: current workspace

## Goal

Embed the real learner route runtime inside the admin `/content` editor preview,
using the current DB-backed content graph plus the valid unsaved JSON editor
slice, while keeping learner progress/reflection persistence disabled.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`

Existing base:
- T-164/T-165 already moved admin card preview to shared production learner
  card/shell components.
- T-166 is already used for the financial-literacy expert skill, so this task
  uses T-167.

## Intended write set

- `src/App.tsx`
- `src/app/LearnerAppShell.tsx`
- `src/app/learnerRoutes.ts`
- `src/api/contentClient.ts`
- `src/api/publicContentClient.ts`
- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/LevelPage.tsx`
- `src/pages/SectionPage.tsx`
- `src/pages/LessonPage.tsx`
- `src/pages/EntryPage.tsx`
- `apps/admin/src/components/admin/ContentEditor.tsx`
- `apps/admin/src/components/admin/ContentEditor.test.tsx`
- `apps/admin/src/app/globals.css`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-167-route-level-admin-preview.md`
- `harness/tasks/review/T-167-route-level-admin-preview.md`

## Out of scope

- Backend route changes.
- Auth/login/register preview flows.
- Persisting learner progress or reflection answers from admin preview.
- Audit log, rollback, RBAC, analytics, diagnostics, recommendations, or
  learner app migration to Next.js.

## Result

- Extracted the learner route shell into `LearnerAppShell`, keeping production
  on `BrowserRouter` and the public content API client.
- Added a `LearningContentClient` provider/query layer and moved learner content
  pages off direct global content API imports.
- Replaced the admin one-card preview with an embedded `MemoryRouter` learner
  runtime, using an in-memory overlaid program graph and a synthetic preview
  user.
- Added live valid JSON overlay behavior for level, section, and card slices.
  Invalid JSON or protected card field mismatches keep the last valid preview
  graph and show the editor error.
- Added local-only preview progress/reflection state so lessons can be clicked
  through without calling learner auth/progress/reflection backend endpoints.
- Updated admin tests to cover route-level preview rendering, live unsaved card
  edits, route navigation, lesson interaction, completion, and no backend
  progress/reflection calls.

## Checks

- [x] `npm run test:admin`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:admin`
- [x] `npm run build:web`
- [x] `npm run check:content`
- [x] `git diff --check`

## Browser QA

Ran local backend on `3017` and production admin build on `3018` with the admin
API rewrite pointed at the backend.

Verified on `/content`:
- route-level preview renders the real learner lesson route;
- lesson interactions can be clicked through to `Урок пройден`;
- preview route navigation works for lesson, level, and program routes;
- invalid JSON keeps the last valid preview graph and shows the editor error;
- reset route preview returns to the selection-derived lesson route;
- backend logs show only admin auth/tree/preview endpoints during preview use,
  with no `/api/progress` or `/api/reflections` calls;
- desktop `1280px` and mobile `390px` viewport checks have no document/body or
  preview horizontal overflow.

The browser adapter exposed viewport control and DOM checks but not a screenshot
capture method in this session.

## Follow-up fix

After visual review, program/level route previews were missing parts of the
production Tailwind styling because the admin CSS build only scanned the old
card-preview surface (`src/features/lesson-reader`) plus shared buttons. Route
preview now renders learner pages and `src/features/program-navigation`, so the
admin stylesheet must include those sources too.

Changes:
- added admin Tailwind `@source` entries for `src/app`, `src/pages`,
  `src/features/program-navigation`, and `src/shared`;
- imported the learner font package in admin CSS and scoped the production
  learner font to `.admin-route-preview-shell`;
- removed the embedded-preview layout override from `LearnerAppShell` so the
  shared route shell uses the same main width/padding classes as production,
  while still suppressing production desktop/mobile chrome.

Follow-up checks:
- [x] `npm run build:admin`
- [x] `npm run typecheck`
- [x] `git diff --check`
