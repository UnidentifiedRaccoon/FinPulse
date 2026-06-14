import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { adminApi } from '../../lib/adminApi'
import type { AdminMeResponse, AdminSummaryResponse, AdminUserProgressResponse, AdminUsersResponse } from '../../lib/types'

import { AdminDashboard } from './AdminDashboard'
import { DETAIL_PANEL_STORAGE_KEY } from './usePersistedDetailPanelWidth'

vi.mock('../../lib/adminApi', async () => {
  const actual = await vi.importActual<typeof import('../../lib/adminApi')>('../../lib/adminApi')

  return {
    AdminApiError: actual.AdminApiError,
    adminApi: {
      getMe: vi.fn(),
      getSummary: vi.fn(),
      getUsers: vi.fn(),
      getUserProgress: vi.fn(),
      logout: vi.fn(),
    },
  }
})

const scope = {
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

const meResponse: AdminMeResponse = {
  admin: {
    login: 'admin@example.com',
  },
  scope,
}

const summaryResponse: AdminSummaryResponse = {
  scope,
  totals: {
    totalUsers: 1,
    activeUsersLast7Days: 1,
    usersWithProgress: 1,
    completedLessons: 1,
    completedCards: 6,
    totalLessons: 2,
    totalCards: 16,
    stuckUsers: 0,
    stuckThresholdDays: 7,
  },
}

const usersResponse: AdminUsersResponse = {
  scope,
  page: {
    limit: 50,
    offset: 0,
    total: 1,
  },
  totals: {
    totalLessons: 2,
    totalCards: 16,
    stuckThresholdDays: 7,
  },
  users: [
    {
      id: '7b38ac4c-6e21-44ca-b66c-2f2c0143c817',
      login: 'learner.email@example.com',
      createdAt: '2026-06-01T10:00:00.000Z',
      progress: {
        viewedLessons: 2,
        completedLessons: 1,
        totalLessons: 2,
        completedCards: 6,
        totalCards: 16,
        currentLesson: {
          levelSlug: 'level-1-start',
          levelTitle: 'Уровень 1 · Старт',
          sectionSlug: 'money-and-operations',
          sectionTitle: 'Раздел 1. Деньги и операции',
          lessonSlug: 'mandatory-and-desired',
          lessonTitle: 'Обязательное и желаемое',
        },
        lastActivityAt: '2026-06-10T10:00:00.000Z',
        stuckDays: 4,
        isStuck: false,
      },
    },
  ],
}

const detailResponse: AdminUserProgressResponse = {
  scope,
  privacy: {
    reflectionAnswerTextIncluded: false,
  },
  user: {
    id: '7b38ac4c-6e21-44ca-b66c-2f2c0143c817',
    login: 'learner.email@example.com',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  totals: {
    totalLessons: 2,
    totalCards: 16,
  },
  lessons: [
    {
      levelSlug: 'level-1-start',
      levelTitle: 'Уровень 1 · Старт',
      sectionSlug: 'money-and-operations',
      sectionTitle: 'Раздел 1. Деньги и операции',
      lessonSlug: 'where-money-goes',
      lessonTitle: 'Куда уходят деньги',
      status: 'completed',
      viewedAt: '2026-06-10T10:00:00.000Z',
      completedAt: '2026-06-10T10:30:00.000Z',
      updatedAt: '2026-06-10T10:30:00.000Z',
      cards: [],
    },
  ],
}

describe('AdminDashboard split layout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    setViewportWidth(1400)
    vi.mocked(adminApi.getMe).mockResolvedValue(meResponse)
    vi.mocked(adminApi.getSummary).mockResolvedValue(summaryResponse)
    vi.mocked(adminApi.getUsers).mockResolvedValue(usersResponse)
    vi.mocked(adminApi.getUserProgress).mockResolvedValue(detailResponse)
    vi.mocked(adminApi.logout).mockResolvedValue(undefined)
  })

  it('opens and collapses the resizable detail panel with the default width', async () => {
    const actor = userEvent.setup()
    render(<AdminDashboard />)

    await screen.findByText('learner.email@example.com')
    expect(screen.queryByRole('separator', { name: 'Изменить ширину деталей пользователя' })).not.toBeInTheDocument()

    await actor.click(screen.getByRole('button', { name: 'Открыть детали learner.email@example.com' }))

    const separator = await screen.findByRole('separator', { name: 'Изменить ширину деталей пользователя' })
    expect(separator).toHaveAttribute('aria-valuenow', '520')
    expect(screen.getByTestId('admin-dashboard-grid')).toHaveClass('has-detail')
    expect(screen.queryByRole('button', { name: 'Сбросить ширину панели' })).not.toBeInTheDocument()

    await actor.click(screen.getByRole('button', { name: 'Закрыть детали' }))
    expect(screen.queryByRole('separator', { name: 'Изменить ширину деталей пользователя' })).not.toBeInTheDocument()
    expect(screen.getByTestId('admin-dashboard-grid')).toHaveClass('detail-collapsed')
  })

  it('restores, clamps, and resizes the detail width', async () => {
    const actor = userEvent.setup()
    window.localStorage.setItem(DETAIL_PANEL_STORAGE_KEY, '720')
    render(<AdminDashboard />)

    await screen.findByText('learner.email@example.com')
    await actor.click(screen.getByRole('button', { name: 'Открыть детали learner.email@example.com' }))

    const separator = await screen.findByRole('separator', { name: 'Изменить ширину деталей пользователя' })
    await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '720'))

    separator.focus()
    await actor.keyboard('{ArrowLeft}')
    await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '744'))

    await actor.keyboard('{End}{ArrowLeft}')
    await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '760'))

    await actor.keyboard('{Home}{ArrowRight}')
    await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '480'))

    await actor.keyboard('{ArrowLeft}')
    await waitFor(() => {
      expect(separator).toHaveAttribute('aria-valuenow', '504')
      expect(window.localStorage.getItem(DETAIL_PANEL_STORAGE_KEY)).toBe('504')
    })
  })
})

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
}
