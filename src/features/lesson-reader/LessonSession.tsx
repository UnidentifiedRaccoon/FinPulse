import { ArrowRight } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'

import type { LessonDetails, ReflectionAnswerPayload } from '@/api/client'
import { Button } from '@/components/ui/button'
import type { Card } from '@/content/program'
import { getOrderedCards } from '@/content/order'
import { Mascot } from '@/shared/ui/Mascot'

import { LessonBottomAction } from './LessonBottomAction'
import { LessonCardFrame } from './LessonCardFrame'
import { LessonCardRenderer, type LessonCardInteractionProps } from './LessonCardRenderer'
import { LessonFeedback } from './LessonFeedback'
import { LessonProgressHeader } from './LessonProgressHeader'
import { formatLessonHeaderContext } from './lessonHeaderContext'
import type {
  ArtifactState,
  CategorizationState,
  ChecklistState,
  ChoiceState,
  MultiSelectState,
  ReflectionState,
} from './lessonInteraction'
import {
  buildArtifactAnswerPayload,
  buildReflectionAnswerPayload,
  createArtifactState,
  emptyCategorizationState,
  emptyChecklistState,
  emptyChoiceState,
  emptyMultiSelectState,
  emptyReflectionState,
  getCorrectOption,
  getCategoryLabel,
  getChoiceOptions,
  isCategorizationAnswerCorrect,
  isCategorizationAnswerFilled,
  isArtifactAnswerFilled,
  isInteractiveChoice,
  isInteractiveCategorization,
  isInteractiveMultiSelect,
  isMultiSelectAnswerCorrect,
  isMultiSelectAnswerFilled,
  isReflectionAnswerFilled,
} from './lessonInteraction'

type LessonCardTransition = 'none' | 'forward' | 'back'

