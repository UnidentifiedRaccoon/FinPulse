# T-071 — Custom reflection option input

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: existing workspace

## Goal

Let `reflection.inputType: "single_select"` cards expose and persist a typed custom answer when the learner chooses `Свой вариант`.

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
- `build-web-apps:react-best-practices` skill

## Intended write set

- `docs/CONTENT_MODEL.md`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/content/program.ts`
- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/lessonInteraction.ts`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/active/T-071-custom-reflection-option-input.md`
- `harness/tasks/review/T-071-custom-reflection-option-input.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Backend/API/database/auth/progress changes
- New interaction types beyond `reflection.inputType: "single_select"`
- Diagnostics, scoring, recommendations, analytics, rewards, or personalization
- Broad lesson-reader redesign

## Result packet

- Files changed: content contract docs/schema/zod/manual validator; current T1 reflection JSON; `ReflectionCard`; `lessonInteraction`; focused lesson-reader tests; harness state.
- Checks run: `npm run check:content`; `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`; `npm run typecheck`; `npm run lint`; `npm run build`; `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`; Browser smoke at 390px on `/lessons/where-money-goes`.
- Risks: T-072 is also active on `src/content/modules/t1_start/units/unit_{01,02}_*.json`; this task only changes reflection `customOption` fields, but review should reconcile the shared files.
- Follow-up: none required for backend/API; custom answers continue to persist as `singleValue`.
