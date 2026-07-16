# T-183 — Lore Macro Arc

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-08
Branch/worktree: current workspace

## Goal

Create Gate 4 / Macro Arc for the production lore pipeline after human approval
of Gate 3 Project Bible, without moving into Section Grid, Emotional Model,
Traceability Matrix, Lesson Cards, Screen Scripts, or 80-lesson generation.

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
- `docs/methodology/production_model_financial_lore_pipeline.md`
- `docs/methodology/lore_source_pack.md`
- `docs/methodology/lore_competency_table.md`
- `docs/methodology/lore_project_bible.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `skills/fin-literacy-expert/references/domain-map.md`

## Intended write set

- `docs/methodology/lore_macro_arc.md`
- `docs/methodology/README.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/active/T-183-lore-macro-arc.md`
- `harness/tasks/review/T-183-lore-macro-arc.md`

## Out-of-scope

- Runtime JSON, schemas, frontend/backend code, API, database, persistence.
- Lesson source Markdown, lesson cards, screen scripts.
- Section Grid, Emotional Model, Traceability Matrix.
- Final list of 20 emotions or 80-lesson generation.
- Runtime game mechanics, diagnostics, scoring, personalization, rewards,
  streaks, HR analytics, or B2B dashboards.

## Plan

1. Spawn requested read-only subagents and synthesize their result packets.
2. Create `docs/methodology/lore_macro_arc.md` as Gate 4 / Macro Arc.
3. Link the new document from `docs/methodology/README.md`.
4. Update project coordination docs with the actual changes.
5. Move this task to review and record checks.

## Checks

- [x] `git diff --check`
- [x] trailing whitespace check for changed Markdown files
- [x] `npm run verify` skipped because changes remained documentation-only

## Result packet

- Files changed:
  - `docs/methodology/lore_macro_arc.md`
  - `docs/methodology/README.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `harness/tasks/review/T-183-lore-macro-arc.md`
- Checks run:
  - `git diff --check`
  - trailing whitespace check for changed Markdown files
- Risks:
  - Gate 5 must not treat competency bands as final lesson or section
    assignments.
  - Object choices must stay symbolic and must not imply real material results
    or financial personalization.
  - Level 5 "Наставник" must remain support through questions and boundaries,
    not advice-giving.
- Follow-up:
  - Human decision 2026-07-08 approved Gate 4 Macro Arc and the proposed
    answers before Gate 5 / Section Grid.
  - Follow-up editorial refinement on 2026-07-08 accepted the strongest
    agent-facing decisions from an alternate Macro Arc draft: story-card level
    structure, stronger causal transitions, clearer Board semantics, sharper
    Level 2-5 conflicts, and a compact Section Grid question set.
  - Next authorized step is Gate 5 / Section Grid only, within the approved
    boundaries.

## Human decision 2026-07-08

Approved:

- Gate 4 Macro Arc is the source of truth for Gate 5 / Section Grid.
- Gate 5 keeps level functions and hooks; wording tweaks are allowed only when
  function does not change.
- Section Grid uses safety tags `safe`, `source-check`, `high-risk`,
  `proxy-check`, including combinations.
- Gate 5 marks primary NPC-function per future section without final names,
  biographies, scenes or appearance frequency.
- Gate 5 may use section-level object contribution placeholders such as
  `видимость`, `маршрут`, `критерий`, `источник`, `граница`, but must not
  create 16 object details or bind details to lessons.
- Section Grid uses `emotional function` and provisional working emotion label;
  final 20 emotions wait for later review / Emotional Model gate.
- `RSK-08`, bankruptcy, complex tax/pension topics and high-risk digital offers
  stay limited to red flags, source-check literacy, risk criteria and specialist
  boundary.
- Downstream artifacts with current official values need a source-update
  checklist: claim type, official source, check date, owner/reviewer and
  fallback to finding the current value.
- Gate 5 creates only Section Grid, not Emotional Model, Traceability Matrix,
  Lesson Cards, Screen Scripts or 80 lessons.
- Macro Arc competency bands are guardrails, not final assignments.
- Object choice stays symbolic and does not branch financial content.
- Level 5 "Наставник" means support through questions, source-check,
  boundaries and respect for autonomy, not advice.
- High-risk topics stay at criteria, red flags, official sources and specialist
  boundary; no products, regimes, assets, insurance, credit or tax actions are
  chosen.
- B2B is only a privacy boundary; no employer access to personal answers,
  mistakes, habits, emotions, income, expenses, debts or financial data.
