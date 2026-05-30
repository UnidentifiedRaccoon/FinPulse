# Methodology Content Inventory And Backlog

Source catalog: `docs/methodology/finpulse_methodology/`.

This document maps the large methodology source to the current runtime content
system. Runtime content still uses JSON under `src/content/**` as the source of
truth and must follow `docs/CONTENT_MODEL.md`.

## Display Status

Displayed in the learner app after T-044:

- Module 1: `financial-goals`.
- Unit/section: `values-and-goals` (`01.01 Ваши базовые ценности`).
- Unit/section: `future-vision` (`01.02 Видение будущего`).
- Unit/section: `financial-goals-map` (`01.03 Финансовые цели`).
- Unit/section: `goal-motivation` (`01.04 Мотивация достижения целей`).
- Lessons: compact `01.01` path (`why-values-matter`, `what-are-values`, `values-conflict`, `practice-1m`) plus `01.02`-`01.04` lessons through `goal-levels`.

Not displayed in the learner app:

- Former agent-added runtime unit `impulsive-purchases` and lesson
  `pause-before-purchase`.
- Former agent-added runtime module `budget-without-shame`, unit
  `budget-without-shame-start`, and lesson `budget-as-choice-map`.
- `supplemental` content in runtime JSON.
- Methodology metadata such as `sourceSection`, `thinkingType`, `develops`, and
  `checkability`.
- Source exercise patterns that are not current card types, including sorting,
  matching, multi-select scored questions, calculators, tap targets, branching
  dialogues, daily training, result screens, and artifact-return flows.

## Inventory

| Source area | Runtime location or candidate | Status | Notes |
|---|---|---|---|
| Program/module manifest | `src/content/program.json` -> Module 1 `financial-goals` | already_runtime | Module 1 is displayed by `/program` and `/modules/financial-goals`; after T-041 it contains sections `01.01` through `01.04`. |
| Methodology sections 3.1-3.6 and 4 | Removed former `unit_02_impulsive_purchases`, lesson `pause-before-purchase` | source_candidate | Removed from runtime in T-034 because it does not correspond to the currently prepared factual block `01.01`. Keep only as methodology/source reference unless explicitly approved later. |
| Methodology sections 15-15.1 | `unit_01_values_and_goals` | already_runtime | T-044 compacts the adapted `01.01 Ваши базовые ценности` path to four runtime lessons. |
| Module 1 source sections 15-22 | Lessons `why-values-matter`, `what-are-values`, `values-conflict`, `practice-1m` | already_runtime | Main values unit lesson path is displayed as four balanced lessons; detailed source slices remain in `docs/modules/module_1/lesson_01/`. |
| Module 1 source section 31 | `practice-1m` red-flags checklist | already_runtime | Adapted as a checklist rather than a tap-target exercise. |
| Finzdorov 01.02 source | `unit_02_future_vision` | already_runtime | Three lessons implement lifecycle, future view in uncertainty, and the 1/3/7-year future-day artifact. PDFs/images remain supplemental. |
| Finzdorov 01.03 source | `unit_03_financial_goals` | already_runtime | Four lessons implement goal types, goal timeline, goal parameters, and achievability/priority checks. XLS/calculator files remain supplemental. |
| Finzdorov 01.04 source | `unit_04_goal_motivation` | already_runtime | Four lessons implement motivation pit, locus of control, Descartes matrix, and local goal levels. Motivation scale is local reflection only. |
| Methodology section 6.1 | Removed former Module 2 `budget-without-shame`, unit `budget-without-shame-start`, lesson `budget-as-choice-map` | source_candidate | Removed from runtime in T-034 because Module 2 is outside the current factual Finzdorov Module 01 / block 01.01 scope. |
| Module 1 source sections 23-33 | `unit_01_values_and_goals.supplemental.trainings` | supplemental_candidate | Preserved but not shown in the main lesson reader. |
| Module 1 source sections 34-38 | `unit_01_values_and_goals.supplemental.spacedRepetition` | supplemental_candidate | Not displayed; would need a repetition/daily training product decision. |
| Module 1 source section 39 | `unit_01_values_and_goals.supplemental.expansionScenarios` | supplemental_candidate | Preserved for future authoring; not rendered as lessons. |
| Methodology sections 1-3, 7, 10, 14, 16, 19, 22-24 | Authoring guidance and QA principles | authoring_methodology | Use for editing standards, not direct runtime lesson cards. |
| Methodology section 5 patterns that can be simplified | Future scenario, checklist, reflection, artifact, or single-choice cards | runtime_candidate | Safe only when adapted into current supported card types and static educational content. |
| Methodology sections 6.2-6.4 | Safety cushion, credit, financial security module sketches | runtime_candidate | Can become small future modules/lessons if written as general education and validated against MVP boundaries. |
| Methodology sections 8, 9, 18, 11.4 | Daily training, result screen, skill scales, return to artifacts | future_scope | Requires route/session/progress/product decisions beyond the current MVP reader. |
| Methodology sections 11-13, 17, 20-21 | Exercise fields, subjective rubric, card template, personal map | schema_or_ui_gap | Some metadata can be stored, but UI does not act on rubrics or persisted artifacts. |
| Methodology section 5 and template section 20 unsupported types | `multiple_choice`, `matching`, `sorting`, `calculator`, `dialogue`, forced-choice aggregation, tap-red-flags | schema_or_ui_gap | Do not put these names into runtime JSON as card types until the schema and UI deliberately support them. |

