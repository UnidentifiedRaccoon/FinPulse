import { X } from 'lucide-react'

import { formatDateTime, statusLabel } from '../../lib/format'
import type { AdminUserProgressResponse, LessonProgressStatus } from '../../lib/types'

type UserProgressDetailProps = {
  detail: AdminUserProgressResponse | null
  isLoading: boolean
  error: string | null
  onClose: () => void
}

export function UserProgressDetail({ detail, isLoading, error, onClose }: UserProgressDetailProps) {
  return (
    <aside className="detail-panel" aria-label="Детали пользователя">
      <div className="detail-header">
        <div>
          <p className="panel-label">Детали пользователя</p>
          <h2>{detail?.user.login ?? 'Выберите пользователя'}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть детали">
          <X size={18} />
        </button>
      </div>

      {isLoading ? (
        <div className="detail-loading" role="status">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="empty-state error">
          <h3>Не удалось загрузить детали</h3>
          <p>{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && !detail ? (
        <div className="empty-state">
          <h3>Нет выбранной строки</h3>
          <p>Откройте пользователя в таблице, чтобы увидеть уроки и timestamps.</p>
        </div>
      ) : null}

      {!isLoading && !error && detail ? (
        <>
          <div className="lesson-list">
            {detail.lessons.map((lesson) => (
              <article className="lesson-detail" key={lesson.lessonSlug}>
                <div className="lesson-detail-main">
                  <div>
                    <h3>{lesson.lessonTitle}</h3>
                    <p>{lesson.sectionTitle}</p>
                  </div>
                  <StatusBadge status={lesson.status} />
                </div>
                <dl className="timestamp-grid">
                  <div>
                    <dt>Просмотр</dt>
                    <dd>{formatDateTime(lesson.viewedAt)}</dd>
                  </div>
                  <div>
                    <dt>Завершение</dt>
                    <dd>{formatDateTime(lesson.completedAt)}</dd>
                  </div>
                  <div>
                    <dt>Обновление</dt>
                    <dd>{formatDateTime(lesson.updatedAt)}</dd>
                  </div>
                </dl>
                <div className="card-progress-list" aria-label={`Карточки урока ${lesson.lessonTitle}`}>
                  {lesson.cards.map((card) => (
                    <div className="card-progress-row" key={card.cardId}>
                      <span>{card.cardTitle ?? card.cardId}</span>
                      <StatusBadge status={card.status} compact />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </aside>
  )
}

function StatusBadge({ status, compact = false }: { status: LessonProgressStatus; compact?: boolean }) {
  return <span className={`status-badge ${status} ${compact ? 'compact' : ''}`}>{statusLabel(status)}</span>
}
