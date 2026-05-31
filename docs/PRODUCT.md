# Product Spec — FinPulse Learning MVP

## Product goal

Build a lightweight mobile-first site for consuming the material of an educational program.

The MVP should help a user:
1. open the program quickly on a phone;
2. understand the program structure;
3. navigate between modules and lessons;
4. read/watch/use lesson material comfortably;
5. return to relevant material without needing an account in the first reader slice;
6. in Stage 2, optionally create a simple learner login so lesson/card progress survives reloads.

## MVP scope

Included:
- static educational program content;
- module list;
- lesson list;
- lesson detail page;
- simple navigation between lessons/modules;
- optional local-only UI preferences such as theme or last-opened lesson;
- Stage 2 backend API for content delivery;
- Stage 2 simple learner registration/login for saved progress;
- Stage 2 persisted viewed/completed progress for lessons/cards;
- Stage 2 private saved answers for authenticated reflection/artifact cards as a personal artifact;
- responsive mobile-first design;
- JSON as content source.

Excluded:
- user cabinets/profile management beyond the minimal learner login, learning progress, and private answer artifact;
- diagnostics/tests as a product system;
- rewards/gamification;
- analytics dashboards;
- admin panel/CMS;
- payments;
- production financial operations;
- personalized recommendations.

## Primary user journey

1. User opens the site.
2. User sees the educational program title and a clear module list.
3. User opens a module.
4. User chooses a lesson.
5. User consumes the lesson material.
6. User navigates to the next or previous lesson.
7. In Stage 2, signed-in users can keep basic progress across reloads.
8. In Stage 2, signed-in users can return to their own reflection/artifact answers in the profile.

## Product principles

- Content first.
- Fast on mobile.
- No unnecessary sign-in friction: content remains readable without auth, and auth exists only for saved progress.
- Personal answers are a private learner artifact, not a test, score, inferred profile, or recommendation surface.
- No hidden complexity disguised as MVP.
- Accessible by default.
- Architecture should not block later expansion into accounts, diagnostics, analytics, or richer backend content delivery, but those must stay behind explicit decisions.

## Initial routes

Recommended initial route map:

```txt
/                         Program overview
/modules/:moduleSlug       Module detail
/lessons/:lessonSlug       Lesson detail
/about                     Optional static about/program info
```

## Acceptance baseline for early MVP

The app is minimally useful when:
- a real JSON program file can be loaded;
- the overview page renders all modules;
- a module page renders its lessons;
- a lesson page renders the lesson content blocks;
- invalid/missing content fails gracefully;
- the app passes typecheck, content validation, and production build.
