# T-114 — First-screen option feedback content

Status: review
Owner: Codex
Started: 2026-06-13
Completed: 2026-06-13

## Goal

Use the Google Docs JSON-card's distinct per-option feedback for `where-money-goes` screen 1 instead of the generic screen-table reaction.

## Files changed

- `docs/levels/t1-start/sections/money-and-operations/lesson_01_where-money-goes.md`
- `src/content/levels/t1_start/sections/section_01_money_and_operations.json`
- `src/App.test.tsx`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Source

Google Doc export JSON-card for screen 1:

- `Да, постоянно так` -> `Знакомо. Сейчас увидим, куда уходят деньги.`
- `Иногда бывает` -> `Бывает у многих. Давай посмотрим на мелкие траты.`
- `Нет, я знаю, куда уходят деньги` -> `Отлично — проверим это на практике.`

## Result

- Runtime JSON now uses those three option-level feedback strings.
- Local source Markdown now preserves the per-option reactions instead of only the generic table reaction.
- The App regression test now checks that reselecting another subjective option changes the shown feedback.
- Local dev was restarted after the content update so the backend reread JSON.

## Verification

- `npm run check:content`
- `npm run test:run -- src/App.test.tsx`
- `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- Browser smoke on `http://localhost:5173/lessons/where-money-goes`: selected all three first-screen options and saw three distinct reactions; `Далее` stayed enabled, `Проверить` was absent, no Vite overlay or horizontal overflow was detected.
- Local dev DB was brought forward with the existing Level/Section reflection columns so `/api/reflections` returns 200 during Browser QA.
