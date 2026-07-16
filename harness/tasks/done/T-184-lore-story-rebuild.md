# T-184 — История v2 с нуля и пересборка lore-пайплайна

Status: done
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-09
Branch/worktree: current workspace; existing T-183 changes preserved

## Goal

Переработать накопленные lore-материалы в короткий, управляемый процесс и
подготовить с нуля отдельную историю v2, пригодную для содержательного
согласования с методистом и инвесторами.

История v2 не наследует темы, порядок, формулировки или драматургию готовых 16
уроков текущего Уровня 1. Опубликованный контент остаётся самостоятельной v1 и
не используется как проектное ограничение для v2.

## Context

До начала содержательных правок прочитаны:

- `AGENTS.md`;
- `harness/PROJECT_STATE.md`;
- `harness/WORKBOARD.md`;
- `harness/PARALLEL_AGENT_PROTOCOL.md`;
- `docs/PRODUCT.md`;
- `docs/ARCHITECTURE.md`;
- `docs/CONTENT_MODEL.md`;
- `docs/methodology/METHODOLOGY.md`;
- `docs/methodology/AUTHORING.md`;
- skills `fin-literacy-expert`, `finpulse-lesson-methodologist` и
  `finpulse-content-editor`.

Канонические lore- и competency-источники полностью прочитаны и
проаудированы до фиксации итогового кандидата.

## Intended write set

- `harness/tasks/done/T-184-lore-story-rebuild.md`;
- `AGENTS.md` (только синхронизация runtime source-of-truth policy);
- `docs/methodology/production_model_financial_lore_pipeline.md`;
- `docs/methodology/lore_story_v2.md`;
- `docs/methodology/README.md`;
- `harness/PROJECT_STATE.md`;
- `harness/WORKBOARD.md`.

Если аудит выявит конфликт утверждённого канона, write set сначала будет явно
расширен на конкретный lore-документ; runtime и уроки в эту задачу не входят.

## Out-of-scope

- runtime JSON, lesson source Markdown и база опубликованного контента;
- адаптация, ретрофит или пересборка готовых 16 уроков v1;
- frontend, backend, API, database и persistence;
- генерация 80 уроков или экранных сценариев;
- диагностика, скоринг, психотипирование пользователя, награды и HR-аналитика;
- персональные финансовые рекомендации;
- откат или перезапись несвязанных пользовательских изменений.

## Plan

1. Проаудировать официальную рамку, текущие lore-артефакты и старый pipeline.
2. Выделить канон, дублирование, лишние gate-артефакты и пробелы истории.
3. Свести процесс к минимальному числу производственных фаз и human gates.
4. С нуля собрать цельную историю v2 о переезде и адаптации на новой работе на
   5 уровней / 20 разделов, встроив финансовые действия и эмоциональные навыки.
5. Добавить в один согласовательный пакет investor layer и methodologist layer.
6. Провести независимые аудиты связности, компетенций, эмоций, safety и
   читаемости; исправить подтверждённые дефекты.
7. Обновить индекс и run-state, выполнить документные проверки.

## Checks

- [x] `git diff --check`
- [x] trailing-whitespace smoke для изменённых Markdown-файлов
- [x] проверка 5 уровней / 20 разделов / 4 разделов на уровень
- [x] проверка competency IDs, official topic titles и safety tags против
  канонических источников
- [x] независимый narrative / competency / emotion / pipeline / investor audit

## Approval outcome

Approval 1 выдан product owner 2026-07-14 со статусом
`approved_with_blockers` и зафиксирован в
`docs/methodology/lore_v2_decisions.md` как `LV2-DEC-001`.

Утверждены narrative canon, пятиуровневая арка, эмоциональный контракт и
видимый финал с проверенным долгосрочным продлением аренды. Visual proof,
competency gaps и Phase B controls остались явными блокерами; массовая
генерация не разрешена. Неветвящаяся роль пользователя вынесена в отдельное
решение по модели экранов.

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2.md` — новый standalone Story Blueprint;
  - `docs/methodology/production_model_financial_lore_pipeline.md` — lean,
    fail-closed pipeline v2;
  - `docs/methodology/README.md`, `AGENTS.md`, `harness/PROJECT_STATE.md`,
    `harness/WORKBOARD.md` — source-of-truth и run-state sync;
  - этот task record.
- Checks run:
  - structural smoke: 5 Levels, 20 unique `Lx-Sy`, 20 causal-map rows,
    80 beats, по четыре beats на Section;
  - 20/20 official topic IDs и названий в treatment и coverage, без дублей и
    расхождений; все упомянутые production candidate IDs существуют;
  - Markdown table consistency, duplicate-heading и trailing-whitespace smoke;
  - `git diff --check` — pass;
  - `npm run check:content` — pass;
  - `npm run verify` — content validation, runtime-import guard, typecheck и
    lint pass; tests: 118 pass, 21 backend tests stop на известном отсутствии
    `FINPULSE_TEST_DATABASE_URL` / `FINPULSE_DATABASE_URL` / `DATABASE_URL`;
  - независимые narrative/investor и competency/emotion audits — pass;
    pipeline audit — pass после fail-closed revisions.
- Risks:
  - Approval 1 дан со статусом `approved_with_blockers`; открытые блокеры
    нельзя трактовать как разрешение массовой генерации;
  - object metaphor остаётся условной до `GAP-VIS-OBJECTS` visual proof;
  - Phase B намеренно заблокирована до отдельного решения по модели экранов,
    Competency Catalog v2, заполненного runtime/mode preflight, изолированного
    namespace, ledger schema, validator, Issue Register и фактического Trace +
    Continuity Ledger;
  - gaps `1.6`, `2.4`, `2.5`, `3.5` и selective scope `4.2` нельзя скрывать
    full-coverage claim.
- Follow-up:
  - рассмотреть пятиглавную derived story, Level 1 competency/emotion map и
    рекомендуемую Model B из пакета T-186;
  - после отдельного решения по экранам выбрать runtime target/mode и
    namespace, создать control artifacts, затем собрать один типовой Section и
    high-risk probe.
