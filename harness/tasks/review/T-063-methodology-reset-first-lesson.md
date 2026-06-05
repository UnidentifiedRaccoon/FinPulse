# T-063 — Methodology reset and first target lesson

Status: review

## Goal

Make the new methodologist-provided FinPulse methodology the central active source and replace the current runtime program with the first target lesson: T1 Start / Money and operations / Where money goes.

## Intended write set

- `AGENTS.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/{AUTHORING.md,CONTENT_BACKLOG.md,README.md}`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/finpulse_methodology/**` deletion
- `docs/methodology/finzdorov_module_01/**` deletion
- `docs/modules/module_1/**` deletion
- `docs/modules/t1-start/**`
- `src/content/program.json`
- `src/content/modules/module_1/**`
- `src/content/modules/t1_start/**`
- `src/pages/EntryPage.tsx`
- `src/features/program-navigation/**`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/pages/{ProgramOverviewPage,ModulePage,UnitPage}.tsx`
- `src/App.test.tsx`
- `src/App.logout.test.tsx`
- `server/app.test.ts`
- `server/content-contract.test.ts`
- `docs/QA_USER_SCENARIO_MAP.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Notes

- Keep historical `harness/tasks/review/**` artifacts unchanged.
- Do not add new runtime card types in this task.
- Do not migrate or clean user persistence data.

## Result

- Imported the new methodology as `docs/methodology/METHODOLOGY.md` and made it the central active methodology source.
- Replaced active authoring/backlog/readme methodology docs to point at the new source and MVP card-type constraints.
- Removed old active methodology/source/runtime directories from the active system.
- Replaced runtime content with `t1-start` / `money-and-operations` / `where-money-goes`.
- Adapted the first lesson to current card types only: `single_choice`, `theory`, `single_choice`, `artifact`, `reflection`, `artifact`, `summary`.
- Updated profile saved answers to render under `Персональный финансовый навигатор` without old unit-slug grouping.
- Updated focused frontend/backend/content tests and the QA scenario map for the new graph and legacy 404 behavior.

## Checks

- `npm run check:content` passed.
- `npm run test:run -- src/App.test.tsx src/App.logout.test.tsx` passed.
- `npm run test:run -- src/App.test.tsx` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `npm run check:runtime-imports` passed.
- Backend integration tests and full `npm run verify` require `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`; none is set in this shell.
- Browser smoke was attempted through `npm run dev`, but the backend could not start because local PostgreSQL refused `127.0.0.1:5432`; the frontend-only Vite server was stopped and no authenticated route smoke was counted.
