# Contributing

Руководство по веткам, коммитам и Pull Request для этого репозитория.

## 1. Базовые принципы

- `main` всегда должен оставаться рабочим и mergeable.
- Любые изменения идут через Pull Request.
- Один PR = одна логическая задача.
- Один PR не должен смешивать feature, refactor, formatting, deps update и unrelated docs changes.
- Stage/Tier A work не считается завершённым без evidence и verifier pass.
- Если PR меняет public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract, canonical docs нужно обновить в том же PR.

## 2. Source of truth перед работой

Перед началом изменений сверяйся в таком порядке:

1. текущее состояние репозитория;
2. `docs/architecture/source-of-truth.md`;
3. stage-doc для текущего этапа;
4. `docs/architecture/access-and-subscriptions.md` and `docs/architecture/organization-access-subscription-model.md`, если задача трогает users, organizations, roles, invitations, codes, seats, subscriptions or access;
5. `AGENTS.md` и ближайший локальный `AGENTS.md`;
6. `docs/engineering/definition-of-done.md`;
7. `docs/engineering/human-gates.md`.

## 3. Типы работ

Используй единый `<type>` в ветке, коммите и PR.

| Тип | Когда использовать |
| --- | --- |
| `feat` | новая функциональность |
| `fix` | исправление бага |
| `docs` | документация |
| `refactor` | переработка кода без изменения поведения |
| `perf` | оптимизация производительности |
| `test` | добавление или правка тестов |
| `style` | форматирование и линтерные правки без изменения логики |
| `build` | сборка, tooling, генерация, зависимости |
| `ci` | CI/CD и automation |
| `chore` | прочая техрутина |

## 4. Ветки

Формат:

```text
<type>/<short-kebab-case>
```

Опционально:
```text
<type>/<ticket>-<short-kebab-case>
```

Примеры:
- `feat/mvp-diagnostic-flow`
- `fix/api-points-ledger-race`
- `docs/update-source-of-truth`

Правила:
- название ветки описывает одну задачу;
- избегай общих веток вроде `feat/update`;
- если нашлась независимая вторая задача, выноси её в отдельную ветку и PR.

## 5. Коммиты

Формат conventional commits:

```text
<type>(scope): <summary>
```

Примеры:
- `feat(api): добавить CRUD для уроков`
- `fix(web): исправить потерю стрика после завершения урока`
- `docs: обновить source of truth`

Правила:
- `type` и `scope` — на conventional-английском;
- summary — на русском;
- summary должен быть коротким и конкретным;
- не смешивай в одном коммите независимые изменения;
- если изменение нетривиальное, добавляй body на русском.

## 6. Pull Request

### Заголовок
Тот же формат, что и у коммита:

```text
<type>(scope): <summary>
```

Примеры:
- `feat(web): добавить экран персонального маршрута`
- `fix(api): исправить двойное списание points`

### Что должно быть в PR

Рекомендуемая структура описания:

```md
## Цель
- какая проблема решается
- почему это нужно сейчас

## Что сделано
- ключевые изменения

## Как проверить
- команды
- сценарии
- ожидаемый результат

## Риски и примечания
- ограничения
- что осталось вне PR
- нужен ли human gate

## Скриншоты
- для UI-изменений
```

Описание PR — на русском.

## 7. Минимальная проверка перед PR

Для Tier C/B code changes ожидается focused verification:
- `make proof-lite`;
- relevant package/Maven/browser checks, например `make verify-web` or `make verify-api`;
- `node scripts/check-code-first-slice.mjs` for product Tier C/B slices when proof churn is possible.

Для Tier A or pre-merge full validation:
- `make verify-full` or `make verify`;
- релевантный `make test-unit`;
- релевантный `make build`.

Для user-facing flows:
- browser smoke или `make test-e2e`
- screenshot evidence

Для backend/schema/API:
- миграции;
- notes по контракту;
- regeneration связанных generated artifacts.

Если часть проверок не выполнилась из-за ограничений среды, это нужно явно написать в PR.

## 8. Merge

- Перед merge нужен review.
- Обсуждения по замечаниям нужно закрывать по существу.
- Предпочтительный режим merge — `Squash & merge`.
- После merge ветку удалять.

## 9. Agent fast publish workflow

Этот режим применяется только к publish-only запросам: commit, push, PR, merge уже подготовленного diff. Если пользователь просит ревью, доработку, stage execution или аудит, использовать обычный proof loop and Definition of Done.

Цели режима:

- не читать raw evidence corpus без точной ссылки;
- не запускать stage harness повторно только ради публикации;
- не тратить контекст на исторические `.agent/**/raw/**` логи;
- быстро получить чистую PR branch поверх `origin/main`.

Минимальная последовательность:

```bash
git fetch origin main --prune
git status --short --branch
git diff --stat -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'
git diff --name-status -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'
git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'
git add -A
git commit -m "<type>(scope): <summary>"
git push -u origin HEAD
gh pr create --base main --head "$(git branch --show-current)" --title "<type>(scope): <summary>" --body-file <body-file>
```

Если текущая ветка `ahead/behind`, `main` уже содержит часть истории или PR должен быть минимальным, создать чистую publish branch:

```bash
git switch -c <type>/<short-kebab-case> origin/main
git cherry-pick <publish-commit>
git push -u origin HEAD
```

Для merge по явной команде пользователя:

```bash
gh pr view <number> --json state,mergeable,statusCheckRollup,headRefOid
gh pr merge <number> --squash --delete-branch --subject "<type>(scope): <summary> (#<number>)" --body-file <merge-body-file>
git fetch origin main --prune
git switch main
git pull --ff-only
```

Использовать `gh` как основной publish backend для PR/merge, если GitHub app недоступен или возвращает `403 Resource not accessible by integration`.

Raw evidence policy для publish-only:

- не читать `.agent/stages/**/raw/**` через blanket `rg`, `find` или `cat`;
- читать raw только по точному ref из `evidence.json`, `problems.md`, PR body или запроса пользователя;
- не добавлять в PR `codex-exec-*.log` и полные terminal transcripts без отдельной причины;
- если raw `.txt` всё же меняется, нормализовать CR/trailing whitespace before commit или исключить raw paths from publish-only `git diff --check`.

## 10. Agent post-PASS publish workflow

Этот режим применяется только к stage/task execution, где prompt, sprint contract или `publish_manifest.json` явно задаёт `publish_after_pass=true`. Stage harness отвечает за PASS-readiness and handoff, а git/GitHub publish mechanics выполняет repo-local skill `$push-main`.

Порядок:

1. Довести slice до fresh verifier `PASS`.
2. Обновить evidence/proof, docs when required, stage status and `publish_manifest.json` or PR body publish proof.
3. Проверить publish scope через `git diff --check`, исключая raw evidence pathspecs when needed.
4. Вызвать `$push-main` for publish-only branch/commit/PR/merge/local-main update.
5. Если `$push-main` reports blocker по permissions, conflicts, checks or branch protection, остановиться после последнего успешного publish step and record blocker.
6. В финальном ответе указать PR URL, merge status, локальный `main` HEAD and next copyable continuation prompt only when continuation handoff was requested.

Protection rules не обходить, unrelated work не включать, stage harness повторно не запускать внутри `$push-main`.

## 11. Короткий workflow

```bash
git checkout main
git pull
git checkout -b <type>/<short-kebab-case>

# работа

git add .
git commit -m "<type>(scope): <summary>"
git push -u origin HEAD
gh pr create
```
