# T-072 — Artifact variant copy alignment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Completed: 2026-06-05
Branch/worktree: existing workspace

## Goal

Remove the awkward `Мягче:` runtime prefix from artifact variants and keep long artifact variant buttons readable with left-aligned wrapping.

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
- `docs/DESIGN_SYSTEM.md`
- `polish` skill
- `build-web-apps:frontend-testing-debugging` skill

## Intended write set

- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-072-artifact-variant-copy-alignment.md`
- `harness/tasks/review/T-072-artifact-variant-copy-alignment.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Source Markdown under `docs/modules/t1-start/**`
- Backend/API/auth/progress changes
- Content schema or public TypeScript type changes
- Broad artifact or lesson-reader redesign
- Active `T-071` task ownership or task file edits

## Result

Runtime artifact variant labels no longer use the `Мягче:` prefix:

- `Замечаю хотя бы 1 трату в день`
- `Делаю паузу 1 день перед крупной желаемой покупкой`
- `Начну с любой суммы без жёсткой цели`

`ArtifactCard` variant buttons now keep text left-aligned and wrap within the card using `max-w-full`, `whitespace-normal`, `text-left`, and explicit overflow wrapping. The shared shadcn `Button`, public content schema, API, backend, auth, progress, and source Markdown were not changed.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- [x] `rg -n "Мягче:" src/content/modules/t1_start || true`
- [x] Browser smoke at 390px/360px

## Result packet

- Files changed: `src/content/modules/t1_start/units/unit_01_money_and_operations.json`, `src/content/modules/t1_start/units/unit_02_planning_and_management.json`, `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: content validation, focused app test, typecheck, lint, build, full verify with local PostgreSQL, runtime `Мягче:` search, Browser 390px/360px smoke.
- Risks: current workspace is a stacked dirty worktree with nearby T-071/T-070 review changes; this task intentionally only adds narrow copy/CSS changes on top.
- Follow-up: none for this issue.
