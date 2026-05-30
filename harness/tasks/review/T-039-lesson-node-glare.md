# T-039 — Lesson node glare polish

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Make the shine/glare on highlighted circular lesson nodes cross the whole button, closer to the Lingvo-style reference.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `build-web-apps:frontend-testing-debugging` skill

## Intended write set

- `src/features/program-navigation/LessonPathMap.tsx`
- `harness/tasks/review/T-039-lesson-node-glare.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content/API/backend changes
- Rewards, diagnostics, analytics, personalization
- Broad learning-path redesign

## Plan

1. Replace the short node highlight with a clipped diagonal glare that spans the full circular button.
2. Keep the effect limited to highlighted current/completed nodes.
3. Run project verification and rendered browser QA.

## Checks

- [x] `npm run verify`
- [x] Browser rendered smoke for the module path on desktop/mobile

## Result packet

- Files changed: `src/features/program-navigation/LessonPathMap.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `npm run verify`; Browser smoke on `http://localhost:5174/modules/financial-goals` at `1280x720` and `390x740`; clicked the current lesson node and verified the dialog primary action appears.
- Risks: Browser QA used the existing local backend on `127.0.0.1:3001`; the dev command's backend process could not bind because that port was already occupied, but the frontend API calls succeeded through the running backend.
- Follow-up: If completed-node screenshots are needed, use an authenticated/progress state with completed lessons; the glare implementation is shared by current and completed nodes.
