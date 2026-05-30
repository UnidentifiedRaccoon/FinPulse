# T-019 — Sky blue token rename

Status: done
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree:

## Goal

Replace the current accent scale with the selected sky-blue scale and rename the design tokens to `sky`.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- shadcn project context via `components.json`

## Intended write set

- `src/index.css`
- `docs/DESIGN_SYSTEM.md`
- `src/features/storybook/foundations/Colors.stories.tsx`
- `src/features/storybook/foundations/Shadows.stories.tsx`
- `src/features/storybook/foundations/SpacingRadius.stories.tsx`
- `src/components/ui/button.stories.tsx`
- `src/App.tsx`
- `src/pages/ModulePage.tsx`
- `src/features/program-navigation/ModulePathNode.tsx`
- `src/features/program-navigation/PathProgressSummary.tsx`
- `src/features/program-navigation/PathStepNode.tsx`
- `src/features/program-navigation/CurrentStepCta.tsx`
- `src/features/lesson-reader/LessonBottomAction.tsx`
- `src/features/lesson-reader/LessonProgressHeader.tsx`
- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `harness/tasks/done/T-019-sky-blue-token-rename.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- Broader visual redesign
- shadcn component updates
- Product/content changes
- Backend/API changes

## Plan

1. Rename CSS variables and token docs to `sky`.
2. Replace component and Storybook references to use `--fr-color-sky-*`.
3. Run project verification and update task/project state.

## Checks

- [x] `npm run verify`

## Result packet

- Files changed: `src/index.css`, `docs/DESIGN_SYSTEM.md`, direct UI/Storybook token references, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`
- Checks run: `npm run verify`
- Risks: Existing uncommitted review-task changes are present in the workspace; this task only touched direct accent-token references.
- Follow-up: Recheck visual balance in Storybook or browser if the broader design pass changes surrounding brand colors.
