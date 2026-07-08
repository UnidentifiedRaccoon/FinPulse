# T-180 — Lore Project Bible

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-07-05
Branch/worktree: main workspace

## Goal

Prepare Gate 3 / Project Bible for the production financial lore pipeline without advancing to later gates.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/README.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/adult_financial_competencies_2026.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `docs/methodology/production_model_financial_lore_pipeline.md`
- `docs/methodology/lore_source_pack.md`
- `docs/methodology/lore_competency_table.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `skills/fin-literacy-expert/references/domain-map.md`

## Intended write set

- `docs/methodology/lore_project_bible.md`
- `docs/methodology/README.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-180-lore-project-bible.md`
- `harness/tasks/review/T-180-lore-project-bible.md`

## Out-of-scope

- Macro Arc.
- Section Grid.
- Emotional Model.
- Traceability Matrix.
- Lesson Cards.
- Screen Scripts.
- Generating 80 lessons.
- Runtime JSON, schemas, frontend/backend code, API, database, or persistence changes.
- Diagnostics, HR analytics, B2B dashboards, rewards, streaks, challenges, or new mechanics.
- Personal financial, investment, tax, legal, or product recommendations.

## Plan

1. Use `fin-literacy-expert` safety boundaries and bounded subagent packets for source synthesis, financial safety, and narrative boundaries.
2. Draft `docs/methodology/lore_project_bible.md` as Gate 3 only.
3. Link the Project Bible from `docs/methodology/README.md`.
4. Update `harness/PROJECT_STATE.md` and `harness/WORKBOARD.md` with current Gate 3 state.
5. Run gate-compliance review and required checks.
6. Move this task file to `harness/tasks/review/`.

## Checks

- [x] `git diff --check`
- [x] trailing whitespace check for new/changed Markdown files
- [x] `npm run verify` (stopped in backend tests on known missing DB env after content validation, runtime import guard, typecheck, and lint passed)

## Result packet

- Files changed:
  - `docs/methodology/lore_project_bible.md`
  - `docs/methodology/README.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `harness/tasks/review/T-180-lore-project-bible.md`
- Checks run:
  - Source synthesis, narrative-boundary, financial-safety, and gate-compliance subagents ran read-only.
  - Gate-compliance auditor initially found one blocking gap: missing 3-5 working NPC/object sets required by the pipeline. The draft was patched with 5 NPC functions and 5 recurring objects for human review, and re-audit passed.
  - `git diff --check` passed.
  - `rg -n "[[:blank:]]$" docs/methodology/lore_project_bible.md docs/methodology/README.md harness/PROJECT_STATE.md harness/WORKBOARD.md harness/tasks/review/T-180-lore-project-bible.md` found no trailing whitespace.
  - `npm run verify` passed content validation, runtime import guard, typecheck, and lint, then failed in backend tests because this shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- Open decisions:
  - Human approval of Gate 3 / Project Bible as source of truth.
  - Whether to keep or revise Gate 2 competency IDs and subset before Gate 4.
  - Whether to keep, replace, or narrow the working NPC functions and recurring object set.
  - When to finalize level objects, NPC identities, and the 20-emotion model.
  - Source-update protocol for time-sensitive topics.
  - Whether high-risk digital offers, crypto/FOREX, bankruptcy, and complex pension/tax topics belong in the 5x4x4 course or only as red flags.
- Risks:
  - Gate 4 can drift into Section Grid, Emotional Model, Traceability Matrix, Lesson Cards, or 80-lesson generation if approval gates are skipped.
  - Working NPC/object sets must not be treated as final canon without human approval.
  - Financial safety remains highest risk around investments, credit/debt, taxes, insurance, pensions, crypto/FOREX, currency, real estate, entrepreneurship, complaints, fraud, and personal data.
- Follow-up:
  - Recommended next step after human approval Gate 3: Gate 4 / Macro Arc.
  - Do not proceed to Section Grid, Emotional Model, Traceability Matrix, Lesson Cards, Screen Scripts, Vertical Slice, or 80-lesson generation before approved Macro Arc.
