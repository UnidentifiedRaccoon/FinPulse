# Project State — FinPulse Learning MVP

Last updated: 2026-06-28

This file is the compact current-state snapshot for agents. Detailed task history
lives in `harness/tasks/review/T-*.md`; do not re-expand this file into a task
log.

## Current phase

`main` contains the Stage 2 learner MVP plus stacked review work through T-150.
The current workspace additionally includes T-152 content updates for Level 1
Section 2, T-153/T-154 section passport UI/content updates, and T-156/T-159
categorization-column review work. The learner app is a Vite React TypeScript
SPA backed by a Fastify/PostgreSQL API. A separate Next.js internal admin app exists under
`apps/admin` for the read-only curator progress board accepted by ADR-0010 and
ADR-0011.

Recent state that matters for new work:
- approved educational hierarchy is `Program -> Level -> Section -> Lesson -> Card`;
- runtime code, JSON, API payloads, routes, and persistence context use
  `Level` / `Section` directly;
- legacy `Module` / `Unit`, `t1-start`, and `t1_start` runtime/API names are
  historical only and must not be reintroduced;
- active content is Level 1, two sections, eight lessons;
- section path headings render learner-facing titles without the `Раздел N.`
  prefix and show a small chevron-only trigger for expandable descriptions
  sourced from `section.description`;
- lesson cards use the eight-screen Level 1 architecture;
- screen 4 is the external example/scenario with statistics;
- reflection/artifact answers are private learner artifacts, not diagnostics or
  scoring;
- approved Markdown-enabled lesson fields render through the safe Rich Text
  renderer, including paragraph-aware rendering from T-150;
- ordinary learner body text is regular `400`; explicit emphasis, compact
  labels, headings, and controls use separate heavier layers instead of a
  default `500` body-text layer;
- temporary `/design/categorization-columns` preview route exists for reviewing
  a column-based final categorization check;
- the first lesson's `card_l1s1l1_03_sorting_choice` categorization final check
  uses the column result view in the real product flow; other categorization
  cards still use the matrix result;
- moved answers in the column result append to the target column bottom, and the
  product result columns do not have an extra outer frame or count badges;
- column result headers render as tinted header strips, and answer items are
  text-only movable cards without radio/checkbox-like marker icons;
- column result headers use a neutral gray surface, a `57px` minimum height in
  the product result, and two-line ellipsis/clamp for long labels;
- plain labels, ids, CTA labels, variants, statistic values, and technical keys
  remain plain text;
- route/loading/lesson transitions and mobile card rhythm are already applied;
- stale design experiment routes were removed after rollout.

## Locked MVP assumptions

- Mobile-first educational web app.
- Static educational program content.
- JSON remains the canonical runtime content source.
- Learner frontend stays React + TypeScript + Vite SPA unless an ADR changes it.
- Tailwind CSS + shadcn/ui are the design-system baseline.
- Fastify backend is accepted for Stage 2 content/auth/progress/reflection APIs.
- PostgreSQL stores learner/session/progress/reflection state.
- `apps/admin` is the only accepted Next.js exception and remains separate from
  the learner SPA.
- React local state first; add Zustand only for justified small cross-route UI
  state.
- No diagnostics, rewards/gamification, analytics dashboards, payments,
  production financial operations, personalized recommendations, CMS, or
  learner-facing admin scope.
- Backend-owned progress is not diagnostics, scoring, analytics, or
  recommendations.
- Private reflection/artifact answers may persist only for authenticated
  learners and only as neutral personal artifacts.
- Agent model policy: GPT-5.5 with reasoning effort `xhigh`.
- Branch, commit, push, and PR rules live in `docs/engineering/contributing.md`.

## Active runtime content

Runtime content lives under `src/content/levels/**`.

- Program manifest: `src/content/program.json`
- Level: `level-1-start`, title `Уровень 1 · Старт`
- Section: `money-and-operations`, title `Раздел 1. Деньги и операции`
  - `where-money-goes` — `Куда уходят деньги`
  - `mandatory-and-desired` — `Обязательное и желаемое`
  - `safe-payment` — `Безопасный платёж`
  - `digital-footprint-and-protection` — `Цифровой след и защита`
- Section: `planning-and-management`, title `Раздел 2. Планирование и управление`
  - `why-reserve-matters` — `Зачем нужна подушка`
  - `reserve-target-amount` — `Сколько держать в резерве`
  - `pay-yourself-first` — `Правило «сначала себе»`
  - `budget-draft` — `Бюджет-черновик`

Legacy content slugs from earlier graphs intentionally return 404 through the
content API. Historical references may remain in old task files only.

## Architecture snapshot

Learner frontend:
- Vite, React, TypeScript, React Router, Tailwind CSS, shadcn/ui, Vitest.
- Rendered routes fetch program/level/section/lesson data through `/api/**`.
- Route-level loading skeletons and restrained route/card transitions are in
  place.
- Storybook is a separate static UI catalog built into `dist/storybook/`.

Backend:
- Fastify serves `/api/**` and the built learner SPA in production.
- PostgreSQL repositories own users, sessions, progress, reflection answers, and
  admin read models.
