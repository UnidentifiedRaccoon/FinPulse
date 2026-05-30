# T-040 — Remove broad mascot placements

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Remove visible mascot placements from the current learner UI so the mascot can be reintroduced later only in user-approved locations.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `build-web-apps:react-best-practices` skill
- `build-web-apps:frontend-testing-debugging` skill

## Intended write set

- `src/pages/EntryPage.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/ModulePage.tsx`
- `src/features/program-navigation/ModulePathNode.tsx`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/lesson-reader/LessonFeedback.tsx`
- `src/features/lesson-reader/LessonSession.tsx`
- `harness/tasks/review/T-040-remove-mascot-placements.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Coordination

`src/features/program-navigation/LessonPathMap.tsx` also belonged to T-039 while this work started. T-040 changes in that file are limited to removing mascot import/rendering and do not modify the lesson-node glare polish.

## Out-of-scope

- Deleting the approved mascot asset/component/docs
- Adding new mascot placements
- Content/API/backend/auth/progress changes
- Broad navigation or lesson-reader redesign

## Plan

1. Remove all visible `<Mascot />` placements from current app surfaces.
2. Keep the reusable mascot component and assets available for later approved placements.
3. Run focused search, project verification, and rendered frontend smoke.

## Checks

- [x] `rg "Mascot|mascot|finpulse-mascot" src`
- [x] `npm run verify`
- [x] Browser rendered smoke for entry/program/module/lesson surfaces

## Result packet

- Files changed: `src/pages/EntryPage.tsx`, `src/pages/ProgramOverviewPage.tsx`, `src/pages/ModulePage.tsx`, `src/features/program-navigation/ModulePathNode.tsx`, `src/features/program-navigation/LessonPathMap.tsx`, `src/features/lesson-reader/LessonFeedback.tsx`, `src/features/lesson-reader/LessonSession.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, task file.
- Checks run: `rg "Mascot|mascot|finpulse-mascot" src` confirmed only `src/shared/ui/Mascot.tsx` remains; `npm run verify` passed; Browser smoke passed for `/`, `/program`, `/modules/financial-goals`, `/lessons/why-values-matter`, and the module lesson dialog at desktop and 390px where applicable.
- Risks: The reusable mascot component and assets are now intentionally unused until the user chooses specific placements.
- Follow-up: Reintroduce the mascot only in explicit user-approved locations.
