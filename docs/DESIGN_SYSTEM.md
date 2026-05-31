# FinPulse Design System — Friendly Learning MVP

Version: 0.2 / Friendly Learning Edition

Scope: mobile-first FinPulse learning web app.

Out of scope for this document:
- admin/CMS surfaces;
- desktop analytics dashboards;
- marketing landing pages;
- rewards, streaks, challenges, shops, and gamification systems for the current MVP.

This document defines the product style, tokens, components, and learning patterns for FinPulse. It should help the app feel like a calm, friendly trainer for financial skills: small steps, visible progress, quick feedback, and no shame around money.

## 1. Style Strategy

### 1.1. Design Formula

**Soft fintech + friendly learning + low-pressure progress.**

FinPulse should combine three layers:

| Layer | User value | Interface expression |
|---|---|---|
| Fintech | Trust, privacy, safety | Clean structure, clear typography, careful handling of money-related language. |
| Learning app | A clear path without overload | Short lessons, card-by-card flow, progress, practice, immediate feedback. |
| Wellness/support | Less anxiety around money | Soft surfaces, supportive copy, no shame, no false urgency. |

The interface should not feel like a strict bank, a trading terminal, a corporate LMS, a casino, or a children's game. The target image is a personal financial coach that explains simply, supports small wins, and helps the learner return at a comfortable pace.

### 1.2. Duolingo-Inspired, Not Duolingo-Copied

Use the product mechanics of friendly learning apps, not their brand language:

- one screen/card should focus on one learning meaning;
- lessons should feel doable in 2-5 minutes;
- the user should always see where they are in the lesson;
- practice should give immediate feedback;
- mistakes should be treated as hints;
- progress should motivate without pressure.

Do not copy specific colors, mascots, characters, UI shapes, or reward loops from existing products.

### 1.3. MVP Boundaries

Active MVP patterns:
- lesson/card experience;
- progress indicators for lessons/cards;
- choice, checklist, reflection, and feedback states;
- supportive empty/loading/error/success states;
- simple auth/progress UI only where needed for saved progress;
- documented mascot visual reference as an optional identity asset.

Deferred patterns:
- points, XP, badges, streaks, rewards, shops;
- challenges and daily quests;
- leaderboards or comparisons;
- mascot-led product experience and mascot-driven mechanics;
- notifications and retention loops.

Deferred patterns may remain as design direction notes, but must not be implemented until product scope explicitly allows them.

## 2. Product Character

FinPulse is a friendly financial coach.

It:
- explains in plain language;
- does not judge financial behavior;
- avoids fear-based motivation;
- proposes a small next step;
- marks progress clearly;
- respects privacy;
- does not promise instant wealth.

### 2.1. Emotional Temperature

The product should be warm, but not childish.

| Too cold | Target balance | Too childish |
|---|---|---|
| "Complete the financial diagnostic." | "Answer a few questions and continue your route." | "Let's play a super money quest!" |
| "Insufficient savings level." | "The reserve is still small. Start with a comfortable amount." | "The piggy bank is sad." |
| "Progress interrupted." | "You can return with one short lesson." | "You lost your flame. Save it now!" |

## 3. Product Principles

### 3.1. One Screen, One Learning Meaning

Each card or screen should answer one of these questions:
- what am I learning now;
- what do I need to do;
- why is this useful;
- what is the next step.

Do not mix long theory, diagnostics, rewards, multiple CTAs, and unrelated navigation in one block.

### 3.2. Small Steps Should Look Small

Financial learning can feel heavy. The UI should make the next action look achievable:
- short heading;
- one clear card;
- 2-4 answer options;
- visible lesson progress;
- one primary action.

Good wording:
- "short lesson";
- "small step";
- "try this";
- "choose a comfortable option";
- "continue".

### 3.3. Mistakes Are Hints

Practice feedback should use these states:

| State | Tone |
|---|---|
| Correct | Positive confirmation plus a short explanation. |
| Almost | Supportive clarification. |
| Retry | Calm explanation and a chance to try again. |
| Skip | Allowed without punishment. |

