# Project State — FinPulse Learning MVP

Last updated: 2026-06-01

## Current phase

Stage 2 backend MVP is on `main`; T-016 lesson/card experience is implemented on `feat/lesson-card-experience` for draft PR review. The current workspace contains stacked review changes through T-052, including learning path, entry auth, inline video, local auth/CORS fixes, UI cleanup, mascot identity docs and asset/component work, popup cleanup, methodology content-system work, responsive app navigation, the T-034 content scope cleanup, the T-035 methodology authoring framework, the T-036 desktop sidebar brand wordmark, account/logout navigation polish, lesson-node glare polish, broad mascot placement removal, Finzdorov 01.02-01.04 runtime content conversion, unit-aligned visual sections in the module path, learner-facing removal of redundant section codes, compacted `01.01` values runtime content, scroll-aware module header polish, logout redirect cleanup, the profile entry route, private reflection/artifact answer persistence, the expanded QA user scenario map, the full-scenario QA fixes, mobile lesson CTA bottom alignment, and PostgreSQL persistence migration.

The app scaffold exists as a Vite React TypeScript SPA with Tailwind CSS, shadcn/ui, React Router, Vitest, and a mobile content-reader surface. Runtime content now uses split JSON files with the hierarchy Program -> Module -> Unit -> Lesson -> Card. ADR-0006 accepts a narrow Stage 2 backend: Fastify, simple learner login, httpOnly cookie sessions, backend-owned progress markers, and read-only content API delivery from validated JSON. ADR-0007 accepts private persisted reflection/artifact answers for authenticated learners only. ADR-0008 supersedes the SQLite persistence portion of ADR-0006 with PostgreSQL behind async repositories.

The Fastify backend and frontend API migration are implemented on `feat/stage-2-backend-mvp`. Frontend rendered pages now fetch program/module/unit/lesson data through `/api/**`; authenticated users can save viewed/completed lesson/card progress and private reflection/artifact answers. Security/content contract reviews, `npm run verify`, and browser smoke passed.

## Locked MVP assumptions

- Mobile-first educational site.
- Static educational program content.
- JSON as source-of-truth.
- React + TypeScript.
- SPA/Vite preferred.
- Fastify backend accepted for Stage 2.
- PostgreSQL persistence accepted for Stage 2 learner/session/progress/reflection state.
- Zustand for small client-side state.
- Tailwind + shadcn/ui.
- Minimal learner login is allowed for saved progress; full user cabinets remain out of scope.
- Authenticated learner reflection/artifact answers are allowed as a private personal artifact, not diagnostics, scoring, analytics, or recommendations.
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
- Export/delete controls and richer metadata for saved personal answers.

## Current verification state

`./scripts/verify.sh` exists as the generic entry point and runs content validation, typecheck, lint, tests, and production build through available package scripts.

`npm run dev` now starts both the Fastify backend and Vite frontend. Vite proxies `/api` to `http://127.0.0.1:3001` for local development. The backend uses PostgreSQL for learner-owned state and defaults to `postgres://finpulse:finpulse@127.0.0.1:5432/finpulse` outside production unless `FINPULSE_DATABASE_URL` or `DATABASE_URL` is set.

GitHub Actions runs `npm ci` and `npm run verify` for pull requests and pushes to `main`, with a PostgreSQL service available to backend tests through `FINPULSE_TEST_DATABASE_URL`.

`src/content/program.json` is a program manifest. Module and unit runtime content live under `src/content/modules/**`. The content validator also validates the example split graph, rejects unknown keys, requires normalized relative JSON paths, checks sorted unique `order` values, and verifies scenario `correctOptionId` values have matching options.

Module 1 runtime content now includes four Finzdorov sections: `01.01 Ваши базовые ценности`, `01.02 Видение будущего`, `01.03 Финансовые цели`, and `01.04 Мотивация достижения целей`. Section 01.01 is compacted to four runtime lessons and remains sourced from `docs/modules/module_1/lesson_01/`; sections 01.02-01.04 are mapped from extracted source files under `docs/methodology/finzdorov_module_01/`. The module learning path renders each runtime unit as one visual section.

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

