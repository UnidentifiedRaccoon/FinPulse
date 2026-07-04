# T-170 / Lesson 16 Content Editor Review

Scope: `lesson_l1_s4_l4_where_to_find_current_data` / У1.16 `Где брать актуальные данные`.

Reviewed source:
- `docs/levels/level-1-start/sections/financial-environment/lesson_04_where-to-find-current-data.md`
- `src/content/levels/level_1_start/sections/section_04_financial_environment.json`

## Result

no edits required

## Findings

- The source Markdown and runtime lesson object are aligned on the approved `Program -> Level -> Section -> Lesson -> Card` architecture.
- The runtime lesson follows the Level 1 eight-card contract: hook, theory, categorization practice, external scenario, personal artifact, reflection, micro-rule artifact, summary.
- Screen 3 uses `categorization` with three clear categories, item feedback, `feedbackTitle`, `retryFeedbackTitle`, and `retryFeedback`.
- Screen 4 is an external `scenario` with exactly three options, one correct option, per-option feedback, and no statistics block; this matches the source because the lesson teaches source lookup instead of storing changing figures.
- Screens 5 and 6 keep personal work non-evaluative and avoid unnecessary sensitive data. Screen 7 has exactly two ready variants plus `customOption.label: "Свой вариант"`.
- Education-vs-advice boundary is preserved: the lesson teaches how to find official sources and check dates, not which product, bank, tax action, or financial decision to choose.
- Markdown usage is safe: Markdown appears only in approved Markdown-enabled fields; titles, labels, CTA labels, variants, ids, paths, and other plain-text fields remain plain text.
- Russian learner-facing copy is clear, adult, practical, and consistent with the editorial rubric. No shame, diagnosis, scoring, gamification, analytics, or personalized recommendations were found.

## Checks run

- `npm run check:content` -> passed.
- Targeted `jq` inspection of У1.16 card types -> `single_choice`, `theory`, `categorization`, `scenario`, `artifact`, `reflection`, `artifact`, `summary`.
- Targeted `jq` inspection of У1.16 card orders -> `1` through `8`.
- Targeted `jq` inspection of У1.16 key contract fields -> 8 cards, screen 4 has 3 options and 1 correct option, screen 7 has 2 variants, screens 6 and 7 use `Свой вариант`.

## Edits required

No.
