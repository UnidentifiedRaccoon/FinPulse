# Workboard

This is a lightweight coordination board for human and agent work.

Statuses:
- `planned`
- `active`
- `blocked`
- `review`
- `done`

## Planned seed tasks

These are suggestions. The orchestrator may split or reorder them.

| ID | Status | Task | Intended write set | Notes |
|---|---:|---|---|---|
| T-001 | done | Scaffold Vite React TS app | `package.json`, `src/**`, config files | Initial scaffold is in place. |
| T-002 | done | Install Tailwind + shadcn/ui | styling config, `components.json` | Tailwind v4 and shadcn/ui initialized. |
| T-003 | done | Add content model and example content | `src/content/**`, `docs/**` | Initial JSON content and source docs are in place. |
| T-004 | done | Add routing and pages | `src/**` | Overview/module/lesson routes are in place. |
| T-005 | done | Add lesson block renderer | `src/**` | Initial heading/paragraph/list/callout renderer is in place. |
| T-006 | done | Add mobile app shell | `src/**` | Mobile-first shell is in place. |
| T-007 | done | Add first component tests | test files, test config | Initial Vitest coverage is in place. |

## Active tasks

Use files under `harness/tasks/active/` for real active work.

## Review tasks

Use task files and PR/diff summaries.

## Done tasks

Move task files to `harness/tasks/done/` or mark them done in place.
