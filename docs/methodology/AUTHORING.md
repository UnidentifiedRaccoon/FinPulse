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
under `docs/levels/<level>/sections/<section>/` before adapting it to JSON.
Runtime JSON must reference the local source path.

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
- new runtime interactions beyond the accepted objective `multi_select` and
  `categorization` practice cards, such as matching, calculators, hotspots,
  branching dialogues, scored tests, or expense-diary schemas.

## Educational Hierarchy

The approved methodical hierarchy is:

```text
Program -> Level -> Section -> Lesson -> Card
```

Use these names in methodology, source briefs, lesson authoring, QA, and agent
handoffs. Runtime JSON, validators, TypeScript types, API payloads, frontend
routes, and persistence context use Level and Section directly.

Example:

```text
Уровень 1 · Старт -> level `level-1-start`
Раздел 1. Деньги и операции -> section `money-and-operations`
У1.1 Куда уходят деньги -> lesson `where-money-goes`
```

## Card Adaptation Rules

The general runtime model currently supports these card types:

- `theory`
- `callout`
- `single_choice`
- `multi_select`
- `categorization`
- `reflection`
- `scenario`
- `artifact`
- `checklist`
- `summary`
- `video` only when a real playable `src` is available

For new Level 1 lessons, do not treat the full list above as free choice. Use the
accepted eight-screen Level 1 architecture below and only the card types named in
that table. In particular, do not introduce `callout`, `multi_select`,
`checklist`, matching, calculators, diary schemas, branching dialogue, scoring,
diagnostics, reminders, gamification, psychotype adaptation, analytics, or
personalized recommendations in a Level 1 runtime lesson.

Adapt target-only screens safely:

| Target pattern | MVP adaptation |
|---|---|
| Sorting into named categories | `categorization` when the answer is objective and all target categories are known |
| Multiple correct choices | For non-Level 1 content, `multi_select` when the source asks to mark several objectively correct options. For Level 1 screen 3, rewrite as `categorization`. |
| Expense diary | `artifact.template` or `reflection.inputType: "table"` |
| `Блок статистики` / `Статистика по теме` inside a source screen | `card.statistics` on the same runtime card; preserve values and sources |
| Reminder setup | `artifact.variants` or `summary.nextStep`; do not schedule reminders |
| Psychotype-specific feedback | Preserve in source or neutral guidance; do not infer psychotype |
| Navigator save | Persist only neutral `reflection`/`artifact` answers allowed by ADR-0007 |
| Video placeholder | Keep as text in `theory`; add `video` only after a real URL exists |

When adapting a scripted lesson, scan every source screen for `Блок статистики`
or `Статистика по теме`. If the block exists, it must become `statistics` on
the runtime card whose `sourceSection` references that screen. Do not drop it
because the main screen is an `artifact`, `scenario`, or `single_choice`.

## Required Level 1 Lesson Architecture

Create every new Level 1 lesson as exactly eight screens. One screen is one runtime
card and one user action. The lesson should take 3-5 minutes and move from a
recognizable situation to a personal action and saved result.

| Order | Screen | Type | Checkability | Required shape |
|---:|---|---|---|---|
| 1 | Зацепка | `single_choice` | `subjective` | Recognizable life situation. No correct answer; any option is accepted. Do not set `correctOptionId` or `isCorrect`. |
| 2 | Мини-теория | `theory` | `objective` | One main idea, with an optional short example or fact. Mention video only as text unless there is a real playable URL. |
| 3 | Объективная практика | `categorization` | `objective` | Sort examples into known categories that train the lesson's main distinction. Include feedback. Never use `single_choice` or `multi_select` here. |
| 4 | Внешний пример / Real World A | `scenario` | `objective` | Short external life example, not the learner's personal data. Exactly three options, one correct answer, and feedback for correct and incorrect answers. Put source statistics in `card.statistics` when present. |
| 5 | Личное применение / Real World B | `artifact` | `mixed` | Small draft on the learner's data: expenses, markup, possible situation, amount, first step, or similar personal artifact. Do not check personal data as right/wrong. |
| 6 | Личная рефлексия | `reflection` | `subjective` | Options plus `customOption` labelled `Свой вариант`. No correct or incorrect answer. |
| 7 | Микро-правило / первый шаг | `artifact` | `mixed` | Exactly two ready rule/first-step formulations plus `customOption` labelled `Свой вариант`. Do not create real reminders, schedules, or habit mechanics. |
| 8 | Итог / Навигатор | `summary` | `subjective` | Briefly list what is saved in the Navigator and bridge to the next lesson. |

For JSON, every Level 1 card must have a stable `id`, `order` from 1 to 8, `type`,
`sourceSection` ending with `Экран N`, and the required `checkability`. Objective
screens 3 and 4 must include feedback. If the source practice is written as a
choice list, adapt it into screen-3 category sorting. If the source contains
`Блок статистики` or `Статистика по теме`, attach it to screen 4 as
`card.statistics`; do not make statistics a separate card.

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

- level/section/lesson/card IDs and slugs are stable and unique at the
  educational level;
- paths are normalized relative JSON paths;
- arrays are sorted by `order`;
- `correctOptionId` values match option IDs;
- `reflection` and `artifact` cards that should save user work have meaningful
  titles/prompts/templates;
- every source `Блок статистики` / `Статистика по теме` is represented as
  `card.statistics` with `items` and, when present in source, `sources`;
- source table `Кнопка` microcopy is preserved as card `ctaLabel` when it is a
  meaningful continue action; remove decorative arrows from the stored text;
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
