import type { Pool, QueryResultRow } from 'pg'

import { queryMany, queryOne, toIsoTimestamp, toRequiredIsoTimestamp, toTimestampParam } from './query'

export type ProgressPatch = {
  viewed?: boolean
  completed?: boolean
}

export type LessonProgressEntry = {
  lessonSlug: string
  viewed: boolean
  completed: boolean
  viewedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export type CardProgressEntry = {
  cardId: string
  viewed: boolean
  completed: boolean
  viewedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export type ProgressState = {
  lessons: LessonProgressEntry[]
  cards: CardProgressEntry[]
}

type LessonProgressRow = QueryResultRow & {
  lesson_slug: string
  viewed_at: Date | string | null
  completed_at: Date | string | null
  updated_at: Date | string
}

type CardProgressRow = QueryResultRow & {
  card_id: string
  viewed_at: Date | string | null
  completed_at: Date | string | null
  updated_at: Date | string
}

type ExistingProgressRow = QueryResultRow & {
  viewed_at: Date | string | null
  completed_at: Date | string | null
}

type ResolvedProgressTimestamps = {
  viewedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export class ProgressRepository {
  private readonly pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  async getProgress(userId: string): Promise<ProgressState> {
    const [lessons, cards] = await Promise.all([
      queryMany<LessonProgressRow>(
        this.pool,
        `SELECT lesson_slug, viewed_at, completed_at, updated_at
         FROM lesson_progress
         WHERE user_id = $1::uuid
         ORDER BY updated_at DESC`,
        [userId],
      ),
      queryMany<CardProgressRow>(
        this.pool,
        `SELECT card_id, viewed_at, completed_at, updated_at
         FROM card_progress
         WHERE user_id = $1::uuid
         ORDER BY updated_at DESC`,
        [userId],
      ),
    ])

    return {
      lessons: lessons.map(toLessonProgressEntry),
      cards: cards.map(toCardProgressEntry),
    }
  }

  async upsertLessonProgress(
    userId: string,
    lessonSlug: string,
    input: ProgressPatch,
    now: Date | string = new Date(),
  ): Promise<void> {
    const existing = await queryOne<ExistingProgressRow>(
      this.pool,
      `SELECT viewed_at, completed_at
       FROM lesson_progress
       WHERE user_id = $1::uuid AND lesson_slug = $2`,
      [userId, lessonSlug],
    )
    const next = resolveProgressTimestamps(existing, input, now)

    await this.pool.query(
      `INSERT INTO lesson_progress (user_id, lesson_slug, viewed_at, completed_at, updated_at)
       VALUES ($1::uuid, $2, $3::timestamptz, $4::timestamptz, $5::timestamptz)
       ON CONFLICT (user_id, lesson_slug)
       DO UPDATE SET viewed_at = excluded.viewed_at,
                     completed_at = excluded.completed_at,
                     updated_at = excluded.updated_at`,
      [userId, lessonSlug, next.viewedAt, next.completedAt, next.updatedAt],
    )
  }

  async upsertCardProgress(
    userId: string,
    cardId: string,
    input: ProgressPatch,
    now: Date | string = new Date(),
  ): Promise<void> {
    const existing = await queryOne<ExistingProgressRow>(
      this.pool,
      `SELECT viewed_at, completed_at
       FROM card_progress
       WHERE user_id = $1::uuid AND card_id = $2`,
      [userId, cardId],
    )
    const next = resolveProgressTimestamps(existing, input, now)

    await this.pool.query(
      `INSERT INTO card_progress (user_id, card_id, viewed_at, completed_at, updated_at)
       VALUES ($1::uuid, $2, $3::timestamptz, $4::timestamptz, $5::timestamptz)
       ON CONFLICT (user_id, card_id)
       DO UPDATE SET viewed_at = excluded.viewed_at,
                     completed_at = excluded.completed_at,
                     updated_at = excluded.updated_at`,
      [userId, cardId, next.viewedAt, next.completedAt, next.updatedAt],
    )
  }
}

function resolveProgressTimestamps(
  existing: ExistingProgressRow | null,
  input: ProgressPatch,
  now: Date | string,
): ResolvedProgressTimestamps {
  const updatedAt = toTimestampParam(now)
  const shouldMarkViewed = input.viewed ?? input.completed ?? true
  const shouldMarkCompleted = input.completed

  const existingViewedAt = toIsoTimestamp(existing?.viewed_at ?? null)
  const existingCompletedAt = toIsoTimestamp(existing?.completed_at ?? null)
  const viewedAt = shouldMarkViewed ? (existingViewedAt ?? updatedAt) : null
  const completedAt =
    shouldMarkCompleted === undefined
      ? existingCompletedAt
      : shouldMarkCompleted
        ? (existingCompletedAt ?? updatedAt)
        : null

  return {
    viewedAt: completedAt ? (viewedAt ?? updatedAt) : viewedAt,
    completedAt,
    updatedAt,
  }
}

function toLessonProgressEntry(row: LessonProgressRow): LessonProgressEntry {
  const viewedAt = toIsoTimestamp(row.viewed_at)
  const completedAt = toIsoTimestamp(row.completed_at)

  return {
    lessonSlug: row.lesson_slug,
    viewed: Boolean(viewedAt),
    completed: Boolean(completedAt),
    viewedAt,
    completedAt,
    updatedAt: toRequiredIsoTimestamp(row.updated_at),
  }
}

function toCardProgressEntry(row: CardProgressRow): CardProgressEntry {
  const viewedAt = toIsoTimestamp(row.viewed_at)
  const completedAt = toIsoTimestamp(row.completed_at)

  return {
    cardId: row.card_id,
    viewed: Boolean(viewedAt),
    completed: Boolean(completedAt),
    viewedAt,
    completedAt,
    updatedAt: toRequiredIsoTimestamp(row.updated_at),
  }
}
