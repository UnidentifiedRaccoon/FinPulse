# T-136 — Route loading skeletons

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree:

## Goal

Replace high-priority learner-facing route loading text panels with layout-stable skeletons.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- shadcn skeleton guidance via `npx shadcn@latest add skeleton`

## Intended write set

- src/components/ui/skeleton.tsx
- src/shared/ui/RouteLoadingSkeletons.tsx
- src/pages/ProgramOverviewPage.tsx
- src/pages/LevelPage.tsx
- src/pages/SectionPage.tsx
- src/pages/LessonPage.tsx
- src/App.test.tsx
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md
- harness/tasks/review/T-136-route-loading-skeletons.md

## Out-of-scope

- Profile/auth/design-experiment skeletons
- Backend/API/content JSON changes
- Error and empty state redesigns

## Plan

1. Add the shadcn/ui Skeleton primitive.
2. Add shared route skeleton shells for program, path, and lesson loading states.
3. Replace the four high-priority loading PageState branches.
4. Add focused tests for skeleton visibility and hidden loading copy.
5. Run focused and project verification, then browser smoke.

## Checks

- [x] npm run typecheck
- [x] npm run lint
- [x] npm run test:run -- src/App.test.tsx
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify
- [x] Browser smoke

## Result packet

- Files changed: added `src/components/ui/skeleton.tsx` and `src/shared/ui/RouteLoadingSkeletons.tsx`; replaced loading branches in `ProgramOverviewPage`, `LevelPage`, `SectionPage`, and `LessonPage`; added focused route-loading tests in `src/App.test.tsx`; updated harness state.
- Checks run: `npm run typecheck`; `npm run lint`; `npm run test:run -- src/App.test.tsx`; plain `npm run verify` first confirmed the documented missing-DB-env precondition; full verify passed with explicit local `FINPULSE_TEST_DATABASE_URL`; in-app Browser smoke passed on `/program`, `/levels/level-1-start`, `/levels/level-1-start/sections/money-and-operations`, and `/lessons/where-money-goes` at 390px and 1280px.
- Risks: Browser smoke can only observe transient skeletons when the real API is slow enough; delayed loading behavior is covered by focused Vitest tests.
- Follow-up: none for the high-priority routes. Profile/auth/design-experiment skeletons remain intentionally out of scope.
