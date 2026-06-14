import { ChevronRight } from 'lucide-react'

import { formatDateTime, formatRatio, stuckLabel } from '../../lib/format'
import type { AdminUserSummary } from '../../lib/types'

type UsersTableProps = {
  users: AdminUserSummary[]
  isLoading: boolean
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
}

export function UsersTable({ users, isLoading, selectedUserId, onSelectUser }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="table-state" role="status">
        <div className="skeleton table-skeleton" />
        <div className="skeleton table-skeleton" />
        <div className="skeleton table-skeleton short" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <h2>Пользователи не найдены</h2>
        <p>Попробуйте изменить строку поиска или обновить данные.</p>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="users-table">
        <thead>
          <tr>
            <th className="sticky-table-header sticky-login-column">Пользователь</th>
            <th className="sticky-table-header">Уроки</th>
            <th className="sticky-table-header">Карточки</th>
            <th className="sticky-table-header">Текущий урок</th>
            <th className="sticky-table-header">Последняя активность</th>
            <th className="sticky-table-header">Застрял</th>
            <th className="sticky-table-header" aria-label="Детали" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className={selectedUserId === user.id ? 'selected' : ''} key={user.id}>
              <td className="sticky-login-column">
                <button className="user-link" type="button" onClick={() => onSelectUser(user.id)}>
                  <span>{user.login}</span>
                  <small>{user.id.slice(0, 8)}</small>
                </button>
              </td>
              <td>{formatRatio(user.progress.completedLessons, user.progress.totalLessons)}</td>
              <td>{formatRatio(user.progress.completedCards, user.progress.totalCards)}</td>
              <td>
                {user.progress.currentLesson ? (
                  <span className="lesson-cell">
                    <span>{user.progress.currentLesson.lessonTitle}</span>
                    <small>{user.progress.currentLesson.sectionTitle}</small>
                  </span>
                ) : (
                  <span className="muted">нет текущего урока</span>
                )}
              </td>
              <td>{formatDateTime(user.progress.lastActivityAt)}</td>
              <td>
                <span className={`stuck-pill ${user.progress.isStuck ? 'active' : ''}`}>{stuckLabel(user.progress.stuckDays)}</span>
              </td>
              <td>
                <button className="icon-button" type="button" onClick={() => onSelectUser(user.id)} aria-label={`Открыть детали ${user.login}`}>
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