export function LessonSession({
  details,
  isLessonCompleted,
  onCardViewed,
  onCardCompleted,
  onReflectionAnswerSave,
  onLessonCompleted,
}: {
  details: LessonDetails
  isLessonCompleted: boolean
  canSaveProgress: boolean
  onCardViewed?: (cardId: string) => void | Promise<void>
  onCardCompleted?: (cardId: string) => void | Promise<void>
  onReflectionAnswerSave?: (cardId: string, payload: ReflectionAnswerPayload) => void | Promise<void>
  onLessonCompleted?: (lessonSlug: string) => void | Promise<void>
}) {
  const cards = useMemo(() => getOrderedCards(details.lesson), [details.lesson])
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardTransition, setCardTransition] = useState<LessonCardTransition>('none')
  const [isComplete, setIsComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const [isCompletionMascotLoaded, setCompletionMascotLoaded] = useState(false)
  const [choiceStates, setChoiceStates] = useState<Record<string, ChoiceState>>({})
  const [multiSelectStates, setMultiSelectStates] = useState<Record<string, MultiSelectState>>({})
  const [categorizationStates, setCategorizationStates] = useState<Record<string, CategorizationState>>({})
  const [checklistStates, setChecklistStates] = useState<Record<string, ChecklistState>>({})
  const [reflectionStates, setReflectionStates] = useState<Record<string, ReflectionState>>({})
  const [artifactStates, setArtifactStates] = useState<Record<string, ArtifactState>>({})
  const viewedCardIdsRef = useRef(new Set<string>())
  const lessonScreenRef = useRef<HTMLElement | null>(null)
  const completionPanelRef = useRef<HTMLElement | null>(null)
  const setLessonScreenElement = useCallback((element: HTMLElement | null) => {
    lessonScreenRef.current = element
  }, [])
  const setCompletionPanelElement = useCallback((element: HTMLElement | null) => {
    completionPanelRef.current = element
  }, [])

  const activeCard = cards[activeIndex]
  const isLastCard = activeIndex === cards.length - 1
  const currentPosition = Math.min(activeIndex + 1, cards.length)
  const context = formatLessonHeaderContext(details.level.title, details.section.title)
  const lessonGoal = details.lesson.learningGoal
  const showLessonIntro = activeIndex === 0 && Boolean(lessonGoal)

  useEffect(() => {
    if (!activeCard || !onCardViewed || viewedCardIdsRef.current.has(activeCard.id)) return
    viewedCardIdsRef.current.add(activeCard.id)
    void onCardViewed(activeCard.id)
  }, [activeCard, onCardViewed])

  useLayoutEffect(() => {
    resetLessonScreenScroll(lessonScreenRef.current)
  }, [activeCard?.id])

  useLayoutEffect(() => {
    if (!isComplete) return
    scrollElementIntoView(completionPanelRef.current, 'nearest')
  }, [isComplete])

  if (!activeCard) {
    return (
      <section
        className="mx-auto w-full max-w-[480px] rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5"
        ref={setLessonScreenElement}
      >
        <h1 className="text-xl font-bold text-[var(--fr-text-primary)]">В уроке пока нет карточек</h1>
        <p className="mt-1 text-sm leading-6 text-[var(--fr-text-secondary)]">
          Материалы появятся после обновления программы.
        </p>
      </section>
    )
  }

  const activeChoiceState = choiceStates[activeCard.id] ?? emptyChoiceState
  const activeMultiSelectState = multiSelectStates[activeCard.id] ?? emptyMultiSelectState
  const activeCategorizationState = categorizationStates[activeCard.id] ?? emptyCategorizationState
  const activeReflectionState = reflectionStates[activeCard.id] ?? emptyReflectionState
  const activeArtifactState = activeCard.type === 'artifact' ? (artifactStates[activeCard.id] ?? createArtifactState(activeCard)) : undefined
  const action = getPrimaryAction(
    activeCard,
    activeChoiceState,
    activeMultiSelectState,
    activeCategorizationState,
    activeReflectionState,
    activeArtifactState,
    isLastCard,
  )
  const bottomFeedback = getBottomFeedback(activeCard, activeChoiceState, activeMultiSelectState, activeCategorizationState)
  const interaction = getInteractionProps({
    card: activeCard,
    choiceStates,
    multiSelectStates,
    categorizationStates,
    checklistStates,
    reflectionStates,
    artifactStates,
    setChoiceStates,
    setMultiSelectStates,
    setCategorizationStates,
    setChecklistStates,
    setReflectionStates,
    setArtifactStates,
  })

  const completeAndAdvance = async () => {
    setIsSaving(true)
    setActionError('')
    try {
      const answerPayload = getPersistableAnswerPayload(activeCard, reflectionStates, artifactStates)
      if (answerPayload) {
        await onReflectionAnswerSave?.(activeCard.id, answerPayload)
      }

      await onCardCompleted?.(activeCard.id)

      if (isLastCard) {
        await onLessonCompleted?.(details.lesson.slug)
        setIsComplete(true)
        return
      }

      setCardTransition('forward')
      setActiveIndex((current) => Math.min(current + 1, cards.length - 1))
    } catch (error) {
      setActionError(getErrorMessage(error))
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

    if (action.mode === 'check-multi-select') {
      setMultiSelectStates((current) => ({
        ...current,
        [activeCard.id]: {
          ...(current[activeCard.id] ?? emptyMultiSelectState),
          isChecked: true,
        },
      }))
      scrollFeedbackIntoView(activeCard.id)
      return
    }

    if (action.mode === 'check-categorization') {
      setCategorizationStates((current) => ({
        ...current,
        [activeCard.id]: {
          ...(current[activeCard.id] ?? emptyCategorizationState),
          isChecked: true,
        },
      }))
      scrollFeedbackIntoView(activeCard.id)
      return
    }

    void completeAndAdvance()
  }

  const handleSecondaryAction = () => {
    setActionError('')

    if (activeCard.order === 3) {
      if (isInteractiveCategorization(activeCard)) {
        setCategorizationStates((current) => removeCardState(current, activeCard.id))
      }

      if (isInteractiveMultiSelect(activeCard)) {
        setMultiSelectStates((current) => removeCardState(current, activeCard.id))
      }

      if (isInteractiveChoice(activeCard) && getCorrectOption(activeCard)) {
        setChoiceStates((current) => removeCardState(current, activeCard.id))
      }
    }

    setCardTransition('back')
    setActiveIndex((current) => Math.max(current - 1, 0))
  }

  const cardTransitionClass =
    cardTransition === 'none'
      ? ''
      : `fr-lesson-card-transition fr-lesson-card-transition--${cardTransition}`

  return (
    <article
      className="flex min-h-svh flex-col bg-[var(--fr-surface-canvas)] sm:rounded-3xl"
      ref={setLessonScreenElement}
    >
      <LessonProgressHeader
        backLabel={`Вернуться к уровню ${details.level.title}`}
        backTo={`/levels/${details.level.slug}`}
        context={context}
        current={currentPosition}
        isComplete={isComplete}
        isSavedComplete={isLessonCompleted}
        title={details.lesson.title}
        total={cards.length}
      />

      <div
        className={`mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-4 pt-4 sm:px-4 sm:pt-5 ${
          isComplete ? 'pb-[calc(2rem+env(safe-area-inset-bottom))]' : 'pb-4 sm:pb-5'
        }`}
      >
        <div
          className={`flex flex-col gap-4 ${cardTransitionClass}`}
          data-lesson-card-transition={cardTransition}
          key={activeCard.id}
        >
          {showLessonIntro && lessonGoal ? <LessonGoalCard learningGoal={lessonGoal} /> : null}

          <LessonCardFrame card={activeCard} current={currentPosition} total={cards.length}>
            <LessonCardRenderer card={activeCard} interaction={interaction} showInlineFeedback={false} />
          </LessonCardFrame>
        </div>

        {isComplete ? (
          <InlineLessonCompletion
            current={cards.length}
            details={details}
            isMascotLoaded={isCompletionMascotLoaded}
            onMascotLoad={() => setCompletionMascotLoaded(true)}
            rootRef={setCompletionPanelElement}
            total={cards.length}
          />
        ) : null}
      </div>

      {isComplete ? null : (
        <LessonBottomAction
          feedback={actionError ? <LessonFeedback tone="retry" title="Не сохранено">{actionError}</LessonFeedback> : bottomFeedback}
          isBusy={isSaving}
          onPrimary={handlePrimaryAction}
          onSecondary={activeIndex > 0 ? handleSecondaryAction : undefined}
          primaryDisabled={action.disabled}
          primaryLabel={action.label}
          primaryTone={action.tone}
          secondaryLabel={activeIndex > 0 ? 'Назад' : undefined}
        />
      )}
    </article>
  )
}

function LessonGoalCard({ learningGoal }: { learningGoal: string }) {
  return (
    <section
      aria-label="Цель урока"
      className="w-full overflow-hidden rounded-[20px] border border-[var(--fr-color-sky-500)]/35 bg-[var(--fr-surface-card)] text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-sm)]"
    >
      <div className="bg-[var(--fr-color-sky-500)] px-4 py-2 text-[11px] font-black uppercase leading-4 tracking-normal text-[var(--fr-text-inverse)]">
        Цель урока
      </div>
      <p className="px-4 py-3 text-pretty text-[15px] font-black leading-6 text-[var(--fr-text-primary)]">{learningGoal}</p>
    </section>
  )
}

function CompletionProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-primary)]">
          {current} из {total} карточек
        </span>
        <span className="text-[var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-learn-correct-500)]">
          Готово
        </span>
      </div>
      <div
        aria-label="Карточки урока завершены"
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={current}
        className="h-2 overflow-hidden rounded-full bg-[var(--fr-color-brand-100)]"
        role="progressbar"
      >
        <div className="fr-completion-progress-fill h-full rounded-full bg-[var(--fr-color-learn-correct-500)]" />
      </div>
    </div>
  )
}

