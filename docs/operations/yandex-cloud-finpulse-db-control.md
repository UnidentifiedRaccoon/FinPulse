# Yandex Cloud FinPulse DB Control

FinPulse Managed PostgreSQL is an on-demand database contour. A public Cloud Function start URL opens or extends a 2-hour lease, and a timer-driven autostop function stops the database when the `active_until` label is missing or expired.

This runbook documents the local control code and deployed Yandex Cloud resources. The first deployment was executed after explicit user approval on 2026-05-31.

## Current Status

- Last deployment verification: 2026-05-31.
- Cloud: `b1gmnnjgdcc1b7qhjmlk`.
- Current default folder in local `yc` profile: `ncfg` (`b1gmjvv108csipq1tqu2`).
- Target folder: `finpulse` (`b1gpl04msqva2tsff46k`). The requested display form was `FinPulse`, but Yandex Cloud folder names require lowercase kebab-style names.
- PostgreSQL cluster: `finpulse-db` (`c9quhk2n9q3c3vvsp83g`), currently `STOPPED` after verification.
- Control source: `infra/yandex-cloud/finpulse-db-control/index.py`.
- Control tests: `infra/yandex-cloud/finpulse-db-control/test_index.py`.

Do not run `yc config list`; it can print the local OAuth token. Use `yc config get cloud-id`, `yc config get folder-id`, and read-only `yc ... get/list --format json` commands for diagnostics.

## Resources

| Resource | Value | ID / URL |
| --- | --- | --- |
| Folder | `finpulse` | `b1gpl04msqva2tsff46k` |
| Managed PostgreSQL cluster | `finpulse-db` | `c9quhk2n9q3c3vvsp83g` |
| PostgreSQL version | `16.13` | `c9quhk2n9q3c3vvsp83g` |
| Host | `rc1a-ua11qmcqokpra171.mdb.yandexcloud.net`, one master, no replica, public IP | `c9quhk2n9q3c3vvsp83g` |
| Resource preset | `s2.micro`, 2 cores / 8 GiB RAM | `c9quhk2n9q3c3vvsp83g` |
| Disk | `network-ssd`, 10 GB | `c9quhk2n9q3c3vvsp83g` |
| Network | `ncfg-network` | `enpanp4tbmpj9gckolkg` |
| Subnet | `ncfg-subnet-a`, `ru-central1-a`, `10.1.0.0/24` | `e9bl6as7h109ghbo9c33` |
| Security group | `finpulse-db-sg` in `ncfg` folder | `enpfi1mqc28vo7tc71kn` |
| Database | `finpulse`, owner `finpulse_app` | `c9quhk2n9q3c3vvsp83g` |
| User | `finpulse_app`, generated password | Connection `a59otq7kc4275f8onsdm` |
| Lockbox secret metadata | `connection-a59otq7kc4275f8onsdm`, key `postgresql_password` | `e6qdr1f6uh0k9aj2v34c` |
| Runtime service account | `finpulse-db-control-sa` | `ajem5k91i11pjjnbmfea` |
| Public start function | `finpulse-db-start` | `d4e0o3h9gnq59inscpns`, `https://functions.yandexcloud.net/d4e0o3h9gnq59inscpns` |
| Autostop function | `finpulse-db-autostop` | `d4e5g59hleegbl8avgcm` |
| Timer trigger | `finpulse-db-autostop-5m` | `a1s15loslil2cb3ipsaj` |
| Initial manual backup | required by YC before first stop | `c9quhk2n9q3c3vvsp83g:mdbpmgko239s422m5tk9` |

Public IP is a temporary first-stage choice, matching VRK/Ncfg, so migrations and manual checks are simpler. Revisit it after backend/container deployment and private connectivity are defined.

The existing `ncfg` default security group is broad: discovery found `ANY` ingress and egress from/to `0.0.0.0/0`. FinPulse does not use that default SG directly. The deployed `finpulse-db-sg` allows:

- ingress TCP `6432` from `89.125.48.147/32` for temporary operator verification;
- ingress TCP `6432` from `10.1.0.0/24` for private subnet access;
- egress `ANY` to `0.0.0.0/0`.

## Lease Contract

Cluster labels:

- `active_until`: Unix timestamp for the current lease expiry.
- `managed_by`: `finpulse-db-control`.

Calling the public start URL again extends `active_until` by another 2 hours from the call time. Anyone with the public URL can start the paid database window.

Function behavior:

