# T-168 — FinPulse lesson methodologist skill

Status: review
Owner: Codex
Model: GPT-5.5 / xhigh
Started: 2026-07-04
Branch/worktree:

## Goal

Create a project-owned `finpulse-lesson-methodologist` skill for generating
FinPulse lesson drafts from approved topics and source material. The skill must
write both source Markdown and runtime JSON, enforce the eight-screen lesson
architecture for Level 1 and later levels, require `fin-literacy-expert` review,
and hand off prose polish to `finpulse-content-editor`.

## Context

- AGENTS.md
- harness/PROJECT_STATE.md
- harness/WORKBOARD.md
- docs/PRODUCT.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/methodology/METHODOLOGY.md
- docs/methodology/AUTHORING.md
- skills/fin-literacy-expert/SKILL.md
- skills/finpulse-content-editor/SKILL.md

## Intended write set

- skills/finpulse-lesson-methodologist/**
- harness/tasks/review/T-168-finpulse-lesson-methodologist-skill.md
- harness/WORKBOARD.md
- harness/PROJECT_STATE.md
- AGENTS.md

## Out-of-scope

- Runtime lesson/content changes
- App code changes
- Branch, commit, push, or PR work

## Plan

1. Initialize the project skill skeleton with `skill-creator`.
2. Add methodologist workflow, output contract, and agent metadata.
3. Validate structure and update project state.

## Checks

- [x] `python3 .../quick_validate.py skills/finpulse-lesson-methodologist`
  attempted; blocked because this Python environment lacks `yaml`/PyYAML
- [x] frontmatter/openai.yaml smoke check
- [x] `wc -l skills/finpulse-lesson-methodologist/SKILL.md skills/finpulse-lesson-methodologist/references/output-contract.md`
- [x] `git diff --check`

## Result packet

- Files changed: `skills/finpulse-lesson-methodologist/SKILL.md`,
  `skills/finpulse-lesson-methodologist/agents/openai.yaml`,
  `skills/finpulse-lesson-methodologist/references/output-contract.md`,
  `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`,
  this task file.
- Checks run: quick validator attempted but blocked by missing PyYAML; Node
  metadata/frontmatter smoke check passed; line-count check passed;
  `git diff --check` passed.
- Risks: no forward-test on a real lesson creation prompt yet.
- Follow-up: use the skill on the next lesson creation task and let
  `finpulse-content-editor` handle the subsequent copy-polish pass.
