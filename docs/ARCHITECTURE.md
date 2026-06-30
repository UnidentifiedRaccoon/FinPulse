# Architecture — FinPulse Learning MVP

## Decision summary

Use a Vite React + TypeScript SPA for the learner frontend. Starting in Stage 2, use a small Fastify + PostgreSQL backend for learner identity, session-backed progress, private reflection/artifact answers, and content API delivery.

ADR-0010 adds a separate internal Next.js admin surface under `apps/admin` for a curator progress board. ADR-0011 deploys that admin surface as a separate Yandex Serverless Container. ADR-0012 adds a guarded content editor to the same admin surface and moves runtime published content to PostgreSQL JSONB documents. This is not a migration of the learner app and does not change the learner SPA decision.

Rationale:
- PostgreSQL is already the runtime persistence dependency;
- methodologist text edits need a direct preview-and-publish workflow;
- progress now needs server-owned persistence;
- there are no production financial operations;
- SEO and server rendering are not the primary MVP constraints;
- development speed and a small mental model matter more right now.

Approved educational content hierarchy:

```txt
Program -> Level -> Section -> Lesson -> Card
```

Runtime content JSON, TypeScript domain types, content API payloads, frontend
routes, and persistence context use Level and Section directly. Old
`module`/`unit` browser/API compatibility routes and payloads are not supported.

Next.js/SSR can be reconsidered later if one of these becomes true:
- public SEO landing/content discovery becomes a main growth channel;
- lessons need server-side personalization;
- SSR-specific personalization becomes central;
- content is moved to a CMS requiring server rendering or dynamic metadata;
- the app needs server actions, edge rendering, or dynamic metadata at scale.

The accepted exception is the internal admin surface from ADR-0010 and ADR-0011:
- it lives in `apps/admin`;
- it uses Next.js as a separate admin app;
- it reads protected backend admin APIs under `/api/admin/**`;
- it must not add `/admin` routes to the learner SPA;
- it must not reintroduce `Module -> Unit` terminology.

## Recommended frontend stack

```txt
Build/dev:      Vite
UI runtime:     React + TypeScript
Routing:        React Router in SPA/declarative mode
State:          React state first; add Zustand only when small cross-route client state appears
Data:           Backend content API backed by PostgreSQL JSONB documents
Styling:        Tailwind CSS
UI primitives:  shadcn/ui
Tests:          Vitest + Testing Library when components stabilize
```

## Recommended backend stack

```txt
HTTP server:    Fastify
Persistence:    PostgreSQL through async repositories
Auth:           login/password with hashed passwords
Sessions:       server-side session id in httpOnly cookie
Content API:    responses hydrated from PostgreSQL JSONB content documents
Tests:          Vitest integration tests against isolated PostgreSQL schemas/databases
```

## Recommended project structure

This is a suggested structure, not a rigid framework:

```txt
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  pages/
    ProgramOverviewPage.tsx
    LevelPage.tsx
    SectionPage.tsx
    LessonPage.tsx
  features/
    program-navigation/
    lesson-reader/
  content/
    program.ts
    order.ts
    program.json
    levels/
  shared/
    ui/
    lib/
    config/
  styles/
    globals.css
server/
  app.ts
  index.ts
  db/
    connection.ts
    migrate.ts
    schema.sql
    query.ts
    usersRepository.ts
    sessionsRepository.ts
    progressRepository.ts
    reflectionAnswersRepository.ts
  modules/
    auth/
    content/
    progress/
    reflections/
  lib/
    password.ts
    sessions.ts
```

The `server/modules/**` folder is generic backend module organization and is
not part of the educational content hierarchy.

`src/content/**` remains in the repo as the seed fixture source for fresh databases and content validation, not as the learner runtime source after ADR-0012.

## Data flow

```txt
PostgreSQL JSONB content documents
  -> content repository
  -> hydrate + validate typed domain model
  -> backend content API
  -> frontend API client
  -> React pages/components
  -> local UI state or optional small client store when justified
```

