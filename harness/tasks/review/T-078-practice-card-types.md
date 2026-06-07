# T-078 Practice Card Types

## Status

review

## Goal

Expand the runtime content model with objective `multi_select` and `categorization` practice cards, then migrate the three active T1 practice screens that were previously compressed into `single_choice`.

## Intended write set

- `src/content/program.ts`
- `scripts/check-content-json.mjs`
- `src/features/lesson-reader/**`
- `src/features/storybook/fixtures.ts`
- `src/content/modules/t1_start/units/unit_01_money_and_operations.json`
- `src/content/modules/t1_start/units/unit_02_planning_and_management.json`
- `src/App.test.tsx`
- `server/app.test.ts`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/CONTENT_BACKLOG.md`
- `docs/DECISIONS.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- `harness/tasks/review/T-078-practice-card-types.md`

## Plan

- [x] Add schema and validator support for `multi_select` and `categorization`.
- [x] Add lesson-reader state, renderers, feedback, and story fixtures.
- [x] Migrate three active runtime practice cards.
- [x] Update docs and harness state.
- [x] Run focused checks, full verification, and browser smoke.

## Notes

- Keep existing card ids to preserve progress keys.
- Do not persist these answers through `/api/reflections`.
- Wrong answers should show feedback but should not block lesson progress.

## Result packet

- Added objective `multi_select` and `categorization` card contracts in zod and manual content validation.
- Added mobile-first reader renderers, local interaction state, bottom feedback, read-only rendering, and Storybook fixtures.
- Migrated `where-money-goes` and `mandatory-and-desired` screen 3 to `categorization`; migrated `why-emergency-fund` screen 3 to `multi_select`.
- Documented ADR-0009 and updated content/methodology guidance.
- Checks run:
  - `npm run check:content`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test:run -- src/content/program.test.ts src/features/lesson-reader/LessonCardRenderer.test.tsx src/App.test.tsx`
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run test:run -- server/app.test.ts server/content-contract.test.ts`
  - `npm run build`
  - `npm run build:storybook`
  - `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse npm run verify`
  - Browser 390px smoke on `/lessons/where-money-goes`, `/lessons/mandatory-and-desired`, and `/lessons/why-emergency-fund`.
- Browser smoke passed with `scrollWidth=390`, enabled `Далее` after checked feedback, and no console warnings/errors.
