# T-049 — User scenario test map

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-31
Branch/worktree: local workspace

## Goal

Build an expanded QA map of user scenarios that should be tested across authentication, learning navigation, lesson completion, progress persistence, profile display, and responsive mobile/desktop behavior.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`

## Intended write set

- `docs/QA_USER_SCENARIO_MAP.md`
- `harness/tasks/review/T-049-user-scenario-test-map.md`

## Out-of-scope

- Implementing automated tests.
- Changing runtime behavior, content JSON, API contracts, auth, progress, profile UI, or backend storage.
- Adding diagnostics, rewards, recommendations, analytics dashboards, or full profile/account management.

## Plan

1. Map current product routes, API capabilities, and card types.
2. Define scenario coverage from app entry through profile review.
3. Include mobile/desktop responsive and accessibility-specific checks.
4. Mark MVP scope boundaries and regression priorities.
5. Run lightweight verification for the docs-only change.

## Checks

- [x] Markdown/readability review
- [x] `npm run verify`

## Result packet

- Files changed:
  - `docs/QA_USER_SCENARIO_MAP.md`
  - `harness/tasks/review/T-049-user-scenario-test-map.md`
- Checks run:
  - Markdown/readability review — passed
  - `npm run verify` — passed
- Risks:
  - The map flags anonymous direct content access as a product-contract check because current docs emphasize low sign-in friction while the current entry flow is auth-led.
- Follow-up:
  - Convert the P0 end-to-end paths into automated browser tests when an E2E harness is selected.
