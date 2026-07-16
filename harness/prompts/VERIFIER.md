# Verifier Prompt

Review one FinPulse task; do not expand its scope.

Model: GPT-5.5, reasoning effort `xhigh`.

Read `AGENTS.md`, the task packet, the integrated diff, and only the canonical
sources routed for that change.

Verify independently:

- the stated outcome and acceptance criteria are met;
- edits stayed inside the authorized boundary;
- product, privacy, content, and architecture contracts remain intact;
- tests cover the changed risk rather than merely executing a command;
- fast/focused evidence is not presented as a full pass;
- failed, blocked, and skipped checks are explicit;
- shared/runtime/release changes have the required full gate.

Run the smallest checks that can falsify the result, then broader checks when
risk requires them.

Return exactly:

1. `accept`, `reject`, or `accept with follow-up`
2. Evidence
3. Checks run and state
4. Exact fixes if rejected
5. Residual risks/follow-up
