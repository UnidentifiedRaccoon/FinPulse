# T-034 — 01.01 Content Scope Cleanup

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Keep runtime learner content aligned with the factual Finzdorov Module 01 source currently documented for block `01.01 Ваши базовые ценности`.

`01.01 Ваши базовые ценности` should be the first section/unit of Module 1 and contain the current adapted lesson path. Runtime content outside this factual/adapted block should be removed for now.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- User confirmed Finzdorov has Module 01 with blocks 01.00-01.05, but detailed methodology currently exists only for `01.01 Ваши базовые ценности`.

## Intended write set

- `src/content/program.json`
- `src/content/modules/module_1/module.json`
- `src/content/modules/module_1/units/unit_02_impulsive_purchases.json`
- `src/content/modules/module_2/**`
- `server/app.test.ts`
- `docs/methodology/CONTENT_BACKLOG.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-034-0101-content-scope-cleanup.md`

## Out-of-scope

- Creating content for `01.02 Видение будущего`, `01.03 Финансовые цели`, or `01.04 Мотивация достижения целей`.
- Changing content schema, routing, backend API contracts, or UI layout patterns.
- Deleting preserved source methodology documents unless they are runtime references that now need correction.

## Plan

1. Remove non-01.01 runtime module/unit references.
2. Keep Module 1 with one unit/section: `Ваши базовые ценности`.
3. Update API/content tests to assert only the retained factual runtime path.
4. Update harness state and run verification.

## Checks

- [x] npm run check:content
- [x] npm run test:run -- server/app.test.ts src/App.test.tsx
- [x] npm run verify
- [x] Browser smoke on `/program`, `/modules/financial-goals`, `/lessons/why-values-matter`

## Result packet

- Files changed: `src/content/program.json`, `src/content/modules/module_1/module.json`, `src/content/modules/module_1/units/unit_01_values_and_goals.json`, removed `src/content/modules/module_1/units/unit_02_impulsive_purchases.json`, removed `src/content/modules/module_2/**`, `server/app.test.ts`, `src/App.test.tsx`, `docs/methodology/CONTENT_BACKLOG.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `npm run check:content`; `npm run test:run -- server/app.test.ts src/App.test.tsx`; `npm run verify`; Browser smoke on local dev server for `/program`, `/modules/financial-goals`, and `/lessons/why-values-matter`.
- Risks: existing workspace contains unrelated uncommitted review-task changes; T-034 worked with them and did not revert them.
- Follow-up: prepare factual content for `01.02 Видение будущего` as the next Module 1 section when source methodology is ready.
