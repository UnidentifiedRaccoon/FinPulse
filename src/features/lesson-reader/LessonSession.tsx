import { ArrowRight } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'

import type { LessonDetails, ReflectionAnswerPayload } from '@/api/client'
import { Button } from '@/components/ui/button'
import type { Card } from '@/content/program'
import { getOrderedCards } from '@/content/order'
import { Mascot } from '@/shared/ui/Mascot'
import { createLessonReturnState } from '@/shared/routeTransitions'

import { RichTextParagraphs } from './card-renderers/shared'
import { getPrimaryLessonAction } from './lessonActions'
import type { LessonCardInteractionProps } from './LessonCardRenderer'
import { LessonFeedback } from './LessonFeedback'
import { LessonScreenShell, type LessonCardTransition } from './LessonScreenShell'
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
  isInteractiveChoice,
  isInteractiveCategorization,
  isInteractiveMultiSelect,
  isMultiSelectAnswerCorrect,
} from './lessonInteraction'

export type PreviewScreenResetPayload = {
  cardId: string
  lessonSlug: string
  resetLessonCompletion: boolean
}

export function LessonSession({
  details,
  initialCardId,
  isLessonCompleted,
  onCardViewed,
  onCardCompleted,
  onPreviewScreenReset,
  onReflectionAnswerSave,
  onLessonCompleted,
  previewScreenResetKey,
}: {
  details: LessonDetails
  initialCardId?: string
  isLessonCompleted: boolean
  canSaveProgress: boolean
  onCardViewed?: (cardId: string) => void | Promise<void>
  onCardCompleted?: (cardId: string) => void | Promise<void>
  onPreviewScreenReset?: (payload: PreviewScreenResetPayload) => void
  onReflectionAnswerSave?: (cardId: string, payload: ReflectionAnswerPayload) => void | Promise<void>
  onLessonCompleted?: (lessonSlug: string) => void | Promise<void>
  previewScreenResetKey?: number
}) {
  const cards = useMemo(() => getOrderedCards(details.lesson), [details.lesson])
  const initialActiveIndex = useMemo(() => getInitialActiveCardIndex(cards, initialCardId), [cards, initialCardId])
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
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
  const [cardRenderVersions, setCardRenderVersions] = useState<Record<string, number>>({})
  const [handledPreviewScreenResetKey, setHandledPreviewScreenResetKey] = useState(previewScreenResetKey)
  const [pendingPreviewScreenReset, setPendingPreviewScreenReset] = useState<{
    key: number
    payload: PreviewScreenResetPayload
  } | null>(null)
  const viewedCardIdsRef = useRef(new Set<string>())
  const deliveredPreviewScreenResetKeyRef = useRef<number | undefined>(undefined)
  const completionPanelRef = useRef<HTMLElement | null>(null)
  const setCompletionPanelElement = useCallback((element: HTMLElement | null) => {
    completionPanelRef.current = element
  }, [])

  const activeCard = cards[activeIndex]
  const isLastCard = activeIndex === cards.length - 1
  const currentPosition = Math.min(activeIndex + 1, cards.length)
  const context = formatLessonHeaderContext(details.level.title, details.section.title)
  const lessonGoal = details.lesson.learningGoal
  const showLessonIntro = activeIndex === 0 && Boolean(lessonGoal)
  const lessonReturnState = useMemo(() => createLessonReturnState(details.lesson.slug), [details.lesson.slug])

  if (handledPreviewScreenResetKey !== previewScreenResetKey) {
    setHandledPreviewScreenResetKey(previewScreenResetKey)

    if (previewScreenResetKey !== undefined && activeCard) {
      const cardId = activeCard.id
      const resetLessonCompletion = isComplete && isLastCard

      setChoiceStates((current) => removeCardState(current, cardId))
      setMultiSelectStates((current) => removeCardState(current, cardId))
      setCategorizationStates((current) => removeCardState(current, cardId))
      setChecklistStates((current) => removeCardState(current, cardId))
      setReflectionStates((current) => removeCardState(current, cardId))
      setArtifactStates((current) => removeCardState(current, cardId))
      setCardRenderVersions((current) => ({
        ...current,
        [cardId]: (current[cardId] ?? 0) + 1,
      }))
      setActionError('')
      setIsSaving(false)
      setIsComplete(false)
      setCardTransition('none')
      setPendingPreviewScreenReset({
        key: previewScreenResetKey,
        payload: {
          cardId,
          lessonSlug: details.lesson.slug,
          resetLessonCompletion,
        },
      })
    }
  }

  useEffect(() => {
    if (!activeCard || !onCardViewed || viewedCardIdsRef.current.has(activeCard.id)) return
    viewedCardIdsRef.current.add(activeCard.id)
    void onCardViewed(activeCard.id)
  }, [activeCard, onCardViewed])

  useEffect(() => {
    if (!pendingPreviewScreenReset) return
    if (deliveredPreviewScreenResetKeyRef.current === pendingPreviewScreenReset.key) return

    deliveredPreviewScreenResetKeyRef.current = pendingPreviewScreenReset.key
    onPreviewScreenReset?.(pendingPreviewScreenReset.payload)
  }, [onPreviewScreenReset, pendingPreviewScreenReset])

  useLayoutEffect(() => {
    resetLessonScreenScroll()
  }, [activeCard?.id])

  useLayoutEffect(() => {
    if (!isComplete) return
    scrollElementIntoView(completionPanelRef.current, 'nearest')
  }, [isComplete])

  if (!activeCard) {
    return (
      <section className="mx-auto w-full max-w-[480px] rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5">
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
  const activeCardRenderVersion = cardRenderVersions[activeCard.id] ?? 0
  const action = getPrimaryLessonAction({
    card: activeCard,
    choiceState: activeChoiceState,
    multiSelectState: activeMultiSelectState,
    categorizationState: activeCategorizationState,
    reflectionState: activeReflectionState,
    artifactState: activeArtifactState,
    isLastCard,
  })
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

  return (
    <LessonScreenShell
      bottomAction={
        isComplete
          ? null
          : {
              feedback: actionError ? (
                <LessonFeedback tone="retry" title="Не сохранено">
                  {actionError}
                </LessonFeedback>
              ) : (
                bottomFeedback
              ),
              isBusy: isSaving,
              onPrimary: handlePrimaryAction,
              onSecondary: activeIndex > 0 ? handleSecondaryAction : undefined,
              primaryDisabled: action.disabled,
              primaryLabel: action.label,
              primaryTone: action.tone,
              secondaryLabel: activeIndex > 0 ? 'Назад' : undefined,
            }
      }
      card={activeCard}
      cardRenderKey={`${activeCard.id}:${activeCardRenderVersion}`}
      cardTransition={cardTransition}
      completion={
        isComplete ? (
          <InlineLessonCompletion
            current={cards.length}
            details={details}
            isMascotLoaded={isCompletionMascotLoaded}
            onMascotLoad={() => setCompletionMascotLoaded(true)}
            rootRef={setCompletionPanelElement}
            returnState={lessonReturnState}
            total={cards.length}
          />
        ) : null
      }
      header={{
        backLabel: `Вернуться к уровню ${details.level.title}`,
        backState: lessonReturnState,
        backTo: `/levels/${details.level.slug}`,
        context,
        current: currentPosition,
        isComplete,
        isSavedComplete: isLessonCompleted,
        title: details.lesson.title,
        total: cards.length,
      }}
      interaction={interaction}
      lessonGoal={lessonGoal}
      showLessonGoal={showLessonIntro}
    />
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
  returnState,
}: {
  details: LessonDetails
  current: number
  total: number
  isMascotLoaded: boolean
  onMascotLoad: () => void
  rootRef: (element: HTMLElement | null) => void
  returnState: ReturnType<typeof createLessonReturnState>
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
            <Link state={returnState} to={`/levels/${details.level.slug}`}>
              К списку уроков
            </Link>
          </Button>
        </div>
      ) : (
        <Button asChild className="min-h-12 rounded-xl">
          <Link state={returnState} to={`/levels/${details.level.slug}`}>
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

function getInitialActiveCardIndex(cards: Card[], initialCardId: string | undefined) {
  if (!initialCardId) return 0
  const cardIndex = cards.findIndex((card) => card.id === initialCardId)
  return cardIndex >= 0 ? cardIndex : 0
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
    const hasFeedback = Boolean(selectedOption.feedback || card.feedback)

    return (
      <LessonFeedback id={feedbackId} title={card.feedbackTitle} tone={hasFeedback ? 'almost' : 'info'}>
        {selectedOption.feedback ? <RichTextParagraphs text={selectedOption.feedback} /> : null}
        {card.feedback ? <RichTextParagraphs text={card.feedback} /> : null}
        {!hasFeedback ? <p>Выбор отмечен. Можно продолжать.</p> : null}
      </LessonFeedback>
    )
  }

  if (isCorrect) {
    return (
      <LessonFeedback id={feedbackId} title={card.feedbackTitle} tone="correct">
        {selectedOption.feedback ? <RichTextParagraphs text={selectedOption.feedback} /> : null}
        {card.feedback ? <RichTextParagraphs text={card.feedback} /> : null}
        {!selectedOption.feedback && !card.feedback ? <p>Эта формулировка лучше всего подходит к шагу.</p> : null}
      </LessonFeedback>
    )
  }

  const retryFeedback = card.retryFeedback ?? card.feedback

  return (
    <LessonFeedback id={feedbackId} title={card.retryFeedbackTitle} tone="retry">
      {correctOption?.label ? (
        <p>
          Лучше подходит: <span className="font-semibold text-[var(--fr-text-primary)]">{correctOption.label}</span>.
        </p>
      ) : null}
      {selectedOption.feedback ? <RichTextParagraphs text={selectedOption.feedback} /> : null}
      {retryFeedback ? <RichTextParagraphs text={retryFeedback} /> : null}
      {!selectedOption.feedback && !retryFeedback ? <p>Посмотри на вариант, где есть смысл, срок или связь с ценностью.</p> : null}
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
    .filter((feedback): feedback is string => Boolean(feedback))
  const feedbackId = `${card.id}-multi-select-feedback`

  if (isCorrect) {
    return (
      <LessonFeedback id={feedbackId} title={card.feedbackTitle} tone="correct">
        {card.feedback ? <RichTextParagraphs text={card.feedback} /> : null}
        {!card.feedback ? <p>Все подходящие варианты отмечены.</p> : null}
      </LessonFeedback>
    )
  }

  const retryFeedback = card.retryFeedback ?? card.feedback

  return (
    <LessonFeedback id={feedbackId} title={card.retryFeedbackTitle} tone="retry">
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
        <RichTextParagraphs key={feedback} text={feedback} />
      ))}
      {retryFeedback ? <RichTextParagraphs text={retryFeedback} /> : null}
      {!missingOptions.length && !extraOptions.length && !retryFeedback && !selectedFeedback.length ? (
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
      <LessonFeedback id={feedbackId} title={card.feedbackTitle} tone="correct">
        {card.feedback ? <RichTextParagraphs text={card.feedback} /> : null}
        {!card.feedback ? <p>Все элементы распределены по подходящим группам.</p> : null}
      </LessonFeedback>
    )
  }

  const retryFeedback = card.retryFeedback ?? card.feedback

  return (
    <LessonFeedback id={feedbackId} title={card.retryFeedbackTitle} tone="retry">
      {incorrectItems.slice(0, 3).map((item) => (
        <p key={item.id}>
          Уточни: <span className="font-semibold text-[var(--fr-text-primary)]">{item.label}</span> →{' '}
          <span className="font-semibold text-[var(--fr-text-primary)]">
            {getCategoryLabel(card, item.correctCategoryId)}
          </span>.
        </p>
      ))}
      {incorrectItems.length > 3 ? <p>И ещё {incorrectItems.length - 3} пункт(а) стоит пересмотреть.</p> : null}
      {incorrectItems.map((item) => (item.feedback ? <RichTextParagraphs key={`${item.id}-feedback`} text={item.feedback} /> : null))}
      {retryFeedback ? <RichTextParagraphs text={retryFeedback} /> : null}
      {!incorrectItems.length && !retryFeedback ? <p>Проверь распределение ещё раз.</p> : null}
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

function resetLessonScreenScroll() {
  window.scrollTo({
    top: 0,
    behavior: 'auto',
  })
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
