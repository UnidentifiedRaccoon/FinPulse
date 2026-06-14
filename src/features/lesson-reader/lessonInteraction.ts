import type { ReflectionAnswerPayload } from '@/api/client'
import type { Card } from '@/content/program'

export type ChoiceCard = Extract<Card, { type: 'single_choice' }> | Extract<Card, { type: 'scenario' }>
export type MultiSelectCard = Extract<Card, { type: 'multi_select' }>
export type CategorizationCard = Extract<Card, { type: 'categorization' }>
export type ReflectionCard = Extract<Card, { type: 'reflection' }>
export type ArtifactCard = Extract<Card, { type: 'artifact' }>
export type ChecklistCard = Extract<Card, { type: 'checklist' }>

export type ChoiceState = {
  selectedOptionId: string
  isChecked: boolean
}

export type MultiSelectState = {
  selectedOptionIds: string[]
  isChecked: boolean
}

export type CategorizationState = {
  selectedCategoryIdsByItemId: Record<string, string>
  isChecked: boolean
}

export type ChecklistState = {
  checkedItems: string[]
}

export type ReflectionState = {
  textValue: string
  singleValue: string
  multiValues: string[]
  isCustomSelected: boolean
}

export type ArtifactState = {
  selectedVariant: string
  isCustomVariantSelected: boolean
  customVariantValue: string
  checkedRows: string[]
  templateValues: string[]
  fallbackValue: string
}

export const emptyChoiceState: ChoiceState = {
  selectedOptionId: '',
  isChecked: false,
}

export const emptyMultiSelectState: MultiSelectState = {
  selectedOptionIds: [],
  isChecked: false,
}

export const emptyCategorizationState: CategorizationState = {
  selectedCategoryIdsByItemId: {},
  isChecked: false,
}

export const emptyChecklistState: ChecklistState = {
  checkedItems: [],
}

export const emptyReflectionState: ReflectionState = {
  textValue: '',
  singleValue: '',
  multiValues: [],
  isCustomSelected: false,
}

export function createArtifactState(card: ArtifactCard): ArtifactState {
  return {
    selectedVariant: '',
    isCustomVariantSelected: false,
    customVariantValue: '',
    checkedRows: [],
    templateValues: card.template?.map(() => '') ?? [''],
    fallbackValue: '',
  }
}

export function buildReflectionAnswerPayload(card: ReflectionCard, state: ReflectionState): ReflectionAnswerPayload {
  const inputType = card.inputType ?? 'freeform'

  if (inputType === 'single_select') {
    return { singleValue: state.isCustomSelected ? state.textValue : state.singleValue }
  }

  if (inputType === 'multi_select') {
    return { multiValues: state.multiValues }
  }

  return { textValue: state.textValue }
}

export function buildArtifactAnswerPayload(state: ArtifactState): ReflectionAnswerPayload {
  return {
    selectedVariant: state.isCustomVariantSelected ? state.customVariantValue : state.selectedVariant,
    checkedRows: state.checkedRows,
    templateValues: state.templateValues,
    fallbackValue: state.fallbackValue,
  }
}

export function isReflectionAnswerFilled(card: ReflectionCard, state: ReflectionState) {
  if (card.readOnly) return true

  const inputType = card.inputType ?? 'freeform'
  if (inputType === 'single_select') {
    return state.isCustomSelected ? state.textValue.trim().length > 0 : state.singleValue.trim().length > 0
  }
  if (inputType === 'multi_select') return state.multiValues.length > 0

  return state.textValue.trim().length > 0
}

export function isArtifactAnswerFilled(card: ArtifactCard, state: ArtifactState) {
  if (card.readOnly) return true

  const hasTemplate = Boolean(card.template?.length)
  if (card.customOption) {
    if (state.isCustomVariantSelected) return state.customVariantValue.trim().length > 0
    if (state.selectedVariant.trim().length > 0) return true
  }

  if (hasTemplate) {
    return card.template?.every((_, index) => state.templateValues[index]?.trim().length > 0) ?? false
  }

  return state.fallbackValue.trim().length > 0 || state.selectedVariant.trim().length > 0
}

export function isInteractiveChoice(card: Card): card is ChoiceCard {
  return (
    (card.type === 'single_choice' && !card.readOnly) ||
    (card.type === 'scenario' && !card.readOnly && Boolean(card.options?.length))
  )
}

export function isInteractiveMultiSelect(card: Card): card is MultiSelectCard {
  return card.type === 'multi_select' && !card.readOnly
}

export function isInteractiveCategorization(card: Card): card is CategorizationCard {
  return card.type === 'categorization' && !card.readOnly
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

export function getCorrectMultiSelectOptionIds(card: MultiSelectCard) {
  return card.options.filter((option) => option.isCorrect).map((option) => option.id)
}

export function isMultiSelectAnswerFilled(state: MultiSelectState) {
  return state.selectedOptionIds.length > 0
}

export function isMultiSelectAnswerCorrect(card: MultiSelectCard, state: MultiSelectState) {
  const correctIds = new Set(getCorrectMultiSelectOptionIds(card))
  const selectedIds = new Set(state.selectedOptionIds)

  if (correctIds.size !== selectedIds.size) return false
  return [...correctIds].every((id) => selectedIds.has(id))
}

export function isCategorizationAnswerFilled(card: CategorizationCard, state: CategorizationState) {
  return card.items.every((item) => Boolean(state.selectedCategoryIdsByItemId[item.id]))
}

export function isCategorizationAnswerCorrect(card: CategorizationCard, state: CategorizationState) {
  return card.items.every((item) => state.selectedCategoryIdsByItemId[item.id] === item.correctCategoryId)
}

export function getCategoryLabel(card: CategorizationCard, categoryId: string) {
  return card.categories.find((category) => category.id === categoryId)?.label
}

export function joinIds(...ids: Array<string | undefined>) {
  const joinedIds = ids.filter(Boolean).join(' ')
  return joinedIds || undefined
}
