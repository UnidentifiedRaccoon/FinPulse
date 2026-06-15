# T-141 — Methodology Split

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: main working tree

## Goal

Split the methodology into two durable sources: a general methodology document
and a lesson-specific authoring regulation, then produce matching Google
Docs-ready DOCX artifacts.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/engineering/contributing.md`
- Documents skill instructions and Google Docs DOCX render workflow

Source inputs:

- General methodology Google Doc:
  `https://docs.google.com/document/d/1vpGNgyjAC4E5jPc29-p53VnU1hb3yFyB/edit`
- Lesson regulation Google Doc:
  `https://docs.google.com/document/d/1_4re7hJvNt4Ife70a4_PIvBZA04F4pc3/edit`

## Intended write set

- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/METHODOLOGY.cleaned.docx`
- `docs/methodology/AUTHORING.lesson-reglament.docx`
- `harness/tasks/active/T-141-methodology-split.md`
- `harness/tasks/review/T-141-methodology-split.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime JSON/content changes.
- UI, API, route, backend, schema, or validator changes.
- Direct edits to the source Google Docs.
- Rewriting or reverting existing T-139/T-140 working-tree changes.

## Plan

1. Clean `METHODOLOGY.md` so it remains a general strategic methodology and
   delegates lesson-screen details to `AUTHORING.md`.
2. Expand `AUTHORING.md` into the lesson-specific regulation, based on the
   separate lesson Google Doc and current MVP/content-model constraints.
3. Generate both DOCX artifacts with the Documents workflow and
   `google_docs_default` styling.
4. Run sanitizer, structural checks, render QA, and content validation.
5. Move this task to review and update project state.

## Checks

- [x] Markdown split audit
- [x] DOCX title sanitizer
- [x] DOCX structural smoke checks
- [x] DOCX render QA
- [x] Format-preserving DOCX rebuild from original Google Docs DOCX exports
- [x] `npm run check:content`
- [x] Full `npm run verify` prerequisite check

`npm run verify` was not run because this shell has no PostgreSQL test database
URL configured. For this docs-only task, the available project validation was
`npm run check:content`; full verify remains gated by the backend test database
prerequisite.

## Result packet

- Files changed:
  - `docs/methodology/METHODOLOGY.md`
  - `docs/methodology/AUTHORING.md`
  - `docs/methodology/METHODOLOGY.cleaned.docx`
  - `docs/methodology/AUTHORING.lesson-reglament.docx`
  - `harness/tasks/review/T-141-methodology-split.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - Markdown audit for old `Module` / `Unit` / `Tier` / `T1` markers.
  - Markdown audit that `METHODOLOGY.md` no longer contains JSON-card
    templates or full screen-by-screen lesson specification.
  - AUTHORING audit for all 8 screens, MVP constraints, JSON templates, and QA.
  - DOCX title sanitizer for both generated files.
  - `unzip -t` for both generated DOCX files.
  - `python-docx` smoke-read for both generated DOCX files.
  - Rebuilt both DOCX files from the original Google Docs DOCX exports to
    preserve the source visual style, tables, heading hierarchy, callouts, and
    JSON block formatting.
  - DOCX render to PNG/PDF and visual contact-sheet QA
    (`METHODOLOGY.cleaned.docx`: 36 pages;
    `AUTHORING.lesson-reglament.docx`: 15 pages).
  - `npm run check:content`.
- Risks:
  - The source Google Docs were read as inputs only and were not edited.
  - Full `npm run verify` still needs a PostgreSQL test database URL in this
    shell.
- Follow-up:
  - Import the generated DOCX artifacts into Google Docs manually if needed.
