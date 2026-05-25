# Development Setup

## Initial app scaffold

Recommended app scaffold:

```bash
npm create vite@latest finpulse -- --template react-ts
cd finpulse
npm install
```

Then add expected MVP dependencies:

```bash
npm install react-router zustand zod
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Tailwind and shadcn/ui should be installed according to their current Vite documentation.

## Recommended package scripts

Add or adapt these scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test:run": "vitest run",
    "test:watch": "vitest",
    "check:content": "node scripts/check-content-json.mjs",
    "verify": "bash ./scripts/verify.sh"
  }
}
```

If the scaffold uses a different TypeScript build mode, keep the project-native command but ensure `npm run verify` remains the single verification entry point.

## Verification command

Agents should run:

```bash
./scripts/verify.sh
```

or:

```bash
npm run verify
```

## Git and PR workflow

Branch, commit, push, and Pull Request rules live in `docs/engineering/contributing.md`.

Any agent asked to publish work must read that file before creating a branch, committing, pushing, or opening a PR. PR descriptions should use the structure from that guide and include the verification commands that were actually run.

## Dependency policy

Allowed without special approval for MVP:
- React Router;
- Zustand;
- zod or another small runtime validator;
- Tailwind CSS;
- shadcn/ui dependencies;
- Vitest and Testing Library.

Requires explicit approval:
- Next.js migration;
- backend frameworks;
- analytics SDKs;
- auth providers;
- payment libraries;
- remote CMS SDKs;
- large UI frameworks that overlap with shadcn/ui.

## Common task types

- Add route/page.
- Add content block renderer.
- Add content schema validation.
- Add shadcn/ui component.
- Add mobile layout improvement.
- Add component test.
- Split content file when it grows.

Each task should be small enough that another agent can review it from the diff.
