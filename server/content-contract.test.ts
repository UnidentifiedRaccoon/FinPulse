// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
  levelSchema,
  lessonSchema,
  programSchema,
  sectionFileSchema,
} from '../src/content/program'

import { createApp } from './app'

const sectionDetailsSchema = z.object({
  level: levelSchema,
  section: sectionFileSchema,
}).strict()

const lessonLocationSchema = z.object({
  level: levelSchema,
  section: sectionFileSchema,
  lesson: lessonSchema,
}).strict()

const lessonDetailsSchema = lessonLocationSchema.extend({
  previous: lessonLocationSchema.nullable(),
  next: lessonLocationSchema.nullable(),
}).strict()

async function setupTestApp() {
  const created = await createApp({
    databaseUrl: getTestDatabaseUrl(),
    databaseSchema: createTestSchemaName(),
    resetDatabaseSchema: true,
    dropDatabaseSchemaOnClose: true,
    databasePoolMax: 1,
    cookieSecure: false,
    corsOrigin: 'http://localhost:5173',
  })
  await created.app.ready()

  return created
}

function getTestDatabaseUrl() {
  const databaseUrl =
    process.env.FINPULSE_TEST_DATABASE_URL ?? process.env.FINPULSE_DATABASE_URL ?? process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('FINPULSE_TEST_DATABASE_URL, FINPULSE_DATABASE_URL, or DATABASE_URL is required for backend tests')
  }

  return databaseUrl
}

function createTestSchemaName() {
  return `test_${randomUUID().replaceAll('-', '_')}`
}

describe('content API contract', () => {
  it('serves /api/program using the shared program schema', async () => {
    const { app } = await setupTestApp()

    try {
      const response = await app.inject('/api/program')

      expect(response.statusCode).toBe(200)
      expect(programSchema.safeParse(response.json()).success).toBe(true)
    } finally {
      await app.close()
    }
  })

  it('serves level endpoints using the shared hydrated level schema', async () => {
    const { app } = await setupTestApp()

    try {
      const levelsResponse = await app.inject('/api/levels')
      const levelResponse = await app.inject('/api/levels/level-1-start')

      expect(levelsResponse.statusCode).toBe(200)
      expect(z.array(levelSchema).safeParse(levelsResponse.json()).success).toBe(true)
      expect(levelResponse.statusCode).toBe(200)
      expect(levelSchema.safeParse(levelResponse.json()).success).toBe(true)
    } finally {
      await app.close()
    }
  })

  it('serves section and lesson detail endpoints using shared content schemas', async () => {
    const { app } = await setupTestApp()

    try {
      const sectionResponse = await app.inject('/api/sections/money-and-operations')
      const lessonResponse = await app.inject('/api/lessons/where-money-goes')
      const mandatoryLessonResponse = await app.inject('/api/lessons/mandatory-and-desired')
      const safePaymentLessonResponse = await app.inject('/api/lessons/safe-payment')
      const digitalFootprintLessonResponse = await app.inject('/api/lessons/digital-footprint-and-protection')
      const removedPlanningSectionResponse = await app.inject('/api/sections/planning-and-management')
      const removedReserveLessonResponse = await app.inject('/api/lessons/reserve-amount')

      expect(sectionResponse.statusCode).toBe(200)
      expect(sectionDetailsSchema.safeParse(sectionResponse.json()).success).toBe(true)
      expect(lessonResponse.statusCode).toBe(200)
      expect(lessonDetailsSchema.safeParse(lessonResponse.json()).success).toBe(true)
      expect(mandatoryLessonResponse.statusCode).toBe(200)
      expect(lessonDetailsSchema.safeParse(mandatoryLessonResponse.json()).success).toBe(true)
      expect(mandatoryLessonResponse.json().next.lesson.slug).toBe('safe-payment')
      expect(safePaymentLessonResponse.statusCode).toBe(200)
      expect(lessonDetailsSchema.safeParse(safePaymentLessonResponse.json()).success).toBe(true)
      expect(safePaymentLessonResponse.json().previous.lesson.slug).toBe('mandatory-and-desired')
      expect(safePaymentLessonResponse.json().next.lesson.slug).toBe('digital-footprint-and-protection')
      expect(digitalFootprintLessonResponse.statusCode).toBe(200)
      expect(lessonDetailsSchema.safeParse(digitalFootprintLessonResponse.json()).success).toBe(true)
      expect(digitalFootprintLessonResponse.json().previous.lesson.slug).toBe('safe-payment')
      expect(digitalFootprintLessonResponse.json().next).toBeNull()
      expect(removedPlanningSectionResponse.statusCode).toBe(404)
      expect(removedReserveLessonResponse.statusCode).toBe(404)
    } finally {
      await app.close()
    }
  })

  it('does not serve removed module and unit content endpoints', async () => {
    const { app } = await setupTestApp()

    try {
      const modulesResponse = await app.inject('/api/modules')
      const moduleResponse = await app.inject('/api/modules/level-1-start')
      const unitResponse = await app.inject('/api/units/money-and-operations')

      expect(modulesResponse.statusCode).toBe(404)
      expect(moduleResponse.statusCode).toBe(404)
      expect(unitResponse.statusCode).toBe(404)
    } finally {
      await app.close()
    }
  })
})
