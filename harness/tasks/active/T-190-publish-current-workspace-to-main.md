# T-190 — Publish current workspace to main

Status: active
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

- [ ] Secret/private-data and untracked-artifact audit.
- [ ] `git diff --check` before staging and on the staged patch.
- [ ] `npm run check:harness`.
- [ ] `npm run verify` with an isolated reachable test database, or record the
  exact environment blocker and rely on required GitHub CI only if local full
  verification cannot start safely.
- [ ] Staged scope and commit inspected.
- [ ] Required PR checks pass without bypass.
- [ ] PR is squash-merged into `main` and remote state is verified.

## Result packet

- Files changed:
- Checks run (pass/fail/blocked/skipped):
- Risks:
- Follow-up:
