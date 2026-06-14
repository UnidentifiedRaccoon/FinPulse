# Content Model — Split JSON Source of Truth

## Goal

Represent the educational program as small JSON files that can be edited, reviewed, and validated without turning runtime content into one giant file.

The approved educational hierarchy is:

```txt
Program
└─ Level
   └─ Section
      └─ Lesson
         └─ Card
```

Runtime JSON, validators, TypeScript domain types, content API payloads,
frontend routes, and persistence context use this hierarchy directly. Old
`module`/`unit` API/browser routes and payloads are not supported.

## Runtime files

```txt
src/content/
  program.json
  levels/
    level_1_start/
      level.json
      sections/
        section_01_money_and_operations.json
```

`program.json` is the program manifest. It stores program metadata and
references Level JSON files through the `levels` key.

`level.json` stores Level metadata and references Section JSON files through
the `sections` key.

Section files store the full runtime lesson/card content for the Section.

## File shapes

```ts
export type ProgramManifest = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  levels: LevelRef[]
}

export type LevelRef = {
  id: string
  slug: string
  title: string
  description?: string
  order: number
  path: string
}

export type LevelFile = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  order: number
  source?: string
  sections: SectionRef[]
}

export type SectionRef = {
  id: string
  slug: string
  title: string
  description?: string
  order: number
  path: string
}

export type SectionFile = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  order: number
  source: string
  lessons: Lesson[]
  supplemental?: SectionSupplemental
}
```

After loading, the app works with hydrated objects:

```ts
export type Program = Omit<ProgramManifest, 'levels'> & {
  levels: Level[]
}

export type Level = Omit<LevelFile, 'sections'> & {
  sections: Section[]
}

export type Section = SectionFile
```

## Lesson

```ts
export type Lesson = {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  order: number
  estimatedMinutes?: number
  learningGoal?: string
  mainSkill?: string
  tags?: string[]
  sourceSection?: string
  cards: Card[]
}
```

## Cards

Every card has:

```ts
type CardBase = {
  id: string
  type: CardType
  order: number
  title?: string
  sourceSection?: string
  ctaLabel?: string
  thinkingType?: string
  develops?: string
  checkability?: 'objective' | 'subjective' | 'mixed'
  statistics?: CardStatistics
}
```

Supported card types:

```ts
export type Card =
  | TheoryCard
  | VideoCard
  | CalloutCard
  | SingleChoiceCard
  | MultiSelectCard
  | CategorizationCard
  | ReflectionCard
  | ScenarioCard
  | ArtifactCard
  | ChecklistCard
  | SummaryCard
```

Minimal type-specific fields:

- `theory`: `body`, optional `examples`.
- `video`: `src`, `title`, optional `provider`, `timecodes`, `transcript`.
  For RUTUBE, use the platform embed URL (`https://rutube.ru/play/embed/...`); the reader renders it inline and keeps a source link as fallback.
- `callout`: `body`, optional `tone`.
- `single_choice`: `question`, `options`, optional `correctOptionId`, `feedback`, `readOnly`.
- `multi_select`: `question`, `options`, optional `feedback`, `readOnly`.
  `options` use `{ id, label, isCorrect?, feedback? }`; at least one option must be correct and at least one must be incorrect.
- `categorization`: `question`, `categories`, `items`, optional `feedback`, `readOnly`.
  `categories` use `{ id, label }`; `items` use `{ id, label, correctCategoryId, feedback? }`.
  Every `correctCategoryId` must match a category id.
- `reflection`: `prompt`, optional `options`, `customOption`, `inputType`, `saveKey`, `guidance`, `readOnly`.
- `scenario`: `body`, optional `question`, `options`, `correctOptionId`, `feedback`, `readOnly`.
- `artifact`: `body`, optional `template`, `variants`, `customOption`, `readOnly`.
- `checklist`: `items`, optional `body`.
- `summary`: `points`, optional `body`, `nextStep`.

`ctaLabel` is optional learner-facing microcopy for the card's primary continue
action. Use it when the methodologist source gives a specific `Кнопка` label,
for example `Разобраться, куда уходят мои деньги` or `Научиться различать`.
Store clean text without decorative arrows; the reader owns the visual arrow.
System actions such as `Проверить` and final `Завершить` override `ctaLabel`.

Every card may also include a source-backed statistics block:

```ts
export type CardStatistics = {
  title?: string
  items: Array<{
    value: string
    label: string
  }>
  sources?: string[]
}
```

Use `statistics` for methodologist source sections named `Блок статистики` or `Статистика по теме`.
It is card-level metadata, not a separate card type, because statistics may support an `artifact`, `scenario`,
`single_choice`, or other screen without changing the lesson ladder. Preserve the source numbers and sources;
do not convert them into diagnostics, scores, analytics, labels, recommendations, or personal financial advice.
If a runtime card's `sourceSection` points to a Markdown screen containing `Блок статистики`, the content validator
requires `card.statistics`.

`readOnly: true` means the reader must force static rendering even when that card type supports interaction.
If `readOnly` is omitted or `false`, the card is eligible for the reader's interactive behavior.

Authenticated `reflection` and `artifact` answers may be persisted as the learner's private personal artifact. This persistence uses `card.id`, optional `reflection.saveKey`, and lesson/level/section context. Persistence must not add answer scoring, diagnostics, labels, inferred traits, analytics, or recommendations.

`multi_select` and `categorization` are objective practice cards. They may show checked-answer feedback and then allow the learner to continue, but their selected answers are not persisted through `/api/reflections` and must not create scores, labels, diagnostics, analytics, or recommendations.

