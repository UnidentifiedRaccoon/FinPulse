# T-138 — Skeleton geometry alignment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree:

## Goal

Align high-priority route loading skeleton geometry with the actual rendered UI so skeleton-to-content transitions do not create visible layout jumps.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- shadcn skeleton guidance
- T-136 route loading skeletons

## Intended write set

- src/shared/ui/RouteLoadingSkeletons.tsx
- src/features/lesson-reader/LessonSession.tsx
- src/App.test.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md
- harness/tasks/active/T-138-skeleton-geometry-alignment.md
- harness/tasks/review/T-138-skeleton-geometry-alignment.md

## Out-of-scope

- Public API, routes, backend, and content JSON changes
- New loading libraries or visible learner-facing loading text
- Profile/auth/design-experiment skeletons
- Future multi-level or multi-section skeleton generalization

## Plan

1. Align program skeleton card count, wrapper structure, and card content height with the actual program overview.
2. Align path skeleton header, divider, node count, and node offsets with the actual level/section path UI.
3. Replace lesson card-change scroll reset with page-level `window.scrollTo`.
4. Update focused route-loading and lesson-scroll tests.
5. Run focused/project verification and repeat visual QA.

## Checks

- [x] npm run typecheck
- [x] npm run lint
- [x] npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify
- [x] Visual QA hold/release at 390x844 and 1280x900

## Result packet

- Files changed: aligned `ProgramOverviewSkeleton` and `PathPageSkeleton` geometry in `src/shared/ui/RouteLoadingSkeletons.tsx`; changed ordinary lesson card-change scroll reset in `src/features/lesson-reader/LessonSession.tsx` to page-level `window.scrollTo`; updated focused skeleton and scroll-reset tests.
- Checks run: focused App + lesson-reader tests, typecheck, lint, full verify with local PostgreSQL URL, and Browser visual QA with delayed API endpoints.
- Visual QA: all 8 route/viewport pairs passed geometry, visible-loading-text, and horizontal-overflow checks. Screenshots and report: `/tmp/finpulse-skeleton-qa-2026-06-14T04-18-28-275Z/`.
- Risks: skeleton counts are intentionally optimized for current MVP content: one program level and two lessons in the active section.