Avoid "wrong" as the main emotional marker. Prefer "Not quite", "There is a nuance", "Let's break it down".

### 3.4. Progress Should Be Visible, Not Stressful

Use:
- card count in the current lesson;
- completed lesson/card markers;
- percentages only when they help;
- soft "next step" language.

Avoid:
- red deadlines;
- "you failed the plan";
- "too much left";
- fear of losing progress.

## 4. Color System

The MVP palette is light, clean, and calm: white, soft blue, sky blue, and a few semantic learning accents.

Typical mobile screen proportion:
- 70-80% white or near-white surfaces;
- 10-15% soft learning surfaces;
- 5-10% active blue/sky accents;
- up to 5% semantic learning accents.

### 4.1. Brand Colors

| Token | Hex | Usage |
|---|---:|---|
| `brand.50` | `#EFF7FF` | Soft learning card background. |
| `brand.100` | `#DDF0FF` | Progress tracks, disabled CTA fills. |
| `brand.200` | `#BDE0FF` | Soft active surfaces. |
| `brand.300` | `#8FC9FA` | Active borders. |
| `brand.400` | `#55ADF4` | Secondary active blue. |
| `brand.500` | `#1787F2` | Primary action blue. |
| `brand.600` | `#0D6FE8` | Pressed/active state. |
| `brand.700` | `#0758C7` | High-contrast blue text. |
| `sky.400` | `#5BC0EB` | Progress and illustration accent. |
| `sky.500` | `#1E9BD7` | Completed and current-step accent. |
| `sky.600` | `#1479B8` | Hover and pressed accent state. |

### 4.2. Neutral Colors

| Token | Hex | Usage |
|---|---:|---|
| `surface.canvas` | `#F7FBFF` | App background. |
| `surface.card` | `#FFFFFF` | Main cards and sheets. |
| `surface.soft` | `#F1F7FE` | Secondary card areas. |
| `surface.muted` | `#F6F8FB` | Disabled or quiet zones. |
| `border.subtle` | `#EEF4FB` | Very soft separators. |
| `border.default` | `#DDE9F6` | Cards, inputs, choice borders. |
| `border.strong` | `#BFD6EF` | Active borders without heavy color. |
| `text.primary` | `#10234A` | Main text. |
| `text.secondary` | `#637188` | Secondary text. |
| `text.tertiary` | `#9AA8BA` | Captions and placeholders. |
| `text.inverse` | `#FFFFFF` | Text on strong buttons. |

### 4.3. Learning Colors

| Token | Hex | Usage |
|---|---:|---|
| `learn.correct.50` | `#EAFBF4` | Correct answer or completed card background. |
| `learn.correct.500` | `#26C895` | Check/completed marker. |
| `learn.almost.50` | `#FFF7E8` | "Almost" or soft hint background. |
| `learn.almost.500` | `#FFB547` | Hint icon/accent, not body text. |
| `learn.retry.50` | `#FFF3F1` | Retry explanation background. |
| `learn.retry.500` | `#E86B5C` | Local retry marker, used rarely. |
| `danger.50` | `#FFF1F1` | Technical errors and destructive actions only. |
| `danger.500` | `#E84B4B` | Critical error/destructive action only. |

Red is not a default learning color. Do not use red for missed lessons, low progress, small reserves, or ordinary practice misses.

### 4.4. Gradients

Use gradients sparingly:
- `gradient.brand`: primary celebratory/action surfaces only;
- `gradient.learning`: soft lesson surfaces;
- avoid full-screen decorative gradients and decorative blobs.

## 5. Typography

