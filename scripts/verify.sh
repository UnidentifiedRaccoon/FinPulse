#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

MODE="full"
if [ "${1:-}" = "--fast" ]; then
  MODE="fast"
  shift
fi

if [ "$#" -ne 0 ]; then
  echo "Usage: ./scripts/verify.sh [--fast]" >&2
  exit 2
fi

if [ ! -f package.json ]; then
  echo "[verify] package.json not found; running standalone guards."
  node scripts/check-harness.mjs
  node scripts/check-content-json.mjs
  exit 0
fi

echo "[verify] mode: $MODE"
echo "[verify] npm: $(npm --version)"

echo "[verify] harness integrity"
npm run check:harness --if-present

echo "[verify] harness tests"
npm run test:harness --if-present

preflight_database() {
  local database_url="${FINPULSE_TEST_DATABASE_URL:-}"
  local source="FINPULSE_TEST_DATABASE_URL"

  if [ -z "$database_url" ] && [ -n "${FINPULSE_DATABASE_URL:-}" ]; then
    database_url="$FINPULSE_DATABASE_URL"
    source="FINPULSE_DATABASE_URL"
  fi
  if [ -z "$database_url" ] && [ -n "${DATABASE_URL:-}" ]; then
    database_url="$DATABASE_URL"
    source="DATABASE_URL"
  fi
  if [ -z "$database_url" ]; then
    database_url="postgres://finpulse:finpulse@127.0.0.1:5432/finpulse"
    source="local development fallback"
  fi

  if ! DATABASE_PREFLIGHT_URL="$database_url" DATABASE_PREFLIGHT_SOURCE="$source" \
    node --input-type=module <<'NODE'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_PREFLIGHT_URL
const source = process.env.DATABASE_PREFLIGHT_SOURCE
const parsed = new URL(databaseUrl)
const loopback = new Set(['127.0.0.1', 'localhost', '::1']).has(parsed.hostname)

if (
  source !== 'FINPULSE_TEST_DATABASE_URL' &&
  !loopback &&
  process.env.FINPULSE_ALLOW_REMOTE_TEST_DATABASE !== 'true'
) {
  throw new Error(
    `${source} points to a remote database. Set FINPULSE_TEST_DATABASE_URL to an isolated test database, ` +
      'or explicitly set FINPULSE_ALLOW_REMOTE_TEST_DATABASE=true.',
  )
}

const client = new pg.Client({ connectionString: databaseUrl, connectionTimeoutMillis: 2500 })
try {
  await client.connect()
  await client.query('SELECT 1')
} catch (error) {
  const detail = error?.code ? `${error.code}: ${error.message}` : String(error)
  console.error(`[verify] database connection failed (${detail})`)
  process.exitCode = 1
} finally {
  await client.end().catch(() => undefined)
}
NODE
  then
    echo "[verify] full verification needs a reachable isolated PostgreSQL test database." >&2
    echo "[verify] Set FINPULSE_TEST_DATABASE_URL, or start the documented local finpulse database." >&2
    exit 2
  fi

  export FINPULSE_TEST_DATABASE_URL="$database_url"
  echo "[verify] database preflight passed via $source"
}

if [ "$MODE" = "full" ]; then
  echo "[verify] database preflight"
  preflight_database
fi

echo "[verify] content validation"
npm run check:content --if-present

echo "[verify] runtime content import guard"
npm run check:runtime-imports --if-present

echo "[verify] typecheck"
npm run typecheck --if-present

echo "[verify] lint"
npm run lint --if-present

if [ "$MODE" = "fast" ]; then
  echo "[verify] non-DB tests"
  npm run test:run --if-present -- \
    --exclude server/app.test.ts \
    --exclude server/content-contract.test.ts
  echo "[verify] FAST PASS (iteration gate only; release builds and DB integration tests were skipped)"
  exit 0
fi

echo "[verify] full tests"
npm run test:run --if-present

echo "[verify] web and admin builds"
npm run build --if-present

echo "[verify] server build"
npm run build:server --if-present

echo "[verify] Storybook build"
npm run build:storybook --if-present

echo "[verify] FULL PASS"
