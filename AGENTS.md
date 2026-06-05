# AGENTS.md — FinPulse Learning MVP Harness

This file is the short map for all human and AI contributors. Keep it short. Put durable knowledge in `docs/` and run-state in `harness/`.

## Project shape

FinPulse MVP is a mobile-first educational web app.

Current MVP scope:
- educational program material only;
- JSON files as the data/source-of-truth;
- React + TypeScript;
- SPA, preferably Vite, not Next/SSR unless an ADR changes this;
- Zustand for small client-side state only;
- Tailwind CSS + shadcn/ui for design system and UI primitives.

Explicitly out of scope for MVP:
- user cabinets/accounts;
- diagnostics;
- rewards/gamification;
- analytics dashboards;
- backend/admin panel;
- production financial operations;
- personalized recommendations;
- SSR/Next.js unless `docs/DECISIONS.md` is updated first.

## Model policy

Default model for all agentic development work: **GPT-5.5 with reasoning effort `xhigh`**.

This applies to:
- orchestrator agents;
- spawned subagents;
- builder agents;
- verifier/reviewer agents;
- refactoring agents;
- content-structure agents.

Do not downgrade the model or reasoning effort unless the user explicitly instructs it.

## Required context before work

Before changing files, every agent must read:
1. `AGENTS.md`
2. `harness/PROJECT_STATE.md`
3. `harness/WORKBOARD.md`
4. `docs/PRODUCT.md`
5. `docs/ARCHITECTURE.md`
6. `docs/CONTENT_MODEL.md` when touching JSON/content
7. `docs/methodology/METHODOLOGY.md` and `docs/methodology/AUTHORING.md` when touching methodology or educational content
8. `harness/PARALLEL_AGENT_PROTOCOL.md` when working in parallel
9. `docs/engineering/contributing.md` before creating branches, commits, pushes, or PRs

## Work loop

For every task:
1. Claim or create a task in `harness/tasks/` unless the task is tiny and fully isolated.
2. Define the expected file write set before editing.
3. Make the smallest coherent change.
4. Run `./scripts/verify.sh` or `npm run verify` if the project is scaffolded.
5. Update the relevant task file and `harness/PROJECT_STATE.md` when state changes.
6. If the user asks to publish, commit, push, or open a PR, follow `docs/engineering/contributing.md`.
7. Stop after the current task; do not silently start unrelated work.

## Parallel-agent rules

Parallel agents are expected. They must not break each other.

Rules:
- One agent owns one task at a time.
- Each task must declare an intended write set.
- Avoid overlapping writes. If overlap is unavoidable, the orchestrator resolves ordering.
- Do not edit another active task file unless acting as orchestrator or verifier.
- Prefer small local worktrees per task. Use `docs/engineering/contributing.md` branch naming for any branch that will be pushed.
- Subagents must receive a context packet, not the whole universe.
- Subagents must return a concise result packet: files changed, checks run, risks, next steps.

See `harness/PARALLEL_AGENT_PROTOCOL.md`.

## Coding rules

- TypeScript strictness is preferred. Do not introduce `any` without a short comment explaining why.
- Keep content data immutable. UI state belongs in components or small Zustand stores.
- Do not put large static content in Zustand.
- Validate JSON structure with `npm run check:content` or `node scripts/check-content-json.mjs`.
- Use route-level lazy loading once the app has multiple substantial pages.
- Keep mobile layout as the primary layout, desktop as graceful expansion.
- Prefer composition over generic abstractions.
- Do not introduce a backend dependency for MVP content delivery.

## UI rules

- Use shadcn/ui primitives when they fit.
- Use Tailwind utility classes and shared tokens.
- Keep touch targets comfortable on mobile.
- Maintain semantic HTML and keyboard navigation.
- New reusable UI components belong in `src/shared/ui/` or the project's chosen equivalent.

## Verification baseline

When available, verification should include:
- TypeScript typecheck;
- lint;
- content JSON validation;
- unit/component tests;
- production build.

Evals are intentionally deferred until product flows exist. See `evals/README.md`.

## Do not do

- Do not migrate to Next.js/SSR without an ADR.
- Do not add accounts, diagnostics, rewards, analytics, or backend scope to MVP by accident.
- Do not introduce paid/external services without user approval.
- Do not commit secrets, tokens, private data, or real customer data.
- Do not rewrite broad architecture while implementing a narrow feature.
