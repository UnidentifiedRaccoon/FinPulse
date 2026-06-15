# T-150 — Paragraph-aware Rich Text rendering

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-15
Branch/worktree: codex/feat-admin-production-deploy

## Goal

Make the shared lesson Rich Text renderer preserve `\n\n` paragraph breaks across all approved Markdown-enabled learner-facing fields while keeping plain-text fields plain.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`

## Intended write set

- `src/features/lesson-reader/card-renderers/richText.ts`
- `src/features/lesson-reader/card-renderers/shared.tsx`
- `src/features/lesson-reader/card-renderers/{ArtifactCard,CategorizationCard,ChecklistCard,ChoiceCard,MultiSelectCard,ReflectionCard,TheoryCard}.tsx`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/review/T-150-paragraph-aware-rich-text.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Runtime JSON/content edits.
- Markdown support for plain-text fields such as titles, CTA labels, option/category/item labels, `variants[]`, and `customOption`.
- Schema, validator, API, persistence, admin, or route changes.
- Visual redesign beyond preserving paragraph rhythm.

## Plan

1. Add shared paragraph splitting for Markdown-enabled text.
2. Add `RichTextParagraphs` while keeping `RichText` for inline contexts.
3. Route all approved full-text lesson fields through paragraph-aware rendering.
4. Add focused tests for paragraphs, inline formatting, bottom feedback, summaries, reflection/artifact text, and plain-field boundaries.
5. Run validation and browser QA on real lessons with `\n\n`.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [x] Browser QA on real lessons with paragraph breaks
- [x] `npm run verify` attempted; blocked only by missing PostgreSQL test database URL for backend suites

## Result packet

- Files changed: shared Rich Text parser/renderer, lesson card renderers, lesson bottom feedback, focused lesson-reader tests, and harness state.
- Checks run: content validation, focused lesson-reader tests, typecheck, lint, diff check passed. Full verify passed content/runtime/typecheck/lint and failed only at backend tests requiring `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- Browser QA: in-app Browser on `http://localhost:5173/` at `390x844`; verified У1.2 screen 1, У1.4 screen 1, and У1.3 screen 4 scenario feedback render real `\n\n` content as separate DOM paragraphs, with no framework overlay and no console warnings/errors.
- Risks: Browser QA covered the requested representative lesson surfaces, not every card in every lesson; focused tests cover the shared renderer paths across all Markdown-enabled field categories.
