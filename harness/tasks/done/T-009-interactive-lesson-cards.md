# T-009 — Interactive lesson cards

Status: done
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: feat/interactive-lesson-cards
Merged: PR #4 into `main` on 2026-05-25

## Goal

Add local-only MVP interactivity to first-unit lesson cards in the reader without backend, accounts, diagnostics, rewards, analytics, SSR, or persistence.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/engineering/contributing.md`
- `docs/modules/module_1/lesson_01/README.md`
- `src/features/lesson-reader/LessonCardRenderer.tsx`
- `src/content/modules/module_1/units/unit_01_values_and_goals.json`
- `src/content/program.ts`

## Intended write set

- `src/features/lesson-reader/**`
- focused tests under `src/**`
- `src/content/modules/module_1/units/unit_01_values_and_goals.json`, only if `readOnly` blocks intended cards
- `docs/CONTENT_MODEL.md`, only if `readOnly` semantics need clarification
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`, only if workflow or verification state changes
- `harness/tasks/active/T-009-interactive-lesson-cards.md`

## Out-of-scope

- Accounts/cabinets
- Diagnostics as a product system
- Rewards/gamification
- Analytics
- Backend/admin/CMS
- SSR/Next.js
- Progress or answer persistence
- Broad content model refactors

## Plan

1. Spawn read-only scope and content semantics reviewers.
2. Implement the smallest local component-state interaction layer.
3. Add focused tests for objective and subjective card flows.
4. Run verify, diff check, and browser smoke at desktop and 360px.
5. Update task/workboard state, commit, push, and open a draft PR.

## Checks

- [x] `npm run verify`
- [x] `git diff --check`
- [x] desktop browser smoke
- [x] 360px mobile browser smoke

## Result packet

- Files changed: `src/features/lesson-reader/LessonCardRenderer.tsx`, `src/features/lesson-reader/LessonCardRenderer.test.tsx`, `src/content/modules/module_1/units/unit_01_values_and_goals.json`, `docs/CONTENT_MODEL.md`, `harness/WORKBOARD.md`, this task file.
- Checks run: `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`; `npm run verify`; `git diff --check`; browser smoke desktop and 360px.
- Risks: answers are intentionally local React state only and reset on navigation/reload; no persistence or scoring was added.
- Follow-up: PR ready for review.

## Continuation review — 2026-05-25

- PR/CI review: PASS; PR #4 is open as draft, mergeable, and had GitHub Actions `npm run verify` passing on `a48a06c`.
- Accessibility review: PASS by static review; browser smoke repeated by orchestrator after server startup.
- Content semantics review: fixed two supplemental wording items that implied persistence (`Артефакт` glossary definition and product cycle text).
- Checks rerun after continuation fix: `npm run verify`; `git diff --check`; browser smoke desktop and 360px.
- Browser smoke evidence: overview -> module -> unit -> lesson path rendered, `single_choice` feedback shown, `reflection` local state shown, `checklist` toggled, no console warnings/errors, and no horizontal overflow at 360px.
- Ready for review: PR #4 can move out of draft after CI stays green on the latest branch head.
- Merge result: accepted and merged in PR #4.
