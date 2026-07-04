# T-165 Screenshot Baseline - Learner/Admin Preview Parity

Date: 2026-06-30

Scope: current local rendered state only. No application code, content JSON,
package files, project docs, or task files were intentionally changed.

## Server Assumptions

- Existing local listeners were present on `localhost:5173`, `localhost:3002`,
  and `127.0.0.1:3001`.
- Admin `/content` was already authenticated as `codex-admin@example.com`.
- The in-app browser already had a learner session on `localhost`; walking
  lesson cards there would mark progress in the local DB. Learner card-walk
  screenshots were therefore taken from a temporary Vite server at
  `http://127.0.0.1:5174/lessons/where-money-goes` using the same app code.
- `http://127.0.0.1:5173` was refused by the current Vite listener, so it was
  not usable for unauthenticated learner capture.
- Temporary Vite server `127.0.0.1:5174` was stopped after capture.

## Screenshot Matrix

All screenshots are in
`harness/artifacts/T-165-admin-preview-shell/screenshots/before/`.

### Learner

| State | Desktop 1024x1365 | Tablet 768x1024 | Mobile 390x844 |
|---|---|---|---|
| First screen / single choice | `learner-desktop-01-first-single-choice.png` | `learner-tablet-01-first-single-choice.png` | `learner-mobile-01-first-single-choice.png` |
| Ordinary theory card | `learner-desktop-02-theory.png` | `learner-tablet-02-theory.png` | `learner-mobile-02-theory.png` |
| Categorization start | `learner-desktop-03-categorization.png` | `learner-tablet-03-categorization.png` | `learner-mobile-03-categorization.png` |
| Artifact empty | `learner-desktop-05-artifact.png` | `learner-tablet-05-artifact.png` | `learner-mobile-05-artifact.png` |
| Reflection empty | `learner-desktop-06-reflection.png` | `learner-tablet-06-reflection.png` | `learner-mobile-06-reflection.png` |
| Summary | `learner-desktop-08-summary.png` | `learner-tablet-08-summary.png` | `learner-mobile-08-summary.png` |

### Admin

| State | Desktop 1024x1365 | Tablet 768x1024 | Mobile 390x844 |
|---|---|---|---|
| Level preview | `admin-desktop-level.png` | `admin-tablet-level.png` | `admin-mobile-level.png` |
| Section preview | `admin-desktop-section.png` | `admin-tablet-section.png` | `admin-mobile-section.png` |
| Card 01 single choice | `admin-desktop-card-01-single-choice.png` | `admin-tablet-card-01-single-choice.png` | `admin-mobile-card-01-single-choice.png` |
| Card 02 theory | `admin-desktop-card-02-theory.png` | `admin-tablet-card-02-theory.png` | `admin-mobile-card-02-theory.png` |
| Card 03 categorization | `admin-desktop-card-03-categorization.png` | `admin-tablet-card-03-categorization.png` | `admin-mobile-card-03-categorization.png` |
| Card 05 artifact | `admin-desktop-card-05-artifact.png` | `admin-tablet-card-05-artifact.png` | `admin-mobile-card-05-artifact.png` |
| Card 06 reflection | `admin-desktop-card-06-reflection.png` | `admin-tablet-card-06-reflection.png` | `admin-mobile-card-06-reflection.png` |
| Card 08 summary | `admin-desktop-card-08-summary.png` | `admin-tablet-card-08-summary.png` | `admin-mobile-card-08-summary.png` |
| Invalid JSON validation | `admin-desktop-validation-invalid-json.png` | not captured | not captured |

## Visible Mismatches

| Area | Evidence | Mismatch |
|---|---|---|
| Admin desktop 1024 layout | `admin-desktop-card-02-theory.png`, `admin-desktop-card-03-categorization.png` | The admin 3-column editor is wider than the 1024px viewport. The live preview pane is cut off on the right, so only part of the learner preview is visible. Learner desktop screenshots do not have this horizontal crop. |
| Admin tablet/mobile preview access | `admin-tablet-card-05-artifact.png`, `admin-mobile-card-08-summary.png` | The stacked admin layout puts the tree and JSON editor before the preview. A selected card preview is not visible in the first viewport and needs scrolling before it can be inspected. |
| Embedded preview vertical framing | `admin-mobile-card-01-single-choice.png`, `admin-tablet-card-05-artifact.png` | The admin embedded lesson screen shows only a partial learner viewport in one screenshot. On mobile, card 01 shows header/goal/action but the card body is mostly out of view; on tablet, the bottom action overlays the lower part of the embedded card. |
| Lesson-level admin selection | Admin content tree screenshots | The admin tree has level, section, and card selection. There is no separate lesson-level preview state to capture. |
| Content/text parity | Sampled learner/admin card pairs | No confirmed text-content mismatch in sampled visible portions. The observed mismatches are layout/framing/visibility issues around the reused production preview. |

## Commands / Browser APIs Run

- `sed -n ...` on required project docs and relevant renderer/editor files.
- `lsof -nP -iTCP:5173 -iTCP:3002 -iTCP:3001 -iTCP:3011 -sTCP:LISTEN`
- `git status --short`
- `npm run dev:web -- --host 127.0.0.1 --port 5174`
- In-app Browser API: named session, viewport set/reset, `tab.goto`,
  `domSnapshot`, `tab.dev.logs`, locator clicks/fills, `tab.screenshot`.
- `find harness/artifacts/T-165-admin-preview-shell/screenshots/before -type f`
- `file harness/artifacts/T-165-admin-preview-shell/screenshots/before/*.png`

## Checks

- Initial learner/admin probes: page identity, nonblank DOM, no framework
  overlay, no console warnings/errors.
- Final validation capture: no console warnings/errors.
- Screenshot file count verified: 43 files.
- Temporary learner server stopped; `5174` no longer listens.

## Risks

- The worktree was already dirty and continued changing during capture
  according to Vite HMR output. This baseline represents the current local
  workspace state at capture time, not a clean `main`.
- Browser capture batches timed out twice while writing screenshots; the missing
  files were resumed in smaller batches and the final file count was verified.
- Screenshots have `.png` filenames, but the Browser runtime emitted JPEG image
  bytes.
- The invalid JSON validation screenshot uses an unsaved local textarea edit
  only. No publish action was clicked.
