# Project State — FinPulse Learning MVP

Last updated: 2026-05-25

## Current phase

Harness v0 / initial product scaffold.

The app scaffold exists as a Vite React TypeScript SPA with Tailwind CSS, shadcn/ui, React Router, Vitest, and a minimal mobile content-reader surface. The harness defines how agents should continue work without expanding scope accidentally.

## Locked MVP assumptions

- Mobile-first educational site.
- Static educational program content.
- JSON as source-of-truth.
- React + TypeScript.
- SPA/Vite preferred.
- Zustand for small client-side state.
- Tailwind + shadcn/ui.
- No accounts/cabinets.
- No diagnostics.
- No rewards.
- No analytics dashboards.
- No backend dependency.
- Evals deferred until product flows exist.
- Agent model policy: GPT-5.5, reasoning effort `xhigh`.
- Branch, commit, push, and PR rules live in `docs/engineering/contributing.md`.

## Known open questions

- Final product name and visual identity.
- Exact content taxonomy beyond the initial lesson block types.
- Whether content is bundled in `src/content` or loaded from `public/content`.
- Whether local-only reading progress is allowed in MVP.
- Deployment target.

## Current verification state

`./scripts/verify.sh` exists as the generic entry point and runs content validation, typecheck, lint, tests, and production build through available package scripts.

`src/content/program.json` exists as initial app content. Methodology and long-form module source content live under `docs/`.

## State update rules

Update this file when:
- the stack changes;
- app scaffold is created;
- core routes are implemented;
- content model changes;
- verification commands change;
- evals start being populated;
- major scope decisions are made.

Do not use this file as a detailed task log. Use `harness/WORKBOARD.md` and task files for that.
