import { ChevronLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { LessonPathMap } from '@/features/program-navigation/LessonPathMap'
import { buildUnitLearningPath } from '@/features/program-navigation/learningPath'
import { buildLessonPathSections } from '@/features/program-navigation/lessonPathSections'

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
  const sections = buildLessonPathSections(unitPath ? [unitPath] : [])
  const activeSection = sections.find((section) => section.state === 'current') ?? sections.find((section) => section.state === 'locked') ?? sections[0]
  const moduleContext = `Модуль ${module.order}`

  return (
    <div className="flex flex-col gap-8 pb-10" id="unit-top">
      <section className="sticky top-3 z-20 overflow-hidden rounded-[28px] bg-[var(--fr-color-learn-correct-500)] p-4 text-white shadow-[0_18px_40px_rgba(20,133,95,0.22)]">
        <div className="flex items-start">
          <Button
            asChild
            className="min-h-10 rounded-2xl px-0 text-sm font-bold uppercase leading-5 tracking-normal text-white/75 hover:bg-white/10 hover:text-white/75"
            variant="ghost"
          >
            <Link to={`/modules/${module.slug}`}>
              <ChevronLeft data-icon="inline-start" />
              {moduleContext}
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-normal">{activeSection?.title ?? unit.title}</h1>
          </div>
        </div>
      </section>

      <LessonPathMap moduleOrder={module.order} sections={sections} />
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
