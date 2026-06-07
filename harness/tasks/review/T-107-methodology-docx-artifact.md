# T-107 — Methodology DOCX Artifact

Status: review
Owner: Codex
Started: 2026-06-08

## Goal

Produce a `.docx` artifact from the corrected full methodology file so the user
can open it as a Word / Google Docs-compatible document.

## Intended Write Set

- `docs/methodology/METHODOLOGY.lesson-authoring-updated.docx`
- `harness/tasks/review/T-107-methodology-docx-artifact.md`
- task-local generation notes/scripts if needed

## Out Of Scope

- Editing Google Docs.
- Editing `docs/methodology/METHODOLOGY.md`.
- Changing runtime content, schema, UI, backend, or tests.

## Plan

1. Generate DOCX from the direct Google Docs DOCX export, preserving the
   original document formatting and patching only the lesson-authoring
   methodology sections.
2. Sanitize the DOCX title block for Google Docs compatibility.
3. Render the DOCX to page PNGs and inspect representative pages.
4. Move this task record to review with result details.

## Checks

- [x] DOCX generated
- [x] Google Docs title sanitizer passed
- [x] DOCX rendered to PNGs
- [x] Rendered pages inspected

## Result Packet

- Files changed:
  - `docs/methodology/METHODOLOGY.lesson-authoring-updated.docx`
  - `harness/tasks/review/T-107-methodology-docx-artifact.md`
- Checks run:
  - Google Docs title sanitizer passed.
  - DOCX rendered to 39 PNG pages and PDF via `render_docx.py`.
  - Representative rendered pages inspected, including the edited lesson
    architecture, card-format constraints, lesson map, authoring template, and
    checklist sections.
  - Compared source DOCX export with final DOCX: text differences are limited
    to the intended lesson-authoring methodology sections 2.3, 6.5, 12.2,
    12.3, and 13.1.
  - Verified table count, header/footer text, media count, and comment count:
    no media/comments added or removed; header/footer text unchanged.
- Notes:
  - Final DOCX is based on the original Google Docs export, not a Markdown-only
    conversion.
  - Source Google Docs and `docs/methodology/METHODOLOGY.md` were not edited.
- Risks:
  - The artifact is a corrected copy for review/import, not an in-place update
    to Google Docs.
