import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, vi } from 'vitest'

import type { ApiUser, ProgressResponse, ReflectionAnswersResponse } from '@/api/client'
import { parsedProgram } from '@/content/loadProgram'
import { getAllLessons, getOrderedModules, getOrderedUnits } from '@/content/program'

import App from './App'

const program = parsedProgram.success ? parsedProgram.data : null
const emptyProgress: ProgressResponse = {
  lessons: [],
  cards: [],
}
const emptyReflectionAnswers: ReflectionAnswersResponse = {
  answers: [],
}
const learnerUser: ApiUser = {
  id: 'user-1',
  login: 'learner@example.com',
  createdAt: '2026-05-30T08:15:00.000Z',
}

type ApiResponseOptions = {
  currentUser?: ApiUser | null
  progress?: ProgressResponse
  reflectionAnswers?: ReflectionAnswersResponse
  loginNonJsonError?: boolean
  programHasNoModules?: boolean
  progressCompletedFailure?: { status: number; message: string }
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

  if (path === '/api/auth/login' && method === 'POST') {
    if (options.loginNonJsonError) {
      return Promise.resolve(
        new Response('Temporary upstream failure', {
          status: 502,
          headers: {
            'Content-Type': 'text/plain',
          },
        }),
      )
    }

    return jsonResponse({ user: options.currentUser ?? learnerUser })
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    options.currentUser = null
    options.progress = emptyProgress
    options.reflectionAnswers = emptyReflectionAnswers
    return Promise.resolve(new Response(null, { status: 204 }))
  }

  if (path === '/api/progress') {
    if (options.currentUser) {
      return jsonResponse(options.progress ?? emptyProgress)
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (method === 'PUT' && (path.startsWith('/api/progress/lessons/') || path.startsWith('/api/progress/cards/'))) {
    if (options.currentUser) {
      if (options.progressCompletedFailure && parseRequestBody(init).completed === true) {
        return jsonResponse(
          { error: { code: 'progress_save_failed', message: options.progressCompletedFailure.message } },
          options.progressCompletedFailure.status,
        )
      }

      return jsonResponse(options.progress ?? emptyProgress)
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (path === '/api/reflections') {
    if (options.currentUser) {
      return jsonResponse(options.reflectionAnswers ?? emptyReflectionAnswers)
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (method === 'PUT' && path.startsWith('/api/reflections/')) {
    if (options.currentUser) {
      return jsonResponse(options.reflectionAnswers ?? emptyReflectionAnswers)
    }

    return jsonResponse({ error: { code: 'unauthenticated', message: 'Authentication is required' } }, 401)
  }

  if (path === '/api/program') {
    if (options.programHasNoModules) {
      return jsonResponse({ ...program, modules: [] })
    }

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

function setAuthenticatedLearner(options: ApiResponseOptions) {
  options.currentUser = learnerUser
  options.progress = emptyProgress
  options.reflectionAnswers = emptyReflectionAnswers
}

describe('App', () => {
  let apiOptions: ApiResponseOptions

  beforeEach(() => {
    apiOptions = {}
    window.sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => apiResponse(String(input), apiOptions, init)))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the login and registration entry screen by default', async () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Войдите в FinPulse' })).toBeTruthy()
    expect(getRequestCount('/api/reflections')).toBe(0)
    expect(screen.getByRole('button', { name: 'Войти' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Регистрация' })).toBeTruthy()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Обучение' })).toBeNull()
  })

  it('keeps anonymous deep links on the login form without app navigation', async () => {
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Войдите в FinPulse' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Модули' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
  })

  it('opens the program tab for an existing session at the root route', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/')

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()
    await waitFor(() => {
      expect(window.location.pathname).toBe('/program')
    })
    expect(screen.queryByText(/С возвращением/i)).toBeNull()
  })

  it('renders a profile screen with identity and learning stats', async () => {
    setAuthenticatedLearner(apiOptions)
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_02_05_reflection_values',
          cardType: 'reflection',
          saveKey: 'primary_values',
          lessonSlug: 'what-are-values',
          lessonTitle: 'Что такое ценности',
          unitSlug: 'values-and-goals',
          unitTitle: '01.01 Ваши базовые ценности',
          moduleSlug: 'financial-goals',
          moduleTitle: 'Финансовые цели',
          cardTitle: 'Первичный список ценностей',
          prompt: 'Какие ценности чаще всего стоят за твоими денежными решениями?',
          template: null,
          answer: {
            multiValues: ['свобода', 'семья'],
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    apiOptions.progress = {
      lessons: [
        {
          lessonSlug: 'why-values-matter',
          viewed: true,
          completed: true,
          viewedAt: '2026-05-30T08:20:00.000Z',
          completedAt: '2026-05-30T08:30:00.000Z',
          updatedAt: '2026-05-30T08:30:00.000Z',
        },
        {
          lessonSlug: 'what-are-values',
          viewed: true,
          completed: false,
          viewedAt: '2026-05-30T08:40:00.000Z',
          completedAt: null,
          updatedAt: '2026-05-30T08:40:00.000Z',
        },
      ],
      cards: [
        {
          cardId: 'card_01_01_scenario_apartment',
          viewed: true,
          completed: true,
          viewedAt: '2026-05-30T08:20:00.000Z',
          completedAt: '2026-05-30T08:30:00.000Z',
          updatedAt: '2026-05-30T08:30:00.000Z',
        },
      ],
    }
    window.history.pushState({}, '', '/profile')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Профиль' })).toBeTruthy()
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0)
    expect(screen.getByText('30 мая 2026')).toBeTruthy()
    expect(screen.getByText('user-1')).toBeTruthy()
    const answersSection = screen.getByRole('region', { name: 'Мой финансовый ориентир' })
    expect(within(answersSection).getByText('Мои ответы')).toBeTruthy()
    expect(within(answersSection).getByRole('heading', { name: 'Ценности' })).toBeTruthy()
    expect(within(answersSection).getByRole('heading', { name: 'Первичный список ценностей' })).toBeTruthy()
    expect(within(answersSection).getByText('свобода')).toBeTruthy()
    expect(within(answersSection).getByText('семья')).toBeTruthy()
    const progressSection = screen.getByRole('region', { name: 'Учебный прогресс' })
    expect(within(progressSection).getByRole('heading', { name: 'Учебный прогресс' })).toBeTruthy()
    expect(within(progressSection).getByText('Пройдено уроков')).toBeTruthy()
    expect(await within(progressSection).findByText('1/15')).toBeTruthy()
    expect(within(progressSection).getByText('Просмотрено уроков')).toBeTruthy()
    expect(within(progressSection).getByText('2')).toBeTruthy()
    expect(within(progressSection).getByText('Карточек завершено')).toBeTruthy()
    expect(within(screen.getByRole('main')).getByRole('button', { name: 'Выйти' })).toBeTruthy()
  })

  it('renders the real program overview', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Финансовые цели' })).toBeTruthy()
    expect(screen.queryByText('Ваш прогресс')).toBeNull()
    expect(screen.getByRole('progressbar', { name: /модуля завершено/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Далее' }).getAttribute('href')).toBe('/modules/financial-goals')
  })

  it('does not restore private profile state when navigating back after logout', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_02_05_reflection_values',
          cardType: 'reflection',
          saveKey: 'primary_values',
          lessonSlug: 'what-are-values',
          lessonTitle: 'Что такое ценности',
          unitSlug: 'values-and-goals',
          unitTitle: '01.01 Ваши базовые ценности',
          moduleSlug: 'financial-goals',
          moduleTitle: 'Финансовые цели',
          cardTitle: 'Первичный список ценностей',
          prompt: 'Какие ценности чаще всего стоят за твоими денежными решениями?',
          template: null,
          answer: {
            multiValues: ['свобода'],
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    window.history.pushState({}, '', '/profile')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Профиль' })).toBeTruthy()
    expect(screen.getByText('свобода')).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    await user.click(within(sidebar).getByRole('link', { name: 'Обучение' }))
    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(await screen.findByRole('heading', { name: 'Войдите в FinPulse' })).toBeTruthy()
    expect(screen.queryByText('свобода')).toBeNull()

    window.history.pushState({}, '', '/profile')
    fireEvent.popState(window)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Войдите в FinPulse' })).toBeTruthy()
    })
    expect(screen.queryByText('свобода')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
  })

  it('shows a program empty state when no modules are available', async () => {
    setAuthenticatedLearner(apiOptions)
    apiOptions.programHasNoModules = true
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()
    expect(screen.getByText('Материалы программы пока не добавлены.')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Далее' })).toBeNull()
  })

  it('shows a generic readable auth error for non-json login failures', async () => {
    const user = userEvent.setup()
    apiOptions.loginNonJsonError = true
    window.history.pushState({}, '', '/')

    render(<App />)

    await user.type(await screen.findByLabelText('Email или логин'), 'learner@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'Passw0rd!')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Не удалось выполнить запрос.')).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Модули' })).toBeNull()
  })

  it('renders the desktop sidebar and mobile bottom navigation', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    const bottomNavigation = screen.getByRole('navigation', { name: 'Нижнее меню приложения' })
    const sidebarLearningLink = within(sidebar).getByRole('link', { name: 'Обучение' })

    expect(sidebarLearningLink.getAttribute('href')).toBe('/program')
    expect(sidebarLearningLink.getAttribute('aria-current')).toBe('page')
    expect(within(sidebar).getByRole('link', { name: 'Профиль' }).getAttribute('href')).toBe('/profile')
    expect(within(sidebar).queryByRole('link', { name: 'Аккаунт' })).toBeNull()
    expect(within(bottomNavigation).getByRole('link', { name: 'Обучение' }).getAttribute('href')).toBe('/program')
    expect(within(bottomNavigation).getByRole('link', { name: 'Профиль' }).getAttribute('href')).toBe('/profile')
  })

  it('separates authenticated account and logout controls in desktop while keeping mobile nav focused', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Модули' })).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    const bottomNavigation = screen.getByRole('navigation', { name: 'Нижнее меню приложения' })

    expect(within(sidebar).getByRole('link', { name: 'Профиль' }).getAttribute('href')).toBe('/profile')
    expect(within(bottomNavigation).getByRole('link', { name: 'Профиль' }).getAttribute('href')).toBe('/profile')
    expect(within(bottomNavigation).queryByRole('button', { name: 'Выйти' })).toBeNull()
    expect(screen.getAllByRole('button', { name: 'Выйти' }).length).toBe(1)
  })

  it('opens lesson details from the module lesson path before navigation', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
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
    setAuthenticatedLearner(apiOptions)
    apiOptions.progress = {
      lessons: [
        {
          lessonSlug: 'why-values-matter',
          viewed: true,
          completed: true,
          viewedAt: '2026-05-30T08:20:00.000Z',
          completedAt: '2026-05-30T08:30:00.000Z',
          updatedAt: '2026-05-30T08:30:00.000Z',
        },
      ],
      cards: [],
    }
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
    expect(within(lessonPath).queryByText(/^Раздел$/)).toBeNull()
    expect(within(lessonPath).queryByText(/Раздел \d/)).toBeNull()
    expect(within(lessonPath).queryByText('Пройден')).toBeNull()
    expect(within(lessonPath).queryByText('Сейчас')).toBeNull()
    expect(within(lessonPath).getAllByText('Начать')).toHaveLength(1)
    const startBadge = within(lessonPath).getByText('Начать')
    const startBadgeClassName = startBadge.className
    expect(startBadge.parentElement?.className).toContain('top-2')
    expect(startBadge.parentElement?.className).toContain('-translate-x-1/2')
    expect(startBadgeClassName).toContain('animate-[fr-start-badge-pulse_')
    expect(startBadgeClassName).toContain('motion-reduce:animate-none')
    expect(startBadgeClassName).not.toContain('animate-pulse')
    const currentLessonButton = within(lessonPath).getByRole('button', { name: /Текущий урок/ })
    const currentLessonCircle = currentLessonButton.querySelector('span.relative.flex')
    expect(currentLessonCircle?.className).toContain('group-hover:translate-y-[4px]')
    expect(currentLessonCircle?.className).not.toContain('group-hover:-translate-y-1')
    const lockedLessonButtons = within(lessonPath).getAllByRole('button', { name: /Недоступный урок/ })
    expect(lockedLessonButtons.length).toBeGreaterThan(0)
    expect(lockedLessonButtons[0]).toBeEnabled()
    expect(lockedLessonButtons[0].getAttribute('aria-disabled')).toBeNull()
    expect(lockedLessonButtons[0].className).not.toContain('cursor-not-allowed')
    expect(lockedLessonButtons[0].className).toContain('cursor-pointer')
    const lockedLessonCircle = lockedLessonButtons[0].querySelector('span.relative.flex')
    expect(lockedLessonCircle?.className).toContain('bg-[var(--fr-border-default)]')
    expect(lockedLessonCircle?.className).toContain('group-hover:translate-y-[4px]')
    expect(lockedLessonCircle?.className).toContain('group-active:translate-y-[6px]')
    expect(lockedLessonCircle?.textContent).toBe('3')
  })

  it('shows an unavailable plaque for locked future lessons', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    apiOptions.progress = {
      lessons: [
        {
          lessonSlug: 'why-values-matter',
          viewed: true,
          completed: true,
          viewedAt: '2026-05-30T08:20:00.000Z',
          completedAt: '2026-05-30T08:30:00.000Z',
          updatedAt: '2026-05-30T08:30:00.000Z',
        },
      ],
      cards: [],
    }
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы модуля' })
    await user.click(within(lessonPath).getAllByRole('button', { name: /Недоступный урок/ })[0])

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('Пройдите предыдущие уроки, чтобы открыть доступ.')).toBeTruthy()
    expect(within(dialog).getByRole('button', { name: 'Недоступно' })).toBeDisabled()
    expect(within(dialog).queryByRole('link')).toBeNull()
  })

  it('updates the module sticky header as the visible section changes on scroll', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/modules/financial-goals')

    render(<App />)

    await screen.findByRole('region', { name: 'Разделы модуля' })
    expect(await screen.findByRole('link', { name: 'Модуль 1 раздел 1' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: 'Ваши базовые ценности' })).toBeTruthy()

    mockPathSectionRect('unit_01_values_and_goals', -540)
    mockPathSectionRect('unit_02_future_vision', 120)
    mockPathSectionRect('unit_03_financial_goals', 560)
    mockPathSectionRect('unit_04_goal_motivation', 980)
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Модуль 1 раздел 2' })).toBeTruthy()
      expect(screen.getByRole('heading', { level: 1, name: 'Видение будущего' })).toBeTruthy()
    })
  })

  it('renders a lesson with cards', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByText(/Два человека хотят/i)).toBeTruthy()
  })

  it('does not write viewed progress for an invalid lesson slug', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/not-a-real-lesson')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Не удалось загрузить урок' })).toBeTruthy()
    await new Promise((resolve) => setTimeout(resolve, 25))

    expect(getProgressWriteCount('/api/progress/lessons/not-a-real-lesson')).toBe(0)
  })

  it('renders newly converted future vision and motivation content routes', async () => {
    setAuthenticatedLearner(apiOptions)
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
    apiOptions.currentUser = learnerUser
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

  it('saves an authenticated reflection answer before completing that card', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = emptyReflectionAnswers
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Потому что от неё зависит мотивация и выбор способа достижения' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('radio', { name: 'Хочу накопить 300 000 ₽ на обучение за 12 месяцев' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    const continueButton = screen.getByRole('button', { name: 'Далее' })
    expect(continueButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'образование' }))
    await user.click(continueButton)

    await waitFor(() => {
      expect(getRequestCount('/api/reflections/card_01_05_reflection_dream', 'PUT')).toBe(1)
      expect(getProgressCompletedWriteCount('/api/progress/cards/card_01_05_reflection_dream')).toBe(1)
    })
    expect(getJsonRequestBody('/api/reflections/card_01_05_reflection_dream', 'PUT')).toEqual({
      singleValue: 'образование',
    })
    expect(getRequestOrder('/api/reflections/card_01_05_reflection_dream', 'PUT')).toBeLessThan(
      getRequestOrder('/api/progress/cards/card_01_05_reflection_dream', 'PUT', (body) => body.completed === true),
    )
  })

  it('blocks card advancement when required progress completion save fails', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = emptyReflectionAnswers
    apiOptions.progressCompletedFailure = { status: 500, message: 'Progress save failed' }
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Одинаковая цель, разные причины' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Потому что от неё зависит мотивация и выбор способа достижения' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    await waitFor(() => {
      expect(screen.getAllByText('Progress save failed').length).toBeGreaterThan(0)
    })
    expect(screen.getByRole('heading', { name: 'Одинаковая цель, разные причины' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Видео: базовые ценности и финансовые цели' })).toBeNull()
    expect(getProgressCompletedWriteCount('/api/progress/cards/card_01_01_scenario_apartment')).toBe(1)
  })

  it('clears authenticated and private state when a required progress save returns 401', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_02_05_reflection_values',
          cardType: 'reflection',
          saveKey: 'primary_values',
          lessonSlug: 'what-are-values',
          lessonTitle: 'Что такое ценности',
          unitSlug: 'values-and-goals',
          unitTitle: '01.01 Ваши базовые ценности',
          moduleSlug: 'financial-goals',
          moduleTitle: 'Финансовые цели',
          cardTitle: 'Первичный список ценностей',
          prompt: 'Какие ценности чаще всего стоят за твоими денежными решениями?',
          template: null,
          answer: {
            multiValues: ['свобода'],
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    apiOptions.progressCompletedFailure = { status: 401, message: 'Authentication is required' }
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Зачем финансовым целям нужны ценности' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Потому что от неё зависит мотивация и выбор способа достижения' }))
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByRole('heading', { name: 'Войдите в FinPulse' })).toBeTruthy()
    expect(screen.queryByText('свобода')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
  })

  it('renders checklist cards in the reader flow', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
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
    expect(screen.getByRole('heading', { name: 'Таблица ценностей' })).toBeTruthy()
    await user.type(screen.getAllByRole('textbox')[0], 'Курс, который поддерживает развитие')
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

function getRequestCount(path: string, method = 'GET') {
  return vi
    .mocked(fetch)
    .mock.calls.filter(([input, init]) => {
      const requestPath = new URL(String(input), 'http://localhost').pathname
      const requestMethod = init?.method?.toUpperCase() ?? 'GET'
      return requestPath === path && requestMethod === method
    }).length
}

function getProgressCompletedWriteCount(path: string) {
  return vi
    .mocked(fetch)
    .mock.calls.filter(([input, init]) => {
      const requestPath = new URL(String(input), 'http://localhost').pathname
      const requestMethod = init?.method?.toUpperCase() ?? 'GET'
      return requestPath === path && requestMethod === 'PUT' && parseRequestBody(init).completed === true
    }).length
}

function getRequestOrder(path: string, method: string, bodyMatches?: (body: Record<string, unknown>) => boolean) {
  const mock = vi.mocked(fetch).mock
  const callIndex = mock.calls.findIndex(([input, init]) => {
    const requestPath = new URL(String(input), 'http://localhost').pathname
    const requestMethod = init?.method?.toUpperCase() ?? 'GET'
    return requestPath === path && requestMethod === method && (!bodyMatches || bodyMatches(parseRequestBody(init)))
  })

  if (callIndex < 0) {
    throw new Error(`Missing ${method} ${path}`)
  }

  return mock.invocationCallOrder[callIndex]
}

function getJsonRequestBody(path: string, method: string) {
  const call = vi.mocked(fetch).mock.calls.find(([input, init]) => {
    const requestPath = new URL(String(input), 'http://localhost').pathname
    const requestMethod = init?.method?.toUpperCase() ?? 'GET'
    return requestPath === path && requestMethod === method
  })

  if (!call) {
    throw new Error(`Missing ${method} ${path}`)
  }

  return JSON.parse(String(call[1]?.body))
}

function parseRequestBody(init: RequestInit | undefined): Record<string, unknown> {
  if (!init?.body) return {}
  return JSON.parse(String(init.body)) as Record<string, unknown>
}

function mockPathSectionRect(sectionId: string, top: number) {
  const element = document.getElementById(`path-section-${sectionId}`)
  if (!element) {
    throw new Error(`Missing path section: ${sectionId}`)
  }

  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(createDomRect(top, 360))
}

function createDomRect(top: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left: 0,
    right: 320,
    top,
    width: 320,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}
