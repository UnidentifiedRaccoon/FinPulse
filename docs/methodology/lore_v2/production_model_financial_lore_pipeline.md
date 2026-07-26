# Производственная модель истории ФинПульс

**Статус:** `phase_a_reopened` после `LV2-DEC-005`; запуск Phase B заблокирован
решением о новой геометрии и прежним preflight из разделов 4 и 5.

**Версия:** 2.0 от 2026-07-09.

**Заменяет:** прежний процесс из 18 этапов, 10 human gates, 18 копируемых
промптов и 13 отдельных артефактов.

## 1. Результат процесса

Pipeline превращает официальную взрослую рамку компетенций, историю переезда и
методику ФинПульс в проверяемые уроки без преждевременной массовой генерации.

Следующая геометрия больше не утверждена. Прежняя гипотеза сохраняется ниже
только для истории версии 2.0:

```text
5 Levels
× 4 Sections
× 4 Lessons
= 80 Lessons (superseded target)
```

Решение `LV2-DEC-005` уже вернуло структуру на human review: актуальная книга
содержит больше самостоятельных сюжетно-образовательных единиц, чем честно
помещается в прежние 80 слотов. Все проверки ниже, жёстко ожидающие 5 Levels,
20 Sections или 80 Lessons, должны быть пересмотрены после нового решения.

Главная единица качества — не документ и не gate, а причинная связь:

```text
событие героя
-> ситуативная эмоция и возможный импульс
-> финансовая компетенция
-> наблюдаемое действие пользователя
-> последствие и следующий beat
```

## 2. Принципы производства

1. **Одна истина на слой.** Канон не дублируется в нескольких prose-файлах.
2. **История проверяется рано.** Vertical slice создаётся до детализации
   остальных 76 уроков.
3. **Сначала действие, потом объяснение.** Компетенция проявляется в выборе,
   сортировке, расчёте на учебных данных, проверке источника или формулировке
   вопроса.
4. **Эмоция — сигнал, не диагноз.** Она не определяет тип пользователя и не
   обещает психологического изменения.
5. **Safety — поле данных и publish gate, а не повторяющийся дисклеймер.**
6. **Генерация и аудит разделены.** Автор пакета не является единственным
   reviewer своего результата.
7. **Производство идёт разделами.** Один пакет = один Section из четырёх
   Lessons; после Level выполняется целостный audit.
8. **Human review — по решениям, не по каждому файлу.** Вне обязательных gates
   человек подключается по exception triggers.
9. **v2 независима от v1.** Готовые 16 уроков текущего Level 1 не являются
   входом или шаблоном истории v2.
10. **Строгая граница важнее target vision.** Диагностика, психотипы,
    personalization, scoring, streak и rewards из target-only частей
    `METHODOLOGY.md` не являются входом v2, если они исключены `PRODUCT.md`,
    `AUTHORING.md` или Story Blueprint.

## 3. Source-of-truth policy

| Слой | Единственный источник |
|---|---|
| Продуктовые границы | `PRODUCT.md`, `ARCHITECTURE.md` |
| Иерархия, карточки и runtime-ограничения | `CONTENT_MODEL.md`, `AUTHORING.md` |
| Общая методика | `METHODOLOGY.md` только через более строгие MVP/safety-фильтры `PRODUCT.md`, `AUTHORING.md` и Story Blueprint |
| Официальная взрослая рамка | `adult_financial_competencies_2026.md` с версией и provenance |
| Production IDs и наблюдаемые действия v2 | Планируемый `lore_competency_catalog_v2.md`; Phase B не начинается до его создания и approval |
| Канон истории v2 | `lore_story_v2.md` после human approval |
| Lesson-level mapping | `lore_trace_continuity_v2.json`, создаваемый после approval истории |
| Авторский источник урока | Source Markdown по `finpulse-lesson-methodologist` |
| Seed fixture | JSON под `src/content/**` после отдельного решения о production |
| Опубликованный runtime | PostgreSQL JSONB по текущему `CONTENT_MODEL.md` |
| Run-state | `harness/PROJECT_STATE.md`, `WORKBOARD.md`, task files; это не канон истории |

