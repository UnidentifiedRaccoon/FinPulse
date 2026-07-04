import { CheckCircle2, ChevronDown, Circle, Eye, X } from 'lucide-react'

import { formatDateTime, statusLabel } from '../../lib/format'
import type { AdminUserProgressResponse, LessonProgressStatus } from '../../lib/types'

type UserProgressDetailProps = {
  detail: AdminUserProgressResponse | null
  isLoading: boolean
  error: string | null
  onClose: () => void
}

type ProgressLesson = AdminUserProgressResponse['lessons'][number]
type ProgressCard = ProgressLesson['cards'][number]

type LessonView = ProgressLesson & {
  cards: ProgressCard[]
  completedCards: number
  latestActivityAt: string | null
  isCurrent: boolean
  openByDefault: boolean
}

type SectionView = {
  key: string
  levelTitle: string
  sectionTitle: string
  lessons: LessonView[]
  completedLessons: number
  totalLessons: number
  completedCards: number
  totalCards: number
  isCurrent: boolean
}

type CurrentPosition = {
  lesson: LessonView
  card: ProgressCard | null
  screenIndex: number
  screenTotal: number
  lastActivityAt: string | null
}

type ProgressViewModel = {
  sections: SectionView[]
  current: CurrentPosition | null
}

const CARD_TYPE_LABELS: Record<string, string> = {
  artifact: 'артефакт',
  categorization: 'сортировка',
  checklist: 'чек-лист',
  content: 'теория',
  multi_select: 'множественный выбор',
  reflection: 'рефлексия',
  scenario: 'сценарий',
  single_choice: 'один выбор',
  summary: 'итог',
  theory: 'теория',
  video: 'видео',
}

export function UserProgressDetail({ detail, isLoading, error, onClose }: UserProgressDetailProps) {
  const viewModel = detail ? buildProgressViewModel(detail) : null

  return (
    <aside className="detail-panel" aria-label="Детали пользователя">
      <div className="detail-sticky-region">
        <div className="detail-header">
          <div>
            <p className="panel-label">Детали пользователя</p>
            <h2>{detail?.user.login ?? 'Выберите пользователя'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть детали">
            <X size={18} />
          </button>
        </div>
        {!isLoading && !error && viewModel?.current ? <CurrentPositionCard position={viewModel.current} /> : null}
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
          {viewModel ? <ProgressMap viewModel={viewModel} /> : null}
        </>
      ) : null}
    </aside>
  )
}

function CurrentPositionCard({ position }: { position: CurrentPosition }) {
  const { lesson, card, screenIndex, screenTotal, lastActivityAt } = position

  return (
    <section className="current-position-card" aria-label="Текущая позиция">
      <div className="current-position-heading">
        <div>
          <p className="panel-label">Текущая позиция</p>
          <h3>{lesson.lessonTitle}</h3>
        </div>
        <StatusBadge status={lesson.status} />
      </div>
      <p className="progress-breadcrumb">
        {lesson.levelTitle} / {lesson.sectionTitle} / Урок {lesson.lessonOrder} / Экран {screenIndex} из {screenTotal}
      </p>
      <dl className="current-position-facts">
        <div>
          <dt>Экран</dt>
          <dd>{card ? screenTitle(card) : 'нет экранов'}</dd>
        </div>
        <div>
          <dt>Последняя активность</dt>
          <dd>{formatDateTime(lastActivityAt)}</dd>
        </div>
      </dl>
    </section>
  )
}

