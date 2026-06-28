# FinPulse Editorial Rubric

This rubric is extracted from the accepted edits for Level 1 Section 1 lessons
1-4. Use only these lessons as the current style exemplar.

## Voice

- Address the learner as `ты`.
- Sound adult, calm, and practical.
- Be warm without baby talk or inflated praise.
- Normalize common money mistakes without shame.
- Prefer action verbs: `остановись`, `заметь`, `проверь`, `запиши`, `разберись`.
- Keep sentences short enough for a mobile lesson.
- Avoid bureaucratic, academic, or diagnostic language.

Good tone:
- `Понимаю тебя. Двигайся дальше, и ты точно увидишь дыры в бюджете.`
- `Знакомая история. Такое бывает у многих: разберёмся, где «надо», а где «хочу».`
- `Почти получилось. Пересмотри пункты, где данные уходят наружу...`
- `Это не про запрет, а про осознанный выбор.`

Avoid:
- shame: `ты неправильно тратишь`, `плохая привычка`;
- labels: `ты импульсивный`, `тревожный тип`;
- generic praise without learning value: `молодец, супер`;
- unexplained abstractions: `финансовая осознанность как компетенция`;
- recommendations framed as personal financial advice.

## Lesson Flow

Each Level 1 lesson should feel like:
1. familiar hook;
2. one clear idea;
3. objective practice;
4. external real-world example;
5. personal application without judgment;
6. reflection without judgment;
7. micro-rule or first step;
8. Navigator summary and bridge.

Do not add new concepts late in the lesson. Rewrite late cards as consolidation,
personalization, or bridge text.

## Screen Patterns

### Screen 1 Hook

Use a recognizable situation, then ask one soft question. All options are valid.
Feedback accepts the learner's starting point and points forward.

Pattern:
- `Понимаю тебя...`
- `«Иногда» — это уже не постоянно...`
- `Хорошо, что у тебя уже были такие мысли...`

### Screen 2 Theory

One idea only. Use concrete examples. If there is an illustration/fact, keep it
as a normal paragraph, not as a separate renderer-specific structure.

Example direction:
- small expenses become visible only when noticed;
- mandatory vs desired expenses are about priority, not shame;
- fraud schemes work through urgency and fear;
- digital traces matter because they give scammers context.

### Screen 3 Objective Practice

Prefer `categorization` for Level 1 screen 3. Feedback must teach the distinction.
When wrong, tell the learner exactly which logic to revisit.

Correct result:
- title such as `Отличная работа`, `Отлично!`, `Хорошая работа`;
- body names the principle and next action.

Retry result:
- title such as `Проверь, все так?`;
- body explains the likely confusion without blame.

Example:
`Почти всё правильно. Подумай и уточни: проездной на месяц — обязательное, если транспорт — неотъемлемая часть твоей жизни.`

### Screen 4 Scenario

Keep the scenario external and short. Exactly one option should be correct.
Option feedback explains why that choice works or fails. Card-level feedback
names the principle to take away.

Use custom titles when the source distinguishes states:
- `feedbackTitle: "Верно!"`
- `retryFeedbackTitle: "Нет!"`

Avoid duplicating the same sentence in option feedback and card feedback.

### Screens 5-6 Personal Work

No correct/incorrect framing. Use private, low-pressure wording:
- `Никаких хорошо и плохо — просто замечаем.`
- `Это не про запрет, а про осознанный выбор.`
- `Каждый пункт — это шаг...`

Keep prompts safe and small. Do not request unnecessary sensitive data.

### Screen 7 Micro-Rule

Offer exactly two ready `variants` plus `Свой вариант`. Variants are plain text.
Make the rule concrete enough to do today.

Good:
- `3 дня записываю каждую трату, не ругаю себя, а просто наблюдаю`
- `Если покупка крупная и желаемая, то делаю паузу 1 день перед решением`

### Screen 8 Summary

Show what was saved and why it matters. Bridge to the next lesson or section.
Do not introduce new material.

## Field Placement

Use the smallest field that matches the learner experience:
- learner-facing button copy -> `ctaLabel`;
- correct/accepted heading -> `feedbackTitle`;
- correct/accepted body -> `feedback`;
- incorrect heading -> `retryFeedbackTitle`;
- incorrect-only body -> `retryFeedback`;
- per-option explanation -> `options[].feedback`;
- per-item explanation -> `items[].feedback`;
- source-backed statistics -> card-level `statistics`.

Plain-text fields must stay plain:
- `title`, `feedbackTitle`, `retryFeedbackTitle`, `ctaLabel`;
- labels, variants, ids, slugs, paths, `statistics.items[].value`.

Markdown-enabled fields may use paragraphs, bold, italic, underline, and links
only where `CONTENT_MODEL.md` allows them.

## Copy Fix Checklist

Before accepting an edit, check:
- Does it preserve the lesson's one main idea?
- Does it tell the learner what to do next?
- Does it avoid shame and diagnosis?
- Is personal work non-evaluative?
- Are correct and retry feedback separated when the UI supports it?
- Is source Markdown synced with runtime JSON?
- Does `npm run check:content` pass?

## Needs Review Triggers

Ask for review only when:
- source and selected edit conflict;
- a requested rewrite would change educational/product scope;
- a statistic is absent from the approved source but required by the user;
- schema/UI work would become broad architecture work;
- a failed check is unrelated to the edit and cannot be fixed locally.
