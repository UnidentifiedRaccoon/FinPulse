import { ChevronLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { getOrderedModules } from '@/content/program'
import { LessonPathMap, ModuleTransitionCard } from '@/features/program-navigation/LessonPathMap'
import { buildModuleLearningPath } from '@/features/program-navigation/learningPath'
import { buildLessonPathSections } from '@/features/program-navigation/lessonPathSections'

export function ModulePage({ progress }: { progress: ProgressResponse | null }) {
  const { moduleSlug } = useParams()
  const moduleQuery = useApiQuery(() => api.getModule(moduleSlug ?? ''), [moduleSlug])
  const programQuery = useApiQuery(api.getProgram, [])

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
  const sections = buildLessonPathSections(modulePath?.units ?? [])
  const activeSection = sections.find((section) => section.state === 'current') ?? sections.find((section) => section.state === 'locked') ?? sections[0]
  const moduleContext = `Модуль ${module.order}`
  const nextModule =
    programQuery.status === 'success'
      ? (getOrderedModules(programQuery.data).find((candidate) => candidate.order > module.order) ?? null)
      : null

  return (
    <div className="flex flex-col gap-8 pb-10" id="module-top">
      <section className="sticky top-3 z-20 overflow-hidden rounded-[28px] bg-[var(--fr-color-sky-500)] p-4 text-white shadow-[0_18px_40px_rgba(20,121,184,0.22)]">
        <div className="flex items-start">
          <Button
            asChild
            className="min-h-10 rounded-2xl px-0 text-sm font-bold uppercase leading-5 tracking-normal text-white/75 hover:bg-white/10 hover:text-white/75"
            variant="ghost"
          >
            <Link to="/program">
              <ChevronLeft data-icon="inline-start" />
              {moduleContext}
            </Link>
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <h1 className="min-w-0 text-3xl font-bold leading-tight tracking-normal [overflow-wrap:anywhere]">
            {activeSection?.title ?? module.title}
          </h1>
        </div>
      </section>

      <LessonPathMap moduleOrder={module.order} sections={sections} />

      {programQuery.status !== 'loading' && (nextModule || path.isComplete) ? (
        <ModuleTransitionCard isComplete={path.isComplete} nextModule={nextModule} />
      ) : null}
    </div>
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold">{title}</h1>
      {description ? <p className="mt-1 text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
