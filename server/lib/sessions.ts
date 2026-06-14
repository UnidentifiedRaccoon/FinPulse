import type { FastifyReply, FastifyRequest } from 'fastify'
import { randomBytes } from 'node:crypto'

import type { AppDatabase } from '../db/connection'

export const SESSION_COOKIE_NAME = 'finpulse_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export type SessionUser = {
  id: string
  login: string
  createdAt: string
}

export type SessionCookieOptions = {
  secure: boolean
}

export async function createSession(db: AppDatabase, userId: string, now = new Date()) {
  const sessionId = randomBytes(32).toString('base64url')
  const createdAt = now.toISOString()
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000).toISOString()

  await db.sessions.createSession({
    id: sessionId,
    userId,
    createdAt,
    expiresAt,
  })

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

export async function destroySession(db: AppDatabase, sessionId: string | undefined) {
  await db.sessions.deleteSession(sessionId)
}

export async function getSessionUser(
  db: AppDatabase,
  request: FastifyRequest,
  now = new Date(),
): Promise<SessionUser | null> {
  const sessionId = request.cookies[SESSION_COOKIE_NAME]
  if (!sessionId) return null

  const row = await db.sessions.findSessionUser(sessionId, now)

  if (!row) return null

  return {
    id: row.id,
    login: row.login,
    createdAt: row.createdAt,
  }
}
