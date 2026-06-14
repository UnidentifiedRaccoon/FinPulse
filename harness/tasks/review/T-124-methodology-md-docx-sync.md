# T-124 — Methodology MD/DOCX sync

## Status

review

## Goal

Keep `docs/methodology/METHODOLOGY.md` as the active central Markdown source
for agents, while syncing its methodology content to
`docs/methodology/METHODOLOGY.10-06.2026.docx`.

## Intended Write Set

- `docs/methodology/METHODOLOGY.md`
- `harness/tasks/review/T-124-methodology-md-docx-sync.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Non-Goals

- Do not change runtime JSON content.
- Do not change the DOCX artifact.
- Do not change UI, API, routes, or content validation behavior.
- Do not reverse the repository convention that agents read `METHODOLOGY.md`
  as the central working methodology source.

## Plan

1. Compare normalized DOCX text against the Markdown content body.
2. Patch only real content drift in `METHODOLOGY.md`.
3. Re-run normalized comparison and focused verification.
4. Move the task to review and update project state.

## Result

`docs/methodology/METHODOLOGY.md` remains the active central Markdown source for
agents, but its methodology body now matches
`docs/methodology/METHODOLOGY.10-06.2026.docx` after normalization. The
repository-specific Markdown prologue is intentionally preserved.

Synced differences:

- Screen 7 wording now matches the DOCX `variants` + `customOption.label`
  language throughout the early lesson architecture section.
- The emergency-fund cross-section example now states the DOCX rule for choosing
  one first step from two ready `variants` or custom text.
- Section `12.3` now matches the DOCX structure: `Карта урока для авторов
  (шаблон)` contains the preliminary `lesson design brief`; there is no separate
  `12.4` section in the Markdown body.

## Checks

- Normalized DOCX-vs-MD content comparison: passed with zero differences.
- `npm run check:content` — passed.
- `npm run verify` — reached tests after content validation, runtime import
  guard, typecheck, and lint; failed because backend tests require
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL` in
  this shell.
