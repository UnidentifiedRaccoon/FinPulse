# T-149 — Source-backed lesson rich formatting

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-15
Branch/worktree: codex/feat-admin-production-deploy

## Goal

Restore DOCX-backed rich Markdown and selected source-table wording in the active Level 1 money-and-operations runtime lessons after the user reviewed and approved the audit table.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`

## Intended write set

- `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`
- `harness/tasks/review/T-149-source-backed-lesson-rich-formatting.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Renderer implementation for collapsed `\n\n` in non-theory cards.
- Schema, validator, route, persistence, admin, or API changes.
- New Markdown syntax beyond the approved subset.
- Product expansion beyond the four current active lessons.

## Plan

1. Apply approved DOCX-backed content changes to Markdown-enabled runtime fields only.
2. Keep plain-text fields such as labels, variants, cta labels, ids, and placeholders unchanged.
3. Run content validation and focused content tests.
4. Document checks, risks, and renderer follow-up options.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/content/program.test.ts`
- [x] `git diff --check`

## Result packet

- Files changed: `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`, `harness/tasks/review/T-149-source-backed-lesson-rich-formatting.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`.
- Checks run: content validation, focused content tests, and whitespace diff check passed.
- Risks: paragraph breaks stored as `\n\n` still depend on the current lesson renderer; U1.2-style paragraph collapse is intentionally not fixed in this task.
- Follow-up: choose a renderer strategy for preserving paragraph breaks across approved Markdown-enabled fields.
