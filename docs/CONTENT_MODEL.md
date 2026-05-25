# Content Model — JSON Source of Truth

## Goal

Represent the educational program in JSON files that are easy for agents and humans to edit safely.

## Recommended initial file

```txt
src/content/program.json
```

Optional later structure:

```txt
src/content/
  program.json
  modules/
    module-1.json
    module-2.json
```

## Core model

```ts
export type Program = {
  schemaVersion: 1
  id: string
  slug: string
  title: string
  description?: string
  modules: ProgramModule[]
}

export type ProgramModule = {
  id: string
  slug: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export type Lesson = {
  id: string
  slug: string
  title: string
  description?: string
  order: number
  estimatedMinutes?: number
  blocks: LessonBlock[]
}

export type LessonBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; style?: 'bullet' | 'numbered'; items: string[] }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'callout'; tone?: 'info' | 'warning' | 'success'; title?: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; src: string; title: string; transcript?: string }
```

## Content rules

- Every `id` must be stable and unique within its type.
- Every `slug` must be URL-safe and unique within its route type.
- `order` defines display order; arrays should also be sorted by order.
- Do not store arbitrary HTML in JSON for MVP.
- Use semantic content blocks instead of markdown/HTML until there is a reason to change.
- All images need meaningful `alt` text unless decorative.
- Video blocks should have a title and eventually a transcript.

## Validation

Run:

```bash
node scripts/check-content-json.mjs
```

or, after package scripts are configured:

```bash
npm run check:content
```

The script intentionally supports the early phase where no real `program.json` exists yet. It should skip cleanly until content is added.

## Migration rule

If the content model changes, update:
- this document;
- `harness/schemas/content.schema.json`;
- `scripts/check-content-json.mjs` if needed;
- any example files under `examples/content/`.
