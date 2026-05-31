# QA User Scenario Map — FinPulse

Last updated: 2026-05-31

## Purpose

This map defines the user scenarios that must be covered before shipping meaningful learner-facing changes. It covers the current MVP surface: entry authentication, learning path navigation, lesson consumption, progress persistence, private reflection/artifact answers, profile review, and responsive behavior on mobile and desktop.

It intentionally does not add product scope. Full account management, diagnostics, rewards, scoring, recommendations, analytics dashboards, payments, admin/CMS, and production financial operations remain out of scope.

## Coverage Rules

- Test every P0 scenario on mobile and desktop.
- Treat mobile as the primary layout; desktop must be a graceful expansion, not a separate product.
- Verify persisted progress and private answers with at least two different authenticated users.
- Verify anonymous behavior separately from authenticated behavior.
- Keep content routes and JSON-derived lesson/card data read-only.
- Validate both happy paths and failure states for API, session, and slow network conditions.

## Priority Levels

| Priority | Meaning |
|---|---|
| P0 | Release-blocking critical path or data/privacy behavior. |
| P1 | Important workflow, regression, accessibility, or responsive behavior. |
| P2 | Useful edge case, visual polish, or lower-frequency branch. |

## Device Matrix

| ID | Viewport | Purpose |
|---|---:|---|
| M-360 | 360 x 740 | Narrow Android/small iPhone overflow guard. |
| M-390 | 390 x 844 | Primary mobile smoke viewport. |
| M-430 | 430 x 932 | Large phone/safe-area check. |
| D-1024 | 1024 x 768 | Small desktop/tablet landscape. |
| D-1440 | 1440 x 900 | Primary desktop sidebar layout. |
| KBD | Any | Keyboard-only navigation and focus behavior. |

Minimum run:
- P0: M-390, D-1440, KBD.
- P1 responsive: M-360, M-430, D-1024.
- Visual overflow checks: M-360 and D-1024.

## Test Personas And States

| Persona | State |
|---|---|
| Anonymous visitor | No valid session cookie. |
| New learner | Registers during test; no progress and no private answers. |
| Returning learner | Existing valid session, no progress. |
| In-progress learner | Existing account with viewed lessons, completed cards, completed lessons, and saved answers. |
| Completed learner | Existing account with the whole current module completed. |
| Expired-session learner | UI initially has auth state, then progress/reflection API returns 401. |
| Second learner | Separate account used to verify privacy boundaries. |

## Test Data

Use unique values per run:
- Email login: `qa+<timestamp>@example.com`
- Username login: `qa_<timestamp>`
- Password: at least 8 characters, for example `Passw0rd!`
- Invalid login examples: `a@`, `ab`, `bad login`
- Invalid password example: `short`

Representative current runtime routes:
- Program: `/program`
- Profile: `/profile`
- Module: `/modules/financial-goals`
- Unit: `/modules/financial-goals/units/values-and-goals`
- First lesson: `/lessons/why-values-matter`
- Reflection/artifact-heavy lesson: `/lessons/values-conflict`
- Final current lesson: `/lessons/goal-levels`

Current runtime lesson set to traverse in full-regression runs:
- `why-values-matter`
- `what-are-values`
- `values-conflict`
- `practice-1m`
- `life-cycle-and-money`
- `vuca-future-view`
- `day-in-future`
- `financial-goal-types`
- `goal-timeline`
- `goal-parameters`
- `goal-achievability`
- `motivation-pit`
- `locus-of-control`
- `descartes-matrix`
- `goal-levels`

## Scenario Map

