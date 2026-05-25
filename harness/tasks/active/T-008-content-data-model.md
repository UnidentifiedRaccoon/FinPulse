# T-008 — Content data model and Module 1 runtime content

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/content-data-model

## Goal

Introduce Program -> Module -> Unit -> Lesson -> Card content structure, split the Module 1 source lesson into durable docs, convert it to split runtime JSON, and adapt the reader UI.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/engineering/contributing.md`
- `docs/methodology/README.md`
- `docs/modules/module_1/lesson_01.md`

## Intended write set

- `docs/modules/module_1/lesson_01.md`
- `docs/modules/module_1/lesson_01/**`
- `docs/CONTENT_MODEL.md`
- `harness/schemas/content.schema.json`
- `src/content/**`
- `scripts/check-content-json.mjs`
- `examples/content/program.example.json`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/features/lesson-reader/**`
- `src/pages/**`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-008-content-data-model.md`

## Out-of-scope

- Accounts, diagnostics, rewards, analytics, backend, CMS, SSR.
- Runtime persistence of answers or progress.
- Paid or external services.

## Plan

1. [x] Split and map the source markdown into `docs/modules/module_1/lesson_01/`.
2. [x] Update content docs, JSON schema, Zod schema, and validation script for split content.
3. [x] Convert Module 1 Lesson 01 into split runtime JSON.
4. [x] Adapt the reader UI to program/module/unit/lesson/card navigation.
5. [x] Run verification and prepare PR artifacts.

## Checks

- [x] `npm run check:content`
- [x] `npm run verify`
- [x] `git diff --check`
- [x] Rendered app smoke check

## Result packet

- Files changed: source markdown split under `docs/modules/module_1/lesson_01/`; split content model docs/architecture/schema/Zod/validator/example; Module 1 runtime JSON under `src/content/modules/module_1/**`; reader pages/card renderer/content loader; task/workboard/project state.
- Checks run: `npm run check:content`; `npm run typecheck --if-present`; `npm run lint --if-present`; `npm run test:run --if-present`; `npm run build --if-present`; `npm run verify`; `git diff --check`; browser smoke on `http://127.0.0.1:5173/`; mobile viewport DOM check at 360px.
- Risks: interactive cards are rendered read-only by design; supplemental material is preserved as unit metadata rather than shown in the primary lesson flow; mobile screenshot capture timed out, but mobile DOM/viewport state was verified.
- Follow-up: publish PR `feat(content): внедрить модель модулей и карточек`.
