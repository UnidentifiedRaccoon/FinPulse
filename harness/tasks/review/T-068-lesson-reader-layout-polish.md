# T-068 — Lesson reader layout polish

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-04
Branch/worktree: existing workspace

## Goal

Polish the shared lesson-reader layout so the progress header, lesson brief, main card, and selectable options read as one calm mobile learning surface.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`

## Intended write set

- `.storybook/preview.tsx`
- `src/features/lesson-reader/LessonProgressHeader.tsx`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonBottomAction.tsx`
- `src/features/lesson-reader/LessonCardFrame.tsx`
- `src/features/lesson-reader/card-renderers/shared.tsx`
- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `src/features/lesson-reader/card-renderers/ChecklistCard.tsx`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/LessonProgressHeader.stories.tsx`
- `src/features/lesson-reader/LessonBottomAction.stories.tsx`
- `src/features/lesson-reader/LessonCardFrame.stories.tsx`
- `src/features/lesson-reader/card-renderers/ChoiceCard.stories.tsx`
- `src/features/storybook/LessonStoryFrame.tsx`
- `src/features/storybook/fixtures.ts`
- `harness/tasks/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- JSON content/schema changes
- Backend/API/auth/progress changes
- New product mechanics, rewards, diagnostics, analytics, or personalization
- Replacing the design system or adding external services

## Plan

1. Align lesson header/container rhythm and make the progress bar feel attached to the lesson shell.
2. Compact the first-card lesson brief without dropping description or learning goal content.
3. Tighten card frame spacing and heading wrapping.
4. Extract and reuse an internal selectable option primitive for choice, checklist, and reflection option rows.
5. Update Storybook stories for long Russian text and selected/correct/retry states.
6. Run focused tests, static checks, verify when possible, and Browser/Storybook visual QA.

## Checks

- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] `npm run build:storybook`
- [x] Browser/Storybook visual QA at 360/390/430/desktop widths

## Result packet

Files changed:

- `LessonProgressHeader`, `LessonSession`, `LessonBottomAction`, and `LessonCardFrame` now share a 480px lesson shell rhythm, stable header columns, compact lesson brief, tighter card padding/typography, and CTA/header alignment.
- `card-renderers/shared.tsx` now provides the internal typed `SelectableOption` primitive used by choice, checklist, and reflection options while keeping native inputs accessible.
- Choice/checklist/reflection option rows now share touch height, wrapping, focus, selected, correct, and retry visual states.
- Storybook fixtures/stories now cover long Russian choice text plus selected/correct/retry states; the Storybook lesson frame/decorator no longer creates artificial mobile horizontal overflow.

Checks run:

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx` passed: 2 files, 33 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify` passed: content validation, runtime import guard, typecheck, lint, 8 test files / 60 tests, production build.
- `npm run build:storybook` passed; Storybook still emits the existing `radix-ui` package metadata warning and large chunk warning.

Browser QA:

- Runtime lesson `/lessons/where-money-goes` passed at 360, 390, 430, and desktop widths: no horizontal overflow, header/brief/card/bottom action share left/right alignment, selected option remains stable, and `Далее` advances without sticky CTA covering content.
- Storybook `lesson-choicecard--long-russian-text`, `--long-russian-correct`, and `--long-russian-retry` passed at 390px: `scrollWidth` equals viewport, no overflow elements, long option text wraps cleanly, and console warn/error logs are empty.

Follow-up after visual review:

- Fixed the actual option-row alignment issue: `SelectableOption` now uses an explicit `20px + text` grid instead of `flex/items-start`.
- The native input is absolutely hidden outside layout flow, so it cannot create a phantom column or shift the visible marker/text.
- Runtime Browser QA on `/lessons/where-money-goes` at 390px after selecting `Да, постоянно так` passed: marker center equals label center and text center (`0px` delta), marker-to-text gap is exactly `12px`, `scrollWidth` is `390`, overflow elements are empty, `Далее` is enabled, console warn/error logs are empty.
- Additional checks after this follow-up passed: focused lesson/app tests, `npm run typecheck`, `npm run lint`, full `npm run verify` with local PostgreSQL, and `npm run build:storybook`.

Risks/notes:

- No content JSON, schema, backend/API routes, auth, progress, or MVP scope changed.
- Existing unrelated dirty worktree changes were preserved.