T-027 previously added a second runtime content unit to Module 1, `unit_02_impulsive_purchases`. T-034 superseded that runtime addition at the time: the unit and `pause-before-purchase` lesson were removed because they did not belong to the prepared Finzdorov Module 01 source scope.

T-028 documents the user-provided mascot visual direction without implementing it in the UI: `docs/MASCOT.md` defines the cream/sky-blue fennec or fox guide, compass badge, approximate palette, anatomy, usage rules, asset requirements, and product boundaries. `docs/DESIGN_SYSTEM.md` now treats the mascot as an optional visual identity asset while keeping mascot-led mechanics deferred. `npm run verify` passed.

T-030 simplifies the lesson detail popup opened from the module/unit path without changing content, API, auth, progress, or routing contracts. The popup now keeps the lesson title, duration with an icon, and actions only; the module/section label, lesson description, and main-skill block were removed to avoid clipped mobile text. `npm run test:run -- src/App.test.tsx`, `npm run verify`, and Browser mobile/desktop popup smoke passed.

T-031 turns `docs/methodology/README.md` into a maintainable methodology source catalog under `docs/methodology/finpulse_methodology/`, preserving the full original in `00_original_content.md`, and adds `docs/methodology/CONTENT_BACKLOG.md` with runtime/supplemental/methodology/future-scope/schema-gap classifications. T-034 supersedes the former Module 2 runtime slice from T-031: `budget-without-shame` is removed from runtime because it is outside the current factual Finzdorov Module 01 / block `01.01` scope.

