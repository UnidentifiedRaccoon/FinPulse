import type { ReactNode } from 'react'

import type { Card } from '@/content/program'

import { ArtifactCard } from './card-renderers/ArtifactCard'
import { CategorizationCard } from './card-renderers/CategorizationCard'
import { ChecklistCard } from './card-renderers/ChecklistCard'
import { ChoiceCard } from './card-renderers/ChoiceCard'
import { MultiSelectCard } from './card-renderers/MultiSelectCard'
import { ReflectionCard } from './card-renderers/ReflectionCard'
import { StatisticsPanel } from './card-renderers/shared'
import { TheoryCard } from './card-renderers/TheoryCard'
import { VideoCard } from './card-renderers/VideoCard'
import type {
  ArtifactState,
  CategorizationState,
  ChecklistState,
  ChoiceState,
  MultiSelectState,
  ReflectionState,
} from './lessonInteraction'
import {
  createArtifactState,
  emptyCategorizationState,
  emptyChecklistState,
  emptyChoiceState,
  emptyMultiSelectState,
  emptyReflectionState,
} from './lessonInteraction'

export type LessonCardInteractionProps = {
  choiceState?: ChoiceState
  multiSelectState?: MultiSelectState
  categorizationState?: CategorizationState
  checklistState?: ChecklistState
  reflectionState?: ReflectionState
  artifactState?: ArtifactState
  onChoiceSelect?: (optionId: string) => void
  onMultiSelectToggle?: (optionId: string) => void
  onCategorizationSelect?: (itemId: string, categoryId: string) => void
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
  const content = renderCard({ card, interaction, showInlineFeedback })

  if (!card.statistics) return content

  return (
    <div className="flex flex-col gap-4">
      {content}
      <StatisticsPanel statistics={card.statistics} />
    </div>
  )
}

function renderCard({
  card,
  interaction,
  showInlineFeedback,
}: {
  card: Card
  interaction?: LessonCardInteractionProps
  showInlineFeedback: boolean
}): ReactNode {
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

  if (card.type === 'multi_select') {
    return (
      <MultiSelectCard
        card={card}
        onToggle={interaction?.onMultiSelectToggle ?? noop}
        showFeedback={showInlineFeedback}
        state={interaction?.multiSelectState ?? emptyMultiSelectState}
      />
    )
  }

  if (card.type === 'categorization') {
    return (
      <CategorizationCard
        card={card}
        onSelect={interaction?.onCategorizationSelect ?? noopCategorization}
        showFeedback={showInlineFeedback}
        state={interaction?.categorizationState ?? emptyCategorizationState}
      />
    )
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

function noopCategorization() {}

function noopReflection() {}

function noopArtifact() {}