Use a simple, friendly, confident sans-serif:

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
```

Allowed alternative: `Golos Text` if the product intentionally moves toward a more local Russian-language character. Do not mix multiple similar UI sans-serifs.

Rules:
- body text: `400-500`;
- headings: `600-700`;
- buttons, tabs, chips: `600`;
- numbers, percentages, amounts: `700` and tabular numerals;
- no decorative UI fonts;
- no thin weights below `400`;
- no long dense paragraphs in learning blocks.

### 5.1. Mobile Type Scale

| Token | Size / line height | Weight | Usage |
|---|---:|---:|---|
| `display.sm` | `28 / 34` | `700` | Completion or important status heading. |
| `heading.lg` | `24 / 30` | `700` | Page heading. |
| `heading.md` | `20 / 26` | `700` | Lesson/card heading. |
| `heading.sm` | `18 / 24` | `600` | Block heading. |
| `body.lg` | `16 / 24` | `400-500` | Main explanatory text. |
| `body.md` | `15 / 22` | `400-500` | Standard UI text. |
| `body.sm` | `14 / 20` | `400-500` | Secondary text. |
| `caption.md` | `13 / 18` | `400-500` | Metadata and helper text. |
| `caption.sm` | `11 / 14` | `500-600` | Compact labels. |
| `button.md` | `15 / 20` | `600` | Main buttons. |
| `number.lg` | `32 / 36` | `700` | Large percentage/result. |
| `number.md` | `20 / 24` | `700` | Compact metrics. |

## 6. Layout, Spacing, Radius

### 6.1. Mobile Container

| Parameter | Value |
|---|---:|
| Minimum target width | `320px` |
| Primary working width | `360-430px` |
| Maximum content width | `480px` |
| Horizontal padding | `20px` |
| Bottom safe area | `env(safe-area-inset-bottom)` + `12-16px` |

### 6.2. Spacing

Use a 4px base and an 8px practical rhythm.

| Token | Value | Usage |
|---|---:|---|
| `space.1` | `4px` | Icon/text relation. |
| `space.2` | `8px` | Compact groups. |
| `space.3` | `12px` | Small component padding. |
| `space.4` | `16px` | Card padding. |
| `space.5` | `20px` | Screen horizontal padding. |
| `space.6` | `24px` | Large groups. |
| `space.8` | `32px` | Major sections. |
| `space.10` | `40px` | Emotional success/empty states. |

Learning rhythm:
- heading to explanation: `6-8px`;
- explanation to action: `16-24px`;
- answer options: `10-12px`;
- practice to feedback: `16px`;
- feedback to next CTA: `16-20px`.

### 6.3. Radius And Shadow

| Token | Value | Usage |
|---|---:|---|
| `radius.xs` | `8px` | Small labels. |
| `radius.sm` | `10px` | Chips and compact buttons. |
| `radius.md` | `12px` | Inputs and standard buttons. |
| `radius.lg` | `16px` | Choices and list items. |
| `radius.xl` | `20px` | Main learning cards. |
| `radius.full` | `999px` | Pills, progress dots, avatar-like markers. |

Use soft cold shadows only:
- `shadow.sm`: `0 2px 8px rgba(18, 52, 89, 0.06)`;
- `shadow.md`: `0 8px 24px rgba(18, 52, 89, 0.08)`;
- `shadow.focus`: `0 0 0 4px rgba(23, 135, 242, 0.14)`.

Do not use sharp black shadows or heavy elevation.

## 7. Icons, Emoji, And Illustrations

### 7.1. Icons

Use `lucide-react` when an icon clarifies navigation or state.

Rules:
- base size: `24px`;
- small size: `16-20px`;
- stroke: `1.75-2px`;
- rounded line caps/joins;
- default color: `text.secondary` or `brand.500`;
- selected/completed/error states must not rely on color only.

Useful icons: check, circle, shield, lock, compass, map pin, arrow, book, wallet, piggy bank, umbrella.

### 7.2. Emoji

Emoji are allowed as a light emotional layer, not as the icon system.

Rules:
- maximum one emoji in a short heading or celebration;
- no emoji in security, privacy, technical, or critical financial messages;
- no repeated emoji strings;
- do not use emoji as the only status marker.

### 7.3. Illustrations

Illustrations are optional in MVP. If used, they should be:
- simple;
- soft and pastel;
- low-detail;
- supportive, not decorative clutter;
- relevant to learning, safety, planning, or confidence.

Avoid photorealism, casino-like visuals, aggressive red/black accents, and mascot dependency.

### 7.4. Mascot

The accepted mascot direction is documented in `docs/MASCOT.md`: a small cream-and-sky-blue fennec/fox guide with a compass badge.

The mascot may support welcome, empty, transition, route, and completion states as an optional visual identity asset. It must not become a reward, streak, pressure, or retention mechanic in the MVP.

Use the existing `brand.*` and `sky.*` palette for UI integration where possible. Do not introduce a separate mascot token system unless multiple production asset variants create a concrete implementation need.

## 8. Base Components

### 8.1. Buttons

Primary button:
- height: `48px`;
- padding: `0 16px`;
- radius: `12px`;
- background: `brand.500` or restrained `gradient.brand`;
- text: `button.md`, `text.inverse`;
- pressed: `brand.600` plus subtle `scale(0.98)`;
- disabled: `brand.100`, `text.tertiary`, no shadow.

Good labels:
- "Continue";
- "Start lesson";
- "Check";
- "Try again";
- "Finish lesson".

Secondary button:
- height: `44-48px`;
- background: `brand.50` or `surface.card`;
- border: `1px solid border.default`;
- text: `brand.600`;
- radius: `12px`.

Tertiary action:
- use for "Skip", "Back", "Change", "Later";
- minimum hit area: `40px`;
- should still look actionable.

### 8.2. Inputs

Inputs should look safe and lightweight:
- height: `48px`;
- radius: `12px`;
- padding: `0 14-16px`;
- background: `surface.card`;
- border: `1px solid border.default`;
- focus border: `brand.500`;
- focus ring: `shadow.focus`.

Error text should be specific and calm.

### 8.3. Cards

Cards are the main container for meaning:
- background: `surface.card`;
- radius: `16-20px`;
- padding: `16px`;
- border: `1px solid border.subtle`;
- shadow: `shadow.sm` or none.

Active MVP card types:
- `Card/Base`;
- `Card/Interactive`;
- `Card/Selected`;
- `Card/Lesson`;
- `Card/Practice`;
- `Card/Feedback`;
- `Card/CoachTip`;
- `Card/Privacy`.

Deferred card types:
- `Card/Reward`;
- challenge cards;
- streak cards;
- shop/store cards.

### 8.4. Choice Card

Use for practice, short decisions, and small selections.

| Parameter | Value |
|---|---:|
| Minimum height | `56-64px` |
| Radius | `14-16px` |
| Padding | `14-16px` |
| Default border | `1px solid border.default` |
| Selected border | `2px solid brand.500` |
| Selected background | `#F7FBFF` |

