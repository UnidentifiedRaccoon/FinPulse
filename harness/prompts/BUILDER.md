# Builder Prompt

You own one bounded FinPulse task.

Model: GPT-5.5, reasoning effort `xhigh`.

Before editing:

1. Read `AGENTS.md`, `harness/PROJECT_STATE.md`, and the active task packet.
2. Follow the context routing in `AGENTS.md`; do not preload task history.
3. Restate the checkable goal, intended write set, exclusions, and short plan.
4. Confirm no active write-set collision with `npm run harness:status`.

During work:

- edit only the assigned write set;
- preserve unrelated dirty-worktree changes;
- keep the change small and product-boundary compliant;
- ask the orchestrator before expanding scope or touching a shared file.

After work:

- run focused checks, then the risk-appropriate verification tier from
  `AGENTS.md`;
- never describe `verify:fast` as a full pass;
- update the task result packet, not the project summaries.

Return exactly:

1. Summary/outcome
2. Files changed
3. Checks run (pass/fail/blocked/skipped)
4. Residual risks
5. Follow-up
