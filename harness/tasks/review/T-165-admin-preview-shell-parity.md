# T-165 — Admin preview lesson shell parity

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-30
Branch/worktree: current workspace

## Goal

Make the admin content preview render the same production lesson screen
composition as the learner app, not just the production card body.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

Existing base:
- T-164 already changed the admin card preview to reuse production
  `LessonCardFrame` and `LessonCardRenderer`.
- T-164 leaves the full lesson route chrome/bottom action as a known remaining
  risk.

## Intended write set

- `src/features/lesson-reader/LessonScreenShell.tsx`
- `src/features/lesson-reader/LessonProgressHeader.tsx`
- `src/features/lesson-reader/lessonActions.ts`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/styles/lesson-reader.css`
- `src/index.css`
- `apps/admin/src/app/globals.css`
- `apps/admin/src/components/admin/ContentEditor.tsx`
- `apps/admin/src/components/admin/ContentEditor.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-165-admin-preview-shell-parity.md`
- `harness/tasks/review/T-165-admin-preview-shell-parity.md`
- `harness/artifacts/T-165-admin-preview-shell/**`

## Out-of-scope

- Changing lesson/content JSON.
- Adding backend scope or changing content publication semantics.
- Adding admin accounts, RBAC, analytics, rollback/audit workflows, or broad CMS
  features.
- Reintroducing Program -> Module -> Unit terminology.

## Plan

1. Extract shared production lesson action metadata from `LessonSession`.
2. Extract a production lesson screen shell from `LessonSession`.
3. Use that shell from both the learner lesson flow and admin card preview.
4. Replace duplicated admin learner tokens/animations with a shared CSS
   entrypoint imported by both apps.
5. Update admin tests for shell/header/goal/bottom-action parity.
6. Capture before/after screenshots and run required checks.

## Checks

- [x] `npm run test:admin`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:admin`
- [x] `npm run build`
- [x] `npm run check:content`
- [x] `git diff --check`
- [x] Browser/Playwright visual parity loop

## Result packet

- Files changed: shared lesson shell/action helper, learner session/header,
  shared learner CSS entrypoint, admin content preview/tests/CSS, harness
  artifacts/state.
- Checks run: `npm run test:admin`; `npm run typecheck`; `npm run lint`;
  `npm run build:admin`; `npm run build`; `npm run check:content`;
  `git diff --check`; in-app Browser Playwright screenshot/DOM parity loop.
- Screenshot artifacts:
  `harness/artifacts/T-165-admin-preview-shell/screenshots/before/` and
  `harness/artifacts/T-165-admin-preview-shell/screenshots/after/`.
- Risks: admin preview bottom action is intentionally read-only/no-op; admin
  editor chrome and scroll position remain different from the learner app.
- Follow-up: reviewer found generated `apps/admin/next-env.d.ts` churn after
  `next build`; fixed by restoring the original dev route-types import and
  rerunning `npm run typecheck`, `npm run test:admin`, `npm run lint`, and
  `git diff --check`.
