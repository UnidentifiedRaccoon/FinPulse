# T-134 — Mandatory Desired First-Screen Feedback

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-14
Completed: 2026-06-14
Branch/worktree: current workspace

## Goal

Use the methodologist JSON-card option-level feedback for `mandatory-and-desired` screen 1 instead of the repeated generic reaction.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/methodology/AUTHORING.md
- docs/methodology/METHODOLOGY.md
- build-web-apps:frontend-testing-debugging skill
- browser:control-in-app-browser skill

## Intended write set

- docs/levels/level-1-start/sections/money-and-operations/lesson_02_mandatory-and-desired.md
- src/content/levels/level_1_start/sections/section_01_money_and_operations.json
- src/App.test.tsx
- harness/tasks/active/T-134-mandatory-desired-first-screen-feedback.md
- harness/tasks/review/T-134-mandatory-desired-first-screen-feedback.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md

## Source

User-provided methodologist JSON-card option feedback for `mandatory-and-desired` screen 1:

- `Да, регулярно` -> `Знакомо. Научимся различать нужное и приятное.`
- `Иногда` -> `Бывает у многих — посмотрим на разницу.`
- `Почти никогда` -> `Отлично. Закрепим это на примерах.`

## Result

- Runtime JSON now uses the three source option-level feedback strings on `card_l1s1l2_01_hook`.
- Local source Markdown now preserves the per-option JSON-card reactions instead of only the repeated generic table reaction.
- App regression coverage now selects all three first-screen options in `mandatory-and-desired` and asserts distinct feedback, no generic `Любой ответ`, no `Проверить`, and enabled source CTA.
- The local dev pair was restarted so backend `3001` now serves the updated JSON; Vite web is running on `http://localhost:5173/`.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx`
- [x] `npm run build`
- [x] `git diff --check`
- [x] `npm run verify` attempted; content validation, runtime import guard, typecheck, and lint passed, then backend tests failed because this shell has no `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
- [x] API smoke on `http://127.0.0.1:3001/api/lessons/mandatory-and-desired`: screen 1 returns the three updated feedback strings.
- [x] Browser smoke on fresh `http://127.0.0.1:5174/lessons/mandatory-and-desired` with backend `3002`: 390x844 checked all three reactions, no generic feedback, CTA enabled, no `Проверить`, no horizontal overflow, and no console warnings/errors; default viewport checked `Иногда` feedback with no console warnings/errors.
- [x] Browser smoke on standard `http://localhost:5173/lessons/mandatory-and-desired`: default viewport checked `Иногда` -> `Бывает у многих — посмотрим на разницу.`, no generic feedback, and no console warnings/errors.

## Notes

- Vite listens on IPv6 loopback in the default dev setup, so `http://localhost:5173/` is the working web URL in this session; `http://127.0.0.1:5173/` can refuse even when the app is running.

## Result packet

- Files changed: `docs/levels/level-1-start/sections/money-and-operations/lesson_02_mandatory-and-desired.md`, `src/content/levels/level_1_start/sections/section_01_money_and_operations.json`, `src/App.test.tsx`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`, this task file
- Checks run: content validation, focused App tests, production build, diff check, full verify attempt, API smoke, Browser smoke
- Risks: full verify still needs a PostgreSQL test database URL in this shell
- Follow-up: none
