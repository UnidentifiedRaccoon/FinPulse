# FinPulse

Mobile-first content reader for the FinPulse educational MVP.

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS v4
- shadcn/ui
- Fastify API
- SQLite persistence
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

## Local backend

Copy `.env.example` to `.env` only when local values need to change. Defaults:

```bash
FINPULSE_API_HOST=127.0.0.1
FINPULSE_API_PORT=3001
FINPULSE_DB_PATH=data/finpulse.sqlite
FINPULSE_CORS_ORIGIN=http://localhost:5173
FINPULSE_COOKIE_SECURE=false
```

SQLite files under `data/` are local runtime state and are ignored by git. The backend creates the schema on startup from `server/db/schema.sql`.

## MVP boundary

FinPulse starts as a reader for educational program content. ADR-0006 allows a narrow Stage 2 backend for learner login, httpOnly sessions, content API delivery, and viewed/completed progress markers. Full user cabinets, diagnostics, rewards, analytics, CMS, payments, production financial operations, persisted freeform answers, and SSR remain outside scope until a separate decision says otherwise.
