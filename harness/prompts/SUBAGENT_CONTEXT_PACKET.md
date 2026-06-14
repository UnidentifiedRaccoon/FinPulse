# Subagent Context Packet Template

```md
You are working on FinPulse Learning MVP.

Model requirement: GPT-5.5, reasoning effort xhigh.

Read first:
- AGENTS.md
- harness/PROJECT_STATE.md
- docs/ARCHITECTURE.md
- docs/CONTENT_MODEL.md and docs/methodology/AUTHORING.md, if touching JSON,
  methodology, or lesson content
- <additional docs>

Task ID:

Task goal:

Allowed write set:
-

Do not touch:
-

Important constraints:
- mobile-first educational MVP;
- approved educational hierarchy is Program -> Level -> Section -> Lesson ->
  Card; do not reintroduce `module`/`unit` content architecture or
  compatibility surfaces;
- JSON data;
- React + TypeScript SPA/Vite;
- Zustand only for small client state;
- Tailwind + shadcn/ui;
- no accounts beyond accepted minimal learner auth, diagnostics, rewards,
  analytics, personalized recommendations, or SSR migration;
- Level 1 lesson content must follow the accepted eight-screen architecture:
  `single_choice`, `theory`, `categorization`, `scenario`, `artifact`,
  `reflection`, `artifact`, `summary`.

Success criteria:
-

Required checks:
- `./scripts/verify.sh` if scaffold exists
- `npm run check:content` if content/JSON changed
- <task-specific checks>

Return exactly:
1. Summary
2. Files changed
3. Checks run
4. Risks
5. Follow-up
```
