import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'

import { cn } from '@/lib/utils'

export function LessonProgressHeader({
  backTo,
  backLabel,
  context,
  title,
  current,
  total,
  isComplete,
  isSavedComplete,
}: {
  backTo: string
  backLabel: string
  context: string
  title: string
  current: number
  total: number
  isComplete: boolean
  isSavedComplete: boolean
}) {
  const progressValue = isComplete ? 100 : Math.round((current / total) * 100)

  return (
    <header className="sticky top-0 z-10 -mx-5 border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-canvas)]/95 px-5 pb-3 pt-3 backdrop-blur sm:rounded-b-2xl sm:border-x">
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_minmax(4.75rem,auto)] items-center gap-3">
          <Link
            aria-label={backLabel}
            className="flex size-11 items-center justify-center rounded-xl text-[var(--fr-text-secondary)] transition-[background-color,color,box-shadow] hover:bg-[var(--fr-surface-soft)] hover:text-[var(--fr-text-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
            to={backTo}
          >
            <ChevronLeft aria-hidden="true" />
          </Link>
          <div className="min-w-0 self-center">
            <p className="truncate text-xs font-semibold leading-5 text-[var(--fr-text-tertiary)]">{context}</p>
            <h1 className="truncate text-base font-bold leading-6 tracking-normal text-[var(--fr-text-primary)]">
              {title}
            </h1>
          </div>
          <p className="min-w-[4.75rem] rounded-full bg-[var(--fr-surface-card)] px-3 py-1 text-center text-xs font-semibold tabular-nums text-[var(--fr-color-brand-700)] shadow-[var(--fr-shadow-sm)]">
            {isComplete ? 'Готово' : `${current} из ${total}`}
          </p>
        </div>
        <div
          aria-label="Прогресс урока"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progressValue}
          className="h-2.5 overflow-hidden rounded-full bg-[var(--fr-color-brand-100)] p-[2px]"
          role="progressbar"
        >
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none',
              isComplete || isSavedComplete
                ? 'bg-[var(--fr-color-learn-correct-500)]'
                : 'bg-[var(--fr-color-sky-500)]',
            )}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    </header>
  )
}
