# T-099 — Custom option textarea

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: existing workspace

## Goal

Make `Свой вариант` on reflection/artifact lesson screens reveal the same textarea-like answer field pattern used for personal screen-four entries, instead of a compact one-line input.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`

## Intended write set

- `src/features/lesson-reader/card-renderers/shared.tsx`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/active/T-099-custom-option-textarea.md`
- `harness/tasks/review/T-099-custom-option-textarea.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/schema changes
- Backend/API/database/auth/progress changes
- Reworking non-custom variant choices

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- [x] Browser 390px smoke on `/lessons/why-emergency-fund`

## Result packet

Files changed:

- `src/features/lesson-reader/card-renderers/shared.tsx`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/review/T-099-custom-option-textarea.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

Checks run:

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser 390px smoke on `http://localhost:5174/lessons/why-emergency-fund`

Risks:

- The accessible name for the custom text area is now the visible label `Мой вариант` instead of the previous hidden `Введите свой вариант`.

Follow-up:

- None.
