# Yandex Cloud FinPulse App Deploy

FinPulse deploys as one same-origin Serverless Container: the Fastify backend serves `/api/**` and the built Vite SPA from `dist/`. This keeps httpOnly session cookies and frontend/API routing on one public origin.

## Current status

- Last infrastructure update: 2026-05-31.
- Deploy target: Yandex Serverless Container `finpulse-app`.
- Production URL: `https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net/`.
- Container image path: `cr.yandex/crp5j8penr0hui0ttaum/finpulse:<git-sha>`.
- Deploy workflow: `.github/workflows/deploy.yml`, triggered on push to `main` and `workflow_dispatch`.
- DB control layer: `docs/operations/yandex-cloud-finpulse-db-control.md`.
- Current limitation: no production revision has been deployed from this repo yet in the local run because the local Docker daemon was unavailable. The workflow is ready to build, push, deploy, and smoke-test the first revision from GitHub Actions.

## Resources

| Resource | Value |
| --- | --- |
| Cloud | `b1gmnnjgdcc1b7qhjmlk` |
| Folder | `finpulse` / `b1gpl04msqva2tsff46k` |
| Container Registry | `finpulse` / `crp5j8penr0hui0ttaum` |
| Serverless Container | `finpulse-app` / `bbabho5nujsp32c8mvc7` |
| Runtime service account | `finpulse-runtime-sa` / `aje0lujm0q1obpn9fbu9` |
| GitHub deploy service account | `finpulse-github-deploy-sa` / `ajeboe0h7j2k9vtfi06j` |
| Workload Identity federation | `finpulse-github-actions` / `ajeuttdtpqdudd97n6ei` |
| Federated credential | `ajeci1l3l7qhus6vjqhk` |
| WIF audience | `https://github.com/UnidentifiedRaccoon` |
| WIF subject | `repo:UnidentifiedRaccoon/FinPulse:ref:refs/heads/main` |
| Network | `ncfg-network` / `enpanp4tbmpj9gckolkg` |
| Subnet | `ncfg-subnet-a` / `e9bl6as7h109ghbo9c33` |
| DB host | `rc1a-ua11qmcqokpra171.mdb.yandexcloud.net:6432` |
| DB name/user | `finpulse` / `finpulse_app` |
| DB password secret metadata | `e6qdr1f6uh0k9aj2v34c`, key `postgresql_password` |

The DB start function URL is intentionally not repeated here. Store it as the GitHub Actions secret `YC_DB_START_URL`; the function ID is documented in the DB control runbook.

## IAM

Runtime service account `aje0lujm0q1obpn9fbu9`:

- `container-registry.images.puller` on registry `crp5j8penr0hui0ttaum`;
- `lockbox.payloadViewer` on secret `e6qdr1f6uh0k9aj2v34c`;
- `vpc.user` on network folder `b1gmjvv108csipq1tqu2`.

Deploy service account `ajeboe0h7j2k9vtfi06j`:

- `container-registry.images.pusher` on registry `crp5j8penr0hui0ttaum`;
- `serverless-containers.editor` on folder `b1gpl04msqva2tsff46k`;
- `iam.serviceAccounts.user` on runtime service account `aje0lujm0q1obpn9fbu9`;
- `lockbox.viewer` on secret `e6qdr1f6uh0k9aj2v34c`;
- `vpc.user` on network folder `b1gmjvv108csipq1tqu2`.

