# T-044 — Compact 01.01 values runtime

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Completed: 2026-05-30
Branch/worktree: main

## Goal

Compact `01.01 Ваши базовые ценности` so the runtime section is comparable to `01.02`-`01.04`: four focused lessons instead of eight, without changing schema, API, UI renderer, or mixing content into other sections.

## Context

Files/docs read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `src/content/modules/module_1/units/unit_01_values_and_goals.json`
- `docs/modules/module_1/lesson_01/README.md`
- `docs/modules/module_1/lesson_01/01_methodical_packaging.md`
- `docs/modules/module_1/lesson_01/outcome.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `server/app.test.ts`
- `server/content-contract.test.ts`
- `src/App.test.tsx`

## Intended write set

- `src/content/modules/module_1/units/unit_01_values_and_goals.json`
- `docs/modules/module_1/lesson_01/README.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `server/app.test.ts`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-044-compact-0101-values-runtime.md`
- `harness/tasks/review/T-044-compact-0101-values-runtime.md`

## Out-of-scope

- Changing content schema, card types, backend API, auth, progress, or UI renderers.
- Moving content between `01.01`, `01.02`, `01.03`, and `01.04`.
- Editing the active T-043 UI task files outside tests/harness coordination.

## Result packet

- Files changed:
  - `src/content/modules/module_1/units/unit_01_values_and_goals.json`
  - `docs/modules/module_1/lesson_01/README.md`
  - `docs/methodology/CONTENT_BACKLOG.md`
  - `server/app.test.ts`
  - `src/App.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-044-compact-0101-values-runtime.md`
- Checks run:
  - `npm run check:content`
  - `npm run test:run -- server/app.test.ts server/content-contract.test.ts src/App.test.tsx`
  - `npm run verify`
  - Browser smoke on `http://127.0.0.1:5175/modules/financial-goals`
  - Browser smoke on `http://127.0.0.1:5175/lessons/why-values-matter`
  - Browser smoke on `http://127.0.0.1:5175/lessons/practice-1m`
- Risks:
  - Former `01.01` direct lesson slugs outside the compact path are no longer runtime lesson routes; their source slices remain in `docs/modules/module_1/lesson_01/`.
  - `practice-1m` now includes family-value interaction before the 1M$ artifact to preserve section 21 without adding a fifth lesson.
- Follow-up:
  - None required for this compaction task.
