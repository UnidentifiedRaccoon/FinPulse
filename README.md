# FinPulse

Mobile-first content reader for the FinPulse educational MVP.

## Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS v4
- shadcn/ui
- Vitest + Testing Library
- JSON content source

## Scripts

```bash
npm run dev
npm run verify
```

`npm run verify` runs content validation, typecheck, lint, tests, and production build through `scripts/verify.sh`.

## MVP boundary

FinPulse starts as a reader for educational program content. Accounts, diagnostics, rewards, analytics, backend services, CMS, payments, and SSR are outside the MVP until a separate architecture decision says otherwise.
