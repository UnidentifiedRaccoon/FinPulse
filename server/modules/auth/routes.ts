import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import type { AppDatabase } from '../../db/connection'
import { sendError } from '../../lib/http'
import { hashPassword, isPasswordTooLongForHash, verifyPassword } from '../../lib/password'
import {
  clearSessionCookie,
  createSession,
  destroySession,
  getSessionUser,
  SESSION_COOKIE_NAME,
  setSessionCookie,
  type SessionCookieOptions,
} from '../../lib/sessions'

const USERNAME_LOGIN_PATTERN = /^[a-zA-Z0-9._-]+$/
const EMAIL_LOGIN_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AUTH_PAYLOAD_MESSAGE = 'Введите email или логин и пароль'

const authBodySchema = z.object({
  login: z
    .string()
    .trim()
    .min(3)
    .max(254)
    .refine(isSupportedLogin)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
}).strict()

type UserRow = {
  id: string
  login: string
  password_hash: string
}

export function registerAuthRoutes(app: FastifyInstance, db: AppDatabase, cookieOptions: SessionCookieOptions) {
  app.post('/api/auth/register', async (request, reply) => {
    const parsed = authBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_auth_payload', AUTH_PAYLOAD_MESSAGE)
    }
    if (isPasswordTooLongForHash(parsed.data.password)) {
      return sendError(reply, 400, 'password_too_long', 'Password is too long')
    }

    const now = new Date().toISOString()
    const userId = randomUUID()
    const passwordHash = await hashPassword(parsed.data.password)

    try {
      db.prepare(
        `INSERT INTO users (id, login, password_hash, created_at)
         VALUES (?, ?, ?, ?)`,
      ).run(userId, parsed.data.login, passwordHash, now)
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return sendError(reply, 409, 'login_taken', 'Такой email или логин уже зарегистрирован')
      }

      throw error
    }

    const { sessionId } = createSession(db, userId)
    setSessionCookie(reply, sessionId, cookieOptions)

    return reply.code(201).send({
      user: {
        id: userId,
        login: parsed.data.login,
      },
    })
  })

  app.post('/api/auth/login', async (request, reply) => {
    const parsed = authBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_auth_payload', AUTH_PAYLOAD_MESSAGE)
    }
    if (isPasswordTooLongForHash(parsed.data.password)) {
      return sendError(reply, 400, 'password_too_long', 'Password is too long')
    }

    const user = db
      .prepare('SELECT id, login, password_hash FROM users WHERE login = ?')
      .get(parsed.data.login) as UserRow | undefined

    if (!user) {
      return sendError(reply, 401, 'invalid_credentials', 'Неверный email, логин или пароль')
    }

    const passwordMatches = await verifyPassword(parsed.data.password, user.password_hash)
    if (!passwordMatches) {
      return sendError(reply, 401, 'invalid_credentials', 'Неверный email, логин или пароль')
    }

    const existingSessionId = request.cookies[SESSION_COOKIE_NAME]
    destroySession(db, existingSessionId)

    const { sessionId } = createSession(db, user.id)
    setSessionCookie(reply, sessionId, cookieOptions)

    return {
      user: {
        id: user.id,
        login: user.login,
      },
    }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    destroySession(db, request.cookies[SESSION_COOKIE_NAME])
    clearSessionCookie(reply, cookieOptions)

    return reply.code(204).send()
  })

  app.get('/api/auth/me', async (request, reply) => {
    const user = getSessionUser(db, request)

    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    return { user }
  })
}

function isSupportedLogin(value: string) {
  return (value.length <= 64 && USERNAME_LOGIN_PATTERN.test(value)) || EMAIL_LOGIN_PATTERN.test(value)
}

function isUniqueConstraintError(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code.includes('SQLITE_CONSTRAINT'),
  )
}
