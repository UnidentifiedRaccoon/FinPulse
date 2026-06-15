# T-146 — Markdown Content Contract

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-15
Branch/worktree: main working tree

## Goal

Implement the technical content contract for approved Markdown-enabled lesson
fields while keeping current rendering plain text, and remove the old passive
theory heuristics that promoted fact/formula/example/test paragraphs into
special calculation panels.

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
- `src/content/program.ts`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/features/lesson-reader/card-renderers/TheoryCard.tsx`
- focused lesson-reader/content tests

## Intended write set

- `docs/CONTENT_MODEL.md`
- `docs/DESIGN_SYSTEM.md`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/content/program.ts`
- `src/content/program.test.ts`
- `src/features/lesson-reader/card-renderers/TheoryCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/index.css`
- `harness/tasks/active/T-146-markdown-content-contract.md`
- `harness/tasks/review/T-146-markdown-content-contract.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Rich Markdown rendering in React.
- Runtime lesson JSON rewrites.
- API, persistence, admin, auth, routes, or UI redesign.
- DOCX or Google Docs edits.

## Checks

- [x] JSON Schema parse smoke
- [x] Validator syntax check
- [x] `npm run check:content`
- [x] focused content and lesson-reader tests
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [x] `npm run verify` attempted; backend suites require a local PostgreSQL test URL

## Result packet

- Files changed: `docs/CONTENT_MODEL.md`, `docs/DESIGN_SYSTEM.md`,
  `harness/schemas/content.schema.json`, `scripts/check-content-json.mjs`,
  `src/content/program.ts`, `src/content/program.test.ts`,
  `src/features/lesson-reader/card-renderers/TheoryCard.tsx`,
  `src/features/lesson-reader/LessonCardRenderer.test.tsx`,
  `src/index.css`, and harness task/state files.
- Checks run: schema JSON parse, validator syntax check,
  `npm run check:content`, focused `program.test.ts` +
  `LessonCardRenderer.test.tsx`, `npm run typecheck`, `npm run lint`,
  `git diff --check`, and `npm run verify`.
- Verify note: `npm run verify` passed content validation, runtime import guard,
  typecheck, and lint, then failed only when backend tests required
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- Behavior: approved Markdown fields are now a data/schema/validator contract,
  but the learner UI still renders Markdown strings as plain text until a
  dedicated safe renderer is implemented.
- Cleanup: passive theory cards no longer infer calculation/insight surfaces
  from `Факт`, `Формула`, `Пример`, `Простой тест`, or formula-like prose.
