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

## ADR-0009 — Add objective practice card types

Status: Accepted

Decision: Add two runtime card types for objective practice screens in methodology-authored lessons:
- `multi_select` for marking several correct options among incorrect distractors;
- `categorization` for assigning known items to known categories.

Rationale:
- Methodologist scripts use practice screens that ask learners to act on several options, not only choose one pre-grouped answer.
- Compressing sorting and checkbox tasks into `single_choice` preserves facts but weakens the intended practice.
- Mobile-first radio/checkbox controls are more accessible and stable for the MVP than drag-and-drop.

Scope:
- These cards are checked locally in the lesson reader and can show supportive feedback before the learner continues.
- Existing viewed/completed progress markers still apply by `card.id`.
- Selected answers are not persisted through `/api/reflections`.
- `reflection` and `artifact` remain the only persistable personal-answer card types accepted by ADR-0007.

Out of scope:
- scores, diagnostics, labels, levels, inferred traits, analytics, or recommendations;
- blocking the learner until the answer is correct;
- drag-and-drop sorting, matching, calculators, branching dialogues, or expense-diary schemas.

Validation:
- `multi_select` requires at least one correct and one incorrect option.
- `categorization` requires at least two categories, at least two items, unique ids, and item `correctCategoryId` values that match category ids.

Revisit when:
- richer practice interactions are needed beyond category assignment and multiple-correct selection;
- answer attempts need to be persisted for a deliberately scoped product reason;
- accessibility testing supports a drag-and-drop implementation that does not degrade mobile or keyboard use.

## ADR-0010 — Add a separate Next.js internal admin surface

Status: Accepted

Decision: Add the first curator-facing admin board as a separate internal Next.js app under `apps/admin`, while keeping the learner application as the existing Vite React SPA.

This amends the earlier MVP rule that admin panels and Next.js/SSR are out of scope only for the learner application. The learner app remains:
- Vite React SPA;
- mobile-first;
- backed by the existing Fastify + PostgreSQL API;
- served from the current same-origin production container;
- based on the approved educational hierarchy `Program -> Level -> Section -> Lesson -> Card`.

The new admin surface is not a migration path for the learner app and must not reintroduce the old `Module -> Unit` architecture.

Rationale:
- curators need a private read-only view of learner progress before a full organization/RBAC model exists;
- progress is already stored in PostgreSQL, so the first admin board can be a read model over existing learner-owned state;
- Next.js is useful for the internal admin surface because it can evolve separately from the learner SPA and later support internal deployment/routing choices without changing learner routes;
- keeping admin in `apps/admin` makes the boundary explicit and avoids mixing curator screens into the learner bundle.

Initial scope:
- local development surface only;
- one configured admin user;
- admin login separate from learner login;
- read-only curator board;
- user list with login/email visibility;
- aggregate progress counts and per-user lesson/card progress summaries;
- detail view with lesson viewed/completed statuses and timestamps;
- no reflection/artifact answer text in default admin responses or UI.

Initial admin auth:
- admin credentials are configured through environment variables and must not be committed;
- successful admin login creates a separate httpOnly admin session cookie;
- admin routes and learner routes use separate cookies and route prefixes;
- admin API routes live under `/api/admin/**` and must not be exposed through public learner API routes;
- this first stage does not implement organizations, roles, permissions, invitations, or seat management.

Admin read model:
- backend-owned Fastify endpoints expose curator data from PostgreSQL;
- route handlers must authenticate the admin session before reading any learner progress;
- responses may include learner `id`, `login`, and `createdAt`;
- responses may include aggregate progress fields, lesson/card timestamps, current lesson, last activity, and derived `stuckDays`;
- responses must not include `reflection_answers.answer_json`, prompt answer text, or other private answer payloads by default.

Future compatibility:
- read model and API contracts may include explicit placeholders/notes for organization filtering and curator access, but organization filtering is not active in this stage;
- future multi-tenant/RBAC work must add a new ADR before exposing organization-scoped production access;
- deployment beyond local development is deferred. The likely future target is a Yandex-hosted internal admin deployment, but exact domain/path, cookie topology, and access controls remain TBD.

Out of scope:
- organizations and RBAC;
- answer-text review;
- analytics dashboards;
- content editing/CMS;
- learner-app migration to Next.js;
- production financial operations or personalized recommendations.

Risks:
- cross-origin local development can break cookies if the admin app and API use different hostnames; local setup should use consistent `localhost` origins or an intentional proxy;
- env-configured single-admin auth is deliberately limited and must be replaced or extended before broader curator access;
- a global all-users board is acceptable only before organization-scoped access exists.

Revisit when:
- organizations, roles, or curator access policies are introduced;
- production deployment topology for admin is selected;
- answer review becomes an explicit product requirement;
- admin writes or CMS capabilities are requested.

## ADR-0011 — Deploy internal admin as a separate Yandex container

Status: Accepted

Decision: Deploy the Next.js admin surface as a separate Yandex Serverless Container, while keeping the learner application and Fastify API in the existing production container.

This supersedes only the ADR-0010 note that admin deployment beyond local development was deferred. The learner app remains a Vite SPA served by the existing Fastify container and is not migrated to Next.js.

Production topology:
- learner/backend container: serves the Vite learner app, `/api/**`, and the protected `/api/admin/**` backend read model;
- admin container: serves the `apps/admin` Next.js app only;
- admin browser requests use the admin container origin;
- the admin Next.js app rewrites `/api/**` server-side to the production backend origin through `FINPULSE_ADMIN_API_BASE_URL`;
- the backend sets the `finpulse_admin_session` httpOnly cookie through the proxied admin origin, so admin browser sessions stay same-origin with the admin app.

