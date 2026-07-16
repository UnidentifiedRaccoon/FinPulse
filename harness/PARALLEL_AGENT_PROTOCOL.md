# Parallel Agent Protocol

Parallel work is encouraged when tasks have bounded, mostly non-overlapping
write sets. The task filesystem is the coordination source of truth.

## Lifecycle

| Directory | Allowed status | Meaning |
|---|---|---|
| `harness/tasks/inbox/` | `planned` | scoped but unclaimed |
| `harness/tasks/active/` | `active`, `blocked` | currently owned work |
| `harness/tasks/review/` | `review` | waiting for independent verification or a human decision |
| `harness/tasks/done/` | `done` | accepted/verified outcome |

Move a task; never copy it between lifecycle directories. Use
`npm run task:move -- T-XXX <planned|active|blocked|review|done>` so the path and
status change together. Legacy review packets predate this strict contract and
remain historical provenance; the machine-enforced task contract applies to
T-185 and later.

Create a task with an automatic next ID:

```bash
npm run task:new -- "Short task title"
```

The creator serializes ID reservation, scans all lanes, and refuses ID reuse.
`npm run check:harness`
validates active/new task structure and lifecycle integrity. Moving to `active`
requires completed claim metadata; moving to `review` or `done` requires a
non-empty result packet.

## Claim before edits

Before editing, the owner must:

1. move the task to `active`;
2. set `Owner`, `Started`, goal, intended write set, and out-of-scope boundary;
3. run `npm run harness:status` and resolve active write-set overlap;
4. load context using the routing table in `AGENTS.md`.

One agent owns one active task. A task may be blocked in `active/`, but its
packet must state the concrete blocker.

List one repository path or glob per write-set bullet so overlap checks remain
machine-readable; do not combine paths with commas or prose.

## Task packet

```md
# T-XXX — Short task name

Status: active
Owner: <agent-or-human>
Model: GPT-5.5 / xhigh
Started: YYYY-MM-DD
Branch/worktree: current workspace or branch name

## Goal

One checkable outcome.

## Context

- Required and task-specific sources actually read.

## Intended write set

- `path/or/glob`

## Out-of-scope

- Explicit boundaries.

## Plan

1. Small ordered steps.

## Checks

- [ ] Focused checks
- [ ] Risk-appropriate verify tier

## Result packet

- Files changed:
- Checks run:
- Risks:
- Follow-up:
```

Do not add `PROJECT_STATE.md` or `WORKBOARD.md` to every builder write set. The
orchestrator owns those shared files and updates them once only when durable
state or current priorities change.

## Subagent context packet

Give every subagent:

1. one bounded outcome;
2. the task ID and owner;
3. the relevant context routes from `AGENTS.md`;
4. an explicit allowed write set (or `read-only`);
5. explicit exclusions;
6. success criteria and checks;
7. the required result-packet format.

Do not paste the full review archive, raw traces, or unrelated canonical docs.
For content tasks, state the approved Program -> Level -> Section -> Lesson ->
Card hierarchy and route the agent to the content/methodology sources.

## Conflict rules

- Exact or parent/child overlap between active write sets must be resolved
  before both agents edit.
- Shared config, routing, package metadata, schemas, and coordination files have
  one integration owner.
- When sequencing is required, the second task remains planned/blocked until the
  first result packet is available.
- Preserve unrelated dirty-worktree changes; do not reset or rewrite them.
- A verifier reviews shared-file changes before acceptance.

Good splits isolate vertical slices, read-only audits, or tests against a stable
contract. Risky splits put multiple agents into the same router, schema, shared
component, package file, or coordination summary.

## Verification and handoff

Builders run focused checks and the tier required by `AGENTS.md`. The
orchestrator integrates results, then runs the broadest required gate once.
Fast verification is iteration evidence, not a substitute for full release
verification.

Every result packet returns exactly:

1. summary/outcome;
2. files changed;
3. checks run with pass/fail/blocked state;
4. residual risks;
5. recommended next step.

Move to `review` only when the packet is complete. Move to `done` after an
independent verifier/orchestrator accepts the result or the relevant human gate
is satisfied.

## Branches and artifacts

Branch, commit, push, and PR conventions live only in
`docs/engineering/contributing.md`; do not duplicate them here.

Generated bulk evidence belongs in ignored temporary storage. Commit only a
decision-grade report and the smallest useful screenshots/fixtures under
`harness/artifacts/T-XXX/`. Never place new binary artifact directories inside
task lifecycle lanes.
