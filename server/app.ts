import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastify, { type FastifyBaseLogger, type FastifyInstance, type FastifyReply } from 'fastify'
import { ZodError } from 'zod'

import { openDatabase, type AppDatabase } from './db/connection'
import type { AdminAuthConfigInput } from './lib/adminSession'
import { sendError } from './lib/http'
import { clearSessionCookie, destroySession, SESSION_COOKIE_NAME, type SessionCookieOptions } from './lib/sessions'
import { registerAdminRoutes } from './modules/admin/routes'
import { registerAuthRoutes } from './modules/auth/routes'
import { createContentService } from './modules/content/contentService'
import { registerContentRoutes } from './modules/content/routes'
import { registerProgressRoutes } from './modules/progress/routes'
import { registerReflectionRoutes } from './modules/reflections/routes'

export type CreateAppOptions = {
  databaseUrl?: string
  databaseSchema?: string
  resetDatabaseSchema?: boolean
  dropDatabaseSchemaOnClose?: boolean
  databasePoolMax?: number
  contentRoot?: string
  staticRoot?: string | false
  cookieSecure?: boolean
  corsOrigin?: string | string[] | false
  adminAuth?: AdminAuthConfigInput
  logger?: boolean | FastifyBaseLogger
}

export type CreatedApp = {
  app: FastifyInstance
  db: AppDatabase
}

type CorsOriginOption = string | string[] | false | undefined
type CorsOriginCallback = (error: Error | null, origin: string | boolean) => void

export async function createApp(options: CreateAppOptions = {}): Promise<CreatedApp> {
  const db = await openDatabase({
    databaseUrl: options.databaseUrl,
    schema: options.databaseSchema,
    resetSchema: options.resetDatabaseSchema,
    dropSchemaOnClose: options.dropDatabaseSchemaOnClose,
    max: options.databasePoolMax,
  })
  const content = createContentService(options.contentRoot)
  const app = fastify({
    logger: options.logger ?? false,
  })

  await app.register(cookie)
  await app.register(cors, {
    origin: resolveCorsOrigin(options.corsOrigin ?? process.env.FINPULSE_CORS_ORIGIN),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  })

  const sessionCookieOptions: SessionCookieOptions = {
    secure: options.cookieSecure ?? process.env.FINPULSE_COOKIE_SECURE === 'true',
  }

  app.setErrorHandler(async (error, request, reply) => {
    if (isEmptyJsonBodyError(error) && request.method === 'POST' && getRequestPathname(request.url) === '/api/auth/logout') {
      await destroySession(db, request.cookies[SESSION_COOKIE_NAME])
      clearSessionCookie(reply, sessionCookieOptions)
      return reply.code(204).send()
    }

    if (error instanceof ZodError) {
      return sendError(reply, 400, 'invalid_request', 'Request payload is invalid')
    }

    app.log.error(error)
    return sendError(reply, 500, 'internal_error', 'Internal server error')
  })

  app.get('/api/health', async () => ({
    ok: true,
  }))

  app.get('/api/readyz', async (_request, reply) => {
    try {
      await db.query('SELECT 1')
      return {
        ok: true,
        database: true,
      }
    } catch {
      app.log.warn('readiness check failed')
      reply.code(503)
      return {
        ok: false,
        database: false,
      }
    }
  })

  registerAuthRoutes(app, db, sessionCookieOptions)
  registerContentRoutes(app, content)
  registerProgressRoutes(app, db, content)
  registerReflectionRoutes(app, db, content)
  registerAdminRoutes(app, db, content, {
    auth: options.adminAuth,
    cookie: sessionCookieOptions,
  })

  app.addHook('onClose', async () => {
    await db.close()
  })

  registerNotFoundHandler(app, resolveStaticRoot(options.staticRoot))

  return { app, db }
}

function isEmptyJsonBodyError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'FST_ERR_CTP_EMPTY_JSON_BODY'
}

function resolveStaticRoot(configured: string | false | undefined) {
  if (configured === false) {
    return null
  }

  const root = configured ?? process.env.FINPULSE_STATIC_ROOT
  return root ? resolve(root) : null
}

function registerNotFoundHandler(app: FastifyInstance, staticRoot: string | null) {
  app.setNotFoundHandler(async (request, reply) => {
    const pathname = getRequestPathname(request.url)

    if (pathname.startsWith('/api/')) {
      return sendError(reply, 404, 'not_found', 'Route not found')
    }

    if (!staticRoot) {
      return sendError(reply, 404, 'not_found', 'Route not found')
    }

    return serveSpaAsset(reply, staticRoot, pathname)
  })
}

function getRequestPathname(requestUrl: string) {
  try {
    return new URL(requestUrl, 'http://localhost').pathname
  } catch {
    return '/'
  }
}

async function serveSpaAsset(reply: FastifyReply, staticRoot: string, pathname: string) {
  const relativePath = normalizeStaticPath(pathname)
  const indexPath = resolve(staticRoot, 'index.html')

  if (relativePath) {
    const assetPath = resolve(staticRoot, relativePath)
    if (isInsideRoot(staticRoot, assetPath) && (await isFile(assetPath))) {
      return sendStaticFile(reply, assetPath)
    }
  }

  if (await isFile(indexPath)) {
    return sendStaticFile(reply, indexPath, 'text/html; charset=utf-8')
  }

  return sendError(reply, 404, 'not_found', 'Static frontend is not available')
}

function normalizeStaticPath(pathname: string) {
  let decoded: string
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return null
  }

  const withoutLeadingSlash = decoded.replace(/^\/+/, '')
  return withoutLeadingSlash && !withoutLeadingSlash.includes('\0') ? withoutLeadingSlash : null
}

function isInsideRoot(root: string, candidate: string) {
  const normalizedRoot = resolve(root)
  const normalizedCandidate = resolve(candidate)
  return normalizedCandidate === normalizedRoot || normalizedCandidate.startsWith(`${normalizedRoot}${sep}`)
}

async function isFile(filePath: string) {
  try {
    return (await stat(filePath)).isFile()
  } catch {
    return false
  }
}

function sendStaticFile(reply: FastifyReply, filePath: string, contentType = contentTypeFor(filePath)) {
  return reply.type(contentType).send(createReadStream(filePath))
}

function contentTypeFor(filePath: string) {
  switch (extname(filePath).toLowerCase()) {
    case '.css':
      return 'text/css; charset=utf-8'
    case '.html':
      return 'text/html; charset=utf-8'
    case '.ico':
      return 'image/x-icon'
    case '.js':
    case '.mjs':
      return 'text/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.webp':
      return 'image/webp'
    case '.woff':
      return 'font/woff'
    case '.woff2':
      return 'font/woff2'
    default:
      return 'application/octet-stream'
  }
}

function resolveCorsOrigin(configured: CorsOriginOption) {
  if (configured === false) {
    return false
  }

  if (Array.isArray(configured)) {
    return configured
  }

  if (typeof configured === 'string') {
    const origins = configured
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)

    if (origins.length === 1) {
      return origins[0]
    }

    if (origins.length > 1) {
      return origins
    }
  }

  return allowLocalDevOrigin
}

function allowLocalDevOrigin(origin: string | undefined, callback: CorsOriginCallback) {
  if (!origin) {
    callback(null, false)
    return
  }

  callback(null, isLocalLoopbackOrigin(origin) ? origin : false)
}

function isLocalLoopbackOrigin(origin: string) {
  try {
    const url = new URL(origin)
    return url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]', '::1'].includes(url.hostname)
  } catch {
    return false
  }
}
