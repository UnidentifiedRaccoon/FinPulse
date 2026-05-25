import type Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const schemaPath = join(dirname(fileURLToPath(import.meta.url)), 'schema.sql')

export function runMigrations(db: Database.Database) {
  const schemaSql = readFileSync(schemaPath, 'utf8')
  db.exec(schemaSql)
}
