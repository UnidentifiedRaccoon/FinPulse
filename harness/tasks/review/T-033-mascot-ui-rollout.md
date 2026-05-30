# T-033 - Mascot UI rollout

Status: review
Owner: Codex orchestrator
Model: GPT-5.5 / xhigh required by project policy
Started: 2026-05-30
Branch/worktree: main

## Goal

Introduce the approved FinPulse mascot into appropriate learner UI states as a calm financial navigator, without adding gamification, rewards, streaks, diagnostics, analytics, or backend scope.

## Context

Read before starting:
- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/MASCOT.md`
- `harness/PARALLEL_AGENT_PROTOCOL.md`

The mascot guidance originally blocked UI implementation until an approved production mascot asset was available in the repo or supplied attachments with public-use rights confirmed. The user supplied `/Users/elena/Downloads/maskot.png` and described it as their mascot; this task treats that file as the approved source asset for the rollout.

## Intended write set

Foundation:
- `public/assets/mascot/**`
- `src/shared/ui/Mascot.tsx`
- `docs/MASCOT.md`
- possible focused tests/stories for `Mascot`

Entry and overview:
- `src/pages/EntryPage.tsx`
- `src/pages/ProgramOverviewPage.tsx`
- possible focused tests/stories for those surfaces

Module map and transitions:
- `src/pages/ModulePage.tsx`
- `src/features/program-navigation/LessonPathMap.tsx`
- possible story files for program navigation

Lesson reader and feedback:
- `src/features/lesson-reader/LessonSession.tsx`
- `src/features/lesson-reader/LessonFeedback.tsx`
- possible related tests/stories

Harness:
- `harness/tasks/review/T-033-mascot-ui-rollout.md`
- `harness/WORKBOARD.md`
- `harness/PROJECT_STATE.md` only if project state changes

## Out-of-scope

- Generating, redrawing, or substituting a production mascot asset without explicit user approval.
- Changing content JSON or backend/API contracts.
- Adding gamification, points, coins, streaks, reward pressure, diagnostics, analytics, recommendations, accounts, or admin scope.
- Reworking broad layout architecture beyond mascot integration.

## Planned subagent split

Subagent A - Mascot foundation:
- check approved asset availability and rights;
- add the asset under `public/assets/mascot/`;
- create typed `Mascot` component with `size`, `variant/context`, `className`, and decorative/alt support.

Subagent B - Entry and program overview:
- add `Mascot` to session checking, unauthenticated entry, authenticated welcome, and overview route guidance states.

Subagent C - Module map and transitions:
- add small guide cue to module/path context, lesson dialog, transition card, and empty path state without blocking lesson nodes.

Subagent D - Lesson reader and feedback:
- add `Mascot` to lesson intro, completion, empty cards, and only supportive feedback states without disturbing `aria-live`.

Subagent E - Verifier:
- review diff for scope creep;
- run `./scripts/verify.sh` or `npm run verify`;
- run browser/mobile smoke if UI changes are made.

## Asset resolution

Approved source asset:
- `/Users/elena/Downloads/maskot.png`

Repository assets:
- `public/assets/mascot/finpulse-mascot-source.png` keeps a transparent 1254px source copy derived from the supplied export.
- `public/assets/mascot/finpulse-mascot.png` is a transparent 640px runtime PNG used by the app.

Notes:
- `sips` on this machine can read WebP but cannot write WebP, so the runtime export is PNG instead of WebP.
- The supplied PNG had a visible white background. The repository PNGs were regenerated locally with an edge-connected alpha mask from `/Users/elena/Downloads/maskot.png`, preserving the mascot details and soft ground shadow without a generative redraw.

## Checks

- [x] Required project context read
- [x] Asset availability check
- [x] UI implementation
- [x] `npm run verify`
- [x] browser/mobile smoke

## Subagent result packets

Subagent A - Mascot foundation:
- Files changed: `public/assets/mascot/finpulse-mascot-source.png`, `public/assets/mascot/finpulse-mascot.png`, `src/shared/ui/Mascot.tsx`, `docs/MASCOT.md`
- Checks run: asset file/type check, `npm run verify`
- Risks: runtime asset is transparent PNG, not native WebP/SVG from the original design source
- Next step: replace runtime PNG with native transparent WebP/SVG later if a cleaner production export is supplied

Subagent B - Entry and program overview:
- Files changed: `src/pages/EntryPage.tsx`, `src/pages/ProgramOverviewPage.tsx`
- Checks run: `npm run verify`, Browser smoke on `/` and `/program`
- Risks: none beyond existing auth/session state
- Next step: keep copy calm and next-step oriented during future entry polish

Subagent C - Module map and transitions:
- Files changed: `src/pages/ModulePage.tsx`, `src/features/program-navigation/LessonPathMap.tsx`
- Checks run: `npm run verify`, Browser smoke on `/modules/financial-goals` and lesson dialog at 390px
- Risks: none observed; lesson nodes remained clickable
- Next step: revisit exact placement if a transparent asset replaces the current PNG

Subagent D - Lesson reader and feedback:
- Files changed: `src/features/lesson-reader/LessonSession.tsx`, `src/features/lesson-reader/LessonFeedback.tsx`
- Checks run: `npm run verify`, Browser smoke on lesson intro, correct feedback, and completion at 390px
- Risks: mascot appears only for `correct` and `info` feedback tones, intentionally absent for retry-style feedback
- Next step: keep `aria-live` feedback text independent from mascot visuals

Subagent E - Verifier:
- Files changed: `harness/tasks/review/T-033-mascot-ui-rollout.md`, `harness/WORKBOARD.md`, `harness/PROJECT_STATE.md`
- Checks run: `npm run verify`; Browser smoke on desktop `/program`, mobile entry, module map, lesson dialog, lesson intro, correct feedback, and completion; transparent mascot preview on checker, sky, green, and dark backgrounds; local Chrome screenshots after Browser screenshot capture timed out
- Risks: formal external license file is not present; rights are inferred from the user-supplied "my mascot" asset
- Next step: commit/publish only after coordinating with concurrent active tasks T-036 and T-037

## Result packet

- Files changed: `public/assets/mascot/**`, `src/shared/ui/Mascot.tsx`, `docs/MASCOT.md`, `src/pages/EntryPage.tsx`, `src/pages/ProgramOverviewPage.tsx`, `src/pages/ModulePage.tsx`, `src/features/program-navigation/LessonPathMap.tsx`, `src/features/lesson-reader/LessonSession.tsx`, `src/features/lesson-reader/LessonFeedback.tsx`, `harness/**`
- Checks run: `npm run verify`; Browser desktop/mobile smoke with asset loading, console health, dialog interaction, lesson feedback, completion, and no horizontal overflow at 390px; local Chrome screenshot capture for visual evidence
- Risks: runtime mascot is transparent PNG generated by local masking, not native WebP/SVG from the design source
- Follow-up: replace `public/assets/mascot/finpulse-mascot.png` with a native transparent optimized production export if supplied
