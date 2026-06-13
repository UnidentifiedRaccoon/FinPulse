import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { sendError } from '../../lib/http'
import type { ContentService } from './contentService'

const slugParamSchema = z.object({
  levelSlug: z.string().optional(),
  sectionSlug: z.string().optional(),
  lessonSlug: z.string().optional(),
}).strict()

export function registerContentRoutes(app: FastifyInstance, content: ContentService) {
  app.get('/api/program', async () => content.getProgram())

  app.get('/api/levels', async () => content.getLevels())

  app.get('/api/levels/:levelSlug', async (request, reply) => {
    const params = slugParamSchema.parse(request.params)
    const level = params.levelSlug ? content.getLevel(params.levelSlug) : null

    if (!level) {
      return sendError(reply, 404, 'not_found', 'Level not found')
    }

    return level
  })

  app.get('/api/sections/:sectionSlug', async (request, reply) => {
    const params = slugParamSchema.parse(request.params)
    const section = params.sectionSlug ? content.getSection(params.sectionSlug) : null

    if (!section) {
      return sendError(reply, 404, 'not_found', 'Section not found')
    }

    return section
  })

  app.get('/api/lessons/:lessonSlug', async (request, reply) => {
    const params = slugParamSchema.parse(request.params)
    const lesson = params.lessonSlug ? content.getLesson(params.lessonSlug) : null

    if (!lesson) {
      return sendError(reply, 404, 'not_found', 'Lesson not found')
    }

    return lesson
  })
}
