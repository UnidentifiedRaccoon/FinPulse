# T-115 — Card CTA labels

Status: review
Owner: Codex
Started: 2026-06-13

## Goal

Let runtime lesson cards define their own primary continue CTA text, starting with the first screen of the first two `money-and-operations` lessons.

## Expected write set

- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- `harness/schemas/content.schema.json`
- `scripts/check-content-json.mjs`
- `src/content/program.ts`
- `src/content/levels/t1_start/sections/section_01_money_and_operations.json`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonBottomAction.tsx`
- `src/App.test.tsx`
- `harness/tasks/active/T-115-card-cta-labels.md`
- `harness/tasks/review/T-115-card-cta-labels.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- No new card types or interactions.
- No broad copy migration for every screen in every lesson in this pass.
- No backend or persistence changes.

## Plan

1. Add optional `ctaLabel` to card schema/types/validator/docs.
2. Use `ctaLabel` for advance actions, with `Далее` fallback and system labels for `Проверить`/`Завершить`.
3. Add first-screen CTA labels to `where-money-goes` and `mandatory-and-desired`.
4. Verify tests, content validation, full verify, and Browser smoke.

## Checks

- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`
- [x] API CTA smoke: first card of `where-money-goes` returns `Разобраться, куда уходят мои деньги`; first card of `mandatory-and-desired` returns `Научиться различать`.
- [x] Browser smoke on first-screen CTAs: both CTAs are visible, disabled before answer selection, and generic `Далее` is not visible on the first screen. Browser click on radio options hit the in-app Browser CDP timeout, so post-selection enablement is covered by focused tests.
