# T-029 — Button hover color alignment

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Keep button hover states in the FinPulse palette so linked `Button asChild` actions do not fall back to the neutral shadcn primary hover.

## Context

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- shadcn project context and Button docs

## Intended write set

- `src/components/ui/button.tsx`
- `src/index.css`
- `harness/tasks/review/T-029-button-hover-color-alignment.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md` only if durable state changes

## Out-of-scope

- Broad visual redesign
- Content/API/backend changes
- New UI primitives
- Rewards, diagnostics, analytics, personalization

## Plan

1. Align shadcn semantic primary tokens with FinPulse brand tokens.
2. Remove the linked-button hover selector that overrides custom per-button hover colors.
3. Run focused checks and project verification.

## Checks

- [x] `npm run verify`
- [x] rendered smoke for lesson dialog button color state

## Result packet

- Files changed: `src/components/ui/button.tsx`, `src/index.css`, `harness/WORKBOARD.md`, this task file.
- Checks run: `npm run verify`; Browser smoke on `http://localhost:5173/modules/financial-goals` at default viewport and `390x740`.
- Risks: Hover was validated through the rendered class/cascade and screenshot evidence; the in-app mouse move did not expose a persistent `:hover` computed state for direct color sampling.
- Follow-up: Keep any further popup content simplification in active T-030.
