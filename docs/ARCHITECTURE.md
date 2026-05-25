# Architecture — FinPulse Learning MVP

## Decision summary

Use a Vite React + TypeScript SPA for the MVP.

Rationale:
- content is static JSON;
- there is no account system or server-dependent personalization;
- there are no production financial operations;
- SEO and server rendering are not the primary MVP constraints;
- development speed and a small mental model matter more right now.

Next.js/SSR can be reconsidered later if one of these becomes true:
- public SEO landing/content discovery becomes a main growth channel;
- lessons need server-side personalization;
- authentication and server-owned user state become central;
- content is moved to a CMS/backend requiring server mediation;
- the app needs server actions, edge rendering, or dynamic metadata at scale.

## Recommended frontend stack

```txt
Build/dev:      Vite
UI runtime:     React + TypeScript
Routing:        React Router in SPA/declarative mode
State:          Zustand for small client-side cross-route state
Data:           JSON files, validated by script/schema
Styling:        Tailwind CSS
UI primitives:  shadcn/ui
Tests:          Vitest + Testing Library when components stabilize
```

## Recommended project structure

This is a suggested structure, not a rigid framework:

```txt
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  pages/
    ProgramOverviewPage.tsx
    ModulePage.tsx
    LessonPage.tsx
  features/
    program-navigation/
    lesson-reader/
  entities/
    content/
      model.ts
      loadProgram.ts
      selectors.ts
  shared/
    ui/
    lib/
    config/
  stores/
    useReaderStore.ts
  content/
    program.json
  styles/
    globals.css
```

Alternative for runtime-editable static content:

```txt
public/content/program.json
```

Use `src/content/` when content is bundled with the app. Use `public/content/` when content should be replaceable without rebuilding the JavaScript bundle.

## Data flow

```txt
JSON content file
  -> content loader / validator
  -> typed domain model
  -> page selectors
  -> React pages/components
  -> optional small Zustand store for reader UI state
```

## State policy

Use local React state for:
- expanded/collapsed UI sections;
- form-like transient UI;
- small one-component interactions.

Use Zustand for:
- current reader preferences;
- last opened lesson, if local-only;
- navigation drawer state shared across routes;
- offline/local-only progress if explicitly accepted later.

Do not use Zustand for:
- storing the entire content corpus without reason;
- replacing derived selectors;
- server state that does not exist yet;
- analytics or diagnostics in MVP.

## Content loading policy

Initial recommendation:
- start with a single `src/content/program.json` while content is small;
- split into `program.json` + `modules/*.json` when bundle size or editing friction grows;
- validate before build using `scripts/check-content-json.mjs`.

## Error handling

The app should handle:
- missing route slug;
- missing module/lesson;
- malformed content in development;
- empty modules or lessons;
- unsupported content block type.

## Performance baseline

- mobile-first layout;
- route-level lazy loading once pages grow;
- avoid loading heavy media inline in JSON;
- keep large assets in `/public` or a proper asset pipeline;
- prefer semantic content blocks over raw HTML.

## Architecture change rule

Any change to the main stack or product boundary requires an entry in `docs/DECISIONS.md`.
