// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { createApp } from './app'
import { verifyPassword } from './lib/password'

async function setupTestApp(options: { staticRoot?: string } = {}) {
  const created = await createApp({
    databaseUrl: getTestDatabaseUrl(),
    databaseSchema: createTestSchemaName(),
    resetDatabaseSchema: true,
    dropDatabaseSchemaOnClose: true,
    databasePoolMax: 1,
    staticRoot: options.staticRoot,
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

async function createStaticRoot() {
  const root = await mkdtemp(join(tmpdir(), 'finpulse-static-'))
  await mkdir(join(root, 'assets'))
  await writeFile(join(root, 'index.html'), '<!doctype html><html><body><div id="root"></div></body></html>')
  await writeFile(join(root, 'assets', 'app.js'), 'window.__finpulse = true')
  return root
}

function sessionCookie(response: { headers: Record<string, number | string | string[] | undefined> }) {
  const rawCookie = response.headers['set-cookie']
  const cookie = Array.isArray(rawCookie) ? rawCookie[0] : rawCookie

  if (!cookie) {
    throw new Error('Expected set-cookie header')
  }

  return String(cookie).split(';')[0]
}

describe('backend API', () => {
  it('separates process health from database readiness', async () => {
    const { app } = await setupTestApp()

    try {
      const healthResponse = await app.inject('/api/health')
      expect(healthResponse.statusCode).toBe(200)
      expect(healthResponse.json()).toEqual({
        ok: true,
      })

      const readyResponse = await app.inject('/api/readyz')
      expect(readyResponse.statusCode).toBe(200)
      expect(readyResponse.json()).toEqual({
        ok: true,
        database: true,
      })
    } finally {
      await app.close()
    }
  })

  it('serves the built SPA without overriding API 404 responses', async () => {
    const staticRoot = await createStaticRoot()
    const { app } = await setupTestApp({ staticRoot })

    try {
      const rootResponse = await app.inject('/')
      expect(rootResponse.statusCode).toBe(200)
      expect(rootResponse.headers['content-type']).toContain('text/html')
      expect(rootResponse.body).toContain('<div id="root"></div>')

      const routeFallbackResponse = await app.inject('/profile')
      expect(routeFallbackResponse.statusCode).toBe(200)
      expect(routeFallbackResponse.headers['content-type']).toContain('text/html')

      const assetResponse = await app.inject('/assets/app.js')
      expect(assetResponse.statusCode).toBe(200)
      expect(assetResponse.headers['content-type']).toContain('text/javascript')
      expect(assetResponse.body).toContain('window.__finpulse')

      const apiNotFoundResponse = await app.inject('/api/missing')
      expect(apiNotFoundResponse.statusCode).toBe(404)
      expect(apiNotFoundResponse.json()).toMatchObject({
        error: {
          code: 'not_found',
        },
      })
    } finally {
      await app.close()
      await rm(staticRoot, { recursive: true, force: true })
    }
  })

  it('allows local loopback CORS origins by default', async () => {
    const { app } = await createApp({
      databaseUrl: getTestDatabaseUrl(),
      databaseSchema: createTestSchemaName(),
      resetDatabaseSchema: true,
      dropDatabaseSchemaOnClose: true,
      databasePoolMax: 1,
      cookieSecure: false,
    })
    await app.ready()

    try {
      for (const origin of ['http://localhost:5173', 'http://127.0.0.1:5174']) {
        const response = await app.inject({
          method: 'OPTIONS',
          url: '/api/auth/register',
          headers: {
            origin,
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
          },
        })

        expect(response.statusCode).toBe(204)
        expect(response.headers['access-control-allow-origin']).toBe(origin)
        expect(response.headers['access-control-allow-credentials']).toBe('true')
        expect(response.headers['access-control-allow-methods']).toContain('POST')
      }

      const progressWriteResponse = await app.inject({
        method: 'OPTIONS',
        url: '/api/progress/lessons/where-money-goes',
        headers: {
          origin: 'http://127.0.0.1:5174',
          'access-control-request-method': 'PUT',
          'access-control-request-headers': 'content-type',
        },
      })

      expect(progressWriteResponse.statusCode).toBe(204)
      expect(progressWriteResponse.headers['access-control-allow-origin']).toBe('http://127.0.0.1:5174')
      expect(progressWriteResponse.headers['access-control-allow-credentials']).toBe('true')
      expect(progressWriteResponse.headers['access-control-allow-methods']).toContain('PUT')

      const blockedResponse = await app.inject({
        method: 'OPTIONS',
        url: '/api/auth/register',
        headers: {
          origin: 'http://example.com',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'content-type',
        },
      })

      expect(blockedResponse.statusCode).toBe(404)
      expect(blockedResponse.headers['access-control-allow-origin']).toBeUndefined()
    } finally {
      await app.close()
    }
  })

  it('registers a user, hashes the password, sets a session cookie, and returns me', async () => {
    const { app, db } = await setupTestApp()

    try {
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'Learner.One',
          password: 'secure-passphrase',
        },
      })

      expect(registerResponse.statusCode).toBe(201)
      expect(registerResponse.json()).toMatchObject({
        user: {
          login: 'learner.one',
          createdAt: expect.any(String),
        },
      })

      const row = await db.users.findUserByLogin('learner.one')
      expect(row?.passwordHash).not.toBe('secure-passphrase')
      await expect(verifyPassword('secure-passphrase', row?.passwordHash ?? '')).resolves.toBe(true)

      const meResponse = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          cookie: sessionCookie(registerResponse),
        },
      })

      expect(meResponse.statusCode).toBe(200)
      expect(meResponse.json()).toMatchObject({
        user: {
          login: 'learner.one',
          createdAt: row?.createdAt,
        },
      })
    } finally {
      await app.close()
    }
  })

  it('registers and logs in with an email identifier', async () => {
    const { app } = await setupTestApp()

    try {
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'Learner.Email+One@Example.COM',
          password: 'secure-passphrase',
        },
      })

      expect(registerResponse.statusCode).toBe(201)
      expect(registerResponse.json()).toMatchObject({
        user: {
          login: 'learner.email+one@example.com',
          createdAt: expect.any(String),
        },
      })

      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          login: 'learner.email+one@example.com',
          password: 'secure-passphrase',
        },
      })

      expect(loginResponse.statusCode).toBe(200)
      expect(loginResponse.json()).toMatchObject({
        user: {
          login: 'learner.email+one@example.com',
          createdAt: registerResponse.json().user.createdAt,
        },
      })
    } finally {
      await app.close()
    }
  })

  it('logs in, logs out, and rejects me after the session is cleared', async () => {
    const { app } = await setupTestApp()

    try {
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'logout-user',
          password: 'secure-passphrase',
        },
      })
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          login: 'logout-user',
          password: 'secure-passphrase',
        },
      })
      const cookie = sessionCookie(loginResponse)

      const logoutResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/logout',
        headers: { cookie },
      })
      expect(logoutResponse.statusCode).toBe(204)

      const meResponse = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { cookie },
      })
      expect(meResponse.statusCode).toBe(401)
    } finally {
      await app.close()
    }
  })

  it('treats logout with an empty JSON body as a successful session clear', async () => {
    const { app } = await setupTestApp()

    try {
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'empty-json-logout-user',
          password: 'secure-passphrase',
        },
      })
      const cookie = sessionCookie(registerResponse)

      const logoutResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/logout',
        headers: {
          cookie,
          'content-type': 'application/json',
        },
        payload: '',
      })
      expect(logoutResponse.statusCode).toBe(204)

      const meResponse = await app.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: { cookie },
      })
      expect(meResponse.statusCode).toBe(401)
    } finally {
      await app.close()
    }
  })

  it('rejects passwords that bcrypt would truncate', async () => {
    const { app } = await setupTestApp()

    try {
      const longPassword = 'a'.repeat(73)
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'long-password-user',
          password: longPassword,
        },
      })

      expect(registerResponse.statusCode).toBe(400)
      expect(registerResponse.json()).toMatchObject({
        error: {
          code: 'password_too_long',
        },
      })

      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'valid-password-user',
          password: 'secure-passphrase',
        },
      })
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          login: 'valid-password-user',
          password: longPassword,
        },
      })

      expect(loginResponse.statusCode).toBe(400)
      expect(loginResponse.json()).toMatchObject({
        error: {
          code: 'password_too_long',
        },
      })
    } finally {
      await app.close()
    }
  })

  it('protects progress routes and stores lesson/card progress per user', async () => {
    const { app } = await setupTestApp()

    try {
      const blockedResponse = await app.inject({
        method: 'GET',
        url: '/api/progress',
      })
      expect(blockedResponse.statusCode).toBe(401)

      const firstRegister = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'first-user',
          password: 'secure-passphrase',
        },
      })
      const firstCookie = sessionCookie(firstRegister)

      const lessonProgress = await app.inject({
        method: 'PUT',
        url: '/api/progress/lessons/where-money-goes',
        headers: { cookie: firstCookie },
        payload: { completed: true },
      })
      expect(lessonProgress.statusCode).toBe(200)
      expect(lessonProgress.json().lessons).toEqual([
        expect.objectContaining({
          lessonSlug: 'where-money-goes',
          viewed: true,
          completed: true,
        }),
      ])

      const cardProgress = await app.inject({
        method: 'PUT',
        url: '/api/progress/cards/card_t1u1l1_03_sorting_choice',
        headers: { cookie: firstCookie },
        payload: { viewed: true },
      })
      expect(cardProgress.statusCode).toBe(200)
      expect(cardProgress.json().cards).toEqual([
        expect.objectContaining({
          cardId: 'card_t1u1l1_03_sorting_choice',
          viewed: true,
          completed: false,
        }),
      ])

      const secondRegister = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'second-user',
          password: 'secure-passphrase',
        },
      })
      const secondProgress = await app.inject({
        method: 'GET',
        url: '/api/progress',
        headers: { cookie: sessionCookie(secondRegister) },
      })
      expect(secondProgress.statusCode).toBe(200)
      expect(secondProgress.json()).toEqual({
        lessons: [],
        cards: [],
      })
    } finally {
      await app.close()
    }
  })

  it('protects reflection answers and stores reflection/artifact answers per user', async () => {
    const { app, db } = await setupTestApp()

    try {
      const blockedGetResponse = await app.inject({
        method: 'GET',
        url: '/api/reflections',
      })
      expect(blockedGetResponse.statusCode).toBe(401)

      const blockedPutResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_05_surprise_reflection',
        payload: { singleValue: 'Свобода выбора' },
      })
      expect(blockedPutResponse.statusCode).toBe(401)

      const firstRegister = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'reflection-user-one',
          password: 'secure-passphrase',
        },
      })
      const firstCookie = sessionCookie(firstRegister)

      const rejectedUserIdPayload = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_05_surprise_reflection',
        headers: { cookie: firstCookie },
        payload: {
          singleValue: 'Свобода выбора',
          userId: 'not-current-user',
        },
      })
      expect(rejectedUserIdPayload.statusCode).toBe(400)
      expect(rejectedUserIdPayload.json()).toMatchObject({
        error: {
          code: 'invalid_reflection_payload',
        },
      })

      const rejectedEmptyPayload = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_05_surprise_reflection',
        headers: { cookie: firstCookie },
        payload: {
          singleValue: '   ',
        },
      })
      expect(rejectedEmptyPayload.statusCode).toBe(400)
      expect(rejectedEmptyPayload.json()).toMatchObject({
        error: {
          code: 'empty_reflection_answer',
        },
      })

      const createReflectionResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_05_surprise_reflection',
        headers: { cookie: firstCookie },
        payload: {
          singleValue: 'Свобода выбора',
          fallbackValue: 'Личный ориентир',
        },
      })
      expect(createReflectionResponse.statusCode).toBe(200)
      expect(createReflectionResponse.json()).toMatchObject({
        answers: [
          expect.objectContaining({
            cardId: 'card_t1u1l1_05_surprise_reflection',
            saveKey: 'unexpected_expense',
            lessonSlug: 'where-money-goes',
            moduleSlug: 't1-start',
            unitSlug: 'money-and-operations',
            cardType: 'reflection',
            prompt: expect.any(String),
            answer: {
              singleValue: 'Свобода выбора',
              fallbackValue: 'Личный ориентир',
            },
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ],
      })

      type StoredReflectionRow = {
        user_id: string
        card_id: string
        save_key: string
        lesson_slug: string
        answer_json: Record<string, unknown>
      }
      const storedResult = await db.query<StoredReflectionRow>(
        'SELECT user_id, card_id, save_key, lesson_slug, answer_json FROM reflection_answers WHERE card_id = $1',
        ['card_t1u1l1_05_surprise_reflection'],
      )
      const storedRow = storedResult.rows[0]
      expect(storedRow).toMatchObject({
        user_id: firstRegister.json().user.id,
        card_id: 'card_t1u1l1_05_surprise_reflection',
        save_key: 'unexpected_expense',
        lesson_slug: 'where-money-goes',
      })
      expect(storedRow?.answer_json).toEqual({
        singleValue: 'Свобода выбора',
        fallbackValue: 'Личный ориентир',
      })

      const updateReflectionResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_05_surprise_reflection',
        headers: { cookie: firstCookie },
        payload: {
          singleValue: 'здоровье',
        },
      })
      expect(updateReflectionResponse.statusCode).toBe(200)
      expect(updateReflectionResponse.json()).toMatchObject({
        answers: [
          expect.objectContaining({
            cardId: 'card_t1u1l1_05_surprise_reflection',
            answer: {
              singleValue: 'здоровье',
            },
          }),
        ],
      })

      const createArtifactResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_04_expense_diary',
        headers: { cookie: firstCookie },
        payload: {
          multiValues: ['Обучение', 'Рост'],
          checkedRows: ['0'],
          templateValues: ['Кофе 250', 'Обед 650', 'Такси 420'],
        },
      })
      expect(createArtifactResponse.statusCode).toBe(200)
      expect(createArtifactResponse.json()).toMatchObject({
        answers: expect.arrayContaining([
          expect.objectContaining({
            cardId: 'card_t1u1l1_04_expense_diary',
            saveKey: null,
            lessonSlug: 'where-money-goes',
            cardType: 'artifact',
            template: ['Трата 1: сумма и категория', 'Трата 2: сумма и категория', 'Трата 3: сумма и категория'],
            answer: {
              multiValues: ['Обучение', 'Рост'],
              checkedRows: ['0'],
              templateValues: ['Кофе 250', 'Обед 650', 'Такси 420'],
            },
          }),
        ]),
      })

      const firstAnswersResponse = await app.inject({
        method: 'GET',
        url: '/api/reflections',
        headers: { cookie: firstCookie },
      })
      expect(firstAnswersResponse.statusCode).toBe(200)
      expect(firstAnswersResponse.json().answers).toHaveLength(2)
      expect(firstAnswersResponse.json().answers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cardId: 'card_t1u1l1_05_surprise_reflection',
            answer: {
              singleValue: 'здоровье',
            },
          }),
          expect.objectContaining({
            cardId: 'card_t1u1l1_04_expense_diary',
            cardType: 'artifact',
          }),
        ]),
      )

      const secondRegister = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'reflection-user-two',
          password: 'secure-passphrase',
        },
      })
      const secondCookie = sessionCookie(secondRegister)

      const emptySecondAnswersResponse = await app.inject({
        method: 'GET',
        url: '/api/reflections',
        headers: { cookie: secondCookie },
      })
      expect(emptySecondAnswersResponse.statusCode).toBe(200)
      expect(emptySecondAnswersResponse.json()).toEqual({
        answers: [],
      })

      const secondReflectionResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_05_surprise_reflection',
        headers: { cookie: secondCookie },
        payload: {
          singleValue: 'Свой отдельный ориентир',
        },
      })
      expect(secondReflectionResponse.statusCode).toBe(200)

      const firstAnswersAfterSecondWrite = await app.inject({
        method: 'GET',
        url: '/api/reflections',
        headers: { cookie: firstCookie },
      })
      expect(firstAnswersAfterSecondWrite.json().answers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cardId: 'card_t1u1l1_05_surprise_reflection',
            answer: {
              singleValue: 'здоровье',
            },
          }),
        ]),
      )

      const secondAnswersResponse = await app.inject({
        method: 'GET',
        url: '/api/reflections',
        headers: { cookie: secondCookie },
      })
      expect(secondAnswersResponse.json()).toMatchObject({
        answers: [
          {
            cardId: 'card_t1u1l1_05_surprise_reflection',
            answer: {
              singleValue: 'Свой отдельный ориентир',
            },
          },
        ],
      })
    } finally {
      await app.close()
    }
  })

  it('rejects non-reflection cards for personal answer persistence', async () => {
    const { app } = await setupTestApp()

    try {
      const registerResponse = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'non-reflection-user',
          password: 'secure-passphrase',
        },
      })

      const response = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_t1u1l1_03_sorting_choice',
        headers: { cookie: sessionCookie(registerResponse) },
        payload: { singleValue: 'any answer' },
      })

      expect(response.statusCode).toBe(400)
      expect(response.json()).toMatchObject({
        error: {
          code: 'non_persistable_card',
        },
      })
    } finally {
      await app.close()
    }
  })

  it('serves validated content through the API shape expected by the frontend', async () => {
    const { app } = await setupTestApp()

    try {
      const programResponse = await app.inject('/api/program')
      expect(programResponse.statusCode).toBe(200)
      expect(programResponse.json()).toMatchObject({
        slug: 'finpulse-learning-mvp',
        modules: [
          expect.objectContaining({
            slug: 't1-start',
            title: 'T1 Старт',
            units: [
              expect.objectContaining({
                slug: 'money-and-operations',
                title: 'Юнит 1. Деньги и операции',
              }),
              expect.objectContaining({
                slug: 'planning-and-management',
                title: 'Юнит 2. Планирование и управление',
              }),
            ],
          }),
        ],
      })

      const targetModuleResponse = await app.inject('/api/modules/t1-start')
      const targetUnitResponse = await app.inject('/api/units/money-and-operations')
      const planningUnitResponse = await app.inject('/api/units/planning-and-management')
      const lessonResponse = await app.inject('/api/lessons/where-money-goes')
      const mandatoryLessonResponse = await app.inject('/api/lessons/mandatory-and-desired')
      const emergencyFundLessonResponse = await app.inject('/api/lessons/why-emergency-fund')
      const reserveLessonResponse = await app.inject('/api/lessons/reserve-amount')
      const targetUnitLessons = targetUnitResponse.json().unit.lessons.map((lesson: { slug: string }) => lesson.slug)
      const planningUnitLessons = planningUnitResponse.json().unit.lessons.map((lesson: { slug: string }) => lesson.slug)

      expect(targetModuleResponse.statusCode).toBe(200)
      expect(targetModuleResponse.json()).toMatchObject({
        slug: 't1-start',
        units: [
          expect.objectContaining({
            slug: 'money-and-operations',
          }),
          expect.objectContaining({
            slug: 'planning-and-management',
          }),
        ],
      })
      expect(targetUnitResponse.statusCode).toBe(200)
      expect(targetUnitLessons).toEqual(['where-money-goes', 'mandatory-and-desired'])
      expect(planningUnitResponse.statusCode).toBe(200)
      expect(planningUnitLessons).toEqual(['why-emergency-fund', 'reserve-amount'])
      expect(lessonResponse.statusCode).toBe(200)
      expect(lessonResponse.json()).toMatchObject({
        module: expect.objectContaining({ slug: 't1-start' }),
        unit: expect.objectContaining({ slug: 'money-and-operations' }),
        lesson: expect.objectContaining({
          slug: 'where-money-goes',
          title: 'Куда уходят деньги',
          cards: [
            expect.objectContaining({ id: 'card_t1u1l1_01_hook', type: 'single_choice' }),
            expect.objectContaining({ id: 'card_t1u1l1_02_theory_leaks', type: 'theory' }),
            expect.objectContaining({ id: 'card_t1u1l1_03_sorting_choice', type: 'categorization' }),
            expect.objectContaining({ id: 'card_t1u1l1_04_subscription_example', type: 'scenario' }),
            expect.objectContaining({ id: 'card_t1u1l1_04_expense_diary', type: 'artifact' }),
            expect.objectContaining({ id: 'card_t1u1l1_05_surprise_reflection', type: 'reflection' }),
            expect.objectContaining({ id: 'card_t1u1l1_06_micro_rule', type: 'artifact' }),
            expect.objectContaining({ id: 'card_t1u1l1_07_navigator_summary', type: 'summary' }),
          ],
        }),
      })
      expect(mandatoryLessonResponse.statusCode).toBe(200)
      expect(mandatoryLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'where-money-goes' }),
        }),
        lesson: expect.objectContaining({
          slug: 'mandatory-and-desired',
          title: 'Обязательное и желаемое',
          cards: expect.arrayContaining([
            expect.objectContaining({ id: 'card_t1u1l2_03_sorting_choice', type: 'categorization' }),
          ]),
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'why-emergency-fund' }),
        }),
      })
      expect(emergencyFundLessonResponse.statusCode).toBe(200)
      expect(emergencyFundLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'mandatory-and-desired' }),
        }),
        unit: expect.objectContaining({
          slug: 'planning-and-management',
        }),
        lesson: expect.objectContaining({
          slug: 'why-emergency-fund',
          title: 'Зачем нужна подушка',
          cards: expect.arrayContaining([
            expect.objectContaining({
              id: 'card_t1u2l1_03_where_fund_helps',
              type: 'categorization',
              categories: expect.arrayContaining([
                expect.objectContaining({ id: 'helps', label: 'Подушка помогает' }),
                expect.objectContaining({ id: 'not-for-fund', label: 'Не для подушки' }),
              ]),
            }),
          ]),
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'reserve-amount' }),
        }),
      })
      expect(reserveLessonResponse.statusCode).toBe(200)
      expect(reserveLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'why-emergency-fund' }),
        }),
        unit: expect.objectContaining({
          slug: 'planning-and-management',
        }),
        lesson: expect.objectContaining({
          slug: 'reserve-amount',
          title: 'Сколько держать в резерве',
        }),
        next: null,
      })

      const removedModuleResponse = await app.inject('/api/modules/financial-goals')
      const removedUnitResponse = await app.inject('/api/units/values-and-goals')
      const removedFutureUnitResponse = await app.inject('/api/units/future-vision')
      const removedLessonResponse = await app.inject('/api/lessons/why-values-matter')
      const removedFinalLessonResponse = await app.inject('/api/lessons/goal-levels')

      expect(removedModuleResponse.statusCode).toBe(404)
      expect(removedUnitResponse.statusCode).toBe(404)
      expect(removedFutureUnitResponse.statusCode).toBe(404)
      expect(removedLessonResponse.statusCode).toBe(404)
      expect(removedFinalLessonResponse.statusCode).toBe(404)
    } finally {
      await app.close()
    }
  })
})
