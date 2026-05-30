# T-018 — Hosted Storybook UI catalog

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: main workspace

## Goal

Add Storybook as a hosted static UI catalog for FinPulse, built separately from the Vite learner SPA and intended to be served under `/storybook/`.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`

## Intended write set

- `package.json`
- `package-lock.json`
- `.storybook/**`
- `src/**/*.stories.tsx`
- `src/**/*.mdx`
- `src/features/storybook/**`
- `docs/engineering/ui-component-policy.md`
- `docs/DESIGN_SYSTEM.md`
- `harness/tasks/active/T-018-hosted-storybook-ui-catalog.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `eslint.config.js`

## Out-of-scope

- React Router route for `/storybook`
- Next.js/SSR migration
- Backend/admin/product scope expansion
- Content JSON source-of-truth changes
- Reworking T-016/T-017 feature implementation

## Plan

1. Install and configure Storybook for React + Vite with FinPulse CSS/tokens and `@/` alias.
2. Add foundations and current component stories with local fixtures and router wrappers where needed.
3. Add UI component policy and a short design-system pointer.
4. Run project verification plus Storybook static build and local smoke where possible.

## Checks

- [x] `npm run verify`
- [x] `npm run build:storybook`
- [x] `npm run build:all`
- [x] Storybook local smoke at `http://localhost:6006`

## Result packet

- Files changed: Storybook package/config/scripts; foundations and component stories; Storybook fixtures; UI component policy; design-system and harness updates; ESLint story overrides.
- Checks run: `npm run typecheck`; `npm run lint`; `npm run verify`; `npm run build:storybook`; `npm run build:all`; Browser smoke for `Foundations/Colors`, `Learning/PathProgressSummary`, `Lesson/ChoiceCard`, and `Lesson/BottomAction`.
- Risks: Storybook 10 emits a non-fatal `unable to find package.json for radix-ui` warning during dev/build; output still succeeds. Browser screenshot capture timed out, so smoke evidence is DOM/text and console checks.
- Follow-up: Wire deployment to publish `dist/storybook/` at `/storybook/` after running `npm run build:all`.
