import type { ReflectionAnswerPayload } from '@/api/client'
import type { Card } from '@/content/program'

export type ChoiceCard = Extract<Card, { type: 'single_choice' }> | Extract<Card, { type: 'scenario' }>
export type ReflectionCard = Extract<Card, { type: 'reflection' }>
export type ArtifactCard = Extract<Card, { type: 'artifact' }>
export type ChecklistCard = Extract<Card, { type: 'checklist' }>

export type ChoiceState = {
  selectedOptionId: string
  isChecked: boolean
}

export type ChecklistState = {
  checkedItems: string[]
}

export type ReflectionState = {
  textValue: string
  singleValue: string
  multiValues: string[]
}

export type ArtifactState = {
  selectedVariant: string
  checkedRows: string[]
  templateValues: string[]
  fallbackValue: string
}

export const emptyChoiceState: ChoiceState = {
  selectedOptionId: '',
  isChecked: false,
}

export const emptyChecklistState: ChecklistState = {
  checkedItems: [],
}

export const emptyReflectionState: ReflectionState = {
  textValue: '',
  singleValue: '',
  multiValues: [],
}

export function createArtifactState(card: ArtifactCard): ArtifactState {
  return {
    selectedVariant: '',
    checkedRows: [],
    templateValues: card.template?.map(() => '') ?? [''],
    fallbackValue: '',
  }
}

export function buildReflectionAnswerPayload(card: ReflectionCard, state: ReflectionState): ReflectionAnswerPayload {
  const inputType = card.inputType ?? 'freeform'

  if (inputType === 'single_select') {
    return { singleValue: state.singleValue }
  }

  if (inputType === 'multi_select') {
    return { multiValues: state.multiValues }
  }

  return { textValue: state.textValue }
}

export function buildArtifactAnswerPayload(state: ArtifactState): ReflectionAnswerPayload {
  return {
    selectedVariant: state.selectedVariant,
    checkedRows: state.checkedRows,
    templateValues: state.templateValues,
    fallbackValue: state.fallbackValue,
  }
}

export function isReflectionAnswerFilled(card: ReflectionCard, state: ReflectionState) {
  if (card.readOnly) return true

  const inputType = card.inputType ?? 'freeform'
  if (inputType === 'single_select') return state.singleValue.trim().length > 0
  if (inputType === 'multi_select') return state.multiValues.length > 0

  return state.textValue.trim().length > 0
}

export function isArtifactAnswerFilled(card: ArtifactCard, state: ArtifactState) {
  if (card.readOnly) return true

  const hasTemplate = Boolean(card.template?.length)
  if (hasTemplate) {
    return state.templateValues.some((value) => value.trim().length > 0)
  }

  return state.fallbackValue.trim().length > 0 || state.selectedVariant.trim().length > 0
}

export function isInteractiveChoice(card: Card): card is ChoiceCard {
  return (
    (card.type === 'single_choice' && !card.readOnly) ||
    (card.type === 'scenario' && !card.readOnly && Boolean(card.options?.length))
  )
}

export function getChoiceQuestion(card: ChoiceCard) {
  return card.type === 'single_choice' ? card.question : (card.question ?? 'Выбери подходящий вариант')
}

export function getChoiceOptions(card: ChoiceCard) {
  return card.type === 'single_choice' ? card.options : (card.options ?? [])
}

export function getCorrectOption(card: ChoiceCard) {
  const options = getChoiceOptions(card)

  if (card.correctOptionId) {
    return options.find((option) => option.id === card.correctOptionId)
  }

  return options.find((option) => option.isCorrect)
}

export function joinIds(...ids: Array<string | undefined>) {
  const joinedIds = ids.filter(Boolean).join(' ')
  return joinedIds || undefined
}
