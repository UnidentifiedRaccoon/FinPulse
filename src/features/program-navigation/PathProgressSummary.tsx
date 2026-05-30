import { CheckCircle2, Target } from 'lucide-react'

import { getProgressPercent } from './learningPath'

export function PathProgressSummary({
  completed,
  total,
  label = 'Ваш прогресс',
}: {
  completed: number
  total: number
  label?: string
}) {
  const percent = getProgressPercent(completed, total)

  return (
    <section
      aria-label={label}
      className="rounded-[22px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-sm)]"
    >
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4">
        <div className="relative flex size-[72px] items-center justify-center rounded-full bg-[var(--fr-surface-soft)]">
          <svg aria-hidden="true" className="absolute inset-0 -rotate-90" viewBox="0 0 72 72">
            <circle
              className="stroke-[var(--fr-color-brand-100)]"
              cx="36"
              cy="36"
              fill="none"
              r="30"
              strokeWidth="7"
            />
            <circle
              className="stroke-[var(--fr-color-sky-500)] transition-[stroke-dashoffset] duration-500"
              cx="36"
              cy="36"
              fill="none"
              r="30"
              strokeDasharray={188.5}
              strokeDashoffset={188.5 - (188.5 * percent) / 100}
              strokeLinecap="round"
              strokeWidth="7"
            />
          </svg>
          <span className="text-lg font-bold tabular-nums text-[var(--fr-text-primary)]">{percent}%</span>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--fr-text-primary)]">
            {percent === 100 ? (
              <CheckCircle2 aria-hidden="true" className="text-[var(--fr-color-learn-correct-500)]" />
            ) : (
              <Target aria-hidden="true" className="text-[var(--fr-color-sky-500)]" />
            )}
            {label}
          </p>
          <p className="text-sm leading-5 text-[var(--fr-text-secondary)]">
            {completed} из {total} уроков завершено
          </p>
          <div
            aria-label={`${percent}% завершено`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={percent}
            className="h-2 overflow-hidden rounded-full bg-[var(--fr-color-brand-100)]"
            role="progressbar"
          >
            <div className="h-full rounded-full bg-[var(--fr-color-sky-500)]" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
