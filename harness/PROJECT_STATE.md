# Project State — FinPulse Learning MVP

Last updated: 2026-05-30

## Current phase

Stage 2 backend MVP is on `main`; T-016 lesson/card experience is implemented on `feat/lesson-card-experience` for draft PR review. The current workspace contains stacked review changes through T-028, including learning path, entry auth, inline video, local auth/CORS fixes, UI cleanup, the second runtime content unit, and mascot identity docs.

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
- The selected mascot visual reference is a cream/sky-blue fennec or fox guide with a compass badge; mascot-led mechanics remain out of scope.
- No diagnostics.
- No rewards.
- No analytics dashboards.
- Backend-owned progress is not diagnostics, scoring, analytics, or recommendations.
- JSON remains the canonical educational content source-of-truth.
- Evals deferred until product flows exist.
- Agent model policy: GPT-5.5, reasoning effort `xhigh`.
- Branch, commit, push, and PR rules live in `docs/engineering/contributing.md`.

## Known open questions

- Final product name and broader visual identity beyond the selected mascot reference.
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

T-017 reworks the rendered frontend into a guided learning path without changing JSON/content/API contracts: the program overview emphasizes the current module, next step, progress, and lesson path preview; `/modules/:moduleSlug` renders units inline as a vertical lesson path; `/modules/:moduleSlug/units/:unitSlug` remains a compatible focused unit path; lesson checked-answer feedback is shown in the sticky bottom action area above `Далее`. Future/locked states are visual guidance only, not access control. `npm run verify` passed; 390px browser smoke passed for home, module path, and checked-answer lesson feedback with no horizontal overflow or console errors.

T-018 adds Storybook as a separate hosted UI catalog for foundations and current FinPulse components. The learner SPA remains at `/`; Storybook is built as a static artifact into `dist/storybook/` for hosting at `/storybook/` and is not a React Router route. `npm run verify`, `npm run build:storybook`, `npm run build:all`, and local Storybook browser smoke passed.

T-019 replaces the legacy accent token family with `sky`: `--fr-color-sky-400: #5BC0EB`, `--fr-color-sky-500: #1E9BD7`, and `--fr-color-sky-600: #1479B8`. Direct UI and Storybook token references now use `--fr-color-sky-*`; `npm run verify` passed.

T-020 changes the root entry route: `/` now renders login/registration for anonymous users after the session check, and a welcome continuation screen for authenticated sessions. The learning path/program overview remains available at `/program`; direct module, unit, and lesson URLs remain public and compatible. Auth form markup now uses shadcn field/input primitives. `npm run verify` passed; Browser smoke passed for anonymous entry, registration-to-welcome, `/program`, and 390px mobile auth layout with no console errors.

T-021 adds an inline video-card renderer without changing JSON/content/API contracts. Supported RUTUBE embed URLs now render inside the lesson reader with timecode jump buttons, a source fallback link remains visible, and unsupported video URLs fall back to the external source link. `npm run typecheck`, focused lesson-card tests, `npm run verify`, and Browser smoke passed.

T-022 fixes local registration `Failed to fetch` when the frontend uses a direct API base URL from a loopback origin such as `http://127.0.0.1:5174`. The backend now allows local loopback browser origins by default when `FINPULSE_CORS_ORIGIN` is empty or unset, while explicit env/config origins still override the default. `npm run test:run -- server/app.test.ts`, `npm run verify`, and Browser smoke for direct API registration passed.

T-023 fixes email-style auth identifiers: registration/login now accepts email addresses in the existing `login` field, normalizes them to lowercase, and keeps username-style logins supported. The auth form label now says `Email или логин`. `npm run test:run -- server/app.test.ts src/features/auth/AuthControls.test.tsx`, `npm run verify`, and Browser smoke on `http://127.0.0.1:5174/` passed.

T-024 fixes the remaining main-screen `Failed to fetch` banner after authenticated lesson navigation. The root cause was progress persistence using `PUT /api/progress/**` while backend CORS only advertised `GET,HEAD,POST`, so browsers blocked the actual progress `PUT` after preflight. CORS now allows `GET, POST, PUT, OPTIONS`. Lesson/card viewed-write callbacks are also stable and guarded to avoid duplicate dev StrictMode progress writes. `npm run test:run -- server/app.test.ts src/App.test.tsx`, `npm run verify`, and Browser smoke on `http://127.0.0.1:5174/` passed.

T-025 adapts the Lingvo-like navigation concepts into the frontend without changing JSON/content/API contracts: `/program` now emphasizes module cards; module and unit routes render color-sectioned lesson maps; lesson nodes open a detail popup with title, description, metadata, and an explicit navigation action; the module path ends with a next-module/finish transition card. `npm run test:run -- src/App.test.tsx src/features/program-navigation/learningPath.test.ts` and `npm run verify` passed. Browser DOM/interaction/mobile smoke passed for `/program` and `/modules/financial-goals`; in-app screenshot capture timed out, so rendered evidence is DOM/layout/console based.

T-026 cleans visible UI noise from the learner SPA without changing JSON/content/API/backend contracts: entry and program screens use quieter progress/copy, module/unit paths remove redundant content/back-to-top/unavailable-next controls, lesson nodes hide future-state labels while keeping accessible names, lesson dialogs and CTAs drop decorative icons, and the lesson reader removes duplicate card counters/type pills and local-only helper copy. Empty draft statuses remain available to assistive tech and become visible after user action. `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx src/features/auth/AuthControls.test.tsx` and `npm run verify` passed. Browser smoke at 390px passed for `/`, `/program`, `/modules/financial-goals`, `/lessons/why-values-matter`, and checked-answer feedback with no console errors or horizontal overflow; Browser screenshot capture succeeded.

T-027 adds a second runtime content unit to Module 1 without changing the content schema, UI, backend routes, auth, or progress contracts. `unit_02_impulsive_purchases` adapts the `docs/methodology/README.md` example on impulsive purchases into one mobile reader lesson, `pause-before-purchase`, with seven cards covering a discount scenario, short theory, optional-expense check, final-price checklist, trigger reflection, weekly purchase-pause rule, and summary. The backend API content contract test now explicitly covers the new unit and lesson route. `npm run check:content`, `npm run test:run -- server/app.test.ts`, and `npm run verify` passed.

T-028 documents the user-provided mascot visual direction without implementing it in the UI: `docs/MASCOT.md` defines the cream/sky-blue fennec or fox guide, compass badge, approximate palette, anatomy, usage rules, asset requirements, and product boundaries. `docs/DESIGN_SYSTEM.md` now treats the mascot as an optional visual identity asset while keeping mascot-led mechanics deferred. `npm run verify` passed.

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