function ProgressMap({ viewModel }: { viewModel: ProgressViewModel }) {
  return (
    <section className="progress-map" aria-label="Карта прогресса">
      {viewModel.sections.map((section) => (
        <section className={`progress-section ${section.isCurrent ? 'current' : ''}`} key={section.key}>
          <div className="progress-section-heading">
            <div>
              <p>{section.levelTitle}</p>
              <h3>{section.sectionTitle}</h3>
            </div>
            <div className="progress-section-ratios" aria-label="Прогресс раздела">
              <span>{section.completedLessons} / {section.totalLessons} уроков</span>
              <span>{section.completedCards} / {section.totalCards} экранов</span>
            </div>
          </div>

          <div className="progress-lesson-list">
            {section.lessons.map((lesson) => (
              <details
                className={`progress-lesson ${lesson.isCurrent ? 'current' : ''}`}
                key={lesson.lessonSlug}
                open={lesson.openByDefault}
                aria-label={`Прогресс урока ${lesson.lessonTitle}`}
              >
                <summary className="progress-lesson-summary">
                  <span className="lesson-order-marker" aria-hidden="true">{lesson.lessonOrder}</span>
                  <span className="progress-lesson-copy">
                    <span className="progress-lesson-title">{lesson.lessonTitle}</span>
                    <span className="progress-lesson-meta">
                      Урок {lesson.lessonOrder} · {lesson.completedCards} / {lesson.cards.length} экранов · {formatDateTime(lesson.latestActivityAt)}
                    </span>
                  </span>
                  <StatusBadge status={lesson.status} compact />
                  <ChevronDown className="lesson-expand-icon" size={16} aria-hidden="true" />
                </summary>

                <ol className="screen-progress-list" aria-label={`Экраны урока ${lesson.lessonTitle}`}>
                  {lesson.cards.map((card) => (
                    <li
                      className={`screen-progress-item ${isCurrentCard(viewModel.current, lesson, card) ? 'current' : ''}`}
                      key={card.cardId}
                      aria-current={isCurrentCard(viewModel.current, lesson, card) ? 'step' : undefined}
                    >
                      <ScreenStatusIcon status={card.status} />
                      <div className="screen-progress-main">
                        <div className="screen-progress-title-row">
                          <span className="screen-number">Экран {card.cardOrder}</span>
                          <StatusBadge status={card.status} compact />
                        </div>
                        <span className="screen-title">{screenTitle(card)}</span>
                        <span className="screen-type">{cardTypeLabel(card.cardType)}</span>
                        <dl className="screen-timestamps">
                          <div>
                            <dt>Просмотр</dt>
                            <dd>{formatDateTime(card.viewedAt)}</dd>
                          </div>
                          <div>
                            <dt>Завершение</dt>
                            <dd>{formatDateTime(card.completedAt)}</dd>
                          </div>
                        </dl>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}

function StatusBadge({ status, compact = false }: { status: LessonProgressStatus; compact?: boolean }) {
  return <span className={`status-badge ${status} ${compact ? 'compact' : ''}`}>{statusLabel(status)}</span>
}

function ScreenStatusIcon({ status }: { status: LessonProgressStatus }) {
  if (status === 'completed') {
    return <CheckCircle2 className="screen-status-icon completed" size={18} aria-hidden="true" />
  }

  if (status === 'viewed') {
    return <Eye className="screen-status-icon viewed" size={18} aria-hidden="true" />
  }

  return <Circle className="screen-status-icon not_started" size={18} aria-hidden="true" />
}

function buildProgressViewModel(detail: AdminUserProgressResponse): ProgressViewModel {
  const lessons = detail.lessons.map<LessonView>((lesson) => {
    const cards = [...lesson.cards].sort((left, right) => left.cardOrder - right.cardOrder)

    return {
      ...lesson,
      cards,
      completedCards: cards.filter((card) => card.status === 'completed').length,
      latestActivityAt: latestTimestamp([lesson.updatedAt, ...cards.map((card) => card.updatedAt)]),
      isCurrent: false,
      openByDefault: false,
    }
  })

  const currentLesson = chooseCurrentLesson(lessons)
  const currentCard = currentLesson ? chooseCurrentCard(currentLesson.cards) : null
  const current: CurrentPosition | null = currentLesson
    ? {
        lesson: currentLesson,
        card: currentCard,
        screenIndex: currentCard ? currentCard.cardOrder : 0,
        screenTotal: currentLesson.cards.length,
        lastActivityAt: latestTimestamp(lessons.flatMap((lesson) => [lesson.updatedAt, ...lesson.cards.map((card) => card.updatedAt)])),
      }
    : null

  const currentLessonSlug = current?.lesson.lessonSlug ?? null
  const markedLessons = lessons.map<LessonView>((lesson) => ({
    ...lesson,
    isCurrent: lesson.lessonSlug === currentLessonSlug,
    openByDefault: lesson.lessonSlug === currentLessonSlug || lesson.status === 'viewed',
  }))

  const sectionsByKey = new Map<string, SectionView>()
  for (const lesson of markedLessons) {
    const key = `${lesson.levelSlug}/${lesson.sectionSlug}`
    const existing = sectionsByKey.get(key)

    if (existing) {
      existing.lessons.push(lesson)
      existing.completedLessons += lesson.status === 'completed' ? 1 : 0
      existing.totalLessons += 1
      existing.completedCards += lesson.completedCards
      existing.totalCards += lesson.cards.length
      existing.isCurrent = existing.isCurrent || lesson.isCurrent
      continue
    }

    sectionsByKey.set(key, {
      key,
      levelTitle: lesson.levelTitle,
      sectionTitle: lesson.sectionTitle,
      lessons: [lesson],
      completedLessons: lesson.status === 'completed' ? 1 : 0,
      totalLessons: 1,
      completedCards: lesson.completedCards,
      totalCards: lesson.cards.length,
      isCurrent: lesson.isCurrent,
    })
  }

  return {
    sections: [...sectionsByKey.values()],
    current,
  }
}

function chooseCurrentLesson(lessons: LessonView[]) {
  const startedIncomplete = lessons
    .filter((lesson) => lesson.status !== 'completed' && hasStartedProgress(lesson))
    .sort((left, right) => timestampValue(right.latestActivityAt) - timestampValue(left.latestActivityAt))[0]

  return startedIncomplete ?? lessons.find((lesson) => lesson.status !== 'completed') ?? lessons.at(-1) ?? null
}

function chooseCurrentCard(cards: ProgressCard[]) {
  const viewedIncomplete = cards
    .filter((card) => card.status === 'viewed')
    .sort((left, right) => timestampValue(right.updatedAt) - timestampValue(left.updatedAt))[0]

  return viewedIncomplete ?? cards.find((card) => card.status !== 'completed') ?? cards.at(-1) ?? null
}

function hasStartedProgress(lesson: LessonView) {
  return lesson.status === 'viewed' || lesson.cards.some((card) => card.status !== 'not_started')
}

function isCurrentCard(current: CurrentPosition | null, lesson: LessonView, card: ProgressCard) {
  return current?.lesson.lessonSlug === lesson.lessonSlug && current.card?.cardId === card.cardId
}

function screenTitle(card: ProgressCard) {
  return card.cardTitle ?? cardTypeLabel(card.cardType)
}

function cardTypeLabel(cardType: string) {
  return CARD_TYPE_LABELS[cardType] ?? cardType.replaceAll('_', ' ')
}

function latestTimestamp(values: Array<string | null>) {
  let latest: string | null = null
  let latestValue = Number.NEGATIVE_INFINITY

  for (const value of values) {
    const numeric = timestampValue(value)
    if (numeric > latestValue) {
      latest = value
      latestValue = numeric
    }
  }

  return latest
}

function timestampValue(value: string | null) {
  return value ? Date.parse(value) : Number.NEGATIVE_INFINITY
}
