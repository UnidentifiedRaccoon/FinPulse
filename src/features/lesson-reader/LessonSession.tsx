import { CheckCircle2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'

import type { LessonDetails } from '@/api/client'
import { Button } from '@/components/ui/button'
import type { Card } from '@/content/program'

import { LessonBottomAction } from './LessonBottomAction'
import { LessonCardFrame } from './LessonCardFrame'
import { LessonCardRenderer, type LessonCardInteractionProps } from './LessonCardRenderer'
import { LessonFeedback } from './LessonFeedback'
import { LessonProgressHeader } from './LessonProgressHeader'
import type { ArtifactState, ChecklistState, ChoiceState, ReflectionState } from './lessonInteraction'
import {
  createArtifactState,
  emptyChecklistState,
  emptyChoiceState,
  emptyReflectionState,
  getCorrectOption,
  getChoiceOptions,
  isInteractiveChoice,
} from './lessonInteraction'

export function LessonSession({
  details,
  isLessonCompleted,
  canSaveProgress,
  onCardViewed,
  onCardCompleted,
  onLessonCompleted,
}: {
  details: LessonDetails
  isLessonCompleted: boolean
  canSaveProgress: boolean
  onCardViewed?: (cardId: string) => void | Promise<void>
  onCardCompleted?: (cardId: string) => void | Promise<void>
  onLessonCompleted?: (lessonSlug: string) => void | Promise<void>
}) {
  const cards = useMemo(() => getOrderedCards(details.lesson), [details.lesson])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [choiceStates, setChoiceStates] = useState<Record<string, ChoiceState>>({})
  const [checklistStates, setChecklistStates] = useState<Record<string, ChecklistState>>({})
  const [reflectionStates, setReflectionStates] = useState<Record<string, ReflectionState>>({})
  const [artifactStates, setArtifactStates] = useState<Record<string, ArtifactState>>({})
  const viewedCardIdsRef = useRef(new Set<string>())

  const activeCard = cards[activeIndex]
  const isLastCard = activeIndex === cards.length - 1
  const currentPosition = Math.min(activeIndex + 1, cards.length)
  const context = `${details.module.title} · ${details.unit.title}`
  const showLessonIntro = activeIndex === 0 && (details.lesson.description || details.lesson.learningGoal)

  useEffect(() => {
    if (!activeCard || !onCardViewed || viewedCardIdsRef.current.has(activeCard.id)) return
    viewedCardIdsRef.current.add(activeCard.id)
    void onCardViewed(activeCard.id)
  }, [activeCard, onCardViewed])

  if (!activeCard) {
    return (
      <section className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5">
        <h1 className="text-xl font-bold text-[var(--fr-text-primary)]">В уроке пока нет карточек</h1>
      </section>
    )
  }

  const action = getPrimaryAction(activeCard, choiceStates[activeCard.id] ?? emptyChoiceState, isLastCard)
  const bottomFeedback = getBottomFeedback(activeCard, choiceStates[activeCard.id] ?? emptyChoiceState)
  const interaction = getInteractionProps({
    card: activeCard,
    choiceStates,
    checklistStates,
    reflectionStates,
    artifactStates,
    setChoiceStates,
    setChecklistStates,
    setReflectionStates,
    setArtifactStates,
  })

  const completeAndAdvance = async () => {
    setIsSaving(true)
    try {
      await onCardCompleted?.(activeCard.id)

      if (isLastCard) {
        await onLessonCompleted?.(details.lesson.slug)
        setIsComplete(true)
        return
      }

      setActiveIndex((current) => Math.min(current + 1, cards.length - 1))
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrimaryAction = () => {
    if (action.mode === 'check') {
      setChoiceStates((current) => ({
        ...current,
        [activeCard.id]: {
          ...(current[activeCard.id] ?? emptyChoiceState),
          isChecked: true,
        },
      }))
      scrollFeedbackIntoView(activeCard.id)
      return
    }

    void completeAndAdvance()
  }

  if (isComplete) {
    return (
      <div className="-mx-4 -my-6 min-h-svh bg-[var(--fr-surface-canvas)] px-4 pb-8 sm:mx-0 sm:rounded-3xl">
        <LessonProgressHeader
          backLabel={`Вернуться к модулю ${details.module.title}`}
          backTo={`/modules/${details.module.slug}`}
          context={context}
          current={cards.length}
          isComplete
          isSavedComplete={isLessonCompleted}
          title={details.lesson.title}
          total={cards.length}
        />
        <section className="mx-auto flex w-full max-w-[520px] flex-col gap-5 pt-8">
          <div className="flex flex-col items-start gap-4 rounded-[20px] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-5 shadow-[var(--fr-shadow-md)]">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-color-learn-correct-500)]">
              <CheckCircle2 aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold leading-8 tracking-normal text-[var(--fr-text-primary)]">Урок завершён</h1>
              <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">
                {canSaveProgress
                  ? 'Прогресс урока сохранён как завершённый.'
                  : 'Контент доступен без входа. Для сохранения прогресса можно войти в аккаунт.'}
              </p>
            </div>
            {details.next ? (
              <Button
                asChild
                className="min-h-12 rounded-xl bg-[var(--fr-color-brand-500)] px-4 text-white hover:bg-[var(--fr-color-brand-600)]"
              >
                <Link to={`/lessons/${details.next.lesson.slug}`}>
                  Следующий урок
                </Link>
              </Button>
            ) : (
              <Button asChild className="min-h-12 rounded-xl" variant="outline">
                <Link to={`/modules/${details.module.slug}`}>Вернуться к модулю</Link>
              </Button>
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <article className="-mx-4 -my-6 min-h-svh bg-[var(--fr-surface-canvas)] px-4 sm:mx-0 sm:rounded-3xl">
      <LessonProgressHeader
        backLabel={`Вернуться к модулю ${details.module.title}`}
        backTo={`/modules/${details.module.slug}`}
        context={context}
        current={currentPosition}
        isComplete={false}
        isSavedComplete={isLessonCompleted}
        title={details.lesson.title}
        total={cards.length}
      />

      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-5 py-5 pb-[calc(8rem+env(safe-area-inset-bottom))]">
        {showLessonIntro ? (
          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
            {details.lesson.description ? <p>{details.lesson.description}</p> : null}
            {details.lesson.learningGoal ? (
              <p>
                <span className="font-semibold text-[var(--fr-text-primary)]">Цель: </span>
                {details.lesson.learningGoal}
              </p>
            ) : null}
          </div>
        ) : null}

        <LessonCardFrame card={activeCard} current={currentPosition} total={cards.length}>
          <LessonCardRenderer card={activeCard} interaction={interaction} showInlineFeedback={false} />
        </LessonCardFrame>
      </div>

      <LessonBottomAction
        feedback={bottomFeedback}
        isBusy={isSaving}
        onPrimary={handlePrimaryAction}
        onSecondary={activeIndex > 0 ? () => setActiveIndex((current) => Math.max(current - 1, 0)) : undefined}
        primaryDisabled={action.disabled}
        primaryLabel={action.label}
        primaryTone={action.tone}
        secondaryLabel={activeIndex > 0 ? 'Назад' : undefined}
      />
    </article>
  )
}

type InteractionInput = {
  card: Card
  choiceStates: Record<string, ChoiceState>
  checklistStates: Record<string, ChecklistState>
  reflectionStates: Record<string, ReflectionState>
  artifactStates: Record<string, ArtifactState>
  setChoiceStates: Dispatch<SetStateAction<Record<string, ChoiceState>>>
  setChecklistStates: Dispatch<SetStateAction<Record<string, ChecklistState>>>
  setReflectionStates: Dispatch<SetStateAction<Record<string, ReflectionState>>>
  setArtifactStates: Dispatch<SetStateAction<Record<string, ArtifactState>>>
}

function getInteractionProps({
  card,
  choiceStates,
  checklistStates,
  reflectionStates,
  artifactStates,
  setChoiceStates,
  setChecklistStates,
  setReflectionStates,
  setArtifactStates,
}: InteractionInput): LessonCardInteractionProps {
  return {
    choiceState: choiceStates[card.id] ?? emptyChoiceState,
    checklistState: checklistStates[card.id] ?? emptyChecklistState,
    reflectionState: reflectionStates[card.id] ?? emptyReflectionState,
    artifactState: card.type === 'artifact' ? (artifactStates[card.id] ?? createArtifactState(card)) : undefined,
    onChoiceSelect: (optionId) =>
      setChoiceStates((current) => ({
        ...current,
        [card.id]: {
          selectedOptionId: optionId,
          isChecked: false,
        },
      })),
    onChecklistToggle: (itemKey) =>
      setChecklistStates((current) => {
        const currentState = current[card.id] ?? emptyChecklistState
        const isChecked = currentState.checkedItems.includes(itemKey)

        return {
          ...current,
          [card.id]: {
            checkedItems: isChecked
              ? currentState.checkedItems.filter((currentItem) => currentItem !== itemKey)
              : [...currentState.checkedItems, itemKey],
          },
        }
      }),
    onReflectionChange: (nextState) =>
      setReflectionStates((current) => ({
        ...current,
        [card.id]: nextState,
      })),
    onArtifactChange: (nextState) =>
      setArtifactStates((current) => ({
        ...current,
        [card.id]: nextState,
      })),
  }
}

function getPrimaryAction(card: Card, choiceState: ChoiceState, isLastCard: boolean) {
  if (isInteractiveChoice(card)) {
    const hasSelectedOption = Boolean(choiceState.selectedOptionId)
    const hasObjectiveAnswer = Boolean(getCorrectOption(card))

    if (hasObjectiveAnswer && !choiceState.isChecked) {
      return {
        label: 'Проверить',
        tone: 'check' as const,
        mode: 'check' as const,
        disabled: !hasSelectedOption,
      }
    }

    return {
      label: isLastCard ? 'Завершить' : 'Далее',
      tone: isLastCard ? ('finish' as const) : ('continue' as const),
      mode: 'advance' as const,
      disabled: !hasSelectedOption,
    }
  }

  return {
    label: isLastCard ? 'Завершить' : 'Далее',
    tone: isLastCard ? ('finish' as const) : ('continue' as const),
    mode: 'advance' as const,
    disabled: false,
  }
}

function getBottomFeedback(card: Card, choiceState: ChoiceState) {
  if (!isInteractiveChoice(card) || !choiceState.isChecked || !choiceState.selectedOptionId) return null

  const options = getChoiceOptions(card)
  const correctOption = getCorrectOption(card)
  const selectedOption = options.find((option) => option.id === choiceState.selectedOptionId)
  if (!selectedOption) return null

  const hasObjectiveAnswer = Boolean(correctOption)
  const isCorrect = Boolean(correctOption && selectedOption.id === correctOption.id)
  const feedbackId = `${card.id}-choice-feedback`

  if (!hasObjectiveAnswer) {
    return (
      <LessonFeedback id={feedbackId} tone={selectedOption.feedback || card.feedback ? 'almost' : 'info'}>
        {selectedOption.feedback ? <p>{selectedOption.feedback}</p> : null}
        {card.feedback ? <p>{card.feedback}</p> : null}
        {!selectedOption.feedback && !card.feedback ? <p>Выбор отмечен. Можно продолжать.</p> : null}
      </LessonFeedback>
    )
  }

  if (isCorrect) {
    return (
      <LessonFeedback id={feedbackId} tone="correct">
        {selectedOption.feedback ? <p>{selectedOption.feedback}</p> : null}
        {card.feedback ? <p>{card.feedback}</p> : null}
        {!selectedOption.feedback && !card.feedback ? <p>Эта формулировка лучше всего подходит к шагу.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={feedbackId} tone="retry">
      {correctOption?.label ? (
        <p>
          Лучше подходит: <span className="font-semibold text-[var(--fr-text-primary)]">{correctOption.label}</span>.
        </p>
      ) : null}
      {selectedOption.feedback ? <p>{selectedOption.feedback}</p> : null}
      {card.feedback ? <p>{card.feedback}</p> : null}
      {!selectedOption.feedback && !card.feedback ? <p>Посмотри на вариант, где есть смысл, срок или связь с ценностью.</p> : null}
    </LessonFeedback>
  )
}

function getOrderedCards(lesson: LessonDetails['lesson']) {
  return [...lesson.cards].sort((a, b) => a.order - b.order)
}

function scrollFeedbackIntoView(cardId: string) {
  window.setTimeout(() => {
    const feedback = document.getElementById(`${cardId}-choice-feedback`)
    if (!feedback || typeof feedback.scrollIntoView !== 'function') return

    feedback.scrollIntoView({
      block: 'nearest',
      behavior: 'auto',
    })

    window.requestAnimationFrame(() => {
      const feedbackRect = feedback.getBoundingClientRect()
      const bottomAction = document.querySelector('[data-lesson-bottom-action]')
      const bottomActionTop = bottomAction?.getBoundingClientRect().top ?? window.innerHeight
      const overlap = feedbackRect.bottom - bottomActionTop

      if (overlap > 0) {
        window.scrollBy({
          top: overlap + 16,
          behavior: 'auto',
        })
      }
    })
  }, 0)
}
