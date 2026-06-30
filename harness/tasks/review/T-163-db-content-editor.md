# T-163 — DB-backed content editor

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-30
Branch/worktree: current workspace

## Goal

Move runtime educational content to PostgreSQL JSONB documents and add an
internal admin content editor with live preview and guarded direct publishing.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/DECISIONS.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `server/db/**`
- `server/modules/content/**`
- `server/modules/admin/**`
- `server/app.ts`
- `server/**/*.test.ts`
- `scripts/**`
- `package.json`
- `apps/admin/src/**`
- `docs/DECISIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/PRODUCT.md`
- `docs/operations/yandex-cloud-finpulse-deploy.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-163-db-content-editor.md`
- `harness/tasks/review/T-163-db-content-editor.md`

## Out-of-scope

- Changing the approved `Program -> Level -> Section -> Lesson -> Card`
  hierarchy.
- Reintroducing `Module -> Unit` runtime/API names.
- Editing lesson wording or methodology content beyond using current JSON as
  seed input.
- GitHub PR workflow, audit log, rollback versions, RBAC, organizations,
  analytics, diagnostics, rewards, recommendations, or production financial
  operations.

## Plan

1. Add ADR/docs for PostgreSQL JSONB runtime content and admin editing.
2. Add content tables, repository, seed/check scripts, and DB-backed content service.
3. Preserve public content API response shapes.
4. Add authenticated admin content tree/preview/update endpoints.
5. Add Next.js admin content editor UI with JSON slice editor and preview.
6. Add tests and run focused/full verification where available.

## Checks

- [x] `npm run content:seed`
- [x] `npm run check:content`
- [x] `npm run check:content:db`
- [x] `npm run content:pull`
- [x] focused backend/admin tests
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:web`
- [x] `npm run build:admin`
- [x] `npm run verify`
- [x] `git diff --check`

## Result packet

- Files changed: content DB schema/repository/service/seed scripts, admin content API, admin `/content` editor UI/tests, docs/ADR/deploy/harness updates.
- Checks run: `npm run content:seed`; `npm run check:content`; `npm run check:content:db`; `npm run content:pull`; `npm run typecheck`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts`; `npm run test:admin`; `npm run lint`; `npm run build:web`; `npm run build:admin`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`; `git diff --check`.
- Risks: admin preview is an admin-side approximation for compact review rather than a direct import of the learner `LessonCardRenderer`; DB content graph is cached per backend process and refreshes on admin writes in that process, so external DB edits may require restart or later invalidation work; direct production edits intentionally do not have audit/rollback/PR history in this MVP.
- Follow-up: when methodologist editing expands, consider real learner renderer reuse in admin preview, audit/rollback policy, and a production-safe content export/import runbook.
