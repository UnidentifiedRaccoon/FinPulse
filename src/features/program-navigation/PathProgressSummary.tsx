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
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--fr-text-primary)]">{label}</p>
          <p className="text-sm leading-5 tabular-nums text-[var(--fr-text-secondary)]">
            {completed}/{total}
          </p>
        </div>
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
    </section>
  )
}