### 1. App Entry And Session Bootstrap

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| ENTRY-01 | P0 | Open `/` without a session. | Session check completes and the entry auth screen is shown with login, password, login button, and registration button. |
| ENTRY-02 | P0 | Open `/` with a valid session. | User is routed to `/program`; authenticated shell is available. |
| ENTRY-03 | P0 | Open `/profile` with a valid session. | Profile is rendered; user identity, stats, and private answer area are visible. |
| ENTRY-04 | P0 | Refresh `/program`, `/modules/financial-goals`, `/lessons/why-values-matter`, and `/profile` while authenticated. | Route survives refresh; content loads from API; progress/profile data remain associated with the same user. |
| ENTRY-05 | P1 | Refresh a nested route while anonymous. | The app shows the anonymous entry state or the explicitly accepted public-content behavior; no broken blank page. |
| ENTRY-06 | P1 | Simulate slow `GET /api/auth/me`. | Loading/session-check state is visible and does not flicker into the wrong screen. |
| ENTRY-07 | P1 | Simulate `GET /api/auth/me` returning 500. | A readable error is shown; app does not crash. |
| ENTRY-08 | P1 | Simulate `GET /api/auth/me` returning 401. | User is treated as anonymous; no stale progress/profile data appears. |

Product contract check: docs say educational content should remain readable without unnecessary sign-in friction, while the current entry route is auth-led. If anonymous direct content access is still a required product contract, add explicit P0 tests that `/program`, module, unit, and lesson routes render content without authentication.

### 2. Registration

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| REG-01 | P0 | Register with a new valid email and password. | Backend creates user, session cookie is set, user becomes authenticated, progress/reflection fetches run, and `/program` is reachable. |
| REG-02 | P0 | Register with uppercase email. | Stored/displayed login is normalized consistently; subsequent login with lowercase works. |
| REG-03 | P0 | Register with username-style login. | Username account is created and can log in. |
| REG-04 | P0 | Register with an already used email/login. | User sees duplicate-account error; no new session replaces the current one unexpectedly. |
| REG-05 | P0 | Register with too-short password. | User sees validation/auth payload error; no account is created. |
| REG-06 | P1 | Register with invalid login format. | User sees validation/auth payload error; form remains usable. |
| REG-07 | P1 | Double-click registration or press Enter repeatedly. | Only one effective submission occurs; busy state prevents duplicate accounts or inconsistent UI. |
| REG-08 | P1 | Registration API fails due network/server error. | User sees a readable error; form values remain editable; no partial authenticated shell appears. |
| REG-09 | P2 | Register with max-length supported email/login and password. | Either accepted within documented limits or rejected with clear error; UI does not overflow. |

### 3. Login

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| LOGIN-01 | P0 | Login with existing email and password. | User is authenticated; progress and private answers load; `/program` is shown. |
| LOGIN-02 | P0 | Login with existing username and password. | User is authenticated and sees their own progress/profile. |
| LOGIN-03 | P0 | Login with wrong password. | Error is shown; user remains anonymous; no progress/profile data leaks. |
| LOGIN-04 | P0 | Login with unknown email/login. | Error is shown; user remains anonymous. |
| LOGIN-05 | P1 | Login with uppercase email for an existing lowercase email account. | Login succeeds if normalization policy applies. |
| LOGIN-06 | P1 | Login while network is slow. | Busy state is visible; controls are disabled enough to prevent duplicate submits. |
| LOGIN-07 | P1 | Login API returns malformed or non-JSON error. | App shows generic readable error and does not crash. |
| LOGIN-08 | P2 | Browser autofill fills username/password. | Labels, autocomplete, submit, and layout still work on mobile and desktop. |

### 4. Logout And Session End

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| LOGOUT-01 | P0 | Logout from desktop sidebar on `/program`. | Backend session is cleared; UI returns to anonymous entry screen; progress/profile state is cleared client-side. |
| LOGOUT-02 | P0 | Logout from mobile profile. | User returns to anonymous entry screen; bottom nav disappears. |
| LOGOUT-03 | P0 | Logout from `/profile`. | User is redirected to `/`; private answers are no longer visible. |
| LOGOUT-04 | P1 | Logout API fails. | User remains authenticated; readable error is shown near the relevant logout surface. |
| LOGOUT-05 | P1 | Press browser Back after logout. | Authenticated pages do not reappear with private data from memory. |
| LOGOUT-06 | P1 | Session expires while on a lesson. | Progress/reflection save failures are handled; stale private state is cleared where applicable. |

