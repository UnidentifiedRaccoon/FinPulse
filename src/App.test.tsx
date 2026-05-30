import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, vi } from 'vitest'

import { parsedProgram } from '@/content/loadProgram'
import { getAllLessons, getOrderedModules, getOrderedUnits } from '@/content/program'

import App from './App'

const program = parsedProgram.success ? parsedProgram.data : null

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

function apiResponse(url: string) {
  if (!program) {
    return jsonResponse({ error: { code: 'content_error', message: 'Program content is invalid' } }, 500)
  }

  const path = new URL(url, 'http://localhost').pathname

  if (path === '/api/auth/me') {
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
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => apiResponse(String(input))))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the real program overview', async () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Финансовые цели' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Зачем финансовым целям нужны ценности/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Продолжить' })).toBeTruthy()
  })

  it('renders the module lesson path', async () => {
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Финансовые цели' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Ваши базовые ценности' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Зачем финансовым целям нужны ценности/i })).toBeTruthy()
  })

  it('renders a lesson with cards', async () => {
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByText(/Два человека хотят/i)).toBeTruthy()
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
