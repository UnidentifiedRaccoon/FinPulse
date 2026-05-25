import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ApiUser, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { getOrderedCards } from '@/content/program'
import { LessonCardRenderer } from '@/features/lesson-reader/LessonCardRenderer'

export function LessonPage({
  user,
  progress,
  markLessonProgress,
  markCardProgress,
}: {
  user: ApiUser | null
  progress: ProgressResponse | null
  markLessonProgress: (lessonSlug: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
  markCardProgress: (cardId: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
}) {
  const { lessonSlug } = useParams()
  const lessonQuery = useApiQuery(() => api.getLesson(lessonSlug ?? ''), [lessonSlug])

  useEffect(() => {
    if (!user || !lessonSlug) return
    void markLessonProgress(lessonSlug, { viewed: true })
  }, [lessonSlug, markLessonProgress, user])

  if (!lessonSlug) {
    return <Navigate to="/" replace />
  }

  if (lessonQuery.status === 'loading') {
    return <PageState title="Загружаем урок" />
  }

  if (lessonQuery.status === 'error') {
    return <PageState title="Не удалось загрузить урок" description={lessonQuery.error.message} />
  }

  const current = lessonQuery.data
  const isCompleted = Boolean(
    progress?.lessons.some((lessonProgress) => lessonProgress.lessonSlug === current.lesson.slug && lessonProgress.completed),
  )

  return (
    <article className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="h-auto w-fit whitespace-normal text-left">
        <Link to={`/modules/${current.module.slug}/units/${current.unit.slug}`}>
          <ChevronLeft data-icon="inline-start" />
          {current.unit.title}
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {current.module.title} · {current.unit.title} · Урок {current.lesson.order}
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{current.lesson.title}</h1>
        {current.lesson.description ? (
          <p className="text-base leading-7 text-muted-foreground">{current.lesson.description}</p>
        ) : null}
        {current.lesson.learningGoal ? (
          <p className="rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">
            {current.lesson.learningGoal}
          </p>
        ) : null}
        {user ? (
          <p className="text-xs leading-5 text-muted-foreground">
            {isCompleted ? 'Урок отмечен завершённым.' : 'Открытие урока сохраняется в прогрессе.'}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-4">
        {getOrderedCards(current.lesson).map((card) => (
          <LessonCardRenderer
            card={card}
            key={card.id}
            onCardProgress={user ? (cardId) => markCardProgress(cardId, { completed: true }) : undefined}
          />
        ))}
      </div>

      {user ? (
        <Button
          className="h-auto min-h-11 w-fit whitespace-normal"
          disabled={isCompleted}
          onClick={() => markLessonProgress(current.lesson.slug, { completed: true })}
          type="button"
          variant="outline"
        >
          {isCompleted ? 'Урок завершён' : 'Отметить урок завершённым'}
        </Button>
      ) : null}

      <nav className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2" aria-label="Навигация по урокам">
        {current.previous ? (
          <Button asChild variant="outline" className="h-auto justify-start whitespace-normal text-left">
            <Link to={`/lessons/${current.previous.lesson.slug}`}>
              <ChevronLeft data-icon="inline-start" />
              {current.previous.lesson.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {current.next ? (
          <Button asChild className="h-auto justify-end whitespace-normal text-right">
            <Link to={`/lessons/${current.next.lesson.slug}`}>
              {current.next.lesson.title}
              <ChevronRight data-icon="inline-end" />
            </Link>
          </Button>
        ) : null}
      </nav>
    </article>
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </section>
  )
}
