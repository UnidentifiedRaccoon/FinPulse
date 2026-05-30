# UI Component Policy

FinPulse uses Storybook as the shared UI catalog for designers, humans, and agents. Check it before creating a new component.

## Locations

- `src/components/ui/`: shadcn/ui primitives copied into the app.
- `src/shared/ui/`: reusable FinPulse UI components that are not owned by one feature.
- `src/features/**`: feature components that serve one product area or workflow.
- `src/**/*.stories.tsx`: Storybook stories for reusable and visually important feature components.

## When to Extract

Keep a component in `src/features/**` when it is only useful for that feature.

Move a component to `src/shared/ui/` when at least two feature areas need the same behavior, layout, or visual pattern, or when future reuse is clearly part of the design system.

Do not extract just because JSX is long. Extract when the name describes a stable product concept and reduces real duplication.

## Story Requirements

Add or update a story when:

- adding a reusable UI component;
- changing a shadcn primitive variant used by FinPulse;
- adding a visually distinct feature component;
- adding or changing important states such as default, current, completed, locked, selected, correct, retry/almost, disabled, loading, empty, or error.

New reusable UI component means:

```txt
component + story + short purpose in the story/docs or nearby component notes
```

## Duplication Rule

Before creating a card, button, prompt, feedback block, progress element, or learning-path item:

1. Search existing code with `rg`.
2. Check Storybook with `npm run storybook`.
3. Reuse or extend the existing component when the visual role is the same.

Do not create visually similar cards, buttons, hints, or feedback blocks without a product reason. If a new variant is needed, prefer an explicit prop or a small composition around the existing component.

## Storybook Hosting

Storybook is a separate static artifact intended for `/storybook/`.

It is not a React Router route and must not be imported into the learner app runtime bundle.

Build it with:

```bash
npm run build:storybook
```
