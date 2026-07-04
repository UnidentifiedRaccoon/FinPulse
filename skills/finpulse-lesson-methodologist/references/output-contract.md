# Lesson Output Contract

Read this when creating or changing FinPulse lesson files.

## File Outputs

A complete methodologist task writes both:
- source Markdown under `docs/levels/<level>/sections/<section>/lesson_*.md`;
- runtime seed JSON under `src/content/levels/<level>/sections/*.json`.

If adding a new section or level, update the relevant `level.json` or
`program.json` references only when the user explicitly approved that scope.

## Source Markdown Shape

Use the existing neighboring lesson files as the local template. Include:
- title with level, section, lesson number, and learner-facing title;
- source note or source-material link when available;
- lesson passport;
- lesson design brief;
- eight screen sections, each with a human-readable table;
- QA section with the checks relevant to the lesson.

Every screen table should include enough information to reconstruct the runtime
card: title, visible text, prompt/question, options/items/categories, feedback,
statistics and sources when present, personal artifact fields, CTA label, and
the expected save/result behavior.

## Runtime JSON Shape

Each new lesson object must include:
- `id`, `slug`, `title`, `description`, `order`, `estimatedMinutes`,
  `learningGoal`, `mainSkill`, `tags`, `sourceSection`, and `cards`;
- exactly eight cards unless the project docs have explicitly changed the
  architecture;
- card `order` values 1 through 8;
- stable card ids following neighboring examples;
- `sourceSection` ending in `/ Экран N` for every card.

Use the screen type sequence:

```txt
1 single_choice
2 theory
3 categorization
4 scenario
5 artifact
6 reflection
7 artifact
8 summary
```

## Financial Expert Gate

Before finalizing files, perform a `fin-literacy-expert` pass for:
- statistics;
- regulatory limits, rates, taxes, banking or insurance rules;
- financial-product explanations;
- safety and scam-protection claims;
- any wording that might become personal advice.

Record unresolved facts in the task result. Do not put unresolved placeholders
into final runtime JSON unless the user explicitly asked for a draft with known
placeholders.

## Validation

Minimum checks for content-only lesson creation:

```bash
npm run check:content
git diff --check
```

Add focused tests, typecheck, lint, or build when the task changes schemas,
rendering, code, or docs that affect runtime behavior.

## Result Packet

Return:

```md
Summary:
- <what lesson was created or changed>

Files changed:
- <source Markdown>
- <runtime JSON>

Financial expert review:
- <what was checked>
- <unresolved facts or "none">

Checks run:
- <command> — <result>

Risks / follow-up:
- <content-editor polish, source gaps, product decisions, or "none">
```
