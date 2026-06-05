# T-066 — Remove checkboxes from artifact template fields

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-04
Branch/worktree: existing workspace

## Goal

Remove confusing checkboxes from interactive `artifact.template` rows. Template rows such as "Трата 1: сумма и категория" should render as plain labeled text fields, while real `checklist` cards keep checkbox behavior.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`

## Intended write set

- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- JSON content/schema changes
- Checklist card behavior changes
- Persistence/API changes
- Lesson copy rewrites

## Plan

1. Change `ArtifactCard` template rendering from checkbox + textarea to label + textarea.
2. Add a focused regression test for artifact templates and keep checklist coverage intact.
3. Run focused tests, build checks, and Browser smoke on the first lesson artifact card.

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke at 390px on the expense artifact card

## Result packet

- Files changed:
  - `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
  - `src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Checks run:
  - `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
  - Browser smoke at 390px on `/lessons/where-money-goes`, card 4 artifact; no artifact checkboxes, three labeled text fields, `Далее` enabled after typing, no horizontal overflow or console warnings/errors.
- Risks:
  - Persisted artifact payload still includes the legacy `checkedRows` field for API compatibility, but this UI no longer writes it from template rows.
- Follow-up:
  - None.
