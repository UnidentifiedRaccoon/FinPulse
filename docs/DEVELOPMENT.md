# Development Setup

## Initial app scaffold

Recommended app scaffold:

```bash
npm create vite@latest finpulse -- --template react-ts
cd finpulse
npm install
```

Then add expected MVP dependencies:

```bash
npm install react-router zod
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Tailwind and shadcn/ui should be installed according to their current Vite documentation.

## Recommended package scripts

Add or adapt these scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test:run": "vitest run",
    "test:watch": "vitest",
    "check:content": "node scripts/check-content-json.mjs",
    "check:runtime-imports": "node scripts/check-runtime-content-imports.mjs",
    "build:storybook": "storybook build -o dist/storybook --disable-telemetry",
    "verify": "bash ./scripts/verify.sh"
  }
}
```

If the scaffold uses a different TypeScript build mode, keep the project-native command but ensure `npm run verify` remains the single verification entry point.

## Verification command

Agents should run:

```bash
./scripts/verify.sh
```

or:

```bash
npm run verify
```

`npm run verify` runs backend tests as part of the normal Vitest suite. PostgreSQL-backed tests must have a reachable database; CI must provide PostgreSQL instead of skipping those tests.

## Production build artifact

The production artifact is a same-origin container: Fastify serves `/api/**` and the built Vite SPA.

```bash
npm run build:container
npm run start
```

`npm run build:container` builds the Vite client into `dist/` and the server bundle into `dist-server/`. `npm run start` expects PostgreSQL env vars and, when static serving is needed, `FINPULSE_STATIC_ROOT` pointing at the Vite `dist` directory.

The Dockerfile mirrors this flow and sets `FINPULSE_API_HOST=0.0.0.0` and `FINPULSE_STATIC_ROOT=/app/dist` for Yandex Serverless Containers. The platform supplies `PORT`.

## Local backend database

The Stage 2 backend uses PostgreSQL for learner identity, sessions, progress, and private reflection/artifact answers. JSON files remain the source-of-truth for educational content.

For local development, start PostgreSQL before running backend tests or `npm run dev`. A simple Docker container is enough:

```bash
docker run --name finpulse-postgres \
  -e POSTGRES_DB=finpulse \
  -e POSTGRES_USER=finpulse \
  -e POSTGRES_PASSWORD=finpulse \
  -p 5432:5432 \
  -d postgres:16
```

Outside `NODE_ENV=production`, the server defaults to the same local URL shown below. Set the database URL in the shell or `.env` when local values differ:

```bash
FINPULSE_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse
DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse
```

Use `FINPULSE_TEST_DATABASE_URL` when tests should target a separate database:

```bash
FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test
```

Copy `.env.example` to `.env` only when local values need to change. Local API defaults still use `FINPULSE_API_HOST=127.0.0.1` and `FINPULSE_API_PORT=3001`. For production containers, bind the API to `0.0.0.0` with `FINPULSE_API_HOST=0.0.0.0`; container platforms commonly provide `PORT`, so keep `PORT` available as the external listen port override.

When `FINPULSE_CORS_ORIGIN` is empty, the local API allows loopback browser origins such as `http://localhost:5173` and `http://127.0.0.1:5174`. Set it to a comma-separated exact origin list when you need to restrict or override local defaults.

Yandex Cloud production deployment resources are documented in `docs/operations/yandex-cloud-finpulse-deploy.md`. Use a local PostgreSQL instance for development and the GitHub Actions PostgreSQL service for CI.

## Git and PR workflow

Branch, commit, push, and Pull Request rules live in `docs/engineering/contributing.md`.

Any agent asked to publish work must read that file before creating a branch, committing, pushing, or opening a PR. PR descriptions should use the structure from that guide and include the verification commands that were actually run.

## Dependency policy

Allowed without special approval for MVP:
- React Router;
- Zustand;
- zod or another small runtime validator;
- Tailwind CSS;
- shadcn/ui dependencies;
- Vitest and Testing Library.

Requires explicit approval:
- Next.js migration;
- backend frameworks;
- analytics SDKs;
- auth providers;
- payment libraries;
- remote CMS SDKs;
- large UI frameworks that overlap with shadcn/ui.

## Common task types

- Add route/page.
- Add content block renderer.
- Add content schema validation.
- Add shadcn/ui component.
- Add mobile layout improvement.
- Add component test.
- Split content file when it grows.

Each task should be small enough that another agent can review it from the diff.
