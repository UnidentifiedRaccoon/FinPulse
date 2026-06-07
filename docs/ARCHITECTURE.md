# Architecture — FinPulse Learning MVP

## Decision summary

Use a Vite React + TypeScript SPA for the frontend. Starting in Stage 2, use a small Fastify + PostgreSQL backend for learner identity, session-backed progress, private reflection/artifact answers, and read-only content API delivery.

Rationale:
- content remains canonical static JSON;
- progress now needs server-owned persistence;
- there are no production financial operations;
- SEO and server rendering are not the primary MVP constraints;
- development speed and a small mental model matter more right now.

Next.js/SSR can be reconsidered later if one of these becomes true:
- public SEO landing/content discovery becomes a main growth channel;
- lessons need server-side personalization;
- SSR-specific personalization becomes central;
- content is moved to a CMS requiring server rendering or dynamic metadata;
- the app needs server actions, edge rendering, or dynamic metadata at scale.

## Recommended frontend stack

```txt
Build/dev:      Vite
UI runtime:     React + TypeScript
Routing:        React Router in SPA/declarative mode
State:          React state first; add Zustand only when small cross-route client state appears
Data:           JSON files, validated by script/schema
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
Content API:    read-only responses hydrated from validated JSON files
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
    ModulePage.tsx
    LessonPage.tsx
  features/
    program-navigation/
    lesson-reader/
  content/
    program.ts
    order.ts
    program.json
    modules/
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

Alternative for runtime-editable static content:

```txt
public/content/program.json
```

Use `src/content/` when content is bundled with the app. Use `public/content/` when content should be replaceable without rebuilding the JavaScript bundle.

## Data flow

```txt
JSON content file
  -> content validator / typed domain model
  -> backend content API
  -> frontend API client
  -> React pages/components
  -> local UI state or optional small client store when justified
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
- use `src/content/program.json` as the program manifest;
- keep module metadata in `src/content/modules/<module>/module.json`;
- keep full unit runtime content in `src/content/modules/<module>/units/<unit>.json`;
- hydrate and validate the split files on the backend and in test-only loaders;
- keep pure ordering helpers in `src/content/order.ts` so rendered routes do not import Zod schemas;
- validate before build using `scripts/check-content-json.mjs`.

Stage 2 runtime policy:
- JSON files remain source-of-truth in the repo;
- the backend reads and validates the same split JSON graph;
- frontend rendered routes fetch program/module/unit/lesson data from `/api/**`;
- content API routes are read-only unless a later ADR introduces CMS/admin tooling.

## Backend/API boundary

Initial public content routes:

```txt
GET /api/health
GET /api/program
GET /api/modules
GET /api/modules/:moduleSlug
GET /api/units/:unitSlug
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

Auth, progress, and reflection answer policy:
- content routes may remain public;
- progress and reflection routes require a valid httpOnly cookie session;
- route handlers derive the user id from the session only;
- password hashes and session records are stored server-side in PostgreSQL;
- progress stores viewed/completed markers, not diagnostics/scoring/analytics;
- reflection answers store neutral answer fields for `reflection`/`artifact` cards only and never store scores, labels, inferred traits, recommendations, or analytics.

Persistence boundary:
- route handlers should call async repository functions instead of embedding SQL directly;
- repositories own PostgreSQL queries, connection/pool usage, and persistence-specific error mapping;
- API request/response contracts should not expose PostgreSQL implementation details;
- migrations should be deterministic and committed with the backend code;
- local development and CI should use isolated PostgreSQL schemas/databases rather than generated SQLite files.

## Deployment

Production deployment uses one same-origin Yandex Serverless Container. The Fastify backend serves `/api/**` and the built Vite SPA from `dist/`, so content, auth, progress, and reflection routes share one public origin with the learner frontend.

Runtime expectations:
- the backend must read `PORT` from the environment and bind to `0.0.0.0` so it can run in container platforms such as future Yandex Serverless Containers;
- PostgreSQL connection settings come from environment variables, with the deployed DB password supplied through GitHub secret `FINPULSE_DATABASE_PASSWORD`; the runtime also supports Lockbox payload lookup through `FINPULSE_DATABASE_PASSWORD_SECRET_ID` for non-VPC deployments;
- no database password, session secret, or connection string should be committed;
- Yandex Managed PostgreSQL is reachable through the deployed Serverless Container VPC network configuration; the DB security group allows the Serverless service subnet CIDR `198.19.0.0/16` on port `6432`;
- the backend applies the committed idempotent schema SQL on startup; introduce a versioned migration ledger before broad schema evolution.

Deploy resources, IAM, required GitHub secrets, smoke checks, rollback, and DB start handling are documented in `docs/operations/yandex-cloud-finpulse-deploy.md`.

## Error handling

The app should handle:
- missing route slug;
- missing module/lesson;
- malformed content in development;
- empty modules or lessons;
- unsupported content block type.

## Performance baseline

- mobile-first layout;
- route-level lazy loading once pages grow;
- avoid loading heavy media inline in JSON;
- keep large assets in `/public` or a proper asset pipeline;
- prefer semantic content blocks over raw HTML.

## Architecture change rule

Any change to the main stack or product boundary requires an entry in `docs/DECISIONS.md`.
