# FinPulse Concept Lab

Published demo: <https://unidentifiedraccoon.github.io/FinPulse/concept-lab/>

Standalone local demo with two independent collections of learning mechanics
for canonical Sasha episodes:

- six original A–F routes around chapter 1;
- three consilium routes A0, B1 and jury-selected C2 around the housing-money
  scene in chapter 3.

The original routes still begin with the uninterrupted canonical opening of
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
conditions in B1 and C2 are visibly NONCANON and do not describe a real
financial product.
