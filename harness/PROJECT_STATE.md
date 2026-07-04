# Project State — FinPulse Learning MVP

Last updated: 2026-07-04

This file is the compact current-state snapshot for agents. Detailed task history
lives in `harness/tasks/review/T-*.md`; do not re-expand this file into a task
log.

## Current phase

`main` contains the Stage 2 learner MVP plus stacked review work through T-150.
The current workspace additionally includes T-152 content updates for Level 1
Section 2, T-153/T-154 section passport UI/content updates, and T-156/T-159
categorization-column review work, T-160 lesson 1-4 review edits, T-161
project-owned content editor skill, T-162 content editor pass for lessons
5-8, T-163 DB-backed content editor work, T-164 production-renderer admin
content preview work, T-165 full lesson-shell admin preview parity work,
T-166 project-owned financial-literacy expert skill, T-167 route-level admin
learner preview work, T-168 project-owned lesson methodologist skill,
T-169 Level 1 Section 3 risk-return lesson content, T-170 bounded admin
preview dialog work, T-172 admin user progress map work, T-173 Level 1
lessons 10-16 content integration, T-174 admin JSON editor syntax
highlighting, and T-175 content editor polish for lessons 9-16. The
learner app is a Vite React TypeScript SPA backed by a Fastify/PostgreSQL API.
A separate Next.js internal admin app exists under
`apps/admin` for the read-only curator progress board accepted by ADR-0010 and
ADR-0011, now extended with the ADR-0012 content editor.

Recent state that matters for new work:
- approved educational hierarchy is `Program -> Level -> Section -> Lesson -> Card`;
- runtime code, JSON, API payloads, routes, and persistence context use
  `Level` / `Section` directly;
- legacy `Module` / `Unit`, `t1-start`, and `t1_start` runtime/API names are
  historical only and must not be reintroduced;
- active content is Level 1, four sections, sixteen lessons;
- published runtime content is stored in PostgreSQL JSONB content tables; `src/content/**`
  is now the seed fixture/migration source, not the runtime fallback after
  startup seeding;
- the internal admin `/content` editor can update guarded level/section/card
  text slices through `/api/admin/content/**`;
- the admin `/content` JSON editor remains a native textarea and now renders an
  aria-hidden syntax-highlight overlay for keys, strings, numbers, booleans,
  null, and punctuation;
- admin card preview now reuses the learner production `LessonCardFrame` and
  `LessonCardRenderer` instead of a handmade preview approximation;
- admin card preview now renders the shared production `LessonScreenShell`,
  including the learner progress header, lesson goal, card frame/renderer, and
  bottom action, with shared learner CSS imported by both apps;
- admin `/content` preview now embeds the real learner route runtime via
  `MemoryRouter`, a `LearningContentClient` overlay, and synthetic local-only
  preview progress/reflection state; valid JSON edits update the route preview
  live, while invalid JSON keeps the last valid preview graph with an editor
  error; the preview reset control clears only the current learner screen state
  without remounting the whole embedded route; the admin Tailwind build scans
  the shared learner app/pages/program navigation sources so route previews keep
  production layout styling; learner
  dialogs opened inside the route preview are bounded to the preview pane rather
  than the whole admin browser viewport;
- admin user details now render progress as a Level -> Section -> Lesson ->
  Screen map with a current-position summary, section progress ratios, lesson
  rows, and screen checklists; the read-only admin progress API includes
  `lessonOrder` and `cardOrder` for explicit ordering and still excludes
  private reflection/artifact answer text;
- section path headings render learner-facing titles without the `Раздел N.`
  prefix and show a small chevron-only trigger for expandable descriptions
  sourced from `section.description`;
- lesson cards use the eight-screen Level 1 architecture;
- screen 4 is the external example/scenario with statistics;
- reflection/artifact answers are private learner artifacts, not diagnostics or
  scoring;
- approved Markdown-enabled lesson fields render through the safe Rich Text
  renderer, including paragraph-aware rendering from T-150;
- interactive cards `single_choice`, `multi_select`, `categorization`, and
  `scenario` support optional `feedbackTitle`, `retryFeedbackTitle`, and
  `retryFeedback`; omitted titles keep the reader fallback copy;
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
- `skills/finpulse-lesson-methodologist` is the project-owned methodologist
  skill for creating source Markdown and runtime JSON lesson drafts from
  approved topics, enforcing the eight-screen lesson architecture for Level 1
  and later levels, requiring `fin-literacy-expert` review, and handing prose
  polish to `finpulse-content-editor`;
- reusable project skills live under `skills/**`; `skills/finpulse-content-editor`
  is the editorial automation contract for improving methodologist lesson copy
  and returning only `Needs review` items;
- `skills/fin-literacy-expert` is the project-owned financial-literacy SME
  skill for domain briefs, fact-checking, source/safety review, and keeping
  educational explanations separate from financial recommendations;
