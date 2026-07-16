# Workboard

This is the human priority and decision board. Task files are the lifecycle
source of truth; run `npm run harness:status` for the derived lane summary.
Do not copy task result packets or check logs here.

## Current work

Active claims are derived from `harness/tasks/active/`; run
`npm run harness:status`. Do not duplicate them in this file.

## Human decision queue

- T-186 / screen model — review recommended Model B and decide whether a
  voluntary screen-6 reflection is ephemeral or saved only by explicit action.
- T-186 / external story review — collect feedback on the derived five-chapter
  Sasha story without silently changing the approved Story Blueprint.
- Story v2 / engagement model — decide later whether the course needs a
  meta-progress or game loop and, if so, review it as a separate product model;
  Sasha's calendar, tables, and notes are not that mechanic.

## Blocked by decision or control artifact

- Story v2 Phase B: Approval 1 is satisfied; work remains blocked until the
  screen-model decision, a v2 competency catalog, isolated namespace, ledger
  schema, validator, Issue Register, and Trace + Continuity Ledger exist.

## Maintenance debt

- `harness/tasks/review/` contains a legacy historical archive from before the
  strict lifecycle contract; it is not an automatically actionable queue.
- Historical ID `T-038` is duplicated. Preserve provenance and do not reuse it.
- Older binary QA evidence remains under the legacy task archive. New bulk
  output belongs in ignored temporary storage; keep only decision-grade reports
  and a minimal evidence set under `harness/artifacts/T-XXX/`.

## Board rules

- Keep only current priorities, human decisions, and true blockers.
- Do not list every active/review/done packet; derive lanes from the filesystem.
- Builders update their own task packet. The orchestrator updates this board
  once when priorities or blockers change.
- Detailed history stays in task packets and Git.
