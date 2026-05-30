# T-026 — UI noise cleanup

Status: review

## Goal

Clean the learner SPA UI in a balanced way: remove repeated visible labels, decorative CTA icons, and noisy helper/status text while preserving accessibility, keyboard navigation, route/API/content contracts, and key learning guidance.

## Intended write set

- `src/pages/EntryPage.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- `src/pages/ModulePage.tsx`
- `src/pages/UnitPage.tsx`
- `src/features/auth/AuthControls.tsx`
- `src/features/program-navigation/ModulePathNode.tsx`
- `src/features/program-navigation/LessonPathMap.tsx`
- `src/features/program-navigation/PathProgressSummary.tsx`
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonCardFrame.tsx`
- `src/features/lesson-reader/LessonBottomAction.tsx`
- `src/features/lesson-reader/card-renderers/ChoiceCard.tsx`
- `src/features/lesson-reader/card-renderers/ReflectionCard.tsx`
- `src/features/lesson-reader/card-renderers/ChecklistCard.tsx`
- `src/features/lesson-reader/card-renderers/ArtifactCard.tsx`
- `src/components/ui/dialog.tsx`
- `src/App.test.tsx`
- `src/features/lesson-reader/LessonCardRenderer.test.tsx`
- `harness/tasks/{active,review}/T-026-ui-noise-cleanup.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md`

## Result

- Removed decorative CTA/auth/card-type/meta icons and repeated visible labels from entry, program, module/unit path, lesson dialog, and lesson reader surfaces.
- Simplified progress summaries and removed fallback path cards/buttons that did not lead to available content.
- Kept accessible names, semantic headings, progressbar ARIA, focus states, and icon-only back/close controls.
- Hid empty/local-draft status text until user action while preserving `aria-live` status nodes.
- Fixed mobile overflow from long authenticated user identifiers in the entry welcome heading.

## Verification

- `npm run test:run -- src/App.test.tsx src/features/lesson-reader/LessonCardRenderer.test.tsx src/features/auth/AuthControls.test.tsx`
- `npm run verify`
- Browser smoke at `390px` on `/`, `/program`, `/modules/financial-goals`, `/lessons/why-values-matter`: no console errors, no horizontal overflow, navigation reachable.
- Browser interaction smoke on `/lessons/why-values-matter`: selected the first choice, checked feedback, saw the sticky `Верно` feedback and `Далее` action.
- Browser screenshot capture succeeded after the cleanup pass.