С момента начала работы над v2 предыдущие lore-документы являются только
read-only provenance и не могут переопределять candidate Blueprint. После
Approval 1 `lore_story_v2.md` становится canonical. В provenance входят:

- `finpulse_board_course_foundation.md`;
- `lore_source_pack.md`;
- `lore_competency_table.md` (источник candidate IDs, но не production catalog
  v2);
- `lore_project_bible.md`;
- `lore_macro_arc.md`.

Исторические `harness/tasks/review/**` никогда не используются как текущий
source of truth.

## 4. Минимальный набор артефактов

Pipeline поддерживает пять рабочих сущностей и два control artifacts.
Canonical paths фиксируются до любых lesson writes:

| Роль | Canonical path | Состояние на Phase A |
|---|---|---|
| Story Blueprint | `docs/methodology/lore_v2/lore_story_v2.md` | `rebuild_required` после `LV2-DEC-005` |
| Competency Catalog v2 — control input | `docs/methodology/lore_v2/lore_competency_catalog_v2.md` | **не создан; hard blocker Phase B** |
| Trace + Continuity Ledger | `docs/methodology/lore_v2/lore_trace_continuity_v2.json` | создаётся после решения о новой геометрии |
| Lesson Source / prototype package | Mode-specific paths из §4.3 | не создаётся до Approval 1 и mode decision |
| Decision Log | `docs/methodology/lore_v2/lore_v2_decisions.md` | существует |
| Issue Register | `harness/lore-v2/issues.json` | создаётся перед Phase B |
| Ledger schema — control artifact | `harness/schemas/lore-trace.schema.json` | **не создан; hard blocker Phase B** |
| Validator — control artifact | `scripts/check-lore-v2.mjs`, команда `npm run check:lore-v2` | **не создан; hard blocker Phase B** |

Отсутствующие control artifacts не маскируются prose-проверкой: это
намеренная остановка между согласованием истории и производством уроков.

Competency Catalog v2 обязан иметь для каждой строки:

```text
production_id
framework_version
official_topic_id
official_result_layer
official_source_ref
source_text_or_hash
observable_action
check_type
safety_class
status
supersedes
```

Стабильная ссылка строится по схеме вроде `AFC2026-2.4-U-03`, где указаны
версия рамки, тема, слой `Z/U/A` и номер результата. Approval 2 блокируется,
если slice использует catalog gap; Phase C блокируется, пока gaps не закрыты
для всего производимого Level.

### 4.1. Story Blueprint

Один human-readable документ `lore_story_v2.md` содержит:

- pitch и логлайн;
- героя, мир, recurring NPC и предметную continuity;
- 5-level arc;
- 20 Section treatments;
- emotional function и четыре лёгких lesson beats каждого Section;
- mapping на 20 официальных взрослых тем;
- candidate production IDs, safety tags и gaps;
- решения для approval.

Отдельные Source Pack, Project Bible, Macro Arc, Section Grid и Emotional Model
для v2 не создаются.

### 4.2. Trace + Continuity Ledger

После approval истории создаётся одна структурированная таблица, а не набор
prose-матриц. JSON содержит минимум collections `lessons[]`, `claims[]` и
`continuity[]`.

Минимальные поля:

```text
lesson_id
story_beat_id
official_topic_id
primary_competency_id
official_source_ref
user_action
check_type
emotion_function
hero_state_before
hero_state_after
npc_state_change
open_hook
safety_tag
factual_stability
age_handling
minor_safe_external_case
minor_action_boundary
status
```

`claims[]` хранит обновляемые фактические утверждения на уровне claim, а не
один источник на весь Lesson:

```text
claim_id
lesson_id
content_location
claim_summary
stability: durable | jurisdiction-specific | time-sensitive | interpretive
jurisdiction
sources[]:
  source_id
  source_type: official_primary | official_secondary | standard | peer_reviewed | other_approved
  source_title
  source_url_or_locator
  source_effective_on
  relation: supports | limits | conflicts
verified_on
source_owner
reviewer
reviewer_type: financial_sme | legal | tax | pension | public_services | methodology | source_freshness
review_tool_and_version
recheck_on
recheck_trigger
fallback: lookup_skill | durable_only | omit_claim | block_lesson
fallback_detail
source_strength_exception_reason
status: draft | verified | stale | disputed | blocked | retired
```

