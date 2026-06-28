# T-153 — Section Passport Description

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28
Branch/worktree: current workspace

## Goal

Add a compact expandable section passport under each section heading in the
lesson path, update the first section description to the methodologist wording,
and keep visible section headings free of the `Раздел N.` prefix while retaining
the sticky header section-number context.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`

## Intended write set

- `src/content/levels/level_1_start/level.json`
- `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/program-navigation/lessonPathSections.ts`
- `src/App.test.tsx`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- this task file

## Out-of-scope

- New content model fields or runtime schema changes.
- Sticky header layout redesign beyond using the normalized title.
- Lesson content, API routes, persistence, auth, admin, analytics, rewards,
  diagnostics, or backend/CMS work.

## Plan

1. Preserve the existing `description` field as the section passport source.
2. Replace the first section description in active runtime content.
3. Normalize section display titles by stripping `Раздел N.` in UI-only mapping.
4. Render `section.description` as a compact expandable section passport under
   each section heading.
5. Update focused tests and run validation.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `git diff --check`
- [x] `npm run build:web`
- [x] `npm run verify` attempted; blocked only by missing backend test database URL

## Result packet

- Files changed:
  - Updated the first section description in the section JSON and level section
    ref.
  - Added compact expandable section passports to the lesson path using the
    existing `section.description` field.
  - Normalized displayed section titles so `Раздел 1. Деньги и операции`
    renders as `Деньги и операции`, while the sticky context still says
    `Уровень 1 раздел 1`.
  - Updated App tests for the new title and passport disclosure behavior.
- Checks run:
  - `npm run check:content` — pass.
  - `npm run test:run -- src/App.test.tsx` — pass, 38 tests.
  - `npm run typecheck` — pass.
  - `npm run lint` — pass.
  - `git diff --check` — pass.
  - `npm run build:web` — pass.
  - `npm run verify` — content validation, runtime import guard, typecheck, and
    lint passed; backend test suites failed because this shell has no
    `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- Risks:
  - Visual QA was covered by component-level App tests and production web build,
    not by a browser smoke session against a real backend.
- Follow-up:
  - Run full verify with a local PostgreSQL test database URL if backend suites
    need to be green locally.
