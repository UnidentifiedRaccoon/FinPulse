# T-037 — Account navigation polish

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Make the account area and logout action feel native to the responsive app navigation: integrated into the desktop sidebar and mobile bottom menu.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `src/App.tsx`
- `src/pages/EntryPage.tsx`
- `src/App.test.tsx`

## Intended write set

- `src/App.tsx`
- `src/App.test.tsx`
- `src/pages/EntryPage.tsx`
- `harness/tasks/review/T-037-account-navigation-polish.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/content model changes.
- Backend/API/auth/progress contract changes.
- New account cabinet/profile scope.
- Lesson-reader bottom CTA/navigation behavior changes.
- Existing `T-036` brand logo task.

## Plan

1. Move account/logout presentation into a cohesive desktop sidebar footer.
2. Add mobile bottom-menu account/login/logout affordances using current route/auth state.
3. Remove the redundant welcome-screen logout button.
4. Update focused app-shell tests.
5. Run project verification and rendered desktop/mobile smoke checks.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run verify`
- [x] Browser desktop smoke on `/program`
- [x] Browser mobile smoke on `/program`

## Result packet

- Files changed: `src/App.tsx`, `src/App.test.tsx`, `src/pages/EntryPage.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-037-account-navigation-polish.md`.
- Checks run: `npm run test:run -- src/App.test.tsx`; `npm run verify`; Browser desktop smoke on `/program`; Browser mobile authenticated/logout smoke on `/program`.
- Risks: Mobile bottom navigation remains hidden on lesson routes to avoid overlapping the lesson reader CTA.
- Follow-up: Add richer account destinations only after product scope includes a real profile/account route.
