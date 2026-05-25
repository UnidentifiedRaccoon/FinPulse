import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { sendError } from '../../lib/http'
import type { ContentService } from './contentService'

const slugParamSchema = z.object({
  moduleSlug: z.string().optional(),
  unitSlug: z.string().optional(),
  lessonSlug: z.string().optional(),
}).strict()

export function registerContentRoutes(app: FastifyInstance, content: ContentService) {
  app.get('/api/program', async () => content.getProgram())

  app.get('/api/modules', async () => content.getModules())

  app.get('/api/modules/:moduleSlug', async (request, reply) => {
    const params = slugParamSchema.parse(request.params)
    const module = params.moduleSlug ? content.getModule(params.moduleSlug) : null

    if (!module) {
      return sendError(reply, 404, 'not_found', 'Module not found')
    }

    return module
  })

  app.get('/api/units/:unitSlug', async (request, reply) => {
    const params = slugParamSchema.parse(request.params)
    const unit = params.unitSlug ? content.getUnit(params.unitSlug) : null

    if (!unit) {
      return sendError(reply, 404, 'not_found', 'Unit not found')
    }

    return unit
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
