# T-190 — Publish current workspace to main

Status: review
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-16
Branch/worktree: `codex/chore/t-190-publish-workspace`; current workspace

## Goal

Publish the user-approved complete current workspace change set through a pull
request, wait for required checks, and squash-merge it into `main` without
committing secrets, private data, generated bulk artifacts, or ignored files.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/RISK_POLICY.md`
- `docs/engineering/contributing.md`
- `github:yeet` skill
- All current tracked and untracked workspace changes explicitly included by
  the user, subject to repository safety rules.

## Intended write set

- All current tracked modifications, deletions, and safe untracked files.
- `harness/tasks/**/T-190-publish-current-workspace-to-main.md`.
- Git branch, index, commit, remote branch, pull request, and merge state.
- `.gitignore` rule for the generated local Gate 5 context pack so the source
  snapshot remains local without duplicating stale repository files in Git.

## Out-of-scope

- Production deployment, cloud/database writes, content publication through the
  running application, force-push, bypassing branch protection, secrets,
  private learner data, ignored files, and generated bulk logs or caches.

## Plan

1. Audit the complete worktree for secrets, private data, generated artifacts,
   oversized files, and unintended nested repositories.
2. Create a purpose-named branch from the current `origin/main` commit while
   preserving the full dirty worktree.
3. Run the required pre-merge verification tier and resolve only failures
   caused by the scoped change set.
4. Stage the full approved safe worktree, inspect the staged diff, and create a
   Conventional Commit.
5. Push, open a ready PR to `main`, wait for required checks, and squash-merge
   without bypassing protection.
6. Verify the PR is merged and `origin/main` points at the merge result.

## Checks

- [x] Secret/private-data and untracked-artifact audit.
- [x] `git diff --check` before staging and on the staged patch.
- [x] `npm run check:harness`.
- [x] `npm run verify` with an isolated reachable test database, or record the
  exact environment blocker and rely on required GitHub CI only if local full
  verification cannot start safely.
- [x] Staged scope and commit inspected.
- [x] Required PR checks pass without bypass.
- [ ] PR is squash-merged into `main` and remote state is verified.

## Result packet

- Files changed:
  - Complete safe worktree: 58 files in commit `f456567`, covering Story v2,
    methodology review artifacts, lean harness/task lifecycle, verification
    scripts, CI, and their task packets.
  - `.gitignore` excludes the generated local Gate 5 context snapshot.
  - This packet moves from `active` to `review` in a final metadata commit.
- Checks run (pass/fail/blocked/skipped):
  - PASS — two independent worktree audits found no secrets, private data,
    nested repositories, binaries, or unexplained dangerous changes.
  - PASS — `git diff --check` and staged diff check.
  - PASS — `npm run verify:fast`: harness 12/12, content/import guards,
    typecheck, lint, and non-DB tests 118/118.
  - BLOCKED locally as designed — `npm run verify` stopped at database
    preflight because no isolated PostgreSQL is available; no remote database
    was substituted.
  - PASS — PR #32 `Verify / npm run verify` with isolated PostgreSQL on commit
    `f456567` (1m51s).
- Risks:
  - `tmp/gate5-dev-pack-20260709/` remains local and ignored because it is an
    852 KiB generated snapshot containing duplicated and stale documents.
  - Story v2 remains a review artifact; screen-model and Phase B gates remain
    open and runtime v1 content is unchanged.
- Follow-up:
  - Push the packet-only lifecycle commit, require the final PR check to pass,
    squash-merge PR #32, then verify the merged `origin/main` SHA and post-merge
    workflow state.
