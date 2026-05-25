# Project State — FinPulse Learning MVP

Last updated: 2026-05-25

## Current phase

Harness v0 / content-reader MVP scaffold with Module 1 runtime content.

The app scaffold exists as a Vite React TypeScript SPA with Tailwind CSS, shadcn/ui, React Router, Vitest, and a mobile content-reader surface. Runtime content now uses split JSON files with the hierarchy Program -> Module -> Unit -> Lesson -> Card.

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

`src/content/program.json` is a program manifest. Module and unit runtime content live under `src/content/modules/**`.

Module 1 source content was split from `docs/modules/module_1/lesson_01.md` into `docs/modules/module_1/lesson_01/`, with the full original preserved in `00_original_content.md` and focused source slices mapped in `README.md`.

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
