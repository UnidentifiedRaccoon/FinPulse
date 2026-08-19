# FinPulse learner-mechanics lab

Published demo: <https://unidentifiedraccoon.github.io/FinPulse/concept-lab/#/lab>

The lab contains nine independent, mobile-first FinPulse lessons that are ready
for ordinary-user testing. Each route uses the v1 lesson rhythm: one active
card, visible progress, one sticky primary action, calm answer-specific
feedback and an explicit handoff back to the lesson library.

The launcher contains no concept codes, jury notes or research terminology. It
groups the lessons by the story situation and describes the concrete action a
learner will try:

- six routes around a subscription and a suspicious support message;
- three routes around money that could be needed for a housing decision.

The public root still opens the existing lesson about how one new fact changes
only the conclusion connected to it. The same lesson now also has the canonical
lab route `#/lesson/one-fact-one-conclusion/1`.

## Run

```bash
npm --prefix demos/finpulse-concept-lab run dev
```

Open `http://127.0.0.1:5177/#/lab`.

## Checks

```bash
npm --prefix demos/finpulse-concept-lab run test
npm --prefix demos/finpulse-concept-lab run build
```

The demo has no API, account, cookies, telemetry, scoring or personalized
recommendations. Bounded answer IDs live only in the current hash URL so that
Back and reload behave predictably; they are not sent or saved to an account.
The learner routes do not request personal or financial input.

Financial copy keeps the story's uncertainty: the money could be needed for
housing, one past result does not establish repeatability, principal protection
or access to the whole amount, and the advertised product is described only as
a neutral digital service. Fictional comparison conditions are visibly marked
and do not describe a real product.

## Routes

- `#/lab` — learner launcher with all nine lessons;
- `#/lesson/:lessonSlug/1` … `#/lesson/:lessonSlug/8` — reloadable learner
  screens;
- `#/` and `#/lesson/2` … `#/lesson/8` — compatibility routes for the original
  public lesson;
- `#/concept/*` — internal research provenance routes, not linked from the
  learner launcher.