For `reflection.inputType: "single_select"`, use `customOption` when the learner may enter their own option:

```json
"customOption": {
  "label": "Свой вариант",
  "placeholder": "Напиши свой вариант"
}
```

The reader renders `customOption` as a selectable row with a text field. When selected, the saved answer uses the learner's typed text as `singleValue`.

For `artifact` cards with `variants`, use `customOption` when the learner may write a custom artifact variant:

```json
"customOption": {
  "label": "Свой вариант",
  "placeholder": "Напиши свой вариант"
}
```

The reader renders artifact `variants` plus `customOption` as a selectable group when `customOption` is present. When the custom row is selected, the saved answer stores the learner's typed text in the existing `selectedVariant` field.

## Level 1 lesson contract

Current Level 1 lessons use a fixed eight-card runtime architecture. General card
types such as `callout`, `multi_select`, and `checklist` remain in the content
model for older or non-Level 1 material, but they are not valid for new Level 1 lessons
unless a later content-model decision changes this contract.

Every Level 1 lesson must have exactly eight cards with orders `1` through `8`:

| Order | Required type | Required checkability | Runtime rule |
|---:|---|---|---|
| 1 | `single_choice` | `subjective` | Hook into a familiar situation. No `correctOptionId`; no option should be marked `isCorrect`. |
| 2 | `theory` | `objective` | One main idea. Use text placeholders for video unless a real playable `video.src` exists in a later approved model change. |
| 3 | `categorization` | `objective` | Core objective practice only. Sort examples into known categories; do not use `single_choice` or `multi_select`. Include feedback. |
| 4 | `scenario` | `objective` | External Real World A example. Exactly three options, exactly one correct answer, card-level feedback, and feedback on every option. Attach source statistics here when present. |
| 5 | `artifact` | `mixed` | Personal Real World B draft on the learner's data. Personal data is accepted, not marked right/wrong. |
| 6 | `reflection` | `subjective` | Personal reflection with options plus `customOption` / `Свой вариант`; no correct answer. |
| 7 | `artifact` | `mixed` | Micro-rule or first step with exactly two ready `variants` plus `customOption` / `Свой вариант`. Do not create reminders, schedules, or habit mechanics. |
| 8 | `summary` | `subjective` | Navigator summary and bridge to the next lesson. |

Each Level 1 card must include a stable `id`, `order`, `type`, `checkability`, and a
`sourceSection` ending with `/ Экран N`. `npm run check:content` enforces this
contract for active `L1` runtime lessons.

## Supplemental content

Large support material that should not become the main lesson path belongs to
the Section and is stored in `SectionFile.supplemental`.

Use it for:

- additional trainings;
- spaced repetition cards;
- expansion scenarios;
- editorial rules;
- section outcome.

Supplemental items should keep enough source detail to restore the exercise without reopening the original Markdown. Use `summary` for a short reviewer-facing description and optional `content: string[]` for full prompts, tables, options, answers, feedback, or scenario text.

Supplemental material should stay out of the primary reader unless a future content task intentionally promotes it into runtime lessons.

## Content rules

- Every `id` must be stable and unique across its runtime type.
- Every `slug` must be URL-safe and unique across Levels, Sections, and lessons.
- Card ids must be unique across the program.
- `order` defines display order; arrays should also be sorted by order.
- Do not store arbitrary HTML in JSON for MVP.
- Use semantic cards instead of raw markdown/HTML.
- All video cards need a title and source URL.
- Quickly changing financial values should be taught as lookup skills, not stored as eternal facts.

## Validation

Run:

```bash
node scripts/check-content-json.mjs
```

or:

```bash
npm run check:content
```

Validation checks:

- `src/content/program.json` exists and is valid;
- referenced Level and Section files exist through `levels/**` and `sections/**`;
- level refs match Level files;
- section refs match Section files;
- ids/slugs are unique in their scopes;
- referenced paths are normalized relative JSON paths;
- referenced source Markdown files exist for `sourceSection` values that point to local `.md` sources;
- ordered arrays are sorted and do not reuse `order`;
- lessons contain cards;
- card type-specific fields are present;
- active Level 1 lessons contain exactly eight cards and match the required
  screen-by-screen Level 1 architecture.

## Backend API policy

Stage 2 serves the same hydrated Program -> Level -> Section -> Lesson -> Card graph through read-only backend API routes.

Primary content API routes:

```txt
GET /api/program
GET /api/levels
GET /api/levels/:levelSlug
GET /api/sections/:sectionSlug
GET /api/lessons/:lessonSlug
```

The JSON files remain the canonical source-of-truth. The backend must validate and hydrate the graph with the same model before returning content responses. Frontend routes fetch program/level/section/lesson data from the primary API. Content edits still happen in the repo JSON files and must pass `npm run check:content`.

Saved progress may reference stable `lesson.slug` and `card.id` values only. It must not create a parallel content schema or rewrite lesson/card data.

Saved reflection/artifact answers may reference stable `card.id`, optional `saveKey`, and `lesson.slug` for display. Completion of an interactive `reflection`/`artifact` card can require a meaningful non-empty answer or selection. Open answers are accepted by fact of entry and are not checked as right/wrong.

## Migration rule

If the content model changes, update:

- this document;
- `harness/schemas/content.schema.json`;
- `src/content/program.ts`;
- `scripts/check-content-json.mjs`;
- examples under `examples/content/`.
