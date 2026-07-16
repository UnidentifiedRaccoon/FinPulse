# T-155 — Body text weight normalization

Status: review

## Goal

Normalize ordinary learner-facing body text to regular `400`, reserving heavier
weights for explicit emphasis such as bold rich text, headings, labels, and
primary controls.

## Intended write set

- `docs/DESIGN_SYSTEM.md`
- `src/features/storybook/foundations/Typography.stories.tsx`
- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `src/features/lesson-reader/card-renderers/MultiSelectCard.tsx`
- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/pages/EntryPage.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-155-body-text-weight.md`

## Result

- Body typography in `docs/DESIGN_SYSTEM.md` and Storybook now specifies `400`
  for body and caption text.
- The old `500` body-text range was removed from the design-system contract.
- Lesson-card questions, section passport text, artifact variant chips, and
  profile question tooltip text now inherit regular text weight.
- Shared button, dialog title, and label primitives moved from the former
  medium utility to the semibold control/title layer; file input text now
  inherits regular text weight.
- Search found no remaining medium utility or old body-weight ranges in the
  source UI/design docs checked for this task.

## Checks

- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build:web`
- [x] `npm run build:storybook`
- [x] `git diff --check`
- [x] `npm run verify` reached backend tests and stopped because this shell has
  no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.

## Risks

- The change slightly lightens question text and secondary learner text. Explicit
  Markdown `**strong**`, headings, labels, and primary controls still provide
  heavier emphasis.
