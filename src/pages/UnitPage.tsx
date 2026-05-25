import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { getOrderedLessons } from '@/content/program'

export function UnitPage({ progress }: { progress: ProgressResponse | null }) {
  const { moduleSlug, unitSlug } = useParams()
  const unitQuery = useApiQuery(() => api.getUnit(unitSlug ?? ''), [unitSlug])

  if (!moduleSlug || !unitSlug) {
    return <Navigate to="/" replace />
  }

  if (unitQuery.status === 'loading') {
    return <PageState title="Загружаем юнит" />
  }

  if (unitQuery.status === 'error') {
    return <PageState title="Не удалось загрузить юнит" description={unitQuery.error.message} />
  }

  const { module, unit } = unitQuery.data

  if (module.slug !== moduleSlug) {
    return <Navigate to={`/modules/${module.slug}/units/${unit.slug}`} replace />
  }

  const completedLessons = new Set(
    progress?.lessons.filter((lessonProgress) => lessonProgress.completed).map((lessonProgress) => lessonProgress.lessonSlug),
  )

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to={`/modules/${module.slug}`}>
          <ChevronLeft data-icon="inline-start" />
          {module.title}
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Юнит {unit.order}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{unit.title}</h1>
        {unit.description ? (
          <p className="text-base leading-7 text-muted-foreground">{unit.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-label={`${unit.title}: уроки`}>
        {getOrderedLessons(unit).map((lesson) => {
          const isCompleted = completedLessons.has(lesson.slug)

          return (
            <Link
              className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
              key={lesson.id}
              to={`/lessons/${lesson.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">{lesson.title}</h2>
                  {lesson.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">{lesson.description}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {lesson.estimatedMinutes ? `${lesson.estimatedMinutes} мин` : 'Урок'}
                    {isCompleted ? ' · завершён' : ''}
                  </p>
                </div>
                <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
              </div>
            </Link>
          )
        })}
      </section>
    </div>
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
