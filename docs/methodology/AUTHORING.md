# Authoring Framework — FinPulse Target Methodology

This is the working instruction for agents and editors turning methodologist
source material into current FinPulse MVP runtime JSON.

Use together with:

- `docs/methodology/METHODOLOGY.md` — central target methodology;
- `docs/CONTENT_MODEL.md` — runtime JSON schema authority;
- `docs/PRODUCT.md` and `docs/ARCHITECTURE.md` — MVP boundaries and data flow;
- `docs/methodology/CONTENT_BACKLOG.md` — current runtime coverage and gaps.

## Source Of Truth

`docs/methodology/METHODOLOGY.md` is the active methodology source. Previous
Finzdorov, AI-assisted, and personal-experience lesson sources are no longer
active authoring sources for runtime content.

When a methodologist provides a scripted lesson, preserve it as local Markdown
under `docs/modules/<tier>/<unit>/` before adapting it to JSON. Runtime JSON
must reference the local source path.

## Current MVP Filter

The target methodology is wider than the MVP. Current runtime may include:

- static educational content;
- short 3-5 minute lessons;
- simple learner auth for progress;
- viewed/completed lesson and card progress;
- private persisted `reflection` and `artifact` answers for authenticated
  learners only;
- current supported card types from `docs/CONTENT_MODEL.md`.

Do not add without a separate decision:

- diagnostics, scores, levels, inferred traits, or labels;
- personalized recommendations or individual financial advice;
- rewards, streaks, coins, shops, or gamification loops;
- reminders, adaptive spaced repetition, psychotype-based UI adaptation, or B2B
  analytics;
- new runtime interactions such as `sorting`, `matching`, calculators, hotspots,
  branching dialogues, scored multi-select, or expense-diary schemas.

## Runtime Hierarchy

The target methodology uses tiers. The current MVP content model still has:

```text
Program -> Module -> Unit -> Lesson -> Card
```

Until the schema changes, map the target hierarchy this way:

```text
Target tier -> runtime module
Target unit / subject block -> runtime unit
Target lesson -> runtime lesson
Target screen -> runtime card
```

Example:

```text
T1 Старт -> module `t1-start`
Юнит 1. Деньги и операции -> unit `money-and-operations`
У1.1 Куда уходят деньги -> lesson `where-money-goes`
```

## Card Adaptation Rules

Use only these runtime card types:

- `theory`
- `callout`
- `single_choice`
- `reflection`
- `scenario`
- `artifact`
- `checklist`
- `summary`
- `video` only when a real playable `src` is available

Adapt target-only screens safely:

| Target pattern | MVP adaptation |
|---|---|
| Sorting | `single_choice`, `scenario`, or `artifact` with explicit explanation |
| Expense diary | `artifact.template` or `reflection.inputType: "table"` |
| Reminder setup | `artifact.variants` or `summary.nextStep`; do not schedule reminders |
| Psychotype-specific feedback | Preserve in source or neutral guidance; do not infer psychotype |
| Navigator save | Persist only neutral `reflection`/`artifact` answers allowed by ADR-0007 |
| Video placeholder | Keep as text in `theory`; add `video` only after a real URL exists |

## Lesson Quality Checklist

A runtime lesson is ready when:

- it follows the ladder from situation/action to rule or artifact;
- it has one main idea and fits 3-5 minutes;
- it has at least one interaction in the first 30-60 seconds when practical;
- objective answers have feedback;
- subjective answers are never marked as wrong;
- volatile financial values are framed as source examples or lookup skills, not
  timeless facts;
- it does not require schema, UI, persistence, or product scope that the MVP does
  not have.

## Runtime JSON Checklist

Before calling a content task done:

- module/unit/lesson/card IDs and slugs are stable and unique;
- paths are normalized relative JSON paths;
- arrays are sorted by `order`;
- `correctOptionId` values match option IDs;
- `reflection` and `artifact` cards that should save user work have meaningful
  titles/prompts/templates;
- content validates with `npm run check:content`;
- app/backend tests are updated for new slugs and titles.

## Result Packet

For every methodology/runtime content task, record:

- source documents preserved;
- runtime files changed;
- card types used;
- target-methodology features deferred because of MVP scope;
- checks run;
- risks and follow-up decisions.
