# T-173 — Add Level 1 Lessons 10-16

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Branch/worktree: current workspace
Renumbering note: this task started as provisional `T-170`, but the repo
already has `T-170-bound-admin-preview-dialogs.md`; the content task was moved
to `T-173` to avoid duplicate task IDs.

## Goal

Prepare and locally integrate Level 1 lessons 10-16 for FinPulse:
Section 3 lessons 2-4 and Section 4 lessons 1-4.

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
- `skills/finpulse-lesson-methodologist/SKILL.md`
- `skills/finpulse-lesson-methodologist/references/output-contract.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/finpulse-content-editor/SKILL.md`
- neighboring Level 1 source Markdown and runtime JSON files
- source spreadsheet rows via Drive fetch, after Sheets API reported the file is an Office spreadsheet

## Intended write set

- `docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md`
- `docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md`
- `docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_03_credit-by-psk.md`
- `docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md`
- `src/content/levels/level_1_start/level.json`
- `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`
- `src/content/levels/level_1_start/sections/section_04_financial_environment.json`
- `harness/tasks/review/T-173-add-level-1-lessons-10-16.md`
- `harness/artifacts/T-173-add-level-1-lessons-10-16/**`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`

## Out-of-scope

- UI, backend, schema, renderer, admin, auth, analytics, rewards, diagnostics, scoring, personalized recommendations, and production DB changes.
- Current architecture terms `Module` or `Unit`; spreadsheet `Модуль` wording is adapted to `Раздел`.
- Commits, pushes, or pull requests.

## Plan

1. Confirm source rows from the spreadsheet using Sheets metadata, then Drive fetch/export fallback if needed.
2. Run methodologist passes per lesson with isolated Markdown write scopes and returned JSON lesson objects.
3. Integrate Section 3 and Section 4 JSON centrally.
4. Run content-editor polish per lesson after integration.
5. Validate file content and local DB seed/check where available.
6. Update task state, workboard, and project state.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/content/program.test.ts`
- [x] `git diff --check`
- [x] `npm run content:pull tmp/content-db-export-before-t170`
- [x] `npm run content:seed`
- [x] `npm run check:content:db`

## Result packet

- Files changed:
  - Added source Markdown for У1.10-У1.12 under `docs/levels/level-1-start/sections/risk-and-return/`.
  - Added source Markdown for У1.13-У1.16 under `docs/levels/level-1-start/sections/financial-environment/`.
  - Expanded `src/content/levels/level_1_start/sections/section_03_risk_and_return.json` to four lessons.
  - Added `src/content/levels/level_1_start/sections/section_04_financial_environment.json`.
  - Added Section 4 reference to `src/content/levels/level_1_start/level.json`.
  - Added integration/review artifacts under `harness/artifacts/T-173-add-level-1-lessons-10-16/`.
- Subagents:
  - Lesson methodologists created У1.10, У1.11, У1.12, У1.13, У1.14, У1.15, and У1.16 drafts with GPT-5.5 / xhigh.
  - Content-editor subagents reviewed each lesson after integration. У1.10, У1.11, У1.15, and У1.16 required no edits. У1.12, У1.13, and У1.14 had small copy fixes applied.
- Financial expert review:
  - Lesson drafts were grounded in official sources for Bank of Russia, Rosstat, FNS, Gosuslugi, ASV, and the financial ombudsman where relevant.
  - Time-sensitive rates, limits, and product terms were not hard-coded; lessons teach official-source lookup and product-document checks.
  - Credit, bank-rights, inflation, and official-source topics remain educational and do not give individual financial, tax, legal, or product recommendations.
- Content editor pass:
  - Applied У1.12 summary wording fix separating official inflation data from product deposit rates.
  - Applied У1.13 copy fixes for duplicate option feedback and Russian metadata wording.
  - Applied У1.14 copy fixes for duplicate option feedback and reflection guidance.
- Checks run:
  - `npm run check:content` — passed.
  - `npm run test:run -- src/content/program.test.ts` — passed, 1 file / 6 tests.
  - `git diff --check` — passed.
  - Custom Node Level 1 contract smoke for new lessons — passed.
- Local DB:
  - `npm run content:pull tmp/content-db-export-before-t170` — exported backup to `tmp/content-db-export-before-t170`.
  - `npm run content:seed` — seeded 1 program, 1 level, 4 sections, 16 lessons.
  - `npm run check:content:db` — passed for `finpulse-learning-mvp`, 1 level, 16 lessons.
- Risks:
  - Existing unrelated dirty workspace changes remain untouched.
  - Production transfer still needs the normal deploy/publication path; this task only updated local source fixtures and local DB seed.
- Production transfer notes:
  - Before production publication, export current production/published content, seed/publish the updated fixture set through the accepted content pipeline, then run `check:content:db` against the target environment.
  - Because JSON fixtures now contain 4 sections / 16 lessons, older tests or assertions expecting 3 sections / 9 lessons need to be updated as part of their owning task.
