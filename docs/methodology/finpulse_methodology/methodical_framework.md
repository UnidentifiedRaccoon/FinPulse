# Methodical Framework

Source references: `00_original_content.md` lines 1-129, 464-609, 613-786,
790-850, 941-1081.

This file captures the durable methodology behind FinPulse lessons. It is not a
runtime schema and does not imply persistence or product features beyond the MVP.

## Core Idea

FinPulse should work as a system of short financial trainings, not as a course
with tests. A lesson takes 3-5 minutes and moves through this ladder:

```text
вспомнил -> понял -> применил к реальному миру -> применил к себе -> закрепил маленьким правилом поведения
```

The last step matters as a separate design object: a habit or small behavior rule
does not appear automatically from knowledge.

Educational outcomes are grouped as:

- awareness, knowledge, and understanding;
- skills and behavior;
- personal characteristics and attitudes, including confidence and motivation.

For FinPulse this means the user should know terms, act in real financial
situations, understand personal reactions, and leave with small useful rules.

## Base Exercise Model

Every exercise has two core tags:

```text
Тип мышления: память, понимание, реальный мир, личный мир, привычка.
Что развивает: психология, харды, софт-скилы, привычки.
```

The same knowledge can be trained in different ways.

| Thinking type | App shape | Develops |
|---|---|---|
| Знание / память | Definition choice, term/example match, factual recall. | Харды |
| Понимание | Why/what-if reasoning, error spotting. | Харды + critical thinking |
| Связь с реальным миром | Find a rate, total cost, registry entry, contract condition, fee, subscription, or source. | Софт-скилы + харды |
| Связь с личным миром | Recall a personal purchase, feeling, goal, or trigger. | Психология + self-reflection |
| Привычка / правило | Pick a wait rule, review day, autopayment, checklist, or small repeated action. | Привычки |

Fast-changing financial values should not be memorized as eternal facts. Users
should train the skill of finding current information in reliable sources.

## Short Lesson Formula

The base 3-5 minute lesson structure:

1. Hook, 20-30 seconds: one life situation.
2. Mini-theory, 40-60 seconds: one idea only.
3. Understanding practice, about 60 seconds: sort, choose, explain, or spot a mistake.
4. Real-world step, 60-90 seconds: check an external condition, source, price, fee, or term.
5. Personal-world step, about 60 seconds: safe, small reflection.
6. Micro-rule, 20-30 seconds: choose or formulate one behavior rule.

Final FinPulse lesson formula:

```text
Короткая ситуация
-> одна мысль
-> действие
-> обратная связь
-> жизненный или внешний контекст
-> личное применение
-> маленькое правило
-> сохранённый артефакт
-> возврат к нему позже
```

Final unit formula:

```text
1. Понять идею.
2. Узнать ключевые термины.
3. Потренироваться на сценариях.
4. Применить к своей жизни.
5. Сохранить артефакт.
6. Получить микро-правило.
7. Вернуться к результату в следующих модулях.
```

## Development Directions

### Психология

Use soft questions instead of lectures. The goal is to reduce shame and increase
the feeling of control: what the user feels around money, which purchases come
from fatigue, which topics they avoid, and which beliefs block action.

### Харды

Facts, formulas, terms, and calculations: total cost of credit, compound
interest, inflation, nominal and real yield, taxes, deposit insurance, debt load,
and differences between financial instruments. Tests, cards, calculators,
sorting, and tasks can fit here as source patterns.

### Софт-скилы

The ability to act in a financial environment: find an official source, ask a
consultant a question, compare offers, read a contract, discuss a family budget,
decline an uncomfortable money request, submit a complaint, or avoid pressure.

### Привычки

Habits should be small, concrete, and repeatable: transfer a percent after
salary, review weekly expenses, wait 24 hours before purchases over a threshold,
check subscriptions monthly, calculate total overpayment before credit, or check
risk/term/fees before investing.

## Duolingo-Like Training Without Shame

A daily training can combine:

- two review cards for terms, formulas, or red flags;
- one understanding card with a life scenario;
- one real-world card to check a source or condition;
- one personal-world card with a reflection or rule choice;
- one micro-action such as adding to a list, enabling a reminder, or choosing a budget review day.

Instead of one general XP number, the source proposes four progress scales:
knowledge, decisions, actions, and habits. Later extensions add a fifth scale,
the personal map. These are methodology concepts; do not treat them as analytics
or diagnostics scope for the MVP.

Finance lessons should avoid punishment and shame. Errors should sound like
typical situations and invite another attempt.

## Result Screen Principle

After a lesson, the source result screen emphasizes usefulness rather than only
right/wrong scoring:

- what hard skill was trained;
- what psychological trigger or reflection was found;
- what soft skill was practiced;
- what habit or micro-rule was chosen;
- what small next action follows.

The strongest product principle is that every topic should end with a small
behavior change, not just a test.

## Extensions

### Final Artifact

A final artifact is a saved result of a lesson or unit that the app may return to
later. Source examples include:

