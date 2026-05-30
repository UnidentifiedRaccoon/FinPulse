import { ChevronLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { CurrentStepCta } from '@/features/program-navigation/CurrentStepCta'
import { buildUnitLearningPath } from '@/features/program-navigation/learningPath'
import { PathProgressSummary } from '@/features/program-navigation/PathProgressSummary'
import { PathStepNode } from '@/features/program-navigation/PathStepNode'

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

  const path = buildUnitLearningPath(module, unit, progress)
  const unitPath = path.modules[0]?.units[0]
  const firstLesson = unitPath?.lessons[0]?.lesson ?? null

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Button asChild variant="ghost" className="w-fit">
        <Link to={`/modules/${module.slug}`}>
          <ChevronLeft data-icon="inline-start" />
          {module.title}
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">Блок {unit.order}</p>
        <h1 className="text-3xl font-bold leading-tight tracking-normal text-[var(--fr-text-primary)]">{unit.title}</h1>
        {unit.description ? (
          <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{unit.description}</p>
        ) : null}
      </section>

      <PathProgressSummary completed={path.completedLessons} label="Прогресс блока" total={path.totalLessons} />

      <CurrentStepCta
        fallbackTo={`/modules/${module.slug}/units/${unit.slug}`}
        isComplete={path.isComplete}
        lesson={path.currentLesson?.lesson ?? firstLesson}
      />

      <section className="flex flex-col gap-3" aria-label={`${unit.title}: уроки`}>
        {unitPath?.lessons.map((lessonItem) => (
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
