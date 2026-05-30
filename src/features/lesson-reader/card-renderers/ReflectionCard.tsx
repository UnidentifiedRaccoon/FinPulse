import {
  joinIds,
  type ReflectionCard as ReflectionCardType,
  type ReflectionState,
} from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

import { PillList } from './shared'

export function ReflectionCard({
  card,
  state,
  onChange,
}: {
  card: ReflectionCardType
  state: ReflectionState
  onChange: (nextState: ReflectionState) => void
}) {
  const inputType = card.inputType ?? 'freeform'
  const guidanceId = card.guidance ? `${card.id}-guidance` : undefined
  const statusId = `${card.id}-local-status`

  if (card.readOnly) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-7 text-[var(--fr-text-primary)]">{card.prompt}</p>
        {card.options ? <PillList items={card.options} /> : null}
        {card.guidance ? (
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]" id={guidanceId}>
            {card.guidance}
          </p>
        ) : null}
      </div>
    )
  }

  if (inputType === 'single_select' && card.options?.length) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-7 text-[var(--fr-text-primary)]">{card.prompt}</p>
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{card.prompt}</legend>
          <ul className="flex flex-col gap-3">
            {card.options.map((option) => (
              <li key={option}>
                <label
                  className={cn(
                    'flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-colors hover:bg-[var(--fr-surface-soft)] focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
                    state.singleValue === option &&
                      'border-[var(--fr-color-brand-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
                  )}
                >
                  <input
                    aria-describedby={joinIds(guidanceId, statusId)}
                    checked={state.singleValue === option}
                    className="size-4 shrink-0 accent-[var(--fr-color-brand-500)]"
                    name={`${card.id}-reflection`}
                    onChange={() => onChange({ ...state, singleValue: option })}
                    type="radio"
                    value={option}
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <LocalDraftStatus id={statusId} isActive={Boolean(state.singleValue)} text="Выбор отмечен." />
        {card.guidance ? (
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]" id={guidanceId}>
            {card.guidance}
          </p>
        ) : null}
      </div>
    )
  }

  if (inputType === 'multi_select' && card.options?.length) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-7 text-[var(--fr-text-primary)]">{card.prompt}</p>
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{card.prompt}</legend>
          <ul className="flex flex-col gap-3">
            {card.options.map((option) => {
              const isChecked = state.multiValues.includes(option)

              return (
                <li key={option}>
                  <label
                    className={cn(
                      'flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-colors hover:bg-[var(--fr-surface-soft)] focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
                      isChecked &&
                        'border-[var(--fr-color-brand-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
                    )}
                  >
                    <input
                      aria-describedby={joinIds(guidanceId, statusId)}
                      checked={isChecked}
                      className="size-4 shrink-0 accent-[var(--fr-color-brand-500)]"
                      onChange={() =>
                        onChange({
                          ...state,
                          multiValues: isChecked
                            ? state.multiValues.filter((item) => item !== option)
                            : [...state.multiValues, option],
                        })
                      }
                      type="checkbox"
                      value={option}
                    />
                    <span>{option}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
        <LocalDraftStatus
          id={statusId}
          isActive={state.multiValues.length > 0}
          text={`Выбрано: ${state.multiValues.length}.`}
        />
        {card.guidance ? (
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]" id={guidanceId}>
            {card.guidance}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base leading-7 text-[var(--fr-text-primary)]">{card.prompt}</p>
      <label className="sr-only" htmlFor={`${card.id}-textarea`}>
        {inputType === 'table' ? 'Заполнить таблицу' : 'Ответ'}
      </label>
      <textarea
        aria-describedby={joinIds(guidanceId, statusId)}
        className="min-h-32 w-full resize-y rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-primary)] outline-none transition focus-visible:border-[var(--fr-color-brand-500)] focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
        id={`${card.id}-textarea`}
        onChange={(event) => onChange({ ...state, textValue: event.target.value })}
        placeholder={inputType === 'table' ? 'Заполни строки в свободной форме' : 'Напиши ответ здесь'}
        rows={inputType === 'table' ? 6 : 4}
        value={state.textValue}
      />
      <LocalDraftStatus
        id={statusId}
        isActive={state.textValue.trim().length > 0}
        text="Черновик заполнен."
      />
      {card.guidance ? (
        <p className="text-sm leading-6 text-[var(--fr-text-secondary)]" id={guidanceId}>
          {card.guidance}
        </p>
      ) : null}
    </div>
  )
}

function LocalDraftStatus({ id, isActive, text }: { id: string; isActive: boolean; text: string }) {
  return (
    <p
      aria-live="polite"
      className={cn('text-sm leading-6 text-[var(--fr-text-secondary)]', !isActive && 'sr-only')}
      id={id}
      role="status"
    >
      {isActive ? text : 'Ответ пока не заполнен.'}
    </p>
  )
}
