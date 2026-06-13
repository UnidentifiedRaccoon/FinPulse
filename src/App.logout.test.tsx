import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApiUser, ProgressResponse } from '@/api/client'
import { parsedProgram } from '@/test/loadProgram'

import App from './App'

const program = parsedProgram.success ? parsedProgram.data : null
const savedProgress: ProgressResponse = {
  lessons: [
    {
      lessonSlug: 'where-money-goes',
      viewed: true,
      completed: true,
      viewedAt: '2026-05-30T00:00:00.000Z',
      completedAt: '2026-05-30T00:00:00.000Z',
      updatedAt: '2026-05-30T00:00:00.000Z',
    },
  ],
  cards: [],
}

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  )
}

function emptyResponse(status = 204) {
  return Promise.resolve(new Response(null, { status }))
}

describe('App logout flow', () => {
  let currentUser: ApiUser | null

  beforeEach(() => {
    currentUser = { id: 'user-1', login: 'learner', createdAt: '2026-05-30T08:15:00.000Z' }
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        if (!program) {
          return jsonResponse({ error: { code: 'content_error', message: 'Program content is invalid' } }, 500)
        }

        const path = new URL(String(input), 'http://localhost').pathname
        const method = init?.method?.toUpperCase() ?? 'GET'

        if (path === '/api/auth/me') {
          return currentUser
            ? jsonResponse({ user: currentUser })
            : jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
        }

        if (path === '/api/progress') {
          return currentUser
            ? jsonResponse(savedProgress)
            : jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
        }

        if (path === '/api/auth/logout' && method === 'POST') {
          currentUser = null
          return emptyResponse()
        }

        if (path === '/api/program') {
          return jsonResponse(program)
        }

        return jsonResponse({ error: { code: 'not_found', message: 'Route not found' } }, 404)
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns an authenticated learner to the login screen after logout from another route', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
    })
    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    expect(screen.queryByText('learner')).toBeNull()
    expect(fetch).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }))
  })
})
