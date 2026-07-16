# T-186 — Story v2 Approval 1 and review packet

Status: review
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-14
Branch/worktree: current workspace; preserve unrelated user changes

## Goal

Record the human `approved_with_blockers` Approval 1 for Story v2 and prepare
three decision-grade review documents: a five-chapter standalone Sasha story,
a Level 1 competency/emotion map, and a screen-model candidate for human review
before any lesson-screen generation.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/adult_financial_competencies_2026.md`
- `docs/methodology/lore_story_v2.md`
- `docs/methodology/production_model_financial_lore_pipeline.md`
- `skills/finpulse-lesson-methodologist/SKILL.md`
- `skills/fin-literacy-expert/SKILL.md`

## Intended write set

- `harness/tasks/**/T-184-lore-story-rebuild.md`
- `harness/tasks/**/T-186-story-v2-approval-1-and-review-packet.md`
- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_v2_decisions.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_level_1_competency_emotion_map.md`
- `docs/methodology/lore_lesson_screen_model_review.md`
- `docs/methodology/README.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`

## Out-of-scope

- Lesson Source Markdown under `docs/levels/**`.
- Runtime JSON under `src/content/**`, database content, and v1 lessons.
- Competency Catalog v2, trace ledger, schemas, validators, or Phase B
  prototype artifacts.
- Frontend, backend, API, persistence, and visual object production.

## Plan

1. Record Approval 1 and synchronize canonical status and blockers.
2. Create the five-chapter standalone narrative without production jargon.
3. Create the Level 1 competency/emotion map with honest traceability limits.
4. Create a decision-oriented screen-model review candidate; do not generate
   lesson screens.
5. Run independent read-only narrative, competency/safety, and screen-model
   reviews; integrate confirmed findings.
6. Update the result packet and run the docs/harness verification tier.

## Checks

- [x] Structural/content smokes for the new Markdown documents.
- [x] `npm run check:harness`.
- [x] `git diff --check`.

## Result packet

- Files changed:
  - `docs/methodology/lore_v2_decisions.md` — Approval 1
    `approved_with_blockers`, accepted decisions, blockers, and Phase B
    preflight;
  - `docs/methodology/lore_story_v2.md` — canonical status, visible finale,
    causal clarifications, object/age boundaries, and Level 1 consistency
    fixes;
  - `docs/methodology/lore_story_v2_book.md` — standalone five-chapter story
    for external review;
  - `docs/methodology/lore_level_1_competency_emotion_map.md` — four topics,
    sixteen lesson actions, four emotions, scope limits, and catalog gaps;
  - `docs/methodology/lore_lesson_screen_model_review.md` — three screen-model
    options and recommended Model B with explicit runtime/privacy implications;
  - `docs/methodology/README.md`, `harness/PROJECT_STATE.md`, and
    `harness/WORKBOARD.md` — source-of-truth, decision queue, and blocker sync;
  - `harness/tasks/done/T-184-lore-story-rebuild.md` — Approval outcome and
    completed lifecycle state;
  - this task packet.
- Checks run (pass/fail/blocked/skipped):
  - structural smoke — pass: five book chapters / 3,475 words, four Level 1
    Sections / sixteen lesson actions, eight screen functions;
  - trailing-whitespace smoke for the full write set — pass;
  - independent narrative review — pass after removal of internal front matter
    and a non-canonical project detail;
  - independent competency/safety review — pass with explicit representative
    coverage, `PLN-02` rewrite need, and adult-finance external-case boundary;
  - independent screen/runtime review — pass after true-skip, persistence,
    screen-7, authentication, and v2-isolation clarifications;
  - independent cross-document status/blocker review — pass after consistency
    fixes;
  - `npm run check:harness` — pass with grandfathered duplicate `T-038`
    warning only;
  - `git diff --check` — pass;
  - full app verification — skipped as disproportionate for docs/harness-only
    changes.
- Risks:
  - Model B and screen-6 persistence behavior remain a human decision; no v2
    screen generation is allowed before it;
  - Competency Catalog v2, runtime/mode preflight, namespace, ledger schema,
    validator, Issue Register, and Trace + Continuity Ledger do not exist yet;
  - `GAP-VIS-OBJECTS` remains open for any slice using object layouts;
  - Level 1 production IDs remain candidates: pressure/data/post-incident
    actions and the `PLN-02` wording still require catalog work;
  - external review of the five-chapter story may return change requests, which
    must be reconciled explicitly with the approved Story Blueprint.
- Follow-up:
  - send the five-chapter story for external review;
  - approve or revise Model B and choose screen-6 persistence, with ephemeral
    recommended for the first prototype;
  - after that decision, create the hard Phase B controls in a separate task;
  - only then build the L1-S4 vertical slice and L2-S3 high-risk probe for
    Approval 2.
