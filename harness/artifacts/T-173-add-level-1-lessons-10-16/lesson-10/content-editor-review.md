# T-170 Lesson 10 Content Editor Review

Target lesson: У1.10 / `lesson_l1_s3_l2_risk_and_return_are_linked` / `risk-and-return-are-linked`

Reviewed files:
- `docs/levels/level-1-start/sections/risk-and-return/lesson_02_risk-and-return-are-linked.md`
- `src/content/levels/level_1_start/sections/section_03_risk_and_return.json`

## Findings

- Level 1 eight-card contract: pass. Runtime lesson has exactly eight cards with orders 1-8 and the required card type sequence: `single_choice`, `theory`, `categorization`, `scenario`, `artifact`, `reflection`, `artifact`, `summary`.
- Source/runtime sync: pass. Runtime fields preserve the source lesson's learner-facing copy, CTA labels, feedback state split, Real World A source link, artifact template, reflection options, and two micro-rule variants.
- Education-vs-advice boundary: pass. The lesson treats risk-return as a durable educational principle, does not choose or rank instruments for the learner, avoids promises of income, and explicitly frames the artifact as a way to ask better questions rather than as investment advice.
- Financial safety: pass. No quickly changing numeric facts or unsourced statistics are introduced. The Bank of Russia source is used only as a conceptual Real World A reference.
- Markdown safety: pass. Markdown appears only in approved Markdown-enabled fields. Plain-text labels, titles, CTA labels, variants, ids, paths, and technical fields remain plain text.
- Russian learner-facing clarity: pass. The copy is short, concrete, non-shaming, and aligned with the project editorial rubric.

## Edits Required

no edits required

## Proposed Patches

None.

## Checks Run

- `jq '.lessons[] | select(.slug == "risk-and-return-are-linked")' src/content/levels/level_1_start/sections/section_03_risk_and_return.json`
- `npm run check:content`
