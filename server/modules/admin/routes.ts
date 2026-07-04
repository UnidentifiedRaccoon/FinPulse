import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import type { AppDatabase } from '../../db/connection'
import type { AdminCardProgressRow, AdminLessonProgressRow, AdminUserSummaryRow } from '../../db/adminReadModelRepository'
import {
  clearAdminSessionCookie,
  getAdminSession,
  normalizeAdminLogin,
  resolveAdminAuthConfig,
  setAdminSessionCookie,
  type AdminAuthConfig,
  type AdminAuthConfigInput,
} from '../../lib/adminSession'
import { sendError } from '../../lib/http'
import { isPasswordTooLongForHash, verifyPassword } from '../../lib/password'
import type { ContentPreviewInput, ContentService, ContentUpdateInput, LearningCatalogLesson } from '../content/contentService'
import { ContentConfigurationError } from '../content/contentDocuments'

const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 100
const DEFAULT_STUCK_THRESHOLD_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000

const adminLoginBodySchema = z.object({
  login: z.string().trim().min(1).max(254).transform(normalizeAdminLogin),
  password: z.string().min(1).max(128),
}).strict()

const adminUsersQuerySchema = z.object({
  search: z.string().trim().max(254).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  stuckThresholdDays: z.coerce.number().int().min(1).max(365).optional(),
}).strict()

const adminSummaryQuerySchema = z.object({
  stuckThresholdDays: z.coerce.number().int().min(1).max(365).optional(),
}).strict()

const adminUserParamsSchema = z.object({
  userId: z.string().uuid(),
}).strict()

const adminContentPreviewQuerySchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('level'),
    levelSlug: z.string().min(1),
  }).strict(),
  z.object({
    kind: z.literal('section'),
    levelSlug: z.string().min(1),
    sectionSlug: z.string().min(1),
  }).strict(),
  z.object({
    kind: z.literal('card'),
    levelSlug: z.string().min(1),
    sectionSlug: z.string().min(1),
    lessonSlug: z.string().min(1),
    cardId: z.string().min(1),
  }).strict(),
])

const adminContentUpdateBodySchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('level'),
    levelSlug: z.string().min(1),
    revision: z.number().int().positive(),
    slice: z.unknown(),
  }).strict(),
  z.object({
    kind: z.literal('section'),
    levelSlug: z.string().min(1),
    sectionSlug: z.string().min(1),
    revision: z.number().int().positive(),
    slice: z.unknown(),
  }).strict(),
  z.object({
    kind: z.literal('card'),
    levelSlug: z.string().min(1),
    sectionSlug: z.string().min(1),
    lessonSlug: z.string().min(1),
    cardId: z.string().min(1),
    revision: z.number().int().positive(),
    slice: z.unknown(),
  }).strict(),
])

type AdminCookieOptions = {
  secure: boolean
}

type RegisterAdminRoutesOptions = {
  auth?: AdminAuthConfigInput
  cookie: AdminCookieOptions
}

type Catalog = {
  lessons: LearningCatalogLesson[]
  lessonSlugs: string[]
  cardIds: string[]
  totalLessons: number
  totalCards: number
}

type LessonStatus = 'not_started' | 'viewed' | 'completed'