### 5. Authenticated App Shell

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| SHELL-01 | P0 | Desktop authenticated `/program`. | Fixed left sidebar is visible with FinPulse brand, `Обучение`, `Профиль`, user login, and logout. |
| SHELL-02 | P0 | Mobile authenticated `/program`. | Bottom navigation shows `Обучение` and `Профиль`; no desktop sidebar. |
| SHELL-03 | P0 | Mobile authenticated lesson route. | Bottom navigation is hidden so it does not collide with the lesson bottom CTA. |
| SHELL-04 | P1 | Active route states for `/program`, module, lesson, and `/profile`. | Correct navigation item is marked active on desktop and mobile. |
| SHELL-05 | P1 | Very long email/login in sidebar/profile. | Text truncates or wraps without breaking layout. |
| SHELL-06 | P1 | Keyboard-only traversal through sidebar/bottom nav. | Focus order is logical; visible focus rings are present. |
| SHELL-07 | P1 | Resize from mobile to desktop while authenticated. | Navigation switches cleanly; no duplicate controls or stale spacing. |

### 6. Program Overview

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| PROGRAM-01 | P0 | Open `/program` authenticated with no progress. | Program/module list renders from API; first module is available; progress starts at zero. |
| PROGRAM-02 | P0 | Open `/program` with partial progress. | Module card reflects completed/active state and current step accurately. |
| PROGRAM-03 | P0 | Open `/program` with completed current module. | Module completion state and transition options are accurate. |
| PROGRAM-04 | P1 | `GET /api/program` fails. | Error state is readable and does not break the shell. |
| PROGRAM-05 | P1 | Program has no modules in a controlled fixture/test. | Empty state is shown gracefully. |
| PROGRAM-06 | P1 | Click module card. | User navigates to `/modules/<moduleSlug>`. |
| PROGRAM-07 | P2 | Browser Back from module to program. | Program state and scroll position behave acceptably; no extra API errors. |

### 7. Module And Unit Learning Path

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| PATH-01 | P0 | Open `/modules/financial-goals` with no progress. | Sections render in unit order; first lesson is current; later lessons are visually locked/guided. |
| PATH-02 | P0 | Open module with partial progress. | Completed lesson nodes show completed state; the next incomplete lesson is current. |
| PATH-03 | P0 | Open module with all lessons complete. | Module is complete and transition card is shown. |
| PATH-04 | P0 | Open a current lesson node dialog and choose primary action. | Dialog shows title/duration; action navigates to the lesson. |
| PATH-05 | P0 | Open a locked lesson node. | Dialog explains it is unavailable and primary action is disabled. |
| PATH-06 | P1 | Open a completed lesson node. | Dialog offers repeat/open action; route opens the lesson. |
| PATH-07 | P1 | Close dialog with `Не сейчас`, Esc, backdrop, and close button if available. | Focus returns to the triggering node; no navigation occurs. |
| PATH-08 | P1 | Scroll through module sections. | Sticky header updates current section context and title. |
| PATH-09 | P1 | Open `/modules/financial-goals/units/values-and-goals`. | Unit path renders only the unit section and back link returns to module. |
| PATH-10 | P1 | Open unit URL with mismatched module slug. | App redirects to canonical module/unit URL. |
| PATH-11 | P1 | Open invalid module slug. | Graceful "module could not load" state is shown. |
| PATH-12 | P1 | Open invalid unit slug. | Graceful "unit could not load" state is shown. |
| PATH-13 | P1 | Module API succeeds but program API for transition card fails. | Main module path still works; transition area does not crash. |
| PATH-14 | P2 | Ensure learner-facing section titles do not show redundant numeric codes. | Titles are clean while internal order remains correct. |

