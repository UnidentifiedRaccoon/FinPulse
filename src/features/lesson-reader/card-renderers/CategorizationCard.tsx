import { useEffect, useState } from 'react'

import { LessonFeedback } from '@/features/lesson-reader/LessonFeedback'
import type {
  CategorizationCard as CategorizationCardType,
  CategorizationState,
} from '@/features/lesson-reader/lessonInteraction'
import {
  getCategoryLabel,
  isCategorizationAnswerCorrect,
  isCategorizationAnswerFilled,
} from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

import { NoBreakText, SelectableOption } from './shared'

export function CategorizationCard({
  card,
  state,
  onSelect,
  showFeedback = true,
}: {
  card: CategorizationCardType
  state: CategorizationState
  onSelect: (itemId: string, categoryId: string) => void
  showFeedback?: boolean
}) {
  const feedbackId = `${card.id}-categorization-feedback`
  const useAutoFlow = card.order === 3

  if (card.readOnly) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base font-medium leading-6 text-pretty text-[var(--fr-text-primary)]">
          <NoBreakText text={card.question} />
        </p>
        <ul className="flex flex-col gap-3">
          {card.items.map((item) => (
            <li
              className="rounded-2xl border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] p-4"
              key={item.id}
            >
              <p className="text-sm font-semibold leading-5 text-[var(--fr-text-primary)]">
                <NoBreakText text={item.label} />
              </p>
              <p className="mt-1 text-sm leading-5 text-[var(--fr-text-secondary)]">
                <NoBreakText text={getCategoryLabel(card, item.correctCategoryId) ?? item.correctCategoryId} />
              </p>
            </li>
          ))}
        </ul>
        {card.feedback ? (
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">
            <NoBreakText text={card.feedback} />
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-medium leading-6 text-pretty text-[var(--fr-text-primary)]">
        <NoBreakText text={card.question} />
      </p>
      {useAutoFlow ? (
        <AutoCategorizationFlow card={card} feedbackId={feedbackId} onSelect={onSelect} state={state} />
      ) : (
        <div className="flex flex-col gap-3">
          {card.items.map((item) => {
            const selectedCategoryId = state.selectedCategoryIdsByItemId[item.id] ?? ''

            return (
              <fieldset
                className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-3"
                key={item.id}
              >
                <legend className="mb-3 text-sm font-semibold leading-5 text-[var(--fr-text-primary)]">
                  <NoBreakText text={item.label} />
                </legend>
                <ul className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                  {card.categories.map((category) => {
                    const isSelected = selectedCategoryId === category.id
                    const categoryState = getCategoryOptionState({
                      categoryId: category.id,
                      correctCategoryId: item.correctCategoryId,
                      isChecked: state.isChecked,
                      isSelected,
                    })

                    return (
                      <li key={category.id}>
                        <SelectableOption
                          className="min-h-12 rounded-xl px-3 py-2 text-sm leading-5"
                          inputProps={{
                            'aria-describedby': state.isChecked ? feedbackId : undefined,
                            checked: isSelected,
                            name: `${card.id}-${item.id}-category`,
                            onChange: () => onSelect(item.id, category.id),
                            type: 'radio',
                            value: category.id,
                          }}
                          state={categoryState}
                        >
                          {category.label}
                        </SelectableOption>
                      </li>
                    )
                  })}
                </ul>
              </fieldset>
            )
          })}
        </div>
      )}

      {showFeedback && state.isChecked ? (
        <CategorizationFeedback card={card} id={feedbackId} state={state} />
      ) : null}
    </div>
  )
}

function getCategoryOptionState({
  isSelected,
  isChecked,
  categoryId,
  correctCategoryId,
}: {
  isSelected: boolean
  isChecked: boolean
  categoryId: string
  correctCategoryId: string
}) {
  if (isChecked && categoryId === correctCategoryId) return 'correct'
  if (isChecked && isSelected && categoryId !== correctCategoryId) return 'retry'
  if (isSelected) return 'selected'
  return 'default'
}

type FlowCategoryState = 'default' | 'selected' | 'correct' | 'retry'

function AutoCategorizationFlow({
  card,
  feedbackId,
  onSelect,
  state,
}: {
  card: CategorizationCardType
  feedbackId: string
  onSelect: (itemId: string, categoryId: string) => void
  state: CategorizationState
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)
  const [isTurning, setIsTurning] = useState(false)
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, card.items.length - 1))
  const activeItem = card.items[safeActiveIndex]
  const isComplete = isCategorizationAnswerFilled(card, state)

  useEffect(() => {
    if (!isTurning || pendingIndex === null) {
      return
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex(pendingIndex)
      setPendingIndex(null)
      setIsTurning(false)
    }, 180)

    return () => window.clearTimeout(timeout)
  }, [isTurning, pendingIndex])

  if (isComplete) {
    return <CategorizationResultMatrix card={card} feedbackId={feedbackId} onSelect={onSelect} state={state} />
  }

  if (!activeItem) return null

  function handleSelect(categoryId: string) {
    if (isTurning || !activeItem) {
      return
    }

    const nextAssignments = {
      ...state.selectedCategoryIdsByItemId,
      [activeItem.id]: categoryId,
    }

    onSelect(activeItem.id, categoryId)

    if (!areAllCategorizationItemsAssigned(card, nextAssignments)) {
      setPendingIndex(getNextUnassignedCategorizationIndex(card, nextAssignments, safeActiveIndex))
      setIsTurning(true)
    }
  }

  return (
    <div className="flex flex-col justify-between gap-[var(--fr-space-3)]">
      <div aria-live="polite" className="fr-auto-card-stage relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-[var(--fr-space-6)] bottom-0 top-[var(--fr-space-3)] rounded-[var(--fr-radius-xl)] bg-[var(--fr-border-subtle)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-[var(--fr-space-3)] bottom-[var(--fr-space-1)] top-[var(--fr-space-2)] rounded-[var(--fr-radius-xl)] bg-[var(--fr-color-brand-50)]"
        />
        <fieldset
          className={cn(
            'fr-auto-card-enter relative flex min-h-36 flex-col gap-[var(--fr-space-4)] rounded-[var(--fr-radius-xl)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-[var(--fr-space-4)] shadow-[var(--fr-shadow-md)]',
            isTurning && 'fr-auto-card-exit',
          )}
          key={activeItem.id}
        >
          <legend className="sr-only">{activeItem.label}</legend>
          <div className="flex flex-col gap-[var(--fr-space-2)]">
            <span className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]">
              {safeActiveIndex + 1} из {card.items.length}
            </span>
            <p className="text-pretty text-[length:var(--fr-type-heading-md-size)] font-bold leading-[var(--fr-type-heading-md-line)] tracking-normal text-[var(--fr-text-primary)]">
              <NoBreakText text={activeItem.label} />
            </p>
          </div>

          <ul className="grid grid-cols-1 items-stretch gap-[var(--fr-space-2)] min-[360px]:grid-cols-2">
            {card.categories.map((category) => {
              const selectedCategoryId = state.selectedCategoryIdsByItemId[activeItem.id] ?? ''
              const isSelected = selectedCategoryId === category.id
              const categoryState = getCategoryOptionState({
                categoryId: category.id,
                correctCategoryId: activeItem.correctCategoryId,
                isChecked: state.isChecked,
                isSelected,
              })

              return (
                <li className="flex min-w-0" key={category.id}>
                  <FlowCategoryOption
                    ariaDescribedBy={state.isChecked ? feedbackId : undefined}
                    checked={isSelected}
                    disabled={isTurning}
                    label={category.label}
                    name={`${card.id}-${activeItem.id}-category`}
                    onChange={() => handleSelect(category.id)}
                    state={categoryState}
                    value={category.id}
                  />
                </li>
              )
            })}
          </ul>
        </fieldset>
      </div>

      <AutoFlowDots activeIndex={safeActiveIndex} card={card} state={state} />
    </div>
  )
}