GitHub does not store a long-lived YC service-account key. The deploy job requests a GitHub OIDC token, exchanges it through Yandex Workload Identity Federation, and configures `yc` with the short-lived IAM token. See Yandex Cloud docs for [workload identity federation setup](https://yandex.cloud/en/docs/iam/operations/wlif/setup-wlif) and the [GitHub WIF integration](https://yandex.cloud/en/docs/iam/tutorials/wlif-github-integration).

## GitHub configuration

Required GitHub Actions secret:

| Secret | Purpose |
| --- | --- |
| `YC_DB_START_URL` | Public DB start function URL. Treat as sensitive because it starts or extends paid DB runtime. |

The remaining resource IDs are committed in `.github/workflows/deploy.yml` because they are non-secret infrastructure identifiers. Move them to repository variables later if operators need to retarget environments without code changes.

Workflow permissions:

- `contents: read`;
- `id-token: write`.

## Deployment flow

On push to `main`, `.github/workflows/deploy.yml` does the following:

1. checks out the repository;
2. installs Node.js dependencies with `npm ci`;
3. runs `npm run verify` against a PostgreSQL 16 GitHub Actions service;
4. installs the Yandex Cloud CLI;
5. exchanges GitHub OIDC for a YC IAM token through WIF;
6. configures Docker for Yandex Container Registry;
7. builds `cr.yandex/crp5j8penr0hui0ttaum/finpulse:${GITHUB_SHA}`;
8. pushes the image;
9. invokes `YC_DB_START_URL`;
10. deploys a new Serverless Container revision with:
    - `NODE_ENV=production`;
    - `FINPULSE_API_HOST=0.0.0.0`;
    - `FINPULSE_STATIC_ROOT=/app/dist`;
    - DB host/name/user/port/sslmode env vars;
    - `FINPULSE_DATABASE_PASSWORD_SECRET_ID=e6qdr1f6uh0k9aj2v34c` and key `postgresql_password`;
11. smoke-tests:
    - `/api/health`;
    - `/api/readyz`;
    - `/`.

The backend applies the committed `server/db/schema.sql` on startup through `openDatabase()` / `runMigrations()`. This is an idempotent schema bootstrap in a transaction, not a versioned migration ledger. In production, the backend reads the DB password from Lockbox at startup through the Serverless Container metadata IAM token; the password payload is not passed through GitHub Actions or committed env.

## Manual deploy

Use this only from a secure operator shell with a configured `yc` identity. Do not print secret payloads.

```bash
export YC_FOLDER_ID=b1gpl04msqva2tsff46k
export YC_REGISTRY_ID=crp5j8penr0hui0ttaum
export YC_CONTAINER_ID=bbabho5nujsp32c8mvc7
export YC_RUNTIME_SA_ID=aje0lujm0q1obpn9fbu9
export YC_NETWORK_ID=enpanp4tbmpj9gckolkg
export FINPULSE_DATABASE_PASSWORD_SECRET_ID=e6qdr1f6uh0k9aj2v34c
export FINPULSE_DATABASE_PASSWORD_SECRET_KEY=postgresql_password
export IMAGE="cr.yandex/${YC_REGISTRY_ID}/finpulse:manual-$(git rev-parse --short HEAD)"

npm run build:container
docker build --tag "$IMAGE" .
yc container registry configure-docker
docker push "$IMAGE"
curl -fsS -X POST "$YC_DB_START_URL" -o /tmp/finpulse-db-start.json

yc serverless container revision deploy \
  --container-id "$YC_CONTAINER_ID" \
  --image "$IMAGE" \
  --cores 1 \
  --memory 512MB \
  --concurrency 8 \
  --execution-timeout 30s \
  --service-account-id "$YC_RUNTIME_SA_ID" \
  --network-id "$YC_NETWORK_ID" \
  --environment NODE_ENV=production \
  --environment FINPULSE_API_HOST=0.0.0.0 \
  --environment FINPULSE_STATIC_ROOT=/app/dist \
  --environment FINPULSE_COOKIE_SECURE=true \
  --environment FINPULSE_DATABASE_HOST=rc1a-ua11qmcqokpra171.mdb.yandexcloud.net \
  --environment FINPULSE_DATABASE_PORT=6432 \
  --environment FINPULSE_DATABASE_NAME=finpulse \
  --environment FINPULSE_DATABASE_USER=finpulse_app \
  --environment FINPULSE_DATABASE_SSLMODE=require \
  --environment FINPULSE_DATABASE_PASSWORD_SECRET_ID="$FINPULSE_DATABASE_PASSWORD_SECRET_ID" \
  --environment FINPULSE_DATABASE_PASSWORD_SECRET_KEY="$FINPULSE_DATABASE_PASSWORD_SECRET_KEY"
```

## Smoke checks

```bash
APP_URL="https://bbabho5nujsp32c8mvc7.containers.yandexcloud.net"
curl -fsS "$APP_URL/api/health"
curl -fsS "$APP_URL/api/readyz"
curl -fsS "$APP_URL/" | grep -qi '<html'
```

`/api/health` is a process health check and does not query PostgreSQL. `/api/readyz` queries PostgreSQL with `SELECT 1` and returns `503` if the database is unavailable.

## Rollback

List revisions:

```bash
yc serverless container revision list --container-id bbabho5nujsp32c8mvc7
```

Rollback to a previous revision:

```bash
yc serverless container rollback bbabho5nujsp32c8mvc7 --revision-id <previous_revision_id>
```

After rollback, rerun the smoke checks above. If the DB has stopped, invoke `YC_DB_START_URL` first.

## If the DB is stopped

The deploy workflow always invokes the DB start URL before deploying and smoking. Manual operators must do the same. The start function opens or extends a 2-hour DB lease; the autostop trigger may stop the DB later if no active lease remains.

If `/api/readyz` returns `503` after invoking the start URL, check:

- Managed PostgreSQL cluster `c9quhk2n9q3c3vvsp83g` status;
- Serverless Container revision env vars, especially `FINPULSE_DATABASE_PASSWORD_SECRET_ID`;
- runtime SA `lockbox.payloadViewer` on secret `e6qdr1f6uh0k9aj2v34c`;
- VPC network attachment on the deployed revision.
