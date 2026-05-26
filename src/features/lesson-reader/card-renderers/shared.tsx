import { CheckCircle2, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PillList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          className="rounded-full bg-[var(--fr-surface-soft)] px-3 py-1 text-xs font-medium leading-5 text-[var(--fr-text-secondary)]"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function StaticChecklist({ items, checked = false }: { items: string[]; checked?: boolean }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li className="flex items-start gap-2 text-sm leading-6 text-[var(--fr-text-secondary)]" key={item}>
          {checked ? (
            <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-[var(--fr-color-learn-correct-500)]" />
          ) : (
            <Circle aria-hidden="true" className="mt-1 shrink-0 text-[var(--fr-text-tertiary)]" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function StaticChoiceList({ options }: { options: Array<{ id: string; label: string; isCorrect?: boolean }> }) {
  return (
    <ul className="flex flex-col gap-2">
      {options.map((option) => (
        <li
          className={cn(
            'flex min-h-12 items-start gap-2 rounded-2xl border px-3 py-2 text-sm leading-6',
            option.isCorrect
              ? 'border-[var(--fr-color-learn-correct-500)]/30 bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-text-primary)]'
              : 'border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] text-[var(--fr-text-secondary)]',
          )}
          key={option.id}
        >
          {option.isCorrect ? (
            <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-[var(--fr-color-learn-correct-500)]" />
          ) : (
            <Circle aria-hidden="true" className="mt-1 shrink-0 text-[var(--fr-text-tertiary)]" />
          )}
          <span>
            {option.isCorrect ? <span className="sr-only">Подходящий вариант: </span> : null}
            {option.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
