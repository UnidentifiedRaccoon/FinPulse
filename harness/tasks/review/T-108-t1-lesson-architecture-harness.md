# T-108 — T1 lesson architecture harness alignment

Status: review
Owner: Codex
Started: 2026-06-08

## Goal

Make the local harness and content-authoring guardrails point future
developer agents to the accepted T1 eight-screen lesson architecture.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/prompts/BUILDER.md`
- `harness/prompts/ORCHESTRATOR.md`
- `harness/prompts/SUBAGENT_CONTEXT_PACKET.md`
- `harness/prompts/VERIFIER.md`

## Intended write set

- `docs/methodology/AUTHORING.md`
- `docs/CONTENT_MODEL.md`
- `harness/prompts/BUILDER.md`
- `harness/prompts/ORCHESTRATOR.md`
- `harness/prompts/SUBAGENT_CONTEXT_PACKET.md`
- `harness/prompts/VERIFIER.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `scripts/check-content-json.mjs`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Out-of-scope

- Runtime lesson copy rewrites.
- UI/backend behavior changes.
- Editing the methodology artifact/docx tasks.
- Branch, commit, push, or PR work.

## Plan

1. Add the accepted T1 eight-screen contract to durable authoring/model docs.
2. Update builder/subagent/verifier prompts so content tasks read those docs and
   verify the contract.
3. Add a content-validation guard for T1 runtime lessons.
4. Run focused content validation and update the result packet.

## Checks

- [x] `node --check scripts/check-content-json.mjs`
- [x] `npm run check:content`
- [x] `./scripts/verify.sh` without DB URL, expected failure at backend test DB precondition after content validation, runtime import guard, typecheck, and lint passed
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test ./scripts/verify.sh`

## Result packet

- Files changed:
  - `docs/methodology/AUTHORING.md`
  - `docs/CONTENT_MODEL.md`
  - `harness/prompts/BUILDER.md`
  - `harness/prompts/ORCHESTRATOR.md`
  - `harness/prompts/SUBAGENT_CONTEXT_PACKET.md`
  - `harness/prompts/VERIFIER.md`
  - `harness/PARALLEL_AGENT_PROTOCOL.md`
  - `scripts/check-content-json.mjs`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
  - `harness/tasks/review/T-108-t1-lesson-architecture-harness.md`
- Checks run:
  - `node --check scripts/check-content-json.mjs` passed.
  - `npm run check:content` passed.
  - Plain `./scripts/verify.sh` failed only because backend tests require a DB URL in this shell.
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test ./scripts/verify.sh` passed.
- Risks:
  - The workspace already had many unrelated dirty/untracked changes before this task; they were not reverted.
  - T1 "personal" semantics on screen 5 are still documented rather than machine-provable.
- Follow-up:
  - Use `npm run check:content` as the fast guard before handing off any future T1 JSON lesson.
