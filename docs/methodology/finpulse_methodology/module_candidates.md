# Module Candidates And Scope Hints

Source references: `00_original_content.md` lines 410-463, 617-715, 851-880,
993-999.

This file organizes module-level source material. It is a planning aid, not a
runtime program manifest.

## Scope Classification

Use these labels when deciding whether source material should move toward runtime
content:

| Label | Meaning |
|---|---|
| Runtime-ready seed | Can be adapted with existing supported card types and current MVP scope. |
| Supplemental source | Useful for editor notes, examples, or later lessons, but too broad for the primary reader path now. |
| Future schema candidate | Needs interactions not currently in the content model, such as matching, sorting, calculators, or dialogue simulation. |
| Future product scope | Requires persistence, reminders, personalization, recommendations, diagnostics, analytics, or other deferred product work. |

## Source Module Sketches

| Candidate | Source lines | Source outline | Scope hint |
|---|---:|---|---|
| Budget without shame | 412-423 | Budget as a map of choice; terms for income/expense; why "I remember it all" fails; find three expense categories; reflect on surprise; choose Sunday 5-minute review. | Runtime-ready seed, with source support from basket sorting lines 253-265. Sorting itself is a future schema candidate. |
| Safety cushion | 425-435 | Cushion is protection, not investment; months of expenses; liquidity; compare deposit/savings account/cash; choose first step; salary autopayment. | Runtime-ready seed for static lessons; external product comparison needs care. |
| Credit: not only rate | 438-448 | Monthly payment is not total cost; rate, total cost, term, fees, penalties, collateral; find total cost; safe payment range; before-credit checks. | Runtime-ready seed for general education; avoid personal affordability advice. |
| Financial security | 451-461 | Fraud pressure through speed, fear, secrecy; data never to share; spot fraud signs; verify site/number/license/app; identify weak point; monthly checks. | Runtime-ready seed with safety warnings; external verification tasks should use up-to-date source lookup, not hard-coded facts. |

## Values And Goals Mini-Unit

The source proposes turning the current basic-values lesson into a mini-unit:

```text
Юнит: Деньги и ценности
Урок 1. Зачем финансовым целям нужны ценности
Урок 2. Что такое ценности
Урок 3. Почему одинаковые решения подходят не всем
Урок 4. Найди ценность за событием
Урок 5. Когда ценности конфликтуют
Урок 6. Как понять, что ценность настоящая
Урок 7. Деньги и семейные ценности
Урок 8. Практика 1M$
```

| Lesson | Main thinking type | Develops | Artifact | Scope hint |
|---|---|---|---|---|
| Why financial goals need values | Understanding | Motivation + hard skills | First financial dream | Runtime-ready seed. |
| What values are | Memory + understanding | Psychology | Five chosen values | Runtime-ready seed; persistence is future scope. |
| Why same decisions do not fit everyone | Real world B | Understanding + decision-making | Freedom/safety value pair | Runtime-ready seed as static scenario. |
| Find a value behind an event | Personal world | Self-reflection | Event -> value | Runtime-ready seed with safe reflection. |
| When values conflict | Personal world + scenario | Self-reflection + choice | Priority of three values | Runtime-ready seed; avoid judging answers. |
| How to know a value is real | Personal world | Critical thinking about self | Value shown in actions | Runtime-ready seed with subjective rubric. |
| Money and family values | Real world B + soft skills | Communication | Phrase for money conversation | Runtime-ready seed as rehearsal scenario; branching dialogue is future schema. |
| 1M$ practice | Artifact | Goals + motivation | Values map | Future product scope if it requires saved map reuse. |

## Classification Hints

- Prefer static, educational lessons for MVP runtime.
- Use the existing content model for theory, callout, single choice, reflection,
  scenario, artifact, checklist, and summary.
- Keep matching, sorting, multi-select, calculators, hotspot red flags, and
  branching dialogue as source methodology unless the schema changes.
- Keep artifacts as lesson results in source text unless persistence is explicitly
  approved. Current MVP progress persistence is not artifact/profile storage.
- For external-data topics, do not bake quickly changing numbers into lesson truth.
  Teach users how to find the current official source.
- For credit, investing, and security, keep the tone educational and include risk
  caveats where appropriate.