function InlineLessonCompletion({
  details,
  current,
  total,
  isMascotLoaded,
  onMascotLoad,
  rootRef,
}: {
  details: LessonDetails
  current: number
  total: number
  isMascotLoaded: boolean
  onMascotLoad: () => void
  rootRef: (element: HTMLElement | null) => void
}) {
  const completionDescription = details.next
    ? 'Твой результат сохранён. Можно перейти к следующему уроку или вернуться к списку уроков.'
    : 'Твой результат сохранён. Можно вернуться к списку уроков и выбрать следующий шаг.'

  return (
    <section
      aria-labelledby="lesson-completion-title"
      aria-live="polite"
      className="fr-completion-card-rise flex w-full flex-col gap-5 rounded-[var(--fr-radius-xl)] border border-[var(--fr-color-learn-correct-500)]/30 bg-[var(--fr-surface-card)] p-5 text-center shadow-[var(--fr-shadow-md)]"
      ref={rootRef}
    >
      <div className="relative mx-auto flex min-h-36 w-full max-w-[18rem] items-center justify-center">
        <div aria-hidden="true" className="absolute size-32 rounded-full bg-[var(--fr-color-brand-100)]/70" />
        <div aria-hidden="true" className="absolute size-24 rounded-full border border-[var(--fr-color-sky-400)]/60" />
        <CompletionCelebrationDots />
        <Mascot
          className="fr-completion-mascot-celebrate relative z-10"
          data-loaded={isMascotLoaded ? 'true' : 'false'}
          loading="eager"
          onLoad={onMascotLoad}
          size="sm"
          variant="completion"
        />
      </div>

      <div className="mx-auto max-w-[21rem]">
        <p className="text-[var(--fr-type-caption-md-size)] font-bold uppercase leading-[var(--fr-type-caption-md-line)] tracking-normal text-[var(--fr-color-learn-correct-600)]">
          Сохранено в Навигатор
        </p>
        <h2
          className="mt-2 text-[var(--fr-type-display-sm-size)] font-bold leading-[var(--fr-type-display-sm-line)] text-[var(--fr-text-primary)]"
          id="lesson-completion-title"
        >
          Урок пройден
        </h2>
        <p className="mt-3 text-[var(--fr-type-body-md-size)] leading-[var(--fr-type-body-md-line)] text-[var(--fr-text-secondary)]">
          {completionDescription}
        </p>
      </div>

      <CompletionProgress current={current} total={total} />

      {details.next ? (
        <div className="flex flex-col gap-2">
          <Button
            asChild
            className="min-h-12 rounded-xl bg-[var(--fr-color-brand-500)] px-4 text-white hover:bg-[var(--fr-color-brand-600)]"
          >
            <Link to={`/lessons/${details.next.lesson.slug}`}>
              К следующему уроку
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild className="min-h-12 rounded-xl" variant="outline">
            <Link to={`/levels/${details.level.slug}`}>К списку уроков</Link>
          </Button>
        </div>
      ) : (
        <Button asChild className="min-h-12 rounded-xl">
          <Link to={`/levels/${details.level.slug}`}>
            К списку уроков
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      )}
    </section>
  )
}

