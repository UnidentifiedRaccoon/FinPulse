# T-110 — Level/section docs alignment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-10
Branch/worktree: current workspace

## Goal

Align harness and project documentation with the approved methodology hierarchy:

```txt
Program -> Level -> Section -> Lesson -> Card
```

Keep this pass documentation-focused. Do not migrate runtime JSON, TypeScript
types, validators, API routes, or persisted progress/reflection keys.

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

## Intended write set

- `AGENTS.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/METHODOLOGY.lesson-authoring-updated.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `docs/methodology/README.md`
- `docs/QA_USER_SCENARIO_MAP.md`
- `harness/FEATURE_MATRIX.json`
- `harness/prompts/*.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- this task file

## Out-of-scope

- Runtime JSON path/schema migration from `modules`/`units` to
  `levels`/`sections`.
- API route migration from `/api/modules` and `/api/units`.
- TypeScript model, validator, app route, server route, and database changes.
- Broad machine-readability rewrite of the methodology Markdown.
- Historical task files and archived QA artifacts.

## Plan

1. Update active methodology Markdown where it still contradicts the approved
   screen-7 and lesson design brief rules.
2. Update content/project docs to name the approved educational hierarchy and
   clearly mark current technical `module`/`unit` names as legacy aliases until
   a later runtime migration.
3. Update harness prompts/state/workboard so future agents receive the new
   hierarchy by default.
4. Verify with targeted `rg` checks and content validation.

## Checks

- [x] `rg` for the old full module/unit hierarchy phrase in active docs/harness
- [x] `rg` for stale screen-7 phrases in `docs/methodology/METHODOLOGY.md`
- [x] `npm run check:content`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse ./scripts/verify.sh`
- [x] `git diff --check`

## Result packet

- Files changed: `AGENTS.md`, `docs/PRODUCT.md`,
  `docs/ARCHITECTURE.md`, `docs/CONTENT_MODEL.md`,
  `docs/QA_USER_SCENARIO_MAP.md`, `docs/methodology/AUTHORING.md`,
  `docs/methodology/METHODOLOGY.md`, `docs/methodology/CONTENT_BACKLOG.md`,
  `docs/methodology/README.md`, deleted stale
  `docs/methodology/METHODOLOGY.lesson-authoring-updated.md`,
  `harness/FEATURE_MATRIX.json`, `harness/PARALLEL_AGENT_PROTOCOL.md`,
  `harness/prompts/*.md`, `harness/PROJECT_STATE.md`,
  `harness/WORKBOARD.md`, this task file.
- Checks run:
  - `rg -n "Program -> Module -> Unit -> Lesson -> Card" AGENTS.md docs harness --glob '!harness/tasks/review/**' --glob '!harness/tasks/done/**'` — no matches.
  - `rg -n "2–3 готовых|Своя формулировка|Экран 7 содержит ровно одно правило|готовыми формулировками и «Свой вариант»" docs/methodology/METHODOLOGY.md docs/methodology/AUTHORING.md docs/CONTENT_MODEL.md` — no matches.
  - `npm run check:content` — passed.
  - `./scripts/verify.sh` — first attempt without DB env failed only because
    backend tests require `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`,
    or `DATABASE_URL`.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse ./scripts/verify.sh` — passed.
  - `git diff --check` — passed.
- Risks: runtime JSON, TypeScript models, validators, API routes, and current
  learner-facing Section titles still use legacy `module`/`unit`/`Юнит`
  surfaces. This pass documents that as technical legacy instead of migrating
  it.
- Follow-up: migrate runtime schema/routes/copy from legacy module/unit names
  to Level/Section in a separate coordinated task after the docs contract is
  accepted.
