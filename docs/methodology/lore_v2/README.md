# Story v2 — единый источник истины

**Статус:** active source boundary после решений `LV2-DEC-005` и
`LV2-DEC-006` от 2026-07-26.

Эта папка — единственная репозиторная зона, из которой разрешено собирать и
пересобирать Story v2. Активные документы Story v2 не создаются рядом в
`docs/methodology/` и не восстанавливаются из исторических task packets.

Глобальные продуктовые и технические границы остаются в `docs/PRODUCT.md`,
`docs/ARCHITECTURE.md`, `docs/CONTENT_MODEL.md`, `docs/methodology/AUTHORING.md`
и `docs/methodology/METHODOLOGY.md`. Они ограничивают производство приложения,
но не являются альтернативным каноном истории.

## Текущая иерархия источников

1. `lore_v2_decisions.md` фиксирует человеческие решения, открытые вопросы и
   то, какой документ имеет полномочия на текущей фазе. `LV2-DEC-006`
   утверждает design baseline `6 Levels / 22 Sections / 48 Lessons` без
   разрешения на производство.
2. `lore_story_v2_book.md` — актуальный шестиглавный narrative source для
   пересборки нового Story Blueprint. Соответствие Chapter ↔ Level действует
   только для этой истории.
3. `adult_financial_competencies_2026.docx` — исходный актуальный артефакт
   взрослой рамки компетенций. Его SHA-256:
   `3d16fbd9ddf28c87e40b017c3ed9a892bc1641a40da80ed88292641faf62404a`.
4. `adult_financial_competencies_2026.md` — lossless рабочее представление
   того же DOCX: 4 группы, 20 предметных областей, 60 category blocks,
   120 level blocks и 576 формулировок в исходном порядке.
5. `lore_story_v2.md` — прежний Blueprint 1.4, сохранённый как материал для
   пересборки со статусом `rebuild_required`. Его геометрия `5 × 4 × 4` и
   число 80 больше не являются утверждённой целью.
6. `lore_story_v2_book_competency_coverage.html` — актуальный диагностический
   отчёт по шестиглавной книге: 576 строк рамки сопоставлены с 190 фрагментами
   истории, а адреса 509 доказательств синхронизированы с текущими главами.
   Наличие всех строк каталога не доказывает их полное покрытие, не выбирает
   программу уроков и не переопределяет книгу или рамку.

## Рабочие и review-документы

- `lore_level_1_competency_emotion_map.md` — review-карта старой геометрии
  Level 1; требует пересмотра относительно baseline `6 / 22 / 48`.
- `lore_lesson_screen_model_review.md` — кандидат модели экранов; функции
  экранов можно обсуждать отдельно, но числовая геометрия документа больше не
  считается принятой.
- `production_model_financial_lore_pipeline.md` — прежний production pipeline;
  остаётся процедурной основой, но его проверки, завязанные на 80 уроков,
  должны быть обновлены после решения о новой геометрии.

## Текущая остановка

`LV2-DEC-006` закрывает `GAP-GEOMETRY-V2` только как geometry blocker:
утверждены шесть Levels, 22 Sections и 48 учебных действий как design
baseline. Несимметричное распределение намеренно; выравнивать его filler-ом
нельзя. Названия и wording Lessons, Cards, feedback и assessment не
утверждены, а материальный split/merge требует нового human decision.

Пакеты B/C ещё не утверждены. До отдельных решений запрещены:

- substantive rewrite `lore_story_v2.md` и создание production IDs;
- создание Lesson Sources, Lessons, Cards, screen scripts и Trace + Continuity
  Ledger как production artifact;
- изменения runtime JSON, seed content, API, схем приложения или DB content v2;
- использование coverage HTML как программы уроков или как доказательства
  полного покрытия 20 тем, 120 level blocks либо 576 строк каталога.

Пять raw catalog gaps и пять финансовых source gates сохраняются раздельно.
Coverage допускается только selective/evidence-backed. Следующие пакеты не
начинаются автоматически из факта утверждения геометрии.

## Неактивные источники

Файлы `finpulse_board_course_foundation.md`, `lore_source_pack.md`,
`lore_competency_table.md`, `lore_project_bible.md` и `lore_macro_arc.md` за
пределами этой папки остаются read-only provenance. Опубликованные шестнадцать
уроков v1 также не являются входом для Story v2.
