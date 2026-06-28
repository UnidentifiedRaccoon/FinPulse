# T-161 — FinPulse content editor skill

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-06-28
Branch/worktree: main

## Goal

Create a project-owned Codex skill `finpulse-content-editor` that can be
versioned in GitHub and reused by agents to automatically improve FinPulse
lesson wording produced by the methodologist agent.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/engineering/contributing.md`
- `.system/skill-creator/SKILL.md`
- current T-160 lesson 1-4 review diff and source Markdown

## Intended write set

- `skills/finpulse-content-editor/**`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`
- this task file

## Out-of-scope

- Editing runtime lesson content.
- Changing content schemas, UI, tests, or app code.
- Commit, push, or PR creation.

## Plan

1. Create a deployable project skill folder with concise `SKILL.md`.
2. Add a focused style rubric extracted from current lesson 1-4 edits.
3. Add agent UI metadata for discoverability.
4. Validate file shape and run lightweight checks.
5. Move task to review.

## Checks

- [x] `find skills/finpulse-content-editor -maxdepth 3 -type f -print`
- [x] Node metadata/frontmatter smoke check
- [x] `rg` content smoke check for required policy terms
- [x] `wc -l` size check
- [x] `git diff --check`
- [!] skill-creator `quick_validate.py` — blocked by missing `yaml`/PyYAML in both local and bundled Python.

## Result packet

- Files changed: `skills/finpulse-content-editor/SKILL.md`, `skills/finpulse-content-editor/references/editorial-rubric.md`, `skills/finpulse-content-editor/agents/openai.yaml`, harness state.
- Checks run: file listing, Node metadata/frontmatter smoke, `rg` policy smoke, `wc -l`, `git diff --check`; attempted `quick_validate.py`.
- Risks: official skill quick validator could not run until PyYAML is available.
- Follow-up: publish the `skills/finpulse-content-editor` folder with the repo or install/copy it into a Codex skills directory when needed.
