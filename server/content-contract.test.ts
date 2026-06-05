// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
  lessonSchema,
  moduleSchema,
  programSchema,
  unitFileSchema,
} from '../src/content/program'

import { createApp } from './app'

const unitDetailsSchema = z.object({
  module: moduleSchema,
  unit: unitFileSchema,
}).strict()

const lessonLocationSchema = z.object({
  module: moduleSchema,
  unit: unitFileSchema,
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

  it('serves module endpoints using the shared hydrated module schema', async () => {
    const { app } = await setupTestApp()

    try {
      const modulesResponse = await app.inject('/api/modules')
      const moduleResponse = await app.inject('/api/modules/t1-start')

      expect(modulesResponse.statusCode).toBe(200)
      expect(z.array(moduleSchema).safeParse(modulesResponse.json()).success).toBe(true)
      expect(moduleResponse.statusCode).toBe(200)
      expect(moduleSchema.safeParse(moduleResponse.json()).success).toBe(true)
    } finally {
      await app.close()
    }
  })

  it('serves unit and lesson detail endpoints using shared content schemas', async () => {
    const { app } = await setupTestApp()

    try {
      const unitResponse = await app.inject('/api/units/money-and-operations')
      const planningUnitResponse = await app.inject('/api/units/planning-and-management')
      const lessonResponse = await app.inject('/api/lessons/where-money-goes')
      const reserveLessonResponse = await app.inject('/api/lessons/reserve-amount')

      expect(unitResponse.statusCode).toBe(200)
      expect(unitDetailsSchema.safeParse(unitResponse.json()).success).toBe(true)
      expect(planningUnitResponse.statusCode).toBe(200)
      expect(unitDetailsSchema.safeParse(planningUnitResponse.json()).success).toBe(true)
      expect(lessonResponse.statusCode).toBe(200)
      expect(lessonDetailsSchema.safeParse(lessonResponse.json()).success).toBe(true)
      expect(reserveLessonResponse.statusCode).toBe(200)
      expect(lessonDetailsSchema.safeParse(reserveLessonResponse.json()).success).toBe(true)
    } finally {
      await app.close()
    }
  })
})
