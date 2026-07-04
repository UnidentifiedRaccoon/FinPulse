# T-171 — Admin content preview screen sync

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Branch/worktree: current workspace

## Goal

Make the admin content editor preview open the selected lesson card instead of
always opening the first card, rename publish copy to save copy, and protect
unsaved JSON edits when switching content tree selection. Extend the preview
reset control so it clears only the current learner screen instead of remounting
the whole route, and remove unclear content-tree refresh / JSON revision UI.

## Intended write set

- `apps/admin/src/components/admin/ContentEditor.tsx`
- `apps/admin/src/components/admin/ContentEditor.test.tsx`
- `apps/admin/src/components/admin/AdminDashboard.test.tsx`
- `apps/admin/src/components/admin/UserProgressDetail.test.tsx`
- `src/app/LearnerAppShell.tsx`
- `src/pages/LessonPage.tsx`
- `src/features/lesson-reader/LessonScreenShell.tsx`
- `src/features/lesson-reader/LessonSession.tsx`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-171-admin-content-preview-screen-sync.md`

## Out of scope

- Admin API changes.
- Content JSON/schema changes.
- Public learner route or URL contract changes.
- Two-way preview-to-tree synchronization.
- Commits, pushes, or PRs.

## Checks

- [x] `npm run test:admin`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run test:run -- apps/admin/src/components/admin/ContentEditor.test.tsx`
- [x] `npm run test:run -- apps/admin/src/components/admin/UserProgressDetail.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`

## Result packet

- Files changed: admin content editor/tests, admin progress-detail test fixtures, learner shell/page/session/screen shell, project state, this task file.
- Checks run: `npm run test:admin`, focused content editor and progress-detail admin tests, focused lesson renderer test, `npm run typecheck`, `npm run lint`, `git diff --check`.
- Risks: reset is intentionally a no-op outside lesson routes because level/section previews do not have a current learner card state.
