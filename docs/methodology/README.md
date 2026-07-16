# FinPulse Methodology

Active source:

- `METHODOLOGY.10-06.2026.docx` — current methodologist-provided DOCX source.
- `METHODOLOGY.md` — central target methodology imported from the
  methodologist-provided Google Doc / DOCX. Target-only diagnostics,
  psychotypes, personalization, scoring, streaks and rewards are not inputs to
  v2 when stricter `PRODUCT.md`, `AUTHORING.md` or Story Blueprint boundaries
  exclude them.
- `AUTHORING.md` — current MVP adaptation rules for agents and editors.
- `adult_financial_competencies_2026.md` — local normalized adult competency
  catalog used for course topic alignment and competency mapping.
- `lore_story_v2.md` — canonical Story Blueprint v2 after Approval 1
  `approved_with_blockers`, created independently of the ready 16-lesson v1
  content. It contains the investor pitch, narrative canon, five-level arc,
  causal map of twenty Sections, emotion-safety profile, framework alignment,
  and structural gaps.
- `lore_v2_decisions.md` — single decision log for Approval 1, later human
  amendments and remaining blockers.
- `lore_story_v2_book.md` — derived five-chapter Sasha story for external
  review; it does not override the Story Blueprint.
- `lore_level_1_competency_emotion_map.md` — review map of the four Level 1
  topics, sixteen lesson actions, emotions, safety limits, and catalog gaps.
- `lore_lesson_screen_model_review.md` — recommended Model B for a Level and
  eight lesson-screen functions; still awaiting a separate human decision.
- `production_model_financial_lore_pipeline.md` — lean v2 production workflow:
  one Story Blueprint, an early vertical slice, Section-sized batches, one
  trace/continuity ledger, independent audits, and three approvals. It is
  active after Approval 1; Phase B is intentionally blocked until the screen
  model decision, v2 competency catalog, isolated namespace, schema and
  validator, Issue Register, and Trace + Continuity Ledger exist.
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
  `lore_competency_catalog_v2.md` is required before Phase B.

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
