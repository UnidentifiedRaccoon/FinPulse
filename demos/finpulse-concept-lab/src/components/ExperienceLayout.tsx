import { CircleAlert } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { LabHeader } from './LabHeader'
import { PrivacyNote, StageRail } from './Ui'

interface ExperienceLayoutProps {
  title: string
  description: string
  stageLabels: string[]
  activeStage: number
  stageKey: string
  children: React.ReactNode
}

export function ExperienceLayout({
  title,
  description,
  stageLabels,
  activeStage,
  stageKey,
  children,
}: ExperienceLayoutProps) {
  const focusRef = useRef<HTMLHeadingElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const previousStageKey = useRef<string | null>(null)

  useEffect(() => {
    document.title = `${title} · ФинПульс`
    const stageChanged = previousStageKey.current !== null && previousStageKey.current !== stageKey
    previousStageKey.current = stageKey

    if (!stageChanged) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      focusRef.current?.focus({ preventScroll: true })
    } else {
      const stageHeading = stageRef.current?.querySelector<HTMLElement>('h2, [data-stage-focus]')
      if (stageHeading) {
        stageHeading.tabIndex = -1
        stageHeading.focus({ preventScroll: true })
        const stageStart = stageHeading.closest<HTMLElement>('section') ?? stageHeading
        window.requestAnimationFrame(() => {
          const top = window.scrollY + stageStart.getBoundingClientRect().top - 76
          const targetTop = Math.max(0, top)
          document.documentElement.scrollTop = targetTop
          document.body.scrollTop = targetTop
        })
      } else {
        focusRef.current?.focus({ preventScroll: true })
      }
    }
  }, [stageKey, title])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#experience-title">К основному содержанию</a>
      <LabHeader compact />
      <StageRail active={activeStage} labels={stageLabels} />
      <main className={stageKey === 'intro' ? 'experience experience--intro' : 'experience'} id="experience-main">
        <div className="experience-heading">
          <h1 id="experience-title" ref={focusRef} tabIndex={-1}>{title}</h1>
          <p>{description}</p>
          <PrivacyNote>Выборы существуют только в этой вкладке и исчезнут после выхода.</PrivacyNote>
        </div>
        <div className="stage-content" key={stageKey} ref={stageRef}>
          {children}
        </div>
      </main>
    </div>
  )
}

interface NonCanonBoundaryProps {
  compact?: boolean
  title?: string
  children?: React.ReactNode
}

export function NonCanonBoundary({
  compact = false,
  title = 'Придуманный вариант — не часть истории',
  children,
}: NonCanonBoundaryProps) {
  return (
    <aside className={compact ? 'noncanon noncanon--compact' : 'noncanon'}>
      <CircleAlert aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        {children ?? (
          <p>
            Авторы демки изменили только путь к проверке. Сравнение не предсказывает реальный исход, не добавляет событий
            и не предлагает действие. В истории Саша по-прежнему самостоятельно открывает приложение.
          </p>
        )}
      </div>
    </aside>
  )
}

interface IntroPanelProps {
  activity: string
  skip: string
  children: React.ReactNode
  label?: string
  title?: string
  overview?: string
  routeLead?: string
}

export function IntroPanel({
  activity,
  skip,
  children,
  label = '«Свой маршрут» · 6 глав',
  title = 'Первый год Саши в новом городе',
  overview = 'Шесть глав следуют за Сашей весь первый год после переезда ради новой работы. Это одна история, не шесть учебных шагов.',
  routeLead = 'Сначала: непрерывное начало главы 1. Затем —',
}: IntroPanelProps) {
  return (
    <section className="intro-panel">
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      <p className="story-overview">{overview}</p>
      <p className="intro-route">
        <strong>{routeLead}</strong> {activity} {skip} История и решение Саши не меняются.
      </p>
      {children}
    </section>
  )
}

interface LearningBridgeProps {
  status: string
  title: string
  purpose: string
  material: string
  boundary: string
  children: React.ReactNode
}

export function LearningBridge({ status, title, purpose, material, boundary, children }: LearningBridgeProps) {
  return (
    <section className="learning-bridge">
      <p className="section-label">{status}</p>
      <h2>{title}</h2>
      <p>{purpose}</p>
      <dl className="bridge-contract">
        <div>
          <dt>Материал</dt>
          <dd>{material}</dd>
        </div>
        <div>
          <dt>Граница</dt>
          <dd>{boundary}</dd>
        </div>
      </dl>
      {children}
    </section>
  )
}
