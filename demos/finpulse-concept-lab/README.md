# FinPulse User-Test Lesson

Published demo: <https://unidentifiedraccoon.github.io/FinPulse/concept-lab/>

The public URL now opens one mobile-first, eight-screen FinPulse lesson for an
ordinary learner. It uses the canonical chapter-3 scene about Sasha's housing
money and one C2-derived exercise: a newly confirmed fact can change only the
conclusion directly connected to that fact.

The public learner path contains no concept codes, jury notes, editorial
labels, mechanic comparison, scoring or choice between prototypes. It follows
the v1 lesson rhythm: one active card, visible progress and one sticky primary
action.

The earlier research collections remain available to the team at
`#/lab`:

- six original A–F routes around chapter 1;
- three consilium routes A0, B1 and jury-selected C2 around the housing-money
  scene in chapter 3.

Those original routes still begin with the uninterrupted canonical opening of
chapter 1. The consilium routes use the same chapter-3 motive, shared check,
canonical decision and later housing payoff, while changing only their marked
learning practice. They do not use the current Story v2 runtime or the old
eight-screen lesson model.

## Run

```bash
npm --prefix demos/finpulse-concept-lab run dev
```

Open `http://127.0.0.1:5177`.

## Checks

```bash
npm --prefix demos/finpulse-concept-lab run test
npm --prefix demos/finpulse-concept-lab run build
```

All interaction state is in React memory. The demo has no API, storage,
cookies, login, telemetry, scoring or personalized recommendations. Fictional
conditions in the learner exercise and the internal B1/C2 routes are explicitly
separated from Sasha's story and do not describe a real financial product.

## Routes

- `#/` — public user-test lesson;
- `#/lesson/2` … `#/lesson/8` — reloadable lesson steps;
- `#/lab` — internal research library;
- `#/concept/*` — internal prototype routes.
