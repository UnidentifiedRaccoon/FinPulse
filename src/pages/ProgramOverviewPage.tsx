import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { getOrderedLessons, getOrderedModules, getOrderedUnits, type Module } from '@/content/program'

export function ProgramOverviewPage({ progress }: { progress: ProgressResponse | null }) {
  const programQuery = useApiQuery(api.getProgram, [])

  if (programQuery.status === 'loading') {
    return <PageState title="Загружаем программу" />
  }

  if (programQuery.status === 'error') {
    return <PageState title="Не удалось загрузить программу" description={programQuery.error.message} />
  }

  const program = programQuery.data

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Образовательная программа</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal">{program.title}</h1>
        {program.description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{program.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-semibold">
          Модули
        </h2>
        <div className="flex flex-col gap-3">
          {getOrderedModules(program).map((module) => {
            const summary = getModuleProgressSummary(module, progress)

            return (
              <Link
                className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
                key={module.id}
                to={`/modules/${module.slug}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                    {module.description ? (
                      <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {module.units.length} юнит
                      {summary ? ` · завершено ${summary.completed} из ${summary.total}` : ''}
                    </p>
                  </div>
                  <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function getModuleProgressSummary(module: Module, progress: ProgressResponse | null) {
  if (!progress) return null

  const completedLessons = new Set(
    progress.lessons.filter((lessonProgress) => lessonProgress.completed).map((lessonProgress) => lessonProgress.lessonSlug),
  )
  const lessons = getOrderedUnits(module).flatMap((unit) => getOrderedLessons(unit))

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
