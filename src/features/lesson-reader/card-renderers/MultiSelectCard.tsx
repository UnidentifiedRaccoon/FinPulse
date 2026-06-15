import { useState } from 'react'

import { LessonFeedback } from '@/features/lesson-reader/LessonFeedback'
import type { MultiSelectCard as MultiSelectCardType, MultiSelectState } from '@/features/lesson-reader/lessonInteraction'
import {
  getCorrectMultiSelectOptionIds,
  isMultiSelectAnswerCorrect,
} from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

import { PracticeCardFlow, type PracticeCardFlowDotState } from './PracticeCardFlow'
import { richTextToPlainText } from './richText'
import { NoBreakText, RichTextParagraphs, SelectableOption, StaticChoiceList } from './shared'

export function MultiSelectCard({
  card,
  state,
  onToggle,
  showFeedback = true,
}: {
  card: MultiSelectCardType
  state: MultiSelectState
  onToggle: (optionId: string) => void
  showFeedback?: boolean
}) {
  const feedbackId = `${card.id}-multi-select-feedback`
  const correctOptionIds = new Set(getCorrectMultiSelectOptionIds(card))
  const [activeIndex, setActiveIndex] = useState(0)
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, card.options.length - 1))
  const activeOption = card.options[safeActiveIndex]
  const usePracticeFlow = card.order === 3
  const plainQuestion = richTextToPlainText(card.question)

  if (card.readOnly) {
    return (
      <div className="flex flex-col gap-4">
        <RichTextParagraphs
          paragraphClassName="text-base font-medium leading-6 text-pretty text-[var(--fr-text-primary)]"
          text={card.question}
        />
        <StaticChoiceList options={card.options} />
        {card.feedback ? (
          <RichTextParagraphs
            paragraphClassName="text-sm leading-6 text-[var(--fr-text-secondary)]"
            text={card.feedback}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <RichTextParagraphs
        paragraphClassName="text-base font-medium leading-6 text-pretty text-[var(--fr-text-primary)]"
        text={card.question}
      />
      {usePracticeFlow && activeOption ? (
        <fieldset>
          <legend className="sr-only">{plainQuestion}</legend>
          <PracticeCardFlow
            activeIndex={safeActiveIndex}
            getDotState={(index) =>
              getMultiSelectDotState({
                correctOptionIds,
                isChecked: state.isChecked,
                optionId: card.options[index]?.id,
                selectedOptionIds: state.selectedOptionIds,
              })
            }
            onNext={() => setActiveIndex((current) => Math.min(card.options.length - 1, current + 1))}
            onPrevious={() => setActiveIndex((current) => Math.max(0, current - 1))}
            onSelectIndex={setActiveIndex}
            total={card.options.length}
          >
            <FlowMultiSelectOption
              activeIndex={safeActiveIndex}
              ariaDescribedBy={state.isChecked ? feedbackId : undefined}
              checked={state.selectedOptionIds.includes(activeOption.id)}
              name={`${card.id}-multi-select`}
              onChange={() => onToggle(activeOption.id)}
              optionLabel={activeOption.label}
              state={getOptionState({
                isChecked: state.isChecked,
                isCorrectOption: correctOptionIds.has(activeOption.id),
                isSelected: state.selectedOptionIds.includes(activeOption.id),
              })}
              total={card.options.length}
              value={activeOption.id}
            />
          </PracticeCardFlow>
        </fieldset>
      ) : (
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{plainQuestion}</legend>
          <ul className="flex flex-col gap-3">
            {card.options.map((option) => {
              const isSelected = state.selectedOptionIds.includes(option.id)
              const isCorrectOption = correctOptionIds.has(option.id)
              const optionState = getOptionState({
                isChecked: state.isChecked,
                isCorrectOption,
                isSelected,
              })

              return (
                <li key={option.id}>
                  <SelectableOption
                    inputProps={{
                      'aria-describedby': state.isChecked ? feedbackId : undefined,
                      checked: isSelected,
                      name: `${card.id}-multi-select`,
                      onChange: () => onToggle(option.id),
                      type: 'checkbox',
                      value: option.id,
                    }}
                    state={optionState}
                  >
                    {option.label}
                  </SelectableOption>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}

      {showFeedback && state.isChecked ? (
        <MultiSelectFeedback card={card} id={feedbackId} state={state} />
      ) : null}
    </div>
  )
}

function getOptionState({
  isSelected,
  isCorrectOption,
  isChecked,
}: {
  isSelected: boolean
  isCorrectOption: boolean
  isChecked: boolean
}) {
  if (isChecked && isCorrectOption) return 'correct'
  if (isChecked && isSelected && !isCorrectOption) return 'retry'
  if (isSelected) return 'selected'
  return 'default'
}

type FlowMultiSelectState = 'default' | 'selected' | 'correct' | 'retry'

function FlowMultiSelectOption({
  activeIndex,
  ariaDescribedBy,
  checked,
  name,
  onChange,
  optionLabel,
  state,
  total,
  value,
}: {
  activeIndex: number
  ariaDescribedBy?: string
  checked: boolean
  name: string
  onChange: () => void
  optionLabel: string
  state: FlowMultiSelectState
  total: number
  value: string
}) {
  return (
    <label
      className={cn(
        'relative flex min-h-64 cursor-pointer flex-col justify-between rounded-[var(--fr-radius-xl)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-[var(--fr-space-5)] shadow-[var(--fr-shadow-md)] transition-[background-color,border-color,box-shadow,transform] duration-200 active:translate-y-px focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
        state === 'selected' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)]',
        state === 'correct' && 'border-[var(--fr-color-learn-correct-500)]/60 bg-[var(--fr-color-learn-correct-50)]',
        state === 'retry' && 'border-[var(--fr-color-learn-almost-500)]/60 bg-[var(--fr-color-learn-almost-50)]',
      )}
    >
      <input
        aria-describedby={ariaDescribedBy}
        checked={checked}
        className="peer absolute size-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
        name={name}
        onChange={onChange}
        type="checkbox"
        value={value}
      />
      <span className="flex items-center justify-between gap-[var(--fr-space-3)]">
        <span
          aria-hidden="true"
          className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]"
        >
          {activeIndex + 1} из {total}
        </span>
        {checked ? (
          <span
            aria-hidden="true"
            className="rounded-[var(--fr-radius-full)] bg-[var(--fr-color-brand-50)] px-[var(--fr-space-3)] py-[var(--fr-space-1)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]"
          >
            Отмечено
          </span>
        ) : null}
      </span>
      <span className="block text-balance text-[length:var(--fr-type-heading-lg-size)] font-bold leading-[var(--fr-type-heading-lg-line)] tracking-normal text-[var(--fr-text-primary)]">
        <NoBreakText text={optionLabel} />
      </span>
    </label>
  )
}

function getMultiSelectDotState({
  optionId,
  selectedOptionIds,
  correctOptionIds,
  isChecked,
}: {
  optionId?: string
  selectedOptionIds: string[]
  correctOptionIds: Set<string>
  isChecked: boolean
}): PracticeCardFlowDotState {
  if (!optionId) return 'default'
  const isSelected = selectedOptionIds.includes(optionId)
  const isCorrectOption = correctOptionIds.has(optionId)

  if (isChecked && isCorrectOption && isSelected) return 'correct'
  if (isChecked && isCorrectOption && !isSelected) return 'retry'
  if (isChecked && !isCorrectOption && isSelected) return 'retry'
  if (isSelected) return 'selected'

  return 'default'
}

function MultiSelectFeedback({
  card,
  id,
  state,
}: {
  card: MultiSelectCardType
  id?: string
  state: MultiSelectState
}) {
  const isCorrect = isMultiSelectAnswerCorrect(card, state)
  const selectedIds = new Set(state.selectedOptionIds)
  const missingOptions = card.options.filter((option) => option.isCorrect && !selectedIds.has(option.id))
  const extraOptions = card.options.filter((option) => !option.isCorrect && selectedIds.has(option.id))
  const optionFeedback = card.options
    .filter((option) => selectedIds.has(option.id) && option.feedback)
    .map((option) => option.feedback)
    .filter((feedback): feedback is string => Boolean(feedback))

  if (isCorrect) {
    return (
      <LessonFeedback id={id} tone="correct">
        {card.feedback ? <RichTextParagraphs text={card.feedback} /> : null}
        {!card.feedback ? <p>Все подходящие варианты отмечены.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={id} tone="retry">
      {missingOptions.length ? (
        <p>
          Ещё подходит: <span className="font-semibold text-[var(--fr-text-primary)]"><NoBreakText text={joinLabels(missingOptions)} /></span>.
        </p>
      ) : null}
      {extraOptions.length ? (
        <p>
          Проверь лишнее: <span className="font-semibold text-[var(--fr-text-primary)]"><NoBreakText text={joinLabels(extraOptions)} /></span>.
        </p>
      ) : null}
      {optionFeedback.map((feedback) => (
        <RichTextParagraphs key={feedback} text={feedback} />
      ))}
      {card.feedback ? <RichTextParagraphs text={card.feedback} /> : null}
      {!missingOptions.length && !extraOptions.length && !card.feedback && !optionFeedback.length ? (
        <p>Проверь, все ли подходящие варианты отмечены.</p>
      ) : null}
    </LessonFeedback>
  )
}

function joinLabels(options: Array<{ label: string }>) {
  return options.map((option) => option.label).join(', ')
}
