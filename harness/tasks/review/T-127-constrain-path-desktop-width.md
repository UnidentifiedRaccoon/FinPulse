# T-127 — Constrain path desktop width

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-13
Updated: 2026-06-13

## Goal

Bring level/section lesson-path routes back into the same desktop container rhythm as program and lesson surfaces: mobile stays full-width, while desktop/tablet path content is centered and bounded instead of stretching to the viewport.

## Write set

- `src/App.tsx`
- `src/App.test.tsx`
- `harness/tasks/review/T-127-constrain-path-desktop-width.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/source edits.
- Learning-path interaction changes.
- Header redesign beyond container width behavior.
- Branches, commits, pushes, or PRs.

## Changes

- Changed the authenticated `/levels/**` app shell branch from `max-w-none` to `max-w-[720px]`, while preserving `w-full`, `px-0`, and `py-0`. Mobile remains edge-to-edge because the viewport is narrower than the max width; wider viewports now center the path route.
- Updated App tests to pin the bounded shell contract for both level and section path routes.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `git diff --check`
- [x] Browser visual/DOM smoke on `http://localhost:5173/levels/level-1-start` at 973x1075 with a completed-level QA user: `main`, compact header, path region, and completion card all measured `width=720`, `x=126.5`; `documentScrollWidth=973`; console warnings/errors empty; lesson dialog opens from a completed lesson node.
- [ ] Full `npm run verify`. It reached backend tests after content validation, runtime import guard, typecheck, and lint, then failed because this shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.

## Result packet

- Files changed: `src/App.tsx`, `src/App.test.tsx`, harness task/state files.
- Checks run: see above.
- Risks: this intentionally changes desktop/tablet width for all authenticated `/levels/**` routes; standalone design routes and lesson reader full-width mobile behavior are unchanged.
- Follow-up: rerun full verify with a PostgreSQL test DB URL when available.
