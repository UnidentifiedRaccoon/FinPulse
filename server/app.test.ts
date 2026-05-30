// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { createApp } from './app'
import { verifyPassword } from './lib/password'

async function setupTestApp() {
  const created = await createApp({
    dbPath: ':memory:',
    cookieSecure: false,
    corsOrigin: 'http://localhost:5173',
  })
  await created.app.ready()

  return created
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
  it('allows local loopback CORS origins by default', async () => {
    const { app } = await createApp({
      dbPath: ':memory:',
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
        url: '/api/progress/lessons/why-values-matter',
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
        },
      })

      const row = db
        .prepare('SELECT login, password_hash FROM users WHERE login = ?')
        .get('learner.one') as { login: string; password_hash: string }
      expect(row.password_hash).not.toBe('secure-passphrase')
      await expect(verifyPassword('secure-passphrase', row.password_hash)).resolves.toBe(true)

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
        url: '/api/progress/lessons/why-values-matter',
        headers: { cookie: firstCookie },
        payload: { completed: true },
      })
      expect(lessonProgress.statusCode).toBe(200)
      expect(lessonProgress.json().lessons).toEqual([
        expect.objectContaining({
          lessonSlug: 'why-values-matter',
          viewed: true,
          completed: true,
        }),
      ])

      const cardProgress = await app.inject({
        method: 'PUT',
        url: '/api/progress/cards/card_01_04_goal_choice',
        headers: { cookie: firstCookie },
        payload: { viewed: true },
      })
      expect(cardProgress.statusCode).toBe(200)
      expect(cardProgress.json().cards).toEqual([
        expect.objectContaining({
          cardId: 'card_01_04_goal_choice',
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

  it('serves validated content through the API shape expected by the frontend', async () => {
    const { app } = await setupTestApp()

    try {
      const programResponse = await app.inject('/api/program')
      expect(programResponse.statusCode).toBe(200)
      expect(programResponse.json()).toMatchObject({
        slug: 'finpulse-learning-mvp',
        modules: expect.arrayContaining([
          expect.objectContaining({
            slug: 'financial-goals',
            units: expect.arrayContaining([
              expect.objectContaining({
                slug: 'values-and-goals',
              }),
              expect.objectContaining({
                slug: 'impulsive-purchases',
              }),
            ]),
          }),
        ]),
      })

      const lessonResponse = await app.inject('/api/lessons/why-values-matter')
      expect(lessonResponse.statusCode).toBe(200)
      expect(lessonResponse.json()).toMatchObject({
        module: expect.objectContaining({ slug: 'financial-goals' }),
        unit: expect.objectContaining({ slug: 'values-and-goals' }),
        lesson: expect.objectContaining({
          slug: 'why-values-matter',
          cards: expect.arrayContaining([
            expect.objectContaining({
              id: 'card_01_04_goal_choice',
            }),
          ]),
        }),
      })

      const newLessonResponse = await app.inject('/api/lessons/pause-before-purchase')
      expect(newLessonResponse.statusCode).toBe(200)
      expect(newLessonResponse.json()).toMatchObject({
        module: expect.objectContaining({ slug: 'financial-goals' }),
        unit: expect.objectContaining({ slug: 'impulsive-purchases' }),
        lesson: expect.objectContaining({
          slug: 'pause-before-purchase',
          cards: expect.arrayContaining([
            expect.objectContaining({
              id: 'card_09_01_scenario_discount',
            }),
            expect.objectContaining({
              id: 'card_09_07_summary_pause',
            }),
          ]),
        }),
      })
    } finally {
      await app.close()
    }
  })
})
