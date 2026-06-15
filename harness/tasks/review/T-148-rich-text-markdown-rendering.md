# T-148 — Rich Text Markdown rendering

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-15
Branch/worktree: codex/feat-admin-production-deploy

## Goal

Render approved Markdown-enabled lesson fields as safe rich text in the learner UI while keeping plain-text fields plain.

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

Subagent orchestration requested by the user:

- Renderer Agent: shared renderer and card-renderer audit/patch packet.
- Test Agent: focused lesson-reader regression tests.
- Verifier Agent: final grep/check audit after integration.

## Intended write set

- `src/features/lesson-reader/card-renderers/shared.tsx`
- `src/features/lesson-reader/card-renderers/richText.ts`
- `src/features/lesson-reader/card-renderers/**`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/content/program.test.ts`, only if focused content-model regression coverage needs an adjustment
- `docs/CONTENT_MODEL.md`, only to remove the stale note that renderer support is missing
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/**/T-148-rich-text-markdown-rendering.md`

## Out-of-scope

- Runtime JSON content edits.
- API, persistence, route, schema, or validator contract changes.
- New Markdown syntax beyond the approved inline subset.
- Diagnostics, scoring, reminders, gamification, personalization, or new product mechanics.
- Reintroducing fact/formula/example/simple-test heuristics.

## Plan

1. Add a safe `RichText` renderer beside `NoBreakText`.
2. Use it only for Markdown-enabled lesson fields from `CONTENT_MODEL.md`.
3. Keep labels, CTA text, ids, values, variants, placeholders, and source paths plain.
4. Add focused renderer tests for rich formatting, plain-text boundaries, and heuristic regression.
5. Run content, test, typecheck, lint, diff, and verify checks where available.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/content/program.test.ts`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [x] `npm run verify` reached backend tests after content/runtime/typecheck/lint and failed only because this shell lacks `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.

## Result packet

- Files changed:
  - `src/features/lesson-reader/card-renderers/richText.ts`
  - `src/features/lesson-reader/card-renderers/shared.tsx`
  - `src/features/lesson-reader/card-renderers/{TheoryCard,ChoiceCard,MultiSelectCard,CategorizationCard,ReflectionCard,ArtifactCard,ChecklistCard}.tsx`
  - `src/features/lesson-reader/LessonSession.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `docs/CONTENT_MODEL.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - `npm run check:content` passed.
  - `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/content/program.test.ts` passed, 38 tests.
  - `npm run typecheck` passed.
  - `npm run lint` passed.
  - `git diff --check` passed.
  - `npm run verify` passed content validation, runtime import guard, typecheck, and lint, then failed only on backend/content API tests because no PostgreSQL test URL is configured in this shell.
- Risks:
  - Full backend verify remains gated by the known PostgreSQL test database prerequisite.
  - The inline Markdown parser intentionally supports only the approved subset and treats broken/nested markup as safe text.
- Follow-up:
  - Re-run full `npm run verify` with `FINPULSE_TEST_DATABASE_URL` before merge if a local PostgreSQL test database is available.
