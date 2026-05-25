#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f package.json ]; then
  echo "[verify] package.json not found; app scaffold is not created yet."
  echo "[verify] Running standalone content validation only."
  node scripts/check-content-json.mjs
  exit 0
fi

echo "[verify] npm version: $(npm --version)"

echo "[verify] content validation"
npm run check:content --if-present

echo "[verify] typecheck"
npm run typecheck --if-present

echo "[verify] lint"
npm run lint --if-present

echo "[verify] tests"
npm run test:run --if-present

echo "[verify] build"
npm run build --if-present

echo "[verify] done"
