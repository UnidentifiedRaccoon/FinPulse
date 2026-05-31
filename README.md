# FinPulse

Mobile-first content reader for the FinPulse educational MVP.

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS v4
- shadcn/ui
- Fastify API
- PostgreSQL persistence
- Vitest + Testing Library
- JSON content source

## Scripts

```bash
npm run dev
npm run dev:server
npm run dev:web
npm run verify
```

`npm run dev` starts both the Fastify API and Vite frontend. The frontend proxies `/api` to `http://127.0.0.1:3001`.

`npm run verify` runs content validation, typecheck, lint, tests, and production build through `scripts/verify.sh`.

Production packaging is single-container:

```bash
npm run build:container
npm run start
```

`npm run start` runs the compiled Fastify server from `dist-server/`. In production, set `FINPULSE_STATIC_ROOT=/app/dist` or another built Vite `dist` path so Fastify serves the SPA and API from the same origin.

## Local backend

Copy `.env.example` to `.env` only when local values need to change. Outside `NODE_ENV=production`, the backend defaults to the local PostgreSQL URL shown here:

```bash
FINPULSE_API_HOST=127.0.0.1
FINPULSE_API_PORT=3001
PORT=3001
FINPULSE_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse
FINPULSE_CORS_ORIGIN=
FINPULSE_COOKIE_SECURE=false
```

When `FINPULSE_CORS_ORIGIN` is empty, the local API allows loopback browser origins such as
`http://localhost:5173` and `http://127.0.0.1:5174`. Set it to a comma-separated exact origin
list when you need to restrict or override local defaults.

PostgreSQL must be reachable before starting the backend or running backend tests. The backend creates the schema on startup from `server/db/schema.sql`; CI provides PostgreSQL through the verify workflow service.

Production deployment to Yandex Cloud is documented in `docs/operations/yandex-cloud-finpulse-deploy.md`.

## MVP boundary

FinPulse starts as a reader for educational program content. ADR-0006 allows a narrow Stage 2 backend for learner login, httpOnly sessions, content API delivery, and viewed/completed progress markers. ADR-0007 allows private persisted reflection/artifact answers for authenticated learners only. Full user cabinets, diagnostics, rewards, analytics, CMS, payments, production financial operations, recommendations, and SSR remain outside scope until a separate decision says otherwise.
