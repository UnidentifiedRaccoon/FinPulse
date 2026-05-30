# T-031 — Methodology content system

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Turn `docs/methodology/README.md` from one large methodology source into a maintainable source split, inventory/backlog, and a minimal MVP-safe runtime content update only if it fits the existing schema and UI.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `docs/methodology/finpulse_methodology/**`
- `docs/methodology/CONTENT_BACKLOG.md`
- `src/content/program.json`
- `src/content/modules/module_2/**`
- `server/app.test.ts`
- `harness/tasks/review/T-031-methodology-content-system.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content schema changes.
- Frontend/UI changes.
- Backend/admin/CMS work.
- Accounts, diagnostics, rewards, analytics, personalization, production financial operations.
- Unknown card types such as `sorting`, `matching`, `dialogue`, `calculator`, or `multiple_choice` in runtime JSON.
- Deleting or shrinking the original methodology source.

## Plan

1. Preserve the full original methodology source in a split catalog.
2. Split the methodology into stable source files with a map.
3. Inventory source fragments against current runtime content.
4. Add only a small runtime slice that uses existing card types, if a safe candidate exists.
5. Document schema/UI gaps and backlog recommendations.
6. Run content/runtime import checks and full verification if runtime JSON changes.

## Checks

- [x] `npm run check:content`
- [x] `npm run check:runtime-imports`
- [x] `npm run verify` because runtime JSON changed
- [x] frontend runtime code direct JSON import guard
- [x] route/API smoke for existing and new content

## Result packet

- Files changed: `docs/methodology/finpulse_methodology/**`, `docs/methodology/CONTENT_BACKLOG.md`, `src/content/program.json`, `src/content/modules/module_2/**`, `server/app.test.ts`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `npm run check:content`; `npm run check:runtime-imports`; `npm run verify`; Browser smoke for `/program`, `/modules/financial-goals`, `/lessons/pause-before-purchase`, `/modules/budget-without-shame`, `/lessons/budget-as-choice-map`; direct API smoke for `/api/modules/budget-without-shame` and `/api/lessons/budget-as-choice-map`.
- Risks: the module route currently emphasizes the first unit title more than the module title; the new lesson route and program card display the new module content. Rich methodology patterns still need future schema/UI decisions.
- Follow-up: decide whether `sorting` and `matching` should become first-class card types, and separately decide whether persisted artifacts are in scope.
