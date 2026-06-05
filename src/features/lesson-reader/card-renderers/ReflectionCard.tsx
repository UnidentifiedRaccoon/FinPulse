import {
  joinIds,
  type ReflectionCard as ReflectionCardType,
  type ReflectionState,
} from '@/features/lesson-reader/lessonInteraction'

import { PillList, SelectableOption } from './shared'

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
  const displayOptions = card.customOption ? [...(card.options ?? []), card.customOption.label] : card.options

  if (card.readOnly) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-6 text-pretty text-[var(--fr-text-primary)]">{card.prompt}</p>
        {displayOptions ? <PillList items={displayOptions} /> : null}
        {card.guidance ? (
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]" id={guidanceId}>
            {card.guidance}
          </p>
        ) : null}
      </div>
    )
  }

  if (inputType === 'single_select' && ((card.options?.length ?? 0) > 0 || card.customOption)) {
    const customInputId = `${card.id}-custom-option`
    const isCustomSelected = state.isCustomSelected
    const options = card.options ?? []

    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-6 text-pretty text-[var(--fr-text-primary)]">{card.prompt}</p>
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{card.prompt}</legend>
          <ul className="flex flex-col gap-3">
            {options.map((option) => (
              <li key={option}>
                <SelectableOption
                  inputProps={{
                    'aria-describedby': joinIds(guidanceId, statusId),
                    checked: state.singleValue === option,
                    name: `${card.id}-reflection`,
                    onChange: () => onChange({ ...state, isCustomSelected: false, singleValue: option }),
                    type: 'radio',
                    value: option,
                  }}
                  state={!isCustomSelected && state.singleValue === option ? 'selected' : 'default'}
                >
                  {option}
                </SelectableOption>
              </li>
            ))}
            {card.customOption ? (
              <li>
                <SelectableOption
                  inputProps={{
                    'aria-describedby': joinIds(guidanceId, statusId),
                    checked: isCustomSelected,
                    name: `${card.id}-reflection`,
                    onChange: () => onChange({ ...state, isCustomSelected: true, singleValue: '' }),
                    type: 'radio',
                    value: card.customOption.label,
                  }}
                  state={isCustomSelected ? 'selected' : 'default'}
                >
                  {card.customOption.label}
                </SelectableOption>
                {isCustomSelected ? (
                  <div className="mt-2">
                    <label className="sr-only" htmlFor={customInputId}>
                      Введите свой вариант
                    </label>
                    <input
                      aria-describedby={joinIds(guidanceId, statusId)}
                      className="min-h-12 w-full rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-base leading-6 text-[var(--fr-text-primary)] outline-none transition placeholder:text-[var(--fr-text-tertiary)] focus-visible:border-[var(--fr-color-brand-500)] focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
                      id={customInputId}
                      onChange={(event) =>
                        onChange({
                          ...state,
                          isCustomSelected: true,
                          singleValue: '',
                          textValue: event.target.value,
                        })
                      }
                      placeholder={card.customOption.placeholder ?? 'Напиши свой вариант'}
                      type="text"
                      value={state.textValue}
                    />
                  </div>
                ) : null}
              </li>
            ) : null}
          </ul>
        </fieldset>
        <LocalDraftStatus
          id={statusId}
          isActive={isCustomSelected ? state.textValue.trim().length > 0 : Boolean(state.singleValue)}
          text={isCustomSelected ? 'Свой вариант заполнен.' : 'Выбор отмечен.'}
        />
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
        <p className="text-base leading-6 text-pretty text-[var(--fr-text-primary)]">{card.prompt}</p>
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{card.prompt}</legend>
          <ul className="flex flex-col gap-3">
            {card.options.map((option) => {
              const isChecked = state.multiValues.includes(option)

              return (
                <li key={option}>
                  <SelectableOption
                    inputProps={{
                      'aria-describedby': joinIds(guidanceId, statusId),
                      checked: isChecked,
                      name: `${card.id}-reflection`,
                      onChange: () =>
                        onChange({
                          ...state,
                          multiValues: isChecked
                            ? state.multiValues.filter((item) => item !== option)
                            : [...state.multiValues, option],
                        }),
                      type: 'checkbox',
                      value: option,
                    }}
                    state={isChecked ? 'selected' : 'default'}
                  >
                    {option}
                  </SelectableOption>
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
      <p className="text-base leading-6 text-pretty text-[var(--fr-text-primary)]">{card.prompt}</p>
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
      className="sr-only"
      id={id}
      role="status"
    >
      {isActive ? text : 'Ответ пока не заполнен.'}
    </p>
  )
}
