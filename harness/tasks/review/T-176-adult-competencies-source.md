# T-176 — Adult competencies source

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-05
Branch/worktree: current workspace

## Goal

Add the adult financial competencies framework as a durable project documentation source and wire it into the Fin Literacy Expert skill.

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
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `skills/fin-literacy-expert/SKILL.md`
- relevant `skills/fin-literacy-expert/references/**`
- `/Users/elena/Downloads/adult_financial_competencies_2026.md`

## Intended write set

- `docs/methodology/adult_financial_competencies_2026.md`
- `docs/methodology/METHODOLOGY.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/source-index.md`
- `skills/fin-literacy-expert/references/domain-map.md`
- `skills/fin-literacy-expert/references/open-questions.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/tasks/review/T-176-adult-competencies-source.md`

## Out-of-scope

- Runtime JSON content.
- Lesson structure or card generation.
- External source verification beyond preserving the provided file and documenting its declared source.

## Plan

1. Preserve the provided Markdown file under project documentation.
2. Link the document from methodology and Fin Literacy Expert reference loading rules.
3. Update source/open-question reference files and project coordination docs.
4. Run lightweight verification for documentation/skill changes.

## Checks

- [x] `git diff --check`
- [x] skill reference smoke check
- [x] `npm run verify` attempted; failed only at backend tests because this shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`

## Result packet

- Files changed:
  - `docs/methodology/adult_financial_competencies_2026.md`
  - `docs/methodology/METHODOLOGY.md`
  - `skills/fin-literacy-expert/SKILL.md`
  - `skills/fin-literacy-expert/references/domain-map.md`
  - `skills/fin-literacy-expert/references/open-questions.md`
  - `skills/fin-literacy-expert/references/source-index.md`
  - `harness/PROJECT_STATE.md`
  - `harness/WORKBOARD.md`
- Checks run:
  - source Markdown was copied from `/Users/elena/Downloads/adult_financial_competencies_2026.md` and normalized only by removing one final blank line so `git diff --check` passes
  - `git diff --check` passed
  - skill reference smoke check passed
  - `npm run verify` passed content validation, runtime import guard, typecheck, and lint, then failed in backend tests because no test DB URL env var is set
- Risks:
  - The competencies file is a normalized documentation source, not a live source for current financial rates, limits, or legal values.
- Follow-up:
  - Use the new local catalog when mapping adult course topics and FinLit Expert coverage.
