# T-073 — Lesson Block Design Variants

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-05
Branch/worktree: current worktree

## Goal

Add a separate preview page with three modern redesign variants for the lesson theory block shown by the user, using the current FinPulse design system and explicit design-scale tokens.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/methodology/METHODOLOGY.md
- docs/methodology/AUTHORING.md
- harness/PARALLEL_AGENT_PROTOCOL.md
- docs/DESIGN_SYSTEM.md
- shadcn project info

## Intended write set

- src/index.css
- src/App.tsx
- src/pages/LessonBlockVariantsPage.tsx
- src/App.test.tsx
- harness/tasks/active/T-073-lesson-block-design-variants.md
- harness/tasks/review/T-073-lesson-block-design-variants.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- Runtime content JSON and content model changes.
- Backend/API/auth/progress/reflection behavior.
- Replacing the production lesson block before the user chooses a variant.
- New dependencies or paid/external services.

## Plan

1. Add spacing, radius, and typography design-scale CSS variables to the existing FinPulse token layer.
2. Build a standalone route with three responsive lesson-block variants using those scales and existing brand/learning tokens.
3. Add a focused routing/render test and run verification.

## Checks

- [x] npm run test:run -- src/App.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify
- [x] Browser visual smoke on http://localhost:5174/design/lesson-block-variants

## Result packet

- Files changed: src/index.css; src/App.tsx; src/pages/LessonBlockVariantsPage.tsx; src/App.test.tsx; harness/WORKBOARD.md; harness/PROJECT_STATE.md; harness/tasks/review/T-073-lesson-block-design-variants.md.
- Checks run: focused App test, typecheck, lint, build, full verify with local PostgreSQL, Browser desktop/mobile smoke.
- Risks: production lesson card is intentionally unchanged until a variant is selected.
- Follow-up: choose one of the three variants and wire it into the actual lesson theory/card renderer.
