# T-051 — Mobile lesson CTA bottom alignment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: current workspace

## Goal

Verify whether the lesson `Далее` action is not consistently pinned to the bottom of the mobile viewport, then fix the confirmed issue with the smallest UI change.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `build-web-apps:frontend-testing-debugging`
- `build-web-apps:react-best-practices`
- `build-web-apps:shadcn`

## Intended write set

- `src/features/lesson-reader/**`
- `src/App.test.tsx` if route-level assertions are needed
- `harness/tasks/active/T-051-mobile-lesson-cta-bottom.md`
- `harness/tasks/review/T-051-mobile-lesson-cta-bottom.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- No content JSON edits.
- No route, backend, auth, progress, profile, analytics, rewards, or diagnostics scope changes.
- No broad lesson reader redesign.
- Do not edit T-050 artifacts or task file.

## Plan

1. Inspect lesson reader layout and card types that affect mobile vertical sizing.
2. Reproduce the CTA positioning issue in a mobile viewport.
3. Apply a minimal layout fix.
4. Add focused regression coverage where practical.
5. Run targeted checks, rendered mobile smoke, and `npm run verify`.

## Checks

- [x] Focused lesson-reader tests
- [x] Mobile rendered smoke check
- [x] `npm run verify`

## Result packet

- Files changed: `src/features/lesson-reader/LessonSession.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`; `npm run verify`; Browser smoke on `http://127.0.0.1:5174/lessons/why-values-matter` and `/lessons/day-in-future` at 390x844 plus `/lessons/why-values-matter` at 1280x720.
- Risks: layout regression coverage is rendered-browser based because jsdom does not compute sticky/flex viewport positions.
- Follow-up: none for this issue.
