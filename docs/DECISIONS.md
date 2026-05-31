# Decisions / ADR Log

Keep this file append-only. Newer decisions may supersede older ones, but do not silently delete history.

## ADR-0001 — Use SPA/Vite for MVP

Status: Accepted

Decision: Start the MVP as a React + TypeScript SPA, preferably with Vite.

Reasoning:
- MVP is static educational content from JSON.
- There is no account system, backend, diagnostics, rewards, or analytics.
- SSR is not needed for the first useful product slice.
- Vite keeps the setup lighter and easier for agents to reason about.

Revisit when:
- SEO becomes a primary acquisition requirement;
- dynamic metadata becomes critical;
- backend-driven personalization appears;
- auth/user server state becomes central.

## ADR-0002 — JSON files are the initial data source

Status: Accepted

Decision: Educational content starts as JSON files in the repo.

Reasoning:
- easy to review in diffs;
- easy to validate;
- no backend dependency;
- agent-friendly;
- good fit for educational MVP.

## ADR-0003 — Tailwind + shadcn/ui

Status: Accepted

Decision: Use Tailwind CSS and shadcn/ui primitives for UI.

Reasoning:
- fast mobile-first implementation;
- components are copied into the project and remain editable;
- avoids premature custom design system complexity.

## ADR-0004 — Zustand is limited to client UI/application state

Status: Accepted

Decision: Use Zustand only for small cross-route client state.

Reasoning:
- content is data, not app state;
- most UI state can stay local;
- global stores should remain small and predictable.

## ADR-0005 — Evals are deferred until product flows exist

Status: Accepted

Decision: Do not fill eval tasks now.

Reasoning:
- the product does not exist yet;
- premature evals would encode guesses;
- evals should grow from real behavior, bugs, and critical flows.

Implementation:
- keep `evals/README.md` and empty folders;
- add evals only when a real route/component/user flow exists.

## ADR-0006 — Add a Stage 2 backend for learner state

Status: Accepted

Decision: Stage 2 introduces a small Fastify backend with SQLite persistence for learner identity, sessions, and progress while keeping the Vite SPA frontend.

This amends ADR-0001, ADR-0002, and ADR-0004 for Stage 2:
- ADR-0001 remains accepted: the frontend is still a Vite SPA, with no Next.js/SSR migration.
- ADR-0002 remains accepted: JSON files in the repo stay the canonical educational content source.
- ADR-0004 remains accepted: Zustand is still only for small client UI state; backend-owned learner state is fetched through API calls.

Why backend now:
- lesson/card progress needs to survive reloads and future devices;
- the app needs a stable boundary for later learner-owned state without putting the content corpus into client state;
- content can be served through one API contract while remaining validated JSON in the repository.

Why Fastify:
- small HTTP surface and TypeScript-friendly route handlers;
- simple local development model inside the existing Node/Vite project;
- enough plugin support for cookies/CORS without adding a larger framework.

Rejected for this stage:
- Next.js/SSR, because the frontend runtime does not need server rendering;
- Express, because Fastify gives a stricter request/response model with similar setup cost;
- external backend services, because MVP development must not depend on paid or hosted services;
- a CMS/admin panel, because JSON remains the source-of-truth.

Why SQLite:
- deterministic local persistence with a single file;
- low setup cost for tests and developer machines;
- enough for MVP learner state before production deployment decisions.

SQLite implementation:
- use deterministic SQL migrations committed under `server/db`;
- make the database path configurable for dev/test;
- do not commit generated database files;
- keep any future production database migration behind a new ADR if the deployment target requires it.

Backend-owned in Stage 2:
- learner user record with unique `login`;
- password hash, never plaintext password;
- httpOnly cookie session;
- lesson/card progress markers per learner;
- content API responses generated from validated JSON content.

