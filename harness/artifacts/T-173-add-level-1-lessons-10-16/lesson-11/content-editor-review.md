# T-170 Lesson 11 Content Editor Review

Target lesson: У1.11 / `lesson_l1_s3_l3_money_soon_not_in_risk` / `money-soon-not-in-risk`

Reviewed files:
- `docs/levels/level-1-start/sections/risk-and-return/lesson_03_money-soon-not-in-risk.md`
- `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`

## Findings

- Level 1 eight-card contract: pass. Runtime lesson has exactly eight cards with orders 1-8 and the required card type sequence: `single_choice`, `theory`, `categorization`, `scenario`, `artifact`, `reflection`, `artifact`, `summary`.
- Source/runtime sync: pass. Runtime fields preserve the source lesson's learner-facing copy, CTA labels, feedback state split, Real World A source link, artifact template, reflection options, and two micro-rule variants.
- Education-vs-advice boundary: pass. The lesson teaches the durable principle `srok -> instrument` through time horizon, liquidity, and drawdown risk; it does not choose a product, institution, security, broker, or strategy for the learner.
- Financial safety: pass. No quickly changing numeric facts or unsourced statistics are introduced. The Bank of Russia source is used as conceptual support for horizon/risk/return/liquidity rather than as a product recommendation.
- Markdown safety: pass. Markdown appears only in approved Markdown-enabled fields. Plain-text labels, titles, CTA labels, variants, ids, paths, and technical fields remain plain text.
- Russian learner-facing clarity: pass. The copy is short, concrete, non-shaming, and aligned with the project editorial rubric.

## Edits Required

no edits required

## Proposed Patches

None.

## Checks Run

- `node -e '...'` target lesson structural check for eight-card sequence, checkability, `sourceSection`, screen 1 answer markers, screen 4 options/correct answer, and screen 6/7 custom options
- `npm run check:content`