Rationale:
- keeps the learner deployment artifact stable and avoids mixing Next.js server/runtime concerns into the learner container;
- avoids exposing `/admin` routes from the learner SPA;
- lets the admin app evolve, scale, and be restricted independently from the learner site;
- uses the existing backend admin API and PostgreSQL read model without adding a second data access path.

Production admin auth:
- the backend production container must receive `FINPULSE_ADMIN_LOGIN`, `FINPULSE_ADMIN_PASSWORD_HASH`, and `FINPULSE_ADMIN_SESSION_SECRET` as secrets;
- the admin container must receive `FINPULSE_ADMIN_API_BASE_URL` pointing at the production backend origin;
- the first production stage still has one env-configured admin user only;
- learner sessions do not authorize admin API routes, and admin sessions do not authorize learner-owned progress/reflection routes.

Deployment contract:
- `Dockerfile.admin` builds and runs only the Next.js admin app;
- `.github/workflows/deploy.yml` deploys the learner/backend container and smoke-tests that `/api/admin/auth/me` returns `401 admin_unauthenticated` rather than `503 admin_not_configured`;
- `.github/workflows/deploy-admin.yml` is a manual workflow for the separate admin container and smoke-tests the admin frontend, API proxy health, and admin auth boundary;
- Yandex resource ids for the admin container are environment-specific repository variables, not hard-coded until the resource exists.

Out of scope:
- creating organizations, roles, permissions, invitations, or seat management;
- exposing reflection/artifact answer text;
- analytics dashboards;
- content editing/CMS;
- deploying admin as a route inside the learner SPA;
- replacing the env-configured single admin with a full user-management model.

Risks:
- the admin container cannot work until the separate Yandex Serverless Container exists and GitHub variables/secrets are configured;
- the admin API base URL is part of the Next.js build/deploy configuration, so retargeting environments requires rebuilding or redeploying the admin image;
- this is still a global all-users board and must not be opened to broader curator access before organization/RBAC work lands.

Revisit when:
- organizations/RBAC are introduced;
- admin needs a custom domain, private network-only access, or IP allowlisting;
- more than one admin user is required;
- admin writes, answer review, or CMS capabilities are requested.

## ADR-0012 — PostgreSQL JSONB runtime content and internal editor

Status: Accepted

Decision: Use PostgreSQL JSONB documents as the runtime source for published educational content, with document granularity split by program, level, section, and lesson. Keep the current `src/content/**` split JSON files only as seed fixtures and migration input for the MVP.

This supersedes only the content-source parts of ADR-0002, ADR-0006, ADR-0008, ADR-0010, and ADR-0011:
- the learner frontend remains a Vite React SPA;
- the internal admin remains the separate Next.js app from ADR-0010/ADR-0011;
- PostgreSQL remains the single backend persistence engine;
- the approved hierarchy stays `Program -> Level -> Section -> Lesson -> Card`;
- public learner content API route shapes stay unchanged.

Runtime storage:
- `content_programs(slug, payload jsonb, revision, updated_at)` stores program metadata and ordered level refs;
- `content_levels(slug, payload jsonb, revision, updated_at)` stores level metadata and ordered section refs;
- `content_sections(level_slug, section_slug, payload jsonb, revision, updated_at)` stores section metadata and ordered lesson refs;
- `content_lessons(level_slug, section_slug, lesson_slug, payload jsonb, revision, updated_at)` stores one full lesson JSON document per lesson.

Admin editing scope:
- add `/content` to the internal admin app;
- expose an authenticated content tree, preview, and slice update API under `/api/admin/content/**`;
- let the methodologist edit only the selected level, section, or lesson-card slice shown in preview;
- save by replacing the full containing JSONB document after server-side validation;
- increment the document `revision` on each successful save;
- return `409 content_revision_conflict` when the submitted revision is stale;
- the learner API reads updated content immediately from the database without redeploy.

Guardrails:
- v1 permits edits to text fields and arrays of text variants only;
- structural fields are protected, including `id`, `slug`, `type`, `order`, `card.id`, `sourceSection`, `checkability`, and answer-checking keys such as correct option/category ids;
- all saves hydrate the full content graph and validate it with the existing content model before publishing;
- if content is missing from PostgreSQL, the backend treats it as configuration failure instead of silently falling back to file JSON after startup seeding.

Seeding and local development:
- `npm run content:seed` loads current `src/content/**` fixtures into the content tables;
- the backend may seed empty content tables from bundled fixtures on startup to make first rollout and fresh local schemas work;
- `npm run check:content` validates file fixtures;
- `npm run check:content:db` validates the database-backed graph;
- `npm run content:pull` exports current DB content to `tmp/content-db-export` for local inspection or manual sync.

Out of scope for this MVP step:
- audit log, rollback versions, draft/published pointers, GitHub PR flow, locks, scheduled publication, multi-admin collaboration, organizations/RBAC, analytics dashboards, diagnostics, rewards, recommendations, and production financial operations.

Risks:
- content text diffs move out of Git history after publication through admin;
- direct production edits rely on server-side validation and revision conflicts rather than editorial branch review;
- backend instances cache the content graph in memory and refresh it after admin writes in the same process; externally edited DB content may require process restart or a later cache invalidation mechanism.

Revisit when:
- more than one content editor works concurrently;
- editorial review, rollback, audit, or release trains become important;
- content volume grows enough that lesson-level JSONB documents become too coarse;
- production operations require a DB export/import workflow with approvals.
