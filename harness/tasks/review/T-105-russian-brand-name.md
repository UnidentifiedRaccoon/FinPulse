# T-105 — Russian brand name

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-08
Branch/worktree: current workspace

## Goal

Replace app-facing exact `FinPulse` brand strings with the Russian name `ФинПульс`.

## Intended write set

- `index.html`
- `.storybook/preview.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `src/App.logout.test.tsx`
- `src/pages/EntryPage.tsx`
- `src/shared/ui/Mascot.tsx`
- `src/content/program.json`
- `src/content/modules/t1_start/module.json`
- `src/features/storybook/foundations/Colors.stories.tsx`
- `src/features/storybook/foundations/Typography.stories.tsx`
- `src/features/storybook/foundations/Shadows.stories.tsx`
- `harness/tasks/active/T-105-russian-brand-name.md`
- `harness/tasks/review/T-105-russian-brand-name.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Out of scope

- Technical identifiers, environment variables, database names, repository names, historical deployment notes, and filesystem paths that contain `FinPulse`.
- Broad documentation rename outside the app-facing brand surface.

## Checks

- [x] `rg -n -S "FinPulse" index.html src .storybook` returned no app-scope matches.
- [x] `npm run check:content`
- [x] `npm run test:run -- src/App.test.tsx src/App.logout.test.tsx`
- [x] `FINPULSE_TEST_DATABASE_URL=postgres://finpulse:finpulse@127.0.0.1:5432/finpulse_test npm run verify`

## Result packet

- Files changed: app title, auth heading, sidebar accessible label, mascot alt text, runtime program/module content metadata, app test expectations, and Storybook foundation labels now use `ФинПульс`.
- Checks run: app-scope `rg`, content validation, focused App/logout tests, and full verify with the documented local PostgreSQL test database URL.
- Risks: plain `npm run verify` without a database URL still fails at backend test setup, as documented by the project state; the DB-backed verify passed.
- Follow-up: exact `FinPulse` remains in technical/historical docs, deployment notes, repository paths, and harness records outside the app-facing brand surface.
