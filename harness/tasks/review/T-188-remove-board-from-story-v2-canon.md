# T-188 — Remove Board from Story v2 canon

Status: review
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-16
Branch/worktree: current workspace; preserve unrelated user changes

## Goal

Record the human decision to remove the Board and collectible object ladder
from the current Story v2 canon. Rewrite Sasha's story so he uses ordinary
private tools appropriate to each situation: calendar/reminders for dates,
personal tables for budgets and comparisons, notes for questions, folders or
mail for source documents, and a shared document only for the side project.

Keep learner artifacts separate in the Personal Financial Navigator. Do not
invent or approve a replacement game/meta-progress mechanic in this task;
record it as a later product decision. Mark the old Board foundation as
superseded provenance without rewriting historical Gate 1-4 documents.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_v2_decisions.md`
- `docs/methodology/lore_level_1_competency_emotion_map.md`
- `docs/methodology/lore_lesson_screen_model_review.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/finpulse-content-editor/references/editorial-rubric.md`
- `skills/finpulse-lesson-methodologist/SKILL.md`

## Intended write set

- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_v2_decisions.md`
- `docs/methodology/lore_level_1_competency_emotion_map.md`
- `docs/methodology/lore_lesson_screen_model_review.md`
- `docs/methodology/finpulse_board_course_foundation.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/README.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/**/T-188-remove-board-from-story-v2-canon.md`

## Out-of-scope

- Historical Gate 1-4 provenance documents: `lore_source_pack.md`,
  `lore_competency_table.md`, `lore_project_bible.md`, `lore_macro_arc.md`.
- Selection or design of a replacement game/meta-progress mechanic.
- V2 lesson screens, source lesson Markdown, runtime JSON, schemas, code, API,
  persistence, real reminders, rewards, scoring, diagnostics, or analytics.
- Changes to approved financial events, competencies, safety boundaries,
  character arcs, or Sasha's final housing decision.

## Plan

1. Inventory current Board/object references and map each story use to the
   natural calendar/table/note/document tool for that scene.
2. Rewrite the canonical Story Blueprint and five-chapter book without the
   Board or collectible objects while preserving all causal arcs.
3. Update the decision log and current methodology/review views; mark the old
   Board foundation as superseded provenance and leave game mechanics open.
4. Run independent continuity, editorial, methodology, and safety audits.
5. Run docs/harness checks, complete the result packet, and move T-188 to
   review.

## Checks

- [x] No Board or collectible object mechanic remains in current Story v2,
  its book, Level 1 map, or screen-model review.
- [x] Every removed Board use has a natural tool only where the scene needs it.
- [x] Calendar, tables, notes, and source documents are not collapsed into a
  new universal artifact.
- [x] Story outcomes, financial meaning, privacy, and education-vs-advice
  boundaries remain unchanged.
- [x] Decision log supersedes the old Board/object decision and retires
  `GAP-VIS-OBJECTS` without approving a replacement meta-game.
- [x] Historical Gate 1-4 provenance remains intact and clearly non-current.
- [x] Independent continuity/editorial/methodology/safety reviews pass.
- [x] Trailing-whitespace smoke.
- [x] `npm run check:harness`.
- [x] `git diff --check`.

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2.md`;
  - `docs/methodology/lore_story_v2_book.md`;
  - `docs/methodology/lore_v2_decisions.md`;
  - `docs/methodology/lore_level_1_competency_emotion_map.md`;
  - `docs/methodology/lore_lesson_screen_model_review.md`;
  - `docs/methodology/finpulse_board_course_foundation.md`;
  - `docs/methodology/METHODOLOGY.md`;
  - `docs/methodology/README.md`;
  - `harness/PROJECT_STATE.md`;
  - `harness/WORKBOARD.md`;
  - this task packet.
- Checks run (pass/fail/blocked/skipped):
  - PASS — independent narrative continuity/editorial/privacy/safety audit;
  - PASS — cross-document methodology and decision audit after follow-up fixes;
  - PASS — 5 Levels, 20 Sections, 80 lesson beats, 20 situational-tool fields,
    and 5 book chapters;
  - PASS — residual search: no Board/object mechanic in the book, Level 1 map,
    or screen-model review;
  - PASS — all six key story closures found;
  - PASS — trailing-whitespace smoke over the bounded write set;
  - PASS — `npm run check:harness` with only the grandfathered `T-038` warning;
  - PASS — `git diff --check`.
- Risks:
  - replacement game/meta-progress mechanics remain intentionally undecided;
  - the Board foundation keeps its historical body, guarded by an explicit
    superseded banner;
  - jurisdiction- and time-sensitive lesson claims still require the planned
    source freshness and SME reviews during lesson production.
- Follow-up:
  - decide the v2 screen model and optional-reflection persistence separately;
  - decide any future engagement/meta-progress model as its own product package;
  - complete the Phase B competency, namespace, schema/validator, Issue
    Register, and Trace + Continuity Ledger preflight before lesson-screen
    generation.
