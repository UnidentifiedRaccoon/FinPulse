# Product Spec — FinPulse Learning MVP

## Product goal

Build a lightweight mobile-first site for consuming the material of an educational program.

The MVP should help a user:
1. open the program quickly on a phone;
2. understand the program structure;
3. navigate between modules and lessons;
4. read/watch/use lesson material comfortably;
5. return to relevant material without needing an account.

## MVP scope

Included:
- static educational program content;
- module list;
- lesson list;
- lesson detail page;
- simple navigation between lessons/modules;
- optional local-only UI preferences such as theme or last-opened lesson;
- responsive mobile-first design;
- JSON as content source.

Excluded:
- accounts/cabinets;
- diagnostics/tests as a product system;
- rewards/gamification;
- analytics dashboards;
- backend APIs;
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

## Product principles

- Content first.
- Fast on mobile.
- No unnecessary sign-in friction.
- No hidden complexity disguised as MVP.
- Accessible by default.
- Architecture should not block later expansion into accounts, diagnostics, analytics, or backend content delivery, but those must not be implemented now.

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