```txt
Admin content edit
  -> Next.js admin /content editor
  -> authenticated /api/admin/content/** route
  -> guarded JSON slice replacement
  -> hydrate + validate full content graph
  -> PostgreSQL JSONB document update with revision + 1
  -> learner content API immediately serves refreshed content
```

```txt
Learner interaction
  -> frontend event handler
  -> authenticated progress API
  -> async PostgreSQL repository
  -> progress row owned by current session user
  -> frontend progress refresh or optimistic local UI update
```

```txt
Reflection/artifact answer
  -> frontend validates meaningful input before continuing
  -> authenticated reflection API
  -> async PostgreSQL repository
  -> answer row owned by current session user and card.id
  -> profile fetches only the current learner's answers
```

## State policy

Use local React state for:
- expanded/collapsed UI sections;
- form-like transient UI;
- small one-component interactions.

Add Zustand only when local React state or route/API state creates real duplication, for example small non-sensitive UI preferences shared across routes.

Do not use Zustand for:
- storing the entire content corpus without reason;
- replacing derived selectors;
- backend-owned server state such as authenticated user or saved progress;
- analytics or diagnostics in MVP.

## Content loading policy

Current implementation:
- use PostgreSQL JSONB content documents as the published runtime source;
- store program metadata, level metadata + section order, section metadata + lesson order, and one full lesson document per lesson;
- hydrate and validate the DB graph on the backend before serving public content;
- use `src/content/program.json`, `src/content/levels/<level>/level.json`, and `src/content/levels/<level>/sections/<section>.json` as seed fixtures;
- keep pure ordering helpers in `src/content/order.ts` so rendered routes do not import Zod schemas;
- validate seed fixtures with `scripts/check-content-json.mjs`;
- validate database content with `npm run check:content:db`.

Stage 2 runtime policy after ADR-0012:
- PostgreSQL content tables are source-of-truth for published content;
- the backend reads and validates the DB-backed graph;
- frontend rendered routes fetch program/level/section/lesson data from `/api/**`;
- public learner content API routes remain read-only to learners;
- admin content writes go through authenticated `/api/admin/content/**`, revision checks, guarded slice replacement, and server-side validation.

## Backend/API boundary

Current public content routes:

```txt
GET /api/health
GET /api/program
GET /api/levels
GET /api/levels/:levelSlug
GET /api/sections/:sectionSlug
GET /api/lessons/:lessonSlug
```

