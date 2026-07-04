# T-169 — Add Risk and Return lesson 1

Status: review
Owner: Codex orchestrator + subagents
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Completed: 2026-07-04
Branch/worktree: current workspace

## Goal

Add Level 1 Section 3 lesson 1, `«30% без риска» — красный флаг`, as source
Markdown and runtime seed JSON, then validate and seed local content DB.

## Context

Read before editing:
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
- `skills/fin-literacy-expert/references/domain-map.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `skills/fin-literacy-expert/references/fact-base.md`
- `skills/fin-literacy-expert/references/source-index.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/misconceptions.md`
- `skills/fin-literacy-expert/references/open-questions.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/finpulse-content-editor/references/editorial-rubric.md`
- Neighboring Level 1 source Markdown and seed JSON files

Spreadsheet row confirmed through Drive fetch after Sheets API failed because
the file is an Office spreadsheet:
Level 1 `Старт`, Section 3 `Риск и доходность`, lesson 1,
`«30% без риска» — красный флаг`, artifact `Правило проверки в реестрах ЦБ`,
status `Готов (прописан)`.

## Intended write set

- `docs/levels/level-1-start/sections/risk-and-return/lesson_01_thirty-percent-without-risk-red-flag.md`
- `src/content/levels/level_1_start/level.json`
- `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`
- `harness/tasks/review/T-169-add-risk-return-lesson-1.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out-of-scope

- UI/backend code.
- Existing lessons except minimal ordering/reference context.
- Production DB.
- Diagnostics, scoring, recommendations, rewards, analytics, real reminders,
  or new card mechanics.
- Runtime/docs terminology that reintroduces `Module` or `Unit` as active
  architecture.

## Result packet

- Files changed:
  - `docs/levels/level-1-start/sections/risk-and-return/lesson_01_thirty-percent-without-risk-red-flag.md`
  - `src/content/levels/level_1_start/level.json`
  - `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`
  - `harness/tasks/review/T-169-add-risk-return-lesson-1.md`
  - `harness/WORKBOARD.md`
  - `harness/PROJECT_STATE.md`
- Financial expert review:
  - Performed against `skills/fin-literacy-expert` references and official Bank
    of Russia pages for register/warning-list wording.
  - Lesson keeps `«30% без риска»` as a red flag and states that checking
    official Bank of Russia sources reduces risk but does not guarantee profit,
    safety, or suitability.
  - Unresolved facts: none.
- Content editor review:
  - `finpulse-content-editor` polished clarity, brevity, and emotional safety.
  - Markdown and JSON were kept synchronized.
  - Needs review: none.
- Checks run:
  - `npm run check:content` — passed.
  - `git diff --check` — passed.
  - `npm run content:pull tmp/content-db-export-before-t169` — passed.
  - `npm run content:seed` — passed; seeded 1 program, 1 level, 3 sections,
    9 lessons from `src/content`.
  - `npm run check:content:db` — passed; DB graph reports
    `finpulse-learning-mvp`, 1 level, 9 lessons.
- Local DB:
  - Seeded successfully from the updated seed fixtures.
  - Pre-seed backup exported to `tmp/content-db-export-before-t169`.
- Risks:
  - `npm run content:seed` replaces local content tables. This was run only
    after local backup and only against the local DB available from this shell.
  - Production DB was not touched.
- Follow-up:
  - For production transfer, commit/review the seed JSON and Markdown changes,
    then use a controlled content publication/migration path with a fresh
    `content:pull`/backup and diff review before any production replacement.
