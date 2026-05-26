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
