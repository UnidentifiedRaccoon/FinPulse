# Product Spec — FinPulse Learning MVP

## Product goal

Build a lightweight mobile-first site for consuming the material of an educational program.

The MVP should help a user:
1. open the program quickly on a phone;
2. understand the program structure;
3. navigate between levels, sections, and lessons;
4. read/watch/use lesson material comfortably;
5. return to relevant material without needing an account in the first reader slice;
6. in Stage 2, optionally create a simple learner login so lesson/card progress survives reloads.

## MVP scope

Included:
- static educational program content;
- level list;
- section lesson paths;
- lesson list;
- lesson detail page;
- simple navigation between levels, sections, and lessons;
- optional local-only UI preferences such as theme or last-opened lesson;
- Stage 2 backend API for content delivery;
- Stage 2 simple learner registration/login for saved progress;
- Stage 2 persisted viewed/completed progress for lessons/cards;
- Stage 2 private saved answers for authenticated reflection/artifact cards as a personal artifact;
- internal read-only curator progress board accepted by ADR-0010;
- responsive mobile-first design;
- JSON as content source.

Excluded:
- user cabinets/profile management beyond the minimal learner login, learning progress, and private answer artifact;
- diagnostics/tests as a product system;
- rewards/gamification;
- analytics dashboards;
- admin panel/CMS for content editing or learner-facing product management;
- payments;
- production financial operations;
- personalized recommendations.

## Primary user journey

1. User opens the site.
2. User sees the educational program title and a clear level list.
3. User opens a level and sees its sections.
4. User chooses a lesson in a section.
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

## Internal admin exception

ADR-0010 accepts a separate internal Next.js admin surface for the first curator progress board. ADR-0011 accepts deploying it as a separate internal production surface, not as part of the learner SPA. It is read-only and separate from the learner app. It shows user login/email and progress aggregates, but does not show reflection/artifact answer text by default.

Still out of scope:
- organizations and RBAC;
- answer-text review;
- analytics dashboards;
- content editing/CMS;
- learner app migration to Next.js.

## Initial routes

Target educational route map:

```txt
/                         Program overview
/levels/:levelSlug          Level detail
/levels/:levelSlug/sections/:sectionSlug
                          Section detail, if a focused section route is needed
/lessons/:lessonSlug       Lesson detail
/about                     Optional static about/program info
```

Current educational routes use `/levels/:levelSlug` and
`/levels/:levelSlug/sections/:sectionSlug`. Old `/modules/**` browser routes
are not supported.

## Acceptance baseline for early MVP

The app is minimally useful when:
- a real JSON program file can be loaded;
- the overview page renders all levels;
- a level page renders its sections and lessons;
- a lesson page renders the lesson content blocks;
- invalid/missing content fails gracefully;
- the app passes typecheck, content validation, and production build.
