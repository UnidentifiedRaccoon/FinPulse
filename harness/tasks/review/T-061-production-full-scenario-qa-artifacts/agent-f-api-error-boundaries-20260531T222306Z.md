# Agent F API / Error States / Data Boundaries QA

- Production: https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net
- Timestamp UTC: 20260531T222306Z
- QA users: qa.agentf.20260531T222306Z.a@example.com, qa.agentf.20260531T222306Z.b@example.com
- Cookie jars: temporary only, deleted after run; not captured in evidence.
- Result counts: BLOCKED=11, PASS=42

## Non-pass Rows

- [BLOCKED] ENTRY-06 — blocked: production-unsafe: slow auth/me requires network throttling or server delay injection
- [BLOCKED] ENTRY-07 — blocked: production-unsafe: auth/me 500 requires server failure injection
- [BLOCKED] PROGRAM-04 — blocked: production-unsafe: program API failure requires server failure injection
- [BLOCKED] PROGRAM-05 — blocked: production-unsafe: empty modules requires production fixture/content mutation
- [BLOCKED] PATH-13 — blocked: production-unsafe: module success + program transition failure requires selective server failure injection
- [BLOCKED] LESSON-08 — blocked: production-unsafe: slow lesson API requires throttling/server delay injection
- [BLOCKED] LESSON-09 — blocked: production-unsafe: lesson API 500/offline requires server failure injection
- [BLOCKED] LESSON-12 — blocked: production-unsafe: zero-card lesson requires production fixture/content mutation
- [BLOCKED] PROGRESS-11 — blocked: production-unsafe: temporary progress API offline requires server/DB failure injection
- [BLOCKED] API-09 — blocked: production-unsafe: malformed server payload requires test harness/mocked backend response
- [BLOCKED] API-10 — blocked: production-unsafe: DB/API restart during session requires production restart/failure injection

## Representative curl Snippets

```bash
BASE=https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net
curl -sS "$BASE/api/program" | jq "{modules:(.modules|length)}"
curl -sS -X PUT -b "$COOKIE_JAR" -c "$COOKIE_JAR" -H "Content-Type: application/json" --data "{\"viewed\":true,\"completed\":true}" "$BASE/api/progress/lessons/why-values-matter"
curl -sS -X PUT -b "$COOKIE_JAR" -c "$COOKIE_JAR" -H "Content-Type: application/json" --data "{\"textValue\":\"qa\"}" "$BASE/api/reflections/card_04_03_reflection_event"
curl -sS -X OPTIONS -H "Origin: http://127.0.0.1:5174" -H "Access-Control-Request-Method: PUT" -H "Access-Control-Request-Headers: content-type" -D - -o /dev/null "$BASE/api/progress/lessons/why-values-matter"
```
