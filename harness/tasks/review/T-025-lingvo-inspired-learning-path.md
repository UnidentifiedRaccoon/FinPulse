# T-025 — Lingvo-inspired learning path

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: feat/learning-path-storybook-catalog

## Goal

Bring Lingvo-like learning path concepts into the FinPulse module experience: module cards, sectioned lesson map, lesson detail popup before navigation, and end-of-module transition card.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `frontend-design` skill
- `shadcn` skill and current shadcn project info

## Intended write set

- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/ModulePage.tsx`
- `src/pages/UnitPage.tsx`
- `src/features/program-navigation/ModulePathNode.tsx`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/program-navigation/lessonPathSections.ts`
- `src/components/ui/dialog.tsx`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/model changes.
- Backend/API changes.
- Accounts, rewards, diagnostics, analytics, or personalized recommendations.
- Broad routing or architecture rewrites.

## Plan

1. Add the missing shadcn dialog primitive for the lesson launch popup.
2. Replace direct lesson links in module/unit paths with lesson nodes that open a detail dialog.
3. Restyle module overview cards and module path sections around current progress.
4. Add an end-of-module transition card and focused tests.
5. Run verification and update harness state.

## Checks

- [x] `npm run test:run -- src/App.test.tsx src/features/program-navigation/learningPath.test.ts`
- [x] `npm run verify`
- [x] Browser smoke for `/program` and `/modules/financial-goals`

## Result packet

- Files changed: `src/pages/ProgramOverviewPage.tsx`, `src/pages/ModulePage.tsx`, `src/pages/UnitPage.tsx`, `src/features/program-navigation/ModulePathNode.tsx`, `src/features/program-navigation/LessonPathMap.tsx`, `src/features/program-navigation/lessonPathSections.ts`, `src/components/ui/dialog.tsx`, `src/App.test.tsx`, harness state files.
- Checks run: focused Vitest suite, `npm run verify`, Browser smoke for module overview, module path, lesson popup, and 390px layout.
- Risks: Browser screenshot capture timed out in the in-app browser, so rendered QA evidence is DOM/layout/console based rather than screenshot based. Current content still has one real module; the next-module card falls back to an availability/finish card until module 2 exists in JSON.
- Follow-up: add more real modules/units in content when the course structure is ready.
