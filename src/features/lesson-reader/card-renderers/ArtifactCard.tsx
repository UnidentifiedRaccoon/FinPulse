import {
  isArtifactAnswerFilled,
  type ArtifactCard as ArtifactCardType,
  type ArtifactState,
} from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

import { CustomOptionTextarea, NoBreakText, RichTextParagraphs, SelectableOption } from './shared'

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
  const isFilled = isArtifactAnswerFilled(card, state)

  if (card.readOnly) {
    return (
      <div className="flex flex-col gap-4">
        <RichTextParagraphs
          paragraphClassName="text-base leading-7 text-[var(--fr-text-secondary)]"
          text={card.body}
        />
        {card.template ? (
          <ul className="flex flex-col gap-2 text-sm leading-6 text-[var(--fr-text-secondary)]">
            {card.template.map((item) => (
              <li className="rounded-2xl border border-[var(--fr-border-default)] px-4 py-3" key={item}>
                <RichTextParagraphs as="span" text={item} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <RichTextParagraphs
        paragraphClassName="text-base leading-7 text-[var(--fr-text-secondary)]"
        text={card.body}
      />

      {card.variants?.length ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[var(--fr-text-primary)]">Вариант</p>
          {card.customOption ? (
            <ArtifactVariantRadioGroup card={card} onChange={onChange} state={state} statusId={statusId} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {card.variants.map((variant) => (
                <button
                  aria-pressed={state.selectedVariant === variant}
                  className={cn(
                    'min-h-11 max-w-full whitespace-normal rounded-full border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-2 text-left text-sm font-medium leading-5 text-[var(--fr-text-secondary)] transition-colors [overflow-wrap:anywhere] hover:bg-[var(--fr-surface-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15',
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
                  <NoBreakText text={variant} />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {hasTemplate && card.template ? (
        <ul className="flex flex-col gap-3">
          {card.template.map((item, index) => {
            const fieldId = `${card.id}-template-${index}`

            return (
              <li className="flex flex-col gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-3" key={`${item}-${index}`}>
                <label className="text-sm font-semibold leading-6 text-[var(--fr-text-primary)]" htmlFor={fieldId}>
                  <RichTextParagraphs as="span" text={item} />
                </label>
                <textarea
                  aria-describedby={statusId}
                  className="min-h-20 w-full resize-y rounded-xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] px-3 py-2 text-sm leading-6 text-[var(--fr-text-primary)] outline-none transition focus-visible:border-[var(--fr-color-brand-500)] focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
                  id={fieldId}
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
      ) : card.customOption ? null : (
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
        className="sr-only"
        id={statusId}
        role="status"
      >
        {isFilled ? 'Рабочий блок заполнен.' : hasTemplate ? 'Заполни все поля, чтобы продолжить.' : 'Ответ пока не заполнен.'}
      </p>
    </div>
  )
}

function ArtifactVariantRadioGroup({
  card,
  state,
  onChange,
  statusId,
}: {
  card: ArtifactCardType
  state: ArtifactState
  onChange: (nextState: ArtifactState) => void
  statusId: string
}) {
  const customInputId = `${card.id}-custom-variant`

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Вариант</legend>
      <ul className="flex flex-col gap-3">
        {card.variants?.map((variant) => (
          <li key={variant}>
            <SelectableOption
              inputProps={{
                'aria-describedby': statusId,
                checked: !state.isCustomVariantSelected && state.selectedVariant === variant,
                name: `${card.id}-artifact-variant`,
                onChange: () =>
                  onChange({
                    ...state,
                    isCustomVariantSelected: false,
                    selectedVariant: variant,
                  }),
                type: 'radio',
                value: variant,
              }}
              state={!state.isCustomVariantSelected && state.selectedVariant === variant ? 'selected' : 'default'}
            >
              {variant}
            </SelectableOption>
          </li>
        ))}
        {card.customOption ? (
          <li>
            <SelectableOption
              inputProps={{
                'aria-describedby': statusId,
                checked: state.isCustomVariantSelected,
                name: `${card.id}-artifact-variant`,
                onChange: () =>
                  onChange({
                    ...state,
                    isCustomVariantSelected: true,
                    selectedVariant: '',
                  }),
                type: 'radio',
                value: card.customOption.label,
              }}
              state={state.isCustomVariantSelected ? 'selected' : 'default'}
            >
              {card.customOption.label}
            </SelectableOption>
            {state.isCustomVariantSelected ? (
              <CustomOptionTextarea
                describedBy={statusId}
                id={customInputId}
                onValueChange={(value) =>
                  onChange({
                    ...state,
                    customVariantValue: value,
                    isCustomVariantSelected: true,
                    selectedVariant: '',
                  })
                }
                placeholder={card.customOption.placeholder}
                value={state.customVariantValue}
              />
            ) : null}
          </li>
        ) : null}
      </ul>
    </fieldset>
  )
}
