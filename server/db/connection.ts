import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from 'pg'

import { ProgressRepository } from './progressRepository'
import { ReflectionAnswersRepository } from './reflectionAnswersRepository'
import { runMigrations } from './migrate'
import { SessionsRepository } from './sessionsRepository'
import { UsersRepository } from './usersRepository'

const DEFAULT_LOCAL_DATABASE_URL = 'postgres://finpulse:finpulse@127.0.0.1:5432/finpulse'

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
  FINPULSE_DATABASE_SSLMODE?: string
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

  const pool = new Pool(toPoolConfig(config))

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

  return url.toString()
}

function toPoolConfig(config: DatabaseConfig): PoolConfig {
  const connectionString = config.connectionString ?? config.databaseUrl ?? resolveDatabaseUrl()

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

function assertSafeIdentifier(identifier: string) {
  if (!/^[a-z_][a-z0-9_]{0,62}$/.test(identifier)) {
    throw new Error(`Unsafe PostgreSQL identifier: ${identifier}`)
  }
}

function quoteIdentifier(identifier: string) {
  assertSafeIdentifier(identifier)
  return `"${identifier}"`
}