Один claim может ссылаться на несколько поддерживающих или конфликтующих
источников; конфликт не моделируется дублированием несвязанных claims.
Для `jurisdiction-specific` или `time-sensitive` claim со статусом `verified`
schema требует минимум один `official_primary` source. Исключение допустимо
только с `source_strength_exception_reason` и профильным reviewer type.

`fin-literacy-expert` или назначенный SME может быть reviewer, но не считается
accountable `source_owner` автоматически. High-risk Lesson требует независимый
SME review даже при отсутствии числового claim.

Ledger создаётся с первого vertical slice и обновляется после каждого Section.
Он является единственным источником mapping и continuity.

### 4.3. Lesson Source

Один lesson source объединяет прежние `Lesson Card` и `Screen Script`:

- lesson design brief;
- story beat и место в continuity;
- одна главная competency ID;
- наблюдаемое действие и критерий;
- эмоциональная функция;
- source/safety metadata;
- восемь экранов или другой approved runtime contract;
- QA notes.

Для текущего content model используется
`skills/finpulse-lesson-methodologist`; factual/safety review выполняет
`fin-literacy-expert`, редактуру — `finpulse-content-editor`.

Путь зависит от явно выбранного режима:

- prototype: `harness/artifacts/<task-id>/lore-v2/<section-id>/**`;
- seed/publish: source и seed roots фиксируются в preflight после проверки
  loader/API compatibility; filesystem directory не выводится автоматически
  из runtime slug.

Prototype artifacts не являются Lesson Source по contract
`finpulse-lesson-methodologist` и не создаются этим skill, пока его contract не
будет расширен.

### 4.4. Issue Register

Все narrative, methodology, emotion, source и UX-аудиты пишут проблемы в один
реестр:

```text
issue_id | scope | lens | severity | evidence | required_fix | owner | status
```

Отдельные длинные audit reports создаются только по запросу человека.

### 4.5. Decision Log

Одно решение записывается один раз:

```text
decision_id | approved_on | scope | decision | rationale | supersedes | approvers
```

`PROJECT_STATE` даёт ссылку на решение, а не копирует его целиком.

Approval status имеет один из трёх enum:
`approved | approved_with_blockers | changes_requested`. Для каждого blocker:

```text
gap_id | required_change | owner | blocking_scope | due_before | status |
prototype_creation_allowed | blocks_approval_2 | blocks_seed_publish
```

## 5. Lean pipeline: четыре фазы

### Фаза A. Story Blueprint

**Цель:** доказать, что история работает одновременно как драма,
образовательная система и безопасный продукт.

**Входы:**

- официальная взрослая рамка;
- продуктовые и методические ограничения;
- approved product choices, которые команда сознательно переносит в v2;
- результаты независимых read-only аудитов.

**Работа:**

1. Сформулировать внешнюю цель, ложное убеждение, ставки, часы и финальный
   выбор героя.
2. Построить причинную 5-level arc.
3. Распределить все 20 официальных взрослых тем по 20 Sections.
4. Для каждого Section задать ситуацию, emotional function, наблюдаемое
   действие, четыре lesson beats, NPC, Board contribution, safety и bridge.
5. Провести narrative, competency, emotion-safety и investor-readability
   audits.
6. Встроить в Story Blueprint короткий investor synopsis и карту 20 событий;
   это derived view того же канона, а не отдельный source of truth.

**Выход:** `lore_story_v2.md`.

**Approval 1 — Story:**

- утверждены premise, cast, arc и Section treatment;
- утверждён ограниченный claim о соответствии рамке;
- приняты или возвращены на пересмотр object metaphors;
- закрыты возрастная и privacy-границы;
- структурные gaps competency IDs назначены на исправление;
- разрешён ранний vertical slice.

Результат фиксируется как `approved`, `approved_with_blockers` или
`changes_requested` с `decision_id`, `approved_on`, `approvers` и ссылками на
blockers. Условное одобрение object metaphors до visual proof остаётся
blocker, а не считается закрытым решением.