- Content API hydrates and validates split JSON files from the repository.
- Sessions use httpOnly cookies.
- Admin auth uses a separate `finpulse_admin_session` cookie and env-provided
  credentials.

Internal admin:
- `apps/admin` is a separate Next.js app.
- It rewrites `/api/**` to the Fastify backend.
- It exposes a read-only curator progress board.
- It must not expose private reflection/artifact answer text by default.
- Organizations, RBAC, answer review, analytics dashboards, and CMS/content
  editing remain out of scope.

## Current verification state

Generic entry point:
- `./scripts/verify.sh`
- `npm run verify`

The verify script runs available package scripts for content validation,
runtime import guard, typecheck, lint, tests, production build, and Storybook
build.

Local development:
- `npm run dev` starts Fastify and Vite.
- Vite proxies `/api` to `http://127.0.0.1:3001`.
- Backend default local DB URL outside production is
  `postgres://finpulse:finpulse@127.0.0.1:5432/finpulse` unless
  `FINPULSE_DATABASE_URL` or `DATABASE_URL` is set.

Known local verification caveat:
- Full `npm run verify` reaches backend tests and fails in shells without
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- GitHub Actions provides a PostgreSQL service and `FINPULSE_TEST_DATABASE_URL`.

Most recent recorded checks:
- T-159: `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`,
  `npm run test:run -- src/App.test.tsx`, `npm run typecheck`,
  `npm run lint`, Browser QA on `/lessons/where-money-goes` at 390x844 and
  1280x800, Browser QA on `/design/categorization-columns`, including neutral
  gray headers, 57px product header height, title/hint clamp styles, no overlay,
  no console warn/error, and no horizontal overflow, and `git diff --check`
  passed. Full `npm run verify` was skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- T-158: `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`,
  `npm run test:run -- src/App.test.tsx`, `npm run typecheck`,
  `npm run lint`, Browser QA on `/lessons/where-money-goes` at 390x844 and
  1280x800, including header strips, iconless answer cards, selected state,
  green/yellow post-check states, no overlay, no console warn/error, and no
  horizontal overflow, and `git diff --check` passed. Full `npm run verify`
  was skipped because this shell has no `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- T-157: `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`,
  `npm run test:run -- src/App.test.tsx`, `npm run typecheck`,
  `npm run lint`, Browser QA on `/lessons/where-money-goes` at 390x844 and
  1280x800, including append-to-bottom ordering and removed outer result frame,
  follow-up Browser QA for count-free column headers, and `git diff --check`
  passed. Full `npm run verify` was skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- T-156: `npm run test:run -- src/App.test.tsx`, `npm run typecheck`,
  `npm run lint`, Browser QA at 390x844 and 1280x900, and `git diff --check`
  passed. Full `npm run verify` was skipped because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- T-155: `npm run test:run -- src/App.test.tsx`, `npm run typecheck`,
  `npm run lint`, `git diff --check`, `npm run build:web`, and
  `npm run build:storybook` passed. `npm run verify` passed content validation,
  runtime import guard, typecheck, and lint, then stopped in backend tests
  because this shell has no `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- T-154: `npm run test:run -- src/App.test.tsx`, `npm run typecheck`,
  `npm run lint`, `git diff --check`, and `npm run build:web` passed.
- T-153: `npm run check:content`, `npm run test:run -- src/App.test.tsx`,
  `npm run typecheck`, `npm run lint`, `git diff --check`, and
  `npm run build:web` passed. `npm run verify` passed content validation,
  runtime import guard, typecheck, and lint, then stopped in backend tests
  because this shell has no `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- T-152: `npm run check:content`, focused frontend/content tests
  (`src/App.test.tsx`, `src/content/program.test.ts`,
  `src/features/program-navigation/learningPath.test.ts`), `npm run lint`, and
  in-app Browser smoke at 390px passed.
- T-152: `npm run typecheck` reached `typecheck:admin` and stopped because the
  local `node_modules` does not contain `next`; `npm run build` passed
  `build:web` and stopped in `build:admin` with `next: command not found`.
- Backend tests for T-152 still require `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.

## Canonical docs

- Product scope: `docs/PRODUCT.md`
- Architecture: `docs/ARCHITECTURE.md`
- Content model: `docs/CONTENT_MODEL.md`
- General methodology: `docs/methodology/METHODOLOGY.md`
- Lesson authoring regulation: `docs/methodology/AUTHORING.md`
- Design system: `docs/DESIGN_SYSTEM.md`
- QA scenario map: `docs/QA_USER_SCENARIO_MAP.md`
- Deploy runbook: `docs/operations/yandex-cloud-finpulse-deploy.md`

## Known open questions

- Final product name and broader visual identity beyond current `ФинПульс`
  app-facing usage and mascot reference.
- Production secret/session hardening and rate limiting.
- Export/delete controls and richer metadata for saved personal answers.
- Future content taxonomy beyond the active Level 1 section.

## State update rules

Update this file when:
- the stack changes;
- app scaffold or core route architecture changes;
- content hierarchy/model changes;
- active runtime content changes;
- verification commands or required environment change;
- evals start being populated;
- major scope decisions are made.

Keep this file compact. Put task-level details in `harness/tasks/` and durable
domain/engineering contracts in `docs/`.