- `finpulse-db-start`: starts a `STOPPED` cluster, waits for the start operation, then writes labels only after the cluster reads as `RUNNING`.
- `finpulse-db-start`: extends labels when the cluster is already `RUNNING`.
- `finpulse-db-start`: does not mutate when the cluster is `STARTING`, `UPDATING`, or `STOPPING`.
- `finpulse-db-autostop`: stops only when the cluster is `RUNNING` and `active_until` is missing or expired.
- `finpulse-db-autostop`: does not mutate stopped or transient clusters.

## Verification Result

The first deployment was verified on 2026-05-31:

- `finpulse` folder was created after `FinPulse` failed YC lowercase validation.
- `finpulse-db-control-sa` was created with `managed-postgresql.editor` and `serverless.functions.invoker`.
- `finpulse-db-sg` was created and attached to the PostgreSQL cluster.
- `finpulse-db` was created with PostgreSQL `16.13`, one public-IP host in `ru-central1-a`, `s2.micro`, `network-ssd`, 10 GB, and serverless access.
- `finpulse` database and `finpulse_app` user were created with generated Connection Manager/Lockbox credentials. Lockbox payload was not read.
- `finpulse-db-start` and `finpulse-db-autostop` Cloud Functions were deployed on `python312`.
- Public unauthenticated invoke was enabled only for `finpulse-db-start`.
- `finpulse-db-autostop-5m` was created with cron `0/5 * * * ? *`, retries `2`, interval `60s`.
- The public start URL was invoked once. It returned `action=extend-requested` and wrote `active_until=1780262473` (`2026-05-31T21:21:13Z`).
- Manual autostop invocation after cluster stop returned `noop` / `already-stopped`.
- YC required an initial manual backup before the first stop. Backup `c9quhk2n9q3c3vvsp83g:mdbpmgko239s422m5tk9` was created, then the cluster was manually stopped.
- Final cluster status: `STOPPED`.

## Cost And Security Notes

- The cluster is currently stopped, so compute billing should be reduced; storage and backup retention can still cost money.
- The public start URL is unauthenticated by design. Anyone with `https://functions.yandexcloud.net/d4e0o3h9gnq59inscpns` can start or extend the paid DB window.
- Public IP is a temporary first-stage choice. Revisit it after backend/container deployment and private connectivity are defined.
- The current operator IP rule `89.125.48.147/32` may need rotation if the operator egress IP changes.

## Deployment Notes

Useful shell variables:

```bash
CLOUD_ID="$(yc config get cloud-id)"
FINPULSE_FOLDER_ID="b1gpl04msqva2tsff46k"
NCFG_FOLDER_ID="b1gmjvv108csipq1tqu2"
NETWORK_ID="enpanp4tbmpj9gckolkg"
SUBNET_ID="e9bl6as7h109ghbo9c33"
FINPULSE_DB_SG_ID="enpfi1mqc28vo7tc71kn"
FINPULSE_DB_CONTROL_SA_ID="ajem5k91i11pjjnbmfea"
FINPULSE_DB_CLUSTER_ID="c9quhk2n9q3c3vvsp83g"
```

Create or find the target folder. Use lowercase `finpulse`; `FinPulse` is not accepted by YC folder-name validation:

```bash
yc resource-manager folder create finpulse \
  --cloud-id "$CLOUD_ID" \
  --description "FinPulse MVP infrastructure"

FINPULSE_FOLDER_ID="$(yc resource-manager folder get finpulse --format json | jq -r '.id')"
```

Create the control service account and role bindings:

```bash
yc iam service-account create finpulse-db-control-sa \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --description "Controls on-demand finpulse-db start/stop functions"

FINPULSE_DB_CONTROL_SA_ID="$(yc iam service-account list \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json | jq -r '.[] | select(.name=="finpulse-db-control-sa") | .id')"

yc resource-manager folder add-access-binding "$FINPULSE_FOLDER_ID" \
  --role managed-postgresql.editor \
  --service-account-id "$FINPULSE_DB_CONTROL_SA_ID"

yc resource-manager folder add-access-binding "$FINPULSE_FOLDER_ID" \
  --role serverless.functions.invoker \
  --service-account-id "$FINPULSE_DB_CONTROL_SA_ID"
```

`managed-postgresql.editor` is the least-practical first attempt for cluster start/stop and label updates. If function logs or readback show `403` during start/stop/label mutation, escalate to the VRK-equivalent role:

```bash
yc resource-manager folder add-access-binding "$FINPULSE_FOLDER_ID" \
  --role managed-postgresql.admin \
  --service-account-id "$FINPULSE_DB_CONTROL_SA_ID"
```

Safer security-group option before cluster creation:

