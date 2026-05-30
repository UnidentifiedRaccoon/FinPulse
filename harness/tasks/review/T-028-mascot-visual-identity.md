# T-028 - Mascot visual identity docs

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Record the user-provided mascot reference image and description in durable project docs and harness state.

## Context

Read:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `/Users/elena/.codex/attachments/bcea9884-a93c-40d5-8728-ac4449fa3390/pasted-text.txt`

## Intended write set

- `docs/MASCOT.md`
- `docs/DESIGN_SYSTEM.md`
- `harness/tasks/review/T-028-mascot-visual-identity.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- UI implementation
- asset optimization or image export
- content JSON changes
- backend/API changes
- rewards, streaks, gamification, mascot-led product mechanics
- product naming decision

## Plan

1. Create a durable mascot spec from the supplied reference and description.
2. Update design-system scope so the mascot is accepted as an optional visual identity asset.
3. Update harness workboard and project state.
4. Run verification.

## Checks

- [x] `npm run verify`

## Result packet

- Files changed: `docs/MASCOT.md`, `docs/DESIGN_SYSTEM.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file.
- Checks run: `npm run verify`
- Risks: The chat image itself was not present as a file in the attachment directory; this task records the visual direction and source description, but no production asset is checked into the repo.
- Follow-up: Add approved mascot exports to the repo before implementing the mascot in the app.
