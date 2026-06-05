# T-069 — Content adaptation wording audit

Status: review

## Goal

Audit active T1 runtime learner-facing wording for awkward source adaptations similar to the `ничего не нарушил(а)` guidance, then fix only clear learner-facing copy issues without changing content model, UI, API, auth, progress, or methodology scope.

## Intended write set

- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `src/App.test.tsx`
- `harness/tasks/review/T-069-content-adaptation-wording-audit.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Non-goals

- No JSON schema changes.
- No UI renderer changes.
- No backend/API/auth/progress changes.
- No broad rewrite of source Markdown methodology packages.

## Checks

- Passed: `npm run check:content`
- Passed: `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx`
- Passed: `npm run typecheck`
- Passed: `npm run lint`
- Passed: `npm run build`
- Passed: `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- Passed: Browser smoke on `http://localhost:5173/lessons/where-money-goes` to card 5, confirming new visible copy and no old wording markers in the DOM.

## Changes

- Removed learner-facing hook-card feedback copied from internal methodology notes (`любой ответ принимается`, `вовлечение`, `не проверка`).
- Rewrote the awkward `ничего не нарушил(а)` guidance into a neutral observation-focused message.
- Fixed the malformed `больше или лишнее` reflection prompt and its gendered option label.
- Rephrased prominent summary/checkpoint lines to avoid mechanical `(а)` forms where the text reads better without them.
- Updated App test fixtures that store the changed reflection prompt/option text.

## Audit notes

- Source Markdown remains preserved as the authoring source, including source notes and psychotype/adaptation variants.
- Active runtime JSON no longer contains the searched problematic markers: `Любой ответ`, `вовлечение`, `не проверка`, `нарушил`, `больше или лишнее`.
- Browser smoke confirmed the live reflection card shows `Подойдет любой вариант. Удивление — хороший знак: стало видно то, что раньше проходило мимо.`
