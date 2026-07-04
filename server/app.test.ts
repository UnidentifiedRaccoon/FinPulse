// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Pool } from 'pg'
import { describe, expect, it } from 'vitest'

import { createApp, type CreateAppOptions } from './app'
import { hashPassword, verifyPassword } from './lib/password'

async function setupTestApp(options: Pick<CreateAppOptions, 'staticRoot' | 'adminAuth'> = {}) {
  const created = await createApp({
    databaseUrl: getTestDatabaseUrl(),
    databaseSchema: createTestSchemaName(),
    resetDatabaseSchema: true,
    dropDatabaseSchemaOnClose: true,
    databasePoolMax: 1,
    staticRoot: options.staticRoot,
    cookieSecure: false,
    corsOrigin: 'http://localhost:5173',
    adminAuth: options.adminAuth,
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

async function createLegacyReflectionAnswersSchema(databaseUrl: string, schema: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
  })

  try {
    await pool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`)
    await pool.query(`CREATE SCHEMA ${schema}`)
    await pool.query(`
      CREATE TABLE ${schema}.reflection_answers (
        user_id uuid NOT NULL,
        card_id text NOT NULL,
        save_key text,
        lesson_slug text NOT NULL,
        module_slug text NOT NULL,
        unit_slug text NOT NULL,
        card_type text NOT NULL CHECK (card_type IN ('reflection', 'artifact')),
        title text,
        prompt text NOT NULL,
        context_title text NOT NULL,
        source_section text,
        module_title text NOT NULL,
        unit_title text NOT NULL,
        lesson_title text NOT NULL,
        answer_json jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, card_id)
      )
    `)
  } finally {
    await pool.end()
  }
}

async function dropTestSchema(databaseUrl: string, schema: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
  })

  try {
    await pool.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`)
  } finally {
    await pool.end()
  }
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

function rawSetCookie(response: { headers: Record<string, number | string | string[] | undefined> }) {
  const rawCookie = response.headers['set-cookie']
  return Array.isArray(rawCookie) ? rawCookie.join('\n') : String(rawCookie ?? '')
}

async function createAdminAuth() {
  return {
    login: 'admin@example.com',
    passwordHash: await hashPassword('admin-passphrase'),
    sessionSecret: 'test-admin-session-secret',
  }
}

async function loginAdmin(app: Awaited<ReturnType<typeof createApp>>['app']) {
  const loginResponse = await app.inject({
    method: 'POST',
    url: '/api/admin/auth/login',
    payload: {
      login: 'admin@example.com',
      password: 'admin-passphrase',
    },
  })
  expect(loginResponse.statusCode).toBe(200)
  return sessionCookie(loginResponse)
}

