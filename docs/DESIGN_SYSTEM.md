# Design System — Mobile-first Tailwind + shadcn/ui

## Design direction

The MVP should feel like a calm, focused reading/learning product:
- content-first;
- minimal chrome;
- clear lesson hierarchy;
- large readable text;
- comfortable mobile spacing;
- obvious next/previous navigation.

## UI stack

- Tailwind CSS for utilities and design tokens.
- shadcn/ui for accessible primitives and composable components.
- lucide-react icons only when they clarify navigation or state.

## Component policy

Prefer shadcn/ui primitives for:
- Button;
- Card;
- Accordion;
- Sheet/Drawer for mobile navigation;
- ScrollArea if needed;
- Separator;
- Badge only for structural labels, not rewards/gamification.

Project-specific components should be small:

```txt
src/shared/ui/
  AppShell.tsx
  PageHeader.tsx
  ContentCard.tsx
  EmptyState.tsx
  ErrorState.tsx

src/features/lesson-reader/
  LessonBlockRenderer.tsx
  LessonNavigation.tsx
```

## Mobile rules

- Design for 360px width first.
- Avoid dense tables.
- Use sticky bottom/next navigation only if it does not cover content.
- Keep tap targets approximately 44px or larger.
- Avoid hover-only interactions.

## Accessibility baseline

- Use semantic headings in order.
- Use buttons for actions, links for navigation.
- All images require alt text.
- Maintain visible focus states.
- Ensure lesson navigation is keyboard-accessible.
- Avoid color-only meaning.

## Theming

Start with a simple light theme. Add dark mode only if it does not distract from MVP delivery.

## Design non-goals

- No gamified badges/rewards in MVP.
- No analytics widgets in MVP.
- No complex dashboards.
