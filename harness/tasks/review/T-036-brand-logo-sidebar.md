# T-036 - Brand logo in desktop navigation

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main

## Goal

Use the supplied FinPulse wordmark logo in the desktop app navigation/sidebar.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `src/App.tsx`
- Supplied image: `/Users/elena/Downloads/ChatGPT Image May 30, 2026, 07_01_53 PM.png`

## Intended write set

- `public/assets/brand/finpulse-wordmark.png`
- `src/App.tsx`
- `harness/tasks/review/T-036-brand-logo-sidebar.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Content JSON/model changes.
- Backend/API/auth/progress changes.
- Favicon changes.
- Mascot rollout or broader visual identity work.
- Mobile bottom navigation redesign.

## Plan

1. Prepare the supplied logo as a transparent public asset suitable for the sidebar.
2. Point the desktop sidebar brand link to the new wordmark asset and adjust sizing.
3. Run focused tests and project verification, then smoke-check the rendered desktop menu.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run verify`
- [x] Browser desktop smoke on `/program`

## Result packet

- Files changed: `public/assets/brand/finpulse-wordmark.png`, `src/App.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, `harness/tasks/review/T-036-brand-logo-sidebar.md`.
- Checks run: `npm run test:run -- src/App.test.tsx`; `npm run verify`; Browser desktop smoke on `http://localhost:5173/program`.
- Risks: The supplied PNG had a baked light checkerboard background and no alpha channel, so the runtime asset was prepared as a transparent cropped PNG. It is optimized for the light sidebar/card surface.
- Follow-up: Reuse `/assets/brand/finpulse-wordmark.png` for future desktop brand placements; keep `/finpulse-logo.png` available for compact/icon-only surfaces until a separate brand asset decision changes it.
