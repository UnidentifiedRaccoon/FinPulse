# T-174 — JSON editor syntax highlight

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Branch/worktree: current workspace

## Goal

Add visual JSON syntax highlighting to the internal admin content editor while
preserving the existing native textarea editing, live preview, validation, and
save behavior.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`

## Intended write set

- `apps/admin/src/components/admin/ContentEditor.tsx`
- `apps/admin/src/components/admin/ContentEditor.test.tsx`
- `apps/admin/src/app/globals.css`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/active/T-174-json-editor-syntax-highlight.md`

## Out-of-scope

- Replacing the textarea with CodeMirror, Monaco, Prism, Shiki, or another dependency.
- Autocomplete, line numbers, formatting, JSON path breadcrumbs, or broader CMS behavior.
- Content schema/API/database changes.
- Package or lockfile changes.

## Plan

1. Add a textarea overlay component with an aria-hidden highlighted JSON layer.
2. Add best-effort lexical tokenization for keys, strings, numbers, booleans, null, and punctuation.
3. Sync overlay scroll with the textarea.
4. Update admin CSS and focused tests.
5. Run focused admin tests and baseline checks.

## Checks

- [x] `npm run test:admin -- apps/admin/src/components/admin/ContentEditor.test.tsx`
- [x] `npm run test:admin`
- [x] `npm run typecheck:admin`
- [x] `npm run lint`
- [x] `npm run build:admin`
- [x] `git diff --check`

## Result packet

- Files changed: admin content editor, admin content editor tests, admin global CSS, workboard/project state, this task file.
- Checks run: `npm run test:admin -- apps/admin/src/components/admin/ContentEditor.test.tsx`, `npm run test:admin`, `npm run typecheck:admin`, `npm run lint`, `npm run build:admin`, `git diff --check`.
- Risks: syntax highlighting is lexical and visual-only; invalid JSON is highlighted best-effort but still validated by the existing parser/model flow.
- Follow-up: none.
