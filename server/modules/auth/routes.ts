import type { FastifyInstance } from 'fastify'
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
const AUTH_PAYLOAD_MESSAGE = 'Проверьте email или логин и пароль: логин от 3 символов, пароль от 8.'

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
    const passwordHash = await hashPassword(parsed.data.password)
    const createUserResult = await db.users.createUser({
      login: parsed.data.login,
      passwordHash,
      createdAt: now,
    })

    if (!createUserResult.ok) {
      return sendError(reply, 409, 'login_taken', 'Такой email или логин уже зарегистрирован')
    }

    const { user } = createUserResult
    const { sessionId } = await createSession(db, user.id)
    setSessionCookie(reply, sessionId, cookieOptions)

    return reply.code(201).send({
      user: {
        id: user.id,
        login: user.login,
        createdAt: user.createdAt,
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

    const user = await db.users.findUserByLogin(parsed.data.login)

    if (!user) {
      return sendError(reply, 401, 'invalid_credentials', 'Неверный email, логин или пароль')
    }

    const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash)
    if (!passwordMatches) {
      return sendError(reply, 401, 'invalid_credentials', 'Неверный email, логин или пароль')
    }

    const existingSessionId = request.cookies[SESSION_COOKIE_NAME]
    await destroySession(db, existingSessionId)

    const { sessionId } = await createSession(db, user.id)
    setSessionCookie(reply, sessionId, cookieOptions)

    return {
      user: {
        id: user.id,
        login: user.login,
        createdAt: user.createdAt,
      },
    }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    await destroySession(db, request.cookies[SESSION_COOKIE_NAME])
    clearSessionCookie(reply, cookieOptions)

    return reply.code(204).send()
  })

  app.get('/api/auth/me', async (request, reply) => {
    const user = await getSessionUser(db, request)

    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    return { user }
  })
}

function isSupportedLogin(value: string) {
  return (value.length <= 64 && USERNAME_LOGIN_PATTERN.test(value)) || EMAIL_LOGIN_PATTERN.test(value)
}
