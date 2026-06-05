# T-074 — Artifact micro-rule custom radio

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: existing workspace

## Goal

Render the current Unit 1 micro-rule artifact cards as radio choices with a separate typed `Свой вариант` option, while preserving artifact answer persistence through `selectedVariant`.

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
- `build-web-apps:shadcn`
- `build-web-apps:react-best-practices`

## Intended write set

- `docs/CONTENT_MODEL.md`
- `docs/QA_USER_SCENARIO_MAP.md`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/content/program.ts`
- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/lesson-reader/card-renderers/ArtifactCard.stories.tsx`
- `src/features/lesson-reader/lessonInteraction.ts`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-074-artifact-micro-rule-custom-radio.md`
- `harness/tasks/review/T-074-artifact-micro-rule-custom-radio.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Backend/API/database/auth/progress changes
- Installing shadcn `radio-group`
- Changing non-micro-rule artifact variant cards
- Diagnostics, scoring, recommendations, analytics, rewards, reminders, or personalization

## Plan

1. Add optional `artifact.customOption` to docs, zod schema, JSON schema, and manual validator.
2. Add `customOption` to the two current Unit 1 micro-rule artifact cards.
3. Reuse `SelectableOption` in `ArtifactCard` only when an artifact has both `variants` and `customOption`.
4. Preserve persisted payload shape by saving custom text into `selectedVariant`.
5. Add focused renderer/app tests, run checks, and record the result.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke at 390px for both Unit 1 micro-rule screens

## Result packet

- Files changed: content model docs/schema/zod/manual validator; Unit 1 runtime JSON; artifact renderer/state/story state; focused lesson/app tests; QA scenario map; harness state.
- Checks run: `npm run check:content`; `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`; `npm run typecheck`; `npm run lint`; `npm run build`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`; standalone Chrome/Playwright 390px smoke on `where-money-goes` and `mandatory-and-desired`; follow-up focused `npm run check:content`, `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`, and `npm run typecheck` after removing the unintended fallback artifact textarea from custom-option cards.
- Risks: plain `npm run verify` still requires a local database env var and fails backend tests when `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL` is unset.
- Follow-up: none required; `T-073` was already occupied by lesson-block design variants, so this task used `T-074`.
