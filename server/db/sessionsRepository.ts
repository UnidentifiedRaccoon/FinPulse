import type { Pool, QueryResultRow } from 'pg'

import { queryOne, toRequiredIsoTimestamp, toTimestampParam } from './query'

export type SessionRecord = {
  id: string
  userId: string
  createdAt: string
  expiresAt: string
}

export type SessionUserRecord = {
  id: string
  login: string
  createdAt: string
}

export type CreateSessionInput = {
  id: string
  userId: string
  createdAt: Date | string
  expiresAt: Date | string
}

type SessionRow = QueryResultRow & {
  id: string
  user_id: string
  created_at: Date | string
  expires_at: Date | string
}

type SessionUserRow = QueryResultRow & {
  user_id: string
  login: string
  created_at: Date | string
}

export class SessionsRepository {
  private readonly pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const row = await queryOne<SessionRow>(
      this.pool,
      `INSERT INTO sessions (id, user_id, created_at, expires_at)
       VALUES ($1, $2::uuid, $3::timestamptz, $4::timestamptz)
       RETURNING id, user_id, created_at, expires_at`,
      [
        input.id,
        input.userId,
        toTimestampParam(input.createdAt),
        toTimestampParam(input.expiresAt),
      ],
    )

    if (!row) {
      throw new Error('Expected inserted session row')
    }

    return {
      id: row.id,
      userId: row.user_id,
      createdAt: toRequiredIsoTimestamp(row.created_at),
      expiresAt: toRequiredIsoTimestamp(row.expires_at),
    }
  }

  async deleteSession(sessionId: string | undefined): Promise<void> {
    if (!sessionId) return

    await this.pool.query('DELETE FROM sessions WHERE id = $1', [sessionId])
  }

  async findSessionUser(sessionId: string | undefined, now: Date | string = new Date()): Promise<SessionUserRecord | null> {
    if (!sessionId) return null

    const row = await queryOne<SessionUserRow>(
      this.pool,
      `SELECT sessions.user_id, users.login, users.created_at
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = $1
         AND sessions.expires_at > $2::timestamptz`,
      [sessionId, toTimestampParam(now)],
    )

    if (!row) return null

    return {
      id: row.user_id,
      login: row.login,
      createdAt: toRequiredIsoTimestamp(row.created_at),
    }
  }
}
