# Content editor review — У1.13 `bank-client-rights`

Scope reviewed:
- `docs/levels/level-1-start/sections/financial-environment/lesson_01_bank-client-rights.md`
- `src/content/levels/level_1_start/sections/section_04_financial_environment.json`

Verdict: edits required.

## Findings

1. Screen 4 correct option feedback repeats the card-level correct feedback too closely.
   - Runtime: `card_l1s4l1_04_real_world.options[1].feedback` starts with the same learning point as `card_l1s4l1_04_real_world.feedback`.
   - Rubric impact: screen 4 should avoid duplicating the same sentence in option feedback and card feedback.
   - Learner impact: if the UI shows both, the result feels repetitive instead of adding a new layer of explanation.

2. `shortcut` appears in Russian source/runtime metadata.
   - Source: lesson passport `Главный навык` and screen 3 methodologist note.
   - Runtime: lesson `mainSkill`.
   - Learner-facing cards are clear, but the metadata should stay Russian for editorial consistency.

## Exact proposed replacements

### Runtime JSON replacement — screen 4 correct option feedback

In `card_l1s4l1_04_real_world`, replace only the correct option feedback:

```json
"feedback": "Это рабочий первый шаг: обращение в банк запускает официальный маршрут и оставляет материалы для следующего обращения, если ответ не устроит."
```

Keep the existing card-level result feedback:

```json
"feedback": "Сначала нужны факты и обращение в банк: продукт, дата, сумма, что именно непонятно, копии документов или скриншоты. Если ответ не устроит, дальше проще обратиться в официальный канал с уже собранными материалами."
```

### Source Markdown sync — screen 4 option feedback

In screen 4, add this row after the `| Варианты | ... |` row:

```md
| Комментарий к верному варианту | Это рабочий первый шаг: обращение в банк запускает официальный маршрут и оставляет материалы для следующего обращения, если ответ не устроит. |
```

### Source/runtime wording replacement — `shortcut`

Replace:

```txt
рискованного shortcut
```

with:

```txt
рискованного обходного пути
```

Apply this in:
- source lesson passport `Главный навык`;
- source screen 3 methodologist note;
- runtime lesson `mainSkill`.

## Checks run

- `npm run check:content` — passed.
- Targeted Node contract check for У1.13 — passed: 8 cards; orders 1-8; required Level 1 types/checkability; all `sourceSection` values end with `/ Экран N`; screen 4 has 3 options, 1 correct answer, and statistics; screen 7 has exactly 2 variants plus `customOption.label: "Свой вариант"`.
- Targeted plain-text Markdown scan — passed: no Markdown markers found in checked plain fields (`title`, `ctaLabel`, labels, variants, custom option text, statistics values).
- Official source spot-check: Bank Russia page confirms the 102,1 тыс. complaints statistic for January-March 2026, the first-step route through the financial organization, Internet reception escalation, financial ombudsman context, and page update date 03.07.2026: https://www.cbr.ru/protection_rights/

## Notes

- Education-vs-advice boundary is OK: the lesson explains an official route, does not promise refund/outcome, and does not replace legal advice for a personal dispute.
- Markdown usage is safe: Markdown appears only in approved Markdown-enabled fields.
- No source/runtime edits were applied in this pass because the allowed write set is limited to this review artifact.
