# Content Model — Split JSON Source of Truth

## Goal

Represent the educational program as small JSON files that can be edited, reviewed, and validated without turning runtime content into one giant file.

The runtime hierarchy is:

```txt
Program
└─ Module
   └─ Unit
      └─ Lesson
         └─ Card
```

## Runtime files

```txt
src/content/
  program.json
  modules/
    module_1/
      module.json
      units/
        unit_01_values_and_goals.json
```

`program.json` is the program manifest. It stores program metadata and references module JSON files.

`module.json` stores module metadata and references unit JSON files.

Unit files store the full runtime lesson/card content for the unit.

## File shapes

```ts
export type ProgramManifest = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  modules: ModuleRef[]
}

export type ModuleRef = {
  id: string
  slug: string
  title: string
  description?: string
  order: number
  path: string
}

export type ModuleFile = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  order: number
  source?: string
  units: UnitRef[]
}

export type UnitRef = {
  id: string
  slug: string
  title: string
  description?: string
  order: number
  path: string
}

export type UnitFile = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  order: number
  source: string
  lessons: Lesson[]
  supplemental?: UnitSupplemental
}
```

After loading, the app works with hydrated objects:

```ts
export type Program = Omit<ProgramManifest, 'modules'> & {
  modules: Module[]
}

export type Module = Omit<ModuleFile, 'units'> & {
  units: Unit[]
}

export type Unit = UnitFile
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
  thinkingType?: string
  develops?: string
  checkability?: 'objective' | 'subjective' | 'mixed'
}
```

Supported card types:

```ts
export type Card =
  | TheoryCard
  | VideoCard
  | CalloutCard
  | SingleChoiceCard
  | ReflectionCard
  | ScenarioCard
  | ArtifactCard
  | ChecklistCard
  | SummaryCard
```

Minimal type-specific fields:

- `theory`: `body`, optional `examples`.
- `video`: `src`, `title`, optional `provider`, `timecodes`, `transcript`.
- `callout`: `body`, optional `tone`.
- `single_choice`: `question`, `options`, optional `correctOptionId`, `feedback`, `readOnly`.
- `reflection`: `prompt`, optional `options`, `inputType`, `saveKey`, `guidance`, `readOnly`.
- `scenario`: `body`, optional `question`, `options`, `correctOptionId`, `feedback`, `readOnly`.
- `artifact`: `body`, optional `template`, `variants`, `readOnly`.
- `checklist`: `items`, optional `body`.
- `summary`: `points`, optional `body`, `nextStep`.

`readOnly: true` means the reader must force static rendering even when that card type supports interaction.
If `readOnly` is omitted or `false`, the card is eligible for the reader's local interactive behavior.
Interactive state is UI-only unless a future product decision explicitly adds persistence.

## Supplemental content

Large support material that should not become the main lesson path belongs in `UnitFile.supplemental`.

Use it for:

- additional trainings;
- spaced repetition cards;
- expansion scenarios;
- editorial rules;
- unit outcome.

Supplemental items should keep enough source detail to restore the exercise without reopening the original Markdown. Use `summary` for a short reviewer-facing description and optional `content: string[]` for full prompts, tables, options, answers, feedback, or scenario text.

The first Module 1 unit keeps supplemental material there to avoid bloating the primary reader while preserving all source content.

## Content rules

- Every `id` must be stable and unique across its runtime type.
- Every `slug` must be URL-safe and unique across modules, units, and lessons.
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
- referenced module and unit files exist;
- module refs match module files;
- unit refs match unit files;
- ids/slugs are unique in their scopes;
- referenced paths are normalized relative JSON paths;
- ordered arrays are sorted and do not reuse `order`;
- lessons contain cards;
- card type-specific fields are present.

## Backend API policy

Stage 2 serves the same hydrated Program -> Module -> Unit -> Lesson -> Card graph through read-only backend API routes.

The JSON files remain the canonical source-of-truth. The backend must validate and hydrate the graph with the same model before returning content responses. Frontend routes may fetch program/module/unit/lesson data from the API, but content edits still happen in the repo JSON files and must pass `npm run check:content`.

Saved progress may reference stable `lesson.slug` and `card.id` values only. It must not create a parallel content schema, rewrite lesson/card data, or persist full freeform answers unless a later ADR expands that scope.

## Migration rule

If the content model changes, update:

- this document;
- `harness/schemas/content.schema.json`;
- `src/content/program.ts`;
- `scripts/check-content-json.mjs`;
- examples under `examples/content/`.
