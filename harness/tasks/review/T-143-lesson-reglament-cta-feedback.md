# T-143 — Lesson Reglament CTA And Screen 1 Feedback

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Branch/worktree: main working tree

## Goal

Align the lesson authoring regulation and active Level 1 JSON with the app's
current CTA behavior: source table `Кнопка` values should become `ctaLabel`
where they control the primary continue action, and screen 1 authoring tables
must require per-option feedback instead of one generic feedback row.

## Context

Read before starting:

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- Documents skill instructions for DOCX editing and render QA
- `src/features/lesson-reader/LessonSession.tsx`
- `scripts/check-content-json.mjs`
- current Level 1 source Markdown and runtime JSON lessons

## Intended write set

- `docs/methodology/AUTHORING.md`
- `docs/methodology/AUTHORING.lesson-reglament.docx`
- `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`
- `scripts/check-content-json.mjs`
- `harness/tasks/active/T-143-lesson-reglament-cta-feedback.md`
- `harness/tasks/review/T-143-lesson-reglament-cta-feedback.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- Learner UI behavior changes.
- API, schema, persistence, auth, or admin changes.
- Rewriting the general methodology document.
- Direct edits to Google Docs.
- Changes owned by active T-142 Node/runtime refresh.

## Plan

1. Confirm where `ctaLabel` is used in the lesson reader and validator.
2. Add missing source-backed `ctaLabel` values to active Level 1 runtime JSON.
3. Extend content validation so Level 1 cards with source `Кнопка` rows require
   matching `ctaLabel` except final screen 8, where `Завершить` is system-owned.
4. Update `AUTHORING.md` and the format-preserving DOCX regulation.
5. Run content validation, targeted audits, DOCX sanitizer/structural/render QA,
   and diff hygiene.

## Checks

- [x] Runtime CTA audit
- [x] `npm run check:content`
- [x] AUTHORING CTA/feedback audit
- [x] DOCX sanitizer
- [x] DOCX structural smoke checks
- [x] DOCX render QA
- [x] `git diff --check`
- [x] Full `npm run verify` prerequisite check

## Result packet

- Files changed: `docs/methodology/AUTHORING.md`,
  `docs/methodology/AUTHORING.lesson-reglament.docx`,
  `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`,
  `scripts/check-content-json.mjs`, `harness/**` task/state files.
- Checks run: runtime CTA audit, `node --check scripts/check-content-json.mjs`,
  `npm run check:content`, AUTHORING Markdown audit, DOCX title sanitizer,
  `unzip -t`, python-docx smoke read, DOCX render to PNG with visual QA, and
  `git diff --check` on the T-143 write set.
- Risks: full `npm run verify` was not run because this shell has no
  `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`
  configured for backend tests.
- Follow-up: run full `npm run verify` in an environment with PostgreSQL test
  URL before merging the stacked branch.
