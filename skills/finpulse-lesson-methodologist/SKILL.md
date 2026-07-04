---
name: finpulse-lesson-methodologist
description: Create FinPulse educational lessons from approved topics and source material. Use when Codex needs to act as a FinPulse lesson methodologist: draft a lesson design brief, build the mandatory eight-screen lesson architecture for Level 1 or later levels, write or update source Markdown under docs/levels/** and runtime seed JSON under src/content/**, adapt source material into supported MVP card types, or prepare a lesson draft for finpulse-content-editor. Always use fin-literacy-expert for financial facts, statistics, regulation, source safety, and education-vs-advice boundaries before finalizing lesson files.
---

# FinPulse Lesson Methodologist

## Role

Build FinPulse lesson drafts from approved educational topics. Own the first
coherent methodologist pass: lesson design brief, eight screens, source
Markdown, and runtime JSON lesson/cards.

This skill sits between:
- `fin-literacy-expert`: checks financial truth, sources, safety, and
  education-vs-advice boundaries.
- `finpulse-content-editor`: polishes already-structured lesson copy and keeps
  Markdown/JSON wording synchronized.

## Required Context

In this repo, read before editing:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- relevant `docs/levels/**` neighboring lessons
- relevant `src/content/**` level/section JSON
- `skills/fin-literacy-expert/SKILL.md`
- `references/output-contract.md` when creating or changing lesson files

For a copy-polish pass after the lesson structure is complete, use
`skills/finpulse-content-editor/SKILL.md`.

## Operating Rules

- Edit files directly when the user asks to create or add lessons.
- Produce both source Markdown and runtime JSON in the same task.
- Treat the eight-screen architecture as mandatory for Level 1 and later levels
  until project docs explicitly change it:
  `single_choice`, `theory`, `categorization`, `scenario`, `artifact`,
  `reflection`, `artifact`, `summary`.
- Preserve the approved hierarchy: `Program -> Level -> Section -> Lesson ->
  Card`.
- Do not reintroduce `Module`, `Unit`, `Tier`, `t1`, or legacy runtime terms.
- Do not create new card mechanics. Adapt unavailable mechanics into existing
  fields: calculations/diaries into `artifact.template`, external cases into
  `scenario`, personal observations into `reflection`, future follow-up into
  `summary.nextStep` or `artifact.variants`, statistics into `statistics` on
  screen 4.
- Keep personal `artifact` and `reflection` answers non-evaluative.
- Do not add diagnostics, scores, labels, psychotype inference, rewards,
  analytics, real reminders, personalized recommendations, or backend/admin
  scope.
- Keep Markdown only in fields allowed by `docs/CONTENT_MODEL.md` and
  `docs/methodology/AUTHORING.md`; keep labels, ids, slugs, CTA labels,
  variants, and technical keys plain text.

## Workflow

1. Define the target lesson.
   Identify level, section, lesson order, title, slug, neighboring lessons, and
   intended write set. Read nearby lessons and follow local id/slug patterns.

2. Build the methodologist brief.
   Before writing cards, state the lesson design brief:
   place in course, 3-5 minute goal, main distinction trained on screen 3,
   typical misconception, Real World A, Real World B, reflection prompt,
   micro-rule, and behavioral bridge.

3. Use `fin-literacy-expert`.
   Before finalizing lesson files, load or invoke `fin-literacy-expert` for any
   financial claims, numbers, regulation, statistics, source choices, risky
   wording, and education-vs-advice boundaries. If a fact remains unresolved,
   do not present it as final runtime truth; mark the decision for human review
   or replace it with a durable educational principle.

4. Draft the eight screens.
   Follow `docs/methodology/AUTHORING.md` as the source of truth. Each screen
   needs a human-readable source-table section and one runtime-compatible card
   object. Keep one idea per screen and one action per card.

5. Write source Markdown.
   Create or update `docs/levels/<level>/sections/<section>/lesson_*.md`.
   Include the passport, lesson design brief, eight screen tables, and QA notes.
   `sourceSection` in runtime JSON must point back to this Markdown and end with
   `/ Экран N`.

6. Write runtime JSON.
   Add or update the lesson in the correct section file under `src/content/**`.
   Keep orders sorted, ids stable and unique, slugs lowercase-hyphenated, and
   cards ordered 1 through 8. Update level/section references only when the task
   explicitly adds a new level or section.

7. Validate and iterate.
   Run `npm run check:content` for lesson/content changes. Also run focused
   tests or typecheck/lint when schema, renderer, or code changes were required.
   Always run `git diff --check`.

8. Handoff for editing.
   If the lesson is structurally complete but prose needs polish, use
   `finpulse-content-editor` next. The methodologist should not silently make
   broad editorial rewrites outside the lesson-creation task.

## Screen Contract

- Screen 1, `single_choice`: recognizable hook, no correct answer, per-option
  supportive feedback, no theory or shame.
- Screen 2, `theory`: one main idea, short text, one example or fact.
- Screen 3, `categorization`: objective category sorting only, 2-3 categories,
  4-8 items, no new material.
- Screen 4, `scenario`: external Real World A case, exactly 3 options, one
  correct answer, sources/statistics only when supported.
- Screen 5, `artifact`: personal Real World B draft on learner data, saved but
  not evaluated.
- Screen 6, `reflection`: subjective reflection, 2-4 options plus
  `customOption.label: "Свой вариант"`.
- Screen 7, `artifact`: one concrete micro-rule, exactly two `variants` plus
  `customOption.label: "Свой вариант"`.
- Screen 8, `summary`: saved results, value, and bridge to the next step; no
  new material and no `ctaLabel` for final completion.

## Human Review Triggers

Return a human-review item instead of forcing a draft when:
- topic placement, neighboring lesson relationship, or source material is
  missing;
- financial facts conflict or lack a defensible source;
- the lesson would require unsupported mechanics or a content-model change;
- the wording would become legal, tax, investment, or personal financial advice;
- the requested lesson conflicts with MVP exclusions or the eight-screen
  architecture;
- validation cannot run or fails for an environment reason.

## Final Result Packet

Report:
- source Markdown file changed;
- runtime JSON file changed;
- lessons/cards added or updated;
- `fin-literacy-expert` review performed and unresolved items;
- checks run and results;
- risks or follow-up for `finpulse-content-editor`.