Если object metaphors одобрены условно, Decision Log обязан создать
`GAP-VIS-OBJECTS` с `blocking_scope: any visual Phase B artifact` и
`due_before: visual smoke`.

### Фаза B. Early Vertical Slice

**Цель:** проверить реальный опыт до производства остальных Sections.

**Preflight до любых writes:**

```text
production_mode: prototype | seed | publish
v2_runtime_relation: coexist | replace
runtime_target: unresolved | existing_program_new_levels | unpublished_fixture | new_program
v2_program_slug:
v2_level_slug_directory_map:
v2_id_prefix:
section_slug_policy:
lesson_slug_policy:
card_id_policy:
approved_source_root:
approved_seed_root:
loader_api_compatibility_evidence:
```

Для текущего отдельного v2 значение `v2_runtime_relation` по умолчанию —
`coexist`, но `runtime_target` по умолчанию остаётся `unresolved`: coexist
означает только запрет менять v1 IDs, paths и published content, а не выбирает
архитектуру второго Program или новых Levels. `replace`, `new_program` и любое
изменение loader/API/content model требуют нового explicit human decision и,
при необходимости, ADR.

Режимы:

- **prototype** — только
  `harness/artifacts/<task-id>/lore-v2/**`; не меняет `docs/levels/**`,
  `src/content/**` или DB и не вызывает `finpulse-lesson-methodologist`, пока
  его contract не расширен;
- **seed** — обязательная пара source Markdown + seed JSON через
  `finpulse-lesson-methodologist`, ровно восемь экранов, отдельные v2 IDs,
  slugs и paths; DB не публикуется;
- **publish** — полный seed workflow плюс отдельное явное DB promotion и
  `npm run check:content:db`.

Seed и publish запрещены до одобрения изолированного v2 namespace. Любой режим
Phase B запрещён, пока не созданы и не проходят Competency Catalog v2, ledger
schema и `npm run check:lore-v2` из раздела 4.

**Scope:**

- один типовой Section из четырёх Lessons;
- один отдельный high-risk lesson probe, если типовой Section не содержит
  кредита, инвестиций, страхования, налогов, валюты или другого
  source-sensitive материала.

**Работа:**

1. Создать четыре lesson briefs и trace rows.
2. Создать artifacts строго по выбранному mode: prototype package либо парные
   source Markdown + seed JSON; source-only Lesson через production skill не
   допускается.
3. Проверить 3–5 минут, одну мысль на экран, понятность действия,
   narrative continuity и эмоциональную безопасность.
4. Выполнить SME fact/source/advice review.
5. Протестировать в реальном renderer или в согласованном прототипе.
6. Обновить шаблон урока и Story Blueprint, если slice выявил системный
   дефект.

**Approval 2 — Vertical Slice:**

- четыре урока образуют локальную арку;
- история не превращается в лекцию;
- competency действительно проверяется;
- эмоциональный слой не является терапией или диагностикой;
- source metadata достаточно для публикации;
- runtime способен выразить задумку либо зафиксирован отдельный product/ADR
  blocker;
- high-risk probe проходит SME review.

Без Approval 2 массовое производство запрещено.

### Фаза C. Batch Production

**Цель:** производить Section за Section без расхождения канона.

**Entry guard:**

- status Approval 2 = `approved`;
- `production_mode` равен только `seed` или `publish`;
- изолированный v2 namespace и loader/API compatibility утверждены;
- Competency Catalog не имеет open gaps для целевого Level;
- `check:lore-v2 -- --profile slice` проходит для production representation;
- если одобренный slice был prototype-only, тот же slice сначала пересобран
  как синхронная пара source Markdown + seed JSON через
  `finpulse-lesson-methodologist`, повторно проверен и получил Approval 2 уже
  для production representation.

Approval 2 чистого prototype подтверждает образовательную идею, но никогда не
разрешает mass production.

**Единица пакета:** четыре Lessons одного Section.

**Порядок пакета:**

