import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, vi } from 'vitest'

import type { ApiUser, ProgressResponse, ReflectionAnswersResponse } from '@/api/client'
import { getAllLessons, getOrderedModules, getOrderedUnits } from '@/content/order'
import { parsedProgram } from '@/test/loadProgram'

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
  progressCompletedTransientFailures?: { remaining: number; status: number; message: string }
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
      if (
        options.progressCompletedTransientFailures &&
        options.progressCompletedTransientFailures.remaining > 0 &&
        parseRequestBody(init).completed === true
      ) {
        options.progressCompletedTransientFailures.remaining -= 1
        return jsonResponse(
          { error: { code: 'progress_save_failed', message: options.progressCompletedTransientFailures.message } },
          options.progressCompletedTransientFailures.status,
        )
      }

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

    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
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

    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Тиры' })).toBeNull()
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

    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()
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
          cardId: 'card_t1u1l1_05_surprise_reflection',
          cardType: 'reflection',
          saveKey: 'unexpected_expense',
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          unitSlug: 'money-and-operations',
          unitTitle: 'Юнит 1. Деньги и операции',
          moduleSlug: 't1-start',
          moduleTitle: 'T1 Старт',
          cardTitle: 'Что удивило?',
          prompt: 'Посмотри на свои три траты. Какая из них удивила тебя: оказалась больше, чем казалось, или просто была лишней?',
          template: null,
          answer: {
            singleValue: 'Кофе или перекусы — их оказалось больше, чем казалось',
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    apiOptions.progress = {
      lessons: [
        {
          lessonSlug: 'where-money-goes',
          viewed: true,
          completed: true,
          viewedAt: '2026-05-30T08:20:00.000Z',
          completedAt: '2026-05-30T08:30:00.000Z',
          updatedAt: '2026-05-30T08:30:00.000Z',
        },
      ],
      cards: [
        {
          cardId: 'card_t1u1l1_01_hook',
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
    const answersSection = screen.getByRole('region', { name: 'Персональный финансовый навигатор' })
    expect(within(answersSection).queryByText('Мои ответы')).toBeNull()
    expect(within(answersSection).getByRole('heading', { name: 'Что удивило?' })).toBeTruthy()
    expect(within(answersSection).getByText('Кофе или перекусы — их оказалось больше, чем казалось')).toBeTruthy()
    const progressSection = screen.getByRole('region', { name: 'Учебный прогресс' })
    expect(within(progressSection).getByRole('heading', { name: 'Учебный прогресс' })).toBeTruthy()
    expect(within(progressSection).getByText('Пройдено уроков')).toBeTruthy()
    expect(await within(progressSection).findByText('1/4')).toBeTruthy()
    expect(within(progressSection).getByText('Просмотрено уроков')).toBeTruthy()
    expect(within(progressSection).getAllByText('1').length).toBeGreaterThan(0)
    expect(within(progressSection).getByText('Карточек завершено')).toBeTruthy()
    expect(within(screen.getByRole('main')).getByRole('button', { name: 'Выйти' })).toBeTruthy()
  })

  it('renders the real program overview', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'T1 Старт' })).toBeTruthy()
    expect(screen.queryByText('Ваш прогресс')).toBeNull()
    expect(screen.getByRole('progressbar', { name: /тира завершено/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Далее' }).getAttribute('href')).toBe('/modules/t1-start')
  })

  it('redirects the removed lesson completion experiment page to the program', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/design/lesson-completion-variants')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Завершение урока' })).toBeNull()
  })

  it('does not restore private profile state when navigating back after logout', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_t1u1l1_05_surprise_reflection',
          cardType: 'reflection',
          saveKey: 'unexpected_expense',
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          unitSlug: 'money-and-operations',
          unitTitle: 'Юнит 1. Деньги и операции',
          moduleSlug: 't1-start',
          moduleTitle: 'T1 Старт',
          cardTitle: 'Что удивило?',
          prompt: 'Посмотри на свои три траты. Какая из них удивила тебя: оказалась больше, чем казалось, или просто была лишней?',
          template: null,
          answer: {
            singleValue: 'Кофе или перекусы — их оказалось больше, чем казалось',
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    window.history.pushState({}, '', '/profile')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Профиль' })).toBeTruthy()
    expect(screen.getByText('Кофе или перекусы — их оказалось больше, чем казалось')).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    await user.click(within(sidebar).getByRole('link', { name: 'Обучение' }))
    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    expect(screen.queryByText('Кофе или перекусы — их оказалось больше, чем казалось')).toBeNull()

    window.history.pushState({}, '', '/profile')
    fireEvent.popState(window)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    })
    expect(screen.queryByText('Кофе или перекусы — их оказалось больше, чем казалось')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
  })

  it('shows a program empty state when no modules are available', async () => {
    setAuthenticatedLearner(apiOptions)
    apiOptions.programHasNoModules = true
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()
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
    expect(screen.queryByRole('heading', { name: 'Тиры' })).toBeNull()
  })

  it('renders the desktop sidebar and mobile bottom navigation', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()

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

    expect(await screen.findByRole('heading', { name: 'Тиры' })).toBeTruthy()

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
    window.history.pushState({}, '', '/modules/t1-start')

    render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Юнит 1. Деньги и операции' })).length).toBeGreaterThan(0)
    await user.click(await screen.findByRole('button', { name: /Куда уходят деньги/i }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(within(dialog).getByText('5 мин')).toBeTruthy()
    expect(within(dialog).queryByText(/увидеть свои реальные траты/i)).toBeNull()
    expect(within(dialog).getByRole('link', { name: /Продолжить урок/i }).getAttribute('href')).toBe('/lessons/where-money-goes')
  })

  it('renders the added lesson nodes in source order', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/modules/t1-start')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы тира' })
    expect(within(lessonPath).getByRole('button', { name: /Куда уходят деньги/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Обязательное и желаемое/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Зачем нужна подушка/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Сколько держать в резерве/i })).toBeTruthy()
  })

  it('renders the target units as separate sections in the tier path', async () => {
    setAuthenticatedLearner(apiOptions)
    apiOptions.progress = {
      lessons: [
        {
          lessonSlug: 'where-money-goes',
          viewed: true,
          completed: true,
          viewedAt: '2026-05-30T08:20:00.000Z',
          completedAt: '2026-05-30T08:30:00.000Z',
          updatedAt: '2026-05-30T08:30:00.000Z',
        },
      ],
      cards: [],
    }
    window.history.pushState({}, '', '/modules/t1-start')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы тира' })
    const sectionHeadings = within(lessonPath).getAllByRole('heading').map((heading) => heading.textContent)

    expect(sectionHeadings).toEqual(['Юнит 1. Деньги и операции', 'Юнит 2. Планирование и управление'])
    expect(within(lessonPath).queryByText(/^Раздел$/)).toBeNull()
    expect(within(lessonPath).queryByText(/Раздел \d/)).toBeNull()
    expect(within(lessonPath).queryByText('Пройден')).toBeNull()
    expect(within(lessonPath).queryByText('Сейчас')).toBeNull()
    expect(within(lessonPath).queryAllByRole('button', { name: /Недоступный урок/ })).toHaveLength(2)
    const completedLessonButton = within(lessonPath).getByRole('button', { name: /Куда уходят деньги\. Пройден/ })
    const completedLessonCircle = completedLessonButton.querySelector('span.relative.flex')
    expect(completedLessonCircle?.className).toContain('group-hover:translate-y-[4px]')
    expect(completedLessonCircle?.className).not.toContain('group-hover:-translate-y-1')
  })

  it('renders the current target lesson node with locked future lessons', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/modules/t1-start')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы тира' })
    expect(within(lessonPath).getByText('Начать')).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Куда уходят деньги\. Текущий урок/ })).toBeTruthy()
    expect(within(lessonPath).queryAllByRole('button', { name: /Недоступный урок/ })).toHaveLength(3)
  })

  it('renders the tier sticky header for the target unit', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/modules/t1-start')

    render(<App />)

    await screen.findByRole('region', { name: 'Разделы тира' })
    expect(await screen.findByRole('link', { name: 'Тир 1 раздел 1' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: 'Юнит 1. Деньги и операции' })).toBeTruthy()
  })

  it('renders a lesson with cards', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(screen.getAllByText(/Конец месяца/i).length).toBeGreaterThan(0)
  })

  it('does not write viewed progress for an invalid lesson slug', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/not-a-real-lesson')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Не удалось загрузить урок' })).toBeTruthy()
    await new Promise((resolve) => setTimeout(resolve, 25))

    expect(getProgressWriteCount('/api/progress/lessons/not-a-real-lesson')).toBe(0)
  })

  it('renders canonical target unit routes and rejects removed content routes', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/modules/t1-start/units/money-and-operations')

    const { unmount } = render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Юнит 1. Деньги и операции' })).length).toBeGreaterThan(0)
    expect(await screen.findByRole('button', { name: /Куда уходят деньги/i })).toBeTruthy()
    expect(await screen.findByRole('button', { name: /Обязательное и желаемое/i })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Сколько держать в резерве/i })).toBeNull()

    unmount()
    window.history.pushState({}, '', '/modules/t1-start/units/planning-and-management')

    const planningRoute = render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Юнит 2. Планирование и управление' })).length).toBeGreaterThan(0)
    expect(await screen.findByRole('button', { name: /Зачем нужна подушка/i })).toBeTruthy()
    expect(await screen.findByRole('button', { name: /Сколько держать в резерве/i })).toBeTruthy()

    planningRoute.unmount()
    window.history.pushState({}, '', '/lessons/why-values-matter')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Не удалось загрузить урок' })).toBeTruthy()
  })

  it('saves initial lesson and active card progress once for an authenticated lesson reader', async () => {
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()

    await waitFor(() => {
      expect(getProgressWriteCount('/api/progress/lessons/where-money-goes')).toBe(1)
      expect(getProgressWriteCount('/api/progress/cards/card_t1u1l1_01_hook')).toBe(1)
    })
    await new Promise((resolve) => setTimeout(resolve, 25))

    expect(getProgressWriteCount('/api/progress/lessons/where-money-goes')).toBe(1)
    expect(getProgressWriteCount('/api/progress/cards/card_t1u1l1_01_hook')).toBe(1)
  })

  it('saves an authenticated reflection answer before completing that card', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = emptyReflectionAnswers
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Иногда бывает' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await completeWhereMoneyGoesPractice(user)
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await completeWhereMoneyGoesExternalExample(user)
    await user.type(screen.getAllByRole('textbox')[0], 'Кофе 250')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    const continueButton = screen.getByRole('button', { name: 'Далее' })
    expect(continueButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Кофе или перекусы — их оказалось больше, чем казалось' }))
    await user.click(continueButton)

    await waitFor(() => {
      expect(getRequestCount('/api/reflections/card_t1u1l1_05_surprise_reflection', 'PUT')).toBe(1)
      expect(getProgressCompletedWriteCount('/api/progress/cards/card_t1u1l1_05_surprise_reflection')).toBe(1)
    })
    expect(getJsonRequestBody('/api/reflections/card_t1u1l1_05_surprise_reflection', 'PUT')).toEqual({
      singleValue: 'Кофе или перекусы — их оказалось больше, чем казалось',
    })
    expect(getRequestOrder('/api/reflections/card_t1u1l1_05_surprise_reflection', 'PUT')).toBeLessThan(
      getRequestOrder('/api/progress/cards/card_t1u1l1_05_surprise_reflection', 'PUT', (body) => body.completed === true),
    )
  })

  it('blocks card advancement when required progress completion save fails', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = emptyReflectionAnswers
    apiOptions.progressCompletedFailure = { status: 500, message: 'Progress save failed' }
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Деньги были... и нет?' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    await waitFor(
      () => {
        expect(screen.getAllByText('Progress save failed').length).toBeGreaterThan(0)
      },
      { timeout: 3_500 },
    )
    expect(screen.getByRole('heading', { name: 'Деньги были... и нет?' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Деньги утекают по капле' })).toBeNull()
    expect(getProgressCompletedWriteCount('/api/progress/cards/card_t1u1l1_01_hook')).toBe(3)
  })

  it('retries a transient completed progress save and advances after success', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = emptyReflectionAnswers
    apiOptions.progressCompletedTransientFailures = { remaining: 1, status: 500, message: 'Internal server error' }
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Деньги были... и нет?' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByRole('heading', { name: 'Деньги утекают по капле' })).toBeTruthy()
    expect(screen.queryByText('Internal server error')).toBeNull()
    expect(getProgressCompletedWriteCount('/api/progress/cards/card_t1u1l1_01_hook')).toBe(2)
  })

  it('clears authenticated and private state when a required progress save returns 401', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_t1u1l1_05_surprise_reflection',
          cardType: 'reflection',
          saveKey: 'unexpected_expense',
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          unitSlug: 'money-and-operations',
          unitTitle: 'Юнит 1. Деньги и операции',
          moduleSlug: 't1-start',
          moduleTitle: 'T1 Старт',
          cardTitle: 'Что удивило?',
          prompt: 'Посмотри на свои три траты. Какая из них удивила тебя: оказалась больше, чем казалось, или просто была лишней?',
          template: null,
          answer: {
            singleValue: 'Кофе или перекусы — их оказалось больше, чем казалось',
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    apiOptions.progressCompletedFailure = { status: 401, message: 'Authentication is required' }
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    expect(screen.queryByText('Кофе или перекусы — их оказалось больше, чем казалось')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
  })

  it('renders artifact variants and summary in the target lesson flow', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await completeWhereMoneyGoesPractice(user)
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await completeWhereMoneyGoesExternalExample(user)
    expect(screen.getByRole('heading', { name: 'Твои 3 траты за сегодня' })).toBeTruthy()
    await user.type(screen.getAllByRole('textbox')[0], 'Кофе 250')
    await user.click(screen.getByRole('button', { name: 'Далее' }))
    await user.click(screen.getByRole('radio', { name: 'Кофе или перекусы — их оказалось больше, чем казалось' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('heading', { name: 'Твоё правило на 3 дня' })).toBeTruthy()
    await user.click(screen.getByRole('radio', { name: 'Замечаю хотя бы 1 трату в день' }))
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByRole('heading', { name: 'Сохранили в Навигатор' })).toBeTruthy()
    expect(screen.getByText(/В следующем уроке У1\.2/i)).toBeTruthy()
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

async function completeWhereMoneyGoesPractice(user: ReturnType<typeof userEvent.setup>) {
  await user.click(within(screen.getByRole('group', { name: 'Покупка телефона' })).getByRole('radio', { name: 'Замечаю сразу' }))
  await waitFor(() => expect(screen.getByRole('group', { name: 'Аренда жилья' })).toBeTruthy())
  await user.click(within(screen.getByRole('group', { name: 'Аренда жилья' })).getByRole('radio', { name: 'Замечаю сразу' }))
  await waitFor(() => expect(screen.getByRole('group', { name: 'Кофе навынос' })).toBeTruthy())
  await user.click(
    within(screen.getByRole('group', { name: 'Кофе навынос' })).getByRole('radio', { name: 'Проходит мимо внимания' }),
  )
  await waitFor(() => expect(screen.getByRole('group', { name: 'Подписка на сервис' })).toBeTruthy())
  await user.click(
    within(screen.getByRole('group', { name: 'Подписка на сервис' })).getByRole('radio', { name: 'Проходит мимо внимания' }),
  )
  await waitFor(() => expect(screen.getByRole('group', { name: 'Поездка на такси' })).toBeTruthy())
  await user.click(
    within(screen.getByRole('group', { name: 'Поездка на такси' })).getByRole('radio', { name: 'Проходит мимо внимания' }),
  )
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Поездка на такси: Проходит мимо внимания' })).toBeTruthy(),
  )
}

async function completeWhereMoneyGoesExternalExample(user: ReturnType<typeof userEvent.setup>) {
  expect(await screen.findByRole('heading', { name: 'Подписка, которая проходит мимо' })).toBeTruthy()
  expect(screen.getByText('56%')).toBeTruthy()

  await user.click(screen.getByRole('radio', { name: 'Мелкая автоматическая трата может долго проходить мимо внимания' }))
  await user.click(screen.getByRole('button', { name: 'Проверить' }))

  expect(await screen.findByRole('status')).toHaveTextContent('Верно')
  await user.click(screen.getByRole('button', { name: 'Далее' }))
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
