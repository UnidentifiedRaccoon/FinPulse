# T-187 — Naturalize five-chapter Story v2 book

Status: review
Owner: /root
Model: GPT-5.5 / xhigh
Started: 2026-07-14
Branch/worktree: current workspace; preserve unrelated user changes

## Goal

Rewrite the complete five-chapter Sasha story in natural contemporary Russian,
between accessible nonfiction and restrained fiction, while preserving the
approved plot, causal chain, financial meaning, and safety boundaries. Add a
short cast table before chapter 1 so an external reviewer can understand each
main character's relationship, type, and narrative purpose before reading.
Complete a structural second pass after human review: every major episode must
show a choice, an action, an observable consequence, and a causal bridge. In
chapter 4, connect work-trip currency expenses to a product-specific mandatory
card payment without turning the example into product advice.
After follow-up review, close the Level 2 purchase subplot on-page: name the
item, preserve `Не решено` inside L2-S3, use the L2-S4 control date to revisit
the offer, and show the later source of purchase money without a universal
anti-credit conclusion.
After further review, make the L3-S1 to L3-S2 bridge concrete: the amount has a
near-term housing purpose, Lera proposes using the advertised quick return to
reach a more convenient rental option, and the check ends without a transfer or
promised profit.
Close the follow-up decision arcs on-page: after the official response, Sasha
explicitly rejects this specific investment proposal because the housing money
has a known use date and the offer does not establish repeatability or timely
access; then show why he first chooses a limited extension of Tamara's room and
later chooses the same room for a longer term after a fresh comparison and a
year of lived experience.
Clarify and close Lera's chapters 4–5 project arc: identify it as an
after-hours entrepreneurial attempt to sell a digital guide rather than an
employer project or investment, state the proposed work/income model and
Sasha's role, let Lera reject the unsuitable platform herself, complete a
non-selling test chapter, and explicitly end Sasha's involvement before any
commercial launch.
After these plot repairs, make one more complete language pass so the added
material reads in the same natural Russian voice as the earlier chapters:
accessible popular nonfiction with restrained scenes and dialogue, not a
methodological protocol or literary prose.

