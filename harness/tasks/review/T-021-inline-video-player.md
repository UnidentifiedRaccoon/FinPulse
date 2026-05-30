# T-021 — Inline video player

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Finished: 2026-05-30
Branch/worktree: feat/learning-path-storybook-catalog

## Goal

Render lesson video cards inside the app instead of showing only an external platform link.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- RUTUBE embed/player documentation

## Intended write set

- src/features/lesson-reader/card-renderers/VideoCard.tsx
- src/features/lesson-reader/card-renderers/VideoCard.stories.tsx
- src/features/lesson-reader/card-renderers/TheoryCard.tsx
- src/features/lesson-reader/LessonCardRenderer.tsx
- src/features/lesson-reader/LessonCardRenderer.test.tsx
- src/features/storybook/fixtures.ts
- docs/CONTENT_MODEL.md
- harness/tasks/review/T-021-inline-video-player.md

## Out-of-scope

- Uploading or hosting video files in the repository.
- Adding paid/external video services.
- Backend/content API schema changes.
- Playback analytics or diagnostics.

## Plan

1. Add a dedicated video card renderer using provider embed URLs.
2. Keep a fallback link for unsupported or blocked embeds.
3. Support RUTUBE timecode jumps through documented URL parameters.
4. Cover the rendered iframe behavior with focused tests.

## Checks

- [x] npm run typecheck
- [x] npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx
- [x] npm run verify
- [x] Browser smoke at `http://localhost:5174/lessons/why-values-matter`
- [x] Browser mobile smoke at 390px

## Result packet

- Files changed: `src/features/lesson-reader/card-renderers/VideoCard.tsx`, `src/features/lesson-reader/card-renderers/VideoCard.stories.tsx`, `src/features/lesson-reader/card-renderers/TheoryCard.tsx`, `src/features/lesson-reader/LessonCardRenderer.tsx`, `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `src/features/storybook/fixtures.ts`, `docs/CONTENT_MODEL.md`, `harness/tasks/review/T-021-inline-video-player.md`
- Checks run: `npm run typecheck`; `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`; `npm run verify`; Browser smoke on the lesson video card at default width and 390px.
- Risks: RUTUBE iframe availability still depends on the platform/network and the source video's embed permissions; unsupported video URLs fall back to the source link.
- Follow-up: If other providers are added, add provider-specific embed URL normalization and tests.
