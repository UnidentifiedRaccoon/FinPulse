# T-165 After QA - Admin Preview Lesson Shell Parity

Date: 2026-06-30

## Summary

The admin card preview now renders the shared production lesson screen shell
instead of a card-only preview frame. The preview includes the learner header,
lesson goal, production card frame/renderer, and sticky bottom action. Admin
chrome still surrounds the preview, but the learning screen inside the preview
uses the same React components and shared learner CSS source as the learner app.

## Screenshot Matrix

All after screenshots are in
`harness/artifacts/T-165-admin-preview-shell/screenshots/after/`.

Captured:
- Learner first/single-choice, theory, categorization, scenario, artifact,
  reflection, rule artifact, and summary screens across desktop `1024x1365`,
  tablet `768x1024`, and mobile `390x844`.
- Admin level, section, card 01, 02, 03, 04, 05, 06, 07, and 08 previews
  across the same viewports.
- Admin invalid JSON validation state on desktop.

Screenshot count:
- Before: 43 files.
- After: 55 files.

## DOM / Component Parity

Verified in the in-app Browser at mobile `390x844`:

| Signal | Learner | Admin preview |
|---|---:|---:|
| Shared lesson `article` class | yes | yes |
| Production header | yes | yes |
| Lesson goal card | yes | yes |
| Production lesson card section | yes | yes |
| Production bottom action | yes | yes |
| Card border radius | `20px` | `20px` |
| Card shadow | `rgba(18, 52, 89, 0.08) 0px 8px 24px` | same |
| Article background | `rgb(247, 251, 255)` | same |
| Document horizontal overflow at 390px | none | none |
| Old admin preview frames | n/a | absent |

Removed old admin-only preview frame classes:
- `.admin-production-screen`
- `.admin-production-card-stage`
- `.admin-phone-preview`
- `.admin-lesson-card-preview`

## Before / After Mismatches

| Baseline issue | After state |
|---|---|
| Admin preview rendered only `LessonCardFrame` + `LessonCardRenderer`. | Admin preview renders shared `LessonScreenShell`, which itself composes `LessonProgressHeader`, `LessonGoalCard`, `LessonCardFrame`, `LessonCardRenderer`, and `LessonBottomAction`. |
| Admin had a custom preview frame around the card. | Removed; only a neutral `.admin-production-preview` host remains inside the editor panel. |
| Admin CSS duplicated a partial learner token/animation set. | Added shared `src/styles/lesson-reader.css` and import it from both learner and admin CSS entrypoints. |
| 1024px admin editor cropped the preview horizontally. | `documentElement.scrollWidth === viewportWidth` at `1024` and `390`; editor uses a responsive 2-column/full-preview layout at medium widths. |
| First learner screen elements were missing in admin card preview. | Card 01 admin preview shows progress/header, lesson goal, production card, and bottom action. |

## Remaining Differences

Allowed:
- Admin still has editor chrome: tree, JSON textarea, panel headings, and scroll
  position are not part of the learner screen.
- Admin preview bottom action is read-only/no-op and may be disabled when the
  current card requires learner input. It uses the same production
  `LessonBottomAction` component and action-label helper.
- Level and section previews remain lightweight admin previews because the
  parity goal applies to lesson/card preview.

No known remaining structural or visual mismatch inside the learning screen
itself.

## Browser QA

Browser path: in-app Browser plugin.

Checks:
- Admin `/content`: page identity, nonblank DOM, no framework overlay, no
  console warnings/errors in sampled after checks.
- Learner `/lessons/where-money-goes`: page identity, nonblank DOM, no
  framework overlay, no console warnings/errors in sampled after checks.
- Real learner interactions were used to reach later cards:
  single-choice selection, categorization answers/check, scenario answer/check,
  artifact text fields, reflection option, rule artifact option, and summary.
- Admin tree interactions selected each captured card preview.

## Artifact Notes

The baseline subagent observed that the Browser runtime emitted JPEG image bytes
despite `.png` filenames. The after capture used the same screenshot mechanism.
