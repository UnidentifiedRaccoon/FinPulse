# T-160 — Apply lesson review edits

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-28
Branch/worktree: main

## Goal

Implement the selected review edits for Level 1 Section 1 lessons 1-4, including
content schema/UI support for per-card feedback titles and retry-only feedback.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/engineering/contributing.md`
- Google Doc `1gbMnicaSakeBOtJlZTgPXoYThxFoaQGCn428CR_ul88`
- `docs/levels/level-1-start/sections/money-and-operations/lesson_01_04_replacement_table.md`

## Intended write set

- `src/content/program.ts`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/features/lesson-reader/**`
- `src/content/program.json`
- `src/content/levels/level_1_start/level.json`
- `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `docs/levels/level-1-start/sections/money-and-operations/lesson_0*.md`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Out-of-scope

- Welcome/onboarding screen.
- Unselected replacement-table items 1, 4-6, and 127-129.
- Commit, push, or PR creation.
- New backend/admin/product scope.

## Plan

1. Add `feedbackTitle`, `retryFeedbackTitle`, and `retryFeedback` to the content schema, validator, docs, and UI fallback logic.
2. Integrate selected content edits for lessons 1-4 into the shared Section 1 runtime JSON.
3. Sync the source Markdown lesson files with the runtime wording.
4. Run content validation, focused tests, typecheck, lint, web build, diff check, and best-effort verify.
5. Move the task to review with a concise result packet.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/content/program.test.ts`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/content/program.test.ts src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:web`
- [x] `git diff --check`
- [!] `npm run verify` — content validation, runtime import guard, typecheck, lint, and 108 non-backend tests passed; 19 backend tests failed because this shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.

## Result packet

- Files changed: content schema/types/validator; lesson reader feedback UI; lesson renderer/App tests; Level 1 program/level/section JSON; source Markdown for lessons 1-4; content model and authoring docs; harness state.
- Checks run: `npm run check:content`; focused renderer/content/App tests; `npm run typecheck`; `npm run lint`; `npm run build:web`; `git diff --check`; best-effort `npm run verify`.
- Risks: full backend verification still needs a PostgreSQL test DB URL; `build:web` emits the existing Vite chunk-size warning.
- Follow-up: rerun `npm run verify` in an environment with `FINPULSE_TEST_DATABASE_URL`.
