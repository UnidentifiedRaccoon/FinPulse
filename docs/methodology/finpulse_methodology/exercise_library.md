# Exercise Library

Source references: `00_original_content.md` lines 234-409, 715-742, 1003-1027.

This file catalogs exercise patterns from the source methodology. It does not
define runtime card types. Runtime content must still follow `docs/CONTENT_MODEL.md`.

## Exercise Metadata

Source exercises can be described with:

- thinking type: memory, understanding, real world A, real world B, personal world, habit, artifact;
- what it develops: psychology, hard skills, soft skills, habits;
- checkability: objective, subjective, mixed;
- context;
- artifact;
- behavior rule;
- return moment.

The source card template also names patterns such as `multiple_choice`,
`matching`, `sorting`, and `calculator`. Those names are methodology patterns,
not current runtime schema guarantees.

## Catalog

| Source pattern | Source lines | Source shape | Develops | Runtime interpretation note |
|---|---:|---|---|---|
| Financial pairs | 236-249 | Connect term and meaning, for example ПСК, liquidity, diversification, inflation. | Hard skills. | Matching is a source pattern. Adapt only through supported cards unless the schema adds matching. |
| Sort into baskets | 253-265 | Sort expenses into required, optional, regular, one-time, spontaneous, self-investment. | Budget understanding and planning. | Sorting is a source pattern. It may be represented later as supported choices/checklists, but the pattern itself is not schema. |
| Find the catch | 268-281 | Show a risky ad and tap red flags: guarantee, no risk, only today, too-high yield. | Hard skills, critical thinking, security. | Tap-to-flag is a source pattern. Current adaptations can use scenario or choice cards. |
| Choose consultant questions | 285-300 | Simulate a bank/insurance/broker conversation and choose three useful questions. | Soft skills: asking, clarifying, not hiding confusion. | Multi-select/dialogue simulation is source methodology, not a current runtime type. |
| Check the source | 304-316 | Find a key rate, verify whether an organization is a bank, explain why high yield may mean risk. | Real-world action. | Good fit for checklist/reflection source slices; avoid hard-coding changing values. |
| Mini-calculator | 320-332 | Calculate interest and variants: term, capitalization, inflation. | Hard skills and understanding. | Calculator is a source pattern. Do not add dynamic calculators without a content model/product decision. |
| My financial choice | 336-348 | User chooses a situation and receives a personalized micro-case. | Psychology and control. | Personalized micro-cases can imply recommendations. Keep as source only unless explicitly scoped. |
| Consequence scenario | 352-367 | User chooses a decision and sees effects after one week, one month, one year. | Short-term/long-term consequence thinking. | Scenario pattern can be adapted with supported scenario cards if content stays static and non-personalized. |
| Before-action checklist | 370-389 | Before credit or investment, check total cost, payments, penalties, risks, fees, term, and whether money is last. | Habit formation. | Checklist is compatible as a source pattern, but financial advice must remain educational and general. |
| Financial conversation rehearsal | 392-409 | Practice a formulation for partner, bank, employer, seller, or relative conversations. | Soft skills and psychological stability. | Dialogue simulation is source methodology. Static scenarios/reflections are safer for MVP. |

## Unsupported Or Interpretable Patterns

The following source patterns should stay in methodology until deliberately
adapted:

- `matching`: term-pair interactions such as financial pairs.
- `sorting`: basket or category placement interactions.
- `multiple_choice`: current runtime has `single_choice`; multi-select needs a schema decision.
- `calculator`: dynamic calculation UI or formula-driven checking.
- tap-to-find-red-flags: interactive hotspot behavior.
- dialogue simulator: branching conversation UI.
- personalized micro-case: can cross into recommendations and should stay out of MVP runtime unless approved.
- profile/artifact return flows: source methodology until persistence/product scope expands.

When adapting a pattern into runtime JSON, document the source section and use
supported card types. Do not smuggle unsupported behavior into freeform fields.

## Adaptation Hints

| Source intent | Safer MVP adaptation |
|---|---|
| Teach a term relation | Theory or callout plus single choice. |
| Practice a category distinction | Single choice, scenario, or checklist with clear feedback. |
| Ask the user to inspect external information | Checklist and reflection with read-only guidance. |
| Practice a subjective answer | Reflection with non-judgmental guidance. |
| Show a risky financial situation | Scenario with best/risky answer feedback. |
| Build a habit | Checklist, artifact, or summary card with a micro-rule. |

## Content Safety Notes

- External financial values, rates, limits, laws, and product terms should be
  taught as lookup skills, not stored as permanent facts.
- Subjective answers should never punish values, wishes, or personal priorities.
- Exercises involving credit, investing, or financial safety should stay general
  and educational, not personal advice.
