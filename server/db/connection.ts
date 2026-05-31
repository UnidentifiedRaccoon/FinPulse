import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from 'pg'

import { ProgressRepository } from './progressRepository'
import { ReflectionAnswersRepository } from './reflectionAnswersRepository'
import { runMigrations } from './migrate'
import { SessionsRepository } from './sessionsRepository'
import { UsersRepository } from './usersRepository'

const DEFAULT_LOCAL_DATABASE_URL = 'postgres://finpulse:finpulse@127.0.0.1:5432/finpulse'
const DEFAULT_YC_METADATA_TOKEN_URL =
  'http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token'
const DEFAULT_YC_LOCKBOX_PAYLOAD_BASE_URL = 'https://payload.lockbox.api.cloud.yandex.net'
const DEFAULT_DATABASE_PASSWORD_SECRET_KEY = 'postgresql_password'

export type DatabaseConfig = {
  connectionString?: string
  databaseUrl?: string
  ssl?: PoolConfig['ssl']
  max?: number
  idleTimeoutMillis?: number
  connectionTimeoutMillis?: number
  runMigrations?: boolean
  schema?: string
  resetSchema?: boolean
  dropSchemaOnClose?: boolean
}

export type DatabaseEnvironment = {
  FINPULSE_DATABASE_URL?: string
  DATABASE_URL?: string
  FINPULSE_DATABASE_HOST?: string
  FINPULSE_DATABASE_PORT?: string
  FINPULSE_DATABASE_NAME?: string
  FINPULSE_DATABASE_USER?: string
  FINPULSE_DATABASE_PASSWORD?: string
  FINPULSE_DATABASE_PASSWORD_SECRET_ID?: string
  FINPULSE_DATABASE_PASSWORD_SECRET_KEY?: string
  FINPULSE_DATABASE_PASSWORD_SECRET_VERSION_ID?: string
  FINPULSE_YC_METADATA_TOKEN_URL?: string
  FINPULSE_YC_LOCKBOX_PAYLOAD_BASE_URL?: string
  FINPULSE_DATABASE_SSLMODE?: string
  FINPULSE_DATABASE_SSL_LIBPQ_COMPAT?: string
  NODE_ENV?: string
}

export type AppDatabase = {
  pool: Pool
  users: UsersRepository
  sessions: SessionsRepository
  progress: ProgressRepository
  reflectionAnswers: ReflectionAnswersRepository
  query<Row extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<Row>>
  close(): Promise<void>
}

