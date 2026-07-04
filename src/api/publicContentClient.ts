import { api } from '@/api/client'
import type { LearningContentClient } from '@/api/contentClient'

export const publicLearningContentClient: LearningContentClient = {
  getProgram: api.getProgram,
  getLevels: api.getLevels,
  getLevel: api.getLevel,
  getSection: api.getSection,
  getLesson: api.getLesson,
}