- Level 1 lessons 5-8 have been polished with the project content editor rubric;
  Section 2 runtime JSON and source Markdown are synced for that pass;
- Level 1 lessons 9-16 have now received a deeper `finpulse-content-editor`
  polish pass; Section 3/4 runtime JSON and source Markdown are synced, while
  protected lesson structure, statistics, source links, and education-vs-advice
  boundaries remain unchanged;
- route/loading/lesson transitions and mobile card rhythm are already applied;
- stale design experiment routes were removed after rollout.

## Locked MVP assumptions

- Mobile-first educational web app.
- Educational program content.
- PostgreSQL JSONB remains the canonical published runtime content source; JSON files
  remain seed fixtures.
- Learner frontend stays React + TypeScript + Vite SPA unless an ADR changes it.
- Tailwind CSS + shadcn/ui are the design-system baseline.
- Fastify backend is accepted for Stage 2 content/auth/progress/reflection APIs.
- PostgreSQL stores learner/session/progress/reflection state.
- `apps/admin` is the only accepted Next.js exception and remains separate from
  the learner SPA.
- React local state first; add Zustand only for justified small cross-route UI
  state.
- No diagnostics, rewards/gamification, analytics dashboards, payments,
  production financial operations, personalized recommendations, broad CMS, or
  learner-facing admin scope.
- Backend-owned progress is not diagnostics, scoring, analytics, or
  recommendations.
- Private reflection/artifact answers may persist only for authenticated
  learners and only as neutral personal artifacts.
- Agent model policy: GPT-5.5 with reasoning effort `xhigh`.
- Branch, commit, push, and PR rules live in `docs/engineering/contributing.md`.

## Active runtime content

Published runtime content lives in PostgreSQL JSONB content tables and is
hydrated by the backend content service. Seed fixtures live under
`src/content/levels/**`.

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
- Section: `risk-and-return`, title `Раздел 3. Риск и доходность`
  - `thirty-percent-without-risk-red-flag` — `«30% без риска» — красный флаг`
  - `risk-and-return-are-linked` — `Риск и доходность связаны`
  - `money-soon-not-in-risk` — `Деньги «на скоро» — не в риск`
  - `what-is-inflation` — `Что такое инфляция`
- Section: `financial-environment`, title `Раздел 4. Финансовая среда`
  - `bank-client-rights` — `Права клиента банка`
  - `reading-key-terms` — `Читаем ключевые условия`
  - `credit-by-psk` — `Кредит по ПСК`
  - `where-to-find-current-data` — `Где брать актуальные данные`

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
- Content API hydrates and validates PostgreSQL JSONB content documents, seeded
  from `src/content/**` when content tables are empty.
- Sessions use httpOnly cookies.
- Admin auth uses a separate `finpulse_admin_session` cookie and env-provided
  credentials.

Internal admin:
- `apps/admin` is a separate Next.js app.
- It rewrites `/api/**` to the Fastify backend.
- It exposes a read-only curator progress board.
- It exposes `/content` for guarded methodologist edits to level, section, and
  lesson-card text slices with live preview and direct DB publication.
- It must not expose private reflection/artifact answer text by default.
- Organizations, RBAC, answer review, analytics dashboards, rollback/audit/PR
  publication workflows, and broad CMS scope remain out of scope.

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
- T-175: `npm run check:content`,
  `npm run test:run -- src/content/program.test.ts`, targeted Node smoke for
  lessons 9-16, `git diff --check`,
  `npm run content:pull tmp/content-db-export-before-t175`,
  `npm run content:seed`, and `npm run check:content:db` passed. The local DB
  seed now contains 1 program, 1 level, 4 sections, and 16 lessons.
- T-174: `npm run test:admin -- apps/admin/src/components/admin/ContentEditor.test.tsx`,
  `npm run test:admin`, `npm run typecheck:admin`, `npm run lint`,
  `npm run build:admin`, and `git diff --check` passed.
- T-173: `npm run check:content`,
  `npm run test:run -- src/content/program.test.ts`, `git diff --check`,
  custom Level 1 new-lesson contract smoke,
  `npm run content:pull tmp/content-db-export-before-t170`,
  `npm run content:seed`, and `npm run check:content:db` passed. The local DB
  seed now contains 1 program, 1 level, 4 sections, and 16 lessons.
- T-172: `npm run test:admin`,
  `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts -t "returns read-only admin progress summaries without private reflection answer text"`,
  `npm run typecheck`, `npm run lint`, `npm run build:admin`, and
  `git diff --check` passed. `npm run test:run -- server/app.test.ts` without
  DB env reproduced the known backend-test DB URL requirement. The full backend
  suite with the local DB URL still fails in the existing content API shape test
  because parallel content work exposes 16 lessons / 4 sections while the old
  assertion expects the earlier smaller graph.