export async function openDatabase(config: DatabaseConfig = {}): Promise<AppDatabase> {
  if (config.schema) {
    assertSafeIdentifier(config.schema)
  }

  const pool = new Pool(await toPoolConfig(config))

  try {
    if (config.schema) {
      if (config.resetSchema) {
        await pool.query(`DROP SCHEMA IF EXISTS ${quoteIdentifier(config.schema)} CASCADE`)
      }

      await pool.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(config.schema)}`)
    }

    if (config.runMigrations ?? true) {
      await runMigrations(pool)
    }

    return createAppDatabase(pool, {
      schema: config.schema,
      dropSchemaOnClose: config.dropSchemaOnClose,
    })
  } catch (error) {
    await pool.end()
    throw error
  }
}

type AppDatabaseLifecycleOptions = {
  schema?: string
  dropSchemaOnClose?: boolean
}

export function createAppDatabase(pool: Pool, options: AppDatabaseLifecycleOptions = {}): AppDatabase {
  return {
    pool,
    users: new UsersRepository(pool),
    sessions: new SessionsRepository(pool),
    progress: new ProgressRepository(pool),
    reflectionAnswers: new ReflectionAnswersRepository(pool),
    query<Row extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
      return pool.query<Row>(text, values)
    },
    async close() {
      if (options.schema && options.dropSchemaOnClose) {
        await pool.query(`DROP SCHEMA IF EXISTS ${quoteIdentifier(options.schema)} CASCADE`)
      }

      await pool.end()
    },
  }
}

export function resolveDatabaseUrl(env: DatabaseEnvironment = process.env): string | undefined {
  return env.FINPULSE_DATABASE_URL ?? env.DATABASE_URL ?? resolveDatabaseUrlFromParts(env) ?? (env.NODE_ENV === 'production' ? undefined : DEFAULT_LOCAL_DATABASE_URL)
}

export async function resolveDatabaseUrlWithSecrets(env: DatabaseEnvironment = process.env): Promise<string | undefined> {
  const configuredUrl = env.FINPULSE_DATABASE_URL ?? env.DATABASE_URL ?? resolveDatabaseUrlFromParts(env)

  if (configuredUrl) {
    return configuredUrl
  }

  if (canResolveDatabasePasswordFromLockbox(env)) {
    const password = await fetchDatabasePasswordFromLockbox(env)
    return resolveDatabaseUrlFromParts({
      ...env,
      FINPULSE_DATABASE_PASSWORD: password,
    })
  }

  return env.NODE_ENV === 'production' ? undefined : DEFAULT_LOCAL_DATABASE_URL
}

function resolveDatabaseUrlFromParts(env: DatabaseEnvironment): string | undefined {
  if (!env.FINPULSE_DATABASE_HOST || !env.FINPULSE_DATABASE_NAME || !env.FINPULSE_DATABASE_USER || !env.FINPULSE_DATABASE_PASSWORD) {
    return undefined
  }

  const url = new URL('postgres://localhost')
  url.hostname = env.FINPULSE_DATABASE_HOST
  url.username = env.FINPULSE_DATABASE_USER
  url.password = env.FINPULSE_DATABASE_PASSWORD
  url.pathname = `/${env.FINPULSE_DATABASE_NAME}`

  if (env.FINPULSE_DATABASE_PORT) {
    url.port = env.FINPULSE_DATABASE_PORT
  }

  if (env.FINPULSE_DATABASE_SSLMODE) {
    url.searchParams.set('sslmode', env.FINPULSE_DATABASE_SSLMODE)
  }

  if (env.FINPULSE_DATABASE_SSL_LIBPQ_COMPAT === 'true') {
    url.searchParams.set('uselibpqcompat', 'true')
  }

  return url.toString()
}

async function toPoolConfig(config: DatabaseConfig): Promise<PoolConfig> {
  const connectionString = config.connectionString ?? config.databaseUrl ?? (await resolveDatabaseUrlWithSecrets())

  if (!connectionString) {
    throw new Error('PostgreSQL connection string is required: set FINPULSE_DATABASE_URL or DATABASE_URL')
  }

  return {
    connectionString,
    ssl: config.ssl,
    max: config.max,
    idleTimeoutMillis: config.idleTimeoutMillis,
    connectionTimeoutMillis: config.connectionTimeoutMillis,
    options: config.schema ? `-c search_path=${config.schema},public` : undefined,
  }
}

function canResolveDatabasePasswordFromLockbox(env: DatabaseEnvironment) {
  return Boolean(
    env.FINPULSE_DATABASE_HOST &&
      env.FINPULSE_DATABASE_NAME &&
      env.FINPULSE_DATABASE_USER &&
      env.FINPULSE_DATABASE_PASSWORD_SECRET_ID,
  )
}

async function fetchDatabasePasswordFromLockbox(env: DatabaseEnvironment) {
  const secretId = env.FINPULSE_DATABASE_PASSWORD_SECRET_ID

  if (!secretId) {
    throw new Error('FINPULSE_DATABASE_PASSWORD_SECRET_ID is required to fetch the database password')
  }

  const token = await fetchYandexIamToken(env)
  const payloadUrl = new URL(`/lockbox/v1/secrets/${encodeURIComponent(secretId)}/payload`, env.FINPULSE_YC_LOCKBOX_PAYLOAD_BASE_URL ?? DEFAULT_YC_LOCKBOX_PAYLOAD_BASE_URL)

  if (env.FINPULSE_DATABASE_PASSWORD_SECRET_VERSION_ID) {
    payloadUrl.searchParams.set('versionId', env.FINPULSE_DATABASE_PASSWORD_SECRET_VERSION_ID)
  }

  const payload = await fetchJson(payloadUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return readLockboxTextEntry(payload, env.FINPULSE_DATABASE_PASSWORD_SECRET_KEY ?? DEFAULT_DATABASE_PASSWORD_SECRET_KEY)
}

async function fetchYandexIamToken(env: DatabaseEnvironment) {
  const tokenPayload = await fetchJson(env.FINPULSE_YC_METADATA_TOKEN_URL ?? DEFAULT_YC_METADATA_TOKEN_URL, {
    headers: {
      'Metadata-Flavor': 'Google',
    },
  })

  if (isRecord(tokenPayload) && typeof tokenPayload.access_token === 'string' && tokenPayload.access_token) {
    return tokenPayload.access_token
  }

  throw new Error('Yandex metadata service did not return an IAM access token')
}

async function fetchJson(url: string | URL, init: Parameters<typeof fetch>[1]) {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(`Yandex Cloud request failed with HTTP ${response.status}`)
  }

  return response.json() as Promise<unknown>
}

function readLockboxTextEntry(payload: unknown, key: string) {
  if (!isRecord(payload) || !Array.isArray(payload.entries)) {
    throw new Error('Yandex Lockbox payload response is malformed')
  }

  const entry = payload.entries.find((candidate) => isRecord(candidate) && candidate.key === key)

  if (!isRecord(entry)) {
    throw new Error(`Yandex Lockbox payload does not contain key "${key}"`)
  }

  if (typeof entry.textValue === 'string') {
    return entry.textValue
  }

  if (typeof entry.binaryValue === 'string') {
    return Buffer.from(entry.binaryValue, 'base64').toString('utf8')
  }

  throw new Error(`Yandex Lockbox payload key "${key}" has no text or binary value`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function assertSafeIdentifier(identifier: string) {
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(identifier)) {
    throw new Error(`Unsafe PostgreSQL identifier: ${identifier}`)
  }
}

function quoteIdentifier(identifier: string) {
  assertSafeIdentifier(identifier)
  return `"${identifier}"`
}
