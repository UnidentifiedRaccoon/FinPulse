# QA User Scenario Map — FinPulse

Last updated: 2026-06-15

## Purpose

This map defines the current MVP smoke and regression scenarios after the methodology reset. It covers entry authentication, the single active runtime graph, lesson consumption, progress persistence, private reflection/artifact answers, profile review, and responsive behavior.

Out of scope remains unchanged: diagnostics, rewards, scoring, recommendations, analytics dashboards, payments, admin/CMS, production financial operations, and automatic reminders.

## Current Runtime Routes

- Program: `/program`
- Profile: `/profile`
- Level: `/levels/level-1-start`
- Sections: `/levels/level-1-start/sections/money-and-operations`
- Lessons: `/lessons/where-money-goes`, `/lessons/mandatory-and-desired`, `/lessons/safe-payment`, `/lessons/digital-footprint-and-protection`

Product and methodology language uses Program -> Level -> Section -> Lesson ->
Card. Old `/modules/**` browser routes and old `/api/modules*` /
`/api/units*` content endpoints are not supported.

Current runtime lesson set:

- `where-money-goes`
- `mandatory-and-desired`
- `safe-payment`
- `digital-footprint-and-protection`

Removed legacy content must return 404 through content API and graceful load errors in the UI:

- level `financial-goals`
- section slugs `planning-and-management`, `values-and-goals`, `future-vision`, `financial-goals-map`, `goal-motivation`
- lessons `why-emergency-fund`, `reserve-amount`, `why-values-matter`, `what-are-values`, `values-conflict`, `practice-1m`, `life-cycle-and-money`, `vuca-future-view`, `day-in-future`, `goal-levels`

## Device Matrix

| ID | Viewport | Purpose |
|---|---:|---|
| M-360 | 360 x 740 | Narrow mobile overflow guard. |
| M-390 | 390 x 844 | Primary mobile smoke viewport. |
| M-430 | 430 x 932 | Large phone/safe-area check. |
| D-1024 | 1024 x 768 | Small desktop/tablet landscape. |
| D-1440 | 1440 x 900 | Primary desktop sidebar layout. |
| KBD | Any | Keyboard-only navigation and focus behavior. |

Minimum run:

- P0: M-390, D-1440, KBD.
- P1 responsive: M-360, M-430, D-1024.
- Visual overflow checks: M-360 and D-1024.

## Test Personas

| Persona | State |
|---|---|
| Anonymous visitor | No valid session cookie. |
| New learner | Registers during test; no progress and no private answers. |
| Returning learner | Existing valid session, no progress. |
| In-progress learner | Viewed first lesson, completed cards, saved artifact/reflection answers. |
| Completed learner | One or more current Level 1 lessons completed. |
| Expired-session learner | Progress/reflection API returns 401 during save. |
| Second learner | Separate account for privacy boundary checks. |

## Scenario Map

### Entry, Auth, And Shell

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| ENTRY-01 | P0 | Open `/` without a session. | Auth screen is shown with login, password, login, and registration controls. |
| ENTRY-02 | P0 | Open `/` with a valid session. | User is routed to `/program`; authenticated shell is available. |
| ENTRY-03 | P0 | Refresh `/program`, `/levels/level-1-start`, any current `/lessons/:lessonSlug`, and `/profile` while authenticated. | Route survives refresh; content loads from API; progress/profile data stay tied to the user. |
| AUTH-01 | P0 | Register and login with email and username-style identifiers. | Account is created/authenticated; progress/reflection fetches run. |
| AUTH-02 | P0 | Logout from desktop and mobile profile. | Session clears, app returns to auth screen, private state disappears, Back does not restore it. |
| SHELL-01 | P0 | Desktop authenticated `/program`. | Fixed sidebar shows FinPulse, `Обучение`, `Профиль`, user login, and logout. |
| SHELL-02 | P0 | Mobile authenticated `/program`. | Bottom nav shows `Обучение` and `Профиль`; lesson route hides bottom nav. |

### Program And Path

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| PROGRAM-01 | P0 | Open `/program` authenticated with no progress. | Level list renders; `Уровень 1 · Старт` card links to `/levels/level-1-start`; progress starts at zero. |
| PATH-01 | P0 | Open `/levels/level-1-start` with no progress. | The current section renders; `Куда уходят деньги` is the current lesson. |
| PATH-02 | P0 | Open current lesson node dialog. | Dialog shows title, `5 мин`, and action to `/lessons/where-money-goes`. |
| PATH-03 | P0 | Open each current section route. | Section path renders only that section's lesson list and returns to the level. |
| PATH-04 | P1 | Open invalid or removed level/section route. | Graceful not-found or load-error state appears; no stale content renders. |

