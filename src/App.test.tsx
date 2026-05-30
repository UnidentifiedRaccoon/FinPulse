import { render, screen, waitFor, within } from '@testing-library/react'
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
    expect(within(screen.getByRole('main')).getByRole('button', { name: 'Выйти' })).toBeTruthy()
  })

  it('renders the real program overview', async () => {
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Финансовые цели' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Далее' }).getAttribute('href')).toBe('/modules/financial-goals')
  })

  it('renders the desktop sidebar and mobile bottom navigation', async () => {
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    const bottomNavigation = screen.getByRole('navigation', { name: 'Нижнее меню приложения' })
    const sidebarLearningLink = within(sidebar).getByRole('link', { name: 'Обучение' })

    expect(sidebarLearningLink.getAttribute('href')).toBe('/program')
    expect(sidebarLearningLink.getAttribute('aria-current')).toBe('page')
    expect(within(sidebar).getByRole('link', { name: 'Аккаунт' }).getAttribute('href')).toBe('/')
    expect(within(bottomNavigation).getByRole('link', { name: 'Обучение' }).getAttribute('href')).toBe('/program')
    expect(within(bottomNavigation).getByRole('link', { name: 'Войти' }).getAttribute('href')).toBe('/')
  })

  it('separates authenticated account and logout controls in desktop while keeping mobile nav focused', async () => {
    apiOptions.currentUser = { id: 'user-1', login: 'learner' }
    apiOptions.progress = emptyProgress
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    const bottomNavigation = screen.getByRole('navigation', { name: 'Нижнее меню приложения' })

    expect(within(sidebar).getByRole('link', { name: 'Аккаунт' }).getAttribute('href')).toBe('/')
    expect(within(bottomNavigation).getByRole('link', { name: 'Аккаунт' }).getAttribute('href')).toBe('/')
    expect(within(bottomNavigation).queryByRole('button', { name: 'Выйти' })).toBeNull()
    expect(screen.getAllByRole('button', { name: 'Выйти' }).length).toBe(1)
  })

  it('opens lesson details from the module lesson path before navigation', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Ваши базовые ценности' })).length).toBeGreaterThan(0)
    await user.click(await screen.findByRole('button', { name: /Зачем финансовым целям нужны ценности/i }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(within(dialog).getByText('4 мин')).toBeTruthy()
    expect(within(dialog).queryByText(/Финансовая цель — это жизненная цель/i)).toBeNull()
    expect(within(dialog).queryByText(/Отличать сумму или покупку/i)).toBeNull()
    expect(within(dialog).getByRole('link', { name: /Продолжить урок/i }).getAttribute('href')).toBe('/lessons/why-values-matter')
  })

  it('renders one visual section per Finzdorov unit in the module path', async () => {
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы модуля' })
    const sectionHeadings = within(lessonPath).getAllByRole('heading').map((heading) => heading.textContent)

    expect(sectionHeadings).toEqual([
      'Ваши базовые ценности',
      'Видение будущего',
      'Финансовые цели',
      'Мотивация достижения целей',
    ])
    expect(within(lessonPath).queryByText(/01\.0[1-4]/)).toBeNull()
    expect(within(lessonPath).queryByText(/Раздел \d/)).toBeNull()
  })

  it('renders a lesson with cards', async () => {
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByText(/Два человека хотят/i)).toBeTruthy()
  })

  it('renders newly converted future vision and motivation content routes', async () => {
    window.history.pushState({}, '', '/modules/financial-goals/units/future-vision')

    const { unmount } = render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Видение будущего' })).length).toBeGreaterThan(0)
    expect(await screen.findByRole('button', { name: /День из будущего/i })).toBeTruthy()

    unmount()
    window.history.pushState({}, '', '/lessons/goal-levels')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни большой цели' })).toBeTruthy()
    expect(screen.getByText(/Большую цель легче удерживать/i)).toBeTruthy()
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
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(await screen.findByRole('radio', { name: 'Безопасность и восстановление / радость' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(await screen.findByRole('button', { name: 'Далее' }))
    await user.click(
      await screen.findByRole('radio', {
        name: 'Давай разберёмся, что для нас важнее сейчас: отдых или чувство безопасности',
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(await screen.findByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

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
