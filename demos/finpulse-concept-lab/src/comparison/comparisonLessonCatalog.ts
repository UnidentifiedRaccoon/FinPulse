import {
  getSameEpisodeMechanic,
  sharedSameEpisode,
  type SameEpisodeMechanicSlug,
} from './sameEpisodeCatalog'
import { secondEpisodeVariants, sharedSecondEpisode } from './secondEpisodeCatalog'
import type {
  ComparisonEpisodeMeta,
  ComparisonEpisodeRouteSlug,
  ComparisonEpisodeSlug,
  ComparisonEpisodeStory,
  ComparisonLessonVariant,
} from './comparisonLessonTypes'

export const comparisonEpisodeEntries = [
  {
    slug: 'move-in-evening',
    routeSlug: undefined,
    sequenceLabel: 'Урок 1',
    title: 'Первый вечер после переезда',
    cardSummary: 'Дата оплаты комнаты и первая полная зарплата',
  },
  {
    slug: 'trial-subscription',
    routeSlug: 'trial-subscription',
    sequenceLabel: 'Урок 2',
    title: 'Утро с пробной подпиской',
    cardSummary: 'Условия после пробного периода',
  },
] as const satisfies readonly ComparisonEpisodeMeta[]

export const defaultComparisonEpisode = comparisonEpisodeEntries[0]

export interface ResolvedComparisonLesson {
  method: NonNullable<ReturnType<typeof getSameEpisodeMechanic>>
  episode: ComparisonEpisodeMeta
  story: ComparisonEpisodeStory
  variant: ComparisonLessonVariant
}

export function getComparisonEpisode(value?: string): ComparisonEpisodeMeta | undefined {
  if (!value || value === defaultComparisonEpisode.slug) return defaultComparisonEpisode
  return comparisonEpisodeEntries.find((episode) => episode.routeSlug === value)
}

export function getComparisonLesson(
  mechanicSlug: string,
  episodeSlug?: string,
): ResolvedComparisonLesson | undefined {
  const method = getSameEpisodeMechanic(mechanicSlug)
  const episode = getComparisonEpisode(episodeSlug)
  if (!method || !episode) return undefined

  if (episode.slug === 'trial-subscription') {
    return {
      method,
      episode,
      story: sharedSecondEpisode,
      variant: secondEpisodeVariants[method.slug],
    }
  }

  return {
    method,
    episode,
    story: sharedSameEpisode,
    variant: method,
  }
}

export function comparisonLessonPath(
  mechanicSlug: SameEpisodeMechanicSlug,
  episode: Pick<ComparisonEpisodeMeta, 'routeSlug'>,
  step: number,
  search?: URLSearchParams,
) {
  const episodePart = episode.routeSlug ? `/${episode.routeSlug}` : ''
  const query = search?.toString()
  return `/compare/${mechanicSlug}${episodePart}/${step}${query ? `?${query}` : ''}`
}

export function isComparisonEpisodeRouteSlug(value: string): value is ComparisonEpisodeRouteSlug {
  return value === 'trial-subscription'
}

export function isComparisonEpisodeSlug(value: string): value is ComparisonEpisodeSlug {
  return value === 'move-in-evening' || isComparisonEpisodeRouteSlug(value)
}
