# T-133 — Lesson Card Directional Transition

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: current workspace

## Goal

Add a restrained next/back lesson-card transition that fits the FinPulse mobile-first lesson reader.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- native-app-designer skill

## Intended write set

- src/features/lesson-reader/LessonSession.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- src/index.css
- harness/tasks/review/T-133-lesson-card-directional-transition.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Content JSON/schema changes
- New animation dependencies
- Backend/API/progress changes
- Broad lesson-reader layout refactors

## Plan

1. Add direction state for next/back card navigation.
2. Wrap the active lesson screen content in a keyed transition surface.
3. Add CSS keyframes using transform/opacity with reduced-motion fallback.
4. Cover forward/back classes in focused tests.
5. Run focused verification and browser smoke.

## Checks

- [x] npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] Browser smoke
- [x] npm run verify (attempted; backend suites require `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`)

## Result packet

- Files changed: `src/features/lesson-reader/LessonSession.tsx`, `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `src/index.css`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, this task file
- Checks run: focused lesson-reader test, typecheck, lint, production build, in-app Browser 390x844 smoke on `/lessons/where-money-goes`; full `npm run verify` reached backend tests and failed only because this shell has no PostgreSQL test database URL
- Risks: transition is intentionally entry-only, not a two-card carousel, to avoid unstable height and sticky CTA interactions
- Follow-up: tune distance/duration after hands-on mobile review if the side motion feels too pronounced
