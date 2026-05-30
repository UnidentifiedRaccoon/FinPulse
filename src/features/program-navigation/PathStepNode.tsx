import { Check, ChevronRight, Lock, Play } from 'lucide-react'
import { Link } from 'react-router'

import type { PathItemState } from './learningPath'
import { cn } from '@/lib/utils'

const stateCopy = {
  completed: {
    label: 'Пройден',
    icon: Check,
  },
  current: {
    label: 'Текущий шаг',
    icon: Play,
  },
  locked: {
    label: 'Будущий шаг',
    icon: Lock,
  },
} satisfies Record<PathItemState, { label: string; icon: typeof Check }>

export function PathStepNode({
  title,
  description,
  meta,
  state,
  to,
  index,
}: {
  title: string
  description?: string
  meta?: string
  state: PathItemState
  to: string
  index: number
}) {
  const Icon = stateCopy[state].icon

  return (
    <Link
      aria-label={`${title}. ${stateCopy[state].label}. Открыть урок`}
      className={cn(
        'group grid min-h-20 grid-cols-[56px_minmax(0,1fr)_24px] items-center gap-3 rounded-[20px] border bg-[var(--fr-surface-card)] px-3 py-3 shadow-[var(--fr-shadow-sm)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        state === 'completed' && 'border-[var(--fr-color-learn-correct-500)]/35 bg-[var(--fr-color-learn-correct-50)]',
        state === 'current' && 'border-[var(--fr-color-sky-500)] bg-white shadow-[0_8px_24px_rgba(30,155,215,0.16)]',
        state === 'locked' && 'border-[var(--fr-border-default)] bg-[var(--fr-surface-muted)] opacity-90',
      )}
      to={to}
    >
      <span
        className={cn(
          'relative flex size-14 items-center justify-center rounded-2xl border text-lg font-bold tabular-nums',
          state === 'completed' &&
            'border-[var(--fr-color-learn-correct-500)] bg-[var(--fr-color-learn-correct-500)] text-white',
          state === 'current' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-sky-500)] text-white',
          state === 'locked' && 'border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)] text-[var(--fr-text-tertiary)]',
        )}
      >
        {state === 'locked' ? <Icon aria-hidden="true" /> : state === 'completed' ? <Icon aria-hidden="true" /> : index}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-base font-bold leading-6 tracking-normal text-[var(--fr-text-primary)]">{title}</span>
        {description ? (
          <span className="line-clamp-2 text-sm leading-5 text-[var(--fr-text-secondary)]">{description}</span>
        ) : null}
        <span className="text-xs font-semibold leading-5 text-[var(--fr-text-tertiary)]">
          {stateCopy[state].label}
          {meta ? ` · ${meta}` : ''}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className={cn(
          'justify-self-end text-[var(--fr-text-tertiary)] transition group-hover:translate-x-0.5',
          state === 'current' && 'text-[var(--fr-color-sky-500)]',
        )}
      />
    </Link>
  )
}
