# Project State — FinPulse Learning MVP

Last updated: 2026-05-25

## Current phase

Stage 2 backend MVP implemented on draft PR branch.

The app scaffold exists as a Vite React TypeScript SPA with Tailwind CSS, shadcn/ui, React Router, Vitest, and a mobile content-reader surface. Runtime content now uses split JSON files with the hierarchy Program -> Module -> Unit -> Lesson -> Card. ADR-0006 accepts a narrow Stage 2 backend: Fastify + SQLite, simple learner login, httpOnly cookie sessions, backend-owned progress markers, and read-only content API delivery from validated JSON.

The Fastify backend and frontend API migration are implemented on `feat/stage-2-backend-mvp`. Frontend rendered pages now fetch program/module/unit/lesson data through `/api/**`; authenticated users can save viewed/completed lesson/card progress. Security/content contract reviews, `npm run verify`, and browser smoke passed.

## Locked MVP assumptions

- Mobile-first educational site.
- Static educational program content.
- JSON as source-of-truth.
- React + TypeScript.
- SPA/Vite preferred.
- Fastify backend accepted for Stage 2.
- SQLite persistence accepted for Stage 2 learner/session/progress state.
- Zustand for small client-side state.
- Tailwind + shadcn/ui.
- Minimal learner login is allowed for saved progress; full user cabinets remain out of scope.
- No diagnostics.
- No rewards.
- No analytics dashboards.
- Backend-owned progress is not diagnostics, scoring, analytics, or recommendations.
- JSON remains the canonical educational content source-of-truth.
- Evals deferred until product flows exist.
- Agent model policy: GPT-5.5, reasoning effort `xhigh`.
- Branch, commit, push, and PR rules live in `docs/engineering/contributing.md`.

## Known open questions

- Final product name and visual identity.
- Exact content taxonomy beyond the initial lesson block types.
- Deployment target.
- Production secret/session hardening and rate limiting.
- Whether persisted artifact/reflection answers ever become product scope.

## Current verification state

`./scripts/verify.sh` exists as the generic entry point and runs content validation, typecheck, lint, tests, and production build through available package scripts.

`npm run dev` now starts both the Fastify backend and Vite frontend. Vite proxies `/api` to `http://127.0.0.1:3001` for local development.

GitHub Actions runs `npm ci` and `npm run verify` for pull requests and pushes to `main`.

`src/content/program.json` is a program manifest. Module and unit runtime content live under `src/content/modules/**`. The content validator also validates the example split graph, rejects unknown keys, requires normalized relative JSON paths, checks sorted unique `order` values, and verifies scenario `correctOptionId` values have matching options.

Module 1 source content was split from `docs/modules/module_1/lesson_01.md` into `docs/modules/module_1/lesson_01/`, with the full original preserved in `00_original_content.md` and focused source slices mapped in `README.md`.

T-009 interactive lesson cards merged in PR #4. Current interaction state remains local React component state only; no backend, accounts, diagnostics, rewards, analytics, or persistence were added.

T-010 accepted ADR-0006 for Stage 2 backend scope before backend implementation. T-011 added the Fastify + SQLite auth/content/progress API. T-012 migrated rendered frontend data to the backend API and wired minimal auth/progress controls. Full freeform lesson answers remain transient; only viewed/completed lesson/card progress is in Stage 2 persistence scope.

T-013 verified Stage 2 with `npm run verify`, security/auth review, content/API contract review, live browser smoke, DB progress persistence check, and 360px no-overflow check.

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
