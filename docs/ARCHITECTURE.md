# Architecture — FinPulse Learning MVP

## Decision summary

Use a Vite React + TypeScript SPA for the frontend. Starting in Stage 2, add a small Fastify + SQLite backend for learner identity, session-backed progress, and read-only content API delivery.

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
State:          Zustand for small client-side cross-route state
Data:           JSON files, validated by script/schema
Styling:        Tailwind CSS
UI primitives:  shadcn/ui
Tests:          Vitest + Testing Library when components stabilize
```

## Recommended backend stack

```txt
HTTP server:    Fastify
Persistence:    SQLite
Auth:           login/password with hashed passwords
Sessions:       server-side session id in httpOnly cookie
Content API:    read-only responses hydrated from validated JSON files
Tests:          Vitest integration tests against isolated SQLite files
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
  entities/
    content/
      model.ts
      loadProgram.ts
      selectors.ts
  shared/
    ui/
    lib/
    config/
  stores/
    useReaderStore.ts
  content/
    program.json
  styles/
    globals.css
server/
  app.ts
  index.ts
  db/
    connection.ts
    migrate.ts
    schema.sql
  modules/
    auth/
    content/
    progress/
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
  -> optional small Zustand store for reader UI state only
```

```txt
Learner interaction
  -> frontend event handler
  -> authenticated progress API
  -> SQLite progress row owned by current session user
  -> frontend progress refresh or optimistic local UI update
```

## State policy

Use local React state for:
- expanded/collapsed UI sections;
- form-like transient UI;
- small one-component interactions.

Use Zustand for:
- current reader preferences;
- last opened lesson, if local-only;
- navigation drawer state shared across routes;
- small non-sensitive UI preferences.

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
- hydrate the split files through the shared content loader;
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

Initial auth/progress routes:

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/progress
PUT  /api/progress/lessons/:lessonSlug
PUT  /api/progress/cards/:cardId
```

Auth and progress policy:
- content routes may remain public;
- progress routes require a valid httpOnly cookie session;
- route handlers derive the user id from the session only;
- password hashes and session records are stored server-side;
- progress stores viewed/completed markers, not diagnostics/scoring/analytics.

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
