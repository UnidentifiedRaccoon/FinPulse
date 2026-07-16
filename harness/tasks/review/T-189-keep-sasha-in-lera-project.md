# T-189 — Keep Sasha in Lera project

Status: review
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-16
Branch/worktree: current workspace; preserve unrelated user changes

## Goal

Revise the Story v2 side-project arc so Sasha remains in Lera's project with a
clear, bounded role. Preserve Lera's ownership of the project and the existing
decision not to use the misleading platform. Define collaboration, expenses,
rights, payment responsibility, and future revenue-sharing as questions the
team resolves before sales without turning Sasha into a legal, tax, accounting,
or payment specialist.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_v2_decisions.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/fin-literacy-expert/SKILL.md`
- selected editorial and safety references required by those skills

## Intended write set

- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `docs/methodology/lore_v2_decisions.md`
- `harness/tasks/**/T-189-keep-sasha-in-lera-project.md`

## Out-of-scope

- Lesson screens, source lesson Markdown, runtime JSON, schemas, code, API,
  persistence, real payment handling, tax/legal guidance, or product changes.
- Reopening the decision to reject the original platform and paid tariff.
- Exact revenue percentages, legal form, tax regime, or payment provider.
- Changes to other Story v2 arcs, competencies, geometry, or safety boundaries.

## Plan

1. Define Sasha's role so it grows naturally from his relocation experience and
   does not duplicate Lera's project ownership.
2. Rewrite the book scene with a complete decision and a visible next project
   step.
3. Synchronize the canonical Blueprint and decision log.
4. Run independent narrative and financial-safety review, then docs checks.

## Checks

- [x] Sasha remains in the project with a clear role and observable work.
- [x] Lera remains project lead and makes the platform decision herself.
- [x] The team does not begin sales or accept payments before resolving roles,
  rights, expenses, payment responsibility, and revenue sharing.
- [x] No invented percentage, product, tax/legal conclusion, or personal
  financial recommendation is added.
- [x] Book, canonical Blueprint, and Decision Log agree.
- [x] Independent narrative and financial-safety reviews pass.
- [x] Trailing-whitespace smoke.
- [x] `npm run check:harness`.
- [x] `git diff --check`.

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2_book.md`
  - `docs/methodology/lore_story_v2.md`
  - `docs/methodology/lore_v2_decisions.md`
  - this task packet
- Checks run (pass/fail/blocked/skipped):
  - PASS — structural smoke: 20 Sections and 80 lesson beats remain intact.
  - PASS — stale exit wording removed; role, second test, and `LV2-DEC-003`
    present across the three story documents.
  - PASS — independent narrative review after requested wording fixes.
  - PASS — independent financial/legal safety review.
  - PASS — trailing-whitespace smoke.
  - PASS — `npm run check:harness`; one grandfathered `T-038` duplicate
    warning remains unrelated to this task.
  - PASS — `git diff --check`.
- Risks:
  - The project intentionally remains pre-commercial. Exact revenue shares,
    legal form, tax treatment, payment handling, buyer obligations, and rights
    wording are not canonized and require later agreement or specialist review.
- Follow-up:
  - Product owner reviews the revised branch as part of the five-chapter story.
  - Lesson-screen generation remains out of scope until the separate screen
    model and Phase B preflight are approved.