1. Claim task и write set.
2. Прочитать актуальные Story Blueprint и trace/continuity state.
3. Подготовить четыре lesson sources.
4. Запустить `fin-literacy-expert` для factual/safety review.
5. Запустить `finpulse-content-editor` после структурного прохода.
6. Синхронизировать source, runtime и ledger, если runtime входит в scope.
7. Выполнить mode-aware проверки из раздела 6.3.
8. Независимый reviewer закрывает issues уровня `critical/high`.

После четырёх Sections выполняется Level audit:

- причинность и изменение героя;
- развитие NPC и открытых hooks;
- progression сложности;
- coverage и отсутствие повторов;
- object/Board semantics;
- source freshness и safety;
- отсутствие filler Lessons.

Обычный пакет не требует отдельного human gate. Человек подключается только по
exception triggers из раздела 8.

### Фаза D. Final Synthesis and Handoff

**Цель:** доказать целостность и готовность всей версии, а не только отдельных
пакетов.

**Работа:**

1. Holistic narrative continuity audit.
2. Lesson-level coverage audit против официальной рамки и production IDs.
3. SME fact/safety/source-freshness audit.
4. Emotional differentiation и no-diagnosis audit.
5. UX/length/accessibility audit.
6. Sync source Markdown, seed JSON, published content и trace ledger в
   разрешённом production scope.
7. Обновить investor synopsis из Phase A и собрать две derived views из одного
   канона:
   - короткий investor deck;
   - методический review packet.

**Approval 3 — Release / Handoff:**

- все critical/high issues закрыты;
- coverage claim соответствует фактической traceability;
- time-sensitive claims имеют source/date/reviewer или заменены lookup skill;
- история читается как одна арка;
- runtime и source синхронизированы;
- unresolved decisions перечислены явно.

Пользовательская аналитика и postproduction metrics не входят в authoring
pipeline. Они требуют отдельного product/privacy decision.

## 6. Контракты Section и Lesson

### 6.1. Section Blueprint

Минимальные поля Section:

```text
section_id
level_function
official_topic_id
story_pressure
old_reaction
consequence
emotion_function
possible_signal
new_financial_action
four_lesson_beats
primary_npc
npc_relationship_change
board_contribution
bridge
candidate_competencies
safety_tag
factual_stability
source_update_requirement
```

Проверка: если убрать financial IDs, у Section всё равно должны оставаться
цель, препятствие, выбор, последствие и изменение отношений. Если убрать
сюжет, всё равно должно оставаться проверяемое финансовое действие. Оба теста
обязательны.

### 6.2. Lesson Brief

Минимальные поля Lesson:

```text
lesson_id
place_in_section_arc
story_event
hero_choice
primary_competency_id
official_source_ref
observable_user_action
success_or_acceptance_criterion
emotion_in_scene
financial_risk
source_and_stability
personal_data_boundary
age_handling
minor_safe_external_case
minor_action_boundary
board_or_continuity_change
next_beat
screen_plan
```

Правила:

- одна главная competency ID на Lesson;
- вторичные ID — только фон;
- `установка` проверяется как `proxy-check`, не как сформированное поведение;
- personal reflection не имеет correct answer;
- high-risk Lesson не готов без source/reviewer;
- story beat не может существовать только ради перехода к следующей теории.

Для кредита, инвестиций, налогов и договоров несовершеннолетний работает
только с внешним учебным сценарием: никаких личных призывов оформить,
рассчитать «для себя» или совершить юридически значимое действие.

### 6.3. Mode-aware checks

Перед handoff каждого production package выполняются:

```text
npm run check:lore-v2 -- --profile <blueprint|slice|level|release>
npm run check:content
npm run test:run -- src/content/program.test.ts
git diff --check
```

- `npm run check:content:db` запускается только в publish mode;
- для vertical slice обязателен renderer или Browser smoke;
- для любого mutating task `npm run verify` всегда хотя бы запускается;
  известный DB-environment failure фиксируется явно, а не превращается в
  молчаливый skip; seed/publish не имеют исключения, read-only audit не обязан
  запускать baseline;
- prototype mode не запускает content checks для несуществующего runtime, но
  обязан пройти `check:lore-v2 -- --profile slice`, schema validation и visual
  smoke выбранного прототипа.

