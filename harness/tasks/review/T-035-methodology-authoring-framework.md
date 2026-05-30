# T-035 - Methodology Authoring Framework

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-05-30
Branch/worktree: current workspace

## Goal

Create one practical methodology authoring document that lets an editor or agent
turn provided educational source content into a FinPulse-ready methodical package
and runtime JSON material aligned with the current app architecture.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/finpulse_methodology/**`
- `docs/methodology/CONTENT_BACKLOG.md`

## Intended write set

- `docs/methodology/AUTHORING.md`
- `harness/tasks/active/T-035-methodology-authoring-framework.md`
- `harness/tasks/review/T-035-methodology-authoring-framework.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Changing runtime content JSON.
- Changing content schema, UI, routing, backend API, auth, or progress behavior.
- Editing T-034 runtime content cleanup files.
- Adding unsupported runtime card types or product scope.

## Plan

1. Consolidate the existing lesson methodology, content model, runtime limits, and
   verification rules into one authoring guide.
2. Include a repeatable workflow from source content to methodical package to
   runtime JSON.
3. Add templates and acceptance criteria that match the current MVP card model.
4. Update harness state and run verification.

## Checks

- [x] `npm run verify`

## Result packet

- Files changed: `docs/methodology/AUTHORING.md`, this task file,
  `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`.
- Checks run: `npm run verify`.
- Risks: the new guide is docs-only and does not enforce workflow mechanically;
  future authoring tasks still need content validation after JSON changes.
- Follow-up: use `docs/methodology/AUTHORING.md` as the default context packet
  for future lesson/content packaging tasks.
