import { useState } from 'react'

import { LessonFeedback } from '@/features/lesson-reader/LessonFeedback'
import type { ChoiceCard as ChoiceCardType, ChoiceState } from '@/features/lesson-reader/lessonInteraction'
import { getChoiceOptions, getChoiceQuestion, getCorrectOption } from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

import { PracticeCardFlow, type PracticeCardFlowDotState } from './PracticeCardFlow'
import { richTextToPlainText } from './richText'
import { NoBreakText, RichTextParagraphs, SelectableOption } from './shared'

export function ChoiceCard({
  card,
  state,
  onSelect,
  showFeedback = true,
}: {
  card: ChoiceCardType
  state: ChoiceState
  onSelect: (optionId: string) => void
  showFeedback?: boolean
}) {
  const options = getChoiceOptions(card)
  const question = getChoiceQuestion(card)
  const plainQuestion = richTextToPlainText(question)
  const correctOption = getCorrectOption(card)
  const selectedOption = options.find((option) => option.id === state.selectedOptionId)
  const isCorrect = Boolean(correctOption && selectedOption?.id === correctOption.id)
  const hasObjectiveAnswer = Boolean(correctOption)
  const feedbackId = `${card.id}-choice-feedback`
  const [activeIndex, setActiveIndex] = useState(0)
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, options.length - 1))
  const activeOption = options[safeActiveIndex]
  const usePracticeFlow = hasObjectiveAnswer && card.order === 3

  return (
    <div className="flex flex-col gap-4">
      {card.type === 'scenario' ? (
        <RichTextParagraphs
          className="flex flex-col gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4"
          paragraphClassName="text-sm leading-6 text-[var(--fr-text-secondary)]"
          text={card.body}
        />
      ) : null}
      <RichTextParagraphs
        paragraphClassName="text-base leading-6 text-pretty text-[var(--fr-text-primary)]"
        text={question}
      />
      {usePracticeFlow && activeOption ? (
        <fieldset>
          <legend className="sr-only">{plainQuestion}</legend>
          <PracticeCardFlow
            activeIndex={safeActiveIndex}
            getDotState={(index) =>
              getChoiceDotState({
                correctOptionId: correctOption?.id,
                isChecked: state.isChecked && hasObjectiveAnswer,
                optionId: options[index]?.id,
                selectedOptionId: state.selectedOptionId,
              })
            }
            onNext={() => setActiveIndex((current) => Math.min(options.length - 1, current + 1))}
            onPrevious={() => setActiveIndex((current) => Math.max(0, current - 1))}
            onSelectIndex={setActiveIndex}
            total={options.length}
          >
            <FlowChoiceOption
              activeIndex={safeActiveIndex}
              ariaDescribedBy={state.isChecked ? feedbackId : undefined}
              checked={state.selectedOptionId === activeOption.id}
              name={`${card.id}-choice`}
              onChange={() => onSelect(activeOption.id)}
              optionLabel={activeOption.label}
              state={getOptionState({
                isSelected: state.selectedOptionId === activeOption.id,
                optionIsCorrect: Boolean(correctOption && activeOption.id === correctOption.id),
                showStatus: state.isChecked && state.selectedOptionId === activeOption.id && hasObjectiveAnswer,
              })}
              total={options.length}
              type="radio"
              value={activeOption.id}
            />
          </PracticeCardFlow>
        </fieldset>
      ) : (
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">{plainQuestion}</legend>
          <ul className="flex flex-col gap-3">
            {options.map((option) => {
              const isSelected = state.selectedOptionId === option.id
              const showStatus = state.isChecked && isSelected && hasObjectiveAnswer
              const optionIsCorrect = Boolean(correctOption && option.id === correctOption.id)

              return (
                <li key={option.id}>
                  <SelectableOption
                    inputProps={{
                      'aria-describedby': showStatus ? feedbackId : undefined,
                      checked: isSelected,
                      name: `${card.id}-choice`,
                      onChange: () => onSelect(option.id),
                      type: 'radio',
                      value: option.id,
                    }}
                    state={getOptionState({ isSelected, optionIsCorrect, showStatus })}
                  >
                    {option.label}
                  </SelectableOption>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}

      {showFeedback && state.isChecked && selectedOption ? (
        <ChoiceFeedback
          cardFeedback={card.feedback}
          correctOptionLabel={correctOption?.label}
          hasObjectiveAnswer={hasObjectiveAnswer}
          id={feedbackId}
          isCorrect={isCorrect}
          selectedFeedback={selectedOption.feedback}
        />
      ) : null}
    </div>
  )
}

function getOptionState({
  isSelected,
  optionIsCorrect,
  showStatus,
}: {
  isSelected: boolean
  optionIsCorrect: boolean
  showStatus: boolean
}) {
  if (showStatus && optionIsCorrect) return 'correct'
  if (showStatus && !optionIsCorrect) return 'retry'
  if (isSelected) return 'selected'
  return 'default'
}

type FlowChoiceState = 'default' | 'selected' | 'correct' | 'retry'

function FlowChoiceOption({
  activeIndex,
  ariaDescribedBy,
  checked,
  name,
  onChange,
  optionLabel,
  state,
  total,
  type,
  value,
}: {
  activeIndex: number
  ariaDescribedBy?: string
  checked: boolean
  name: string
  onChange: () => void
  optionLabel: string
  state: FlowChoiceState
  total: number
  type: 'radio' | 'checkbox'
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
        type={type}
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
            {type === 'checkbox' ? 'Отмечено' : 'Выбрано'}
          </span>
        ) : null}
      </span>
      <span className="block text-balance text-[length:var(--fr-type-heading-lg-size)] font-bold leading-[var(--fr-type-heading-lg-line)] tracking-normal text-[var(--fr-text-primary)]">
        <NoBreakText text={optionLabel} />
      </span>
    </label>
  )
}

function getChoiceDotState({
  optionId,
  selectedOptionId,
  correctOptionId,
  isChecked,
}: {
  optionId?: string
  selectedOptionId?: string
  correctOptionId?: string
  isChecked: boolean
}): PracticeCardFlowDotState {
  if (!optionId) return 'default'
  const isSelected = selectedOptionId === optionId

  if (isChecked && isSelected && correctOptionId === optionId) return 'correct'
  if (isChecked && isSelected && correctOptionId !== optionId) return 'retry'
  if (isSelected) return 'selected'

  return 'default'
}

function ChoiceFeedback({
  id,
  isCorrect,
  hasObjectiveAnswer,
  correctOptionLabel,
  selectedFeedback,
  cardFeedback,
}: {
  id: string
  isCorrect: boolean
  hasObjectiveAnswer: boolean
  correctOptionLabel?: string
  selectedFeedback?: string
  cardFeedback?: string
}) {
  if (!hasObjectiveAnswer) {
    return (
      <LessonFeedback id={id} tone={selectedFeedback || cardFeedback ? 'almost' : 'info'}>
        {selectedFeedback ? <RichTextParagraphs text={selectedFeedback} /> : null}
        {cardFeedback ? <RichTextParagraphs text={cardFeedback} /> : null}
        {!selectedFeedback && !cardFeedback ? <p>Выбор отмечен. Можно продолжать.</p> : null}
      </LessonFeedback>
    )
  }

  if (isCorrect) {
    return (
      <LessonFeedback id={id} tone="correct">
        {selectedFeedback ? <RichTextParagraphs text={selectedFeedback} /> : null}
        {cardFeedback ? <RichTextParagraphs text={cardFeedback} /> : null}
        {!selectedFeedback && !cardFeedback ? <p>Эта формулировка лучше всего подходит к шагу.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={id} tone="retry">
      {correctOptionLabel ? (
        <p>
          Лучше подходит: <span className="font-semibold text-[var(--fr-text-primary)]"><NoBreakText text={correctOptionLabel} /></span>.
        </p>
      ) : null}
      {selectedFeedback ? <RichTextParagraphs text={selectedFeedback} /> : null}
      {cardFeedback ? <RichTextParagraphs text={cardFeedback} /> : null}
      {!selectedFeedback && !cardFeedback ? <p>Посмотри на вариант, где есть смысл, срок или связь с ценностью.</p> : null}
    </LessonFeedback>
  )
}
