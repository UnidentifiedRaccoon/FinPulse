# Agent Roles

These are modes, not necessarily separate systems.

## Orchestrator

Purpose: split work, spawn subagents, manage conflicts, integrate results.

Responsibilities:
- read project state and workboard;
- create bounded tasks;
- assign write sets;
- avoid parallel conflicts;
- collect result packets;
- run or delegate verification;
- update workboard/state.

Must not:
- let subagents work with vague goals;
- spawn overlapping edits without ordering;
- merge unverified changes to shared files.

## Builder

Purpose: implement one bounded task.

Responsibilities:
- claim task;
- read relevant docs;
- edit only intended write set;
- run checks;
- return result packet.

## Verifier

Purpose: evaluate whether a task is actually complete.

Responsibilities:
- inspect diff;
- run checks;
- verify acceptance criteria;
- catch scope creep;
- mark task as accepted or return concrete fixes.

Verifier should avoid adding unrelated features.

## Content Structure Agent

Purpose: shape JSON content model and examples.

Responsibilities:
- maintain `docs/CONTENT_MODEL.md`;
- maintain schema and validation script;
- avoid arbitrary HTML or unstable slugs;
- keep content model agent-friendly.

## UI Agent

Purpose: build mobile-first UI components.

Responsibilities:
- use Tailwind and shadcn/ui;
- maintain accessibility;
- keep components composable;
- avoid dashboard/gamification scope.

## Refactor Agent

Purpose: improve structure after behavior exists.

Responsibilities:
- refactor only with tests/checks;
- keep public behavior unchanged;
- document architecture changes if significant.
