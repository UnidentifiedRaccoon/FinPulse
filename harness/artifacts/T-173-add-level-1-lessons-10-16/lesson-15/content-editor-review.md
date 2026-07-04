# Content-editor review — T-170 / lesson 15

Scope: У1.15 / `lesson_l1_s4_l3_credit_by_psk` / `credit-by-psk`.

Reviewed files:
- `docs/levels/level-1-start/sections/financial-environment/lesson_03_credit-by-psk.md`
- `src/content/levels/level_1_start/sections/section_04_financial_environment.json`

## Verdict

no edits required

## Findings

- Source Markdown and runtime lesson object are aligned for the learner-facing lesson flow.
- Level 1 eight-card contract is satisfied: `single_choice`, `theory`, `categorization`, `scenario`, `artifact`, `reflection`, `artifact`, `summary`; orders are `1` through `8`.
- Screen 1 is a subjective hook with no correct answer. Screen 3 is objective categorization. Screen 4 is an external scenario with exactly three options and one correct answer. Screens 5 and 6 keep personal work non-evaluative. Screen 7 has exactly two ready variants plus `customOption.label: "Свой вариант"`.
- Education-vs-advice boundary is acceptable for a credit topic: the lesson teaches comparison by ПСК, срок, платежи, переплата and допуслуги; it does not tell the learner whether to take a credit, choose a bank, or make a personal financial decision.
- Time-sensitive credit values are not embedded as current market facts. The `2 900 ₽` hook reads as a fictional ad example, not a market rate or official value.
- Safe Markdown usage is acceptable: Markdown appears only in approved Markdown-enabled fields; plain labels, CTA labels, variants, titles, ids and technical keys stay plain text.
- Russian learner-facing copy is clear, calm, mobile-sized, and avoids shame, diagnosis, product promotion, guarantees, or pressure.

## Checks run

- `npm run check:content` — passed: `[content] OK: src/content/program.json`.
- Targeted `jq -e` structure check for У1.15 card count, order, types, screen 4 options/correct answer, and required custom options — passed.
- Targeted `jq` sourceSection scan — confirmed all card `sourceSection` values end with `/ Экран N`.
- Targeted `jq` plain-field Markdown scan — no Markdown found in checked plain-text fields.
- Manual source/runtime review against `finpulse-content-editor` rubric, Level 1 contract, safe Markdown contract, and `fin-literacy-expert` education-vs-advice safety rules.