function CompletionCelebrationDots() {
  const dots = [
    'left-[4.25rem] top-5 bg-[var(--fr-color-sky-400)] [--dot-x:-1.5rem] [--dot-y:-2.25rem]',
    'right-[4.5rem] top-7 bg-[var(--fr-color-brand-400)] [--dot-x:1.75rem] [--dot-y:-1.75rem]',
    'left-[3.5rem] bottom-12 bg-[var(--fr-color-learn-correct-500)] [--dot-x:-1.25rem] [--dot-y:1.75rem]',
    'right-[3.75rem] bottom-10 bg-[var(--fr-color-sky-500)] [--dot-x:1.5rem] [--dot-y:1.5rem]',
    'left-1/2 top-3 bg-[var(--fr-color-brand-500)] [--dot-x:0rem] [--dot-y:-2.5rem]',
  ]

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {dots.map((className, index) => (
        <span
          className={`fr-compass-dot absolute size-2 rounded-full ${className}`}
          key={className}
          style={{ animationDelay: `${index * 65}ms` }}
        />
      ))}
    </div>
  )
}

type InteractionInput = {
  card: Card
  choiceStates: Record<string, ChoiceState>
  multiSelectStates: Record<string, MultiSelectState>
  categorizationStates: Record<string, CategorizationState>
  checklistStates: Record<string, ChecklistState>
  reflectionStates: Record<string, ReflectionState>
  artifactStates: Record<string, ArtifactState>
  setChoiceStates: Dispatch<SetStateAction<Record<string, ChoiceState>>>
  setMultiSelectStates: Dispatch<SetStateAction<Record<string, MultiSelectState>>>
  setCategorizationStates: Dispatch<SetStateAction<Record<string, CategorizationState>>>
  setChecklistStates: Dispatch<SetStateAction<Record<string, ChecklistState>>>
  setReflectionStates: Dispatch<SetStateAction<Record<string, ReflectionState>>>
  setArtifactStates: Dispatch<SetStateAction<Record<string, ArtifactState>>>
}