Validator `check:lore-v2` должен проверять:

- referential integrity IDs и отсутствие v1 IDs/paths;
- одну primary competency на Lesson и canonical `official_source_ref`;
- safety enums, age boundaries и claim metadata;
- consequence, NPC change и bridge каждого Section.

Профили не требуют несуществующие строки раньше времени:

- `blueprint` — в Story ровно 5 Levels, 20 Sections и по 4 candidate beats;
- `slice` — полный declared slice и probe, но не все 80 ledger rows;
- `level` — полная геометрия и закрытые gaps только производимого Level;
- `release` — полные `5 × 4 × 4`, все source refs и release invariants.

### 6.4. Правило синхронизации канона

- wording и screen detail меняют только Lesson Source и парный runtime;
- изменение события, consequence, official topic, emotion function, NPC state
  или bridge обновляет Story Blueprint и ledger;
- материальное изменение approved Section treatment запускает exception review;
- ledger не может молча переопределить Story Blueprint.

## 7. Независимые audit lenses

| Lens | Главный вопрос | Blocking defect |
|---|---|---|
| Narrative | Есть ли причина, выбор, последствие и изменение отношений? | Тема заменила событие; герой обнулил опыт; hook не вызван предыдущим действием. |
| Competency | Тренируется ли заявленная компетенция наблюдаемым действием? | Чтение вместо действия; несколько главных компетенций; gap без решения. |
| Financial safety | Точно ли объяснено и не стало ли объяснение советом? | Персональный выбор, обещание результата, число без source/date, слабый источник. |
| Emotion safety | Эмоция — ситуативный сигнал или ярлык пользователя? | Диагноз, психотип inference, обязательная интимная рефлексия, обещание «исправить» эмоцию. |
| UX / runtime | Понятно ли действие и выражает ли его текущая механика? | Неподдержанная mechanic, длинный экран, неясный критерий, личные данные без необходимости. |
| Investor readability | Понятны ли человеческая проблема, ставки и отличие продукта без внутренней gate-терминологии? | Пакет читается как документация агентов, а не как продуктовая история. |

Аудиторы возвращают issues, а не переписывают канон молча.

## 8. Exception triggers для human review

Работа останавливается и возвращается человеку, если нужно:

1. изменить premise, 5-level arc, recurring cast или финал;
2. изменить геометрию `5 × 4 × 4`;
3. сменить версию официальной рамки или Competency Catalog;
4. изменить mapping `official topic <-> Section`;
5. материально изменить approved событие, consequence, bridge, emotional
   function или NPC state Section;
6. заменить approved object pair или придать ей материальный смысл;
7. добавить новую runtime mechanic, card type, schema или архитектурную
   зависимость;
8. опубликовать high-risk утверждение без надёжного источника;
9. назначить официальной теме компетенцию, которой нет в approved catalog;
10. перейти от образования к персональному финансовому, налоговому,
   инвестиционному или юридическому решению;
11. собирать, анализировать или раскрывать личные финансовые/эмоциональные
   данные;
12. вводить психотип, диагностику, scoring, HR analytics или employer access;
13. менять возрастную границу или предлагать несовершеннолетнему adult-finance
    действие;
14. продолжить, когда validation или independent review выявили unresolved
    `critical` или `high` defect.

## 9. Source-update protocol

Полный enum стабильности:

- `durable` — механизм, устойчивый к обычному обновлению продукта или нормы;
- `jurisdiction-specific` (`J`) — зависит от юрисдикции;
- `time-sensitive` (`T`) — зависит от даты, версии правила, сервиса или
  интерфейса;
- `interpretive` — методический ориентир, который нельзя выдавать за норму.

Сокращение `J/T` в Story Blueprint означает один или оба изменяемых класса,
но не заменяет точное значение claim в ledger. Каждый проверяемый факт хранится
отдельной записью `claims[]` по schema раздела 4.2; lesson-level scalar source
metadata запрещена как недостаточная.

`source_owner` отвечает за жизненный цикл утверждения. `reviewer` независимо
проверяет его; skill или инструмент не становится owner по факту запуска.

