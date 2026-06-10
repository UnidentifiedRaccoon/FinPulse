# T-109 — Methodology level/section source update

Status: review

## Goal

Promote the latest methodologist-provided methodology document as the active source and align its JSON examples with the accepted methodical structure:

```txt
Program -> Level -> Section -> Lesson -> Card
```

## Intended write set

- `docs/methodology/METHODOLOGY.09-06.2026.docx`
- `docs/methodology/METHODOLOGY.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-109-methodology-level-section-source.md`

## Changes

- Replaced the repository DOCX with the latest Google Doc export.
- Updated the eight JSON example `sourceSection` placeholders from `docs/modules/t1-start/unit_x/lesson_x.md` to `docs/levels/level_1/sections/section_x/lesson_x.md`.
- Updated the final placeholder QA line from `sample/unit_x/lesson_x` to `sample/level_x/section_x/lesson_x`.
- Removed the dangling Google Docs `customXML/item1.xml` relationship from the DOCX package without changing `word/document.xml`.
- Regenerated `docs/methodology/METHODOLOGY.md` from the corrected DOCX so the active text source matches the document.

## Verification

- Confirmed old placeholders are absent from DOCX `word/document.xml`.
- Confirmed new `docs/levels/level_1/sections/section_x/lesson_x.md` appears 8 times in DOCX.
- Confirmed `sample/level_x/section_x/lesson_x` appears once in DOCX.
- `unzip -t docs/methodology/METHODOLOGY.09-06.2026.docx`
- `python-docx` opens the corrected DOCX.
- Rendered DOCX to 47 PNG pages and PDF with `render_docx.py`.
- Visually inspected pages 40-44 containing JSON examples.
- Compared final render page hashes against the pre-cleanup render; all 47 page images match.
- Confirmed generated Markdown has no `T1..T5`, `тир`, `юнит`, `модуль`, `unit_x`, or `video` terms and keeps `Уровень`, `Раздел`, and the new JSON paths.

## Risks / Follow-up

- Runtime code and content model still use the technical `Module -> Unit -> Lesson -> Card` graph. A later alignment task should decide whether to rename the runtime model or document an explicit mapping from methodical `Level/Section` to technical `Module/Unit`.
- Video card support still exists in code and `docs/CONTENT_MODEL.md`; the updated methodology says multimedia cards are not used at the current stage.
