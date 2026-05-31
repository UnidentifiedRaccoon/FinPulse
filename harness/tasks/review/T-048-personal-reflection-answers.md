# T-048 — Personal reflection answers

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: local workspace

## Goal

Persist filled reflection/artifact card answers for authenticated learners and show them in the profile as a private personal artifact: "Мой финансовый ориентир" / "Мои ответы".

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

## Intended write set

- `docs/DECISIONS.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/DESIGN_SYSTEM.md`
- `server/**`
- `src/api/client.ts`
- `src/App.tsx`
- `src/pages/LessonPage.tsx`
- `src/pages/EntryPage.tsx`
- `src/features/lesson-reader/**`
- `src/content/modules/module_1/units/*.json`
- `src/App.test.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/review/T-048-personal-reflection-answers.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

Content schema writes are not planned. Runtime content copy may be touched narrowly to remove stale "local-only" wording from reflection/artifact cards.

## Out-of-scope

- Diagnostics, scoring, recommendations, literacy levels, personality labels, analytics dashboards, rewards, or gamification.
- Persisting answers for anonymous learners.
- Public or cross-user access to answers.
- Backend/admin/CMS scope.
- Broad UI redesign or content rewrites.

## Plan

1. Audit current reflection/artifact cards and metadata.
2. Add backend storage/API for authenticated user-owned answers.
3. Save required reflection/artifact answers from the lesson reader before marking the card complete.
4. Render saved answers in the profile with neutral grouping and empty state.
5. Update durable docs and project state.
6. Run focused tests, content validation if needed, `npm run verify`, and browser smoke for lesson/profile.

## Checks

- [x] focused backend tests
- [x] focused lesson/profile frontend tests
- [x] `npm run check:content` if content/schema changes
- [x] `npm run verify`
- [x] Browser mobile smoke for lesson reflection/artifact and `/profile`

## Result packet

- Files changed:
  - `server/modules/reflections/**`
  - `server/app.ts`
  - `server/db/schema.sql`
  - `server/modules/content/contentService.ts`
  - `server/app.test.ts`
  - `src/api/client.ts`
  - `src/App.tsx`
  - `src/pages/LessonPage.tsx`
  - `src/pages/EntryPage.tsx`
  - `src/features/lesson-reader/**`
  - `src/App.test.tsx`
  - targeted runtime content copy
  - docs and harness state
- Checks run:
  - `npm run check:content` — passed
  - `npm run test:run -- server/app.test.ts src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx` — passed
  - `npm run typecheck` — passed
  - `npm run lint` — passed
  - `npm run verify` — passed
  - Browser 390px smoke on `/lessons/why-values-matter` and `/profile` — passed
- Risks:
  - No export/delete UI for saved answers yet.
  - Artifact template display falls back to generic row labels if future artifacts need richer labels.
- Follow-up:
  - Consider explicit content metadata for profile grouping/export once more modules exist.
