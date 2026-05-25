# Evals

Evals are intentionally empty at project start.

Reason:
- the product does not exist yet;
- premature evals would encode guesses;
- useful evals should be created from real routes, real content behavior, real bugs, and critical user journeys.

## When to add the first evals

Add evals after at least one complete flow exists, for example:
- overview -> module -> lesson navigation;
- lesson block rendering;
- missing/invalid slug handling;
- content JSON validation;
- mobile smoke flow.

## Future structure

```txt
evals/
  tasks/
    E-001-program-navigation.md
  graders/
    content-validation.md
  regression/
    bugs/
  traces/
```

## Eval creation rule

Every eval should answer:
1. What product behavior does this protect?
2. What exact setup is required?
3. What is the expected outcome?
4. Is the grader deterministic, manual, or LLM-assisted?
5. What real bug/user journey caused this eval?

Prefer deterministic checks first.
