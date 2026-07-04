# T-162 — Apply content editor to lessons 5-8

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-29
Branch/worktree: current workspace

## Goal

Apply the project `finpulse-content-editor` skill to Level 1 lessons 5-8
(`planning-and-management`) so runtime JSON and source Markdown use clearer,
methodologically aligned learner copy.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/finpulse-content-editor/references/editorial-rubric.md`

## Intended write set

- `src/content/levels/level_1_start/sections/section_02_planning_and_management.json`
- `docs/levels/level-1-start/sections/planning-and-management/lesson_01_why-reserve-matters.md`
- `docs/levels/level-1-start/sections/planning-and-management/lesson_02_reserve-target-amount.md`
- `docs/levels/level-1-start/sections/planning-and-management/lesson_03_pay-yourself-first.md`
- `docs/levels/level-1-start/sections/planning-and-management/lesson_04_budget-draft.md`
- `harness/tasks/active/T-162-apply-content-editor-lessons-5-8.md`
- `harness/tasks/review/T-162-apply-content-editor-lessons-5-8.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content model, schema, renderer, or UI behavior changes.
- New statistics or fresh source verification.
- Lessons outside У1.5-У1.8.
- Backend, admin, accounts, diagnostics, analytics, rewards, recommendations, or reminders.

## Plan

1. Inspect runtime JSON and source Markdown for lessons У1.5-У1.8.
2. Apply schema-compatible wording edits using the content editor rubric.
3. Sync every accepted copy change between JSON and source Markdown.
4. Run content validation and relevant verification.
5. Move task to review and update project state.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/content/program.test.ts`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- [x] `git diff --check`

## Result packet

- Files changed: runtime Section 2 JSON, source Markdown for lessons У1.5-У1.8,
  workboard, and this task file.
- Checks run: `npm run check:content`; `npm run test:run --
  src/content/program.test.ts`; `git diff --check`; `npm run verify` without DB
  env reached backend tests and failed with the known missing database URL
  error; rerun with `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
  passed fully. Build emitted the existing Vite/Storybook chunk-size warnings.
- Risks: no fresh verification of source statistics was requested or performed;
  statistics already present in approved source/runtime content were preserved.
- Follow-up: human editorial review can focus on tone preference only; no
  schema/product decision is required.
