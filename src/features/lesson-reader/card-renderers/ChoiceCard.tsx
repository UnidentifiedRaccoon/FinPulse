import { CheckCircle2, Circle } from 'lucide-react'

import { LessonFeedback } from '@/features/lesson-reader/LessonFeedback'
import type { ChoiceCard as ChoiceCardType, ChoiceState } from '@/features/lesson-reader/lessonInteraction'
import { getChoiceOptions, getChoiceQuestion, getCorrectOption } from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

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
  const correctOption = getCorrectOption(card)
  const selectedOption = options.find((option) => option.id === state.selectedOptionId)
  const isCorrect = Boolean(correctOption && selectedOption?.id === correctOption.id)
  const hasObjectiveAnswer = Boolean(correctOption)
  const feedbackId = `${card.id}-choice-feedback`

  return (
    <div className="flex flex-col gap-4">
      {card.type === 'scenario' ? (
        <p className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
          {card.body}
        </p>
      ) : null}
      <p className="text-base font-medium leading-7 text-[var(--fr-text-primary)]">{question}</p>
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">{question}</legend>
        <ul className="flex flex-col gap-3">
          {options.map((option) => {
            const isSelected = state.selectedOptionId === option.id
            const showStatus = state.isChecked && isSelected && hasObjectiveAnswer
            const optionIsCorrect = Boolean(correctOption && option.id === correctOption.id)

            return (
              <li key={option.id}>
                <label
                  className={cn(
                    'flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-colors [overflow-wrap:anywhere] hover:bg-[var(--fr-surface-soft)] focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
                    isSelected &&
                      'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
                    showStatus &&
                      optionIsCorrect &&
                      'border-[var(--fr-color-learn-correct-500)]/60 bg-[var(--fr-color-learn-correct-50)]',
                    showStatus &&
                      !optionIsCorrect &&
                      'border-[var(--fr-color-learn-almost-500)]/60 bg-[var(--fr-color-learn-almost-50)]',
                  )}
                >
                  <input
                    aria-describedby={showStatus ? feedbackId : undefined}
                    checked={isSelected}
                    className="mt-1 size-4 shrink-0 accent-[var(--fr-color-sky-500)]"
                    name={`${card.id}-choice`}
                    onChange={() => onSelect(option.id)}
                    type="radio"
                    value={option.id}
                  />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span>{option.label}</span>
                    {showStatus ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-semibold',
                          optionIsCorrect
                            ? 'text-[var(--fr-color-learn-correct-500)]'
                            : 'text-[var(--fr-color-brand-700)]',
                        )}
                      >
                        {optionIsCorrect ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
                        {optionIsCorrect ? 'Подходит' : 'Есть нюанс'}
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

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
        {selectedFeedback ? <p>{selectedFeedback}</p> : null}
        {cardFeedback ? <p>{cardFeedback}</p> : null}
        {!selectedFeedback && !cardFeedback ? <p>Выбор отмечен. Можно продолжать.</p> : null}
      </LessonFeedback>
    )
  }

  if (isCorrect) {
    return (
      <LessonFeedback id={id} tone="correct">
        {selectedFeedback ? <p>{selectedFeedback}</p> : null}
        {cardFeedback ? <p>{cardFeedback}</p> : null}
        {!selectedFeedback && !cardFeedback ? <p>Эта формулировка лучше всего подходит к шагу.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={id} tone="retry">
      {correctOptionLabel ? (
        <p>
          Лучше подходит: <span className="font-semibold text-[var(--fr-text-primary)]">{correctOptionLabel}</span>.
        </p>
      ) : null}
      {selectedFeedback ? <p>{selectedFeedback}</p> : null}
      {cardFeedback ? <p>{cardFeedback}</p> : null}
      {!selectedFeedback && !cardFeedback ? <p>Посмотри на вариант, где есть смысл, срок или связь с ценностью.</p> : null}
    </LessonFeedback>
  )
}
