# T-137 — Cleanup stale design code

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree:

## Goal

Remove stale experiment/runtime code and trim clearly unused exports without changing product behavior.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- harness/PARALLEL_AGENT_PROTOCOL.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- Static audit with `knip`

## Intended write set

- src/App.tsx
- src/App.test.tsx
- src/pages/MobileLessonCardPaddingExperimentPage.tsx
- src/features/lesson-reader/card-renderers/CategorizationCard.tsx
- src/features/lesson-reader/card-renderers/MultiSelectCard.tsx
- src/features/storybook/fixtures.ts
- src/components/ui/button.tsx
- src/components/ui/dialog.tsx
- src/components/ui/field.tsx
- src/components/ui/popover.tsx
- src/shared/ui/Mascot.tsx
- server/db/connection.ts
- server/db/progressRepository.ts
- server/db/query.ts
- server/db/reflectionAnswersRepository.ts
- server/lib/sessions.ts
- src/api/client.ts
- src/content/program.ts
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md
- harness/tasks/active/T-137-cleanup-stale-design-code.md
- harness/tasks/review/T-137-cleanup-stale-design-code.md

## Out-of-scope

- Active T-136 route-loading skeleton work
- Content JSON/source content
- shadcn primitive redesigns or styling changes
- Dependency changes

## Plan

1. Remove the stale `/design/lesson-card-full-width` standalone route and page.
2. Update App tests so the removed route is covered by the existing not-found guard.
3. Make internally used helpers/types local where `knip` reported unused external exports.
4. Run typecheck, lint, focused App tests, runtime import check, and `knip`.

## Checks

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run check:runtime-imports`
- [x] `npx --yes knip@latest --reporter compact`
- [x] `npm run build`
- [x] `npm run build:storybook`
- [x] `npm run verify` attempted; stopped at backend tests because this shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.

## Result packet

- Files changed: removed stale `src/pages/MobileLessonCardPaddingExperimentPage.tsx`; updated `src/App.tsx` and `src/App.test.tsx` so `/design/lesson-card-full-width` is a removed route; trimmed unused external exports across selected UI, lesson-reader, Storybook fixture, API/content, and backend files.
- Checks run: typecheck, lint, focused App tests, runtime import guard, `knip`, production build, Storybook build, and attempted full verify.
- Risks: full verify could not complete backend suites without a PostgreSQL test URL; focused and build checks passed.
- Follow-up: active T-136 skeleton work remains separate and should be completed or explicitly cancelled.
