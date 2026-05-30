import { ChevronLeft, Flag } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { CurrentStepCta } from '@/features/program-navigation/CurrentStepCta'
import { buildModuleLearningPath } from '@/features/program-navigation/learningPath'
import { PathProgressSummary } from '@/features/program-navigation/PathProgressSummary'
import { PathStepNode } from '@/features/program-navigation/PathStepNode'

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
  const path = buildModuleLearningPath(module, progress)
  const modulePath = path.modules[0]
  const firstLesson = modulePath?.units[0]?.lessons[0]?.lesson ?? null

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/">
          <ChevronLeft data-icon="inline-start" />
          Маршрут
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">Модуль {module.order}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-normal text-[var(--fr-text-primary)]">{module.title}</h1>
        {module.description ? (
          <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{module.description}</p>
        ) : null}
      </section>

      <PathProgressSummary completed={path.completedLessons} label="Прогресс модуля" total={path.totalLessons} />

      <CurrentStepCta fallbackTo={`/modules/${module.slug}`} isComplete={path.isComplete} lesson={path.currentLesson?.lesson ?? firstLesson} />

      <section className="flex flex-col gap-6" aria-label={`${module.title}: уроки`}>
        {modulePath?.units.map((unitItem) => (
          <section className="flex flex-col gap-3" key={unitItem.unit.id}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--fr-color-brand-50)] text-[var(--fr-color-sky-500)]">
                <Flag aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase leading-5 tracking-normal text-[var(--fr-text-tertiary)]">
                  Блок {unitItem.unit.order}
                </p>
                <h2 className="text-xl font-bold leading-7 tracking-normal text-[var(--fr-text-primary)]">
                  {unitItem.unit.title}
                </h2>
                {unitItem.unit.description ? (
                  <p className="mt-1 text-sm leading-6 text-[var(--fr-text-secondary)]">{unitItem.unit.description}</p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {unitItem.lessons.map((lessonItem) => (
                <PathStepNode
                  description={lessonItem.lesson.description}
                  index={lessonItem.lesson.order}
                  key={lessonItem.lesson.id}
                  meta={lessonItem.lesson.estimatedMinutes ? `${lessonItem.lesson.estimatedMinutes} мин` : undefined}
                  state={lessonItem.state}
                  title={lessonItem.lesson.title}
                  to={`/lessons/${lessonItem.lesson.slug}`}
                />
              ))}
            </div>
          </section>
        ))}
      </section>
    </div>
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex flex-col gap-2 rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold">{title}</h1>
      {description ? <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
