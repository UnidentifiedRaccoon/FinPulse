import type { Card } from '@/content/program'

import { ArtifactCard } from './card-renderers/ArtifactCard'
import { ChecklistCard } from './card-renderers/ChecklistCard'
import { ChoiceCard } from './card-renderers/ChoiceCard'
import { ReflectionCard } from './card-renderers/ReflectionCard'
import { TheoryCard } from './card-renderers/TheoryCard'
import { StaticChoiceList } from './card-renderers/shared'
import type { ArtifactState, ChecklistState, ChoiceState, ReflectionState } from './lessonInteraction'
import { createArtifactState, emptyChecklistState, emptyChoiceState, emptyReflectionState } from './lessonInteraction'

export type LessonCardInteractionProps = {
  choiceState?: ChoiceState
  checklistState?: ChecklistState
  reflectionState?: ReflectionState
  artifactState?: ArtifactState
  onChoiceSelect?: (optionId: string) => void
  onChecklistToggle?: (itemKey: string) => void
  onReflectionChange?: (state: ReflectionState) => void
  onArtifactChange?: (state: ArtifactState) => void
}

export function LessonCardRenderer({ card, interaction }: { card: Card; interaction?: LessonCardInteractionProps }) {
  if (card.type === 'single_choice') {
    if (!card.readOnly) {
      return (
        <ChoiceCard
          card={card}
          onSelect={interaction?.onChoiceSelect ?? noop}
          state={interaction?.choiceState ?? emptyChoiceState}
        />
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <p className="text-base font-medium leading-7 text-[var(--fr-text-primary)]">{card.question}</p>
        <StaticChoiceList options={card.options} />
        {card.feedback ? <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{card.feedback}</p> : null}
      </div>
    )
  }

  if (card.type === 'scenario') {
    if (!card.readOnly && card.options) {
      return (
        <ChoiceCard
          card={card}
          onSelect={interaction?.onChoiceSelect ?? noop}
          state={interaction?.choiceState ?? emptyChoiceState}
        />
      )
    }

    return <TheoryCard card={card} />
  }

  if (card.type === 'reflection') {
    return (
      <ReflectionCard
        card={card}
        onChange={interaction?.onReflectionChange ?? noopReflection}
        state={interaction?.reflectionState ?? emptyReflectionState}
      />
    )
  }

  if (card.type === 'artifact') {
    return (
      <ArtifactCard
        card={card}
        onChange={interaction?.onArtifactChange ?? noopArtifact}
        state={interaction?.artifactState ?? createArtifactState(card)}
      />
    )
  }

  if (card.type === 'checklist') {
    return (
      <ChecklistCard
        card={card}
        onToggle={interaction?.onChecklistToggle ?? noop}
        state={interaction?.checklistState ?? emptyChecklistState}
      />
    )
  }

  return <TheoryCard card={card} />
}

function noop() {}

function noopReflection() {}

function noopArtifact() {}
