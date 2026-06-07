# T-102 — Lesson completion variants

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-06-07
Branch/worktree: current workspace

## Goal

Add a standalone experiment page with four possible lesson-completion screen directions using the existing mascot and restrained victory motion.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/MASCOT.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- current app routing and lesson completion code

## Intended write set

- `src/pages/LessonCompletionVariantsPage.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/index.css`
- `harness/tasks/review/T-102-lesson-completion-variants.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Production `LessonSession` completion behavior.
- Content JSON or methodology changes.
- Backend, auth, progress, reflection, scoring, rewards, streaks, or analytics.
- New external assets or dependencies.

## Plan

1. Use four read-only subagents to define variant concepts.
2. Implement a standalone `/design/lesson-completion-variants` route.
3. Keep variants mobile-first, accessible, and scoped to existing tokens/Mascot.
4. Add focused app test coverage.
5. Run focused checks and full verify when feasible.
6. Browser-smoke the experiment route at mobile and desktop widths.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] Browser smoke on `/design/lesson-completion-variants`

## Subagent packets

- Variant 1: `Тихий финиш`, a calm success state with one mascot micro-hop and route continuation.
- Variant 2: `Отметка маршрута`, a checkpoint/path metaphor without rewards or streaks.
- Variant 3: `Правило с собой`, a personal takeaway/save-note direction.
- Variant 4: `Компас отметил финиш`, the most playful restrained mascot/route-dot celebration.

## Result packet

- Files changed: `src/pages/LessonCompletionVariantsPage.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/index.css`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: focused App test, typecheck, lint, build, full verify with local test DB URL, Browser smoke at 390px and 1280px.
- Risks: the route is an experiment page inside the authenticated shell; production lesson completion is unchanged until a variant is selected.
- Follow-up: choose one variant or combine pieces before applying to `LessonSession`.
