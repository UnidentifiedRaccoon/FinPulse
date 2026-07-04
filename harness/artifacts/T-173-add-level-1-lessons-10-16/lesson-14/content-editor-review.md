# T-170 / Lesson 14 Content Editor Review

Scope: У1.14 / `lesson_l1_s4_l2_reading_key_terms` / `reading-key-terms`

Files inspected:
- `docs/levels/level-1-start/sections/financial-environment/lesson_02_reading-key-terms.md`
- `src/content/levels/level_1_start/sections/section_04_financial_environment.json`

Allowed write set used:
- `harness/artifacts/T-170-add-level-1-lessons-10-16/lesson-14/content-editor-review.md`

## Verdict

Edits required: yes, two small copy replacements before integration.

The lesson otherwise matches the Level 1 eight-card contract: 8 cards, orders 1-8, required card types, required checkability values, screen 4 as external scenario, screens 5-6 non-evaluative, screen 7 with exactly two variants plus `Свой вариант`, and no statistics block when the source has no statistic.

Education-vs-advice boundary is acceptable: the lesson teaches a checklist and pause behavior, does not recommend taking or rejecting a specific product, and names the legal/financial disclaimer clearly.

Safe Markdown usage is acceptable: Markdown appears only in approved rich-text fields; labels, variants, titles, CTA labels, ids, and technical fields stay plain text.

## Findings

### 1. Screen 4 duplicates correct-option feedback and card-level feedback

Runtime card: `card_l1s4l2_04_real_world`, option `correct-checklist`.

Why it matters: the editorial rubric asks not to duplicate the same sentence in option feedback and card feedback. Current option feedback repeats the card-level correct feedback almost verbatim, so the checked result can feel repetitive.

Exact JSON field replacement:

```json
"feedback": "Это самый полезный первый шаг: он переводит длинный текст условий в шесть проверяемых строк."
```

Apply to:

```txt
src/content/levels/level_1_start/sections/section_04_financial_environment.json
lesson_l1_s4_l2_reading_key_terms
cards[card_l1s4l2_04_real_world].options[correct-checklist].feedback
```

No source Markdown replacement is required for this item: the source table gives state-level result copy, while this runtime field is per-option explanatory feedback.

### 2. Screen 6 guidance implies the app adds the reflection into the saved checklist

Source screen: `ЭКРАН 6. Личная рефлексия`

Runtime card: `card_l1s4l2_06_reflection`

Why it matters: the learner answers screen 6 as a separate reflection. The phrase `добавить её в чек-лист` can imply a runtime merge into the previously saved checklist. A safer formulation keeps the learner action concrete without implying hidden app behavior.

Exact source Markdown replacement:

```txt
Любой вариант нормален. Цель — заметить свою «слепую зону» и проверять её первой, когда читаешь условия.
```

Replace this current source table cell:

```txt
Любой вариант нормален. Цель — заметить свою «слепую зону» и добавить её в чек-лист.
```

Exact JSON field replacement:

```json
"guidance": "Любой вариант нормален. Цель — заметить свою «слепую зону» и проверять её первой, когда читаешь условия."
```

Apply to:

```txt
src/content/levels/level_1_start/sections/section_04_financial_environment.json
lesson_l1_s4_l2_reading_key_terms
cards[card_l1s4l2_06_reflection].guidance
```

## Checks Run

- Read required project context and `finpulse-content-editor` rubric.
- Compared source Markdown screen copy with runtime lesson object.
- Checked target runtime lesson card count/order/types/checkability/sourceSection values with `jq`.
- `npm run check:content` passed.
- `git diff --check -- harness/artifacts/T-170-add-level-1-lessons-10-16/lesson-14/content-editor-review.md` passed.