Recheck triggers:

- новая production-версия;
- изменение нормативного акта или официального сервиса;
- наступление `recheck_on`;
- расхождение источников;
- жалоба reviewer или пользователя на неактуальность.

Для каждого trigger хранится и дата, и машинно/человеко-читаемое условие
`recheck_trigger`. High-risk Lesson повторно проходит SME review даже если все
его claims помечены `durable`.

Fallback при отсутствии подтверждения:

1. заменить число или правило навыком найти актуальное значение;
2. оставить durable-механику;
3. удалить утверждение;
4. не публиковать Lesson до решения.

## 10. Работа агентов

Вместо 18 копируемых промптов используется один task packet:

```text
Objective:
Canonical inputs and versions:
Target Level / Section / Lesson:
Allowed write set:
Do not touch:
Primary competency and official source ref:
Story state before:
Expected story state after:
Safety/source requirements:
Success criteria:
Required checks:
Return packet:
```

Task packet дополняет, но никогда не заменяет `AGENTS.md`, required project
context, Required Context выбранного skill и parallel-agent protocol.

Параллельная работа допустима только при непересекающихся write sets. Shared
Story Blueprint и ledger изменяет orchestrator после получения read-only
пакетов. Любое изменение канона проходит independent verifier.

## 11. Миграция прежнего pipeline

| Прежний этап / артефакт | Новое место |
|---|---|
| Foundation + Source Pack + Project Bible + Macro Arc | Read-only provenance; перенесённые решения живут только в Story Blueprint |
| Section Grid + Emotional Model | Story Blueprint, 20 Section treatments |
| Traceability Matrix + Continuity Log | Единый structured Trace + Continuity Ledger |
| 80 Lesson Cards + 80 Screen Scripts | Один Lesson Source на урок |
| Vertical Slice + Template Revision | Фаза B и её exit actions |
| Mass Generation | Фаза C, Section packages |
| Continuity / Competency / Emotion / UX audits | Независимые lenses, один Issue Register |
| Final Editing + Assembly | Фаза D |
| 18 role prompts | Один task packet + project skills |
| 10 human gates | Approval 1, Approval 2, Approval 3 + exception review |
| Postproduction analytics | Отдельное будущее product/privacy решение |

Ни один ранее утверждённый выбор не удаляется из provenance молча. Решение,
перенесённое в v2, фиксируется в `lore_story_v2.md`; не перенесённое решение не
управляет v2.

## 12. Definition of Done pipeline

Pipeline работает, если:

- команда знает единственный источник на каждом слое;
- историю можно согласовать одним пакетом до написания уроков;
- vertical slice появляется до массовой генерации;
- у каждого Lesson есть сюжет, emotional function, primary competency и
  observable action;
- mapping и continuity не расходятся между prose-файлами;
- high-risk факт не публикуется без source/date/reviewer;
- claim-level source lifecycle имеет owner, effective/verified dates и recheck
  trigger;
- аудит создаёт единый issue register;
- human gates проверяют решения, а не количество артефактов;
- v1 и v2 не смешиваются;
- prototype, seed и publish имеют разные write boundaries;
- production остаётся в границах
  `Program -> Level -> Section -> Lesson -> Card`.

## 13. Следующий шаг

Текущий артефакт Фазы A — `lore_story_v2.md`. До Approval 1 не создаются Lesson
Sources или runtime-изменения.

После Approval 1 порядок обязателен:

1. Полностью заполнить Phase B preflight из раздела 5: mode, relation,
   `runtime_target`, slug-directory map, ID/slug policies, source/seed roots и
   loader/API compatibility evidence. `runtime_target` остаётся `unresolved`
   до доказательства совместимости.
2. Создать и утвердить Competency Catalog v2, ledger schema, Issue Register,
   Decision Log и `npm run check:lore-v2`.
3. Выбрать один типовой Section для vertical slice и один high-risk Lesson для
   отдельного source/safety probe.
4. Выполнить mode-specific workflow без записи в v1 paths.

До прохождения этого preflight не создаются 80 Lesson Cards, Screen Scripts,
seed JSON или DB content.