## Schema And UI Gaps

| Gap | Current MVP handling | Recommendation |
|---|---|---|
| Sorting / "Разложи по корзинам" | Approximate as `single_choice`, `artifact`, or `checklist`; otherwise keep as supplemental source. | Future schema/UI task if true drag/drop or categorized answer checking matters. |
| Matching / "Финансовые пары" | Explain pairs through `theory` or `artifact`; test one relation with `single_choice`. | Add `matching` only with objective pair validation and mobile UI. |
| Multi-select scored tasks / "choose 3" | `reflection.multi_select` can collect choices, but cannot score required sets. | Future task for scored multi-select and partial feedback. |
| Calculator / mini-calculator | Use static `single_choice` examples for now. | Future numeric input/formula schema if calculation practice becomes core. |
| Tap red flags / hotspots | Use `checklist` or `scenario` copy. | Future specialized renderer for annotated banners. |
| Conversation rehearsal | One-turn phrase choice can be `scenario` or `single_choice`; freeform phrase drafting can be `reflection`. | Multi-turn dialogue trainer is a future schema/UI task. |
| Forced-choice value pairs | Use `reflection` with `single_select` and non-judgmental guidance. | Aggregated priority maps require artifact persistence, currently out of scope. |
| Result screen | Final `summary.nextStep` can carry "what you trained" and next action. | Future lesson result model only after a product decision. |
| Daily training / spaced repetition | Keep in supplemental/source docs. | Future scope; would need scheduling/session design. |
| Progress scales and personal map | Current app persists viewed/completed progress only. | Avoid diagnostics/analytics/gamification; keep static lesson summaries until explicitly scoped. |
| Persisted artifacts and return-to-artifact flows | Reflections/artifacts are local reader state only. | Needs explicit product/ADR decision before backend persistence. |
| Personalized micro-cases | Keep out of runtime; product scope excludes personalized recommendations. | Use static scenarios instead. |
| Subjective answer rubric | `checkability` metadata exists but UI does not score rubric levels. | Future UI/schema task if rubric feedback becomes important. |

## Runtime Adaptation Rules

- Use only current card types: `theory`, `video`, `callout`, `single_choice`,
  `reflection`, `scenario`, `artifact`, `checklist`, `summary`.
- Keep JSON content immutable and validated.
- Do not add quickly changing financial values as permanent facts.
- Treat external-data lessons as lookup/checklist skills.
- Keep subjective finance and values prompts non-judgmental.
- Do not add accounts, diagnostics, rewards, analytics, backend/admin,
  personalized recommendations, or artifact persistence as part of content
  adaptation.
