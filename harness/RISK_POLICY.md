# Risk Policy

FinPulse is an educational product with production backend, authentication,
private learner artifacts, internal admin access, direct content publishing,
and deployment automation. Treat changes according to the boundary they touch,
not as a static-site-only project.

## High-risk boundaries

Require explicit task scope, canonical-doc review, focused tests, and full
verification before release:

- auth, sessions, cookies, password handling, or admin authorization;
- reflection/artifact privacy or any response that could expose answer text;
- PostgreSQL schema, migrations, destructive queries, or content publication;
- API contract or validation changes affecting persisted/public data;
- production deploy, secrets, IAM, network, or container configuration;
- product/legal/financial-safety boundaries;
- changes that add external data transfer, telemetry, or paid services.

Production writes/deploys and new external services additionally require clear
user authorization. Never infer permission from a local implementation request.

## Medium-risk changes

Require a bounded task, focused regression coverage, and at least
`npm run verify:fast`; use full verification when shared runtime behavior is
affected:

- learner/admin UI flows;
- API-backed content loading and progress behavior;
- content schema/validator or seed fixture changes;
- shared components, routing, package/config, and build tooling;
- methodology/content edits containing current facts or safety claims.

Use the relevant project skill and source review for educational content.

## Low-risk changes

Usually need `npm run check:harness` or the relevant focused check plus
`git diff --check`:

- scoped documentation and harness wording;
- read-only audits;
- isolated tests that do not alter runtime behavior;
- non-destructive local scripts without external side effects.

Escalate if a low-risk diff crosses a high-risk boundary.

## Always prohibited

- Commit secrets, `.env` files, production tokens, password hashes tied to real
  credentials, private learner answers, or real customer data.
- Use production databases for tests or local content seeding.
- Expose private answer text through admin summaries, logs, analytics, or
  diagnostics.
- Add scoring, inferred traits, personalized financial recommendations, or
  production financial actions under the current MVP scope.
- Force-push, broadly delete/reset user work, or bypass branch protection.
- Deploy, publish content, mutate cloud resources, or send external messages
  without authorization for that action.

## Command policy

Read-only inspection, local builds/tests, and non-destructive scripts are
allowed within task scope. Prefer the documented verification commands.

Stop and request direction before a destructive operation, production mutation,
new paid/external dependency, material privacy expansion, or architecture/scope
change not already authorized by the task.