export function registerAdminRoutes(
  app: FastifyInstance,
  db: AppDatabase,
  content: ContentService,
  options: RegisterAdminRoutesOptions,
) {
  const authConfig = resolveAdminAuthConfig(options.auth)

  app.post('/api/admin/auth/login', async (request, reply) => {
    setNoStore(reply)

    if (!authConfig) {
      return sendError(reply, 503, 'admin_not_configured', 'Admin access is not configured')
    }

    const parsed = adminLoginBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_admin_auth_payload', 'Admin login payload is invalid')
    }
    if (isPasswordTooLongForHash(parsed.data.password)) {
      return sendError(reply, 400, 'password_too_long', 'Password is too long')
    }

    const loginMatches = parsed.data.login === authConfig.login
    const passwordMatches = loginMatches && (await verifyPassword(parsed.data.password, authConfig.passwordHash))
    if (!passwordMatches) {
      return sendError(reply, 401, 'invalid_admin_credentials', 'Invalid admin login or password')
    }

    setAdminSessionCookie(reply, authConfig, options.cookie)
    return {
      admin: {
        login: authConfig.login,
      },
      scope: adminScope(),
    }
  })

  app.post('/api/admin/auth/logout', async (_request, reply) => {
    setNoStore(reply)
    clearAdminSessionCookie(reply, options.cookie)
    return reply.code(204).send()
  })

  app.get('/api/admin/auth/me', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return

    return {
      admin: {
        login: session.login,
      },
      scope: adminScope(),
    }
  })

  app.get('/api/admin/summary', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return
    if (rejectUnsupportedQuery(request.query, reply)) return

    const parsed = adminSummaryQuerySchema.safeParse(request.query ?? {})
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_admin_query', 'Admin query is invalid')
    }

    const catalog = getCatalog(content)
    const stuckThresholdDays = parsed.data.stuckThresholdDays ?? DEFAULT_STUCK_THRESHOLD_DAYS
    const overview = await db.adminReadModel.getOverview({
      lessonSlugs: catalog.lessonSlugs,
      cardIds: catalog.cardIds,
      totalLessons: catalog.totalLessons,
      stuckThresholdDays,
      now: new Date(),
    })

    return {
      scope: adminScope(),
      totals: {
        ...overview,
        totalLessons: catalog.totalLessons,
        totalCards: catalog.totalCards,
        stuckThresholdDays,
      },
    }
  })

  app.get('/api/admin/users', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return
    if (rejectUnsupportedQuery(request.query, reply)) return

    const parsed = adminUsersQuerySchema.safeParse(request.query ?? {})
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_admin_query', 'Admin query is invalid')
    }

    const catalog = getCatalog(content)
    const stuckThresholdDays = parsed.data.stuckThresholdDays ?? DEFAULT_STUCK_THRESHOLD_DAYS
    const search = parsed.data.search ? parsed.data.search.toLowerCase() : null
    const limit = parsed.data.limit ?? DEFAULT_PAGE_SIZE
    const offset = parsed.data.offset ?? 0
    const now = new Date()
    const result = await db.adminReadModel.listUserSummaries({
      search,
      limit,
      offset,
      lessonSlugs: catalog.lessonSlugs,
      cardIds: catalog.cardIds,
    })
    const lessonProgress = await db.adminReadModel.listLessonProgressForUsers(
      result.users.map((user) => user.id),
      catalog.lessonSlugs,
    )

    return {
      scope: adminScope(),
      page: {
        limit,
        offset,
        total: result.total,
      },
      totals: {
        totalLessons: catalog.totalLessons,
        totalCards: catalog.totalCards,
        stuckThresholdDays,
      },
      users: result.users.map((user) =>
        toAdminUserSummary(user, {
          catalog,
          lessonProgress: lessonProgress.filter((entry) => entry.userId === user.id),
          stuckThresholdDays,
          now,
        }),
      ),
    }
  })

  app.get('/api/admin/users/:userId/progress', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return
    if (rejectUnsupportedQuery(request.query, reply)) return

    const parsed = adminUserParamsSchema.safeParse(request.params)
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_admin_user_id', 'Admin user id is invalid')
    }

    const catalog = getCatalog(content)
    const user = await db.adminReadModel.findUser(parsed.data.userId)
    if (!user) {
      return sendError(reply, 404, 'not_found', 'User not found')
    }

    const [lessonProgress, cardProgress] = await Promise.all([
      db.adminReadModel.listLessonProgressForUser(user.id, catalog.lessonSlugs),
      db.adminReadModel.listCardProgressForUser(user.id, catalog.cardIds),
    ])
    const lessonProgressBySlug = new Map(lessonProgress.map((entry) => [entry.lessonSlug, entry]))
    const cardProgressById = new Map(cardProgress.map((entry) => [entry.cardId, entry]))

    return {
      scope: adminScope(),
      privacy: {
        reflectionAnswerTextIncluded: false,
      },
      user,
      totals: {
        totalLessons: catalog.totalLessons,
        totalCards: catalog.totalCards,
      },
      lessons: catalog.lessons.map((lesson) => {
        const progress = lessonProgressBySlug.get(lesson.lessonSlug) ?? null
        return {
          levelSlug: lesson.levelSlug,
          levelTitle: lesson.levelTitle,
          sectionSlug: lesson.sectionSlug,
          sectionTitle: lesson.sectionTitle,
          lessonSlug: lesson.lessonSlug,
          lessonTitle: lesson.lessonTitle,
          lessonOrder: lesson.lessonOrder,
          status: toStatus(progress),
          viewedAt: progress?.viewedAt ?? null,
          completedAt: progress?.completedAt ?? null,
          updatedAt: progress?.updatedAt ?? null,
          cards: lesson.cards.map((card) => {
            const cardProgressEntry = cardProgressById.get(card.cardId) ?? null
            return {
              cardId: card.cardId,
              cardType: card.cardType,
              cardTitle: card.cardTitle,
              cardOrder: card.order,
              status: toStatus(cardProgressEntry),
              viewedAt: cardProgressEntry?.viewedAt ?? null,
              completedAt: cardProgressEntry?.completedAt ?? null,
              updatedAt: cardProgressEntry?.updatedAt ?? null,
            }
          }),
        }
      }),
    }
  })

  app.get('/api/admin/content/tree', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return
    if (rejectUnsupportedQuery(request.query, reply)) return

    return {
      scope: adminScope(),
      tree: content.getContentTree(),
    }
  })

  app.get('/api/admin/content/preview', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return
    if (rejectUnsupportedQuery(request.query, reply)) return

    const parsed = adminContentPreviewQuerySchema.safeParse(request.query ?? {})
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_admin_content_query', 'Admin content preview query is invalid')
    }

    const preview = content.getContentPreview(parsed.data as ContentPreviewInput)
    if (!preview) {
      return sendError(reply, 404, 'not_found', 'Content selection not found')
    }

    return {
      scope: adminScope(),
      preview,
    }
  })

  app.put('/api/admin/content/slices', async (request, reply) => {
    const session = requireAdminSession(authConfig, request, reply)
    if (!session) return

    const parsed = adminContentUpdateBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return sendError(reply, 400, 'invalid_admin_content_payload', 'Admin content update payload is invalid')
    }

    try {
      const result = await content.updateContentSlice(parsed.data as ContentUpdateInput)
      if (!result) {
        return sendError(reply, 404, 'not_found', 'Content selection not found')
      }

      if (result.status === 'conflict') {
        return sendError(reply, 409, 'content_revision_conflict', 'Content was changed by another save. Reload and try again.')
      }

      return {
        scope: adminScope(),
        preview: result.preview,
      }
    } catch (error) {
      if (error instanceof ContentConfigurationError) {
        return sendError(reply, 400, 'invalid_admin_content_update', error.message)
      }

      throw error
    }
  })
}

