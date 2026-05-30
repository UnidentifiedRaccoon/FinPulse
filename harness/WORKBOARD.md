# Workboard

This is a lightweight coordination board for human and agent work.

Statuses:
- `planned`
- `active`
- `blocked`
- `review`
- `done`

## Planned seed tasks

These are suggestions. The orchestrator may split or reorder them.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-001 | done | Scaffold Vite React TS app | `package.json`, `src/**`, config files | Initial scaffold is in place. |
| T-002 | done | Install Tailwind + shadcn/ui | styling config, `components.json` | Tailwind v4 and shadcn/ui initialized. |
| T-003 | done | Add content model and example content | `src/content/**`, `docs/**` | Initial JSON content and source docs are in place. |
| T-004 | done | Add routing and pages | `src/**` | Overview/module/lesson routes are in place. |
| T-005 | done | Add lesson block renderer | `src/**` | Initial heading/paragraph/list/callout renderer is in place. |
| T-006 | done | Add mobile app shell | `src/**` | Mobile-first shell is in place. |
| T-007 | done | Add first component tests | test files, test config | Initial Vitest coverage is in place. |

## Active tasks

Use files under `harness/tasks/active/` for real active work.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| _none_ |  |  |  |  |

## Review tasks

Use task files and PR/diff summaries.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-028 | review | Mascot visual identity docs | `docs/MASCOT.md`, `docs/DESIGN_SYSTEM.md`, `harness/**` | Accepted the user-provided cream/sky-blue fennec mascot as a documented visual identity reference only; mascot-led mechanics remain deferred. `npm run verify` passed. |
| T-027 | review | Impulsive purchases runtime unit | `src/content/modules/module_1/module.json`, `src/content/modules/module_1/units/unit_02_impulsive_purchases.json`, `server/app.test.ts`, `harness/**` | Added one reader unit from `docs/methodology/README.md`; API content contract test now covers the new unit/lesson. `npm run check:content`, focused backend test, and `npm run verify` passed. |
| T-026 | review | UI noise cleanup | `src/pages/{EntryPage,ProgramOverviewPage,ModulePage,UnitPage}.tsx`, `src/features/{auth,program-navigation,lesson-reader}/**`, `src/components/ui/dialog.tsx`, focused tests, `harness/**` | Removed repeated visible labels, decorative CTA/card/meta icons, noisy local-only status copy, and unavailable fallback path controls while preserving a11y names and progress semantics. `npm run verify` passed; 390px Browser smoke passed for entry, program, module path, lesson, and checked-answer feedback with no console errors or horizontal overflow. |
| T-025 | review | Lingvo-inspired learning path | `src/pages/{ProgramOverviewPage,ModulePage,UnitPage}.tsx`, `src/features/program-navigation/**`, `src/components/ui/dialog.tsx`, `src/App.test.tsx`, `harness/**` | Module overview now uses module cards; module/unit paths render sectioned lesson maps; lesson nodes open a detail popup before navigation; end-of-module transition card added. `npm run verify` passed; Browser DOM/interaction/mobile smoke passed, while in-app screenshot capture timed out. |
| T-024 | review | Progress PUT CORS | `server/app.ts`, `server/app.test.ts`, `src/pages/LessonPage.tsx`, `src/features/lesson-reader/LessonSession.tsx`, `src/App.test.tsx`, `harness/**` | Progress `PUT` CORS preflight now allows `PUT`; lesson/card viewed writes are guarded against duplicate dev StrictMode writes; `npm run verify` and browser smoke passed. |
| T-023 | review | Email auth login | `server/modules/auth/routes.ts`, auth tests, auth form copy, `harness/**` | Email-style identifiers now work for registration/login; form label says `Email или логин`; `npm run verify` and browser smoke passed. |
| T-022 | review | Registration fetch failure | `server/app.ts`, `server/app.test.ts`, local backend docs, `harness/**` | Default backend CORS now allows local loopback browser origins when no explicit `FINPULSE_CORS_ORIGIN` override is set; `npm run verify` and browser smoke passed. |
| T-021 | review | Inline video player | `src/features/lesson-reader/card-renderers/VideoCard.tsx`, `src/features/lesson-reader/LessonCardRenderer.tsx`, `src/features/storybook/fixtures.ts`, `docs/CONTENT_MODEL.md`, focused tests, `harness/**` | Video cards now render supported RUTUBE embed URLs inline with timecode buttons and a source fallback link. `npm run verify` and Browser smoke passed. |
| T-020 | review | Entry auth screen | `src/App.tsx`, `src/pages/EntryPage.tsx`, `src/features/auth/**`, `src/components/ui/{field,input,label,separator}.tsx`, focused tests, `harness/**` | `/` now renders login/registration for anonymous users and a welcome continuation screen for existing sessions; program overview moved to `/program`. `npm run verify` and Browser smoke passed. |
| T-018 | review | Hosted Storybook UI catalog | `package.json`, lockfile, `.storybook/**`, `src/**/*.stories.tsx`, docs/harness updates | Storybook builds to `dist/storybook/` for `/storybook/`; `npm run verify`, `npm run build:storybook`, `npm run build:all`, and local browser smoke passed. |
| T-017 | review | Duolingo-like learning path UX | `src/App.tsx`, `src/pages/**`, `src/features/program-navigation/**`, `src/features/lesson-reader/**`, focused tests, `harness/**` | Home/module routes now render a guided learning path; lesson feedback is sticky with the CTA. `npm run verify` and 390px browser smoke passed. |
| T-016 | review | Lesson card experience | `src/features/lesson-reader/**`, `src/pages/LessonPage.tsx`, focused tests, `harness/tasks/**`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md` | Focused lesson session UI implemented; `npm run verify` and browser smoke passed; backend/API contract unchanged. |

## Done tasks

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-008 | done | Content data model and Module 1 runtime content | `docs/modules/module_1/lesson_01*`, `docs/CONTENT_MODEL.md`, `harness/schemas/content.schema.json`, `src/content/**`, `scripts/check-content-json.mjs`, `examples/content/program.example.json`, `src/**`, task/state docs | Merged in PR #2. |
| T-009 | done | Interactive lesson cards | `src/features/lesson-reader/**`, focused tests, `docs/CONTENT_MODEL.md`, first-unit content, task/workboard state | Merged in PR #4; interactions remain local React state only. |
| T-010 | done | Decide Stage 2 backend scope | `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`, `docs/CONTENT_MODEL.md`, `harness/tasks/**`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md` | ADR-0006 accepted Fastify + SQLite backend scope before implementation; `npm run verify` passed. |
| T-011 | done | Build Stage 2 backend API | `server/**`, `package.json`, lockfile, backend tests, `.env.example`, scripts/tsconfig as needed | Fastify + SQLite auth/content/progress API implemented; `npm run verify` passed. |
| T-012 | done | Migrate frontend to backend API | `src/**`, focused frontend tests, `vite.config.ts` | SPA pages use backend content API; auth controls and progress writes wired; `npm run verify` passed. |
| T-013 | done | Stage 2 verification and PR polish | docs/harness updates, README, PR evidence | Security/content reviews and browser smoke passed; final `npm run verify` passed. |
| T-014 | done | Add API contract guards | `src/content/program.ts`, `server/**` tests, `scripts/**`, `package.json`, `harness/**` | Shared API contract tests and rendered app content import guard added; `npm run verify` passed. |
| T-015 | done | Clean friendly-learning design system | `docs/DESIGN_SYSTEM.md`, `harness/**` | Friendly-learning design-system draft adapted to FinPulse; MVP-safe lesson/card guidance kept, rewards/streaks/challenges deferred. |
| T-019 | done | Sky blue token rename | `src/index.css`, `docs/DESIGN_SYSTEM.md`, direct UI/Storybook token references, `harness/**` | Accent token family renamed to `sky`; values set to `#5BC0EB`, `#1E9BD7`, `#1479B8`; `npm run verify` passed. |
