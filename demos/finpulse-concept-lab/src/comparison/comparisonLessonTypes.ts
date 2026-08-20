import type {
  LearnerFeedbackScreen,
  LearnerPracticeScreen,
  LearnerPrompt,
} from '../learnerLessonCatalog'
import type { PracticeMechanicPresentation } from '../components/PracticeMechanic'
import type { SameEpisodeMechanicSlug } from './sameEpisodeCatalog'

export type ComparisonEpisodeSlug = 'move-in-evening' | 'trial-subscription'
export type ComparisonEpisodeRouteSlug = Exclude<ComparisonEpisodeSlug, 'move-in-evening'>

export interface ComparisonEpisodeMeta {
  slug: ComparisonEpisodeSlug
  routeSlug?: ComparisonEpisodeRouteSlug
  sequenceLabel: string
  title: string
  cardSummary: string
}

export interface ComparisonFact {
  label: string
  body: string
}

export interface ComparisonEpisodeStory {
  duration: string
  introLead: string
  revealLabel: string
  revealActionLabel: string
  opening: {
    title: string
    paragraphs: readonly string[]
  }
  beforeReveal: {
    title: string
    paragraphs: readonly string[]
    lead: string
    facts: readonly ComparisonFact[]
  }
  reveal: string
  feedbackFacts: readonly ComparisonFact[]
  outcome: {
    title: string
    paragraphs: readonly string[]
    facts: readonly ComparisonFact[]
  }
  checkpoint: {
    title: string
    scenario: string
    prompt: LearnerPrompt
    feedback: {
      success: string
      nuance: string
      copy: string
    }
  }
  summary: {
    title: string
    items: readonly ComparisonFact[]
    takeaway: string
  }
}

export interface ComparisonLessonVariant {
  goal: string
  practice: LearnerPracticeScreen
  feedback: LearnerFeedbackScreen
  presentation?: PracticeMechanicPresentation
}

export type ComparisonLessonVariants = Readonly<
  Record<SameEpisodeMechanicSlug, ComparisonLessonVariant>
>
