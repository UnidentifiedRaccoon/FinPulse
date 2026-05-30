import { Check, ChevronRight, Lock, Route } from 'lucide-react'
import { Link } from 'react-router'

import { cn } from '@/lib/utils'

import type { ModulePathItem, PathItemState } from './learningPath'

const stateCopy = {
  completed: 'Модуль пройден',
  current: 'Текущий модуль',
  locked: 'Будущий модуль',
} satisfies Record<PathItemState, string>

export function ModulePathNode({ item, index }: { item: ModulePathItem; index: number }) {
  const Icon = item.state === 'completed' ? Check : item.state === 'locked' ? Lock : Route

  return (
    <Link
      className={cn(
        'grid min-h-24 grid-cols-[64px_minmax(0,1fr)_24px] items-center gap-3 rounded-[22px] border bg-[var(--fr-surface-card)] px-3 py-4 shadow-[var(--fr-shadow-sm)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        item.state === 'completed' && 'border-[var(--fr-color-learn-correct-500)]/35 bg-[var(--fr-color-learn-correct-50)]',
        item.state === 'current' && 'border-[var(--fr-color-sky-500)]',
        item.state === 'locked' && 'border-[var(--fr-border-default)] bg-[var(--fr-surface-muted)]',
      )}
      to={`/modules/${item.module.slug}`}
    >
      <span
        className={cn(
          'flex size-16 items-center justify-center rounded-[20px] border text-xl font-bold tabular-nums',
          item.state === 'completed' &&
            'border-[var(--fr-color-learn-correct-500)] bg-[var(--fr-color-learn-correct-500)] text-white',
          item.state === 'current' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-sky-500)] text-white',
          item.state === 'locked' && 'border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)] text-[var(--fr-text-tertiary)]',
        )}
      >
        {item.state === 'current' ? index : <Icon aria-hidden="true" />}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-lg font-bold leading-6 tracking-normal text-[var(--fr-text-primary)]">{item.module.title}</span>
        {item.module.description ? (
          <span className="line-clamp-2 text-sm leading-5 text-[var(--fr-text-secondary)]">{item.module.description}</span>
        ) : null}
        <span className="text-xs font-semibold leading-5 text-[var(--fr-text-tertiary)]">
          {stateCopy[item.state]} · {item.completedLessons} из {item.totalLessons}
        </span>
      </span>
      <ChevronRight aria-hidden="true" className="justify-self-end text-[var(--fr-text-tertiary)]" />
    </Link>
  )
}