### 8. Lesson Reader Core Flow

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| LESSON-01 | P0 | Open `/lessons/why-values-matter`. | Lesson details load; progress header, context, first card, and sticky bottom action render. |
| LESSON-02 | P0 | Complete a lesson from first card through final card. | Cards advance in order; last action completes lesson; completion screen appears. |
| LESSON-03 | P0 | Use `Назад` inside a lesson after advancing. | Reader returns to previous card without losing current in-session interaction state. |
| LESSON-04 | P0 | Complete final card with authenticated user. | Card and lesson completion are persisted before completion UI relies on saved state. |
| LESSON-05 | P0 | Finish a lesson that has a next lesson. | Completion screen offers `Следующий урок` and navigates correctly. |
| LESSON-06 | P0 | Finish final current runtime lesson. | Completion screen offers return to module/program path instead of broken next lesson. |
| LESSON-07 | P1 | Open invalid lesson slug. | Graceful "lesson could not load" state is shown. |
| LESSON-08 | P1 | Lesson API is slow. | Loading state appears; no empty/broken card frame flashes. |
| LESSON-09 | P1 | Lesson API fails. | Error state is shown and shell remains usable. |
| LESSON-10 | P1 | Browser refresh mid-lesson. | Route reloads cleanly; saved progress remains; no crash even if active card restarts. |
| LESSON-11 | P1 | Click header back-to-module from lesson. | User returns to the owning module path. |
| LESSON-12 | P1 | Reader with zero cards in controlled fixture/test. | Empty lesson state is readable and non-crashing. |
| LESSON-13 | P1 | Bottom CTA on mobile with browser safe area. | CTA remains reachable and does not cover card content. |
| LESSON-14 | P2 | Motion-reduced environment. | Animated badges/transitions do not block usability. |

### 9. Lesson Card Types

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| CARD-THEORY-01 | P0 | Render theory card with body and examples. | Text is readable, ordered content is preserved, no raw HTML is injected. |
| CARD-VIDEO-01 | P0 | Render supported RUTUBE embed URL. | Inline video frame appears with title; fallback source link remains visible. |
| CARD-VIDEO-02 | P1 | Use video timecode buttons. | Buttons update the embedded video/timecode or navigate without breaking the card. |
| CARD-VIDEO-03 | P1 | Render unsupported video URL in fixture/test. | App falls back to external source link without an iframe crash. |
| CARD-CALLOUT-01 | P1 | Render callout tones. | Tone styling is readable and accessible. |
| CARD-CHOICE-01 | P0 | Single-choice/scenario with objective answer, no selected option. | `Проверить` is disabled until an option is selected. |
| CARD-CHOICE-02 | P0 | Select option and check correct answer. | Feedback appears in sticky feedback area; correct tone/copy is shown; `Далее` becomes available. |
| CARD-CHOICE-03 | P0 | Select option and check incorrect answer. | Feedback identifies better answer or guidance; user can continue if product allows. |
| CARD-CHOICE-04 | P1 | Change selected option before checking. | Previous pending selection updates; feedback is not stale. |
| CARD-CHOICE-05 | P1 | Choice card without objective answer. | Selection can be accepted and feedback is neutral. |
| CARD-REFLECT-01 | P0 | Reflection text/select card starts empty. | Primary action is disabled until meaningful input exists. |
| CARD-REFLECT-02 | P0 | Fill reflection and continue authenticated. | Answer is saved before card completion is marked; errors block advancement. |
| CARD-REFLECT-03 | P1 | Clear reflection input after filling. | Primary action disables again; empty answer is not saved. |
| CARD-ARTIFACT-01 | P0 | Artifact/template card starts empty. | Primary action is disabled until required meaningful fields are filled. |
| CARD-ARTIFACT-02 | P0 | Fill artifact values and continue authenticated. | Private artifact answer is saved and card completion is persisted. |
| CARD-ARTIFACT-03 | P1 | Fill only whitespace. | Treated as empty; cannot continue/save. |
| CARD-CHECKLIST-01 | P1 | Toggle checklist rows. | Toggle state updates without layout shift; card can advance according to current rule. |
| CARD-SUMMARY-01 | P0 | Summary card as last card. | Final CTA completes lesson; summary points remain readable. |
| CARD-READONLY-01 | P1 | Read-only interactive card in fixture/test. | Renders static content and does not require interaction or answer persistence. |