function expectNoPrivateAnswerLeak(payload: unknown) {
  const serialized = JSON.stringify(payload)
  expect(serialized).not.toContain('СЕКРЕТНЫЙ личный ответ')
  expect(serialized).not.toContain('answer_json')
  expect(serialized).not.toContain('textValue')
  expect(serialized).not.toContain('singleValue')
  expect(serialized).not.toContain('templateValues')
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

  it('keeps admin authentication separate from learner sessions', async () => {
    const { app } = await setupTestApp({
      adminAuth: await createAdminAuth(),
    })

    try {
      const missingConfigApp = await createApp({
        databaseUrl: getTestDatabaseUrl(),
        databaseSchema: createTestSchemaName(),
        resetDatabaseSchema: true,
        dropDatabaseSchemaOnClose: true,
        databasePoolMax: 1,
        cookieSecure: false,
        adminAuth: {
          login: '',
          passwordHash: '',
          sessionSecret: '',
        },
      })
      await missingConfigApp.app.ready()
      try {
        const missingConfigLogin = await missingConfigApp.app.inject({
          method: 'POST',
          url: '/api/admin/auth/login',
          payload: {
            login: 'admin@example.com',
            password: 'admin-passphrase',
          },
        })
        expect(missingConfigLogin.statusCode).toBe(503)
        expect(missingConfigLogin.json()).toMatchObject({
          error: {
            code: 'admin_not_configured',
          },
        })
      } finally {
        await missingConfigApp.app.close()
      }

      const learnerRegister = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'learner-for-admin-boundary',
          password: 'secure-passphrase',
        },
      })
      const learnerCookie = sessionCookie(learnerRegister)

      const learnerAdminResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/users',
        headers: {
          cookie: learnerCookie,
        },
      })
      expect(learnerAdminResponse.statusCode).toBe(401)

      const loginResponse = await app.inject({
        method: 'POST',
        url: '/api/admin/auth/login',
        payload: {
          login: 'ADMIN@example.com',
          password: 'admin-passphrase',
        },
      })
      expect(loginResponse.statusCode).toBe(200)
      expect(rawSetCookie(loginResponse)).toContain('finpulse_admin_session=')
      expect(rawSetCookie(loginResponse)).not.toContain('finpulse_session=')
      const adminCookie = sessionCookie(loginResponse)

      const meResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/auth/me',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(meResponse.statusCode).toBe(200)
      expect(meResponse.json()).toMatchObject({
        admin: {
          login: 'admin@example.com',
        },
        scope: {
          access: 'global_all_users',
          organizationFiltering: {
            enabled: false,
          },
          rbac: {
            enabled: false,
          },
        },
      })
      expect(meResponse.headers['cache-control']).toBe('no-store')

      const adminLearnerProgressResponse = await app.inject({
        method: 'GET',
        url: '/api/progress',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(adminLearnerProgressResponse.statusCode).toBe(401)
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
        url: '/api/progress/cards/card_l1s1l1_03_sorting_choice',
        headers: { cookie: firstCookie },
        payload: { viewed: true },
      })
      expect(cardProgress.statusCode).toBe(200)
      expect(cardProgress.json().cards).toEqual([
        expect.objectContaining({
          cardId: 'card_l1s1l1_03_sorting_choice',
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

  it('returns read-only admin progress summaries without private reflection answer text', async () => {
    const { app, db } = await setupTestApp({
      adminAuth: await createAdminAuth(),
    })

    try {
      const adminLoginResponse = await app.inject({
        method: 'POST',
        url: '/api/admin/auth/login',
        payload: {
          login: 'admin@example.com',
          password: 'admin-passphrase',
        },
      })
      const adminCookie = sessionCookie(adminLoginResponse)

      const learnerRegister = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'learner.email@example.com',
          password: 'secure-passphrase',
        },
      })
      const learner = learnerRegister.json().user as { id: string; login: string }
      const learnerCookie = sessionCookie(learnerRegister)
      const oldActivity = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)

      await db.progress.upsertLessonProgress(learner.id, 'where-money-goes', { completed: true }, oldActivity)
      await db.progress.upsertLessonProgress(learner.id, 'mandatory-and-desired', { viewed: true }, oldActivity)
      await db.progress.upsertCardProgress(learner.id, 'card_l1s1l1_03_sorting_choice', { completed: true }, oldActivity)

      const reflectionResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
        headers: {
          cookie: learnerCookie,
        },
        payload: {
          singleValue: 'СЕКРЕТНЫЙ личный ответ',
          fallbackValue: 'СЕКРЕТНЫЙ личный ответ',
        },
      })
      expect(reflectionResponse.statusCode).toBe(200)
      await db.query('UPDATE reflection_answers SET updated_at = $1::timestamptz WHERE user_id = $2::uuid', [
        oldActivity.toISOString(),
        learner.id,
      ])

      const blockedOrganizationFilter = await app.inject({
        method: 'GET',
        url: '/api/admin/users?organizationId=org_1',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(blockedOrganizationFilter.statusCode).toBe(400)
      expect(blockedOrganizationFilter.json()).toMatchObject({
        error: {
          code: 'organization_filtering_not_enabled',
        },
      })

      const blockedPrivateFields = await app.inject({
        method: 'GET',
        url: '/api/admin/users?fields=answer_json',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(blockedPrivateFields.statusCode).toBe(400)
      expect(blockedPrivateFields.json()).toMatchObject({
        error: {
          code: 'private_answer_fields_not_supported',
        },
      })

      const summaryResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/summary?stuckThresholdDays=7',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(summaryResponse.statusCode).toBe(200)
      expect(summaryResponse.json()).toMatchObject({
        scope: {
          access: 'global_all_users',
          organizationFiltering: {
            enabled: false,
          },
        },
        totals: {
          totalUsers: 1,
          totalLessons: expect.any(Number),
          completedLessons: 1,
          completedCards: 1,
          stuckUsers: 1,
          stuckThresholdDays: 7,
        },
      })
      expectNoPrivateAnswerLeak(summaryResponse.json())

      const usersResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/users?search=learner.email&stuckThresholdDays=7',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(usersResponse.statusCode).toBe(200)
      expect(usersResponse.json()).toMatchObject({
        page: {
          total: 1,
        },
        totals: {
          totalLessons: expect.any(Number),
          totalCards: expect.any(Number),
        },
        users: [
          {
            id: learner.id,
            login: learner.login,
            progress: {
              viewedLessons: 2,
              completedLessons: 1,
              totalLessons: expect.any(Number),
              completedCards: 1,
              currentLesson: {
                lessonSlug: 'mandatory-and-desired',
                lessonTitle: 'Обязательное и желаемое',
                sectionSlug: 'money-and-operations',
                levelSlug: 'level-1-start',
              },
              stuckDays: expect.any(Number),
              isStuck: true,
            },
          },
        ],
      })
      expect(usersResponse.json().users[0].progress.stuckDays).toBeGreaterThanOrEqual(9)
      expectNoPrivateAnswerLeak(usersResponse.json())

      const detailResponse = await app.inject({
        method: 'GET',
        url: `/api/admin/users/${learner.id}/progress?includeAnswers=true`,
        headers: {
          cookie: adminCookie,
        },
      })
      expect(detailResponse.statusCode).toBe(400)

      const detailWithoutAnswersResponse = await app.inject({
        method: 'GET',
        url: `/api/admin/users/${learner.id}/progress`,
        headers: {
          cookie: adminCookie,
        },
      })
      expect(detailWithoutAnswersResponse.statusCode).toBe(200)
      expect(detailWithoutAnswersResponse.json()).toMatchObject({
        privacy: {
          reflectionAnswerTextIncluded: false,
        },
        user: {
          id: learner.id,
          login: 'learner.email@example.com',
        },
        lessons: expect.arrayContaining([
          expect.objectContaining({
            lessonSlug: 'where-money-goes',
            lessonOrder: 1,
            status: 'completed',
            completedAt: expect.any(String),
            cards: expect.arrayContaining([
              expect.objectContaining({
                cardId: 'card_l1s1l1_03_sorting_choice',
                cardOrder: 3,
                status: 'completed',
              }),
            ]),
          }),
          expect.objectContaining({
            lessonSlug: 'mandatory-and-desired',
            lessonOrder: 2,
            status: 'viewed',
            viewedAt: expect.any(String),
            completedAt: null,
          }),
        ]),
      })
      expectNoPrivateAnswerLeak(detailWithoutAnswersResponse.json())
    } finally {
      await app.close()
    }
  })

  it('publishes an admin card text slice and serves it through learner content APIs', async () => {
    const { app } = await setupTestApp({
      adminAuth: await createAdminAuth(),
    })

    try {
      const adminCookie = await loginAdmin(app)
      const treeResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/content/tree',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(treeResponse.statusCode).toBe(200)
      expect(treeResponse.json()).toMatchObject({
        tree: {
          levels: expect.arrayContaining([
            expect.objectContaining({
              slug: 'level-1-start',
              sections: expect.arrayContaining([
                expect.objectContaining({
                  slug: 'money-and-operations',
                  lessons: expect.arrayContaining([
                    expect.objectContaining({
                      slug: 'where-money-goes',
                      cards: expect.arrayContaining([
                        expect.objectContaining({
                          id: 'card_l1s1l1_01_hook',
                        }),
                      ]),
                    }),
                  ]),
                }),
              ]),
            }),
          ]),
        },
      })

      const previewResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/content/preview?kind=card&levelSlug=level-1-start&sectionSlug=money-and-operations&lessonSlug=where-money-goes&cardId=card_l1s1l1_01_hook',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(previewResponse.statusCode).toBe(200)
      const previewPayload = previewResponse.json() as {
        preview: {
          revision: number
          slice: {
            id: string
            title: string
            question: string
          } & Record<string, unknown>
        }
      }
      const nextSlice = {
        ...previewPayload.preview.slice,
        title: 'Деньги были... или редактор уже поменял?',
        question: `${previewPayload.preview.slice.question}\n\nТестовая правка методиста.`,
      }

      const publishResponse = await app.inject({
        method: 'PUT',
        url: '/api/admin/content/slices',
        headers: {
          cookie: adminCookie,
        },
        payload: {
          kind: 'card',
          levelSlug: 'level-1-start',
          sectionSlug: 'money-and-operations',
          lessonSlug: 'where-money-goes',
          cardId: 'card_l1s1l1_01_hook',
          revision: previewPayload.preview.revision,
          slice: nextSlice,
        },
      })
      expect(publishResponse.statusCode).toBe(200)
      expect(publishResponse.json()).toMatchObject({
        preview: {
          revision: previewPayload.preview.revision + 1,
          slice: {
            id: 'card_l1s1l1_01_hook',
            title: 'Деньги были... или редактор уже поменял?',
          },
        },
      })

      const learnerLessonResponse = await app.inject('/api/lessons/where-money-goes')
      expect(learnerLessonResponse.statusCode).toBe(200)
      expect(learnerLessonResponse.json()).toMatchObject({
        lesson: {
          cards: expect.arrayContaining([
            expect.objectContaining({
              id: 'card_l1s1l1_01_hook',
              title: 'Деньги были... или редактор уже поменял?',
              question: expect.stringContaining('Тестовая правка методиста.'),
            }),
          ]),
        },
      })
    } finally {
      await app.close()
    }
  })

  it('rejects protected admin content fields and stale content revisions', async () => {
    const { app } = await setupTestApp({
      adminAuth: await createAdminAuth(),
    })

    try {
      const adminCookie = await loginAdmin(app)
      const previewResponse = await app.inject({
        method: 'GET',
        url: '/api/admin/content/preview?kind=card&levelSlug=level-1-start&sectionSlug=money-and-operations&lessonSlug=where-money-goes&cardId=card_l1s1l1_01_hook',
        headers: {
          cookie: adminCookie,
        },
      })
      expect(previewResponse.statusCode).toBe(200)
      const previewPayload = previewResponse.json() as {
        preview: {
          revision: number
          slice: {
            id: string
            title: string
            question: string
          } & Record<string, unknown>
        }
      }

      const protectedFieldResponse = await app.inject({
        method: 'PUT',
        url: '/api/admin/content/slices',
        headers: {
          cookie: adminCookie,
        },
        payload: {
          kind: 'card',
          levelSlug: 'level-1-start',
          sectionSlug: 'money-and-operations',
          lessonSlug: 'where-money-goes',
          cardId: 'card_l1s1l1_01_hook',
          revision: previewPayload.preview.revision,
          slice: {
            ...previewPayload.preview.slice,
            id: 'changed_card_id',
          },
        },
      })
      expect(protectedFieldResponse.statusCode).toBe(400)
      expect(protectedFieldResponse.json()).toMatchObject({
        error: {
          code: 'invalid_admin_content_update',
        },
      })

      const firstPublishResponse = await app.inject({
        method: 'PUT',
        url: '/api/admin/content/slices',
        headers: {
          cookie: adminCookie,
        },
        payload: {
          kind: 'card',
          levelSlug: 'level-1-start',
          sectionSlug: 'money-and-operations',
          lessonSlug: 'where-money-goes',
          cardId: 'card_l1s1l1_01_hook',
          revision: previewPayload.preview.revision,
          slice: {
            ...previewPayload.preview.slice,
            title: 'Первая правка методиста',
          },
        },
      })
      expect(firstPublishResponse.statusCode).toBe(200)

      const stalePublishResponse = await app.inject({
        method: 'PUT',
        url: '/api/admin/content/slices',
        headers: {
          cookie: adminCookie,
        },
        payload: {
          kind: 'card',
          levelSlug: 'level-1-start',
          sectionSlug: 'money-and-operations',
          lessonSlug: 'where-money-goes',
          cardId: 'card_l1s1l1_01_hook',
          revision: previewPayload.preview.revision,
          slice: {
            ...previewPayload.preview.slice,
            title: 'Запоздалая правка методиста',
          },
        },
      })
      expect(stalePublishResponse.statusCode).toBe(409)
      expect(stalePublishResponse.json()).toMatchObject({
        error: {
          code: 'content_revision_conflict',
        },
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
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
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
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
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
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
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
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
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
            cardId: 'card_l1s1l1_05_surprise_reflection',
            saveKey: 'unexpected_expense',
            lessonSlug: 'where-money-goes',
            levelSlug: 'level-1-start',
            sectionSlug: 'money-and-operations',
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
        level_slug: string
        section_slug: string
        answer_json: Record<string, unknown>
      }
      const storedResult = await db.query<StoredReflectionRow>(
        'SELECT user_id, card_id, save_key, lesson_slug, level_slug, section_slug, answer_json FROM reflection_answers WHERE card_id = $1',
        ['card_l1s1l1_05_surprise_reflection'],
      )
      const storedRow = storedResult.rows[0]
      expect(storedRow).toMatchObject({
        user_id: firstRegister.json().user.id,
        card_id: 'card_l1s1l1_05_surprise_reflection',
        save_key: 'unexpected_expense',
        lesson_slug: 'where-money-goes',
        level_slug: 'level-1-start',
        section_slug: 'money-and-operations',
      })
      expect(storedRow?.answer_json).toEqual({
        singleValue: 'Свобода выбора',
        fallbackValue: 'Личный ориентир',
      })

      const updateReflectionResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
        headers: { cookie: firstCookie },
        payload: {
          singleValue: 'здоровье',
        },
      })
      expect(updateReflectionResponse.statusCode).toBe(200)
      expect(updateReflectionResponse.json()).toMatchObject({
        answers: [
          expect.objectContaining({
            cardId: 'card_l1s1l1_05_surprise_reflection',
            answer: {
              singleValue: 'здоровье',
            },
          }),
        ],
      })

      const createArtifactResponse = await app.inject({
        method: 'PUT',
        url: '/api/reflections/card_l1s1l1_04_expense_diary',
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
            cardId: 'card_l1s1l1_04_expense_diary',
            saveKey: null,
            lessonSlug: 'where-money-goes',
            cardType: 'artifact',
            template: [
              'Трата 1:',
              'Трата 2:',
              'Трата 3:',
            ],
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
            cardId: 'card_l1s1l1_05_surprise_reflection',
            answer: {
              singleValue: 'здоровье',
            },
          }),
          expect.objectContaining({
            cardId: 'card_l1s1l1_04_expense_diary',
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
        url: '/api/reflections/card_l1s1l1_05_surprise_reflection',
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
            cardId: 'card_l1s1l1_05_surprise_reflection',
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
            cardId: 'card_l1s1l1_05_surprise_reflection',
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

  it('migrates legacy reflection answer columns before saving level/section artifact answers', async () => {
    const databaseUrl = getTestDatabaseUrl()
    const databaseSchema = createTestSchemaName()
    await createLegacyReflectionAnswersSchema(databaseUrl, databaseSchema)

    let created: Awaited<ReturnType<typeof createApp>> | null = null

    try {
      created = await createApp({
        databaseUrl,
        databaseSchema,
        resetDatabaseSchema: false,
        dropDatabaseSchemaOnClose: true,
        databasePoolMax: 1,
        cookieSecure: false,
        corsOrigin: 'http://localhost:5173',
      })
      await created.app.ready()

      const legacyColumns = await created.db.query<{ column_name: string }>(
        `SELECT column_name
         FROM information_schema.columns
         WHERE table_schema = current_schema()
           AND table_name = 'reflection_answers'
           AND column_name IN ('module_slug', 'unit_slug', 'module_title', 'unit_title')
         ORDER BY column_name`,
      )
      expect(legacyColumns.rows).toEqual([])

      const registerResponse = await created.app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          login: 'legacy-reflection-user',
          password: 'secure-passphrase',
        },
      })
      const cookie = sessionCookie(registerResponse)

      const saveResponse = await created.app.inject({
        method: 'PUT',
        url: '/api/reflections/card_l1s1l1_04_expense_diary',
        headers: { cookie },
        payload: {
          templateValues: ['Кофе 250, еда', 'Метро 70, транспорт', 'Кино 600, развлечения'],
        },
      })

      expect(saveResponse.statusCode).toBe(200)
      expect(saveResponse.json()).toMatchObject({
        answers: [
          expect.objectContaining({
            cardId: 'card_l1s1l1_04_expense_diary',
            levelSlug: 'level-1-start',
            sectionSlug: 'money-and-operations',
            levelTitle: 'Уровень 1 · Старт',
            sectionTitle: 'Раздел 1. Деньги и операции',
            cardType: 'artifact',
            answer: {
              templateValues: ['Кофе 250, еда', 'Метро 70, транспорт', 'Кино 600, развлечения'],
            },
          }),
        ],
      })
    } finally {
      if (created) {
        await created.app.close()
      } else {
        await dropTestSchema(databaseUrl, databaseSchema)
      }
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
        url: '/api/reflections/card_l1s1l1_03_sorting_choice',
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
        levels: expect.arrayContaining([
          expect.objectContaining({
            slug: 'level-1-start',
            title: 'Уровень 1 · Старт',
            sections: expect.arrayContaining([
              expect.objectContaining({
                slug: 'money-and-operations',
                title: 'Раздел 1. Деньги и операции',
              }),
              expect.objectContaining({
                slug: 'planning-and-management',
                title: 'Раздел 2. Планирование и управление',
              }),
              expect.objectContaining({
                slug: 'risk-and-return',
                title: 'Раздел 3. Риск и доходность',
              }),
              expect.objectContaining({
                slug: 'financial-environment',
                title: 'Раздел 4. Финансовая среда',
              }),
            ]),
          }),
        ]),
      })

      const targetLevelResponse = await app.inject('/api/levels/level-1-start')
      const targetSectionResponse = await app.inject('/api/sections/money-and-operations')
      const planningSectionResponse = await app.inject('/api/sections/planning-and-management')
      const riskSectionResponse = await app.inject('/api/sections/risk-and-return')
      const financialEnvironmentSectionResponse = await app.inject('/api/sections/financial-environment')
      const lessonResponse = await app.inject('/api/lessons/where-money-goes')
      const mandatoryLessonResponse = await app.inject('/api/lessons/mandatory-and-desired')
      const safePaymentLessonResponse = await app.inject('/api/lessons/safe-payment')
      const digitalFootprintLessonResponse = await app.inject('/api/lessons/digital-footprint-and-protection')
      const whyReserveLessonResponse = await app.inject('/api/lessons/why-reserve-matters')
      const reserveTargetLessonResponse = await app.inject('/api/lessons/reserve-target-amount')
      const payYourselfLessonResponse = await app.inject('/api/lessons/pay-yourself-first')
      const budgetDraftLessonResponse = await app.inject('/api/lessons/budget-draft')
      const riskRedFlagLessonResponse = await app.inject('/api/lessons/thirty-percent-without-risk-red-flag')
      const whereToFindCurrentDataLessonResponse = await app.inject('/api/lessons/where-to-find-current-data')
      const targetSectionLessons = targetSectionResponse.json().section.lessons.map((lesson: { slug: string }) => lesson.slug)
      const planningSectionLessons = planningSectionResponse.json().section.lessons.map((lesson: { slug: string }) => lesson.slug)
      const riskSectionLessons = riskSectionResponse.json().section.lessons.map((lesson: { slug: string }) => lesson.slug)
      const financialEnvironmentSectionLessons = financialEnvironmentSectionResponse
        .json()
        .section.lessons.map((lesson: { slug: string }) => lesson.slug)

      expect(targetLevelResponse.statusCode).toBe(200)
      expect(targetLevelResponse.json()).toMatchObject({
        slug: 'level-1-start',
        sections: expect.arrayContaining([
          expect.objectContaining({
            slug: 'money-and-operations',
          }),
          expect.objectContaining({
            slug: 'planning-and-management',
          }),
          expect.objectContaining({
            slug: 'risk-and-return',
          }),
          expect.objectContaining({
            slug: 'financial-environment',
          }),
        ]),
      })
      expect(targetSectionResponse.statusCode).toBe(200)
      expect(targetSectionLessons).toEqual([
        'where-money-goes',
        'mandatory-and-desired',
        'safe-payment',
        'digital-footprint-and-protection',
      ])
      expect(planningSectionResponse.statusCode).toBe(200)
      expect(planningSectionLessons).toEqual([
        'why-reserve-matters',
        'reserve-target-amount',
        'pay-yourself-first',
        'budget-draft',
      ])
      expect(riskSectionResponse.statusCode).toBe(200)
      expect(riskSectionLessons).toEqual([
        'thirty-percent-without-risk-red-flag',
        'risk-and-return-are-linked',
        'money-soon-not-in-risk',
        'what-is-inflation',
      ])
      expect(financialEnvironmentSectionResponse.statusCode).toBe(200)
      expect(financialEnvironmentSectionLessons).toEqual([
        'bank-client-rights',
        'reading-key-terms',
        'credit-by-psk',
        'where-to-find-current-data',
      ])
      expect(lessonResponse.statusCode).toBe(200)
      expect(lessonResponse.json()).toMatchObject({
        level: expect.objectContaining({ slug: 'level-1-start' }),
        section: expect.objectContaining({ slug: 'money-and-operations' }),
        lesson: expect.objectContaining({
          slug: 'where-money-goes',
          title: 'Куда уходят деньги',
          cards: [
            expect.objectContaining({ id: 'card_l1s1l1_01_hook', type: 'single_choice' }),
            expect.objectContaining({ id: 'card_l1s1l1_02_theory_leaks', type: 'theory' }),
            expect.objectContaining({ id: 'card_l1s1l1_03_sorting_choice', type: 'categorization' }),
            expect.objectContaining({ id: 'card_l1s1l1_04_subscription_example', type: 'scenario' }),
            expect.objectContaining({ id: 'card_l1s1l1_04_expense_diary', type: 'artifact' }),
            expect.objectContaining({ id: 'card_l1s1l1_05_surprise_reflection', type: 'reflection' }),
            expect.objectContaining({ id: 'card_l1s1l1_06_micro_rule', type: 'artifact' }),
            expect.objectContaining({ id: 'card_l1s1l1_07_navigator_summary', type: 'summary' }),
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
            expect.objectContaining({ id: 'card_l1s1l2_03_sorting_choice', type: 'categorization' }),
          ]),
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'safe-payment' }),
        }),
      })
      expect(safePaymentLessonResponse.statusCode).toBe(200)
      expect(safePaymentLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'mandatory-and-desired' }),
        }),
        lesson: expect.objectContaining({
          slug: 'safe-payment',
          title: 'Безопасный платёж',
          cards: expect.arrayContaining([
            expect.objectContaining({ id: 'card_l1s1l3_03_practice', type: 'categorization' }),
            expect.objectContaining({ id: 'card_l1s1l3_04_real_world', type: 'scenario' }),
          ]),
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'digital-footprint-and-protection' }),
        }),
      })
      expect(digitalFootprintLessonResponse.statusCode).toBe(200)
      expect(digitalFootprintLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'safe-payment' }),
        }),
        lesson: expect.objectContaining({
          slug: 'digital-footprint-and-protection',
          title: 'Цифровой след и защита',
          cards: expect.arrayContaining([
            expect.objectContaining({ id: 'card_l1s1l4_03_practice', type: 'categorization' }),
            expect.objectContaining({ id: 'card_l1s1l4_04_real_world', type: 'scenario' }),
          ]),
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'why-reserve-matters' }),
        }),
      })
      expect(whyReserveLessonResponse.statusCode).toBe(200)
      expect(whyReserveLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'digital-footprint-and-protection' }),
        }),
        lesson: expect.objectContaining({
          slug: 'why-reserve-matters',
          title: 'Зачем нужна подушка',
          cards: expect.arrayContaining([
            expect.objectContaining({ id: 'card_l1s2l1_03_practice', type: 'categorization' }),
            expect.objectContaining({ id: 'card_l1s2l1_04_real_world', type: 'scenario' }),
          ]),
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'reserve-target-amount' }),
        }),
      })
      expect(reserveTargetLessonResponse.statusCode).toBe(200)
      expect(reserveTargetLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'why-reserve-matters' }),
        }),
        lesson: expect.objectContaining({
          slug: 'reserve-target-amount',
          title: 'Сколько держать в резерве',
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'pay-yourself-first' }),
        }),
      })
      expect(payYourselfLessonResponse.statusCode).toBe(200)
      expect(payYourselfLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'reserve-target-amount' }),
        }),
        lesson: expect.objectContaining({
          slug: 'pay-yourself-first',
          title: 'Правило «сначала себе»',
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'budget-draft' }),
        }),
      })
      expect(budgetDraftLessonResponse.statusCode).toBe(200)
      expect(budgetDraftLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'pay-yourself-first' }),
        }),
        lesson: expect.objectContaining({
          slug: 'budget-draft',
          title: 'Бюджет-черновик',
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'thirty-percent-without-risk-red-flag' }),
        }),
      })
      expect(riskRedFlagLessonResponse.statusCode).toBe(200)
      expect(riskRedFlagLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'budget-draft' }),
        }),
        lesson: expect.objectContaining({
          slug: 'thirty-percent-without-risk-red-flag',
          title: '«30% без риска» — красный флаг',
        }),
        next: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'risk-and-return-are-linked' }),
        }),
      })
      expect(whereToFindCurrentDataLessonResponse.statusCode).toBe(200)
      expect(whereToFindCurrentDataLessonResponse.json()).toMatchObject({
        previous: expect.objectContaining({
          lesson: expect.objectContaining({ slug: 'credit-by-psk' }),
        }),
        lesson: expect.objectContaining({
          slug: 'where-to-find-current-data',
          title: 'Где брать актуальные данные',
        }),
        next: null,
      })

      const removedLevelResponse = await app.inject('/api/levels/financial-goals')
      const removedSectionResponse = await app.inject('/api/sections/values-and-goals')
      const removedFutureSectionResponse = await app.inject('/api/sections/future-vision')
      const removedEmergencyFundLessonResponse = await app.inject('/api/lessons/why-emergency-fund')
      const removedReserveLessonResponse = await app.inject('/api/lessons/reserve-amount')
      const removedLessonResponse = await app.inject('/api/lessons/why-values-matter')
      const removedFinalLessonResponse = await app.inject('/api/lessons/goal-levels')

      expect(removedLevelResponse.statusCode).toBe(404)
      expect(removedSectionResponse.statusCode).toBe(404)
      expect(removedFutureSectionResponse.statusCode).toBe(404)
      expect(removedEmergencyFundLessonResponse.statusCode).toBe(404)
      expect(removedReserveLessonResponse.statusCode).toBe(404)
      expect(removedLessonResponse.statusCode).toBe(404)
      expect(removedFinalLessonResponse.statusCode).toBe(404)
    } finally {
      await app.close()
    }
  })
})