### Lesson Reader

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| LESSON-01 | P0 | Open `/lessons/where-money-goes`. | Lesson details, progress header, first card, and sticky bottom action render. |
| LESSON-02 | P0 | Complete the full lesson. | Cards advance in order and final summary completes the lesson. |
| LESSON-03 | P0 | Card 1 subjective `single_choice`. | Any selected option can continue without a correct-answer check. |
| LESSON-04 | P0 | Card 2 theory. | Theory text includes the spending-leak fact/callout text; no video card is rendered without a real source. |
| LESSON-05 | P0 | Card 3 objective `categorization`. | All expenses must be assigned to a category before checking; feedback appears before continuing. |
| LESSON-06 | P0 | Card 4 external-example scenario/statistics. | Source-backed statistics render; objective interaction can be completed before continuing. |
| LESSON-07 | P0 | Card 5 artifact template. | `Далее` is disabled until at least one expense row is filled; answer saves before card completion. |
| LESSON-08 | P0 | Card 6 reflection single select. | `Далее` is disabled until a selection; answer saves under `unexpected_expense`. |
| LESSON-09 | P0 | Card 7 artifact variants. | Radio variant selection enables continue; `Свой вариант` reveals a required text field and persists typed text as the artifact variant. |
| LESSON-10 | P0 | Card 8 summary. | Summary bridges to the next lesson and final action completes the lesson. |
| LESSON-11 | P1 | Open invalid or removed lesson route. | Graceful "lesson could not load" state appears and no viewed progress is written. |

### Progress, Answers, And Profile

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| PROGRESS-01 | P0 | Authenticated user opens the lesson. | Viewed lesson and first viewed card are saved once per route open. |
| PROGRESS-02 | P0 | Authenticated user completes each card and the lesson. | Completed markers are saved; transient save failures retry where supported; hard failures block advancement. |
| PROGRESS-03 | P0 | Login as second user. | First user's progress is not visible. |
| PROFILE-01 | P0 | Open `/profile` as authenticated learner. | Identity, progress stats, and `Персональный финансовый навигатор` render. |
| PROFILE-02 | P0 | Save artifact and reflection answers, then open `/profile`. | Answers appear in one navigator list with Level/Section context. |
| PROFILE-03 | P0 | Logout after viewing profile. | Private answers disappear from UI and cannot be reached with Back/reload. |
| PROFILE-04 | P1 | Very long answer text. | Text wraps and does not overflow mobile or desktop. |

### API And Data Boundaries

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| API-01 | P0 | `GET /api/program`, `/api/levels/level-1-start`, current `/api/sections/money-and-operations`, and all current `/api/lessons/:lessonSlug`. | Responses match shared Level/Section content schemas. |
| API-02 | P0 | Removed old content API calls to `/api/modules`, `/api/modules/:moduleSlug`, and `/api/units/:unitSlug`. | Old endpoints return 404. |
| API-03 | P0 | Removed legacy content API slugs. | Old level/section/lesson slugs return 404. |
| API-04 | P0 | Protected auth/progress/reflection endpoints without cookie. | Protected endpoints return 401; no private data is returned. |
| API-05 | P0 | Reflection save for non-reflection/non-artifact card. | Backend rejects as `non_persistable_card`. |
| API-06 | P0 | Empty reflection/artifact payload. | Backend rejects; UI does not advance. |

## End-To-End Critical Paths

### E2E-P0-01 — New Learner To First Navigator Answers

1. Open `/` on M-390.
2. Register a new email user.
3. Confirm `/program` opens and authenticated mobile nav appears.
4. Open Level `level-1-start`.
5. Open `where-money-goes` from the lesson node dialog.
6. Complete all eight cards: subjective choice, theory, objective categorization, external example/statistics, expense artifact, reflection, 3-day rule artifact, summary.
7. Open `/profile`.
8. Confirm progress stats and saved answers under `Персональный финансовый навигатор`.
9. Refresh `/profile` and confirm data persists.

### E2E-P0-02 — Privacy Isolation

1. User A registers, completes the lesson, and saves at least one private answer.
2. User A logs out.
3. User B registers or logs in.
4. User B opens `/profile`.
5. Confirm User B sees no User A progress or private answers.
6. User B creates their own progress/answers.
7. User A logs back in and sees only User A data.

### E2E-P0-03 — Legacy Content Removed

1. Authenticated user opens removed level route `/levels/financial-goals`.
2. Confirm level load error, not old content.
3. Open `/levels/level-1-start/sections/values-and-goals`.
4. Confirm old section load fails.
5. Open `/lessons/why-values-matter`.
6. Confirm lesson load error and no progress write.
