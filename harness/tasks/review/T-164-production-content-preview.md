# T-164 — Production content preview in admin editor

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-30
Branch/worktree: current workspace

## Goal

Replace the admin content editor's handmade card preview with the same learner
card renderer used in production lesson screens, so methodologist edits preview
the actual learner-facing card UI instead of an approximation.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/engineering/contributing.md`

Baseline commit for this task:
- `c95c8a3 feat(admin): добавить DB-редактор контента`

## Intended write set

- `apps/admin/src/components/admin/ContentEditor.tsx`
- `apps/admin/src/components/admin/ContentEditor.test.tsx`
- `apps/admin/src/app/globals.css`
- `apps/admin/tsconfig.json`
- `apps/admin/next.config.ts`
- `postcss.config.mjs`
- `package.json`
- `package-lock.json`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-164-production-content-preview.md`
- `harness/tasks/review/T-164-production-content-preview.md`

## Out-of-scope

- Changing lesson/content JSON wording.
- Adding a broad CMS workflow, audit log, rollback versions, RBAC, analytics,
  diagnostics, recommendations, or learner-facing admin scope.
- Reworking the production learner lesson flow outside the minimum changes
  needed to reuse its renderer.

## Plan

1. Import the production `LessonCardRenderer` into the admin content preview.
2. Configure the admin app to resolve shared learner imports and production
   learner styles.
3. Keep level/section previews lightweight; card previews must use the real
   learner card renderer.
4. Update focused admin tests to assert rich-text production rendering.
5. Run focused checks and rendered QA where practical.

## Checks

- [x] `npm run test:admin`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:admin`
- [x] Browser QA on `http://localhost:3002/content` at 1280x720 and 390x844
- [x] `git diff --check`

## Result packet

- Files changed: admin content editor, admin CSS/config/tests, Tailwind PostCSS
  setup for Next admin, package metadata, harness state.
- Checks run: `npm run test:admin`; `npm run typecheck`; `npm run lint`;
  `npm run build:admin`; Browser QA on `/login -> /content` with local backend
  `3011` and admin `3002`; `git diff --check`.
- Browser evidence: card preview now renders `LessonCardFrame` +
  `LessonCardRenderer`; computed production frame styles show `display: flex`,
  `border-radius: 20px`, `background: rgb(255, 255, 255)`, and no old
  `.admin-phone-preview` / `.admin-lesson-card-preview` classes. Selecting card
  3 in the content tree updates preview to the production categorization card
  with `.fr-auto-card-stage`. Mobile viewport no longer has document-level
  horizontal overflow (`documentScrollWidth` = `viewportWidth` = 390).
- Risks: full lesson route chrome/bottom action is still not embedded in the
  editor preview; the card surface itself is now the production renderer.