function requireAdminSession(
  config: AdminAuthConfig | null,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  setNoStore(reply)

  if (!config) {
    sendError(reply, 503, 'admin_not_configured', 'Admin access is not configured')
    return null
  }

  const session = getAdminSession(config, request)
  if (!session) {
    sendError(reply, 401, 'admin_unauthenticated', 'Admin authentication is required')
    return null
  }

  return session
}

function rejectUnsupportedQuery(query: unknown, reply: FastifyReply) {
  if (!query || typeof query !== 'object') return false
  const params = query as Record<string, unknown>

  if ('organizationId' in params) {
    sendError(reply, 400, 'organization_filtering_not_enabled', 'Organization filtering is not enabled for admin yet')
    return true
  }

  if ('includeAnswers' in params || 'fields' in params) {
    sendError(reply, 400, 'private_answer_fields_not_supported', 'Private answer fields are not available in admin responses')
    return true
  }

  return false
}

function setNoStore(reply: FastifyReply) {
  reply.header('Cache-Control', 'no-store')
}

function getCatalog(content: ContentService): Catalog {
  const lessons = content.getLearningCatalog()
  const cardIds = lessons.flatMap((lesson) => lesson.cards.map((card) => card.cardId))
  return {
    lessons,
    lessonSlugs: lessons.map((lesson) => lesson.lessonSlug),
    cardIds,
    totalLessons: lessons.length,
    totalCards: cardIds.length,
  }
}

function toAdminUserSummary(
  user: AdminUserSummaryRow,
  context: {
    catalog: Catalog
    lessonProgress: AdminLessonProgressRow[]
    stuckThresholdDays: number
    now: Date
  },
) {
  const stuckDays = getStuckDays(user.lastActivityAt, user.completedLessons, context.catalog.totalLessons, context.now)

  return {
    id: user.id,
    login: user.login,
    createdAt: user.createdAt,
    progress: {
      viewedLessons: user.viewedLessons,
      completedLessons: user.completedLessons,
      totalLessons: context.catalog.totalLessons,
      completedCards: user.completedCards,
      totalCards: context.catalog.totalCards,
      currentLesson: getCurrentLesson(context.catalog.lessons, context.lessonProgress),
      lastActivityAt: user.lastActivityAt,
      stuckDays,
      isStuck: stuckDays !== null && stuckDays >= context.stuckThresholdDays,
    },
  }
}

function getCurrentLesson(lessons: LearningCatalogLesson[], progressRows: AdminLessonProgressRow[]) {
  const progressBySlug = new Map(progressRows.map((entry) => [entry.lessonSlug, entry]))
  const viewedIncomplete = progressRows
    .filter((entry) => entry.viewedAt && !entry.completedAt)
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))[0]

  const current =
    (viewedIncomplete ? lessons.find((lesson) => lesson.lessonSlug === viewedIncomplete.lessonSlug) : null) ??
    lessons.find((lesson) => !progressBySlug.get(lesson.lessonSlug)?.completedAt) ??
    null

  return current
    ? {
        levelSlug: current.levelSlug,
        levelTitle: current.levelTitle,
        sectionSlug: current.sectionSlug,
        sectionTitle: current.sectionTitle,
        lessonSlug: current.lessonSlug,
        lessonTitle: current.lessonTitle,
      }
    : null
}

function getStuckDays(lastActivityAt: string | null, completedLessons: number, totalLessons: number, now: Date) {
  if (!lastActivityAt || completedLessons >= totalLessons) return null

  return Math.max(0, Math.floor((now.getTime() - Date.parse(lastActivityAt)) / DAY_MS))
}

function toStatus(progress: AdminLessonProgressRow | AdminCardProgressRow | null): LessonStatus {
  if (progress?.completedAt) return 'completed'
  if (progress?.viewedAt) return 'viewed'
  return 'not_started'
}

function adminScope() {
  return {
    access: 'global_all_users',
    organizationFiltering: {
      enabled: false,
      mode: 'not_enabled',
    },
    rbac: {
      enabled: false,
    },
    reflectionAnswerText: {
      includedByDefault: false,
    },
  } as const
}