Still local-only or deferred:
- full freeform reflection/artifact answers remain transient unless a later ADR accepts persistence;
- diagnostics, scoring, recommendations, analytics, rewards, admin/CMS, email flows, OAuth, password reset, and payments are deferred;
- progress is not diagnostics, scoring, or analytics.

Content policy:
- JSON files under `src/content/**` remain canonical;
- backend content routes read and validate the JSON graph;
- the content API is read-only in this stage;
- frontend runtime should consume rendered program/module/unit/lesson data through the backend API instead of importing content JSON directly.

Auth and session model:
- registration and login use `login` + `password`;
- passwords are hashed with a password hashing library;
- successful register/login creates a server-side session and sets an explicit httpOnly cookie;
- logout invalidates the session and clears the cookie;
- progress routes require a valid session;
- content routes may remain public;
- cookie options must be explicit for local dev, including `httpOnly`, `sameSite`, `secure`, `path`, and `maxAge`.

Initial API contract:

```txt
GET  /api/health

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

GET  /api/program
GET  /api/modules
GET  /api/modules/:moduleSlug
GET  /api/units/:unitSlug
GET  /api/lessons/:lessonSlug

GET  /api/progress
PUT  /api/progress/lessons/:lessonSlug
PUT  /api/progress/cards/:cardId
```

The first progress payload is intentionally small:
- lessons: viewed/completed markers keyed by lesson slug;
- cards: viewed/completed markers keyed by card id;
- no sensitive freeform answer persistence.

Security baseline:
- no plaintext passwords;
- no secrets committed;
- session cookies are httpOnly;
- protected routes must derive learner ownership from the session, not request body user ids;
- CORS/cookie behavior must be explicit for local development;
- rate limiting, CSRF hardening beyond same-site cookies, email verification, password reset, and production secret management are deferred until deployment scope is defined.

Revisit when:
- deployment target is selected;
- multiple environments need migration policy;
- persisted answers/artifacts become product scope;
- user cabinet/profile features are intentionally added;
- production security controls become required.

## ADR-0007 — Persist personal reflection and artifact answers

Status: Accepted

Decision: Persist filled `reflection` and `artifact` card answers for authenticated learners as a private personal artifact shown in the profile as "Мой финансовый ориентир" / "Мои ответы".

This supersedes the ADR-0006 deferred item about full freeform reflection/artifact answers, but only for this narrow scope:
- answers are owned by the current authenticated session user;
- routes derive `user_id` from the httpOnly cookie session only;
- answers are keyed by stable `card.id`, optional `saveKey`, and lesson/module/unit context for display;
- anonymous learners may still complete cards with transient local state, but their answers are not persisted;
- completion of interactive `reflection`/`artifact` cards may require a meaningful non-empty answer or selection before the card is marked completed.

API contract:

```txt
GET /api/reflections
PUT /api/reflections/:cardId
```

Payload fields are neutral answer fields only:
- `textValue`
- `singleValue`
- `multiValues`
- `selectedVariant`
- `checkedRows`
- `templateValues`
- `fallbackValue`

Explicitly out of scope:
- checking open answers as right or wrong;
- diagnostics, scoring, labels, levels, recommendations, analytics, or inferred user traits;
- public access to answers;
- backend/admin tooling for editing content;
- storing answers for anonymous users.

Data lifecycle:
- the learner fills a persistable card;
- the frontend saves the answer for the current authenticated user before marking the card complete;
- repeated saves update the same `(user_id, card_id)` row;
- the profile fetches the learner's own answers and groups them for display by existing content context;
- deleting users later should cascade personal answers with other learner-owned state.

Security baseline:
- the API never accepts `userId` from the body;
- only `reflection` and `artifact` cards are persistable;
- persisted data must not include score, result labels, inferred categories, or recommendations.

Revisit when:
- users need export/delete controls for personal answers;
- explicit per-card answer categories are needed in content JSON;
- artifact templates need a richer structured model;
- production privacy controls are defined.

