import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastify, { type FastifyBaseLogger, type FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { openDatabase, type AppDatabase } from './db/connection'
import { sendError } from './lib/http'
import { registerAuthRoutes } from './modules/auth/routes'
import { createContentService } from './modules/content/contentService'
import { registerContentRoutes } from './modules/content/routes'
import { registerProgressRoutes } from './modules/progress/routes'

export type CreateAppOptions = {
  dbPath?: string
  contentRoot?: string
  cookieSecure?: boolean
  corsOrigin?: string | string[] | false
  logger?: boolean | FastifyBaseLogger
}

export type CreatedApp = {
  app: FastifyInstance
  db: AppDatabase
}

type CorsOriginOption = string | string[] | false | undefined
type CorsOriginCallback = (error: Error | null, origin: string | boolean) => void

export async function createApp(options: CreateAppOptions = {}): Promise<CreatedApp> {
  const db = openDatabase({
    path: options.dbPath ?? process.env.FINPULSE_DB_PATH ?? 'data/finpulse.sqlite',
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

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return sendError(reply, 400, 'invalid_request', 'Request payload is invalid')
    }

    app.log.error(error)
    return sendError(reply, 500, 'internal_error', 'Internal server error')
  })

  app.setNotFoundHandler((_request, reply) => sendError(reply, 404, 'not_found', 'Route not found'))

  app.get('/api/health', async () => ({
    ok: true,
  }))

  registerAuthRoutes(app, db, {
    secure: options.cookieSecure ?? process.env.FINPULSE_COOKIE_SECURE === 'true',
  })
  registerContentRoutes(app, content)
  registerProgressRoutes(app, db, content)

  app.addHook('onClose', async () => {
    db.close()
  })

  return { app, db }
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
