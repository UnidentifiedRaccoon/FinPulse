# Workboard

This is the lightweight coordination board for current human and agent work.
Detailed implementation notes live in `harness/tasks/review/T-*.md`; this file
should not duplicate the full task archive.

Statuses:
- `planned`
- `active`
- `blocked`
- `review`
- `done`

## Active Tasks

Use files under `harness/tasks/active/` for real active work.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| _None_ | - | - | - | - |

## Review Queue Snapshot

Recent review tasks that define the current top of stack:

| ID | Status | Task | Notes |
|---|---:|---|---|
| T-159 | review | Column header height and clamp | Column headers now use a neutral gray surface, 57px minimum height in the product result, and explicit two-line clamp. Focused renderer/App tests, typecheck, lint, Browser QA, and diff check passed; full verify still needs a backend test DB URL. |
| T-158 | review | Column header and iconless items | Adds tinted header strips and text-only answer cards without marker icons to production and preview column results. Focused renderer/App tests, typecheck, lint, Browser QA, and diff check passed; full verify still needs a backend test DB URL. |
| T-157 | review | First lesson categorization columns | Applies the column final check only to `card_l1s1l1_03_sorting_choice`; moved answers append to the target column bottom, extra result frame and count badges are removed. Focused renderer/App tests, typecheck, lint, Browser QA, and diff check passed; full verify still needs a backend test DB URL. |
| T-156 | review | Categorization columns experiment | Adds isolated `/design/categorization-columns` mock route with 2/3/4-column final checks and click-to-move mechanics. Focused App tests, typecheck, lint, Browser QA, and diff check passed; full verify still needs a backend test DB URL. |
| T-155 | review | Body text weight normalization | Ordinary learner/body text now uses regular 400; the typography docs no longer define a 500 body-text layer. Focused App tests, typecheck, lint, web build, Storybook build, and diff check passed; full verify still needs a backend test DB URL. |
| T-154 | review | Chevron only section passport | Refines T-153 so collapsed section passports show only a small chevron under the heading; description appears only after tap. Focused App tests, typecheck, lint, diff check, and web build passed. |
| T-153 | review | Section passport description | Adds compact expandable section passports, updates the first section description, and strips `Раздел N.` from displayed section headings while keeping sticky section-number context. Focused checks and web build passed; full verify still needs a backend test DB URL. |
| T-152 | review | Add planning management lessons | Adds Level 1 Section 2 with У1.5-У1.8. Content validation, focused frontend/content tests, lint, and 390px browser smoke passed; backend/full admin checks need local DB and complete admin dependencies. |
| T-151 | review | Safe project autocompaction | Compacted project memory docs without touching app code, runtime JSON, schemas, or canonical product/methodology docs. |
| T-150 | review | Paragraph-aware Rich Text rendering | Latest learner UI/content rendering change. Full local verify still needs a PostgreSQL test DB URL in this shell. |
| T-149 | review | Source-backed lesson rich formatting | Runtime JSON restores approved DOCX-backed rich formatting and source-table wording. |
| T-148 | review | Rich Text Markdown rendering | Safe renderer for approved Markdown-enabled lesson fields. |
| T-147 | review | Add money operations lessons 3 and 4 | Active section now has four Level 1 money-and-operations lessons. |
| T-146 | review | Markdown content contract | Validator/schema split approved Markdown-enabled fields from plain fields. |
| T-145 | review | Authoring Markdown contract | Lesson authoring regulation documents Markdown/plain-text boundaries. |
| T-144 | review | Categorization result horizontal scroll | Result matrix is bounded and internally scrollable with sticky header/first column. |
| T-143 | review | Lesson reglament CTA and screen 1 feedback | Source-backed CTA and screen-1 per-option feedback validation. |
| T-142 | review | Node 24 runtime refresh | Node 24/npm 11 local, CI, and container baseline. |
| T-141 | review | Methodology split | General methodology and lesson authoring regulation are separate maintained sources. |
| T-140 | review | Production admin deploy path | Separate production deploy path for the Next.js admin app. |
| T-139 | review | Internal admin progress board | Separate read-only admin surface and protected `/api/admin/**` read model. |

Older review task details remain available in `harness/tasks/review/`. Do not
copy them back into this board unless a task becomes active again.

## Done Seed Tasks

| ID | Status | Task | Notes |
|---|---:|---|---|
| T-001 | done | Scaffold Vite React TS app | Initial scaffold. |
| T-002 | done | Install Tailwind + shadcn/ui | Tailwind v4 and shadcn/ui initialized. |
| T-003 | done | Add content model and example content | Initial JSON content and source docs. |
| T-004 | done | Add routing and pages | Overview/module/lesson-era routes were the original baseline. |
| T-005 | done | Add lesson block renderer | Initial renderer baseline. |
| T-006 | done | Add mobile app shell | Mobile-first shell baseline. |
| T-007 | done | Add first component tests | Initial Vitest coverage. |
| T-008 | done | Content data model and Module 1 runtime content | Merged in PR #2. |
| T-009 | done | Interactive lesson cards | Merged in PR #4. |
| T-010 | done | Decide Stage 2 backend scope | ADR-0006 accepted backend scope. |
| T-011 | done | Build Stage 2 backend API | Initial Fastify backend. |
| T-012 | done | Migrate frontend to backend API | SPA pages moved to backend content API. |
| T-013 | done | Stage 2 verification and PR polish | Stage 2 smoke and verify. |
| T-014 | done | Add API contract guards | Shared API contract tests and runtime import guard. |
| T-015 | done | Clean friendly-learning design system | MVP-safe design-system guidance. |
| T-019 | done | Sky blue token rename | Accent token family renamed to `sky`. |

## Board Hygiene

- Keep active tasks explicit and small.
- Keep only the current review snapshot here.
- Use `harness/tasks/review/T-*.md` as the detailed audit trail.
- Avoid repeating canonical docs; link to `docs/**` instead.
- Avoid reintroducing stale `Module` / `Unit` runtime terminology except when
  describing historical tasks.