function getInteractionProps({
  card,
  choiceStates,
  multiSelectStates,
  categorizationStates,
  checklistStates,
  reflectionStates,
  artifactStates,
  setChoiceStates,
  setMultiSelectStates,
  setCategorizationStates,
  setChecklistStates,
  setReflectionStates,
  setArtifactStates,
}: InteractionInput): LessonCardInteractionProps {
  return {
    choiceState: choiceStates[card.id] ?? emptyChoiceState,
    multiSelectState: multiSelectStates[card.id] ?? emptyMultiSelectState,
    categorizationState: categorizationStates[card.id] ?? emptyCategorizationState,
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
    onMultiSelectToggle: (optionId) =>
      setMultiSelectStates((current) => {
        const currentState = current[card.id] ?? emptyMultiSelectState
        const isSelected = currentState.selectedOptionIds.includes(optionId)

        return {
          ...current,
          [card.id]: {
            selectedOptionIds: isSelected
              ? currentState.selectedOptionIds.filter((currentOptionId) => currentOptionId !== optionId)
              : [...currentState.selectedOptionIds, optionId],
            isChecked: false,
          },
        }
      }),
    onCategorizationSelect: (itemId, categoryId) =>
      setCategorizationStates((current) => {
        const currentState = current[card.id] ?? emptyCategorizationState

        return {
          ...current,
          [card.id]: {
            selectedCategoryIdsByItemId: {
              ...currentState.selectedCategoryIdsByItemId,
              [itemId]: categoryId,
            },
            isChecked: false,
          },
        }
      }),
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

function getPrimaryAction(
  card: Card,
  choiceState: ChoiceState,
  multiSelectState: MultiSelectState,
  categorizationState: CategorizationState,
  reflectionState: ReflectionState,
  artifactState: ArtifactState | undefined,
  isLastCard: boolean,
) {
  const advanceLabel = getAdvanceActionLabel(card, isLastCard)

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
      label: advanceLabel,
      tone: isLastCard ? ('finish' as const) : ('continue' as const),
      mode: 'advance' as const,
      disabled: !hasSelectedOption,
    }
  }

  if (isInteractiveMultiSelect(card)) {
    if (!multiSelectState.isChecked) {
      return {
        label: 'Проверить',
        tone: 'check' as const,
        mode: 'check-multi-select' as const,
        disabled: !isMultiSelectAnswerFilled(multiSelectState),
      }
    }

    return {
      label: advanceLabel,
      tone: isLastCard ? ('finish' as const) : ('continue' as const),
      mode: 'advance' as const,
      disabled: false,
    }
  }

  if (isInteractiveCategorization(card)) {
    if (!categorizationState.isChecked) {
      return {
        label: 'Проверить',
        tone: 'check' as const,
        mode: 'check-categorization' as const,
        disabled: !isCategorizationAnswerFilled(card, categorizationState),
      }
    }

    return {
      label: advanceLabel,
      tone: isLastCard ? ('finish' as const) : ('continue' as const),
      mode: 'advance' as const,
      disabled: false,
    }
  }

  if (card.type === 'reflection') {
    return {
      label: advanceLabel,
      tone: isLastCard ? ('finish' as const) : ('continue' as const),
      mode: 'advance' as const,
      disabled: !isReflectionAnswerFilled(card, reflectionState),
    }
  }

  if (card.type === 'artifact') {
    return {
      label: advanceLabel,
      tone: isLastCard ? ('finish' as const) : ('continue' as const),
      mode: 'advance' as const,
      disabled: !isArtifactAnswerFilled(card, artifactState ?? createArtifactState(card)),
    }
  }

  return {
    label: advanceLabel,
    tone: isLastCard ? ('finish' as const) : ('continue' as const),
    mode: 'advance' as const,
    disabled: false,
  }
}

function getAdvanceActionLabel(card: Card, isLastCard: boolean) {
  if (isLastCard) return 'Завершить'
  return card.ctaLabel ?? 'Далее'
}

function getPersistableAnswerPayload(
  card: Card,
  reflectionStates: Record<string, ReflectionState>,
  artifactStates: Record<string, ArtifactState>,
) {
  if (card.type === 'reflection' && !card.readOnly) {
    return buildReflectionAnswerPayload(card, reflectionStates[card.id] ?? emptyReflectionState)
  }

  if (card.type === 'artifact' && !card.readOnly) {
    return buildArtifactAnswerPayload(artifactStates[card.id] ?? createArtifactState(card))
  }

  return null
}

function removeCardState<State>(stateByCardId: Record<string, State>, cardId: string) {
  if (!(cardId in stateByCardId)) return stateByCardId

  const nextState = { ...stateByCardId }
  delete nextState[cardId]
  return nextState
}

