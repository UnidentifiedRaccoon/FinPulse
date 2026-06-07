# T-106 — Methodology Lesson Authoring Artifact

Status: complete
Owner: Codex
Started: 2026-06-08

## Goal

Create a local corrected copy of the methodologist source document from
`docs/methodology/METHODOLOGY.md`, preserving the full document and changing only
the lesson-authoring methodology so future T1 lessons follow the accepted
eight-screen architecture.

## Intended Write Set

- `docs/methodology/METHODOLOGY.lesson-authoring-updated.md`
- this task file

## Out Of Scope

- Editing Google Docs.
- Editing the source `docs/methodology/METHODOLOGY.md`.
- Runtime JSON, schema, UI, backend, tests, or product-scope changes.
- Rewriting unrelated methodology sections.

## Plan

1. Copy the full imported source methodology into a new artifact file.
2. Patch only lesson-structure sections to require the current eight-screen T1
   lesson architecture.
3. Sanity-check the diff against the source document.

## Checks

- [x] Diff review against `docs/methodology/METHODOLOGY.md`

## Result Packet

- Artifact created:
  - `docs/methodology/METHODOLOGY.lesson-authoring-updated.md`
- Source preserved:
  - `docs/methodology/METHODOLOGY.md` was not edited.
  - Google Docs was not edited.
- Methodology blocks changed in the artifact:
  - added the accepted 8-screen T1 runtime architecture after the broad lesson ladder;
  - updated the short-lesson formula from 6 generic steps to 8 accepted screens;
  - added current T1 MVP card-format limits while preserving the target card palette;
  - updated the sample reserve lesson map to use screen 3 `categorization`, screen 4 external `scenario`, screen 5 personal `artifact`, screen 8 `summary`;
  - expanded the author template and quality checklist for the accepted screen sequence.
- Checks run:
  - `diff -u docs/methodology/METHODOLOGY.md docs/methodology/METHODOLOGY.lesson-authoring-updated.md`
  - `rg` sanity search for the inserted T1 architecture clauses.
- Risks:
  - Artifact is Markdown because the repo's imported source is Markdown; Google Docs export/edit was not used.
