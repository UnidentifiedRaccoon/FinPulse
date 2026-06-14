import { useCallback, useEffect, useRef } from 'react'
import { Navigate, useParams } from 'react-router'

import { api, type ApiUser, type ProgressResponse, type ReflectionAnswerPayload } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { LessonSession } from '@/features/lesson-reader/LessonSession'
import { LessonPageSkeleton } from '@/shared/ui/RouteLoadingSkeletons'

export function LessonPage({
  user,
  progress,
  markLessonProgress,
  markCardProgress,
  saveReflectionAnswer,
}: {
  user: ApiUser | null
  progress: ProgressResponse | null
  markLessonProgress: (lessonSlug: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
  markCardProgress: (cardId: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
  saveReflectionAnswer: (cardId: string, payload: ReflectionAnswerPayload) => Promise<void>
}) {
  const { lessonSlug } = useParams()
  const viewedLessonSlugsRef = useRef(new Set<string>())
  const lessonQuery = useApiQuery(() => api.getLesson(lessonSlug ?? ''), [lessonSlug])
  const loadedLessonSlug = lessonQuery.status === 'success' ? lessonQuery.data.lesson.slug : null
  const handleCardCompleted = useCallback(
    (cardId: string) => markCardProgress(cardId, { completed: true }),
    [markCardProgress],
  )
  const handleCardViewed = useCallback((cardId: string) => markCardProgress(cardId, { viewed: true }), [markCardProgress])
  const handleReflectionAnswerSave = useCallback(
    (cardId: string, payload: ReflectionAnswerPayload) => saveReflectionAnswer(cardId, payload),
    [saveReflectionAnswer],
  )
  const handleLessonCompleted = useCallback(
    (slug: string) => markLessonProgress(slug, { completed: true }),
    [markLessonProgress],
  )

  useEffect(() => {
    if (!user || !loadedLessonSlug) return
    if (viewedLessonSlugsRef.current.has(loadedLessonSlug)) return
    viewedLessonSlugsRef.current.add(loadedLessonSlug)
    void markLessonProgress(loadedLessonSlug, { viewed: true })
  }, [loadedLessonSlug, markLessonProgress, user])

  if (!lessonSlug) {
    return <Navigate to="/" replace />
  }

  if (lessonQuery.status === 'loading') {
    return <LessonPageSkeleton />
  }

  if (lessonQuery.status === 'error') {
    return <PageState title="Не удалось загрузить урок" description={lessonQuery.error.message} />
  }

  const current = lessonQuery.data
  const isCompleted = Boolean(
    progress?.lessons.some((lessonProgress) => lessonProgress.lessonSlug === current.lesson.slug && lessonProgress.completed),
  )

  return (
    <LessonSession
      canSaveProgress={Boolean(user)}
      details={current}
      isLessonCompleted={isCompleted}
      onCardCompleted={user ? handleCardCompleted : undefined}
      onCardViewed={user ? handleCardViewed : undefined}
      onReflectionAnswerSave={user ? handleReflectionAnswerSave : undefined}
      onLessonCompleted={user ? handleLessonCompleted : undefined}
    />
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </section>
  )
}
