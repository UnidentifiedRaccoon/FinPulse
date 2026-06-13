import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { getOrderedLevels } from '@/content/order'
import { LessonPathMap, LevelTransitionCard } from '@/features/program-navigation/LessonPathMap'
import { buildLevelLearningPath } from '@/features/program-navigation/learningPath'
import { buildLessonPathSections, type LessonPathSection } from '@/features/program-navigation/lessonPathSections'

const EMPTY_SECTIONS: LessonPathSection[] = []
const SECTION_ACTIVATION_RATIO = 0.35
const SECTION_ACTIVATION_MAX_PX = 260

export function LevelPage({ progress }: { progress: ProgressResponse | null }) {
  const { levelSlug } = useParams()
  const levelQuery = useApiQuery(() => api.getLevel(levelSlug ?? ''), [levelSlug])
  const programQuery = useApiQuery(api.getProgram, [])
  const levelPathState = useMemo(() => {
    if (levelQuery.status !== 'success') return null

    const path = buildLevelLearningPath(levelQuery.data, progress)
    const levelPath = path.levels[0]

    return {
      path,
      sections: buildLessonPathSections(levelPath?.sections ?? []),
    }
  }, [levelQuery.data, levelQuery.status, progress])
  const sections = levelPathState?.sections ?? EMPTY_SECTIONS
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])
  const scrollActiveSectionId = useScrollActiveSectionId(sectionIds)

  if (!levelSlug) {
    return <Navigate to="/" replace />
  }

  if (levelQuery.status === 'loading') {
    return <PageState title="Загружаем уровень" />
  }

  if (levelQuery.status === 'error') {
    return <PageState title="Не удалось загрузить уровень" description={levelQuery.error.message} />
  }

  const level = levelQuery.data
  const path = levelPathState?.path ?? buildLevelLearningPath(level, progress)
  const progressActiveSection =
    sections.find((section) => section.state === 'current') ?? sections.find((section) => section.state === 'locked') ?? sections[0]
  const activeSection = sections.find((section) => section.id === scrollActiveSectionId) ?? progressActiveSection
  const levelContext = activeSection ? `Уровень ${level.order} раздел ${activeSection.number}` : `Уровень ${level.order}`
  const nextLevel =
    programQuery.status === 'success'
      ? (getOrderedLevels(programQuery.data).find((candidate) => candidate.order > level.order) ?? null)
      : null

  return (
    <div className="min-h-svh bg-[var(--fr-surface-canvas)] pb-10" id="level-top">
      <header
        className="sticky top-0 z-30 rounded-b-[22px] bg-[var(--fr-color-sky-500)] px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] text-white"
        data-testid="compact-path-header"
      >
        <Button
          asChild
          className="min-h-8 gap-1 rounded-none px-0 py-0 text-[11px] font-bold uppercase leading-4 tracking-normal text-white hover:bg-transparent hover:text-white has-data-[icon=inline-start]:pl-0"
          variant="ghost"
        >
          <Link to="/program">
            <ChevronLeft data-icon="inline-start" />
            {levelContext}
          </Link>
        </Button>

        <h1 className="max-w-[18rem] text-[20px] font-bold leading-6 tracking-normal text-white [overflow-wrap:anywhere]">
          {activeSection?.title ?? level.title}
        </h1>
      </header>

      <div className="flex flex-col gap-8 px-4 pb-6 pt-7">
        <LessonPathMap levelOrder={level.order} sections={sections} />

        {programQuery.status !== 'loading' && (nextLevel || path.isComplete) ? (
          <LevelTransitionCard isComplete={path.isComplete} nextLevel={nextLevel} />
        ) : null}
      </div>
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
