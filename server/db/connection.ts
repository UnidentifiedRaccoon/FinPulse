import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import { runMigrations } from './migrate'

export type AppDatabase = Database.Database

export type DatabaseConfig = {
  path: string
}

export function openDatabase(config: DatabaseConfig): AppDatabase {
  if (config.path !== ':memory:') {
    mkdirSync(dirname(resolve(config.path)), { recursive: true })
  }

  const db = new Database(config.path)
  db.pragma('foreign_keys = ON')
  runMigrations(db)

  return db
}
