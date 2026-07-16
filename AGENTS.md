# AGENTS.md — FinPulse Learning MVP

This is the short operating map for human and AI contributors. Durable product
and engineering knowledge belongs in `docs/`; current coordination belongs in
`harness/`; detailed history belongs in task packets, not in summary files.

## Current product boundary

FinPulse is a mobile-first educational web app.

Accepted architecture:

- educational hierarchy: Program -> Level -> Section -> Lesson -> Card;
- React + TypeScript learner SPA built with Vite;
- Fastify API with PostgreSQL for published JSONB content, learner sessions,
  progress, and private reflection/artifact answers;
- repository JSON under `src/content/**` as validated seed/migration fixtures;
- source lesson Markdown as authoring provenance synchronized with approved
  runtime content;
- separate internal Next.js app under `apps/admin` for the accepted progress
  board and guarded content editor;
- Tailwind CSS + shadcn/ui; React state first and Zustand only for justified
  small cross-route client state.

Runtime code, payloads, routes, persistence, and new docs use Level and Section
directly. Do not reintroduce Program -> Module -> Unit as current architecture.

Still out of scope unless a new decision explicitly accepts it:

- broad learner account/profile management beyond current login, progress, and
  private saved-answer artifact;
- diagnostics, scoring, rewards, streaks, or gamification;
- analytics/HR dashboards, organizations, RBAC, or answer-text review;
- broad CMS workflows beyond the accepted guarded internal editor;
- payments, production financial operations, or personalized recommendations;
- migration of the learner app to Next.js/SSR.

## Model policy

Default for all agentic project work is GPT-5.5 with reasoning effort `xhigh`.
Do not downgrade unless the user explicitly asks.

## Context routing

Before any file change, read:

1. `AGENTS.md`;
2. `harness/PROJECT_STATE.md`;
3. the claimed task packet, or create one for non-trivial work.

Load additional context only when the task needs it:

| Task touches | Read before editing |
|---|---|
| product scope, routes, app/backend architecture | `docs/PRODUCT.md`, `docs/ARCHITECTURE.md` |
| JSON/content model or seed fixtures | `docs/CONTENT_MODEL.md` |
| methodology or educational content | `docs/methodology/METHODOLOGY.md`, `docs/methodology/AUTHORING.md` |
| parallel orchestration/shared files | `harness/WORKBOARD.md`, `harness/PARALLEL_AGENT_PROTOCOL.md` |
| privacy, auth, content publishing, deploy, destructive operations | `harness/RISK_POLICY.md` and the relevant canonical doc |
| branch, commit, push, or PR | `docs/engineering/contributing.md` |

Do not preload `harness/tasks/review/**`, screenshots, rendered documents, or
raw run artifacts. Open a historical packet only when it is directly relevant.

## Project skills

Reusable project skills live under `skills/**`.

- `skills/finpulse-lesson-methodologist`: source Markdown and runtime JSON
  lesson drafts from approved topics using the eight-screen architecture;
- `skills/fin-literacy-expert`: domain briefs, fact-checking, source/safety
  review, and education-vs-advice boundaries;
- `skills/finpulse-content-editor`: safe lesson-copy edits.

Use the relevant skill when the task matches it; follow its own instructions.

## Work loop

1. Claim or create one task under `harness/tasks/` unless the change is tiny and
   fully isolated.
2. Declare the intended write set and out-of-scope boundary before editing.
3. Make the smallest coherent change; do not mix unrelated cleanup.
4. Run the cheapest checks that can disprove the change early, then the
   risk-appropriate verification tier.
5. Update the task result packet with files, checks, risks, and follow-up.
6. The orchestrator updates `PROJECT_STATE.md` only for durable state changes
   and `WORKBOARD.md` only for current priorities/decisions. Builders do not add
   per-task logs to either file.
7. Stop after the current task unless the user expands scope.

Verification tiers:

- docs/harness-only: `npm run check:harness` and `git diff --check`;
- normal local code/content iteration: focused checks plus
  `npm run verify:fast`;
- shared runtime, persistence, release, or final pre-merge verification:
  `npm run verify` with a reachable PostgreSQL test database.

Full CI verification remains the release gate. Never report a fast or focused
run as a full pass.

## Parallel work

- One agent owns one task at a time.
- Every active task declares a bounded write set.
- Builders do not routinely edit shared coordination files.
- The orchestrator resolves overlap before edits and integrates shared changes
  once.
- Subagents receive routed context, not the entire repository history.
- Result packets must state files changed, checks run, risks, and next step.

See `harness/PARALLEL_AGENT_PROTOCOL.md` for lifecycle and handoff rules.

## Coding and UI rules

- Prefer strict TypeScript. Avoid `any`; if unavoidable, explain it locally.
- Keep published content immutable in UI code. Server state stays server-owned.
- Do not store the content corpus in Zustand.
- Validate seed JSON with `npm run check:content`.
- Keep public learner routes API-backed; do not add direct runtime imports from
  seed fixtures.
- Prefer composition over generic abstractions and route-level lazy loading for
  substantial pages.
- Design mobile-first with semantic HTML, keyboard access, and comfortable
  touch targets.
- Reusable UI belongs in `src/shared/ui/` or the established equivalent; use
  shadcn/ui primitives when they fit.

## Safety

- Preserve unrelated user changes in a dirty worktree.
- Do not add paid/external services, production writes, or new data exposure
  without explicit scope.
- Never commit secrets, `.env` files, private answers, or real customer data.
- Do not rewrite broad architecture while implementing a narrow feature.
- Any main-stack or product-boundary change requires `docs/DECISIONS.md`.
