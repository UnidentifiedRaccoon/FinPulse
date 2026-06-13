# T-111 — Runtime level/section migration

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-10
Ready for review: 2026-06-11
Branch/worktree: current workspace

## Goal

Migrate the active runtime contract from legacy technical Level/Section aliases
(`module`/`unit`) to the approved educational hierarchy:

```txt
Program -> Level -> Section -> Lesson -> Card
```

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/review/T-110-level-section-docs-alignment.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `src/content/**`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `examples/content/**`
- `server/**`
- `src/api/**`
- `src/App.tsx`
- `src/pages/**`
- `src/features/program-navigation/**`
- `src/features/lesson-reader/**` only where context naming or tests require it
- `src/test/**`
- `src/**/*.test.ts`
- `src/**/*.test.tsx`
- `docs/levels/**`
- active `docs/**` files needed to document the migrated contract, excluding
  DOCX regeneration unless explicitly required
- `harness/**` for T-111 state, workboard, prompts, feature matrix, and schemas
- this task file

## Out-of-scope

- Diagnostics, scoring, rewards, analytics, recommendations, and new product
  mechanics.
- Broad methodology machine-readability rewrite.
- Reformatting `docs/methodology/METHODOLOGY.10-06.2026.docx`.
- Historical `harness/tasks/review/**` and `harness/tasks/done/**`, except
  recording this task after completion.
- Generic engineering uses of `module`, such as `server/modules/auth` or
  JavaScript/Node module references.
- Changing lesson/card behavior, card ids, lesson slugs, or progress keys.

## Plan

1. Run five read-only subagents for inventory, content model, backend API,
   frontend routes/UI, and docs/harness verification risks.
2. Review their result packets and produce one migration plan with a write-set
   matrix and route/API removal decision for old surfaces.
3. Apply bounded non-overlapping changes by layer.
4. Run targeted checks and full verification.
5. Update this task, `harness/WORKBOARD.md`, and `harness/PROJECT_STATE.md`
   with decisions, checks, risks, and follow-up.

## Checks

- [x] `npm run check:content`
- [x] `npm run check:runtime-imports`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse ./scripts/verify.sh`
- [x] `git diff --check`
- [x] targeted legacy-contract `rg` checks from the orchestration prompt

## Result packet

- Files changed:
  - Content/schema/validation: `src/content/**`, `examples/content/**`,
    `harness/schemas/content.schema.json`, `scripts/check-content-json.mjs`,
    `src/test/loadProgram.ts`.
  - Backend/API: `server/modules/content/**`, reflection route/repository
    context fields, content/app contract tests.
  - Frontend/routes/UI: `src/api/client.ts`, `src/App.tsx`, `src/pages/**`,
    program-navigation components/helpers/stories/tests, lesson session/profile
    context usage.
  - Docs/harness: active content/product/architecture/methodology/QA docs,
    harness prompts, feature matrix, workboard, project state, this task.
- Checks run:
  - Five read-only subagents completed inventory packets for content/schema,
    backend/API, frontend/routes, docs/harness, and validation risks.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse ./scripts/verify.sh` passed after the final no-compatibility cut: content validation, runtime import guard, typecheck, lint, 9 Vitest files / 80 tests, production build, Storybook build.
  - `git diff --check` passed.
  - After user clarification, compatibility aliases, redirects, legacy response
    fields, and legacy reflection-answer storage columns were removed.
- Route/API removal decision:
  - Primary routes are `/levels/:levelSlug`,
    `/levels/:levelSlug/sections/:sectionSlug`, `/api/levels`,
    `/api/levels/:levelSlug`, `/api/sections/:sectionSlug`, and
    `/api/lessons/:lessonSlug`.
  - Old `/modules/**` browser routes are not registered and show the generic
    authenticated 404 page.
  - Old `/api/modules`, `/api/modules/:moduleSlug`, and
    `/api/units/:unitSlug` are not registered and return 404.
  - Reflection-answer persistence stores Level/Section context in
    `level_*` / `section_*` columns only.
- Risks:
  - Existing local databases created before this cut may need the development
    `reflection_answers` table recreated because no compatibility migration is
    kept.
  - Historical harness/task/ADR rows still mention old names as audit history.
  - Vite/Storybook still warn about large chunks during production builds.
- Follow-up:
  - No alias-removal follow-up remains; old runtime surfaces are intentionally
    cut for the MVP iteration stage.
