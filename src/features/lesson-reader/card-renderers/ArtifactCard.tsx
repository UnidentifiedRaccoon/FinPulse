import {
  isArtifactAnswerFilled,
  type ArtifactCard as ArtifactCardType,
  type ArtifactState,
} from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

export function ArtifactCard({
  card,
  state,
  onChange,
}: {
  card: ArtifactCardType
  state: ArtifactState
  onChange: (nextState: ArtifactState) => void
}) {
  const hasTemplate = Boolean(card.template?.length)
  const statusId = `${card.id}-artifact-status`

  if (card.readOnly) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{card.body}</p>
        {card.template ? (
          <ul className="flex flex-col gap-2 text-sm leading-6 text-[var(--fr-text-secondary)]">
            {card.template.map((item) => (
              <li className="rounded-2xl border border-[var(--fr-border-default)] px-4 py-3" key={item}>
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{card.body}</p>

      {card.variants?.length ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[var(--fr-text-primary)]">Вариант</p>
          <div className="flex flex-wrap gap-2">
            {card.variants.map((variant) => (
              <button
                aria-pressed={state.selectedVariant === variant}
                className={cn(
                  'min-h-11 rounded-full border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-2 text-sm font-medium leading-5 text-[var(--fr-text-secondary)] transition-colors hover:bg-[var(--fr-surface-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15',
                  state.selectedVariant === variant &&
                    'border-[var(--fr-color-brand-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
                )}
                key={variant}
                onClick={() =>
                  onChange({
                    ...state,
                    selectedVariant: state.selectedVariant === variant ? '' : variant,
                  })
                }
                type="button"
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hasTemplate && card.template ? (
        <ul className="flex flex-col gap-3">
          {card.template.map((item, index) => {
            const rowKey = String(index)
            const isChecked = state.checkedRows.includes(rowKey)

            return (
              <li className="flex flex-col gap-2 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-3" key={`${item}-${index}`}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold leading-6 text-[var(--fr-text-primary)]">
                  <input
                    checked={isChecked}
                    className="size-4 shrink-0 accent-[var(--fr-color-brand-500)]"
                    onChange={() =>
                      onChange({
                        ...state,
                        checkedRows: isChecked
                          ? state.checkedRows.filter((key) => key !== rowKey)
                          : [...state.checkedRows, rowKey],
                      })
                    }
                    type="checkbox"
                  />
                  <span>{item}</span>
                </label>
                <label className="sr-only" htmlFor={`${card.id}-template-${index}`}>
                  {item}
                </label>
                <textarea
                  aria-describedby={statusId}
                  className="min-h-20 w-full resize-y rounded-xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] px-3 py-2 text-sm leading-6 text-[var(--fr-text-primary)] outline-none transition focus-visible:border-[var(--fr-color-brand-500)] focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
                  id={`${card.id}-template-${index}`}
                  onChange={(event) =>
                    onChange({
                      ...state,
                      templateValues: state.templateValues.map((value, valueIndex) =>
                        valueIndex === index ? event.target.value : value,
                      ),
                    })
                  }
                  placeholder="Заполни здесь"
                  rows={2}
                  value={state.templateValues[index] ?? ''}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <>
          <label className="sr-only" htmlFor={`${card.id}-artifact-textarea`}>
            Рабочий ответ
          </label>
          <textarea
            aria-describedby={statusId}
            className="min-h-32 w-full resize-y rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-primary)] outline-none transition focus-visible:border-[var(--fr-color-brand-500)] focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
            id={`${card.id}-artifact-textarea`}
            onChange={(event) => onChange({ ...state, fallbackValue: event.target.value })}
            placeholder="Заполни здесь"
            rows={4}
            value={state.fallbackValue}
          />
        </>
      )}

      <p
        aria-live="polite"
        className={cn('text-sm leading-6 text-[var(--fr-text-secondary)]', !isArtifactAnswerFilled(card, state) && 'sr-only')}
        id={statusId}
        role="status"
      >
        {isArtifactAnswerFilled(card, state) ? 'Рабочий блок заполнен.' : 'Ответ пока не заполнен.'}
      </p>
    </div>
  )
}
