# User-test lesson design record

## Direction contract

- **Mode:** Operate. The learner should always know the one action that moves
  the lesson forward.
- **Thesis:** replace the public research catalogue with one complete lesson;
  preserve the catalogue only at `#/lab`.
- **Visual world:** the existing FinPulse v1 focus shell — `#F7FBFF` canvas,
  white learning surface, navy text, sky-blue action, quiet borders and shadows.
- **First viewport:** FinPulse wordmark, duration, one story promise, one goal
  checkpoint and one `Начать` action.
- **Interaction form:** eight URL-addressable steps, one active meaning per
  screen, objective choices disabled until selected, calm explanatory feedback
  and a visible completion state.

Visual reference: `user-test-lesson-concept.png`. It was generated as a
three-state, mobile UI mockup (entry, selected answer, feedback) and used as a
composition reference rather than a bitmap in the product.

## Fidelity ledger

| Reference decision | Implemented result | Deliberate deviation |
|---|---|---|
| Pale canvas, white focus surface and navy copy | Reused the live v1 semantic colors and quiet card treatment | The concept's decorative blue glow was dropped to match the existing product shell |
| One centered task per screen | Entry, story, choice and feedback each have one dominant meaning | Story screens may scroll; practice and short states keep the action in the first viewport |
| Goal checkpoint on entry | Blue `Цель урока` band with one concise outcome | No device frame or presentation chrome is shipped in the app |
| Explicit selected state | Checked choice receives icon, border and non-color outline | The implementation uses native radio semantics rather than a mock control |
| Feedback explains the inference | Correct and nuance states use text, icon and one continuation action | Wrong answers remain non-blocking and deliberately avoid a red failure state |
| Primary action remains visible | Entry, choice and feedback mobile captures include the complete action at 390 px | On short screens the action follows short content rather than being visually detached at the physical device edge |

Rendered evidence: `user-test-entry-mobile.jpg`,
`user-test-question-mobile.jpg`, and `user-test-feedback-mobile.jpg`.

## Learning map after freeze

| Step | Learner-facing job | Primary action |
|---|---|---|
| 1 | Understand the episode and goal | `Начать` |
| 2 | Read why the money already has a deadline | `Посмотреть, что удалось проверить` |
| 3 | Separate a past result from unanswered questions | `Добавить один новый факт` |
| 4 | Decide which conclusion the new timing fact supports | `Проверить` |
| 5 | Read option-specific causal feedback | `Продолжить историю` |
| 6 | Return to Sasha's decision and later housing consequence | `Попробовать на другой ситуации` |
| 7 | Apply the rule to a non-financial theatre case | `Проверить` → `К итогу` |
| 8 | Name what is known, unknown and not automatic | `Завершить` |

The public path never shows `A–F`, `A0/B1/C2`, jury notes, consilium language,
mechanic comparisons, editorial rankings or a choice between prototypes.

## Editorial and assessment contract

- The operating mode for `tj-course-editor` was **Map**, used only after the
  C2-derived concept and eight-step structure were frozen.
- The story role is **supportive with causal continuity**, not claimed as the
  sole learning engine: the financial distinction could be represented in a
  fact table, while Sasha's housing motive and later use of the money make the
  limit consequential and provide reflective distance.
- Steps 4 and 7 are objective single-choice checks. The keyed option is unique
  because it stays within the evidence explicitly supplied on screen.
- Feedback explains the selected inference. An incorrect option does not block
  continuation and produces no score, profile, diagnosis or recommendation.
- No personal reflection is collected. Nothing is saved, transmitted or sent
  to analytics.

## Evidence register

- **O / E2 / high:** the dated 2026-08-17 T—Ж audit observed bounded progressive
  disclosure and option-specific explanations across course units
  (<https://t-j.ru/pro/fingram/>). Scope: interface pattern only.
- **I / E1 / medium:** those patterns can narrow the immediate reasoning task;
  the audit does not establish a learning effect.
- **H / E0 / low:** using the abstract patterns inside the FinPulse v1 shell
  will let a first-time tester identify the next action within ten seconds.
  Falsification: a naive tester still asks which version to choose or cannot
  find the first action.
- **U / E0:** learning gain, retention and behavior change remain unmeasured.

Adaptation decision: **adapt**, not copy. FinPulse uses its own canonical scene,
wording, eight-state flow and visual system. It does not reproduce T—Ж prose,
brand, layout, exam sequence, saved artifacts or commercial closure.

## Financial and privacy safety

- Durable principle only: evidence supports the conclusion directly connected
  to it; it does not answer unrelated questions.
- Confirming the time when an available balance can be received does not
  confirm preservation of the original amount, repeatability of a prior result,
  absence of loss or suitability for Sasha.
- Sasha's decision remains the character's decision, not a rule for the
  learner. The final screen states that the experience is educational, not an
  individual financial recommendation.
- There are no current rates, limits, laws, providers, products or promised
  returns, so no time-sensitive financial fact is published.
- Runtime data minimum is zero: no API, storage, cookies, login, telemetry,
  personal answers or identifiers.

Adversarial QA: anti-copy **pass**; evidence inflation **pass**; advice drift
**pass**; reflection grading **pass**; volatile fact **pass**; visual-only error
**pass** because feedback includes text; privacy extraction **pass**;
commercial contamination **pass**. Residual unknown: usability and learning
effect require actual participant testing.
