# T-095 — Reserve calculation categorization

Status: review

## Goal

Convert `reserve-amount` screen 3 from the older objective single-choice card flow to the approved third-screen categorization pattern with three formula-check examples and categories `Верно` / `Есть ошибка`.

## Intended Write Set

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `harness/tasks/review/T-095-reserve-calculation-categorization.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out Of Scope

- New card types or renderer behavior
- Backend/API schema changes
- Progress key changes; the existing `card.id` is preserved
- Broader lesson copy rewrites outside screen 3

## Checklist

- [x] Replace card 3 content with `categorization`
- [x] Run focused content validation
- [x] Run focused lesson-reader tests
- [x] Run full project verification
- [x] Smoke the updated lesson in browser
- [x] Update task/state notes

## Result

Files changed:

- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-095-reserve-calculation-categorization.md`

Checks run:

- `npm run check:content`
- `npm run test:run -- src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
- Browser smoke at 390px on temporary fresh dev pair `http://127.0.0.1:5174/` + API `http://127.0.0.1:3002`

Browser evidence:

- `/lessons/reserve-amount` card 3 now renders `Проверь расчёты подушки`.
- The focused card flow shows three formula examples and category controls `Верно` / `Есть ошибка`.
- After three answers, the editable result table appears, `Проверить` enables, correct feedback appears, no horizontal overflow at 390px, and no console warnings/errors were observed.

Risks:

- The source Markdown still documents the original single-choice screen; runtime JSON intentionally adapts it into current MVP-supported categorization without changing source preservation.