- T-170: `npm run test:admin`, `npm run typecheck`, `npm run lint`,
  `FINPULSE_API_PORT=3027 npm run build:admin`, and `git diff --check` passed.
  Browser QA on `/content` with local backend `3027` and admin production build
  `3028` verified a lesson-node dialog opened with bounded overlay/content:
  the overlay rect matched the preview rect, the dialog content stayed inside
  the preview after width capping, and no framework/runtime overlay appeared.
- T-169: `npm run check:content`, `git diff --check`,
  `npm run content:pull tmp/content-db-export-before-t169`,
  `npm run content:seed`, and `npm run check:content:db` passed. The local DB
  seed now contains 1 program, 1 level, 3 sections, and 9 lessons; the DB check
  reports `finpulse-learning-mvp`, 1 level, 9 lessons. The pre-seed local DB
  content backup is under `tmp/content-db-export-before-t169`.
- T-168: `python3 /Users/elena/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/finpulse-lesson-methodologist`
  was attempted but could not run because this Python environment lacks
  `yaml`/PyYAML. Node metadata/frontmatter smoke check, `wc -l`, and
  `git diff --check` passed.
- T-167: `npm run test:admin`,
  `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`,
  `npm run typecheck`, `npm run lint`, `npm run build:admin`,
  `npm run build:web`, `npm run check:content`, and `git diff --check`
  passed. Browser QA on `/content` with a local backend on `3017` and admin
  production build on `3018` verified real learner route preview rendering,
  lesson click-through to completion, route navigation, reset behavior, invalid
  JSON fallback, no learner progress/reflection backend calls, and no horizontal
  overflow at 1280px or 390px. Follow-up visual parity fix added admin Tailwind
  sources for learner app/pages/program navigation and restored production main
  layout classes for embedded preview; `npm run build:admin`,
  `npm run typecheck`, and `git diff --check` passed. `build:web` emitted the
  existing Vite chunk-size warning.
- T-166: `find skills/fin-literacy-expert -maxdepth 3 -type f -print`,
  Node metadata/frontmatter smoke check, `wc -l`, `ln -sfn` local Codex skill
  discovery setup, and `git diff --check` passed. The skill-creator
  `quick_validate.py` check was attempted but could not run because this Python
  environment lacks `yaml`/PyYAML.
- T-165: `npm run test:admin`, `npm run typecheck`, `npm run lint`,
  `npm run build:admin`, `npm run build`, `npm run check:content`, and
  `git diff --check` passed. Browser/Playwright QA captured before/after
  screenshots under `harness/artifacts/T-165-admin-preview-shell/screenshots/`,
  verified admin preview uses the shared production lesson shell with header,
  lesson goal, card, and bottom action, verified old admin preview frame classes
  are absent, and verified no document-level horizontal overflow at 1024px or
  390px. `npm run build` emitted the existing Vite chunk-size warning.
- T-164: `npm run test:admin`, `npm run typecheck`, `npm run lint`,
  `npm run build:admin`, Browser QA on `http://localhost:3002/content` at
  1280x720 and 390x844 with a local backend on `3011`, and `git diff --check`
  passed. Browser QA verified production frame styles, real rich text/options,
  card-tree selection changing the production preview, and no document-level
  horizontal overflow at 390px. The only console warning observed was a Next dev
  Turbopack HMR warning, not an app/runtime error.
- T-163: `npm run content:seed`, `npm run check:content`,
  `npm run check:content:db`, `npm run content:pull`, `npm run typecheck`,
  `npm run test:admin`,
  `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts`,
  `npm run lint`, `npm run build:web`, `npm run build:admin`,
  `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`,
  and `git diff --check` passed. A first backend test run without database env
  reproduced the known `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`,
  or `DATABASE_URL` requirement. `content:pull` export output was removed after
  the smoke check.
- T-162: `npm run check:content`,
  `npm run test:run -- src/content/program.test.ts`, `git diff --check`, and
  `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
  passed. A first `npm run verify` without database env reproduced the known
  backend-test failure requiring `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`. The full passing verify emitted
  the existing Vite/Storybook chunk-size warnings.
- T-161: `find skills/finpulse-content-editor -maxdepth 3 -type f -print`,
  Node metadata/frontmatter smoke check, `rg` policy smoke check, `wc -l`, and
  `git diff --check` passed. The skill-creator `quick_validate.py` check was
  attempted but could not run because both available Python environments lack
  `yaml`/PyYAML.
- T-160: `npm run check:content`,
  `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx src/content/program.test.ts src/App.test.tsx`,
  `npm run typecheck`, `npm run lint`, `npm run build:web`, and
  `git diff --check` passed. `npm run verify` passed content validation,
  runtime import guard, typecheck, lint, and 108 non-backend tests, then failed
  19 backend tests because this shell has no `FINPULSE_TEST_DATABASE_URL`,
  `FINPULSE_DATABASE_URL`, or `DATABASE_URL`. `build:web` emitted the existing
  Vite chunk-size warning.
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
