# T-135 — Route Screen Transitions

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: current workspace

## Goal

Add restrained route-level motion for the core learning journey and profile switching, while preserving the learner's context when returning from a lesson to the level path.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- native-app-designer skill
- frontend-testing-debugging skill
- browser skill

## Intended write set

- src/App.tsx
- src/App.test.tsx
- src/index.css
- src/pages/LevelPage.tsx
- src/pages/SectionPage.tsx
- src/features/program-navigation/LessonPathMap.tsx
- src/features/lesson-reader/LessonProgressHeader.tsx
- src/features/lesson-reader/LessonSession.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- src/shared/routeTransitions.ts
- src/shared/routeTransitions.test.ts
- src/shared/usePathReturnScroll.ts
- docs/DESIGN_SYSTEM.md
- harness/tasks/review/T-135-route-screen-transitions.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Out-of-scope

- New animation dependencies.
- View Transitions API or retained exit screens.
- Content JSON, backend API, auth, persistence, diagnostics, rewards, analytics, or recommendation changes.
- Changing the public route map.

## Plan

1. Add route classification and transition-kind utilities.
2. Wrap authenticated routes in a keyed transition frame.
3. Add path scroll/focus memory for lesson entry and return links.
4. Add CSS keyframes and reduced-motion fallbacks.
5. Cover route classifier, app wrapper, lesson return links, and path focus behavior in tests.
6. Run focused verification, build checks, and browser QA.

## Checks

- [x] npm run test:run -- src/shared/routeTransitions.test.ts src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx
- [x] npm run typecheck
- [x] npm run lint
- [x] npm run build
- [x] npm run verify (plain attempt reached backend tests and needed a DB URL)
- [x] FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify
- [x] Browser QA

## Result packet

- Files changed: `src/App.tsx`, `src/App.test.tsx`, `src/index.css`, `src/pages/LevelPage.tsx`, `src/pages/SectionPage.tsx`, `src/features/program-navigation/LessonPathMap.tsx`, `src/features/lesson-reader/LessonProgressHeader.tsx`, `src/features/lesson-reader/LessonSession.tsx`, `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `src/shared/routeTransitions.ts`, `src/shared/routeTransitions.test.ts`, `src/shared/usePathReturnScroll.ts`, `docs/DESIGN_SYSTEM.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: focused route/App/lesson tests; typecheck; lint; build; full verify with local PostgreSQL; in-app Browser mobile and desktop QA.
- Browser QA: mobile `program -> level -> lesson -> level`, mobile full first-lesson completion into next lesson, desktop profile switch, console health, no horizontal overflow, and reduced-motion CSS fallback.
- Risks: route transitions are entry-only by design; reduced-motion was verified through compiled CSS because the in-app Browser API does not expose media emulation.
