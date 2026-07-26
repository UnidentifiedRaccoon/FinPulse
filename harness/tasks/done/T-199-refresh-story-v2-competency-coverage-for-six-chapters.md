# T-199 — Refresh Story v2 competency coverage for six chapters

Status: done
Owner: Codex `/root`
Model: GPT-5.5 / xhigh
Started: 2026-07-26
Branch/worktree: current workspace (`main`)

## Goal

Refresh the standalone 576-row Story v2 competency-coverage artifact against
the current six-chapter canonical book, preserving conservative qualitative
judgments unless current evidence invalidates them.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `harness/RISK_POLICY.md`
- `harness/tasks/done/T-194-story-v2-competency-coverage.md`
- `harness/tasks/done/T-195-redesign-story-v2-competency-coverage-report.md`
- `harness/tasks/done/T-196-publish-competency-coverage-report-to-github-pages.md`
- `docs/methodology/lore_v2/README.md`
- `docs/methodology/lore_v2/lore_story_v2_book.md`
- `docs/methodology/lore_v2/lore_v2_decisions.md`
- `docs/methodology/lore_v2/adult_financial_competencies_2026.md`
- `docs/methodology/lore_v2/lore_story_v2_book_competency_coverage.html`
- `docs/methodology/.impeccable/surfaces/lore-story-v2-book-competency-coverage-html.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/domain-map.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`

## Intended write set

- `docs/methodology/lore_v2/lore_story_v2_book_competency_coverage.html`
- `docs/methodology/lore_v2/README.md`
- `docs/methodology/README.md` (active methodology entrypoint synchronization)
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md` (orchestrator-only removal of the resolved geometry
  blocker from the current decision queue)
- `harness/tasks/active/T-199-refresh-story-v2-competency-coverage-for-six-chapters.md`

## Out-of-scope

- No change to the canonical book, Decision Log, adult competency source,
  coverage classifications, or evidence wording unless an exact-current-source
  check proves a specific record invalid.
- No Lessons, Cards, Blueprint rebuild, B/C decisions, runtime content, API,
  schema, database, application UI, or production deploy changes.
- Preserve the standalone offline design, all 576 source rows, filters,
  accessibility behavior, and unrelated dirty-worktree changes.
- Public `gh-pages` publication is sequenced after local verification and
  requires working GitHub authentication.

## Plan

1. Reconstruct the report's embedded registry/story data and current-book
   paragraph model without using deprecated lore sources.
2. Remap evidence to the six current chapters and add only the two approved
   bridge fragments.
3. Update active report metadata and remove stale status from authority docs.
4. Verify exact corpus, evidence, calculations, interactions and offline HTML.

## Checks

- [x] 576-row registry/status/evidence and six-chapter fragment invariants.
- [x] Standalone HTML/JavaScript/offline/accessibility regression checks.
- [x] `npm run check:harness`
- [x] `git diff --check`

## Result packet

- Files changed:
  - `docs/methodology/lore_v2/lore_story_v2_book_competency_coverage.html`;
  - `docs/methodology/lore_v2/README.md`;
  - `docs/methodology/README.md`;
  - `harness/PROJECT_STATE.md`;
  - `harness/WORKBOARD.md`;
  - this task packet.
- Checks run (pass/fail/blocked/skipped):
  - PASS — all 188 prior story fragments matched the current book exactly once;
    the refreshed registry has `33 / 26 / 39 / 25 / 39 / 28 = 190`
    fragments and only the approved `CH03-P039` and `CH05-P039` bridges are
    new;
  - PASS — all 576 competency rows match the canonical Markdown source;
    statuses remain `95 covered / 172 partial / 309 gap`, all 509 evidence
    quotes resolve, and current-chapter evidence counts are
    `58 / 108 / 105 / 124 / 61 / 53`;
  - PASS — the semantic coverage projection excluding chapter/fragment
    addresses is unchanged, SHA-256
    `325d202b63b4aa21d1ae9390e799ba6f22380ab3cd19cdaa91e070343d52dc06`;
  - PASS — JavaScript syntax, CSP/offline scan, built-in self-test, 576-row DOM
    rendering, search, status filtering, reset, detail expansion and Escape
    collapse;
  - PASS — `npm run check:harness`, with only the grandfathered T-038 warning;
  - PASS — `git diff --check`;
  - SKIPPED — full `npm run verify`; this is a docs/harness-only artifact
    refresh and full CI remains the merge gate.
- Risks:
  - paragraph IDs are structural addresses, so future book paragraph changes
    require deterministic remapping rather than cascading string replacement;
  - the 576 rows form a complete assessment registry, not a claim that all
    competencies are covered; classifications remain qualitative judgments;
  - the already published `gh-pages` copy remains stale until it is updated
    through a separate authenticated publication step.
- Follow-up:
  - restore valid GitHub CLI authentication, then commit/push/open the source
    PR and publish the verified HTML to `gh-pages` separately;
  - merge to `main` only after required checks pass and the production deploy
    side effect is explicitly authorized.
