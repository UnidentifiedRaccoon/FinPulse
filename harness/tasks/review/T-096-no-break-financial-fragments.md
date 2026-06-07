# T-096 — No-break financial fragments

Status: review

## Goal

Prevent lesson-card text from wrapping inside financial and duration fragments such as `40 000 ₽ в месяц`, `6 месяцев`, and `200 000 ₽`, especially in the mobile third-screen categorization flow.

## Intended Write Set

- `src/features/lesson-reader/card-renderers/**`
- `src/features/lesson-reader/LessonCardFrame.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/review/T-096-no-break-financial-fragments.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out Of Scope

- Runtime content/schema changes
- New card interaction behavior
- Broader typography redesign

## Checklist

- [x] Add shared no-break text formatter
- [x] Apply it to visible card text surfaces
- [x] Add focused regression coverage
- [x] Run focused tests and full verify
- [x] Browser QA on `reserve-amount` card 3

## Result

Files changed:

- `src/features/lesson-reader/card-renderers/shared.tsx`
- `src/features/lesson-reader/card-renderers/TheoryCard.tsx`
- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `src/features/lesson-reader/card-renderers/MultiSelectCard.tsx`
- `src/features/lesson-reader/card-renderers/CategorizationCard.tsx`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/card-renderers/ChecklistCard.tsx`
- `src/features/lesson-reader/LessonCardFrame.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

Checks run:

- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `npm run typecheck`
- `npm run check:content`
- `npm run lint`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser QA on `http://localhost:5173/lessons/reserve-amount` at 390px and 360px

Browser evidence:

- Card 3, example 2 renders as `40 000 ₽ в месяц × 6 месяцев = 200 000 ₽`.
- The fragments `40 000 ₽ в месяц`, `6 месяцев`, and `200 000 ₽` each render in `whitespace-nowrap` spans with one DOM rect at both 390px and 360px.
- Page width equals viewport width at both sizes, so there is no horizontal overflow.
- Browser console had no warnings/errors.

Risks:

- Very long future no-break fragments could overflow if authored as a single very wide amount/unit phrase. Current detected fragments are short enough for 360px.
