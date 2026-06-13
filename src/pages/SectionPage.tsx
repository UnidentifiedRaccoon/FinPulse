import { ChevronLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { LessonPathMap } from '@/features/program-navigation/LessonPathMap'
import { buildSectionLearningPath } from '@/features/program-navigation/learningPath'
import { buildLessonPathSections } from '@/features/program-navigation/lessonPathSections'

export function SectionPage({ progress }: { progress: ProgressResponse | null }) {
  const { levelSlug, sectionSlug } = useParams()
  const sectionQuery = useApiQuery(() => api.getSection(sectionSlug ?? ''), [sectionSlug])

  if (!levelSlug || !sectionSlug) {
    return <Navigate to="/" replace />
  }

  if (sectionQuery.status === 'loading') {
    return <PageState title="Загружаем раздел" />
  }

  if (sectionQuery.status === 'error') {
    return <PageState title="Не удалось загрузить раздел" description={sectionQuery.error.message} />
  }

  const { level, section } = sectionQuery.data

  if (level.slug !== levelSlug) {
    return <Navigate to={`/levels/${level.slug}/sections/${section.slug}`} replace />
  }

  const path = buildSectionLearningPath(level, section, progress)
  const sectionPath = path.levels[0]?.sections[0]
  const sections = buildLessonPathSections(sectionPath ? [sectionPath] : [])
  const activeSection = sections.find((section) => section.state === 'current') ?? sections.find((section) => section.state === 'locked') ?? sections[0]
  const levelContext = `Уровень ${level.order}`

  return (
    <div className="min-h-svh bg-[var(--fr-surface-canvas)] pb-10" id="section-top">
      <header
        className="sticky top-0 z-30 rounded-b-[22px] bg-[var(--fr-color-sky-500)] px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] text-white"
        data-testid="compact-path-header"
      >
        <Button
          asChild
          className="min-h-8 gap-1 rounded-none px-0 py-0 text-[11px] font-bold uppercase leading-4 tracking-normal text-white hover:bg-transparent hover:text-white has-data-[icon=inline-start]:pl-0"
          variant="ghost"
        >
          <Link to={`/levels/${level.slug}`}>
            <ChevronLeft data-icon="inline-start" />
            {levelContext}
          </Link>
        </Button>

        <h1 className="max-w-[18rem] text-[20px] font-bold leading-6 tracking-normal text-white [overflow-wrap:anywhere]">
          {activeSection?.title ?? section.title}
        </h1>
      </header>

      <div className="px-4 pb-6 pt-7">
        <LessonPathMap levelOrder={level.order} sections={sections} />
      </div>
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
