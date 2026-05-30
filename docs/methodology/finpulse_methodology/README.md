# FinPulse Methodology Source Catalog

This directory is a durable Markdown split of `docs/methodology/README.md`.
It is source material for editors and future content agents, not runtime JSON.
Runtime inventory and backlog decisions live in `../CONTENT_BACKLOG.md`.

Line references below point to `00_original_content.md`, which is a full copy of the
original methodology document. Keep that file intact so any split decision can be
recovered later.

## Files

| File | Purpose | Source references |
|---|---|---|
| `00_original_content.md` | Full original methodology source for recovery. | Original lines 1-1081. |
| `methodical_framework.md` | General methodology, lesson formula, exercise model, result mechanics, artifact/return concepts, quality rules, subjective rubric, and final formulas. | Lines 1-129, 464-609, 613-786, 790-850, 941-1081. |
| `exercise_library.md` | Exercise type library and runtime-interpretation notes for patterns that are not schema types. | Lines 234-409, 715-742, 1003-1027. |
| `module_candidates.md` | Module sketches, mini-unit candidates, and scope classification hints. | Lines 410-463, 617-715, 851-880, 993-999. |
| `lesson_candidates/impulsive_purchases.md` | Focused source slice for the impulsive-purchases lesson. | Lines 74-129, 131-230, 821-843. |
| `lesson_candidates/values_and_goals.md` | Focused source slice for values/goals methodology and candidate unit structure. | Lines 617-715, 851-951, 984-991. |
| `lesson_candidates/budget_without_shame.md` | Focused source slice for the budget-without-shame candidate module. | Lines 253-265, 412-423, 526-609, 821-843, 973-982. |

## Source Section Index

- Document purpose and preservation guard: lines 1-21.
- Core methodology: lines 25-129.
- Impulsive purchases worked example: lines 131-230.
- Exercise type library: lines 234-409.
- Module examples: lines 410-463.
- Development directions: lines 464-525.
- Duolingo-like training/result/product principle: lines 526-609.
- Methodology extensions: lines 611-786.
- Card design rules: lines 790-850.
- Values/goals unit application: lines 851-951.
- Progress map, quality checks, template, glossary: lines 955-1044.
- Final lesson/unit formula and conclusion: lines 1047-1081.

## Usage Boundaries

- Treat these files as methodology/source material only.
- Do not infer runtime schema support from source exercise names. Unsupported patterns
  such as matching, sorting, multiple choice, calculators, dialogue simulation, and
  personalized micro-cases stay source patterns until the content model changes.
- Preserve MVP product boundaries: no diagnostics, rewards, analytics, production
  financial operations, personalized recommendations, or freeform answer persistence
  without an explicit decision.
- When adapting source into runtime JSON, use `docs/CONTENT_MODEL.md` as the schema
  authority and keep quickly changing financial values as lookup skills, not eternal
  facts.

## Maintenance

When editing this catalog:

1. Keep `00_original_content.md` as the recoverable original unless deliberately
   refreshing it from `docs/methodology/README.md`.
2. Update this map if files move, new slices are added, or source references change.
3. Keep split files readable Markdown. Do not convert this directory into runtime JSON.