### 10. Progress Persistence

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| PROGRESS-01 | P0 | Authenticated user opens a lesson. | `viewed` lesson progress is saved once per route open. |
| PROGRESS-02 | P0 | Authenticated user views each card. | `viewed` card progress is saved; duplicate StrictMode writes are guarded. |
| PROGRESS-03 | P0 | Authenticated user completes a card. | Card `completed` marker is saved. |
| PROGRESS-04 | P0 | Authenticated user completes a lesson. | Lesson `completed` marker is saved. |
| PROGRESS-05 | P0 | Reload after progress writes. | Program/module/profile stats reflect persisted progress. |
| PROGRESS-06 | P0 | Logout and login again as same user. | Same progress returns from backend. |
| PROGRESS-07 | P0 | Login as second user. | First user's progress is not visible. |
| PROGRESS-08 | P0 | Anonymous user reads/opens content if allowed by route contract. | No progress API writes are attempted; progress does not persist. |
| PROGRESS-09 | P1 | Progress write returns 401 mid-session. | App clears or ignores stale progress safely; private data does not leak. |
| PROGRESS-10 | P1 | Progress write returns 400/404. | Readable error banner appears; app does not mark impossible content as saved. |
| PROGRESS-11 | P1 | Progress API temporarily offline. | User can see an error; no infinite loading or repeated write loop. |
| PROGRESS-12 | P2 | Mark already completed card/lesson again. | Operation remains idempotent; timestamps/state stay valid. |

### 11. Private Answers And Profile

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| PROFILE-01 | P0 | Open `/profile` as authenticated new learner. | Profile identity area, empty private answers state, and zero progress stats render. |
| PROFILE-02 | P0 | Save one reflection answer, then open `/profile`. | Answer appears under `Мой финансовый ориентир` in the correct grouping. |
| PROFILE-03 | P0 | Save one artifact/template answer, then open `/profile`. | Template rows are displayed with labels and saved values. |
| PROFILE-04 | P0 | Save answers in values, goals/future, and motivation units. | Answers group under `Ценности`, `Цели и образ будущего`, and `Мотивация`. |
| PROFILE-05 | P0 | Login as second user after first user saved answers. | Second user cannot see first user's answers. |
| PROFILE-06 | P0 | Logout after viewing profile. | Private answers disappear from UI and cannot be reached with Back/reload. |
| PROFILE-07 | P1 | Update an existing answer by completing same card again with new input. | Profile shows the latest saved answer without duplicate card rows. |
| PROFILE-08 | P1 | Very long answer text. | Text wraps, preserves line breaks where expected, and does not overflow mobile or desktop. |
| PROFILE-09 | P1 | Answer contains HTML/script-like text. | It is displayed as text, not executed or interpreted. |
| PROFILE-10 | P1 | Profile program fetch fails. | Identity and answers remain visible; progress stats show safe fallback/error. |
| PROFILE-11 | P1 | Created-at date is invalid/missing in fixture/test. | Profile shows safe fallback instead of crashing. |
| PROFILE-12 | P1 | Profile ID is long. | ID is shortened; full layout remains stable. |
| PROFILE-13 | P2 | No reflection answers but non-zero progress. | Empty answers state and progress stats both render correctly. |

