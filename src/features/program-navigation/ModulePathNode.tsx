import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { getProgressPercent, type ModulePathItem, type PathItemState } from './learningPath'

const stateCopy = {
  completed: 'Пройдено',
  current: 'В процессе',
  locked: 'Доступен позже',
} satisfies Record<PathItemState, string>

export function ModulePathNode({ item, index }: { item: ModulePathItem; index: number }) {
  const percent = getProgressPercent(item.completedLessons, item.totalLessons)
  const actionLabel = item.state === 'completed' ? 'Повторение' : item.state === 'current' ? 'Далее' : 'К тиру'

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[28px] border p-4 shadow-[var(--fr-shadow-sm)]',
        'bg-[linear-gradient(135deg,var(--fr-surface-card)_0_34%,var(--fr-surface-soft)_34%_54%,var(--fr-surface-card)_54%_100%)]',
        item.state === 'completed' && 'border-[var(--fr-color-learn-correct-500)]/35',
        item.state === 'current' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)]',
        item.state === 'locked' && 'border-[var(--fr-border-default)] opacity-85',
      )}
    >
      <div className="relative flex min-h-[132px] flex-col justify-between gap-5">
        <div className="min-w-0">
          <p className="text-sm font-bold leading-5 tracking-normal text-[var(--fr-text-tertiary)]">Тир {index}</p>
          <h2 className="mt-1 text-2xl font-bold leading-8 tracking-normal text-[var(--fr-text-primary)]">
            {item.module.title}
          </h2>
        </div>

        {item.module.description ? (
          <p className="line-clamp-2 text-sm leading-5 text-[var(--fr-text-secondary)]">{item.module.description}</p>
        ) : null}

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 text-sm font-bold leading-5">
            <span
              className={cn(
                item.state === 'completed' && 'text-[var(--fr-color-learn-correct-500)]',
                item.state === 'current' && 'text-[var(--fr-color-sky-500)]',
                item.state === 'locked' && 'text-[var(--fr-text-tertiary)]',
              )}
            >
              {stateCopy[item.state]}
            </span>
            <span className="text-[var(--fr-text-tertiary)]">
              {item.completedLessons}/{item.totalLessons}
            </span>
          </div>
          <div
            aria-label={`${percent}% тира завершено`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={percent}
            className="h-3 overflow-hidden rounded-full bg-white shadow-inner"
            role="progressbar"
          >
            <div
              className={cn(
                'h-full rounded-full',
                item.state === 'completed' ? 'bg-[var(--fr-color-learn-correct-500)]' : 'bg-[var(--fr-color-sky-500)]',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <Button
          asChild
          className={cn(
            'min-h-12 w-full rounded-2xl text-[15px] font-bold uppercase tracking-normal',
            item.state === 'completed'
              ? 'border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] text-[var(--fr-color-sky-500)] hover:bg-[var(--fr-surface-soft)]'
              : 'bg-[var(--fr-color-sky-500)] text-white shadow-[0_5px_0_var(--fr-color-sky-600)] hover:bg-[var(--fr-color-sky-600)]',
          )}
          variant={item.state === 'completed' ? 'outline' : 'default'}
        >
          <Link to={`/modules/${item.module.slug}`}>
            {actionLabel}
          </Link>
        </Button>
      </div>
    </article>
  )
}
