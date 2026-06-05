import type { Card } from '@/content/program'

import { ArtifactCard } from './card-renderers/ArtifactCard'
import { ChecklistCard } from './card-renderers/ChecklistCard'
import { ChoiceCard } from './card-renderers/ChoiceCard'
import { ReflectionCard } from './card-renderers/ReflectionCard'
import { TheoryCard } from './card-renderers/TheoryCard'
import { VideoCard } from './card-renderers/VideoCard'
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

export function LessonCardRenderer({
  card,
  interaction,
  showInlineFeedback = true,
}: {
  card: Card
  interaction?: LessonCardInteractionProps
  showInlineFeedback?: boolean
}) {
  if (card.type === 'video') {
    return <VideoCard card={card} key={card.id} />
  }

  if (card.type === 'single_choice') {
    if (!card.readOnly) {
      return (
        <ChoiceCard
          card={card}
          onSelect={interaction?.onChoiceSelect ?? noop}
          showFeedback={showInlineFeedback}
          state={interaction?.choiceState ?? emptyChoiceState}
        />
      )
    }

    return <TheoryCard card={card} />
  }

  if (card.type === 'scenario') {
    if (!card.readOnly && card.options) {
      return (
        <ChoiceCard
          card={card}
          onSelect={interaction?.onChoiceSelect ?? noop}
          showFeedback={showInlineFeedback}
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