### 12. Responsive Layout And Visual Integrity

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| RESP-01 | P0 | M-360 auth screen. | No horizontal overflow; form controls fit; touch targets are comfortable. |
| RESP-02 | P0 | M-360 module path. | Lesson nodes, sticky header, and dialogs fit without clipping critical text. |
| RESP-03 | P0 | M-360 lesson reader. | Card content and sticky CTA do not overlap; text remains readable. |
| RESP-04 | P0 | M-360 profile. | Avatar/header, answer cards, stat cards, and logout fit without overflow. |
| RESP-05 | P0 | D-1440 authenticated shell. | Sidebar is fixed; main content is centered and not hidden under sidebar. |
| RESP-06 | P1 | D-1024 shell and module path. | Desktop layout remains usable at small desktop width. |
| RESP-07 | P1 | M-430 with browser safe-area. | Bottom nav/CTA respect safe-area and remain tappable. |
| RESP-08 | P1 | Rotate mobile portrait/landscape. | Layout recalculates without stuck overlays. |
| RESP-09 | P1 | Text scaling/browser zoom 125-200%. | Content remains readable; no destructive overlap. |
| RESP-10 | P1 | Long Russian section/lesson titles. | Headings wrap cleanly; buttons and dialogs do not clip important text. |
| RESP-11 | P2 | Visual snapshot comparison for key screens. | No unintended major shifts in auth, program, module, lesson, profile. |

### 13. Accessibility And Keyboard

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| A11Y-01 | P0 | Auth form labels and errors. | Inputs have accessible labels; errors are reachable/readable. |
| A11Y-02 | P0 | Keyboard registration/login. | Tab order reaches fields and buttons; Enter submits expected action. |
| A11Y-03 | P0 | Keyboard desktop sidebar and mobile nav. | All nav actions are reachable with visible focus. |
| A11Y-04 | P0 | Lesson node dialog with keyboard. | Dialog opens, traps focus, announces title/description, closes with Esc, restores focus. |
| A11Y-05 | P0 | Lesson reader primary/secondary actions with keyboard. | User can complete a lesson without pointer input. |
| A11Y-06 | P1 | Screen reader names for lesson nodes. | Names include lesson title and state. |
| A11Y-07 | P1 | Color contrast for feedback, locked/current/completed nodes, errors. | Text and controls meet readable contrast targets. |
| A11Y-08 | P1 | Reduced motion preference. | Animations are disabled or non-essential. |
| A11Y-09 | P1 | Semantic headings on program/module/lesson/profile. | Each route has a logical heading structure. |
| A11Y-10 | P1 | Touch target audit. | Primary buttons, nav items, lesson nodes, and dialog controls are at least comfortable mobile targets. |

### 14. API, Errors, And Data Boundaries

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| API-01 | P0 | Content endpoints return program/module/unit/lesson data. | UI consumes backend API, not direct runtime JSON imports. |
| API-02 | P0 | Auth/progress/reflection endpoints without cookie. | Protected endpoints return 401; no private data is returned. |
| API-03 | P0 | Progress/reflection writes use stable lesson slug/card id only. | No parallel content schema or mutable content copy is created. |
| API-04 | P0 | Reflection save for non-reflection/non-artifact card. | Backend rejects as non-persistable. |
| API-05 | P0 | Reflection save with empty payload. | Backend rejects; UI does not advance. |
| API-06 | P0 | Reflection/progress save for unknown card/lesson. | Backend returns not found; UI shows safe error. |
| API-07 | P0 | Cross-user cookie/session isolation. | User A cannot fetch or mutate User B's progress/answers. |
| API-08 | P1 | Local direct API base URL with loopback origin. | CORS permits local development origins and progress PUT preflight. |
| API-09 | P1 | Malformed server payload in test harness. | Frontend shows generic error or fails safely; no blank app. |
| API-10 | P1 | DB/API restart during session. | App recovers with reload/login or clear error; no private stale data. |
| API-11 | P1 | SQL/script-like strings in login or answers. | Stored/returned safely; no injection, script execution, or broken layout. |

### 15. Browser Navigation And Routing

