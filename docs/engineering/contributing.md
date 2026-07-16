# Contributing

Project-native branch, commit, push, and Pull Request workflow for FinPulse.
Read this only when publication is in scope.

## Before changing Git state

1. Read `AGENTS.md`, `harness/PROJECT_STATE.md`, and the task packet.
2. Inspect `git status --short --branch` and the relevant diff.
3. Preserve unrelated user changes; do not reset, stash, stage, or commit them
   unless the user explicitly includes them.
4. Confirm the intended publication scope and checks in the task packet.

Creating a branch, committing, pushing, opening a PR, merging, or deploying
requires an explicit user request for that action.

## Branches

Default format:

```text
codex/<type>/<short-kebab-case>
```

With a task ID:

```text
codex/<type>/t-185-short-kebab-case
```

Use one of `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, or
`chore`. A branch should contain one coherent task. Follow a user-specified
branch name when provided.

Do not create or switch branches in a dirty shared workspace unless the scoped
changes are safely understood and preserved.

## Commits

Use Conventional Commits:

```text
<type>(<scope>): <short Russian summary>
```

Examples:

```text
fix(web): исправить сброс состояния карточки
docs(harness): ускорить проверку задач
```

Stage only files in the approved write set. Review the staged diff before
committing:

```bash
git diff --check
git diff --cached --stat
git diff --cached
```

Never commit secrets, `.env` files, private learner data, generated bulk logs,
or unrelated workspace changes.

## Verification before push

Use the tiers from `AGENTS.md`:

- docs/harness: `npm run check:harness` and `git diff --check`;
- normal iteration: focused checks plus `npm run verify:fast`;
- shared runtime, persistence, release, or pre-merge: `npm run verify` with an
  isolated reachable PostgreSQL test database.

Record commands and their actual state (`pass`, `fail`, `blocked`, `skipped`).
Do not call a fast/focused run a full pass. UI changes also need focused browser
or screenshot evidence when visual behavior is part of acceptance.

## Pull Requests

PR title follows the commit format. Write the body in Russian:

```md
## Цель
- проблема и ожидаемый результат

## Что сделано
- ключевые изменения

## Как проверить
- фактически выполненные команды и сценарии

## Риски и границы
- что не менялось
- оставшиеся риски или human gate

## Скриншоты
- только если UI/визуальный результат изменился
```

Prefer a focused PR and `Squash & merge`. Do not bypass required checks or
branch protection. Resolve review feedback by evidence, not by broad unrelated
changes.

## Safe publish sequence

Run only the steps the user requested:

```bash
git status --short --branch
git diff --stat
git diff --check
# run required verification
git add <scoped paths>
git diff --cached --stat
git commit -m "<type>(scope): <summary>"
git push -u origin HEAD
gh pr create --base main --head "$(git branch --show-current)" \
  --title "<type>(scope): <summary>" --body-file <body-file>
```

If the branch diverged, has conflicts, or contains unrelated history, stop and
report the evidence before rebasing, cherry-picking, or creating a clean branch.
Never force-push without explicit approval.

After a requested merge, verify the PR state/checks first, use the selected
merge method, then refresh local refs with non-destructive commands. Production
deploy remains a separate explicitly authorized action.
