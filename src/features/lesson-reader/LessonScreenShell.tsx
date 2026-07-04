import type { ComponentProps, ReactNode } from 'react'

import type { Card } from '@/content/program'

import { LessonBottomAction } from './LessonBottomAction'
import { LessonCardFrame } from './LessonCardFrame'
import { LessonCardRenderer, type LessonCardInteractionProps } from './LessonCardRenderer'
import { LessonProgressHeader } from './LessonProgressHeader'

export type LessonCardTransition = 'none' | 'forward' | 'back'
export type LessonScreenHeaderProps = ComponentProps<typeof LessonProgressHeader>
export type LessonScreenBottomActionProps = ComponentProps<typeof LessonBottomAction>

export function LessonScreenShell({
  header,
  card,
  interaction,
  lessonGoal,
  showLessonGoal,
  cardTransition = 'none',
  cardRenderKey,
  completion,
  bottomAction,
}: {
  header: LessonScreenHeaderProps
  card: Card
  interaction?: LessonCardInteractionProps
  lessonGoal?: string
  showLessonGoal?: boolean
  cardTransition?: LessonCardTransition
  cardRenderKey?: string | number
  completion?: ReactNode
  bottomAction?: LessonScreenBottomActionProps | null
}) {
  const cardTransitionClass =
    cardTransition === 'none'
      ? ''
      : `fr-lesson-card-transition fr-lesson-card-transition--${cardTransition}`
  const hasCompletion = Boolean(completion)

  return (
    <article className="flex min-h-svh flex-col bg-[var(--fr-surface-canvas)] sm:rounded-3xl">
      <LessonProgressHeader {...header} />

      <div
        className={`mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-4 pt-4 sm:px-4 sm:pt-5 ${
          hasCompletion ? 'pb-[calc(2rem+env(safe-area-inset-bottom))]' : 'pb-4 sm:pb-5'
        }`}
      >
        <div
          className={`flex flex-col gap-4 ${cardTransitionClass}`}
          data-lesson-card-transition={cardTransition}
          key={cardRenderKey ?? card.id}
        >
          {showLessonGoal && lessonGoal ? <LessonGoalCard learningGoal={lessonGoal} /> : null}

          <LessonCardFrame card={card} current={header.current} total={header.total}>
            <LessonCardRenderer card={card} interaction={interaction} showInlineFeedback={false} />
          </LessonCardFrame>
        </div>

        {completion ?? null}
      </div>

      {bottomAction ? <LessonBottomAction {...bottomAction} /> : null}
    </article>
  )
}

export function LessonGoalCard({ learningGoal }: { learningGoal: string }) {
  return (
    <section
      aria-label="Цель урока"
      className="w-full overflow-hidden rounded-[20px] border border-[var(--fr-color-sky-500)]/35 bg-[var(--fr-surface-card)] text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-sm)]"
    >
      <div className="bg-[var(--fr-color-sky-500)] px-4 py-2 text-[11px] font-black uppercase leading-4 tracking-normal text-[var(--fr-text-inverse)]">
        Цель урока
      </div>
      <p className="px-4 py-3 text-pretty text-[15px] font-black leading-6 text-[var(--fr-text-primary)]">
        {learningGoal}
      </p>
    </section>
  )
}
