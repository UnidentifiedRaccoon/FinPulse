import type { Card } from '@/content/program'

import type {
  ArtifactState,
  CategorizationState,
  ChoiceState,
  MultiSelectState,
  ReflectionState,
} from './lessonInteraction'
import {
  createArtifactState,
  getCorrectOption,
  isArtifactAnswerFilled,
  isCategorizationAnswerFilled,
  isInteractiveCategorization,
  isInteractiveChoice,
  isInteractiveMultiSelect,
  isMultiSelectAnswerFilled,
  isReflectionAnswerFilled,
} from './lessonInteraction'

export type PrimaryLessonActionTone = 'continue' | 'check' | 'finish'

export type PrimaryLessonAction =
  | {
      label: string
      tone: PrimaryLessonActionTone
      mode: 'check' | 'check-multi-select' | 'check-categorization'
      disabled: boolean
    }
  | {
      label: string
      tone: PrimaryLessonActionTone
      mode: 'advance'
      disabled: boolean
    }

export function getPrimaryLessonAction({
  card,
  choiceState,
  multiSelectState,
  categorizationState,
  reflectionState,
  artifactState,
  isLastCard,
}: {
  card: Card
  choiceState: ChoiceState
  multiSelectState: MultiSelectState
  categorizationState: CategorizationState
  reflectionState: ReflectionState
  artifactState: ArtifactState | undefined
  isLastCard: boolean
}): PrimaryLessonAction {
  const advanceLabel = getAdvanceActionLabel(card, isLastCard)

  if (isInteractiveChoice(card)) {
    const hasSelectedOption = Boolean(choiceState.selectedOptionId)
    const hasObjectiveAnswer = Boolean(getCorrectOption(card))

    if (hasObjectiveAnswer && !choiceState.isChecked) {
      return {
        label: 'Проверить',
        tone: 'check',
        mode: 'check',
        disabled: !hasSelectedOption,
      }
    }

    return {
      label: advanceLabel,
      tone: isLastCard ? 'finish' : 'continue',
      mode: 'advance',
      disabled: !hasSelectedOption,
    }
  }

  if (isInteractiveMultiSelect(card)) {
    if (!multiSelectState.isChecked) {
      return {
        label: 'Проверить',
        tone: 'check',
        mode: 'check-multi-select',
        disabled: !isMultiSelectAnswerFilled(multiSelectState),
      }
    }

    return {
      label: advanceLabel,
      tone: isLastCard ? 'finish' : 'continue',
      mode: 'advance',
      disabled: false,
    }
  }

  if (isInteractiveCategorization(card)) {
    if (!categorizationState.isChecked) {
      return {
        label: 'Проверить',
        tone: 'check',
        mode: 'check-categorization',
        disabled: !isCategorizationAnswerFilled(card, categorizationState),
      }
    }

    return {
      label: advanceLabel,
      tone: isLastCard ? 'finish' : 'continue',
      mode: 'advance',
      disabled: false,
    }
  }

  if (card.type === 'reflection') {
    return {
      label: advanceLabel,
      tone: isLastCard ? 'finish' : 'continue',
      mode: 'advance',
      disabled: !isReflectionAnswerFilled(card, reflectionState),
    }
  }

  if (card.type === 'artifact') {
    return {
      label: advanceLabel,
      tone: isLastCard ? 'finish' : 'continue',
      mode: 'advance',
      disabled: !isArtifactAnswerFilled(card, artifactState ?? createArtifactState(card)),
    }
  }

  return {
    label: advanceLabel,
    tone: isLastCard ? 'finish' : 'continue',
    mode: 'advance',
    disabled: false,
  }
}

function getAdvanceActionLabel(card: Card, isLastCard: boolean) {
  if (isLastCard) return 'Завершить'
  return card.ctaLabel ?? 'Далее'
}