function FlowCategoryOption({
  ariaDescribedBy,
  checked,
  disabled = false,
  label,
  name,
  onChange,
  state,
  value,
}: {
  ariaDescribedBy?: string
  checked: boolean
  disabled?: boolean
  label: string
  name: string
  onChange: () => void
  state: FlowCategoryState
  value: string
}) {
  return (
    <label
      className={cn(
        'relative flex h-full min-h-12 w-full cursor-pointer items-center justify-center rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-2)] py-[var(--fr-space-2)] text-center text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-secondary)] transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] hover:border-[var(--fr-color-sky-500)] hover:bg-[var(--fr-surface-card)] hover:text-[var(--fr-text-primary)] hover:shadow-[var(--fr-shadow-md)] focus-within:ring-2 focus-within:ring-[var(--fr-color-sky-500)]',
        state === 'selected' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
        state === 'correct' &&
          'border-[var(--fr-color-learn-correct-500)]/60 bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-text-primary)]',
        state === 'retry' &&
          'border-[var(--fr-color-learn-almost-500)]/60 bg-[var(--fr-color-learn-almost-50)] text-[var(--fr-text-primary)]',
        disabled && 'pointer-events-none opacity-80',
      )}
    >
      <input
        aria-describedby={ariaDescribedBy}
        checked={checked}
        className="peer absolute size-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
        disabled={disabled}
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
      <span className="min-w-0 text-center">{label}</span>
    </label>
  )
}

