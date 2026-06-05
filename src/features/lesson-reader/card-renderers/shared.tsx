import type { InputHTMLAttributes, ReactNode } from 'react'
import { Check, CheckCircle2, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PillList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-[var(--fr-space-2)]">
      {items.map((item) => (
        <li
          className="inline-flex min-h-9 max-w-full items-center rounded-[var(--fr-radius-full)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] font-semibold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
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
    <ul className="flex flex-col gap-[var(--fr-space-2)]">
      {items.map((item) => (
        <li
          className="grid min-h-12 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-[var(--fr-space-3)] rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
          key={item}
        >
          {checked ? (
            <CheckCircle2 aria-hidden="true" className="shrink-0 text-[var(--fr-color-learn-correct-500)]" />
          ) : (
            <Circle aria-hidden="true" className="shrink-0 text-[var(--fr-text-tertiary)]" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function StaticChoiceList({ options }: { options: Array<{ id: string; label: string; isCorrect?: boolean }> }) {
  return (
    <ul className="flex flex-col gap-[var(--fr-space-2)]">
      {options.map((option) => (
        <li
          className={cn(
            'grid min-h-12 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-[var(--fr-space-3)] rounded-[var(--fr-radius-lg)] border px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)]',
            option.isCorrect
              ? 'border-[var(--fr-color-learn-correct-500)]/30 bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-text-primary)]'
              : 'border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] text-[var(--fr-text-secondary)]',
          )}
          key={option.id}
        >
          {option.isCorrect ? (
            <CheckCircle2 aria-hidden="true" className="shrink-0 text-[var(--fr-color-learn-correct-500)]" />
          ) : (
            <Circle aria-hidden="true" className="shrink-0 text-[var(--fr-text-tertiary)]" />
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

type SelectableOptionState = 'default' | 'selected' | 'correct' | 'retry'

export function SelectableOption({
  children,
  inputProps,
  state = 'default',
  className,
}: {
  children: ReactNode
  inputProps: InputHTMLAttributes<HTMLInputElement>
  state?: SelectableOptionState
  className?: string
}) {
  const { className: inputClassName, type = 'radio', checked, ...restInputProps } = inputProps
  const isCheckbox = type === 'checkbox'
  const isChecked = Boolean(checked)
  const isMarked = isChecked || state === 'correct' || state === 'retry'

  return (
    <label
      className={cn(
        'group relative grid min-h-15 cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border bg-[var(--fr-surface-card)] px-4 py-3 text-[15px] leading-6 text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-[background-color,border-color,box-shadow,transform] duration-200 [overflow-wrap:anywhere] hover:border-[var(--fr-border-strong)] hover:bg-[var(--fr-surface-soft)] active:translate-y-px focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
        state === 'selected' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
        state === 'correct' &&
          'border-[var(--fr-color-learn-correct-500)]/60 bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-text-primary)]',
        state === 'retry' &&
          'border-[var(--fr-color-learn-almost-500)]/60 bg-[var(--fr-color-learn-almost-50)] text-[var(--fr-text-primary)]',
        className,
      )}
    >
      <input
        checked={checked}
        className={cn('peer absolute size-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]', inputClassName)}
        type={type}
        {...restInputProps}
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-5 shrink-0 items-center justify-center self-center border text-[var(--fr-text-tertiary)] transition-[background-color,border-color,color] duration-200',
          isCheckbox ? 'rounded-md' : 'rounded-full',
          !isMarked && 'border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)]',
          isMarked &&
            state !== 'correct' &&
            state !== 'retry' &&
            'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-sky-500)] text-[var(--fr-text-inverse)]',
          state === 'correct' &&
            'border-[var(--fr-color-learn-correct-500)] bg-[var(--fr-color-learn-correct-500)] text-[var(--fr-text-inverse)]',
          state === 'retry' &&
            'border-[var(--fr-color-learn-almost-500)] bg-[var(--fr-color-learn-almost-500)] text-[var(--fr-surface-card)]',
        )}
      >
        {isCheckbox || state === 'correct' ? (
          isMarked ? <Check aria-hidden="true" className="size-3.5" /> : null
        ) : state === 'retry' ? (
          <span className="text-xs font-bold leading-none">!</span>
        ) : isMarked ? (
          <span className="size-2 rounded-full bg-current" />
        ) : null}
      </span>
      <span className="block min-w-0 text-pretty">{children}</span>
    </label>
  )
}
