# Project State — FinPulse Learning MVP

Last updated: 2026-05-30

## Current phase

Stage 2 backend MVP is on `main`; T-016 lesson/card experience is implemented on `feat/lesson-card-experience` for draft PR review. T-017 learning path UX is implemented in the current workspace for review.

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

T-014 added shared content API contract tests and a runtime content import guard. `npm run verify` now also runs `npm run check:runtime-imports` to keep rendered app code on backend API data instead of direct JSON/runtime loader imports.

T-015 adapted the friendly-learning design-system draft to FinPulse. `docs/DESIGN_SYSTEM.md` now defines MVP-safe lesson/card experience guidance and keeps rewards, streaks, challenges, shops, mascot-led experience, and retention loops deferred.

T-016 implements the first friendly-learning lesson/card UI slice: one active card per lesson session, a progress header, sticky bottom CTA, supportive choice feedback, local checklist/reflection/artifact interaction state, and existing viewed/completed progress markers only. `npm run verify` passed; browser smoke passed on desktop-ish and 360px with no horizontal overflow or console errors.

T-017 reworks the rendered frontend into a guided learning path without changing JSON/content/API contracts: `/` now emphasizes the current module, next step, progress, and lesson path preview; `/modules/:moduleSlug` renders units inline as a vertical lesson path; `/modules/:moduleSlug/units/:unitSlug` remains a compatible focused unit path; lesson checked-answer feedback is shown in the sticky bottom action area above `Далее`. Future/locked states are visual guidance only, not access control. `npm run verify` passed; 390px browser smoke passed for home, module path, and checked-answer lesson feedback with no horizontal overflow or console errors.

T-018 adds Storybook as a separate hosted UI catalog for foundations and current FinPulse components. The learner SPA remains at `/`; Storybook is built as a static artifact into `dist/storybook/` for hosting at `/storybook/` and is not a React Router route. `npm run verify`, `npm run build:storybook`, `npm run build:all`, and local Storybook browser smoke passed.

T-019 replaces the legacy accent token family with `sky`: `--fr-color-sky-400: #5BC0EB`, `--fr-color-sky-500: #1E9BD7`, and `--fr-color-sky-600: #1479B8`. Direct UI and Storybook token references now use `--fr-color-sky-*`; `npm run verify` passed.

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