function CategorizationResultMatrix({
  card,
  feedbackId,
  onSelect,
  state,
}: {
  card: CategorizationCardType
  feedbackId: string
  onSelect: (itemId: string, categoryId: string) => void
  state: CategorizationState
}) {
  const gridTemplateColumns = `minmax(7.5rem,1fr) repeat(${card.categories.length}, minmax(4.5rem,4.75rem))`

  return (
    <div className="overflow-hidden rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)]">
      <div
        className="grid border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]"
        style={{ gridTemplateColumns }}
      >
        <span className="px-[var(--fr-space-3)] py-[var(--fr-space-2)]">Пункт</span>
        {card.categories.map((category) => (
          <span
            className="px-1.5 py-[var(--fr-space-2)] text-center text-[length:var(--fr-type-caption-sm-size)] leading-[var(--fr-type-caption-sm-line)] [hyphens:none] [overflow-wrap:normal] [word-break:normal]"
            key={category.id}
          >
            {category.label}
          </span>
        ))}
      </div>

      {card.items.map((item) => (
        <div
          className="grid border-b border-[var(--fr-border-subtle)] last:border-b-0"
          key={item.id}
          style={{ gridTemplateColumns }}
        >
          <div className="min-w-0 px-[var(--fr-space-3)] py-[var(--fr-space-3)]">
            <span className="min-w-0 text-pretty text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-primary)]">
              <NoBreakText text={item.label} />
            </span>
          </div>

          {card.categories.map((category) => {
            const selectedCategoryId = state.selectedCategoryIdsByItemId[item.id] ?? ''
            const isSelected = selectedCategoryId === category.id
            const cellState = getResultCellState({
              categoryId: category.id,
              correctCategoryId: item.correctCategoryId,
              isChecked: state.isChecked,
              isSelected,
            })

            return (
              <button
                aria-describedby={state.isChecked ? feedbackId : undefined}
                aria-label={`${item.label}: ${category.label}`}
                aria-pressed={isSelected}
                className={cn(
                  'flex min-h-12 items-center justify-center border-l border-[var(--fr-border-subtle)] px-[var(--fr-space-1)] text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] transition-[background-color,border-color,color,box-shadow] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fr-color-sky-500)]',
                  cellState === 'selected' && 'bg-[var(--fr-color-brand-50)] text-[var(--fr-color-sky-600)]',
                  cellState === 'correct' &&
                    'bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-color-learn-correct-500)]',
                  cellState === 'retry' &&
                    'bg-[var(--fr-color-learn-almost-50)] text-[var(--fr-color-learn-almost-500)]',
                  cellState === 'default' && 'text-[var(--fr-text-tertiary)] hover:bg-[var(--fr-surface-soft)]',
                )}
                key={category.id}
                onClick={() => onSelect(item.id, category.id)}
                type="button"
              >
                {isSelected ? '✓' : '—'}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function AutoFlowDots({
  activeIndex,
  card,
  state,
}: {
  activeIndex: number
  card: CategorizationCardType
  state: CategorizationState
}) {
  return (
    <div aria-label="Карточки задания" className="flex min-w-0 flex-nowrap justify-center gap-0">
      {card.items.map((item, index) => {
        const isAssigned = Boolean(state.selectedCategoryIdsByItemId[item.id])

        return (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--fr-radius-full)]" key={item.id}>
            <span
              aria-hidden="true"
              className={cn(
                'block size-2.5 rounded-[var(--fr-radius-full)] border transition-[background-color,border-color,transform]',
                activeIndex === index
                  ? 'scale-125 border-[var(--fr-color-sky-500)] bg-[var(--fr-color-sky-500)]'
                  : isAssigned
                    ? 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)]'
                    : 'border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)]',
              )}
            />
          </span>
        )
      })}
    </div>
  )
}

function getResultCellState({
  isSelected,
  isChecked,
  categoryId,
  correctCategoryId,
}: {
  isSelected: boolean
  isChecked: boolean
  categoryId: string
  correctCategoryId: string
}): FlowCategoryState {
  if (isChecked && isSelected && categoryId === correctCategoryId) return 'correct'
  if (isChecked && isSelected && categoryId !== correctCategoryId) return 'retry'
  if (isSelected) return 'selected'
  return 'default'
}

function areAllCategorizationItemsAssigned(
  card: CategorizationCardType,
  selectedCategoryIdsByItemId: Record<string, string>,
) {
  return card.items.every((item) => Boolean(selectedCategoryIdsByItemId[item.id]))
}

function getNextUnassignedCategorizationIndex(
  card: CategorizationCardType,
  selectedCategoryIdsByItemId: Record<string, string>,
  activeIndex: number,
) {
  const orderedIndexes = card.items.map((_, index) => (activeIndex + index + 1) % card.items.length)
  return orderedIndexes.find((index) => !selectedCategoryIdsByItemId[card.items[index].id]) ?? activeIndex
}

export function CategorizationFeedback({
  card,
  id,
  state,
}: {
  card: CategorizationCardType
  id?: string
  state: CategorizationState
}) {
  const isCorrect = isCategorizationAnswerCorrect(card, state)
  const incorrectItems = card.items.filter(
    (item) => state.selectedCategoryIdsByItemId[item.id] !== item.correctCategoryId,
  )

  if (isCorrect) {
    return (
      <LessonFeedback id={id} tone="correct">
        {card.feedback ? <p><NoBreakText text={card.feedback} /></p> : null}
        {!card.feedback ? <p>Все элементы распределены по подходящим группам.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={id} tone="retry">
      {incorrectItems.slice(0, 3).map((item) => (
        <p key={item.id}>
          Уточни: <span className="font-semibold text-[var(--fr-text-primary)]"><NoBreakText text={item.label} /></span> →{' '}
          <span className="font-semibold text-[var(--fr-text-primary)]">
            <NoBreakText text={getCategoryLabel(card, item.correctCategoryId) ?? item.correctCategoryId} />
          </span>.
        </p>
      ))}
      {incorrectItems.length > 3 ? <p>И ещё {incorrectItems.length - 3} пункт(а) стоит пересмотреть.</p> : null}
      {incorrectItems.map((item) => (item.feedback ? <p key={`${item.id}-feedback`}><NoBreakText text={item.feedback} /></p> : null))}
      {card.feedback ? <p><NoBreakText text={card.feedback} /></p> : null}
      {!incorrectItems.length && !card.feedback ? <p>Проверь распределение ещё раз.</p> : null}
    </LessonFeedback>
  )
}