| ID | Priority | Scenario | Expected Result |
|---|---|---|---|
| ROUTE-01 | P0 | Browser Back/Forward across auth -> program -> module -> lesson. | History behaves predictably and does not resurrect private data after logout. |
| ROUTE-02 | P0 | Direct open all primary authenticated routes. | `/program`, `/profile`, module, unit, and lesson routes load or redirect gracefully. |
| ROUTE-03 | P1 | Unknown authenticated route. | Redirects to `/program` or accepted fallback. |
| ROUTE-04 | P1 | Unknown anonymous route. | Shows anonymous entry or accepted public-content fallback. |
| ROUTE-05 | P1 | Open lesson from module dialog, then Back. | User returns to module context without broken dialog state. |
| ROUTE-06 | P1 | Open next lesson from completion screen, then Back. | Previous completion screen or lesson route behaves acceptably without duplicate writes. |

## Full End-To-End Critical Paths

### E2E-P0-01 — New Learner Registration To First Saved Progress

1. Open `/` on M-390.
2. Register a new email user.
3. Confirm `/program` opens and authenticated mobile nav appears.
4. Open module `financial-goals`.
5. Open the first current lesson from the lesson node dialog.
6. Complete all cards in `why-values-matter`, including video, choice, reflection, and summary.
7. Confirm completion screen and next lesson action.
8. Open `/profile`.
9. Confirm viewed/completed stats and saved reflection answer.
10. Refresh `/profile` and confirm data persists.

Run the same path on D-1440, verifying desktop sidebar and no bottom mobile nav.

### E2E-P0-02 — Returning Learner Continues Learning

1. Login as a learner with partial progress.
2. Open `/program`.
3. Confirm current module/current lesson reflect saved progress.
4. Continue from the module path.
5. Complete a reflection/artifact-heavy lesson such as `values-conflict`.
6. Confirm profile answer grouping and progress stats update.
7. Logout.
8. Login again and confirm progress and answers persist.

### E2E-P0-03 — Privacy Isolation

1. User A registers, completes a lesson, and saves at least one private answer.
2. User A logs out.
3. User B registers or logs in.
4. User B opens `/profile`.
5. Confirm User B sees no User A progress or private answers.
6. User B creates their own progress/answers.
7. User A logs back in and sees only User A data.

### E2E-P0-04 — Full Current Module Traversal

1. Start with a clean authenticated learner.
2. Traverse all current runtime lessons in order.
3. Exercise every card type encountered.
4. Confirm each section becomes completed/current in order.
5. Confirm final module completion state.
6. Confirm profile stats match the number of completed lessons/cards.
7. Confirm private answers are grouped and latest values are shown.

## Recommended Automation Split

| Layer | Coverage |
|---|---|
| Unit/component tests | Auth form behavior, card interaction state, primary CTA enablement, profile grouping, progress selectors, learning path state. |
| Backend integration tests | Auth register/login/logout/me, protected endpoints, progress idempotency, reflection validation, user isolation, content not found. |
| App integration tests | Route rendering, authenticated shell, module path, lesson completion callbacks, profile rendering. |
| Browser E2E | P0 end-to-end paths on M-390 and D-1440, plus selected error/session scenarios. |
| Visual/responsive checks | Auth, program, module path, lesson reader, dialog, completion screen, profile on M-360, M-390, D-1024, D-1440. |
| Accessibility checks | Keyboard-only route traversal, dialogs, form labels/errors, screen-reader names, focus restoration, reduced motion. |

## Release Smoke Checklist

Run before merging user-visible changes:

- [ ] Register a new email learner on mobile.
- [ ] Login as returning learner on desktop.
- [ ] Logout on mobile and desktop.
- [ ] Open `/program`, module path, unit path, and at least one lesson.
- [ ] Complete a lesson with choice, reflection, artifact/checklist if present, and summary cards.
- [ ] Confirm progress persists after reload.
- [ ] Confirm profile shows identity, stats, empty or saved private answers.
- [ ] Confirm two-user privacy isolation for progress and private answers.
- [ ] Check M-360 no horizontal overflow for auth, module, lesson, profile.
- [ ] Check desktop sidebar layout at D-1440.
- [ ] Run `npm run verify`.