## ADR-0008 — Migrate learner persistence to PostgreSQL

Status: Accepted

Decision: Migrate backend persistence for learner-owned state from SQLite/`better-sqlite3` to PostgreSQL behind an async repository boundary, while preserving the existing Fastify API contracts and keeping JSON files as the canonical educational content source.

This supersedes the SQLite persistence parts of ADR-0006 only. The following decisions remain unchanged:
- the frontend remains a Vite React SPA, with no Next.js/SSR migration;
- content routes remain read-only API responses hydrated from validated JSON files in the repo;
- JSON under `src/content/**` remains the educational content source-of-truth;
- Zustand remains limited to small client UI state;
- learner-owned backend state is limited to simple auth/session data, viewed/completed progress markers, and private reflection/artifact answers accepted by ADR-0007.

Rationale:
- PostgreSQL is a closer fit for future production deployment than a local SQLite file, especially when the app runs in containers with ephemeral filesystems;
- async database access matches Fastify route handlers and avoids blocking the Node event loop on persistence calls;
- a repository boundary keeps SQL and pooling details out of auth, progress, and reflection route contracts;
- using PostgreSQL now reduces later migration risk before the learner-owned state model grows;
- the migration does not require changing frontend API clients or expanding product scope.

Deployment implications:
- no Yandex Cloud resources are provisioned in this stage: no Managed PostgreSQL cluster, Container Registry setup, Terraform, networking, or production deployment changes are part of this ADR;
- the runtime should be compatible with future Yandex Managed PostgreSQL by using standard PostgreSQL connection settings and migrations rather than SQLite file paths;
- the backend should remain compatible with future Yandex Serverless Containers by binding to `0.0.0.0` and reading `PORT` from the environment;
- secrets and connection strings must be injected through environment variables in deployment, not committed to the repo;
- avoid splitting frontend and API across different domains unless cookie, CORS, `sameSite`, and `secure` behavior are intentionally designed and tested.

Implementation stance:
- replace `better-sqlite3` usage with an async PostgreSQL client/pool;
- keep the current API route shapes and response semantics stable;
- keep route handlers deriving ownership from the httpOnly session, never request body user ids;
- store only current MVP learner state: users, sessions, progress markers, and private reflection/artifact answer fields;
- do not introduce accounts/profile management beyond the current minimal learner profile, diagnostics, rewards, analytics dashboards, admin/CMS, personalized recommendations, payments, or production financial operations.

Rollback/fallback stance:
- after migration, PostgreSQL is the only supported runtime persistence backend;
- do not add a temporary dual-write path or automatic SQLite fallback unless a later explicit task requests it;
- rollback means reverting the PostgreSQL implementation to the last known good SQLite implementation and restoring data from an intentional backup/export, not silently switching storage at runtime;
- migration scripts should be deterministic and safe to rerun where practical.

Test strategy:
- run focused backend integration tests against an isolated PostgreSQL database;
- cover migrations, session creation/lookup/deletion, user registration/login, progress upsert/fetch, reflection answer upsert/fetch, and ownership isolation;
- keep shared API contract tests passing so frontend routes do not depend on the persistence engine;
- keep content validation in the verification path because JSON remains canonical;
- keep production build/typecheck/lint in the standard verification path.

Risks:
- local development and CI now need PostgreSQL availability instead of only a local file;
- async repository migration can introduce missed `await`s, transaction mistakes, or changed error handling;
- connection pool sizing and cold-start behavior must be tuned later for serverless/container deployment;
- data migration from any existing SQLite development database is not automated by this ADR;
- cross-domain deployment without deliberate CORS/cookie design could break session auth.

Revisit when:
- a real production deployment target and environment topology are selected;
- Yandex Managed PostgreSQL or Serverless Containers are provisioned;
- production secrets, backups, observability, rate limiting, and retention policies are defined;
- a managed content workflow, admin panel, or CMS is intentionally added by a separate ADR.
