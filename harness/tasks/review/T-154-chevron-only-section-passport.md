# T-154 — Chevron Only Section Passport

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28
Branch/worktree: current workspace

## Goal

Refine the section passport UI so the collapsed state shows only a small
chevron under the section heading. The full section description should appear
only after the chevron is tapped.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/tasks/review/T-153-section-passport-description.md`

## Intended write set

- `src/features/program-navigation/LessonPathMap.tsx`
- `src/App.test.tsx`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- this task file

## Out-of-scope

- Runtime content edits.
- Content schema/model changes.
- Sticky header behavior changes.
- Lesson content, API, persistence, auth, admin, analytics, rewards, or
  diagnostics.

## Plan

1. Replace the collapsed text preview with an icon-only chevron trigger.
2. Render the section description only in the expanded state.
3. Update focused App tests and run validation.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [x] `npm run build:web`

## Result packet

- Files changed:
  - `src/features/program-navigation/LessonPathMap.tsx`
  - `src/App.test.tsx`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - this task file
- Checks run:
  - `npm run test:run -- src/App.test.tsx` — pass, 38 tests.
  - `npm run typecheck` — pass.
  - `npm run lint` — pass.
  - `git diff --check` — pass.
  - `npm run build:web` — pass.
- Risks:
  - Visual QA was covered by focused App tests and web build, not by a browser
    screenshot pass.
- Follow-up:
  - If the chevron feels too small on device, increase the hit area while
    keeping the icon itself visually quiet.
