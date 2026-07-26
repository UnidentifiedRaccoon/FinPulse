# T-196 — Publish competency coverage report to GitHub Pages

Status: done
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-26
Branch/worktree: codex/ci/t-196-publish-coverage-pages

## Goal

Publish the redesigned standalone competency-coverage report on GitHub Pages
without exposing the rest of `docs/` or triggering the existing Yandex Cloud
production deployment.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/RISK_POLICY.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/engineering/contributing.md`
- `harness/tasks/done/T-194-story-v2-competency-coverage.md`
- `harness/tasks/done/T-195-redesign-story-v2-competency-coverage-report.md`
- `docs/methodology/lore_story_v2_book_competency_coverage.html`
- GitHub repository and Pages settings for `UnidentifiedRaccoon/FinPulse`
- Official GitHub Pages custom-workflow documentation (version check only)

## Intended write set

- `harness/tasks/active/T-196-publish-competency-coverage-report-to-github-pages.md`
- `docs/methodology/lore_story_v2_book_competency_coverage.html`
- `docs/methodology/DESIGN.md`
- `docs/methodology/.impeccable/**`
- `harness/tasks/done/T-194-story-v2-competency-coverage.md`
- `harness/tasks/done/T-195-redesign-story-v2-competency-coverage-report.md`
- `index.html` (remote `gh-pages` branch only)
- `.nojekyll` (remote `gh-pages` branch only)

## Out-of-scope

- No edits to learner/admin/runtime code, content sources, or coverage judgments.
- No publication of the full `docs/` tree.
- No changes to `.github/workflows/deploy.yml` or Yandex Cloud resources.
- No merge to `main` and no production application deployment.
- Preserve unrelated `T-193` and all other user changes.

## Plan

1. Confirm remote/default branch, Pages state, and publication boundaries.
2. Create a clean source branch from `origin/main` and preserve unrelated files.
3. Publish only the report as `gh-pages:/index.html` and configure Pages to use it.
4. Verify the remote build, public URL, page data, interactions, and appearance.
5. Record results, run repository checks, and open a scoped draft PR for source provenance.

## Checks

- [x] Standalone HTML/data integrity and secret-pattern checks
- [x] Remote Pages build and HTTP/browser smoke checks
- [x] `npm run check:harness`
- [x] `git diff --check`

## Result packet

- Files changed:
  - Remote `gh-pages:/.nojekyll`
  - Remote `gh-pages:/index.html`
  - `docs/methodology/lore_story_v2_book_competency_coverage.html`
  - `docs/methodology/DESIGN.md`
  - `docs/methodology/.impeccable/design.json`
  - `docs/methodology/.impeccable/surfaces/lore-story-v2-book-competency-coverage-html.md`
  - `harness/tasks/done/T-194-story-v2-competency-coverage.md`
  - `harness/tasks/done/T-195-redesign-story-v2-competency-coverage-report.md`
  - `harness/tasks/done/T-196-publish-competency-coverage-report-to-github-pages.md`
- Checks run (pass/fail/blocked/skipped):
  - PASS — dedicated orphan `gh-pages` commit `8dfb6791c59d0c914b5d6561d8db7d07a82fce8c` contains exactly `.nojekyll` and `index.html`; `main` and the Yandex workflows were not changed or dispatched.
  - PASS — GitHub Pages source is `gh-pages` `/`, HTTPS is enforced, build `1115540407` completed with `built`, and the public URL is `https://unidentifiedraccoon.github.io/FinPulse/`.
  - PASS — public HTTP response was `200 text/html`, 1,187,869 bytes, and byte-identical to the local report with SHA-256 `3bdcab7f2d917e0c150da36024f9e3707f5064ef3a5dddf3ba6e8e1ce91be67a`.
  - PASS — live browser DOM: 576 data rows, 576 detail rows, 95 covered, 172 partial, and 309 gaps; all three statuses expose distinct full-row computed background colors.
  - PASS — live summary filter reduced the registry to the expected 95 covered rows; reset restored all 576 rows; no browser console warnings or errors.
  - PASS — desktop 1280×720 and mobile 390×844 visual checks; no horizontal overflow, readable overview, responsive controls/cards, and visibly tinted rows.
  - PASS — standalone DOM regression: 576 records, 188 story fragments, paired rows, status counts, search, filters, reset, expansion, Escape, and empty state.
  - PASS — disclosure scan found no credentials, private learner data, local paths, external resources, or network APIs in the published HTML; provenance paths in T-194/T-195 were repository-neutralized before source publication.
  - PASS — two independent GPT-5.6 Sol/xhigh read-only audits confirmed deployment isolation and artifact integrity; the full registry/story corpus is intentionally public under the user's explicit request to publish this exact report.
  - PASS — `npm run check:harness` with only the grandfathered duplicate `T-038` warning.
  - PASS — `git diff --check` and staged whitespace validation.
- Risks:
  - The Pages URL is public and intentionally contains the complete 576-item competency registry, 188 story fragments, and qualitative coverage judgments.
  - The source branch is intentionally not merged because any `main` push triggers the separate Yandex Cloud production deployment.
- Follow-up:
  - Keep future Pages updates isolated to `gh-pages`; merge the source PR only together with an explicitly authorized production rollout or after narrowing the `main` deployment trigger.
