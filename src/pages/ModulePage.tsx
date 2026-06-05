import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { getOrderedModules } from '@/content/program'
import { LessonPathMap, ModuleTransitionCard } from '@/features/program-navigation/LessonPathMap'
import { buildModuleLearningPath } from '@/features/program-navigation/learningPath'
import { buildLessonPathSections, type LessonPathSection } from '@/features/program-navigation/lessonPathSections'

const EMPTY_SECTIONS: LessonPathSection[] = []
const SECTION_ACTIVATION_RATIO = 0.35
const SECTION_ACTIVATION_MAX_PX = 260

export function ModulePage({ progress }: { progress: ProgressResponse | null }) {
  const { moduleSlug } = useParams()
  const moduleQuery = useApiQuery(() => api.getModule(moduleSlug ?? ''), [moduleSlug])
  const programQuery = useApiQuery(api.getProgram, [])
  const modulePathState = useMemo(() => {
    if (moduleQuery.status !== 'success') return null

    const path = buildModuleLearningPath(moduleQuery.data, progress)
    const modulePath = path.modules[0]

    return {
      path,
      sections: buildLessonPathSections(modulePath?.units ?? []),
    }
  }, [moduleQuery.data, moduleQuery.status, progress])
  const sections = modulePathState?.sections ?? EMPTY_SECTIONS
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])
  const scrollActiveSectionId = useScrollActiveSectionId(sectionIds)

  if (!moduleSlug) {
    return <Navigate to="/" replace />
  }

  if (moduleQuery.status === 'loading') {
    return <PageState title="Загружаем тир" />
  }

  if (moduleQuery.status === 'error') {
    return <PageState title="Не удалось загрузить тир" description={moduleQuery.error.message} />
  }

  const module = moduleQuery.data
  const path = modulePathState?.path ?? buildModuleLearningPath(module, progress)
  const progressActiveSection =
    sections.find((section) => section.state === 'current') ?? sections.find((section) => section.state === 'locked') ?? sections[0]
  const activeSection = sections.find((section) => section.id === scrollActiveSectionId) ?? progressActiveSection
  const moduleContext = activeSection ? `Тир ${module.order} раздел ${activeSection.number}` : `Тир ${module.order}`
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
            className="min-h-11 gap-2 rounded-2xl px-4 py-2 text-sm font-bold uppercase leading-5 tracking-normal text-white hover:bg-white/10 hover:text-white has-data-[icon=inline-start]:pl-4"
            variant="ghost"
          >
            <Link to="/program">
              <ChevronLeft data-icon="inline-start" />
              {moduleContext}
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="min-w-0 text-2xl font-bold leading-tight tracking-normal [overflow-wrap:anywhere]">
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

function useScrollActiveSectionId(sectionIds: readonly string[]) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

  useEffect(() => {
    if (sectionIds.length === 0) {
      const resetFrame = window.requestAnimationFrame(() => {
        setActiveSectionId(null)
      })
      return () => {
        window.cancelAnimationFrame(resetFrame)
      }
    }

    let animationFrame = 0

    const updateActiveSection = () => {
      animationFrame = 0

      const measuredSections = sectionIds
        .map((sectionId) => {
          const element = document.getElementById(getPathSectionElementId(sectionId))
          return element ? { id: sectionId, rect: element.getBoundingClientRect() } : null
        })
        .filter((section): section is { id: string; rect: DOMRect } => section !== null)

      if (measuredSections.length === 0) {
        setActiveSectionId((currentSectionId) => (currentSectionId === sectionIds[0] ? currentSectionId : sectionIds[0]))
        return
      }

      const hasBrowserLayout = measuredSections.some(({ rect }) => rect.top !== 0 || rect.bottom !== 0)
      if (!hasBrowserLayout) {
        setActiveSectionId((currentSectionId) => (currentSectionId === sectionIds[0] ? currentSectionId : sectionIds[0]))
        return
      }

      const activationLine = Math.min(window.innerHeight * SECTION_ACTIVATION_RATIO, SECTION_ACTIVATION_MAX_PX)
      let nextActiveSectionId = measuredSections[0].id

      for (const { id, rect } of measuredSections) {
        if (rect.top <= activationLine) {
          nextActiveSectionId = id
        }
      }

      setActiveSectionId((currentSectionId) =>
        currentSectionId === nextActiveSectionId ? currentSectionId : nextActiveSectionId,
      )
    }

    const scheduleActiveSectionUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateActiveSection)
    }

    scheduleActiveSectionUpdate()
    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
    window.addEventListener('resize', scheduleActiveSectionUpdate)

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener('scroll', scheduleActiveSectionUpdate)
      window.removeEventListener('resize', scheduleActiveSectionUpdate)
    }
  }, [sectionIds])

  return activeSectionId
}

function getPathSectionElementId(sectionId: string) {
  return `path-section-${sectionId}`
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold">{title}</h1>
      {description ? <p className="mt-1 text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
