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
