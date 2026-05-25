import type { FastifyReply, FastifyRequest } from 'fastify'
import { randomBytes } from 'node:crypto'

import type { AppDatabase } from '../db/connection'

export const SESSION_COOKIE_NAME = 'finpulse_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export type SessionUser = {
  id: string
  login: string
}

export type SessionCookieOptions = {
  secure: boolean
}

type SessionRow = {
  user_id: string
  login: string
}

export function createSession(db: AppDatabase, userId: string, now = new Date()) {
  const sessionId = randomBytes(32).toString('base64url')
  const createdAt = now.toISOString()
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000).toISOString()

  db.prepare(
    `INSERT INTO sessions (id, user_id, created_at, expires_at)
     VALUES (?, ?, ?, ?)`,
  ).run(sessionId, userId, createdAt, expiresAt)

  return { sessionId, expiresAt }
}

export function setSessionCookie(reply: FastifyReply, sessionId: string, options: SessionCookieOptions) {
  reply.setCookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: options.secure,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export function clearSessionCookie(reply: FastifyReply, options: SessionCookieOptions) {
  reply.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: options.secure,
    path: '/',
  })
}

export function destroySession(db: AppDatabase, sessionId: string | undefined) {
  if (!sessionId) return
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
}

export function getSessionUser(db: AppDatabase, request: FastifyRequest, now = new Date()): SessionUser | null {
  const sessionId = request.cookies[SESSION_COOKIE_NAME]
  if (!sessionId) return null

  const row = db
    .prepare(
      `SELECT sessions.user_id, users.login
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = ? AND sessions.expires_at > ?`,
    )
    .get(sessionId, now.toISOString()) as SessionRow | undefined

  if (!row) return null

  return {
    id: row.user_id,
    login: row.login,
  }
}
