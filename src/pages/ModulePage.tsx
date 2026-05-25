import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { getOrderedLessons, getOrderedUnits, type Unit } from '@/content/program'

export function ModulePage({ progress }: { progress: ProgressResponse | null }) {
  const { moduleSlug } = useParams()
  const moduleQuery = useApiQuery(() => api.getModule(moduleSlug ?? ''), [moduleSlug])

  if (!moduleSlug) {
    return <Navigate to="/" replace />
  }

  if (moduleQuery.status === 'loading') {
    return <PageState title="Загружаем модуль" />
  }

  if (moduleQuery.status === 'error') {
    return <PageState title="Не удалось загрузить модуль" description={moduleQuery.error.message} />
  }

  const module = moduleQuery.data

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/">
          <ChevronLeft data-icon="inline-start" />
          Программа
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Модуль {module.order}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{module.title}</h1>
        {module.description ? (
          <p className="text-base leading-7 text-muted-foreground">{module.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-label={`${module.title}: юниты`}>
        {getOrderedUnits(module).map((unit) => {
          const summary = getUnitProgressSummary(unit, progress)

          return (
            <Link
              className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
              key={unit.id}
              to={`/modules/${module.slug}/units/${unit.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">{unit.title}</h2>
                  {unit.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">{unit.description}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {summary.total} уроков
                    {progress ? ` · завершено ${summary.completed}` : ''}
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

function getUnitProgressSummary(unit: Unit, progress: ProgressResponse | null) {
  const completedLessons = new Set(
    progress?.lessons.filter((lessonProgress) => lessonProgress.completed).map((lessonProgress) => lessonProgress.lessonSlug),
  )
  const lessons = getOrderedLessons(unit)

  return {
    total: lessons.length,
    completed: lessons.filter((lesson) => completedLessons.has(lesson.slug)).length,
  }
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
    </section>
  )
}
