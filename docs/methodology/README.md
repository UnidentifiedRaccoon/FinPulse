# FinPulse Methodology

Active source:

- `METHODOLOGY.10-06.2026.docx` — current methodologist-provided DOCX source.
- `METHODOLOGY.md` — central target methodology imported from the
  methodologist-provided Google Doc / DOCX. Target-only diagnostics,
  psychotypes, personalization, scoring, streaks and rewards are not inputs to
  v2 when stricter `PRODUCT.md`, `AUTHORING.md` or Story Blueprint boundaries
  exclude them.
- `AUTHORING.md` — current MVP adaptation rules for agents and editors.
- `lore_v2/README.md` — единственная точка входа и authority map для активного
  Story v2-пакета после `LV2-DEC-005` и `LV2-DEC-006`.
- `lore_v2/lore_story_v2_book.md` — актуальный шестиглавный narrative source
  для пересборки нового Blueprint.
- `lore_v2/adult_financial_competencies_2026.docx` — актуальный исходный
  артефакт взрослой рамки; lossless Markdown-представление с 576 строками лежит
  рядом.
- `lore_v2/lore_story_v2_book_competency_coverage.html` — актуальный
  шестиглавный диагностический отчёт оценки покрытия всех 576 компетенций; не
  является планом уроков или заявлением о полном покрытии.
- `lore_v2/lore_story_v2.md` — прежний Blueprint 1.4 со статусом
  `rebuild_required`; его геометрия 80 уроков superseded, а текущий design
  baseline задан как `6 Levels / 22 Sections / 48 Lessons`.
- `lore_v2/lore_v2_decisions.md` — единый Decision Log, включая
  `LV2-DEC-005`, `LV2-DEC-006` и закрытие `GAP-GEOMETRY-V2` только как
  geometry blocker.
- Остальные рабочие карты и production pipeline Story v2 также находятся
  только под `lore_v2/` и требуют ревизии относительно baseline `6 / 22 / 48`.
- `CONTENT_BACKLOG.md` — active runtime coverage and deferred target-methodology
  features.

Supporting foundation and provenance:

- `finpulse_board_course_foundation.md` — read-only historical foundation of
  the retired Board/object concept. After `LV2-DEC-002` it is not the current
  Story v2 game frame and must not drive screen or prototype production.
- `lore_source_pack.md`, `lore_competency_table.md`, `lore_project_bible.md` and
  `lore_macro_arc.md` — read-only provenance of the earlier gated process.
  They do not override the v2 canon and must not be chained as active gates.
  The old Competency Table supplies candidate IDs only; a separate approved
  `lore_v2/lore_competency_catalog_v2.md` is required before Phase B and is
  not created or approved by the geometry decision itself.

Story v2 currently has no approved replacement game or meta-progress mechanic.
Sasha's calendars, personal tables, notes and documents are ordinary
scene-specific tools; the Personal Financial Navigator remains the separate
private learner artifact.

The approved educational hierarchy is Program -> Level -> Section -> Lesson ->
Card. Runtime JSON/API now use Level and Section directly. Old `module`/`unit`
names may appear in historical records only.

Previous Finzdorov/AI/personal-experience source directories were removed from
the active methodology tree. Historical task records remain under
`harness/tasks/review/**`.

Published runtime content lives in PostgreSQL JSONB. Files under
`src/content/**` are seed fixtures; methodology documents are source and
authoring guidance, not the runtime schema.
