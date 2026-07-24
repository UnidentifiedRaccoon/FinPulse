# T-192 — Synchronize recovered story into canonical Story v2

Status: done
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-24
Branch/worktree: current workspace; `codex/chore/t-190-publish-workspace`

## Goal

Synchronize the user-approved July 23 recovered five-chapter narrative into the
canonical Story v2 Blueprint without changing its 5 Level / 20 Section
geometry, record the canon decision and safety boundaries, update durable
coordination state, and commit the complete recovery/canon package.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/RISK_POLICY.md`
- `docs/CONTENT_MODEL.md`
- `docs/engineering/contributing.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_v2_decisions.md`
- `docs/methodology/lore_level_1_competency_emotion_map.md`
- `harness/tasks/**/T-191-recover-latest-story-v2-book-from-google-doc.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/finpulse-content-editor/references/editorial-rubric.md`
- `skills/fin-literacy-expert/SKILL.md`
- selected finance safety/fact/source references required by that skill.

## Intended write set

- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_v2_decisions.md`
- `docs/methodology/lore_level_1_competency_emotion_map.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/**/T-191-recover-latest-story-v2-book-from-google-doc.md`
- `harness/tasks/**/T-192-synchronize-recovered-story-into-canonical-story-v2.md`

## Out-of-scope

- Source lesson Markdown, runtime JSON, schemas, application code, API, and
  persistence.
- Screen-model approval, Phase B controls, or v2 lesson generation.
- Replacement game/meta-progress mechanics, scoring, personalization, or
  production financial actions.
- Exact tax amounts, benefits guarantees, product recommendations, or legal,
  medical, and investment advice.
- Push, Pull Request, merge, deployment, Google Doc mutation, or production
  content publication.

## Plan

1. Map the recovered narrative changes onto the existing 20 canonical events
   and identify every affected causal bridge, decision, and derived Level 1
   review row.
2. Update the Blueprint with bounded benefits/course/tax, DMS, investment
   platform, rent-date, and project/privacy changes while preserving safety and
   the existing geometry.
3. Record the user decision and synchronize durable project state and the
   external-review queue.
4. Run independent canon, narrative, and financial-safety reviews; integrate
   confirmed findings.
5. Run focused structural checks, `npm run verify:fast`, harness/diff checks,
   review the staged diff, and create one Conventional Commit.

## Checks

- [x] 5 Levels, 20 Sections, and 80 lesson beats remain intact.
- [x] Recovered book and canonical Blueprint agree on every changed story arc
  without silently overriding the explicit source/safety limits.
- [x] Board/collectibles remain absent; Sasha remains Lera's bounded coauthor;
  privacy and pre-commercial boundaries remain intact.
- [x] Jurisdiction/time-sensitive tax, DMS, registry, card, and benefits text is
  source-bounded and non-advisory.
- [x] `npm run check:harness`.
- [x] `npm run verify:fast`.
- [x] `git diff --check` and staged-diff review.

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2_book.md` — recovered Google Doc revision
    247 as the five-chapter review narrative under T-191.
  - `docs/methodology/lore_story_v2.md` — promoted the recovered rent,
    employer-benefit, DMS, course, tax, registry, project, and consent arcs into
    Blueprint 1.4 while retaining all 20 Sections and 80 beats.
  - `docs/methodology/lore_v2_decisions.md` — recorded `LV2-DEC-004` and five
    explicit source gates.
  - `docs/methodology/lore_level_1_competency_emotion_map.md` — synchronized
    the four Level 1 outcomes and sixteen candidate beats.
  - `harness/PROJECT_STATE.md` and `harness/WORKBOARD.md` — updated durable
    canon state and the current source-review control queue.
  - `harness/tasks/done/T-191-recover-latest-story-v2-book-from-google-doc.md`
    — accepted the completed source recovery and linked its follow-up to T-192.
  - this task packet.
- Checks run (pass/fail/blocked/skipped):
  - PASS — structural smokes: 5 Level headings, 20 unique Section headings, 80
    numbered lesson beats, 20 continuity rows, 20 topic-map rows, 16 Level 1
    candidate beats, and the same five source-gate IDs in Blueprint/Decision
    Log.
  - PASS — independent canon/continuity review after fixes: recovered scene
    order, causal bridges, NPC ownership, midpoint/finale, Lera's leadership,
    Sasha's bounded role, Misha/Tamara data ownership, and unnumbered
    continuity seeds/tails are coherent.
  - PASS — independent financial-safety review: tax, DMS/medical/privacy,
    card, EGRUL, and regulated-platform claims are non-advisory, contract- or
    date-bounded, and guarded before publication.
  - PASS — official-source check dated 2026-07-24 against current FNS education
    deduction and EGRUL guidance plus Bank of Russia participant and
    infrastructure registries.
  - PASS — Board/collectible absence and pre-commercial/privacy boundary audit.
  - PASS — `npm run check:harness`; only grandfathered duplicate `T-038`
    warning remains.
  - PASS — `npm run verify:fast`: harness tests, content/import guards,
    typecheck, lint, and 118 non-DB tests; release builds and DB tests were not
    part of this iteration gate.
  - PASS — `git diff --check`.
  - PASS — staged allowlist/cached-diff review: exactly the four methodology
    documents, two coordination snapshots, and T-191/T-192 packets are staged;
    no runtime, source lesson, schema, app, or unrelated workspace file is
    included.
- Risks:
  - The five `LV2-DEC-004` source gates remain open. They block affected lesson
    prototypes/publication from generalizing employer-program, contract,
    medical/privacy, tax, EGRUL, or regulated-platform details.
  - The recovered review book intentionally preserves exact Google Doc wording;
    where it is more specific than the current official-source abstraction,
    Blueprint 1.4 and `LV2-DEC-004` govern.
  - Phase B remains blocked by the existing screen-model, competency catalog,
    namespace, ledger, validator, Issue Register, and trace controls.
- Follow-up:
  - Close the five dated source gates before affected lesson prototypes or
    publication.
  - Keep the pending screen-model decision and remaining Phase B controls
    separate from this completed narrative recovery/canon sync.
