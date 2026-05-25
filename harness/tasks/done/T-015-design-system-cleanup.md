# T-015 — Design system cleanup

Status: done
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-25
Branch/worktree: codex/docs-design-system-finpulse

## Goal

Clean the new friendly-learning design system for the current FinPulse MVP.

## Context

Source draft:
- user-provided Friendly Learning v0.2 design-system markdown from Downloads.

Read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/engineering/contributing.md`
- `docs/DESIGN_SYSTEM.md`

## Intended write set

- `docs/DESIGN_SYSTEM.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md` if durable project state changes
- this task file

## Out of scope

- UI implementation
- Tailwind token wiring
- rewards/gamification implementation
- lesson/card UX code changes

## Result

- Renamed the imported design direction to FinPulse.
- Replaced the short placeholder design-system doc with a cleaned Friendly Learning v0.2 document.
- Kept Duolingo-inspired mechanics as product principles, without copying brand language.
- Moved rewards, streaks, challenges, shops, mascot-led experience, and retention loops into deferred scope.
- Added concrete MVP guidance for lesson/card experience, choice states, feedback, progress, accessibility, and ethics.

## Checks

- [x] `npm run verify`

## Risks

- The design-system tokens are documented but not yet wired into Tailwind/CSS.
- Future implementation should start with lesson/card experience and continue to avoid gamification unless MVP scope changes.
