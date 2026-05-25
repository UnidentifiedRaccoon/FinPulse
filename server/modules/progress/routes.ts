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

type LessonProgressRow = {
  lesson_slug: string
  viewed_at: string | null
  completed_at: string | null
  updated_at: string
}

type CardProgressRow = {
  card_id: string
  viewed_at: string | null
  completed_at: string | null
  updated_at: string
}

type ExistingProgressRow = {
  viewed_at: string | null
  completed_at: string | null
}

export function registerProgressRoutes(app: FastifyInstance, db: AppDatabase, content: ContentService) {
  app.get('/api/progress', async (request, reply) => {
    const user = getSessionUser(db, request)
    if (!user) {
      return sendError(reply, 401, 'unauthenticated', 'Authentication is required')
    }

    return getProgress(db, user.id)
  })

  app.put('/api/progress/lessons/:lessonSlug', async (request, reply) => {
    const user = getSessionUser(db, request)
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

    upsertLessonProgress(db, user.id, params.lessonSlug, parsed.data)
    return getProgress(db, user.id)
  })

  app.put('/api/progress/cards/:cardId', async (request, reply) => {
    const user = getSessionUser(db, request)
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

    upsertCardProgress(db, user.id, params.cardId, parsed.data)
    return getProgress(db, user.id)
  })
}

export function getProgress(db: AppDatabase, userId: string) {
  const lessons = db
    .prepare(
      `SELECT lesson_slug, viewed_at, completed_at, updated_at
       FROM lesson_progress
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
    )
    .all(userId) as LessonProgressRow[]

  const cards = db
    .prepare(
      `SELECT card_id, viewed_at, completed_at, updated_at
       FROM card_progress
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
    )
    .all(userId) as CardProgressRow[]

  return {
    lessons: lessons.map((row) => ({
      lessonSlug: row.lesson_slug,
      viewed: Boolean(row.viewed_at),
      completed: Boolean(row.completed_at),
      viewedAt: row.viewed_at,
      completedAt: row.completed_at,
      updatedAt: row.updated_at,
    })),
    cards: cards.map((row) => ({
      cardId: row.card_id,
      viewed: Boolean(row.viewed_at),
      completed: Boolean(row.completed_at),
      viewedAt: row.viewed_at,
      completedAt: row.completed_at,
      updatedAt: row.updated_at,
    })),
  }
}

function upsertLessonProgress(
  db: AppDatabase,
  userId: string,
  lessonSlug: string,
  input: z.infer<typeof progressBodySchema>,
) {
  const existing = db
    .prepare('SELECT viewed_at, completed_at FROM lesson_progress WHERE user_id = ? AND lesson_slug = ?')
    .get(userId, lessonSlug) as ExistingProgressRow | undefined
  const next = resolveProgressTimestamps(existing, input)

  db.prepare(
    `INSERT INTO lesson_progress (user_id, lesson_slug, viewed_at, completed_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, lesson_slug)
     DO UPDATE SET viewed_at = excluded.viewed_at,
                   completed_at = excluded.completed_at,
                   updated_at = excluded.updated_at`,
  ).run(userId, lessonSlug, next.viewedAt, next.completedAt, next.updatedAt)
}

function upsertCardProgress(db: AppDatabase, userId: string, cardId: string, input: z.infer<typeof progressBodySchema>) {
  const existing = db
    .prepare('SELECT viewed_at, completed_at FROM card_progress WHERE user_id = ? AND card_id = ?')
    .get(userId, cardId) as ExistingProgressRow | undefined
  const next = resolveProgressTimestamps(existing, input)

  db.prepare(
    `INSERT INTO card_progress (user_id, card_id, viewed_at, completed_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, card_id)
     DO UPDATE SET viewed_at = excluded.viewed_at,
                   completed_at = excluded.completed_at,
                   updated_at = excluded.updated_at`,
  ).run(userId, cardId, next.viewedAt, next.completedAt, next.updatedAt)
}

function resolveProgressTimestamps(existing: ExistingProgressRow | undefined, input: z.infer<typeof progressBodySchema>) {
  const now = new Date().toISOString()
  const shouldMarkViewed = input.viewed ?? input.completed ?? true
  const shouldMarkCompleted = input.completed

  const viewedAt = shouldMarkViewed ? (existing?.viewed_at ?? now) : null
  const completedAt =
    shouldMarkCompleted === undefined ? (existing?.completed_at ?? null) : shouldMarkCompleted ? (existing?.completed_at ?? now) : null

  return {
    viewedAt: completedAt ? (viewedAt ?? now) : viewedAt,
    completedAt,
    updatedAt: now,
  }
}