States:

| State | Visual | Tone |
|---|---|---|
| `default` | White card, soft border | Neutral. |
| `selected` | Blue border, check/active marker | "Selected". |
| `correct` | Green soft background, check | "Correct". |
| `almost` | Yellow soft background, hint icon | "Almost". |
| `retry` | Peach soft background, explanation | "Not quite. Let's break it down." |
| `disabled` | Muted contrast | No punishment. |

Every state must be identifiable through icon, text, shape, or border weight, not color alone.

### 8.5. Progress

Linear progress:
- height: `4-8px`;
- radius: `999px`;
- track: `brand.100` or `border.default`;
- fill: `brand.500`, `sky.400`, or `learn.correct.500`.

Use for lesson progress and onboarding-like flows.

Route stepper:
- done: check marker;
- current: blue active marker;
- available: white marker with soft border;
- locked: muted lock marker, not red.

Do not add streaks, XP, or reward counters in the MVP.

### 8.6. Navigation Bars

Top bar:
- height: `52-56px`;
- horizontal padding: `20px`;
- icon buttons: at least `40x40px`;
- in a lesson, may include progress, but should stay lightweight.

Bottom lesson action:
- sticky bottom area is allowed for the primary next/check/finish action;
- must not cover content;
- must account for safe area;
- should contain one primary CTA and at most one tertiary action.

## 9. Lesson/Card Experience

The next UX direction should make lessons feel like focused sessions rather than long articles.

### 9.1. Lesson Session

Recommended MVP structure:
1. lightweight top bar with back action and lesson progress;
2. one active card on screen;
3. short theory/practice/reflection content;
4. immediate feedback after interaction;
5. sticky bottom CTA.