```bash
# Create in the network-owning ncfg folder if allowed.
yc vpc security-group create finpulse-db-sg \
  --folder-id "$NCFG_FOLDER_ID" \
  --network-id "$NETWORK_ID" \
  --description "Temporary public PostgreSQL access for FinPulse DB verification"

FINPULSE_DB_SG_ID="$(yc vpc security-group get finpulse-db-sg \
  --folder-id "$NCFG_FOLDER_ID" \
  --format json | jq -r '.id')"

# Replace 203.0.113.10/32 with the current operator or runner egress IP/CIDR.
yc vpc security-group update-rules "$FINPULSE_DB_SG_ID" \
  --folder-id "$NCFG_FOLDER_ID" \
  --add-rule "direction=ingress,protocol=tcp,port=6432,v4-cidrs=89.125.48.147/32" \
  --add-rule "direction=ingress,protocol=tcp,port=6432,v4-cidrs=10.1.0.0/24" \
  --add-rule "direction=egress,protocol=any,port=any,v4-cidrs=0.0.0.0/0"
```

If this cannot be used across folders, either explicitly accept the current default SG risk for the first bootstrap or create a dedicated FinPulse network/subnet.

Create the PostgreSQL cluster. Use Connection Manager generated password support so the password is not printed or committed:

```bash
yc managed-postgresql cluster create finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --environment production \
  --postgresql-version 16 \
  --resource-preset s2.micro \
  --disk-size 10GB \
  --disk-type network-ssd \
  --network-id "$NETWORK_ID" \
  --security-group-ids "$FINPULSE_DB_SG_ID" \
  --host zone-id=ru-central1-a,subnet-id="$SUBNET_ID",assign-public-ip=true \
  --serverless-access \
  --user name=finpulse_app,generate-password=true \
  --database name=finpulse,owner=finpulse_app \
  --labels managed_by=finpulse-db-control,public_ip_temporary=true
```

If the dedicated security group is not approved or cannot be attached, remove `--security-group-ids "$FINPULSE_DB_SG_ID"` only after explicitly accepting the current default security-group exposure. If cross-folder VPC permissions block this command, stop and create a dedicated `finpulse-network` / `finpulse-subnet-a` in the `FinPulse` folder instead of improvising.

Read back cluster and generated connection metadata:

```bash
FINPULSE_DB_CLUSTER_ID="$(yc managed-postgresql cluster get finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json | jq -r '.id')"

yc managed-postgresql cluster get finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json

yc managed-postgresql host list \
  --cluster-name finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json

yc managed-postgresql database get finpulse \
  --cluster-name finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json

yc managed-postgresql user get finpulse_app \
  --cluster-name finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json

yc connection-manager connection list \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json
```

Expected readback:

- `full_version` is `16.13` or the current Yandex Cloud PostgreSQL 16 patch.
- exactly one host exists in `ru-central1-a` on subnet `e9bl6as7h109ghbo9c33`.
- host `assign_public_ip` is `true`.
- resources are `s2.micro`, `network-ssd`, and `10737418240` bytes.
- `.config.access.serverless` is `true`.
- database `finpulse` is owned by `finpulse_app`.
- generated credential metadata exists in Connection Manager/Lockbox.

Do not fetch or print the generated password payload in terminal logs. It is enough to read metadata:

```bash
CONN_ID="$(yc managed-postgresql user get finpulse_app \
  --cluster-name finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json | jq -r '.connection_manager.connection_id')"

yc connection-manager connection get "$CONN_ID" --format json \
  | jq '{id,name,lockbox_secret,params:.params.postgresql}'

SECRET_ID="$(yc connection-manager connection get "$CONN_ID" --format json | jq -r '.lockbox_secret.id')"
yc lockbox secret get "$SECRET_ID" --format json
```

Create a minimal deployment package:

```bash
(cd infra/yandex-cloud/finpulse-db-control && zip -q /tmp/finpulse-db-control.zip index.py)
```

Create and deploy functions:

```bash
yc serverless function create finpulse-db-start \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --description "Public URL to start or extend finpulse-db for 2 hours"

yc serverless function version create \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --function-name finpulse-db-start \
  --runtime python312 \
  --entrypoint index.start \
  --memory 128MB \
  --execution-timeout 600s \
  --concurrency 1 \
  --service-account-id "$FINPULSE_DB_CONTROL_SA_ID" \
  --source-path /tmp/finpulse-db-control.zip \
  --environment FINPULSE_DB_CLUSTER_ID="$FINPULSE_DB_CLUSTER_ID",FINPULSE_DB_SESSION_HOURS=2,FINPULSE_DB_OPERATION_WAIT_SECONDS=540,FINPULSE_DB_LABEL_WAIT_SECONDS=45

yc serverless function allow-unauthenticated-invoke finpulse-db-start \
  --folder-id "$FINPULSE_FOLDER_ID"

yc serverless function create finpulse-db-autostop \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --description "Timer function to stop finpulse-db after active_until expires"

yc serverless function version create \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --function-name finpulse-db-autostop \
  --runtime python312 \
  --entrypoint index.autostop \
  --memory 128MB \
  --execution-timeout 60s \
  --concurrency 1 \
  --service-account-id "$FINPULSE_DB_CONTROL_SA_ID" \
  --source-path /tmp/finpulse-db-control.zip \
  --environment FINPULSE_DB_CLUSTER_ID="$FINPULSE_DB_CLUSTER_ID",FINPULSE_DB_SESSION_HOURS=2,FINPULSE_DB_OPERATION_WAIT_SECONDS=540,FINPULSE_DB_LABEL_WAIT_SECONDS=45
```

Create the 5-minute autostop trigger:

```bash
yc serverless trigger create timer finpulse-db-autostop-5m \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --cron-expression '0/5 * * * ? *' \
  --invoke-function-name finpulse-db-autostop \
  --invoke-function-tag '$latest' \
  --invoke-function-service-account-id "$FINPULSE_DB_CONTROL_SA_ID" \
  --retry-attempts 2 \
  --retry-interval 60s
```

## Readback Verification

Use read-only commands:

```bash
yc resource-manager folder get finpulse --format json
yc iam service-account list --folder-id "$FINPULSE_FOLDER_ID" --format json
yc resource-manager folder list-access-bindings "$FINPULSE_FOLDER_ID" --format json
yc managed-postgresql cluster get finpulse-db --folder-id "$FINPULSE_FOLDER_ID" --format json
yc managed-postgresql host list --cluster-name finpulse-db --folder-id "$FINPULSE_FOLDER_ID" --format json
yc serverless function get finpulse-db-start --folder-id "$FINPULSE_FOLDER_ID" --format json
yc serverless function version list --function-name finpulse-db-start --folder-id "$FINPULSE_FOLDER_ID" --format json
yc serverless function get finpulse-db-autostop --folder-id "$FINPULSE_FOLDER_ID" --format json
yc serverless function version list --function-name finpulse-db-autostop --folder-id "$FINPULSE_FOLDER_ID" --format json
yc serverless trigger get finpulse-db-autostop-5m --folder-id "$FINPULSE_FOLDER_ID" --format json
```

Invoke the public start URL only when a paid DB window is intended:

```bash
START_URL="$(yc serverless function get finpulse-db-start \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json | jq -r '.http_invoke_url')"

curl -sS "$START_URL" | jq
```

After invoking once, confirm `active_until` is about 2 hours ahead:

```bash
yc managed-postgresql cluster get finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json | jq '.labels'
```

Then stop the cluster manually after verification:

```bash
yc managed-postgresql cluster stop finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID"
```

If YC rejects the first stop because the new cluster has no backups, create a backup once and retry stop:

```bash
yc managed-postgresql cluster backup finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID"

yc managed-postgresql cluster stop finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID"
```

## Manual Operations

Start cluster directly:

```bash
yc managed-postgresql cluster start finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID"
```

Stop cluster directly:

```bash
yc managed-postgresql cluster stop finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID"
```

Inspect labels:

```bash
yc managed-postgresql cluster get finpulse-db \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --format json | jq '.labels'
```

Inspect function logs:

```bash
yc serverless function logs finpulse-db-start 2h \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --limit 100

yc serverless function logs finpulse-db-autostop 2h \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --limit 100
```

Revoke public URL access without deleting the function:

```bash
yc serverless function deny-unauthenticated-invoke finpulse-db-start \
  --folder-id "$FINPULSE_FOLDER_ID"
```

Rotate the public URL:

```bash
yc serverless function delete finpulse-db-start \
  --folder-id "$FINPULSE_FOLDER_ID"

yc serverless function create finpulse-db-start \
  --folder-id "$FINPULSE_FOLDER_ID" \
  --description "Public URL to start or extend finpulse-db for 2 hours"

# Recreate the function version and public invoke binding from the deployment plan.
```

## Local Verification

Focused function behavior:

```bash
python3 -m unittest infra/yandex-cloud/finpulse-db-control/test_index.py
```

Repository verification, when local PostgreSQL is available:

```bash
npm run verify
```

The current backend test suite requires PostgreSQL at `FINPULSE_TEST_DATABASE_URL`, `FINPULSE_DATABASE_URL`, or `DATABASE_URL`.
