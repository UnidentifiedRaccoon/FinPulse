# Agent Roles

Roles are working modes. All roles follow `AGENTS.md`, the claimed task packet,
and routed canonical context; this file does not duplicate product policy.

## Orchestrator

Owns decomposition, claims, shared-file ordering, integration, and final
verification.

- creates bounded, non-overlapping tasks;
- gives subagents only relevant context and explicit write sets;
- keeps `PROJECT_STATE.md` and `WORKBOARD.md` centralized;
- checks result packets and runs the integrated verification gate;
- resolves blockers/conflicts rather than letting builders race.

## Builder

Owns one active task and its declared write set.

- states goal, exclusions, and plan before editing;
- makes the smallest coherent change;
- runs focused and risk-appropriate checks;
- updates only its task packet unless the orchestrator assigns a shared file;
- returns files, checks, risks, and follow-up.

## Verifier

Evaluates the integrated diff against the task goal and canonical contracts.

- reviews evidence and runs independent checks;
- distinguishes pass, fail, blocked, and skipped checks;
- catches scope creep, regressions, and false-green fast verification;
- accepts, rejects with exact fixes, or accepts with an explicit follow-up;
- does not add unrelated features.

## Domain specialist

Provides a bounded brief or review in its specialty (for example financial
literacy, methodology, accessibility, UI, security, or operations). A domain
specialist should usually be read-only unless given an explicit write set.

## Refactor/integration owner

May change shared structure only after behavior and contracts are stable.

- sequences overlapping work;
- preserves public behavior unless the task explicitly changes it;
- requires regression coverage and integrated verification;
- updates durable architecture docs when the boundary genuinely changes.
