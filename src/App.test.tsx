import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, vi } from 'vitest'

import type { ApiUser, ProgressResponse } from '@/api/client'
import { parsedProgram } from '@/content/loadProgram'
import { getAllLessons, getOrderedModules, getOrderedUnits } from '@/content/program'

import App from './App'

const program = parsedProgram.success ? parsedProgram.data : null
const emptyProgress: ProgressResponse = {
  lessons: [],
  cards: [],
}

type ApiResponseOptions = {
  currentUser?: ApiUser | null
  progress?: ProgressResponse
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

function apiResponse(url: string, options: ApiResponseOptions, init: RequestInit = {}) {
  if (!program) {
    return jsonResponse({ error: { code: 'content_error', message: 'Program content is invalid' } }, 500)
  }

  const path = new URL(url, 'http://localhost').pathname
  const method = init.method?.toUpperCase() ?? 'GET'

  if (path === '/api/auth/me') {
    if (options.currentUser) {
      return jsonResponse({ user: options.currentUser })
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (path === '/api/progress') {
    if (options.currentUser) {
      return jsonResponse(options.progress ?? emptyProgress)
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (method === 'PUT' && (path.startsWith('/api/progress/lessons/') || path.startsWith('/api/progress/cards/'))) {
    if (options.currentUser) {
      return jsonResponse(options.progress ?? emptyProgress)
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (path === '/api/program') {
    return jsonResponse(program)
  }

  if (path.startsWith('/api/modules/')) {
    const moduleSlug = decodeURIComponent(path.replace('/api/modules/', ''))
    const module = getOrderedModules(program).find((candidate) => candidate.slug === moduleSlug)
    return module ? jsonResponse(module) : jsonResponse({ error: { code: 'not_found', message: 'Module not found' } }, 404)
  }

  if (path.startsWith('/api/units/')) {
    const unitSlug = decodeURIComponent(path.replace('/api/units/', ''))
    for (const module of getOrderedModules(program)) {
      const unit = getOrderedUnits(module).find((candidate) => candidate.slug === unitSlug)
      if (unit) return jsonResponse({ module, unit })
    }
    return jsonResponse({ error: { code: 'not_found', message: 'Unit not found' } }, 404)
  }

  if (path.startsWith('/api/lessons/')) {
    const lessonSlug = decodeURIComponent(path.replace('/api/lessons/', ''))
    const lessons = getAllLessons(program)
    const lessonIndex = lessons.findIndex((candidate) => candidate.lesson.slug === lessonSlug)
    if (lessonIndex >= 0) {
      return jsonResponse({
        ...lessons[lessonIndex],
        previous: lessonIndex > 0 ? lessons[lessonIndex - 1] : null,
        next: lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null,
      })
    }
    return jsonResponse({ error: { code: 'not_found', message: 'Lesson not found' } }, 404)
  }

  return jsonResponse({ error: { code: 'not_found', message: 'Route not found' } }, 404)
}

describe('App', () => {
  let apiOptions: ApiResponseOptions

  beforeEach(() => {
    apiOptions = {}
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => apiResponse(String(input), apiOptions, init)))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the login and registration entry screen by default', async () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Войдите в FinPulse' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Регистрация' })).toBeTruthy()
  })

  it('renders the welcome entry screen for an existing session', async () => {
    apiOptions.currentUser = { id: 'user-1', login: 'learner' }
    apiOptions.progress = emptyProgress
    window.history.pushState({}, '', '/')

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    expect(await screen.findByRole('heading', { name: 'С возвращением, learner' })).toBeTruthy()
    expect((await screen.findByRole('link', { name: /Продолжить/i })).getAttribute('href')).toBe(
      '/lessons/why-values-matter',
    )
    expect(await screen.findByText(/0 из \d+ уроков/)).toBeTruthy()
  })

  it('renders the real program overview', async () => {
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Финансовые цели' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Далее' }).getAttribute('href')).toBe('/modules/financial-goals')
  })

  it('opens lesson details from the module lesson path before navigation', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Ваши базовые ценности' })).length).toBeGreaterThan(0)
    await user.click(await screen.findByRole('button', { name: /Зачем финансовым целям нужны ценности/i }))

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByText(/Финансовая цель — это жизненная цель/i)).toBeTruthy()
    expect(screen.getByRole('link', { name: /Продолжить урок/i }).getAttribute('href')).toBe('/lessons/why-values-matter')
  })

  it('renders a lesson with cards', async () => {
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByText(/Два человека хотят/i)).toBeTruthy()
  })

  it('saves initial lesson and active card progress once for an authenticated lesson reader', async () => {
    apiOptions.currentUser = { id: 'user-1', login: 'learner' }
    apiOptions.progress = emptyProgress
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()

    await waitFor(() => {
      expect(getProgressWriteCount('/api/progress/lessons/why-values-matter')).toBe(1)
      expect(getProgressWriteCount('/api/progress/cards/card_01_01_scenario_apartment')).toBe(1)
    })
    await new Promise((resolve) => setTimeout(resolve, 25))

    expect(getProgressWriteCount('/api/progress/lessons/why-values-matter')).toBe(1)
    expect(getProgressWriteCount('/api/progress/cards/card_01_01_scenario_apartment')).toBe(1)
  })

  it('renders checklist cards in the reader flow', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/lessons/practice-1m')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Практика 1M$' })).toBeTruthy()
    for (let index = 0; index < 5; index += 1) {
      await user.click(screen.getByRole('button', { name: 'Далее' }))
    }

    expect(screen.getByRole('heading', { name: 'Красные флаги цели' })).toBeTruthy()
    expect(screen.getByText(/Хочу много денег/)).toBeTruthy()
  })
})

function getProgressWriteCount(path: string) {
  return vi
    .mocked(fetch)
    .mock.calls.filter(([input, init]) => {
      const requestPath = new URL(String(input), 'http://localhost').pathname
      return requestPath === path && init?.method === 'PUT'
    }).length
}
