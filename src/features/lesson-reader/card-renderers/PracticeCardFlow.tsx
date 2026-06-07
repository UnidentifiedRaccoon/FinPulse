import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type PracticeCardFlowDotState = 'default' | 'selected' | 'correct' | 'retry'

export function PracticeCardFlow({
  children,
  activeIndex,
  total,
  getDotState,
  onNext,
  onPrevious,
  onSelectIndex,
}: {
  children: ReactNode
  activeIndex: number
  total: number
  getDotState?: (index: number) => PracticeCardFlowDotState
  onNext: () => void
  onPrevious: () => void
  onSelectIndex: (index: number) => void
}) {
  return (
    <div className="flex flex-col gap-[var(--fr-space-3)]">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-[var(--fr-space-5)] bottom-[var(--fr-space-2)] top-[var(--fr-space-4)] rounded-[var(--fr-radius-xl)] bg-[var(--fr-border-subtle)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-[var(--fr-space-3)] bottom-[var(--fr-space-1)] top-[var(--fr-space-2)] rounded-[var(--fr-radius-xl)] bg-[var(--fr-surface-soft)]"
        />
        <div className="relative">{children}</div>
      </div>

      {total > 1 ? (
        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-[var(--fr-space-2)]">
          <FlowNavButton
            direction="previous"
            disabled={activeIndex <= 0}
            onClick={onPrevious}
          />
          <div aria-label="Карточки задания" className="flex min-w-0 flex-wrap justify-center gap-[var(--fr-space-1)]">
            {Array.from({ length: total }, (_, index) => (
              <button
                aria-current={activeIndex === index ? 'step' : undefined}
                aria-label={`Перейти к карточке ${index + 1}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-[var(--fr-radius-full)] transition-[background-color,box-shadow,transform] duration-200 active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
                key={index}
                onClick={() => onSelectIndex(index)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block size-2.5 rounded-[var(--fr-radius-full)] border transition-[background-color,border-color,box-shadow,transform] duration-200',
                    getDotClassName(getDotState?.(index) ?? 'default'),
                    activeIndex === index && 'scale-125 shadow-[0_0_0_5px_rgba(30,155,215,0.14)]',
                  )}
                />
              </button>
            ))}
          </div>
          <FlowNavButton direction="next" disabled={activeIndex >= total - 1} onClick={onNext} />
        </div>
      ) : null}
    </div>
  )
}

function FlowNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'previous' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  const label = direction === 'previous' ? 'Предыдущая карточка' : 'Следующая карточка'

  return (
    <button
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-[var(--fr-radius-full)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px enabled:hover:border-[var(--fr-border-strong)] enabled:hover:text-[var(--fr-text-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15 disabled:cursor-not-allowed disabled:opacity-35"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  )
}

function getDotClassName(state: PracticeCardFlowDotState) {
  if (state === 'correct') {
    return 'border-[var(--fr-color-learn-correct-500)] bg-[var(--fr-color-learn-correct-500)]'
  }

  if (state === 'retry') {
    return 'border-[var(--fr-color-learn-almost-500)] bg-[var(--fr-color-learn-almost-500)]'
  }

  if (state === 'selected') {
    return 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-sky-500)]'
  }

  return 'border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)]'
}
