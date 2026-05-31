import { randomUUID } from 'node:crypto'
import type { Pool, QueryResultRow } from 'pg'

import { queryOne, toRequiredIsoTimestamp, toTimestampParam } from './query'

export type UserRecord = {
  id: string
  login: string
  passwordHash: string
  createdAt: string
}

export type CreateUserInput = {
  id?: string
  login: string
  passwordHash: string
  createdAt?: Date | string
}

export type CreateUserResult =
  | {
      ok: true
      user: UserRecord
    }
  | {
      ok: false
      reason: 'login_taken'
    }

type UserRow = QueryResultRow & {
  id: string
  login: string
  password_hash: string
  created_at: Date | string
}

export class UsersRepository {
  private readonly pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  async createUser(input: CreateUserInput): Promise<CreateUserResult> {
    const createdAt = toTimestampParam(input.createdAt ?? new Date())

    try {
      const row = await queryOne<UserRow>(
        this.pool,
        `INSERT INTO users (id, login, password_hash, created_at)
         VALUES ($1, $2, $3, $4::timestamptz)
         RETURNING id, login, password_hash, created_at`,
        [input.id ?? randomUUID(), input.login, input.passwordHash, createdAt],
      )

      if (!row) {
        throw new Error('Expected inserted user row')
      }

      return {
        ok: true,
        user: toUserRecord(row),
      }
    } catch (error) {
      if (isUniqueViolation(error)) {
        return {
          ok: false,
          reason: 'login_taken',
        }
      }

      throw error
    }
  }

  async findUserByLogin(login: string): Promise<UserRecord | null> {
    const row = await queryOne<UserRow>(
      this.pool,
      `SELECT id, login, password_hash, created_at
       FROM users
       WHERE lower(login) = lower($1)
       LIMIT 1`,
      [login],
    )

    return row ? toUserRecord(row) : null
  }

  async findUserById(userId: string): Promise<UserRecord | null> {
    const row = await queryOne<UserRow>(
      this.pool,
      `SELECT id, login, password_hash, created_at
       FROM users
       WHERE id = $1::uuid`,
      [userId],
    )

    return row ? toUserRecord(row) : null
  }
}

function toUserRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    login: row.login,
    passwordHash: row.password_hash,
    createdAt: toRequiredIsoTimestamp(row.created_at),
  }
}

function isUniqueViolation(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code === '23505',
  )
}
