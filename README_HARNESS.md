# FinPulse MVP Harness

This package started as a repo-local harness for building the first mobile educational MVP.

The app is now scaffolded; this file documents the remaining harness layer:
- agent instructions;
- architecture/product docs;
- parallel-agent protocol;
- task coordination;
- content model;
- verification entry point;
- empty eval structure for later.

## How to use

1. Copy these files into the root of the project repository.
2. Scaffold the app with Vite React TypeScript.
3. Keep active scripts in `package.json`.
4. Keep `AGENTS.md` short and maintain durable knowledge in `docs/`.
5. Use `harness/tasks/` when multiple agents work in parallel.
6. Add evals only after real product flows exist.

## First practical sequence

```bash
npm create vite@latest . -- --template react-ts
npm install react-router zod
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npm run verify
```

Then install Tailwind and shadcn/ui using their current Vite instructions.

## Important project defaults

- SPA/Vite over Next/SSR for MVP.
- JSON content source.
- React + TypeScript.
- Zustand only for small client-side state.
- Tailwind + shadcn/ui.
- Evals deferred.
- Parallel agents supported through task write sets.
- Default model: GPT-5.5 / xhigh.
