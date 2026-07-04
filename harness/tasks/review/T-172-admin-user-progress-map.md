# T-172 — Admin user progress map

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Branch/worktree: current workspace

## Goal

Reformat the admin user detail panel from a flat lesson list into a learning
path map that clearly shows Level -> Section -> Lesson -> Screen progress.

## Intended write set

- `server/modules/admin/routes.ts`
- `apps/admin/src/lib/types.ts`
- `apps/admin/src/components/admin/UserProgressDetail.tsx`
- `apps/admin/src/components/admin/UserProgressDetail.test.tsx`
- `apps/admin/src/app/globals.css`
- `server/app.test.ts`
- `harness/tasks/review/T-172-admin-user-progress-map.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- Private reflection/artifact answer text.
- Diagnostics, scoring, analytics dashboards, recommendations, RBAC, or org
  filtering.
- Learner app route changes.
- Content JSON/schema changes.
- Commits, pushes, or PRs.

## Checks

- [x] `npm run test:admin`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts -t "returns read-only admin progress summaries without private reflection answer text"`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:admin`
- [x] `git diff --check`
- [x] `npm run test:run -- server/app.test.ts` attempted without DB env and reproduced the known backend-test DB URL requirement.
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts` attempted; admin read-model test passed after making that assertion content-count agnostic, but full suite still fails in the existing content API shape test because parallel content work exposes 16 lessons / 4 sections while the old assertion expects the earlier smaller graph.

## Result packet

- Files changed: admin progress API route/types, `UserProgressDetail` UI/tests/styles, admin read-model backend test, workboard/project-state/task docs.
- Checks run: see above.
- Risks: full backend suite remains affected by parallel content-fixture drift outside this task; no private answer fields were added.