| Topic | Artifact |
|---|---|
| Values | personal values map |
| Financial goals | list of goals with reason and term |
| Budget | draft expense categories |
| Safety cushion | target amount and first step |
| Credit | before-credit checklist |
| Investments | term/risk/goal profile |
| Security | personal protection checklist |

Runtime note: the source mentions profile/artifact storage, but current MVP scope
only persists viewed/completed progress. Treat artifact persistence as future
product scope unless an explicit decision expands it.

### Real World A And B

The original "real world" layer splits into:

| Subtype | Meaning | Examples |
|---|---|---|
| Real world A: financial environment | Work with external financial sources and terms. | Find total cost of credit, check a rate, verify an organization, read return terms, find a fee. |
| Real world B: life financial scenario | Work through a realistic situation where money connects to values, emotions, and relationships. | Mortgage or rent, vacation or safety cushion, helping relatives, car or goal, family money disagreement. |

Values/goals lessons especially need real world B.

### Subjective Tasks

Some values, goals, motivation, family-money, and habit tasks do not have one
right answer. Use three checking modes as source methodology:

| Check type | Used for | Evaluation |
|---|---|---|
| Objective | Terms, formulas, calculations, red flags. | Right / mistake / hint. |
| Subjective | Values, goals, feelings, personal rules. | Done / clarify / offer an example. |
| Mixed | Scenarios with a best answer, dialogues, checklists. | Best / acceptable / risky. |

For subjective work, never mark a value or desire as wrong. Assess the quality of
the connection:

```text
желание / покупка -> потребность -> ценность -> возможная финансовая цель
```

### Return And Behavioral Bridge

The source expects saved results to be revisited: in 7 days, in 30 days, before
budget/cushion/investment modules, or after a large decision. Each lesson should
also bridge to the next one by naming how the artifact will be used later.

Runtime note: return mechanics are product/source concepts, not a requirement to
add reminders, profiles, recommendations, or persistence in the MVP.

## Lesson Method Card

Each lesson can be planned with these fields:

- title;
- place in course: module, unit, lesson number;
- goal for the 3-5 minute session;
- main skill;
- thinking type;
- what it develops;
- checkability: objective, subjective, or mixed;
- card structure;
- feedback for correct, typical mistaken, and subjective answers;
- user artifact;
- behavioral bridge;
- return moment.

## Card Design Rules

- One screen, one thought.
- Theory should quickly turn into action: choose, match, sort, spot a mistake,
  answer about self, or save a rule.
- A mistake is training, not failure.
- Personal questions must be safe; use ranges and option choices when exact
  numbers or freeform input would be too sensitive.
- Video is a bonus, not the mandatory foundation; the main mobile lesson should
  work through cards and interactions.

## Quality Rubrics

### Subjective Answer Levels

| Level | Signal | Feedback role |
|---|---|---|
| 0. Empty | Nothing chosen or written. | Offer any safe starting example. |
| 1. Desire | Only a purchase or desire. | Ask why it matters. |
| 2. Need | Purchase plus "why". | Invite naming the value behind the need. |
| 3. Value | Purchase connected to value. | Mark as part of the values map. |
| 4. Financial goal | Value connected to real goal. | Bridge to planning. |

### Base Lesson Checklist

- Lesson takes 3-5 minutes.
- There is one main thought.
- No long lecture blocks.
- There is interaction in the first 30-60 seconds.
- There is feedback on error.
- There is at least one personal or real context.
- There is a micro-rule or next step.
- There is a clear lesson result.

### Values Lesson Checklist

- Difference between purchase, need, and value is preserved.
- Personal values are not judged as good or bad.
- Reflection is soft and non-pressuring.
- A life scenario exists, not only abstract theory.
- There is a saved artifact: value, event, rule, or map.
- There is a bridge to financial goals.

### External Financial Data Checklist

- Quickly changing numbers are not hard-coded as eternal facts.
- User learns to find an up-to-date source.
- Source is specified or embedded in the task.
- Risk warnings appear for credit, investment, or financial security topics.
- There is no individual financial recommendation where personal assessment is needed.

## Glossary

| Term | Meaning |
|---|---|
| Card | One screen or one user action. |
| Lesson | Short 3-5 minute sequence of cards. |
| Unit | Group of lessons around one skill. |
| Thinking type | Cognitive mode: memory, understanding, real world, personal world, habit, artifact. |
| Харды | Financial knowledge, terms, calculations, rules. |
| Софт-скилы | Ability to act and communicate in financial contexts. |
| Personal world | Connection to experience, feelings, goals, and habits. |
| Real world A | External financial sources and terms. |
| Real world B | Life financial scenarios. |
| Artifact | Saved user result. |
| Behavioral bridge | Connection between a lesson and future action or lesson. |

## Main Conclusion

The original methodology already fits a Duolingo-like finance app. It should not
be replaced. It should be extended so it works both for hard topics such as
credit, rates, total cost, and investments, and for softer topics such as values,
motivation, family money, and financial habits.

The main addition is that every lesson should end not only with a test or a rule,
but also with a small personal result that can be used later when the product
scope allows it.