## Context

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`
- `docs/CONTENT_MODEL.md`
- `docs/methodology/METHODOLOGY.md`
- `docs/methodology/AUTHORING.md`
- `docs/methodology/lore_story_v2.md`
- `docs/methodology/lore_story_v2_book.md`
- `skills/finpulse-content-editor/SKILL.md`
- `skills/finpulse-content-editor/references/editorial-rubric.md`
- `skills/fin-literacy-expert/SKILL.md`
- `skills/fin-literacy-expert/references/core-principles.md`
- `skills/fin-literacy-expert/references/safety-boundaries.md`
- `skills/fin-literacy-expert/references/open-questions.md`

## Intended write set

- `docs/methodology/lore_story_v2_book.md`
- `harness/tasks/**/T-187-naturalize-five-chapter-story-v2-book.md`

## Out-of-scope

- Canonical plot or decisions in `docs/methodology/lore_story_v2.md` and
  `docs/methodology/lore_v2_decisions.md`.
- Competency maps, screen model, lesson sources, runtime JSON, code, API, and
  persistence.
- Real-product facts, figures, personalized recommendations, or legal
  conclusions. Fictional service and project details remain bounded to the
  approved story scenes and do not assert a generally applicable product or
  registration route.

## Plan

1. Audit all five chapters for calques, abstract commentary, unnatural
   dialogue, and over-literary phrasing.
2. Rewrite the book in a clear popular-nonfiction voice and add a spoiler-light
   cast table for the five named characters.
3. Repair continuity gaps across chapters 1–5, with the largest rewrite in the
   trip/payment/insurance/project chain of chapters 4–5.
4. Run independent Russian-language, canon-continuity, financial-accuracy, and
   safety reviews; integrate confirmed findings.
5. Run structural and docs/harness checks and complete the result packet.

## Checks

- [x] Five chapter headings and all 20 canonical event beats present.
- [x] Full natural-language and dialogue read-through, including three
  independent read-only reviews.
- [x] Cast table cross-checked against the canonical character ensemble and
  the five-chapter text.
- [x] Every repaired scene has a visible action, result, and next-scene bridge.
- [x] Chapters 4–5 pass financial-accuracy and education-vs-advice review.
- [x] The named shelving purchase moves from postponement through `Не решено`
  to a later product-specific decision and an explicit salary-funded outcome.
- [x] The housing-to-investment transition names the goal, deadline, liquidity
  need, tempting claim, no-transfer result, and later use for extended rent.
- [x] The investment episode distinguishes the pause before the official answer
  from Sasha's explicit final rejection of this proposal after the answer.
- [x] The midpoint and final housing decisions each show the alternatives,
  checked terms, decision horizon, and Sasha's personal reason for staying.
- [x] Lera's project is explicitly outside the employer, earns only through
  possible sales of a created digital product, and asks Sasha for work rather
  than an investment.
- [x] The project arc ends with Lera's own decision, a completed non-selling
  test chapter, rejection of the unsuitable platform for this launch, and an
  explicit boundary on Sasha's commercial participation.
- [x] Final post-repair read-through covers the cast table and all five chapters;
  methodological classifications are recast as character actions, consequences,
  and natural dialogue without reopening the repaired plot arcs.
- [x] Trailing-whitespace smoke.
- [x] `npm run check:harness`.
- [x] `git diff --check`.

## Result packet

- Files changed:
  - `docs/methodology/lore_story_v2_book.md`
  - `harness/tasks/review/T-187-naturalize-five-chapter-story-v2-book.md`
- Checks run (pass/fail/blocked/skipped):
  - PASS — five chapter headings and keyword/manual smoke for all 20 approved
    event beats.
  - PASS — full editor read-through plus independent Russian-language,
    dialogue/structure, and canon/financial-safety reviews.
  - PASS — final whole-book language pass after the plot additions: heavy
    methodological summaries were replaced with direct actions and ordinary
    dialogue, repeated boilerplate was reduced, and the five chapters now keep
    one accessible popular-nonfiction voice without changing their outcomes.
  - PASS — cast table reviewed for natural Russian, canon consistency, and
    usefulness before chapter 1.
  - PASS — structural second pass across all five chapters: completed actions
    now produce visible consequences and the next episode follows from an
    unresolved date, document, obligation, or question.
  - PASS — follow-up Level 2 continuity repair: the unnamed item is now a
    narrow demountable shelving unit linked to the opening boxes; the scheduled
    reminder triggers a review of full terms, Sasha declines only that offer,
    saves from two salaries without using the reserve, buys the shelving unit,
    and then finds the lease deadline while reviewing the remaining dates.
  - PASS — follow-up Level 3 continuity repair: Sasha's small amount is now
    reserved for a deposit, first rent, and possible move; Lera connects a
    quick-return claim to a more convenient housing option, but the characters
    verify the past-result claim, loss/access questions, and housing deadline
    before Sasha declines to transfer the money. The amount later funds the
    first month of the limited extension, closing the subplot.
  - PASS — the Level 3 decision arc now separates Sasha's pre-response pause
    from his final rejection of the specific offer: the reply does not resolve
    the advertising-clarity question, but it also does not establish a repeated
    result or access to the full amount by his housing deadline.
  - PASS — the housing arc now explains both choices. At midpoint Sasha compares
    moving costs, alternative contract lengths, known room conditions, and the
    reversible review horizon before extending only to the anniversary. In the
    finale he compares current options again, checks the long-term contract, and
    combines a year of observed costs and conditions with his developed sense of
    belonging before choosing the room for the contract term, not forever.
  - PASS — the chapter 4 work-trip chain now runs on-page from currency/payment
    conditions through receipts, reimbursement delay, mandatory card payment,
    issuer contact, a product-specific protection check, timely payment, and
    reserve restoration.
  - PASS — chapter 4's project scene ends with a concrete missing fact and
    Lera's next action; chapter 5 resumes from the resulting official sources
    and ends with independent decisions by Lera, Tamara, Misha, and Sasha.
  - PASS — follow-up project continuity repair: the project is now a specific
    after-hours online guide created by Lera and two acquaintances, unrelated
    to their employer. Sasha is invited to contribute authorship and cost work,
    not capital, in return for a possible share of sales after expenses.
    Lera independently rejects the platform for the intended launch when its
    official scope does not match the closed-channel claims, completes a test
    chapter without sales, and continues testing the idea. Sasha completes the
    bounded preparation work and does not join the commercial launch.
  - PASS — independent final smokes for natural Russian, the canonical
    20-event continuity contract, and financial/privacy safety reported no
    remaining blockers.
  - PASS — financial-safety review: card, conversion, payment, and protection
    wording stays specific to the fictional contract; no general product
    recommendation or promised remedy is made; the project's registration
    issue remains an official-source question rather than a legal conclusion.
  - PASS — no trailing whitespace and no remaining flagged heavy-language
    phrases.
  - PASS — `npm run check:harness`; the checker reports only the existing
    grandfathered duplicate `T-038` warning.
  - PASS — `git diff --check`.
- Risks:
  - This is a derived external-review narrative. It does not replace the
    canonical treatment in `docs/methodology/lore_story_v2.md`.
  - Currency/card/insurance details remain product- and date-sensitive, while
    the project-registration question is jurisdiction-sensitive. Production
    lesson screens will still require current source and legal/public-services
    review.
- Follow-up:
  - Send the revised five-chapter book for external story approval.
