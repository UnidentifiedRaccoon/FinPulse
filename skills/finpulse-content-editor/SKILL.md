---
name: finpulse-content-editor
description: Use when editing FinPulse educational lesson copy produced by a methodologist agent, especially Russian wording in runtime JSON, source Markdown, feedback text, CTA labels, lesson descriptions, or related schema/UI/docs needed to support better copy. The skill should directly apply safe copy edits, sync source Markdown and JSON, and return only items that need human review.
---

# FinPulse Content Editor

## Purpose

Edit FinPulse lesson text so it is clear, methodologically aligned, schema-valid,
and ready for the learner app. This skill is for polishing or correcting content
prepared by a methodologist agent.

Use it for:
- runtime lesson JSON under `src/content/**`;
- source lesson Markdown under `docs/levels/**`;
- review tables, Google Docs exports, or patch packets with editorial comments;
- schema/UI/docs updates when existing fields cannot express the needed copy.

## Required Context

In a FinPulse repo, read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/AUTHORING.md`
- relevant lesson source Markdown and runtime JSON

For style decisions, read `references/editorial-rubric.md`.

## Operating Rules

- Edit directly when the change is coherent and schema-compatible.
- If the current schema/UI cannot store the needed wording, add or extend the
  necessary fields, validator rules, UI rendering, docs, and tests.
- Sync runtime JSON and source Markdown for every accepted lesson copy change.
- Treat statistics and numeric facts present in approved source/review material
  as confirmed; preserve them unless the user explicitly asks to change them.
- Do not browse to verify figures unless the user specifically asks for fresh
  verification or the source itself flags a fact as unresolved.
- Preserve the approved hierarchy: `Program -> Level -> Section -> Lesson -> Card`.
- Do not introduce diagnostics, scores, labels, personalized recommendations,
  analytics, gamification, real reminders, or backend/admin scope.
- Keep personal reflection/artifact screens non-evaluative.

## Workflow

1. Identify the target lessons, selected review items, and out-of-scope items.
2. Compare review/source wording with runtime JSON and source Markdown.
3. Apply editorial changes in this priority order:
   1. clarity;
   2. methodological accuracy;
   3. emotionally safe tone;
   4. brevity;
   5. schema/content-model compliance;
   6. preservation of author wording.
4. For interactive cards, split result copy by state when useful:
   - `feedbackTitle`: plain-text correct/accepted title;
   - `feedback`: Markdown-enabled correct/accepted body;
   - `retryFeedbackTitle`: plain-text incorrect title;
   - `retryFeedback`: Markdown-enabled incorrect-only body.
5. Keep Markdown only in fields allowed by `CONTENT_MODEL.md`.
6. Run at minimum:
   - `npm run check:content` for content changes;
   - focused tests for changed renderer/content behavior;
   - `npm run typecheck`, `npm run lint`, and `git diff --check` for code/schema changes.
7. Update the task file and project state if the repo workflow requires it.

## Human Review Policy

Only send items to human review when the agent cannot make a defensible edit:
- conflicting source instructions;
- missing product/methodology decision;
- wording that would change product scope or legal/financial meaning;
- schema/UI change that is too broad for the requested task;
- a check that cannot run or fails for an environment reason.

Final response format:

```md
Needs review:
- <item with file/card/context and the exact decision needed>
```

If nothing needs review:

```md
Needs review: none
```

Do not include a general change summary unless the user asks for it.
