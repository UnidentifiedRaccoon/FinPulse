import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import type { AppDatabase } from '../../db/connection'
import { sendError } from '../../lib/http'
import { getSessionUser } from '../../lib/sessions'
import type { ContentService } from '../content/contentService'

const progressBodySchema = z.object({
  viewed: z.boolean().optional(),
  completed: z.boolean().optional(),
}).strict()

const paramsSchema = z.object({
  lessonSlug: z.string().optional(),
  cardId: z.string().optional(),
}).strict()

export function registerProgressRoutes(app: FastifyInstance, db: AppDatabase, content: ContentService) {
  app.get('/api/progress', async (request, reply) => {
    const user = await getSessionUser(db, request)
    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    return db.progress.getProgress(user.id)
  })

  app.put('/api/progress/lessons/:lessonSlug', async (request, reply) => {
    const user = await getSessionUser(db, request)
    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    const params = paramsSchema.parse(request.params)
    if (!params.lessonSlug || !content.hasLesson(params.lessonSlug)) {
      return sendError(reply, 404, 'not_found', 'Lesson not found')
    }

    const parsed = progressBodySchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_progress_payload', 'Progress payload is invalid')
    }

    await db.progress.upsertLessonProgress(user.id, params.lessonSlug, parsed.data)
    return db.progress.getProgress(user.id)
  })

  app.put('/api/progress/cards/:cardId', async (request, reply) => {
    const user = await getSessionUser(db, request)
    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    const params = paramsSchema.parse(request.params)
    if (!params.cardId || !content.hasCard(params.cardId)) {
      return sendError(reply, 404, 'not_found', 'Card not found')
    }

    const parsed = progressBodySchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_progress_payload', 'Progress payload is invalid')
    }

    await db.progress.upsertCardProgress(user.id, params.cardId, parsed.data)
    return db.progress.getProgress(user.id)
  })
}
