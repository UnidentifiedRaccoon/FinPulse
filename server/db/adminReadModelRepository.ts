import type { Pool, QueryResultRow } from 'pg'

import { queryMany, queryOne, toIsoTimestamp, toRequiredIsoTimestamp } from './query'

export type AdminUserSummaryRow = {
  id: string
  login: string
  createdAt: string
  viewedLessons: number
  completedLessons: number
  completedCards: number
  lastActivityAt: string | null
}

export type AdminOverviewRow = {
  totalUsers: number
  activeUsersLast7Days: number
  usersWithProgress: number
  completedLessons: number
  completedCards: number
  stuckUsers: number
}

export type AdminLessonProgressRow = {
  userId: string
  lessonSlug: string
  viewedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export type AdminCardProgressRow = {
  userId: string
  cardId: string
  viewedAt: string | null
  completedAt: string | null
  updatedAt: string
}

type ListUsersInput = {
  search: string | null
  limit: number
  offset: number
  lessonSlugs: string[]
  cardIds: string[]
}

type OverviewInput = {
  lessonSlugs: string[]
  cardIds: string[]
  totalLessons: number
  stuckThresholdDays: number
  now: Date
}

type UserSummaryQueryRow = QueryResultRow & {
  id: string
  login: string
  created_at: Date | string
  viewed_lessons: string | number
  completed_lessons: string | number
  completed_cards: string | number
  last_activity_at: Date | string | null
  total_count: string | number
}

type OverviewQueryRow = QueryResultRow & {
  total_users: string | number
  active_users_last_7_days: string | number
  users_with_progress: string | number
  completed_lessons: string | number
  completed_cards: string | number
  stuck_users: string | number
}

type UserRow = QueryResultRow & {
  id: string
  login: string
  created_at: Date | string
}

type LessonProgressQueryRow = QueryResultRow & {
  user_id: string
  lesson_slug: string
  viewed_at: Date | string | null
  completed_at: Date | string | null
  updated_at: Date | string
}

type CardProgressQueryRow = QueryResultRow & {
  user_id: string
  card_id: string
  viewed_at: Date | string | null
  completed_at: Date | string | null
  updated_at: Date | string
}

export class AdminReadModelRepository {
  private readonly pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  async listUserSummaries(input: ListUsersInput): Promise<{ users: AdminUserSummaryRow[]; total: number }> {
    const rows = await queryMany<UserSummaryQueryRow>(
      this.pool,
      `WITH filtered_users AS (
         SELECT id, login, created_at
         FROM users
         WHERE $1::text IS NULL OR lower(login) LIKE '%' || lower($1::text) || '%'
       ),
       lesson_counts AS (
         SELECT user_id,
                count(*) FILTER (WHERE viewed_at IS NOT NULL) AS viewed_lessons,
                count(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_lessons
         FROM lesson_progress
         WHERE lesson_slug = ANY($2::text[])
         GROUP BY user_id
       ),
       card_counts AS (
         SELECT user_id,
                count(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_cards
         FROM card_progress
         WHERE card_id = ANY($3::text[])
         GROUP BY user_id
       ),
       activity AS (
         SELECT user_id, max(updated_at) AS last_activity_at
         FROM (
           SELECT user_id, updated_at FROM lesson_progress
           UNION ALL
           SELECT user_id, updated_at FROM card_progress
           UNION ALL
           SELECT user_id, updated_at FROM reflection_answers
         ) events
         GROUP BY user_id
       ),
       total AS (
         SELECT count(*) AS total_count FROM filtered_users
       )
       SELECT filtered_users.id,
              filtered_users.login,
              filtered_users.created_at,
              COALESCE(lesson_counts.viewed_lessons, 0) AS viewed_lessons,
              COALESCE(lesson_counts.completed_lessons, 0) AS completed_lessons,
              COALESCE(card_counts.completed_cards, 0) AS completed_cards,
              activity.last_activity_at,
              total.total_count
       FROM filtered_users
       CROSS JOIN total
       LEFT JOIN lesson_counts ON lesson_counts.user_id = filtered_users.id
       LEFT JOIN card_counts ON card_counts.user_id = filtered_users.id
       LEFT JOIN activity ON activity.user_id = filtered_users.id
       ORDER BY COALESCE(activity.last_activity_at, filtered_users.created_at) DESC, filtered_users.login ASC
       LIMIT $4 OFFSET $5`,
      [input.search, input.lessonSlugs, input.cardIds, input.limit, input.offset],
    )

    return {
      users: rows.map(toUserSummary),
      total: rows[0] ? toNumber(rows[0].total_count) : await this.countUsers(input.search),
    }
  }

  async getOverview(input: OverviewInput): Promise<AdminOverviewRow> {
    const row = await queryOne<OverviewQueryRow>(
      this.pool,
      `WITH lesson_counts AS (
         SELECT user_id,
                count(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_lessons
         FROM lesson_progress
         WHERE lesson_slug = ANY($1::text[])
         GROUP BY user_id
       ),
       card_counts AS (
         SELECT user_id,
                count(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_cards
         FROM card_progress
         WHERE card_id = ANY($2::text[])
         GROUP BY user_id
       ),
       activity AS (
         SELECT user_id, max(updated_at) AS last_activity_at
         FROM (
           SELECT user_id, updated_at FROM lesson_progress
           UNION ALL
           SELECT user_id, updated_at FROM card_progress
           UNION ALL
           SELECT user_id, updated_at FROM reflection_answers
         ) events
         GROUP BY user_id
       )
       SELECT count(users.id) AS total_users,
              count(users.id) FILTER (WHERE activity.last_activity_at >= $3::timestamptz - interval '7 days') AS active_users_last_7_days,
              count(users.id) FILTER (WHERE activity.last_activity_at IS NOT NULL) AS users_with_progress,
              COALESCE(sum(lesson_counts.completed_lessons), 0) AS completed_lessons,
              COALESCE(sum(card_counts.completed_cards), 0) AS completed_cards,
              count(users.id) FILTER (
                WHERE activity.last_activity_at IS NOT NULL
                  AND activity.last_activity_at <= $3::timestamptz - ($5::int * interval '1 day')
                  AND COALESCE(lesson_counts.completed_lessons, 0) < $4::int
              ) AS stuck_users
       FROM users
       LEFT JOIN lesson_counts ON lesson_counts.user_id = users.id
       LEFT JOIN card_counts ON card_counts.user_id = users.id
       LEFT JOIN activity ON activity.user_id = users.id`,
      [input.lessonSlugs, input.cardIds, input.now.toISOString(), input.totalLessons, input.stuckThresholdDays],
    )

    return {
      totalUsers: toNumber(row?.total_users ?? 0),
      activeUsersLast7Days: toNumber(row?.active_users_last_7_days ?? 0),
      usersWithProgress: toNumber(row?.users_with_progress ?? 0),
      completedLessons: toNumber(row?.completed_lessons ?? 0),
      completedCards: toNumber(row?.completed_cards ?? 0),
      stuckUsers: toNumber(row?.stuck_users ?? 0),
    }
  }

  async findUser(userId: string): Promise<{ id: string; login: string; createdAt: string } | null> {
    const row = await queryOne<UserRow>(
      this.pool,
      `SELECT id, login, created_at
       FROM users
       WHERE id = $1::uuid
       LIMIT 1`,
      [userId],
    )

    return row
      ? {
          id: row.id,
          login: row.login,
          createdAt: toRequiredIsoTimestamp(row.created_at),
        }
      : null
  }

  async listLessonProgressForUsers(userIds: string[], lessonSlugs: string[]): Promise<AdminLessonProgressRow[]> {
    if (userIds.length === 0) return []

    const rows = await queryMany<LessonProgressQueryRow>(
      this.pool,
      `SELECT user_id, lesson_slug, viewed_at, completed_at, updated_at
       FROM lesson_progress
       WHERE user_id = ANY($1::uuid[]) AND lesson_slug = ANY($2::text[])`,
      [userIds, lessonSlugs],
    )

    return rows.map(toLessonProgress)
  }

  async listLessonProgressForUser(userId: string, lessonSlugs: string[]): Promise<AdminLessonProgressRow[]> {
    return this.listLessonProgressForUsers([userId], lessonSlugs)
  }

  async listCardProgressForUser(userId: string, cardIds: string[]): Promise<AdminCardProgressRow[]> {
    const rows = await queryMany<CardProgressQueryRow>(
      this.pool,
      `SELECT user_id, card_id, viewed_at, completed_at, updated_at
       FROM card_progress
       WHERE user_id = $1::uuid AND card_id = ANY($2::text[])`,
      [userId, cardIds],
    )

    return rows.map(toCardProgress)
  }

  private async countUsers(search: string | null) {
    const row = await queryOne<QueryResultRow & { total_count: string | number }>(
      this.pool,
      `SELECT count(*) AS total_count
       FROM users
       WHERE $1::text IS NULL OR lower(login) LIKE '%' || lower($1::text) || '%'`,
      [search],
    )

    return toNumber(row?.total_count ?? 0)
  }
}

function toUserSummary(row: UserSummaryQueryRow): AdminUserSummaryRow {
  return {
    id: row.id,
    login: row.login,
    createdAt: toRequiredIsoTimestamp(row.created_at),
    viewedLessons: toNumber(row.viewed_lessons),
    completedLessons: toNumber(row.completed_lessons),
    completedCards: toNumber(row.completed_cards),
    lastActivityAt: toIsoTimestamp(row.last_activity_at),
  }
}

function toLessonProgress(row: LessonProgressQueryRow): AdminLessonProgressRow {
  return {
    userId: row.user_id,
    lessonSlug: row.lesson_slug,
    viewedAt: toIsoTimestamp(row.viewed_at),
    completedAt: toIsoTimestamp(row.completed_at),
    updatedAt: toRequiredIsoTimestamp(row.updated_at),
  }
}

function toCardProgress(row: CardProgressQueryRow): AdminCardProgressRow {
  return {
    userId: row.user_id,
    cardId: row.card_id,
    viewedAt: toIsoTimestamp(row.viewed_at),
    completedAt: toIsoTimestamp(row.completed_at),
    updatedAt: toRequiredIsoTimestamp(row.updated_at),
  }
}

function toNumber(value: string | number) {
  return typeof value === 'number' ? value : Number(value)
}
