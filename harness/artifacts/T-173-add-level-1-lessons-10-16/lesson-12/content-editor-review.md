# Content editor review — T-170 / У1.12

Scope: `lesson_l1_s3_l4_what_is_inflation` / `what-is-inflation`.

Inspected:
- `docs/levels/level-1-start/sections/risk-and-return/lesson_04_what-is-inflation.md`
- `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`

## Result

Edits required: yes, one wording correction proposed below.

The lesson otherwise matches the Level 1 eight-card contract:
- exactly 8 cards, orders 1-8;
- card types match the required sequence: `single_choice`, `theory`, `categorization`, `scenario`, `artifact`, `reflection`, `artifact`, `summary`;
- screen 4 is an external scenario with 3 options, 1 correct answer, option feedback, card feedback, retry feedback, and source-backed statistics;
- screens 5-7 keep personal work non-evaluative and avoid product choice/recommendation framing;
- Markdown usage is limited to approved Markdown-enabled fields; plain labels, variants, titles, ids, paths, and CTA labels stay plain text;
- education-vs-advice boundary is explicit: the `вклад vs инфляция` check is framed as an educational first filter, not a recommendation to open, close, or choose a deposit.

## Finding

### 1. Summary wording mixes deposit rate and official inflation sources

Runtime screen 8 currently says:

```json
"Актуальные проценты лучше смотреть в официальных источниках, а не запоминать из старой новости."
```

This is close, but imprecise for a learner: official sources in this lesson are for inflation/CPI, while the deposit rate comes from the concrete product terms. The earlier cards correctly separate these sources, so the summary should preserve the same distinction.

Proposed runtime JSON field replacement:

```json
"points": [
  "Инфляция снижает покупательную способность денег.",
  "Ставка вклада показывает номинальный рост, а сравнение с инфляцией помогает увидеть реальную картину.",
  "Актуальную инфляцию лучше смотреть в официальных источниках, а ставку вклада — в условиях конкретного продукта."
]
```

Proposed source Markdown replacement in screen 8 / `Что сохранилось`:

```diff
- Актуальные проценты лучше смотреть в официальных источниках, а не запоминать из старой новости.
+ Актуальную инфляцию лучше смотреть в официальных источниках, а ставку вклада — в условиях конкретного продукта.
```

## Checks run

- `npm run check:content` — passed.

## Files changed

- `harness/artifacts/T-170-add-level-1-lessons-10-16/lesson-12/content-editor-review.md`

No source Markdown or runtime JSON files were edited.
