# T-016 — Lesson card experience

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/lesson-card-experience

## Goal

Переработать lesson/card UI в focused session: одна активная карточка, progress внутри урока, sticky bottom CTA, спокойные feedback states и mobile-first поведение на 360px.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/CONTENT_MODEL.md`
- `docs/DECISIONS.md`
- `docs/engineering/contributing.md`
- `package.json`
- `src/pages/LessonPage.tsx`
- `src/features/lesson-reader/**`
- `src/api/**`
- current tests under `src/**/*.test.*`

## Intended write set

- `src/features/lesson-reader/**`
- `src/pages/LessonPage.tsx`
- focused frontend tests
- `harness/tasks/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md` if durable state changes
- `src/index.css` only if existing design tokens need narrow alignment

## Out-of-scope

- backend/API contract changes
- content schema changes
- direct runtime content JSON/loaders in rendered app code
- rewards, XP, points, streaks, badges, challenges, mascots, diagnostics, scoring, recommendations
- persisting full reflection/artifact answers
- broad app redesign outside lesson/card experience

## Plan

1. Preserve lesson data loading through `/api/lessons/:slug` and existing progress calls.
2. Replace long lesson article rendering with a `LessonSession` shell.
3. Add focused card frame, progress header, sticky bottom action, and local card interaction states.
4. Add narrow tests for navigation, choice feedback, checklist/reflection local behavior, and completion progress.
5. Run `npm run verify` and browser smoke at desktop and 360px.

## Checks

- [x] `npm run verify`
- [x] browser smoke: desktop-ish viewport
- [x] browser smoke: 360px viewport
- [x] no horizontal overflow at 360px
- [x] console errors checked

## Result packet

- Files changed: `src/features/lesson-reader/**`, `src/pages/LessonPage.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/index.css`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file, screenshot evidence.
- Checks run: `npm run verify` passed on 2026-05-26.
- Browser smoke: PASS on desktop-ish and 360px/360x740; overview -> module -> unit -> lesson, choice feedback, theory advance, reflection local state, checklist interaction, completion, auth register/logout, no console errors.
- Screenshot evidence: `T-016-mobile-360.png`, `T-016-choice-feedback-360.png`.
- Risks: reflection/artifact answers remain transient by design; saved progress is limited to viewed/completed markers.
- Follow-up: draft PR review.
