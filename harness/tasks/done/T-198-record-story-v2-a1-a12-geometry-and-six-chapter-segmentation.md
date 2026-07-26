# T-198 — Record Story v2 A1-A12 geometry and six-chapter segmentation

Status: done
Owner: Codex `/root`
Model: GPT-5.5 / xhigh
Started: 2026-07-26
Branch/worktree: current workspace (`main`)

## Goal

Record the approved A1–A12 Story v2 geometry and structurally resegment the
canonical narrative book into six causal chapters without producing lessons or
changing financial events.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/RISK_POLICY.md`
- `docs/PRODUCT.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/lore_v2/README.md`
- `docs/methodology/lore_v2/lore_story_v2_book.md`
- `docs/methodology/lore_v2/lore_v2_decisions.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`

## Intended write set

- `docs/methodology/lore_v2/lore_story_v2_book.md`
- `docs/methodology/lore_v2/lore_v2_decisions.md`
- `docs/methodology/lore_v2/README.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-198-record-story-v2-a1-a12-geometry-and-six-chapter-segmentation.md`

## Out-of-scope

- No Lesson Sources, Cards, screen scripts, production IDs, runtime JSON,
  content fixtures, API, application schema, or database changes.
- No package B/C decisions or substantive Blueprint rebuild.
- No new financial situations, competencies, factual claims, procedures,
  amounts, deadlines, or promises.
- No regeneration or semantic rewrite of derived competency coverage HTML.
- Preserve unrelated dirty-worktree changes and historical provenance files.

## Plan

1. Audit current chapter boundaries, beat continuity, and decision-log clauses.
2. Resegment the book into six chapters with minimal transition edits.
3. Add `LV2-DEC-006` and synchronize only directly stale authority/status text.
4. Verify chapter counts, scene continuity, transitions, wording, and the
   docs/harness-only gate.

## Checks

- [x] Focused structural/provenance assertions for six chapters and transitions.
- [x] `npm run check:harness`
- [x] `git diff --check`

## Result packet

- Summary/outcome: Recorded `LV2-DEC-006` with the approved `6 / 22 / 48`
  geometry, local Chapter ↔ Level rule, variable distributions, 48-action
  design-baseline limit, five raw-gap dispositions, selective coverage and all
  preserved safety/source/production stops. Resegmented the canonical book as:
  chapters 1–3 unchanged; chapter 4 `CH04-B001–CH04-B023`; chapter 5
  `CH04-B024–CH04-B033 + CH05-B001–CH05-B019`; chapter 6
  `CH05-B020–CH05-B046`. Added two minimal bridges: the chapter 3 exit now
  connects the temporary stay to Sasha's continuing work responsibilities, and
  the chapter 5 exit separates project questions for a specialist from Sasha's
  personal course-payment question. The other three transitions were unchanged.
- Files changed:
  - `docs/methodology/lore_v2/lore_story_v2_book.md`
  - `docs/methodology/lore_v2/lore_v2_decisions.md`
  - `docs/methodology/lore_v2/README.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/done/T-198-record-story-v2-a1-a12-geometry-and-six-chapter-segmentation.md`
- Checks run (pass/fail/blocked/skipped): PASS — focused assertions found six
  ordered headings, exact geometry sums, all required gap/gate evidence and the
  correct chapter-5/6 anchors; all five transitions were reread. After removing
  only the two approved bridge paragraphs, the original 490 nonblank narrative
  lines retain SHA-256
  `47ffa76f93036e2670e5bfb844af08e46925887a725a82df88526159dc62476b`;
  `npm run check:harness` passed with the grandfathered T-038 warning after an
  initial context-budget failure was fixed by returning `PROJECT_STATE.md` to
  210 lines; `git diff --check` passed; intended untracked Markdown files also
  had no trailing whitespace.
- Risks: the unchanged coverage HTML still embeds the old five-chapter
  description and `chapterNumber` evidence locations, so README and Project
  State mark it stale. Raw beat IDs remain decision-level provenance until the
  future Ledger. All five financial source gates remain open.
- Follow-up: handle any coverage regeneration, Blueprint work,
  Trace + Continuity Ledger, and packages B/C only in separately approved
  follow-ups. Do not start Lessons, Cards or runtime work from this decision.
