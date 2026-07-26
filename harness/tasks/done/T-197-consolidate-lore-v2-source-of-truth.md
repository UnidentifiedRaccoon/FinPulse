# T-197 — Consolidate Story v2 source of truth

Status: done
Owner: Codex /root
Model: GPT-5.5 / xhigh
Started: 2026-07-26
Branch/worktree: current workspace

## Goal

Create `docs/methodology/lore_v2/` as the single repository boundary for the
active Story v2 package, preserve the current five-chapter book and coverage
report there, import the current external adult-competency DOCX with a lossless
Markdown working representation, and reopen the Story Blueprint geometry for a
separate human decision before any rewrite or lesson generation.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/methodology/README.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- current Story v2 documents under `docs/methodology/`
- current external competency source:
  `Рамка_финансовых_компетенций_для_взрослых.docx`
- Documents skill instructions for DOCX extraction and verification

## Intended write set

- `harness/tasks/active/T-197-consolidate-lore-v2-source-of-truth.md`
- `docs/methodology/lore_v2/**`
- removal of superseded root-level active Story v2 files after relocation:
  - `docs/methodology/adult_financial_competencies_2026.md`
  - `docs/methodology/lore_story_v2.md`
  - `docs/methodology/lore_story_v2_book.md`
  - `docs/methodology/lore_story_v2_book_competency_coverage.html`
  - `docs/methodology/lore_v2_decisions.md`
  - `docs/methodology/lore_level_1_competency_emotion_map.md`
  - `docs/methodology/lore_lesson_screen_model_review.md`
  - `docs/methodology/production_model_financial_lore_pipeline.md`
- active references in:
  - `docs/methodology/README.md`
  - `docs/methodology/METHODOLOGY.md`
  - `docs/methodology/DESIGN.md`
  - `docs/methodology/.impeccable/**`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
  - `skills/fin-literacy-expert/**`
  - directly affected methodology provenance links

## Out-of-scope

- No selection of a new lesson count or Level/Section/Lesson geometry.
- No substantive rewrite of the Story Blueprint, book, or coverage judgments.
- No lesson sources, screen scripts, seed JSON, runtime code, API, database, or
  published-content changes.
- No new product stack or application architecture decision.
- No Git staging, commit, push, Pages publication, or production deployment.
- Preserve the unrelated untracked T-193 result packet.

## Plan

1. Audit and verify the current competency DOCX structure and source checksum.
2. Relocate the active Story v2 package and add an authority README.
3. Generate and verify the lossless competency Markdown against the DOCX and
   the 576-row coverage report.
4. Record the folder/authority/geometry reopening decision and update active
   references without rewriting the Blueprint body.
5. Run harness, reference, content-integrity, and whitespace checks; complete
   this result packet.

## Checks

- [x] DOCX render/structure verification
- [x] 576-row competency extraction and exact-text comparison
- [x] Story/book/coverage byte or semantic integrity after relocation
- [x] Active reference scan
- [x] `npm run check:harness`
- [x] `git diff --check`

## Result packet

- Files changed:
  - created `docs/methodology/lore_v2/README.md` as the Story v2 authority map;
  - imported `docs/methodology/lore_v2/adult_financial_competencies_2026.docx`;
  - generated `docs/methodology/lore_v2/adult_financial_competencies_2026.md`;
  - relocated the active Blueprint, book, coverage HTML, Decision Log, Level 1
    review map, screen-model review and production pipeline under
    `docs/methodology/lore_v2/`;
  - updated `docs/methodology/README.md` and `METHODOLOGY.md`;
  - updated affected methodology provenance links and the coverage-report
    Impeccable surface pointer;
  - updated `harness/PROJECT_STATE.md` and `harness/WORKBOARD.md`;
  - updated `skills/fin-literacy-expert/SKILL.md` and its domain/source
    references;
  - moved this packet to
    `harness/tasks/done/T-197-consolidate-lore-v2-source-of-truth.md`.
- Checks run (pass/fail/blocked/skipped):
  - PASS — imported DOCX SHA-256 is
    `3d16fbd9ddf28c87e40b017c3ed9a892bc1641a40da80ed88292641faf62404a`,
    identical to the current external source.
  - PASS — DOCX parsed as 849 paragraphs, 4 groups, 20 subject areas,
    60 category blocks, 120 level blocks and 576 framework competencies; no
    tables were present.
  - PASS — DOCX rendered to 41 pages; pages 1, 2, 10, 20, 30 and 41 were
    visually inspected at original resolution, and the same source SHA retains
    the prior T-193 all-page visual QA provenance.
  - PASS — generated Markdown contains 576 stable source-order anchors and is
    byte-identical to a clean regeneration from the imported DOCX.
  - PASS — all 576 extracted records exactly match the coverage HTML for
    source index, ID, group, subject area, category, level and competency text.
  - PASS — pre-relocation SHA-256 checks confirmed unchanged Blueprint, book,
    coverage HTML, Decision Log and review/pipeline files before the explicit
    status/path edits.
  - PASS — no active reference outside task history points at the removed
    root-level Story v2 paths; root-level active copies no longer exist.
  - PASS — untracked/new Markdown and HTML contain no trailing whitespace.
  - PASS — `npm run check:harness` with only the grandfathered duplicate
    `T-038` warning.
  - PASS — `git diff --check`.
- Risks:
  - Blueprint 1.4 still contains the old 5/20/80 geometry in its body; the new
    status banner, folder README and `LV2-DEC-005` explicitly make those values
    non-binding until the rebuild.
  - The coverage HTML remains a qualitative snapshot of the current book and
    must not be converted mechanically into a list of lessons.
  - The public GitHub Pages copy was not republished; this task changes only
    repository source organization and local report provenance labels.
  - The unrelated untracked T-193 packet remains untouched.
- Follow-up:
  - decompose the current book into atomic story/competency beats, compare
    several lesson-geometry options, and approve one before rebuilding
    `lore_story_v2.md`.
