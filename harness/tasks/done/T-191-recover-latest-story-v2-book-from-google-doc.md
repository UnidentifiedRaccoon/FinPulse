# T-191 — Recover latest Story v2 book from Google Doc

Status: done
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-24
Branch/worktree: current workspace; `codex/chore/t-190-publish-workspace`

## Goal

Recover the latest human-edited five-chapter Story v2 review narrative from the
authoritative Google Doc into `docs/methodology/lore_story_v2_book.md`, while
preserving the repository's Markdown hierarchy and the approved canon boundary.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/tasks/review/T-186-story-v2-approval-1-and-review-packet.md`
- `harness/tasks/review/T-187-naturalize-five-chapter-story-v2-book.md`
- `harness/tasks/review/T-188-remove-board-from-story-v2-canon.md`
- `harness/tasks/review/T-189-keep-sasha-in-lera-project.md`
- Google Doc `1rLfDPUQP1pi6qD7toyGaElOI7c4whSSNVaELuKxGRsc`, current Drive
  revision `247`, modified 2026-07-23.

## Intended write set

- `docs/methodology/lore_story_v2_book.md`
- `harness/tasks/**/T-191-recover-latest-story-v2-book-from-google-doc.md`

## Out-of-scope

- Canonical Story Blueprint `docs/methodology/lore_story_v2.md`, Story v2
  decisions, competency maps, and screen-model review.
- Source lesson Markdown, runtime JSON, schemas, application code, API, and
  persistence.
- New editorial, financial, legal, or product decisions not present in the
  supplied Google Doc.
- Git commit, push, PR, or Google Doc mutation.

## Plan

1. Prove whether GitHub contains a newer repository state and identify the
   exact local target for the supplied document.
2. Export the current Google Doc as Markdown and normalize only the repository
   heading levels and transport escaping.
3. Replace the derived five-chapter book, then compare structure and content
   against the Drive source and approved Story v2 invariants.
4. Run docs/harness verification and complete the result packet.

## Checks

- [x] Google Doc title, two overview tables, five chapter headings, and all
  source paragraphs are represented in the repository Markdown.
- [x] No stale Board/collectible-object language and no regression of Sasha's
  continuing role in Lera's project.
- [x] No files outside the declared write set changed.
- [x] `npm run check:harness`.
- [x] `git diff --check`.

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2_book.md` — restored from the current
    Google Doc Markdown export with repository heading levels, table
    separators, line wrapping, and transport escaping normalized.
  - this task packet.
- Checks run (pass/fail/blocked/skipped):
  - PASS — `git fetch origin --prune`; current `HEAD` and `origin/main` have
    the same tree `2e1689b96598afe3c7bfb3aee9f694bbf6fe6d02`, so GitHub has no
    newer file state to recover.
  - PASS — Drive metadata/revision audit: the document was modified after the
    GitHub commit, current Drive revision is `247`, and the connector revision
    ID remained unchanged through final readback.
  - PASS — source fidelity: the resulting Markdown matches revision 247's
    `text/markdown` export after only heading/table/line-wrap normalization and
    removal of seven export-only escapes.
  - PASS — one H1 title, two overview tables, seven H2 sections, exactly five
    chapter headings, five cast rows, and five chapter-arc rows.
  - PASS — independent Markdown/diff review: no duplicate paragraphs, broken
    tables, invalid UTF-8/control characters, stale Google Docs markup, or
    transport escapes.
  - PASS — independent Story v2 canon review: no Board/collectible mechanic;
    Sasha remains Lera's bounded coauthor, Lera remains project lead, and the
    pre-commercial/privacy boundaries remain intact.
  - PASS — independent financial-safety review found no hidden personal advice,
    promised result, medical diagnosis, or unsupported legal conclusion; the
    new jurisdiction/time-sensitive scenes were classified for follow-up.
  - PASS — bounded write-set audit; only the restored book and this packet
    changed.
  - PASS — `npm run check:harness`; only the grandfathered duplicate `T-038`
    warning remains.
  - PASS — `git diff --check`.
- Risks:
  - At T-191 completion this was a derived external-review narrative and did
    not override the canonical Blueprint. The user subsequently promoted the
    recovered events through T-192 and `LV2-DEC-004`; the Blueprint remains the
    source of truth for all source-sensitive wording.
  - DMS terms, the ЕГРЮЛ/ФНС route, the education-tax-deduction procedure,
    card conditions, and regulated-platform terminology remain jurisdiction-
    or contract-sensitive. T-192 records explicit open source gates before
    lesson prototype or publication.
  - The recovered book intentionally preserves the Google Doc's exact
    procedural wording. Where that wording is more specific than the current
    official-source abstraction, `lore_story_v2.md` and `LV2-DEC-004` govern.
- Follow-up:
  - Completed by T-192 and `LV2-DEC-004`: the Blueprint, Decision Log,
    continuity/competency map, durable state, and source-safety controls are
    synchronized without changing the `5 × 4 × 4` geometry.
  - Before affected lesson prototypes or publication, close the five source
    gates recorded by `LV2-DEC-004`.