function getBottomFeedback(
  card: Card,
  choiceState: ChoiceState,
  multiSelectState: MultiSelectState,
  categorizationState: CategorizationState,
) {
  if (isInteractiveMultiSelect(card)) {
    if (!multiSelectState.isChecked) return null
    return getMultiSelectBottomFeedback(card, multiSelectState)
  }

  if (isInteractiveCategorization(card)) {
    if (!categorizationState.isChecked) return null
    return getCategorizationBottomFeedback(card, categorizationState)
  }

  if (!isInteractiveChoice(card) || !choiceState.selectedOptionId) return null

  const options = getChoiceOptions(card)
  const correctOption = getCorrectOption(card)
  const selectedOption = options.find((option) => option.id === choiceState.selectedOptionId)
  if (!selectedOption) return null

  const hasObjectiveAnswer = Boolean(correctOption)
  if (hasObjectiveAnswer && !choiceState.isChecked) return null

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

function getMultiSelectBottomFeedback(card: Extract<Card, { type: 'multi_select' }>, state: MultiSelectState) {
  const isCorrect = isMultiSelectAnswerCorrect(card, state)
  const selectedIds = new Set(state.selectedOptionIds)
  const missingOptions = card.options.filter((option) => option.isCorrect && !selectedIds.has(option.id))
  const extraOptions = card.options.filter((option) => !option.isCorrect && selectedIds.has(option.id))
  const selectedFeedback = card.options
    .filter((option) => selectedIds.has(option.id) && option.feedback)
    .map((option) => option.feedback)
  const feedbackId = `${card.id}-multi-select-feedback`

  if (isCorrect) {
    return (
      <LessonFeedback id={feedbackId} tone="correct">
        {card.feedback ? <p>{card.feedback}</p> : null}
        {!card.feedback ? <p>Все подходящие варианты отмечены.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={feedbackId} tone="retry">
      {missingOptions.length ? (
        <p>
          Ещё подходит: <span className="font-semibold text-[var(--fr-text-primary)]">{joinOptionLabels(missingOptions)}</span>.
        </p>
      ) : null}
      {extraOptions.length ? (
        <p>
          Проверь лишнее: <span className="font-semibold text-[var(--fr-text-primary)]">{joinOptionLabels(extraOptions)}</span>.
        </p>
      ) : null}
      {selectedFeedback.map((feedback) => (
        <p key={feedback}>{feedback}</p>
      ))}
      {card.feedback ? <p>{card.feedback}</p> : null}
      {!missingOptions.length && !extraOptions.length && !card.feedback && !selectedFeedback.length ? (
        <p>Проверь, все ли подходящие варианты отмечены.</p>
      ) : null}
    </LessonFeedback>
  )
}

function getCategorizationBottomFeedback(card: Extract<Card, { type: 'categorization' }>, state: CategorizationState) {
  const isCorrect = isCategorizationAnswerCorrect(card, state)
  const incorrectItems = card.items.filter(
    (item) => state.selectedCategoryIdsByItemId[item.id] !== item.correctCategoryId,
  )
  const feedbackId = `${card.id}-categorization-feedback`

  if (isCorrect) {
    return (
      <LessonFeedback id={feedbackId} tone="correct">
        {card.feedback ? <p>{card.feedback}</p> : null}
        {!card.feedback ? <p>Все элементы распределены по подходящим группам.</p> : null}
      </LessonFeedback>
    )
  }

  return (
    <LessonFeedback id={feedbackId} tone="retry">
      {incorrectItems.slice(0, 3).map((item) => (
        <p key={item.id}>
          Уточни: <span className="font-semibold text-[var(--fr-text-primary)]">{item.label}</span> →{' '}
          <span className="font-semibold text-[var(--fr-text-primary)]">
            {getCategoryLabel(card, item.correctCategoryId)}
          </span>.
        </p>
      ))}
      {incorrectItems.length > 3 ? <p>И ещё {incorrectItems.length - 3} пункт(а) стоит пересмотреть.</p> : null}
      {incorrectItems.map((item) => (item.feedback ? <p key={`${item.id}-feedback`}>{item.feedback}</p> : null))}
      {card.feedback ? <p>{card.feedback}</p> : null}
      {!incorrectItems.length && !card.feedback ? <p>Проверь распределение ещё раз.</p> : null}
    </LessonFeedback>
  )
}

function joinOptionLabels(options: Array<{ label: string }>) {
  return options.map((option) => option.label).join(', ')
}

function scrollFeedbackIntoView(cardId: string) {
  window.setTimeout(() => {
    const feedback =
      document.getElementById(`${cardId}-choice-feedback`) ??
      document.getElementById(`${cardId}-multi-select-feedback`) ??
      document.getElementById(`${cardId}-categorization-feedback`)
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

function resetLessonScreenScroll(element: HTMLElement | null) {
  scrollElementIntoView(element, 'start')
}

function scrollElementIntoView(element: HTMLElement | null, block: ScrollLogicalPosition) {
  if (!element || typeof element.scrollIntoView !== 'function') return

  element.scrollIntoView({
    block,
    behavior: 'auto',
  })
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось сохранить ответ. Попробуйте ещё раз.'
}
