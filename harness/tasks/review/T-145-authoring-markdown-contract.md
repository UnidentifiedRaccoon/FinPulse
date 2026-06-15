# T-145 — Authoring Markdown Contract

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: main working tree

## Goal

Document the authoring-level Markdown contract for lesson text fields so rich
formatting from DOCX sources can be preserved later, while keeping runtime code
and content JSON unchanged in this step.

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
- Documents skill instructions for DOCX editing and render QA

## Intended write set

- `docs/methodology/AUTHORING.md`
- `docs/methodology/AUTHORING.lesson-reglament.docx`
- `harness/tasks/active/T-145-authoring-markdown-contract.md`
- `harness/tasks/review/T-145-authoring-markdown-contract.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime Markdown rendering implementation.
- Runtime lesson JSON changes.
- Content schema, validator, API, persistence, or UI behavior changes.
- Rewriting the general methodology document.
- Direct edits to Google Docs.

## Plan

1. Update the Markdown authoring regulation with the allowed Markdown fields,
   plain-text exclusions, and removal of renderer-specific fact/formula/test
   marker structure.
2. Apply the same minimal local edits to the DOCX regulation while preserving
   its current styles.
3. Run document structural checks, DOCX sanitizer/render QA, and focused docs
   audits.

## Checks

- [x] AUTHORING Markdown audit
- [x] DOCX sanitizer
- [x] DOCX structural smoke checks
- [x] DOCX render QA
- [x] `npm run check:content`
- [x] `git diff --check`

## Result packet

- Files changed: `docs/methodology/AUTHORING.md`,
  `docs/methodology/AUTHORING.lesson-reglament.docx`, `harness/**`
  task/state files.
- Checks run: AUTHORING Markdown audit with JSON-block parsing, DOCX title
  sanitizer, `unzip -t`, python-docx smoke read, DOCX render to 17 PNG pages
  with visual QA, `npm run check:content`, and `git diff --check` on the T-145
  write set.
- Risks: runtime Markdown rendering is intentionally not implemented yet, so
  this is an authoring/methodology contract before code support.
- Follow-up: implement a safe lesson-reader Markdown renderer and update the
  technical content model/validator contract in a separate task.
