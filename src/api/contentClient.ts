import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react'

import type { LessonDetails, SectionDetails } from '@/api/client'
import type { Level, Program } from '@/content/program'
import { useApiQuery } from '@/api/useApiQuery'

export type LearningContentClient = {
  getProgram: () => Promise<Program>
  getLevels: () => Promise<Level[]>
  getLevel: (levelSlug: string) => Promise<Level>
  getSection: (sectionSlug: string) => Promise<SectionDetails>
  getLesson: (lessonSlug: string) => Promise<LessonDetails>
}

type LearningContentContextValue = {
  client: LearningContentClient
  version: string | number
}

const missingLearningContentClient: LearningContentClient = {
  getProgram: missingProvider,
  getLevels: missingProvider,
  getLevel: missingProvider,
  getSection: missingProvider,
  getLesson: missingProvider,
}

const LearningContentContext = createContext<LearningContentContextValue>({
  client: missingLearningContentClient,
  version: 0,
})

export function LearningContentProvider({
  children,
  client,
  version = 0,
}: {
  children: ReactNode
  client: LearningContentClient
  version?: string | number
}) {
  const value = useMemo(
    () => ({
      client,
      version,
    }),
    [client, version],
  )

  return createElement(LearningContentContext.Provider, { value }, children)
}

export function useLearningContentClient() {
  return useContext(LearningContentContext)
}

export function useLearningContentQuery<T>(
  load: (client: LearningContentClient) => Promise<T>,
  dependencies: readonly unknown[],
) {
  const { client, version } = useLearningContentClient()

  return useApiQuery(() => load(client), [client, version, ...dependencies])
}

async function missingProvider(): Promise<never> {
  throw new Error('LearningContentProvider is missing a content client.')
}
