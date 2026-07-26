# Project State — FinPulse Learning MVP

Last updated: 2026-07-26

This file is a current-state snapshot, not a task log. Detailed implementation
history lives in `harness/tasks/**` and Git. Keep this file within the automated
harness budget.

## Current phase

The repository contains the Stage 2 learner MVP, a separate internal admin app,
and sixteen published Level 1 lessons. Active Story v2 material is consolidated
under `docs/methodology/lore_v2/`, the only repository source boundary for that
story package.

Story v2 Approval 1 was recorded on 2026-07-14 as `approved_with_blockers`.
Decision `LV2-DEC-005` reopened Phase A, and `LV2-DEC-006` approved a
six-chapter source plus the `6 Levels / 22 Sections / 48 Lessons` design
baseline. Chapter ↔ Level applies only to this story. Blueprint 1.4 remains
`rebuild_required`; packages B/C, Lessons and Cards remain unauthorized.

The 2026-07-16 follow-up decision removes the Board and collectible level
objects from the current Story v2 canon. Sasha now uses ordinary situational
tools: a calendar, personal tables, notes, source folders, and a shared document
only where collaboration requires one. Learner results remain private
Navigator artifacts. No replacement game or meta-progress mechanic is approved.

The 2026-07-24 amendment synchronized the recovered July 23 book into Blueprint
1.4. Its narrative changes remain available; `LV2-DEC-005` superseded its
geometry and `LV2-DEC-006` replaced that geometry at design-baseline level.
Contract, medical/privacy, tax, EGRUL, and financial-registry claims remain
behind explicit source gates.

The Story v2 boundary stores the exact competency DOCX and its lossless
Markdown; both it and the coverage HTML contain the same 576 source rows. The
HTML is synchronized with the six-chapter book through 190 story fragments and
509 current evidence locations; row completeness is not a full-coverage claim.
The sixteen-lesson course stays v1; Story v2 cannot change runtime content before its gates and controls pass.

## Locked product and architecture state

- Educational hierarchy is `Program -> Level -> Section -> Lesson -> Card`.
- Runtime code, JSON, API payloads, routes, and persistence use Level/Section;
  legacy Module/Unit and `t1-*` names are historical only.
- Learner frontend is a Vite React TypeScript SPA with React Router, Tailwind,
  shadcn/ui, and Vitest.
- Fastify serves public content plus learner auth/progress/reflection APIs and
  the built SPA in production.
- PostgreSQL JSONB is the source of truth for published content. Validated JSON
  under `src/content/**` is the seed/migration fixture source.
- PostgreSQL also owns users, sessions, progress, and private saved answers.
- `apps/admin` is the accepted separate Next.js exception. It proxies to the
  Fastify backend and provides a read-only progress board plus guarded content
  editing/preview.
- Admin and learner sessions are separate. Admin read models exclude private
  reflection/artifact answer text by default.
- Source lesson Markdown remains authoring provenance synchronized with
  approved runtime content.
- Learner content stays readable without authentication; login exists only for
  saved progress and private answer artifacts.

Out of scope remains: diagnostics/scoring, rewards/gamification, analytics or
HR dashboards, organizations/RBAC, answer-text review, broad CMS workflows,
payments, production financial operations, personalized recommendations, and a
learner-app migration to Next.js/SSR.

## Published runtime content

Program manifest fixture: `src/content/program.json`.

Level `level-1-start` (`Уровень 1 · Старт`) contains four sections and sixteen
lessons:

1. `money-and-operations`
   - `where-money-goes`
   - `mandatory-and-desired`
   - `safe-payment`
   - `digital-footprint-and-protection`
2. `planning-and-management`
   - `why-reserve-matters`
   - `reserve-target-amount`
   - `pay-yourself-first`
   - `budget-draft`
3. `risk-and-return`
   - `thirty-percent-without-risk-red-flag`
   - `risk-and-return-are-linked`
   - `money-soon-not-in-risk`
   - `what-is-inflation`
4. `financial-environment`
   - `bank-client-rights`
   - `reading-key-terms`
   - `credit-by-psk`
   - `where-to-find-current-data`

Legacy content slugs intentionally return 404. Seed fixtures are not a runtime
fallback after database initialization.

## Durable implementation capabilities

- Level 1 lessons use the accepted eight-screen card architecture; screen 4 is
  the external example/scenario with source-backed statistics.
- Approved Markdown-enabled lesson fields use the safe paragraph-aware Rich
  Text renderer. Labels, ids, CTA labels, variants, values, and technical keys
  remain plain text.
- Interactive card state is local/transient; saved progress and private answers
  are backend-owned.
