# Workboard

This is a lightweight coordination board for human and agent work.

Statuses:
- `planned`
- `active`
- `blocked`
- `review`
- `done`

## Planned seed tasks

These are suggestions. The orchestrator may split or reorder them.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-001 | done | Scaffold Vite React TS app | `package.json`, `src/**`, config files | Initial scaffold is in place. |
| T-002 | done | Install Tailwind + shadcn/ui | styling config, `components.json` | Tailwind v4 and shadcn/ui initialized. |
| T-003 | done | Add content model and example content | `src/content/**`, `docs/**` | Initial JSON content and source docs are in place. |
| T-004 | done | Add routing and pages | `src/**` | Overview/module/lesson routes are in place. |
| T-005 | done | Add lesson block renderer | `src/**` | Initial heading/paragraph/list/callout renderer is in place. |
| T-006 | done | Add mobile app shell | `src/**` | Mobile-first shell is in place. |
| T-007 | done | Add first component tests | test files, test config | Initial Vitest coverage is in place. |

## Active tasks

Use files under `harness/tasks/active/` for real active work.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| _none_ |  |  |  |  |

## Review tasks

Use task files and PR/diff summaries.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-016 | review | Lesson card experience | `src/features/lesson-reader/**`, `src/pages/LessonPage.tsx`, focused tests, `harness/tasks/**`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md` | Focused lesson session UI implemented; `npm run verify` and browser smoke passed; backend/API contract unchanged. |

## Done tasks

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-008 | done | Content data model and Module 1 runtime content | `docs/modules/module_1/lesson_01*`, `docs/CONTENT_MODEL.md`, `harness/schemas/content.schema.json`, `src/content/**`, `scripts/check-content-json.mjs`, `examples/content/program.example.json`, `src/**`, task/state docs | Merged in PR #2. |
| T-009 | done | Interactive lesson cards | `src/features/lesson-reader/**`, focused tests, `docs/CONTENT_MODEL.md`, first-unit content, task/workboard state | Merged in PR #4; interactions remain local React state only. |
| T-010 | done | Decide Stage 2 backend scope | `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, `docs/CONTENT_MODEL.md`, `harness/tasks/**`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md` | ADR-0006 accepted Fastify + SQLite backend scope before implementation; `npm run verify` passed. |
| T-011 | done | Build Stage 2 backend API | `server/**`, `package.json`, lockfile, backend tests, `.env.example`, scripts/tsconfig as needed | Fastify + SQLite auth/content/progress API implemented; `npm run verify` passed. |
| T-012 | done | Migrate frontend to backend API | `src/**`, focused frontend tests, `vite.config.ts` | SPA pages use backend content API; auth controls and progress writes wired; `npm run verify` passed. |
| T-013 | done | Stage 2 verification and PR polish | docs/harness updates, README, PR evidence | Security/content reviews and browser smoke passed; final `npm run verify` passed. |
| T-015 | done | Clean friendly-learning design system | `docs/DESIGN_SYSTEM.md`, `harness/**` | Friendly-learning design-system draft adapted to FinPulse; MVP-safe lesson/card guidance kept, rewards/streaks/challenges deferred. |