T-032 adds responsive application navigation without changing content, API, auth, progress, or routing contracts. Desktop now uses a fixed left sidebar with FinPulse branding, in-scope learning/account navigation, active states, and logout access for authenticated users. Mobile non-lesson routes use a fixed bottom menu; lesson routes keep the bottom menu hidden to avoid overlapping the lesson CTA. The authenticated welcome entry also exposes logout now that the old top header auth controls are gone. `npm run test:run -- src/App.test.tsx`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run verify`, and Browser desktop/mobile smoke passed.

T-033 adds the approved FinPulse mascot asset and UI rollout without changing content, API, auth, progress, or routing contracts. The supplied source is kept as a transparent source copy at `public/assets/mascot/finpulse-mascot-source.png`; the transparent runtime PNG is `public/assets/mascot/finpulse-mascot.png`; `src/shared/ui/Mascot.tsx` centralizes the asset path, alt/decorative behavior, variants, and fixed sizes. Mascot placements now appear as a calm financial navigator in entry/loading/welcome states, program overview route guidance, module header/path dialog/transition/empty states, lesson intro/completion/empty cards, and only supportive lesson feedback tones. `npm run verify` passed; Browser desktop/mobile smoke passed with asset loading confirmed, no console errors, and no 390px horizontal overflow.

T-034 aligns runtime content with the factual methodology currently available for `01.01 Ваши базовые ценности`. The program now has one module, `financial-goals`, and Module 1 has one section/unit, `01.01 Ваши базовые ценности`, containing the existing eight adapted lessons from `why-values-matter` through `practice-1m`. Former agent-added runtime content outside that block (`impulsive-purchases`, `pause-before-purchase`, `budget-without-shame`, `budget-as-choice-map`) is removed; API tests assert those routes are no longer served.

T-035 adds `docs/methodology/AUTHORING.md` as the unified Russian-language authoring framework for turning provided source content into FinPulse-ready methodical packages and runtime JSON. The guide consolidates MVP boundaries, source intake, fragment classification, lesson method cards, supported card types, adaptation rules, QA checklists, file package structure, and verification expectations. No runtime JSON, schema, UI, backend, auth, or progress contracts changed. `npm run verify` passed.

T-036 adds the supplied FinPulse wordmark to desktop navigation without changing content, API, auth, progress, or routing contracts. The baked-checkerboard source PNG was converted into `public/assets/brand/finpulse-wordmark.png` as a transparent cropped runtime asset, and the desktop sidebar brand link now renders that wordmark at stable intrinsic dimensions. `npm run test:run -- src/App.test.tsx`, `npm run verify`, and Browser desktop smoke on `/program` passed.

T-037 polishes the account/logout navigation surface without changing auth, API, content, progress, or product scope. The desktop sidebar now treats the account area as a bottom dock with the signed-in learner and logout action; the mobile bottom menu now shows account/login/logout affordances according to auth state; the authenticated welcome screen no longer duplicates the logout button. `npm run test:run -- src/App.test.tsx`, `npm run verify`, and Browser desktop/mobile smoke passed.

T-038 adjusts account/logout placement after UI review without changing auth, API, content, progress, or product scope. Desktop now separates `Аккаунт` as its own sidebar navigation item from the bottom `Выйти` action. Mobile bottom navigation no longer contains `Выйти`; the authenticated `/` account/welcome section renders a mobile-only logout button at the bottom of its content. `npm run test:run -- src/App.test.tsx`, `npm run verify`, and Browser desktop/mobile smoke passed.

T-039 polishes the highlighted circular lesson nodes without changing content, API, auth, progress, routing, or product scope. Current/completed lesson nodes now use a clipped diagonal glare that spans the whole circular button, closer to the Lingvo-style reference. `npm run verify` and Browser desktop/mobile smoke on `/modules/financial-goals` passed.

T-040 removes the broad mascot placements from current learner UI surfaces without changing content, API, auth, progress, routing, or deleting the approved mascot asset/component/docs. `src/shared/ui/Mascot.tsx` and `public/assets/mascot/**` remain available for later user-approved placements. Current app routes no longer render mascot images in entry/account, program, module path/dialog/transition/empty states, lesson intro/completion/empty states, or feedback. `npm run verify` passed; Browser desktop and 390px smoke passed for `/`, `/program`, `/modules/financial-goals`, `/lessons/why-values-matter`, and the module lesson dialog with no console errors, no horizontal overflow, and zero rendered mascot images.

T-041 converts extracted Finzdorov sections `01.02 Видение будущего`, `01.03 Финансовые цели`, and `01.04 Мотивация достижения целей` into runtime JSON without changing schema, UI renderers, backend API, auth, or progress contracts. Module 1 now has four units: `values-and-goals`, `future-vision`, `financial-goals-map`, and `goal-motivation`, adding eleven short lessons from `life-cycle-and-money` through `goal-levels`. Source mapping docs live under `docs/modules/module_1/lesson_02_future_vision/`, `lesson_03_financial_goals/`, and `lesson_04_goal_motivation/`; large PDFs, XLSX, images, and templates are preserved as `supplemental`. `npm run check:content`, focused API/app tests, `npm run verify`, and Browser 390px smoke passed.

T-042 aligns the visual module path with the runtime unit structure without moving or mixing content. `buildLessonPathSections` now creates one visual section per unit and uses `unit.order` for section numbers, so Module 1 renders as `01.01`, `01.02`, `01.03`, and `01.04` instead of splitting `01.01` into additional artificial chunks. `npm run test:run -- src/App.test.tsx src/features/program-navigation/learningPath.test.ts`, `npm run verify`, and Browser smoke on `/modules/financial-goals` and `/lessons/goal-levels` passed.

T-043 removes redundant visible Finzdorov section codes from learner-facing module/unit path section headings without changing runtime JSON, content schema, API, auth, progress, or lesson reader behavior. Section titles now render as `Ваши базовые ценности`, `Видение будущего`, `Финансовые цели`, and `Мотивация достижения целей`, while the eyebrow remains `Раздел` without a numeric suffix. `npm run test:run -- src/App.test.tsx src/features/program-navigation/learningPath.test.ts`, `npm run verify`, and Browser smoke on `/modules/financial-goals` passed.

T-044 compacts `01.01 Ваши базовые ценности` from eight runtime lessons to four balanced lessons without changing schema, API, UI renderers, auth, or progress contracts. The section now contains `why-values-matter`, `what-are-values`, `values-conflict`, and `practice-1m`; deeper source slices remain documented under `docs/modules/module_1/lesson_01/` and supplemental metadata. `npm run check:content`, focused API/app tests, `npm run verify`, Browser smoke on `/modules/financial-goals`, `/lessons/why-values-matter`, and `/lessons/practice-1m` passed; local dev was restarted on backend `3002` and frontend `5175`.

T-045 polishes the module path sticky header without changing content, API, auth, progress, or routing contracts. The header back button now renders `Модуль 1 раздел N` for the section currently visible during scroll, the header title follows the visible section title, the title block has zero top margin, and the module button has comfortable horizontal padding. `npm run test:run -- src/App.test.tsx`, `npm run verify`, and Browser desktop/mobile smoke on `/modules/financial-goals` passed.

T-047 changes the authenticated entry behavior and account surface without adding profile management, achievements, followers, rewards, diagnostics, analytics, or content changes. Authenticated `/` now redirects to `/program`; the navigation label is `Профиль` and points to `/profile`; the old welcome screen is replaced by a Duolingo-like profile showing avatar area, email/login, registration date from `users.created_at`, shortened learner ID, and existing learning-progress stats only. Auth responses now include `createdAt`. Focused auth/app tests, `npm run verify`, and Browser desktop/390px smoke passed.

T-048 adds private saved answers for authenticated `reflection` and `artifact` cards without adding diagnostics, scoring, recommendations, analytics, rewards, or anonymous persistence. The backend exposes `GET /api/reflections` and `PUT /api/reflections/:cardId`, deriving ownership from the current session and storing neutral answer fields by `(user_id, card_id)`. The lesson reader requires meaningful reflection/artifact input before completion, saves the answer before marking the card complete, and leaves anonymous answers transient. `/profile` now includes `Мой финансовый ориентир`, grouped from existing unit context. `npm run check:content`, focused backend/frontend tests, `npm run verify`, and Browser 390px smoke passed.

T-049 adds `docs/QA_USER_SCENARIO_MAP.md`, a comprehensive QA scenario map for registration/login/logout, app shell navigation, program/module/unit paths, lesson/card flows, progress persistence, private reflection/artifact answers, profile display, API/session errors, accessibility, and mobile/desktop responsive coverage. No runtime code, content JSON, API, auth, progress, or profile behavior changed. `npm run verify` passed.

T-050 runs the full scenario QA pass against `docs/QA_USER_SCENARIO_MAP.md` without expanding MVP scope or changing content JSON. Browser QA covered P0 M-390/D-1440 flows, M-360 overflow, two-user privacy isolation, and full traversal of all 15 current lessons; API smoke covered content, protected endpoints, reflection validation, unknown lesson, and CORS preflight. Confirmed fixes make required completed progress writes fail closed, clear authenticated/private state on session-expired progress/reflection 401s, normalize non-JSON API errors, and show an empty program state when no modules are returned. Focused tests and `npm run verify` passed.

T-051 fixes mobile lesson CTA positioning on short cards without changing content, API, auth, progress, or routing contracts. The lesson session now uses a vertical flex layout so the existing sticky bottom action is pushed to the viewport bottom even when the active card content is shorter than the screen. `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`, `npm run verify`, and Browser 390px/desktop smoke passed.

T-052 migrates backend persistence from SQLite/`better-sqlite3` to PostgreSQL/`pg` without changing frontend API contracts, product scope, or JSON content source-of-truth. The backend now uses an async repository boundary for users, sessions, progress, and private reflection answers; PostgreSQL DDL uses `uuid`, `text`, `timestamptz`, and `jsonb`; tests use isolated PostgreSQL schemas; CI provides a PostgreSQL service. `npm run typecheck`, `npm run lint`, focused backend tests, and `npm run verify` passed against PostgreSQL.

T-053 deploys the Yandex Cloud on-demand Managed PostgreSQL control layer. YC rejected uppercase `FinPulse`, so the target folder is `finpulse` (`b1gpl04msqva2tsff46k`). `finpulse-db` (`c9quhk2n9q3c3vvsp83g`) is PostgreSQL `16.13`, one public-IP host in `ru-central1-a`, `s2.micro`, `network-ssd`, 10 GB, with serverless access and dedicated security group `finpulse-db-sg` (`enpfi1mqc28vo7tc71kn`). Generated credentials are stored through Connection Manager/Lockbox metadata (`a59otq7kc4275f8onsdm` / `e6qdr1f6uh0k9aj2v34c`), without reading the payload. `finpulse-db-start` (`https://functions.yandexcloud.net/d4e0o3h9gnq59inscpns`) is public and opens/extends a 2-hour lease; `finpulse-db-autostop` runs from trigger `finpulse-db-autostop-5m` every 5 minutes. Verification invoked the public start URL once, confirmed `active_until=1780262473`, created the first required backup, manually stopped the cluster, and confirmed final status `STOPPED`. Full `npm run verify` remains blocked locally until a PostgreSQL test database URL is provided.

T-054 through T-060 add the production CI/CD deploy path. FinPulse now uses a same-origin single-container deployment shape: Fastify serves `/api/**` and the built Vite SPA from `dist/`; `Dockerfile`, `.dockerignore`, `vite.server.config.ts`, `npm run build:server`, `npm run build:container`, and `npm run start` define the production artifact. The backend exposes DB-free `/api/health` and DB-backed `/api/readyz`, can compose the PostgreSQL URL from env pieces plus `FINPULSE_DATABASE_PASSWORD`, and continues to run the idempotent `server/db/schema.sql` bootstrap at startup. Yandex deploy resources created on 2026-05-31: Container Registry `finpulse` (`crp5j8penr0hui0ttaum`), Serverless Container `finpulse-app` (`bbabho5nujsp32c8mvc7`, URL `https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net/`), runtime SA `aje0lujm0q1obpn9fbu9`, deploy SA `ajeboe0h7j2k9vtfi06j`, WIF federation `ajeuttdtpqdudd97n6ei`, and federated credential `ajeci1l3l7qhus6vjqhk`. `.github/workflows/deploy.yml` runs on push to `main`: verify, GitHub OIDC to YC IAM token exchange, image build/push, DB start via `YC_DB_START_URL`, Serverless Container revision deploy with VPC network attachment and GitHub secret `FINPULSE_DATABASE_PASSWORD`, and smoke checks for frontend, `/api/health`, and `/api/readyz`. Operations runbook: `docs/operations/yandex-cloud-finpulse-deploy.md`. Local verification passed with a temporary PostgreSQL database: `npm run verify`, `npm run build:server`, and compiled production server smoke for `/`, `/api/health`, and `/api/readyz`. First `main` deploy runs found that YC rejects explicit `PORT`, single-zone `--subnets`, and preview `--secret` binding for this container; T-060 also added DB security-group ingress for the Serverless service subnet CIDR `198.19.0.0/16` and `FINPULSE_DATABASE_SSL_LIBPQ_COMPAT=true` for Yandex Managed PostgreSQL SSL.

T-061 runs full production scenario QA against the Yandex Serverless Container deployment. Production QA covered all P0 flows on M-390/D-1440, M-360 overflow, M-430/D-1024 responsive checks, keyboard/a11y smoke, API data boundaries, two-user privacy isolation, and full traversal of all 15 current runtime lessons. Confirmed fixes clear private UI after logout plus browser Back, preserve artifact template labels in profile answers from canonical content, make empty-JSON logout clear the session instead of returning 500, avoid viewed-progress writes for invalid lessons, improve key color-token contrast and compact touch targets, and make auth validation copy less misleading. `npm run verify` passed with a temporary local PostgreSQL database.

T-062 fixes intermittent production save failures after on-demand PostgreSQL stop/start events. Production logs showed `ETIMEDOUT` while the DB was starting and an unhandled idle `pg` pool `ECONNRESET` that could crash a serverless container invocation. The backend now handles idle pool errors without crashing, and the frontend retries idempotent `GET`/`PUT` requests briefly on transient `500`/`502`/`503`/`504` or browser network errors. Production API and Browser replay passed after starting the DB. `npm run test:run -- server/db/connection.test.ts src/App.test.tsx`, `npm run typecheck`, `npm run lint`, and `npm run build` passed. Full `npm run verify` was attempted but backend suites require `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL` in the local shell.

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
