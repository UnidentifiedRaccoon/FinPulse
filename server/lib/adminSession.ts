import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

import type { FastifyReply, FastifyRequest } from 'fastify'

export const ADMIN_SESSION_COOKIE_NAME = 'finpulse_admin_session'

const DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

export type AdminAuthConfigInput = {
  login?: string
  passwordHash?: string
  sessionSecret?: string
  sessionMaxAgeSeconds?: number
}

export type AdminAuthConfig = {
  login: string
  passwordHash: string
  sessionSecret: string
  sessionMaxAgeSeconds: number
}

export type AdminSession = {
  login: string
  expiresAt: string
}

type AdminSessionPayload = {
  login: string
  expiresAt: string
  nonce: string
}

type AdminSessionCookieOptions = {
  secure: boolean
}

export function resolveAdminAuthConfig(input: AdminAuthConfigInput | undefined = {}): AdminAuthConfig | null {
  const login = normalizeLogin(input.login ?? process.env.FINPULSE_ADMIN_LOGIN)
  const passwordHash = normalizeRequired(input.passwordHash ?? process.env.FINPULSE_ADMIN_PASSWORD_HASH)
  const sessionSecret = normalizeRequired(input.sessionSecret ?? process.env.FINPULSE_ADMIN_SESSION_SECRET)
  const sessionMaxAgeSeconds =
    input.sessionMaxAgeSeconds ??
    parsePositiveInteger(process.env.FINPULSE_ADMIN_SESSION_MAX_AGE_SECONDS) ??
    DEFAULT_ADMIN_SESSION_MAX_AGE_SECONDS

  if (!login || !passwordHash || !sessionSecret) {
    return null
  }

  return {
    login,
    passwordHash,
    sessionSecret,
    sessionMaxAgeSeconds,
  }
}

export function setAdminSessionCookie(
  reply: FastifyReply,
  config: AdminAuthConfig,
  options: AdminSessionCookieOptions,
  now = new Date(),
) {
  const expiresAt = new Date(now.getTime() + config.sessionMaxAgeSeconds * 1000).toISOString()
  const payload: AdminSessionPayload = {
    login: config.login,
    expiresAt,
    nonce: randomBytes(16).toString('base64url'),
  }
  const token = signAdminSessionPayload(payload, config.sessionSecret)

  reply.setCookie(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: options.secure,
    path: '/',
    maxAge: config.sessionMaxAgeSeconds,
  })
}

export function clearAdminSessionCookie(reply: FastifyReply, options: AdminSessionCookieOptions) {
  reply.clearCookie(ADMIN_SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: options.secure,
    path: '/',
  })
}

export function getAdminSession(
  config: AdminAuthConfig,
  request: FastifyRequest,
  now = new Date(),
): AdminSession | null {
  const token = request.cookies[ADMIN_SESSION_COOKIE_NAME]
  if (!token) return null

  const payload = verifyAdminSessionToken(token, config.sessionSecret)
  if (!payload) return null

  if (payload.login !== config.login) return null
  if (Number.isNaN(Date.parse(payload.expiresAt)) || new Date(payload.expiresAt) <= now) return null

  return {
    login: payload.login,
    expiresAt: payload.expiresAt,
  }
}

export function normalizeAdminLogin(value: string) {
  return normalizeLogin(value) ?? ''
}

function signAdminSessionPayload(payload: AdminSessionPayload, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = createSignature(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

function verifyAdminSessionToken(token: string, secret: string): AdminSessionPayload | null {
  const [encodedPayload, signature, extra] = token.split('.')
  if (!encodedPayload || !signature || extra !== undefined) return null

  const expectedSignature = createSignature(encodedPayload, secret)
  if (!safeEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as unknown
    if (!isAdminSessionPayload(payload)) return null
    return {
      login: normalizeAdminLogin(payload.login),
      expiresAt: payload.expiresAt,
      nonce: payload.nonce,
    }
  } catch {
    return null
  }
}

function createSignature(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

function isAdminSessionPayload(value: unknown): value is AdminSessionPayload {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof (value as AdminSessionPayload).login === 'string' &&
      typeof (value as AdminSessionPayload).expiresAt === 'string' &&
      typeof (value as AdminSessionPayload).nonce === 'string',
  )
}

function normalizeLogin(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  return normalized ? normalized : null
}

function normalizeRequired(value: string | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function parsePositiveInteger(value: string | undefined) {
  if (!value?.trim()) return null
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}
