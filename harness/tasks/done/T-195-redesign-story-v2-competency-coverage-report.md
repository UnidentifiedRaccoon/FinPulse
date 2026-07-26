# T-195 — Redesign story v2 competency coverage report

Status: done
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-26
Branch/worktree: current workspace

## Goal

Redesign the standalone 576-row Story v2 competency coverage report into a
calm, low-density overview-first reading surface, with every registry row
visibly and accessibly colored by coverage status while preserving all source
data, classifications, evidence, filters, and offline behavior.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/tasks/done/T-194-story-v2-competency-coverage.md`
- `docs/PRODUCT.md`
- `docs/methodology/lore_story_v2_book_competency_coverage.html`
- User-level Impeccable `SKILL.md`
- User-level Impeccable `reference/new-work.md`
- User-level Impeccable `reference/document.md`
- User-level Impeccable `reference/visualize.md`
- User-level Impeccable `reference/craft-floor.md`
- Bundled `imagegen` skill instructions
- Bundled in-app Browser control skill instructions
- `docs/DESIGN_SYSTEM.md` (learner-app boundary only)

## Intended write set

- `harness/tasks/active/T-195-redesign-story-v2-competency-coverage-report.md`
- `docs/methodology/lore_story_v2_book_competency_coverage.html`
- `docs/methodology/DESIGN.md`
- `docs/methodology/.impeccable/design.json`
- `docs/methodology/.impeccable/surfaces/**`

## Out-of-scope

- No changes to the 576 competency records, status decisions, evidence, source
  story, or adult competency framework.
- No edits under `src/`, `apps/`, `backend/`, or `public/`.
- No application route, dependency, external service, network request, commit,
  push, `PROJECT_STATE.md`, or `WORKBOARD.md` change.
- Parallel agents are read-only; `/root` is the sole integration owner.

## Plan

1. Lock one Impeccable visual direction for the overview-first reading mode.
2. Record the artifact-specific visual system and surface brief.
3. Redesign the HTML shell and add full-row semantic status color.
4. Verify data invariants, interactions, accessibility, responsiveness, and
   offline behavior.
5. Run the Impeccable detector and an independent finish review; apply material
   corrections.

## Checks

- [x] 576-row data and status-count invariants
- [x] Search, filters, reset, expansion, and keyboard interaction checks
- [ ] Desktop and mobile visual inspection — blocked by Browser `file://` policy
- [x] Impeccable mechanical detector
- [x] `npm run check:harness`
- [x] `git diff --check`

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2_book_competency_coverage.html`
  - `docs/methodology/DESIGN.md`
  - `docs/methodology/.impeccable/design.json`
  - `docs/methodology/.impeccable/surfaces/lore-story-v2-book-competency-coverage-html.md`
  - `harness/tasks/done/T-195-redesign-story-v2-competency-coverage-report.md`
- Checks run (pass/fail/blocked/skipped):
  - PASS — official Impeccable user-level installation updated to v4.0.2.
  - PASS — Impeccable direction flow, local Condition Atlas direction, three-composition north-star probe, and composition A selection after two unattended decision timeouts.
  - PASS — DOM regression: 576 records, 188 story fragments, 95 fully covered, 172 partially covered, 309 not covered, and 576 paired data/detail rows.
  - PASS — summary status filtering, full-text search, native filters, reset, row expansion, Escape collapse/focus, and empty state.
  - PASS — every data and detail row carries `data-status`; full-row fields, written Russian labels, and distinct `✓` / `◐` / `—` marks are present.
  - PASS — standalone/offline CSP, no external styles/scripts or network API calls, single active Condition Atlas stylesheet, and scoped print handling.
  - PASS — CSS parsed with PostCSS; `.impeccable/design.json` parsed as JSON; surface brief resolved from the methodology boundary.
  - PASS — contrast checks: body/canvas 13.73:1, muted/canvas 5.80:1, placeholder/surface 4.78:1, status ink/field 5.44–6.54:1, focus/canvas 5.74:1.
  - PASS — one-time Impeccable detector; only advisory was eight em dashes inside the preserved source corpus, so no source wording was changed.
  - PASS — independent GPT-5.6 Sol/xhigh finish review; all five material fixes were applied without rerunning the detector.
  - BLOCKED — final rendered desktop/mobile inspection because Browser rejects local `file://` reload and forbids workaround navigation.
  - PASS — `npm run check:harness` with only the grandfathered duplicate `T-038` warning.
  - PASS — `git diff --check`; `git diff --no-index --check` emitted no whitespace warnings for all five new/changed task files.
- Risks:
  - Final first-viewport height, print preview, and 576-row browser paint behavior still need a human visual spot-check in the already-open local file.
  - Coverage classifications remain the unchanged qualitative judgments from T-194.
- Follow-up:
  - Refresh the open local HTML and optionally inspect near 1440×900 and 390×844; no application, source-story, competency, or classification changes are pending.
