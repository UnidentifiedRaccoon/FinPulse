import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { AdminUserProgressResponse } from '../../lib/types'

import { UserProgressDetail } from './UserProgressDetail'

const detail: AdminUserProgressResponse = {
  scope: {
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
  },
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
      cards: [
        {
          cardId: 'card_l1s1l1_05_surprise_reflection',
          cardType: 'reflection',
          cardTitle: 'Неожиданная трата',
          status: 'completed',
          viewedAt: '2026-06-10T10:15:00.000Z',
          completedAt: '2026-06-10T10:16:00.000Z',
          updatedAt: '2026-06-10T10:16:00.000Z',
        },
      ],
    },
  ],
}

describe('UserProgressDetail', () => {
  it('renders lesson statuses without private reflection answer text', () => {
    const { container } = render(
      <UserProgressDetail
        detail={detail}
        isLoading={false}
        error={null}
        onClose={() => undefined}
      />,
    )

    expect(screen.getByText('learner.email@example.com')).toBeInTheDocument()
    expect(screen.getByText('Куда уходят деньги')).toBeInTheDocument()
    expect(screen.getAllByText('Завершён').length).toBeGreaterThan(0)
    expect(screen.queryByText('Тексты reflection/artifact ответов в этот борд не включаются.')).not.toBeInTheDocument()
    expect(container).not.toHaveTextContent('СЕКРЕТНЫЙ личный ответ')
    expect(container).not.toHaveTextContent('singleValue')
    expect(container).not.toHaveTextContent('answer_json')
  })

  it('renders loading and error states', () => {
    const { rerender } = render(
      <UserProgressDetail detail={null} isLoading error={null} onClose={() => undefined} />,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(<UserProgressDetail detail={null} isLoading={false} error="Backend unavailable" onClose={() => undefined} />)
    expect(screen.getByText('Не удалось загрузить детали')).toBeInTheDocument()
    expect(screen.getByText('Backend unavailable')).toBeInTheDocument()
  })
})
