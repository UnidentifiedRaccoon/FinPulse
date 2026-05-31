import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Pool } from 'pg'

const schemaPath = resolveSchemaPath()

export async function runMigrations(pool: Pool) {
  const schemaSql = await readFile(schemaPath, 'utf8')
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    await client.query(schemaSql)
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

function resolveSchemaPath() {
  return process.env.FINPULSE_SCHEMA_SQL_PATH ?? resolve(process.cwd(), 'server/db/schema.sql')
}