- Route-level loading/motion and mobile lesson-card rhythm are implemented.
- Admin `/content` validates and publishes guarded JSONB slices with revision
  checks, production learner rendering, real route preview, and local-only
  preview state.
- Admin user detail renders ordered Level -> Section -> Lesson -> Screen
  progress without private answer text.

## Methodology and lore boundary

Canonical v1 sources remain under `docs/methodology/**` and
`docs/levels/level-1-start/**`.

For v2 work:

- `docs/methodology/lore_v2/README.md` defines authority for the single active
  Story v2 folder;
- the current six-chapter book drives the Blueprint rebuild; the folder
  contains the exact competency DOCX and lossless Markdown view;
- Blueprint 1.4 is `rebuild_required`, not an approved source of lesson count;
- `docs/methodology/lore_v2/lore_v2_decisions.md` records the accepted package,
  authority rules and open blockers;
- the coverage HTML is a current six-chapter diagnostic report, not a lesson
  plan or a claim of full competency coverage;
- the Level 1 map, Model B review and production pipeline remain useful review
  material but their `5 × 4 × 4` assumptions require revision;
- prior Source Pack, Competency Table, Project Bible, and Macro Arc are
  read-only provenance and cannot silently override the v2 canon;
- the former Board foundation and collectible-object ladder are superseded
  provenance; any replacement game/meta-progress model requires a separate
  product decision;
- `GAP-GEOMETRY-V2` is resolved only as geometry; packages B/C and Phase B stay
  blocked by the screen model, catalog, namespace, ledger schema, validator,
  Issue Register, and Trace + Continuity Ledger;
- no v2 lesson/runtime mass generation is allowed before those controls.

Project-owned content skills:

- `skills/finpulse-lesson-methodologist`;
- `skills/fin-literacy-expert`;
- `skills/finpulse-content-editor`.

## Verification

Commands:

- `npm run check:harness` — coordination integrity and context budgets;
- `npm run harness:status` — compact task/context health summary;
- `npm run verify:fast` — harness/content/import guards, typecheck, lint, and
  non-DB tests; not a release gate;
- `npm run verify` — full tests plus web/admin/server/Storybook builds.

Full verification requires a reachable PostgreSQL URL through
`FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`. When
none is set, the script may use the documented local development database only
after a successful connection preflight; otherwise it fails before expensive
checks. A remote non-test URL is refused unless explicitly acknowledged. GitHub
Actions supplies an isolated PostgreSQL service.

Known non-blocking build signal: Vite/Storybook can report chunk-size warnings.
Treat new test, type, lint, content, harness, or build failures as real until
proved otherwise.

## Current decisions and risks

- `LV2-DEC-006` approves variable `6 / 22 / 48` and six-chapter segmentation;
  substantive Blueprint, packages B/C and lesson production remain unapproved.
- Screen-model and optional-reflection persistence remain undecided and must be
  revisited against the 48-action baseline without authorizing production.
- Board-dependent screens and collectible-object layouts are no longer part of
  Story v2. A replacement game/meta-progress mechanic remains deliberately
  undecided and must not be inferred from Sasha's calendar, tables, or notes.
- Documented competency gaps must not be hidden behind a full-coverage claim.
- Story v2's employer-benefit, card, DMS, tax, EGRUL, and regulated-platform
  details must not be generalized beyond their contract/date/source boundary;
  `LV2-DEC-004` source gates block affected lesson prototypes/publication until
  refreshed.
- Production secret/session hardening and rate limiting remain open.
- Export/delete controls and richer metadata for private saved answers remain
  future work.
- The legacy `review/` task lane contains historical packets that predate the
  strict lifecycle contract; do not treat all of them as an actionable queue.
- Historical task ID `T-038` is duplicated. New task creation rejects reuse;
  the checker reports this legacy debt without rewriting provenance.

## Canonical docs

- Product: `docs/PRODUCT.md`
- Architecture: `docs/ARCHITECTURE.md`
- Decisions: `docs/DECISIONS.md`
- Content model: `docs/CONTENT_MODEL.md`
- Development: `docs/DEVELOPMENT.md`
- Methodology: `docs/methodology/METHODOLOGY.md`
- Lesson authoring: `docs/methodology/AUTHORING.md`
- Design system: `docs/DESIGN_SYSTEM.md`
- QA scenarios: `docs/QA_USER_SCENARIO_MAP.md`
- Deploy runbook: `docs/operations/yandex-cloud-finpulse-deploy.md`
- Git/PR workflow: `docs/engineering/contributing.md`

## Update policy

Update this snapshot only when shipped/current architecture, product boundary,
runtime content, verification requirements, major decisions, or active blockers
change. Do not append task summaries, command transcripts, UI micro-details, or
per-task check results. The orchestrator owns state integration.
