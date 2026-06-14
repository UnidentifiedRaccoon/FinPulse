import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { AdminUserSummary } from '../../lib/types'

import { UsersTable } from './UsersTable'

const userRow: AdminUserSummary = {
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
}

describe('UsersTable', () => {
  it('renders user progress summary and opens details from a row', async () => {
    const onSelectUser = vi.fn()
    const actor = userEvent.setup()

    render(
      <UsersTable
        users={[userRow]}
        isLoading={false}
        selectedUserId={null}
        onSelectUser={onSelectUser}
      />,
    )

    expect(screen.getByText('learner.email@example.com')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByText('6 / 16')).toBeInTheDocument()
    expect(screen.getByText('Обязательное и желаемое')).toBeInTheDocument()
    expect(screen.getByText('4 дн.')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Пользователь' })).toHaveClass('sticky-table-header', 'sticky-login-column')

    const loginCell = screen.getByText('learner.email@example.com').closest('td')
    if (!loginCell) {
      throw new Error('Expected login cell to exist')
    }
    expect(loginCell).toHaveClass('sticky-login-column')

    await actor.click(screen.getByRole('button', { name: 'Открыть детали learner.email@example.com' }))
    expect(onSelectUser).toHaveBeenCalledWith(userRow.id)
  })

  it('renders an empty state', () => {
    render(<UsersTable users={[]} isLoading={false} selectedUserId={null} onSelectUser={() => undefined} />)

    expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument()
  })
})
