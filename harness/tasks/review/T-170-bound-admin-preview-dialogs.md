# T-170 - Bound admin preview dialogs

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Completed: 2026-07-04
Branch/worktree: current workspace

## Goal

Keep learner dialogs opened inside the admin `/content` embedded preview instead
of letting Radix portals cover the whole admin browser window.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`

Existing base:
- T-167 embeds real learner routes in admin preview through `LearnerAppShell`.
- Lesson path lesson-node dialogs use shared `src/components/ui/dialog.tsx`.
- Current shared dialog portal defaults to `document.body`, which is correct for
  production but too broad inside admin preview.
- T-169 is active on content files; this task avoids those files.

## Intended write set

- `src/components/ui/dialog.tsx`
- `apps/admin/src/components/admin/ContentEditor.tsx`
- `apps/admin/src/components/admin/ContentEditor.test.tsx`
- `apps/admin/src/app/globals.css`
- `harness/tasks/active/T-170-bound-admin-preview-dialogs.md`
- `harness/tasks/review/T-170-bound-admin-preview-dialogs.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- Changing learner production dialog behavior.
- Replacing Radix/shadcn dialog primitives.
- Changing lesson content or path data.
- Persisting admin preview route state.

## Result

- Added `DialogPortalBoundaryProvider` to the shared dialog primitive.
- Bounded dialogs still portal through Radix, but their fixed overlay/content
  positions are measured from the provided preview boundary rect.
- Production dialogs keep existing fullscreen viewport behavior when no boundary
  provider is present.
- Admin route preview now provides its `.admin-route-preview-shell` as the
  boundary, so lesson-node dialogs visually stay inside the preview pane.
- Bounded dialog content width is capped to `boundary width - 32px`, preventing
  the production `420px` modal width from spilling outside narrower preview
  panes.
- Admin tests cover bounded overlay/content attributes and measured styles.

## Checks

- [x] `npm run test:admin`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `FINPULSE_API_PORT=3027 npm run build:admin`
- [x] `git diff --check`

## Browser QA

Ran a local backend on `3027` and a production admin build on `3028`.

Flow under test:
`/content` -> embedded learner level preview -> click lesson node -> lesson
dialog opens inside preview.

Observed:
- page identity: `ФинПульс Admin` at `/content`;
- no framework/runtime overlay;
- dialog and overlay have `data-dialog-bounded="true"`;
- overlay rect exactly matched preview rect: `358x608` at `(903, 140)`;
- dialog rect was fully inside preview rect after width capping: `326x228` at
  `(919, 330)`;
- QA servers were stopped after validation.
