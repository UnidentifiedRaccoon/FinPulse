# Methodology Content Backlog

Central source: `docs/methodology/METHODOLOGY.md`.

Runtime content is still JSON under `src/content/**` and must follow
`docs/CONTENT_MODEL.md`. The target methodology is broader than the current MVP;
this file tracks what is active now and what remains deferred.

## Active Runtime Content

Displayed in the learner app:

- Program: `FinPulse`
- Level: `level-1-start` — `Уровень 1 · Старт`
- Section: `money-and-operations` — `Раздел 1. Деньги и операции`
  - `where-money-goes` — `Куда уходят деньги`
  - `mandatory-and-desired` — `Обязательное и желаемое`
  - `safe-payment` — `Безопасный платёж`
  - `digital-footprint-and-protection` — `Цифровой след и защита`
- Section: `planning-and-management` — `Раздел 2. Планирование и управление`
  - `why-reserve-matters` — `Зачем нужна подушка`
  - `reserve-target-amount` — `Сколько держать в резерве`
  - `pay-yourself-first` — `Правило «сначала себе»`
  - `budget-draft` — `Бюджет-черновик`

Source package:

- Central methodology: `docs/methodology/METHODOLOGY.md`
- Scripted lesson sources:
  - `docs/levels/level-1-start/sections/money-and-operations/lesson_01_where-money-goes.md`
  - `docs/levels/level-1-start/sections/money-and-operations/lesson_02_mandatory-and-desired.md`
  - `docs/levels/level-1-start/sections/money-and-operations/lesson_03_safe-payment.md`
  - `docs/levels/level-1-start/sections/money-and-operations/lesson_04_digital-footprint-and-protection.md`
  - `docs/levels/level-1-start/sections/planning-and-management/lesson_01_why-reserve-matters.md`
  - `docs/levels/level-1-start/sections/planning-and-management/lesson_02_reserve-target-amount.md`
  - `docs/levels/level-1-start/sections/planning-and-management/lesson_03_pay-yourself-first.md`
  - `docs/levels/level-1-start/sections/planning-and-management/lesson_04_budget-draft.md`

## Removed Active Sources

The following are no longer active authoring/runtime sources:

- previous Finzdorov extracted lesson package;
- previous `finpulse_methodology` split catalog;
- previous AI/personal-experience lesson candidates;
- previous runtime level `financial-goals` and its lessons.
- previous `planning-and-management` lesson slugs `why-emergency-fund` /
  `reserve-amount`, which were prepared from older methodology and remain
  removed even though the section slug is active again with new source-backed lessons.

Historical task files under `harness/tasks/review/**` remain as project history.

## Deferred Target-Methodology Scope

| Target feature | Current handling |
|---|---|
| Sorting into categories | Supported through objective `categorization` practice cards. |
| Multiple correct choices | Supported through objective `multi_select` practice cards. |
| Matching/calculators/diaries | Still adapted into existing cards or deferred. |
| Psychotype diagnosis and adaptive feedback | Preserved in source only; no diagnosis or adaptation UI. |
| Spaced repetition and daily warmups | Deferred product scope. |
| Streaks, freeze days, gamification loops | Deferred product scope. |
| Personal financial Navigator as full product surface | Profile shows private reflection/artifact answers only. |
| Reminders and habit scheduling | Captured as saved rules only, no scheduling. |
| B2B analytics/reporting | Out of MVP scope. |

## Runtime Adaptation Rules

- Use current card types only; objective category sorting and multiple-correct
  practice should use `categorization` and `multi_select`.
- Keep `reflection`/`artifact` persistence neutral: no scores, labels, inferred
  traits, diagnostics, recommendations, or analytics.
- Keep quickly changing values as examples or lookup skills.
- Preserve methodologist scripts locally before JSON adaptation.
- Do not reintroduce old Finzdorov/AI material unless the user explicitly asks
  for an archival comparison task.
