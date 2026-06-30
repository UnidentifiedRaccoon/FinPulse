export type AdminScope = {
  access: 'global_all_users'
  organizationFiltering: {
    enabled: false
    mode: 'not_enabled'
  }
  rbac: {
    enabled: false
  }
  reflectionAnswerText: {
    includedByDefault: false
  }
}

export type CurrentLesson = {
  levelSlug: string
  levelTitle: string
  sectionSlug: string
  sectionTitle: string
  lessonSlug: string
  lessonTitle: string
} | null

export type AdminSummaryResponse = {
  scope: AdminScope
  totals: {
    totalUsers: number
    activeUsersLast7Days: number
    usersWithProgress: number
    completedLessons: number
    completedCards: number
    stuckUsers: number
    totalLessons: number
    totalCards: number
    stuckThresholdDays: number
  }
}

export type AdminUserSummary = {
  id: string
  login: string
  createdAt: string
  progress: {
    viewedLessons: number
    completedLessons: number
    totalLessons: number
    completedCards: number
    totalCards: number
    currentLesson: CurrentLesson
    lastActivityAt: string | null
    stuckDays: number | null
    isStuck: boolean
  }
}

export type AdminUsersResponse = {
  scope: AdminScope
  page: {
    limit: number
    offset: number
    total: number
  }
  totals: {
    totalLessons: number
    totalCards: number
    stuckThresholdDays: number
  }
  users: AdminUserSummary[]
}

export type LessonProgressStatus = 'not_started' | 'viewed' | 'completed'

export type AdminUserProgressResponse = {
  scope: AdminScope
  privacy: {
    reflectionAnswerTextIncluded: false
  }
  user: {
    id: string
    login: string
    createdAt: string
  }
  totals: {
    totalLessons: number
    totalCards: number
  }
  lessons: Array<{
    levelSlug: string
    levelTitle: string
    sectionSlug: string
    sectionTitle: string
    lessonSlug: string
    lessonTitle: string
    status: LessonProgressStatus
    viewedAt: string | null
    completedAt: string | null
    updatedAt: string | null
    cards: Array<{
      cardId: string
      cardType: string
      cardTitle: string | null
      status: LessonProgressStatus
      viewedAt: string | null
      completedAt: string | null
      updatedAt: string | null
    }>
  }>
}

export type AdminMeResponse = {
  admin: {
    login: string
  }
  scope: AdminScope
}

export type AdminContentCardNode = {
  id: string
  type: string
  title: string | null
  order: number
}

export type AdminContentTreeResponse = {
  scope: AdminScope
  tree: {
    program: {
      slug: string
      title: string
    }
    levels: Array<{
      slug: string
      title: string
      revision: number
      sections: Array<{
        slug: string
        title: string
        revision: number
        lessons: Array<{
          slug: string
          title: string
          revision: number
          cards: AdminContentCardNode[]
        }>
      }>
    }>
  }
}

export type AdminContentSelection =
  | {
      kind: 'level'
      levelSlug: string
    }
  | {
      kind: 'section'
      levelSlug: string
      sectionSlug: string
    }
  | {
      kind: 'card'
      levelSlug: string
      sectionSlug: string
      lessonSlug: string
      cardId: string
    }

export type AdminContentPreview = {
  kind: AdminContentSelection['kind']
  revision: number
  slice: unknown
  preview: Record<string, unknown>
}

export type AdminContentPreviewResponse = {
  scope: AdminScope
  preview: AdminContentPreview
}
