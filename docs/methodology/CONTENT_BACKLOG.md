# Methodology Content Backlog

Central source: `docs/methodology/METHODOLOGY.md`.

Runtime content is still JSON under `src/content/**` and must follow
`docs/CONTENT_MODEL.md`. The target methodology is broader than the current MVP;
this file tracks what is active now and what remains deferred.

## Active Runtime Content

Displayed in the learner app:

- Program: `FinPulse`
- Module/tier: `t1-start` — `T1 Старт`
- Unit: `money-and-operations` — `Юнит 1. Деньги и операции`
  - `where-money-goes` — `Куда уходят деньги`
  - `mandatory-and-desired` — `Обязательное и желаемое`
- Unit: `planning-and-management` — `Юнит 2. Планирование и управление`
  - `why-emergency-fund` — `Зачем нужна подушка`
  - `reserve-amount` — `Сколько держать в резерве`

Source package:

- Central methodology: `docs/methodology/METHODOLOGY.md`
- Scripted lesson sources:
  - `docs/modules/t1-start/unit_01_money_operations/lesson_01_where-money-goes.md`
  - `docs/modules/t1-start/unit_01_money_operations/lesson_02_mandatory-and-desired.md`
  - `docs/modules/t1-start/unit_02_planning_management/lesson_01_why-emergency-fund.md`
  - `docs/modules/t1-start/unit_02_planning_management/lesson_02_reserve-amount.md`

## Removed Active Sources

The following are no longer active authoring/runtime sources:

- previous Finzdorov Module 01 extracted lessons;
- previous `finpulse_methodology` split catalog;
- previous AI/personal-experience lesson candidates;
- previous runtime module `financial-goals` and its lessons.

Historical task files under `harness/tasks/review/**` remain as project history.

## Deferred Target-Methodology Scope

| Target feature | Current handling |
|---|---|
| Tier as first-class schema level | Mapped to runtime `module` until schema changes. |
| Sorting/matching/calculators/diaries | Adapted into existing cards; no new card types yet. |
| Psychotype diagnosis and adaptive feedback | Preserved in source only; no diagnosis or adaptation UI. |
| Spaced repetition and daily warmups | Deferred product scope. |
| Streaks, freeze days, gamification loops | Deferred product scope. |
| Personal financial Navigator as full product surface | Profile shows private reflection/artifact answers only. |
| Reminders and habit scheduling | Captured as saved rules only, no scheduling. |
| B2B analytics/reporting | Out of MVP scope. |

## Runtime Adaptation Rules

- Use current card types only.
- Keep `reflection`/`artifact` persistence neutral: no scores, labels, inferred
  traits, diagnostics, recommendations, or analytics.
- Keep quickly changing values as examples or lookup skills.
- Preserve methodologist scripts locally before JSON adaptation.
- Do not reintroduce old Finzdorov/AI material unless the user explicitly asks
  for an archival comparison task.
