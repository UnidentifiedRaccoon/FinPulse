# T-175 — Polish lessons 9-16 copy

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Branch/worktree: current workspace

## Goal

Apply a deeper `finpulse-content-editor` pass to Level 1 lessons 9-16 while
preserving the eight-screen lesson architecture, approved facts, source links,
and education-vs-advice boundaries.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/finpulse-content-editor/references/editorial-rubric.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `skills/fin-literacy-expert/references/misconceptions.md`
- `skills/fin-literacy-expert/references/source-index.md`
- `skills/fin-literacy-expert/references/fact-base.md`

## Intended write set

- `docs/levels/level-1-start/sections/risk-and-return/lesson_01_thirty-percent-without-risk-red-flag.md`
- `docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md`
- `docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md`
- `docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_03_credit-by-psk.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md`
- `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`
- `src/content/levels/level_1_start/sections/section_04_financial_environment.json`
- `harness/tasks/active/T-175-polish-lessons-9-16.md`
- `harness/tasks/review/T-175-polish-lessons-9-16.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `tmp/content-db-export-before-t175/`

## Out-of-scope

- API, schema, renderer, UI, backend, admin, auth, analytics, rewards,
  diagnostics, scoring, personalized recommendations, and production DB changes.
- Changing lesson structure, ids, slugs, source paths, answer ids,
  `correctOptionId`, `saveKey`, statistics values, or source links.
- Reintroducing `Module` or `Unit` as active architecture terms.

## Plan

1. Deep-review У1.9-У1.16 against the content editor rubric and financial
   safety boundaries.
2. Apply synced source Markdown and runtime JSON copy improvements.
3. Preserve the Level 1 contract and protected structural fields.
4. Run content validation, focused content tests, targeted contract smoke, and
   diff checks.
5. Seed/check the local content DB if reachable after exporting a backup.
6. Update this task, workboard, and project state.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/content/program.test.ts`
- [x] Targeted Node smoke for lessons 9-16
- [x] `git diff --check`
- [x] `npm run content:pull tmp/content-db-export-before-t175`
- [x] `npm run content:seed`
- [x] `npm run check:content:db`

## Result packet

- Files changed:
  - Source Markdown for У1.9-У1.12 under `docs/levels/level-1-start/sections/risk-and-return/`.
  - Source Markdown for У1.13-У1.16 under `docs/levels/level-1-start/sections/financial-environment/`.
  - Runtime seed fixtures `section_03_risk_and_return.json` and `section_04_financial_environment.json`.
  - `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, and this task file.
- Content editor pass:
  - Deep-polished learner-facing wording across lessons 9-16 while keeping card sequence, ids, source refs, answer keys, statistics values, and source links unchanged.
  - Reduced repetitive disclaimer phrasing such as `не решает за тебя`, replaced remaining source-visible `shortcut`, clarified first-step questions, and kept personal screens non-evaluative.
  - Verified У1.12 keeps the inflation-source vs deposit-rate distinction.
- Financial safety:
  - Risk/return, inflation, bank rights, key terms, credit/ПСК, and current-data copy stays educational.
  - No product choice, personal financial/legal/tax advice, promised outcome, new time-sensitive number, or new source claim was added.
  - The technical `saveKey` value `official_sources_shortcut_barrier` remains unchanged because protected structural keys were out of scope.
- Checks run:
  - `npm run check:content` — passed.
  - `npm run test:run -- src/content/program.test.ts` — passed, 1 file / 6 tests.
  - Targeted Node smoke for lessons 9-16 — passed: 8-card contract, screen 4 correct-answer contract, screens 6/7 custom option, source refs, and plain-text field Markdown scan.
  - `git diff --check` — passed.
  - `npm run content:pull tmp/content-db-export-before-t175` — passed.
  - `npm run content:seed` — passed; seeded 1 program, 1 level, 4 sections, 16 lessons from `src/content`.
  - `npm run check:content:db` — passed for `finpulse-learning-mvp`, 1 level, 16 lessons.
- Risks:
  - Existing unrelated dirty workspace state remains untouched.
  - `npm run content:seed` replaced local content tables after exporting a local backup to `tmp/content-db-export-before-t175`; production DB was not touched.
- Follow-up:
  - Before production publication, use the normal controlled content publication path with a fresh target-environment backup and DB content check.