Initial auth/progress/reflection routes:

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/progress
PUT  /api/progress/lessons/:lessonSlug
PUT  /api/progress/cards/:cardId
GET  /api/reflections
PUT  /api/reflections/:cardId
```

Initial internal admin routes:

```txt
POST /api/admin/auth/login
POST /api/admin/auth/logout
GET  /api/admin/auth/me
GET  /api/admin/summary
GET  /api/admin/users
GET  /api/admin/users/:userId/progress
GET  /api/admin/content/tree
GET  /api/admin/content/preview
PUT  /api/admin/content/slices
```

Auth, progress, and reflection answer policy:
- content routes may remain public;
- progress and reflection routes require a valid httpOnly cookie session;
- route handlers derive the user id from the session only;
- password hashes and session records are stored server-side in PostgreSQL;
- progress stores viewed/completed markers, not diagnostics/scoring/analytics;
- reflection answers store neutral answer fields for `reflection`/`artifact` cards only and never store scores, labels, inferred traits, recommendations, or analytics.

Admin auth and privacy policy:
- admin auth is separate from learner auth and uses the `finpulse_admin_session` httpOnly cookie;
- the first admin is configured through `FINPULSE_ADMIN_LOGIN`, `FINPULSE_ADMIN_PASSWORD_HASH`, and `FINPULSE_ADMIN_SESSION_SECRET`;
- learner sessions do not authorize `/api/admin/**`;
- admin sessions do not authorize learner-owned routes such as `/api/progress` or `/api/reflections`;
- admin read models may expose learner `id`, `login`, `createdAt`, progress counts, lesson/card statuses, timestamps, current lesson, last activity, and derived stuck-days;
- admin read models must not expose `reflection_answers.answer_json` or personal reflection/artifact answer text by default;
- `organizationId`, `includeAnswers`, and private field-selection query parameters are rejected while organization filtering and answer review are out of scope.

Persistence boundary:
- route handlers should call async repository functions instead of embedding SQL directly;
- repositories own PostgreSQL queries, connection/pool usage, and persistence-specific error mapping;
- API request/response contracts should not expose PostgreSQL implementation details;
- migrations should be deterministic and committed with the backend code;
- local development and CI should use isolated PostgreSQL schemas/databases rather than generated SQLite files.
- content writes should replace full JSONB documents at program/level/section/lesson granularity instead of mutating ad hoc nested SQL paths;
- content updates must validate the full hydrated graph before publication and must reject stale `revision` values with `409 content_revision_conflict`.

## Deployment

Learner production deployment uses one same-origin Yandex Serverless Container. The Fastify backend serves `/api/**` and the built Vite SPA from `dist/`, so content, learner auth, progress, and reflection routes share one public origin with the learner frontend.

Admin production deployment uses a separate Yandex Serverless Container for the `apps/admin` Next.js app. The admin container does not connect to PostgreSQL directly; it rewrites `/api/**` to the production Fastify backend through `FINPULSE_ADMIN_API_BASE_URL`. The backend still owns `/api/admin/**`, admin authentication, session cookies, and all curator read models. This keeps the learner SPA deployment stable while allowing the admin surface to be deployed and restricted independently.

Local admin development still runs separately from the learner SPA, typically on `http://localhost:3002`, with Next rewrites forwarding `/api/**` to the local Fastify backend on `http://127.0.0.1:3001`.

Runtime expectations:
- the backend must read `PORT` from the environment and bind to `0.0.0.0` so it can run in container platforms such as future Yandex Serverless Containers;
- PostgreSQL connection settings come from environment variables, with the deployed DB password supplied through GitHub secret `FINPULSE_DATABASE_PASSWORD`; the runtime also supports Lockbox payload lookup through `FINPULSE_DATABASE_PASSWORD_SECRET_ID` for non-VPC deployments;
- no database password, session secret, or connection string should be committed;
- production admin credentials are injected as `FINPULSE_ADMIN_LOGIN`, `FINPULSE_ADMIN_PASSWORD_HASH`, and `FINPULSE_ADMIN_SESSION_SECRET` into the backend container, not the Next.js admin container;
- content tables are created by `server/db/schema.sql`; fresh empty content tables are seeded from bundled `src/content/**` fixtures on backend startup, and operators can explicitly run `npm run content:seed`.
- Yandex Managed PostgreSQL is reachable through the deployed Serverless Container VPC network configuration; the DB security group allows the Serverless service subnet CIDR `198.19.0.0/16` on port `6432`;
- the backend applies the committed idempotent schema SQL on startup; introduce a versioned migration ledger before broad schema evolution.

Deploy resources, IAM, required GitHub secrets/variables, smoke checks, rollback, DB start handling, and the separate admin deployment workflow are documented in `docs/operations/yandex-cloud-finpulse-deploy.md`.

## Error handling

The app should handle:
- missing route slug;
- missing level/section/lesson;
- malformed content in development;
- empty levels, sections, or lessons;
- unsupported content block type.

## Performance baseline

- mobile-first layout;
- route-level lazy loading once pages grow;
- avoid loading heavy media inline in JSON;
- keep large assets in `/public` or a proper asset pipeline;
- prefer semantic content blocks over raw HTML.

## Architecture change rule

Any change to the main stack or product boundary requires an entry in `docs/DECISIONS.md`.