This pattern is allowed even while content remains public and progress save requires auth.

### 9.2. Lesson Card

Base structure:
1. optional icon or small illustration;
2. topic title;
3. short explanation;
4. interaction or reflection;
5. primary action.

Rules:
- no long theory inside one card;
- split dense text into multiple cards;
- keep each card focused on one meaning;
- show "card X of Y" when useful.

### 9.3. Theory Block

Theory should be short and applicable:
- heading;
- 1-2 short paragraphs;
- mini example or analogy;
- no lecture tone;
- explain complex terms immediately.

### 9.4. Practice Block

Practice types allowed in MVP:
- single choice;
- true/false;
- checklist;
- short scenario question;
- reflection prompt with transient local answer.

Rules:
- 2-4 answer options for choice tasks;
- one main question;
- feedback after answer;
- no scoring, diagnostics, or financial profiling.

### 9.5. Feedback Block

Feedback structure:
1. status: "Correct", "Almost", "There is a nuance";
2. short explanation;
3. next step.

Do not include points or rewards in MVP feedback.

## 10. Financial Patterns

### 10.1. Money Amounts

When showing amounts:
- use tabular numerals;
- format consistently;
- avoid alarmist red for small or incomplete amounts;
- explain context before pushing action.

### 10.2. Privacy

If a flow touches personal financial data later:
- explain why the data is requested;
- show how it is used;
- avoid unnecessary persistence;
- never shame the user for the answer.

In the current MVP, authenticated reflection/artifact answers can be saved as a private personal artifact. Anonymous learner answers remain transient.

### 10.3. Diagnostics And Recommendations

Diagnostics, scoring, personalization, and recommendations are out of MVP scope. Do not make UI patterns that imply an assessment result unless product scope changes.

## 11. Interface States

### 11.1. Empty States

Use empty states to offer one next action:

```text
No completed lessons yet
Start with a short first lesson.
[Start first lesson]
```

### 11.2. Loading States

Use quiet loading:
- skeletons for cards/lists;
- short loading copy;
- no artificial progress if data is not actually progressing.

### 11.3. Error States

Technical errors should be calm and actionable:
- what happened;
- what the user can do;
- retry action if available.

Do not blame the user.

### 11.4. Success States

Success states should confirm completion and suggest the next step. Keep celebrations restrained and relevant to learning.

## 12. Motion

Durations:
- tap feedback: `80-120ms`;
- base transition: `160-220ms`;
- card appearance: `200-280ms`;
- progress fill: `400-600ms`;
- correct feedback: `250-450ms`.

Allowed:
- button press scale;
- soft progress fill;
- card appearance from `8-12px`;
- subtle feedback highlight.

Avoid:
- spinning rewards;
- aggressive confetti;
- flashing elements;
- motion that blocks navigation;
- animation that creates financial pressure.

Respect `prefers-reduced-motion`.

## 13. Content Voice

Voice:
- plain;
- supportive;
- specific;
- non-judgmental;
- practical.

Avoid:
- shame;
- false urgency;
- promises of wealth;
- complicated financial jargon without explanation;
- childish wording.

Supportive feedback formula:
1. acknowledge the action;
2. explain the financial idea;
3. suggest the next small step.

Example:

```text
There is a nuance.
A credit card can help in emergencies, but it is not the same as a reserve because the money has to be repaid.
Try choosing the option that stays separate from daily spending.
```

## 14. Accessibility And Ethics

Baseline:
- main text must pass WCAG AA on white;
- bright yellow is not body text on white;
- touch targets should be at least `44x44px`;
- selected/completed/error states must not rely only on color;
- components must support text scaling;
- lesson navigation must be keyboard-accessible;
- no hidden urgency or shame-based retention.

FinPulse must not use:
- false urgency;
- hidden reward conditions;
- emotional pressure;
- shame for financial behavior;
- financial comparison with other users;
- manipulative loss mechanics;
- blocked exits from learning flows.

## 15. CSS Tokens

Starting token set for implementation:

```css
:root {
  --fr-color-brand-50: #EFF7FF;
  --fr-color-brand-100: #DDF0FF;
  --fr-color-brand-200: #BDE0FF;
  --fr-color-brand-300: #8FC9FA;
  --fr-color-brand-400: #55ADF4;
  --fr-color-brand-500: #1787F2;
  --fr-color-brand-600: #0D6FE8;
  --fr-color-brand-700: #0758C7;

  --fr-color-sky-400: #5BC0EB;
  --fr-color-sky-500: #1E9BD7;
  --fr-color-sky-600: #1479B8;

  --fr-color-learn-correct-50: #EAFBF4;
  --fr-color-learn-correct-500: #26C895;
  --fr-color-learn-almost-50: #FFF7E8;
  --fr-color-learn-almost-500: #FFB547;
  --fr-color-learn-retry-50: #FFF3F1;
  --fr-color-learn-retry-500: #E86B5C;
  --fr-color-danger-50: #FFF1F1;
  --fr-color-danger-500: #E84B4B;

  --fr-surface-canvas: #F7FBFF;
  --fr-surface-card: #FFFFFF;
  --fr-surface-soft: #F1F7FE;
  --fr-surface-muted: #F6F8FB;

  --fr-border-subtle: #EEF4FB;
  --fr-border-default: #DDE9F6;
  --fr-border-strong: #BFD6EF;

  --fr-text-primary: #10234A;
  --fr-text-secondary: #637188;
  --fr-text-tertiary: #9AA8BA;
  --fr-text-inverse: #FFFFFF;

  --fr-gradient-brand: linear-gradient(135deg, #42C9D6 0%, #1787F2 100%);
  --fr-gradient-learning: linear-gradient(135deg, #EAF7FF 0%, #F7FBFF 100%);

  --fr-font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;

  --fr-space-1: 4px;
  --fr-space-2: 8px;
  --fr-space-3: 12px;
  --fr-space-4: 16px;
  --fr-space-5: 20px;
  --fr-space-6: 24px;
  --fr-space-8: 32px;
  --fr-space-10: 40px;

  --fr-radius-xs: 8px;
  --fr-radius-sm: 10px;
  --fr-radius-md: 12px;
  --fr-radius-lg: 16px;
  --fr-radius-xl: 20px;
  --fr-radius-full: 999px;

  --fr-shadow-sm: 0 2px 8px rgba(18, 52, 89, 0.06);
  --fr-shadow-md: 0 8px 24px rgba(18, 52, 89, 0.08);
  --fr-shadow-focus: 0 0 0 4px rgba(23, 135, 242, 0.14);

  --fr-duration-fast: 120ms;
  --fr-duration-base: 200ms;
  --fr-duration-slow: 280ms;
  --fr-duration-progress: 500ms;
  --fr-ease-standard: cubic-bezier(0.2, 0.0, 0.0, 1.0);
  --fr-ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 16. Quality Checklist

Learning feel:
- Does the screen have one clear learning meaning?
- Is the next step obvious?
- Is progress visible without pressure?
- Does practice provide feedback?
- Are mistakes treated as hints?

Financial safety:
- Is there any shame or fear-based copy?
- Does the UI imply diagnostics, scoring, or recommendations outside scope?
- Are personal answers transient unless explicitly persisted?
- Is red reserved for technical/destructive states?

UI quality:
- Is the layout comfortable at 360px?
- Are tap targets at least `44x44px`?
- Does text fit without overlap?
- Are states clear beyond color?
- Does the primary CTA match the current step?

## 17. Implementation Notes

The live component catalog is Storybook. Run `npm run storybook` locally and build the hosted static artifact with `npm run build:storybook`; deployment should serve it from `/storybook/` outside the learner SPA route tree. Component ownership and anti-duplication rules live in `docs/engineering/ui-component-policy.md`.

For the next UI PR, start with the lesson/card experience:
- one-card-at-a-time lesson session;
- top lesson progress;
- sticky bottom CTA;
- choice/checklist/reflection states;
- immediate feedback blocks;
- browser smoke at 360px.

Do not implement rewards, streaks, challenges, or retention mechanics as part of this design-system adoption.
