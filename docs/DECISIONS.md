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
