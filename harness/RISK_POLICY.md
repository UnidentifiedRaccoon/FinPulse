# Risk Policy

## Risk level: MVP static educational site

Current system risk is low because there is no backend, account system, analytics, or production financial action.

Still, agents must follow these rules.

## Always forbidden without explicit approval

- Adding auth/account systems.
- Adding analytics/tracking SDKs.
- Adding backend services.
- Adding payment/financial transaction logic.
- Adding production secrets.
- Sending real user/customer data to third-party services.
- Committing `.env` files with secrets.
- Switching from SPA/Vite to Next/SSR.
- Introducing a CMS or remote API dependency.

## Requires approval

- New major dependency.
- Large architecture rewrite.
- Changing content model after content exists.
- Any package that collects telemetry.
- Any deployment configuration that writes to production.

## Allowed by default

- Local-only code changes.
- Static JSON content examples.
- TypeScript types and validators.
- UI components.
- Tests.
- Documentation.
- Non-destructive local scripts.

## Agent command policy

Allowed:
- `npm install` for approved dependencies;
- `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run verify`;
- `node scripts/check-content-json.mjs`;
- git diff/status/log commands.

Avoid or require human approval:
- destructive filesystem commands outside project root;
- force push;
- deleting broad directories;
- production deploys;
- secret management commands.
