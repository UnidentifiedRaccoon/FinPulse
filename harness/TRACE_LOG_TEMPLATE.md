# Agent Run Trace Template

Use this for important runs, especially orchestrator/subagent runs.

```md
# Run <run-id> — <task-id/title>

Date:
Agent role:
Model: GPT-5.5
Reasoning effort: xhigh
Branch/worktree:

## Input context

- AGENTS.md read: yes/no
- PROJECT_STATE.md read: yes/no
- Docs read:
- Task file:

## Goal


## Intended write set


## Actions

1.
2.
3.

## Files changed


## Checks run

- [ ] ./scripts/verify.sh
- [ ] typecheck
- [ ] lint
- [ ] tests
- [ ] build
- [ ] content validation

## Result

Status: success / partial / blocked / failed

## Risks and follow-up


```
