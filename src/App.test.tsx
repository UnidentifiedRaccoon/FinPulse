import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { afterEach, beforeEach, vi } from 'vitest'

import type { ApiUser, ProgressResponse, ReflectionAnswersResponse } from '@/api/client'
import { getAllLessons, getOrderedLevels, getOrderedSections } from '@/content/order'
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
const whereMoneyGoesFirstCta = 'Разобраться, куда уходят мои деньги'
const mandatoryDesiredFirstCta = 'Научиться различать'
const theoryContinueCta = 'Понятно, дальше'
const practiceContinueCta = 'Дальше'
const externalExampleContinueCta = 'Применить к себе'
const expenseArtifactContinueCta = 'Сохранить и продолжить'
const reflectionContinueCta = 'Дальше'
const ruleContinueCta = 'Сделать моим правилом'

type ApiResponseOptions = {
  currentUser?: ApiUser | null
  progress?: ProgressResponse
  reflectionAnswers?: ReflectionAnswersResponse
  loginNonJsonError?: boolean
  programHasNoLevels?: boolean
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

function deferApiGet(path: string, options: ApiResponseOptions) {
  let resolveResponse: (response: Response) => void = () => undefined
  const promise = new Promise<Response>((resolve) => {
    resolveResponse = resolve
  })

  vi.mocked(fetch).mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    const requestPath = new URL(String(input), 'http://localhost').pathname
    const requestMethod = init?.method?.toUpperCase() ?? 'GET'

    if (requestPath === path && requestMethod === 'GET') {
      return promise
    }

    return apiResponse(String(input), options, init)
  })

  return {
    resolve: async () => {
      resolveResponse(await apiResponse(`http://localhost${path}`, options))
    },
  }
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
    if (options.programHasNoLevels) {
      return jsonResponse({ ...program, levels: [] })
    }

    return jsonResponse(program)
  }

  if (path === '/api/levels') {
    return jsonResponse(getOrderedLevels(program))
  }

  if (path.startsWith('/api/levels/')) {
    const levelSlug = decodeURIComponent(path.replace('/api/levels/', ''))
    const level = getOrderedLevels(program).find((candidate) => candidate.slug === levelSlug)
    return level ? jsonResponse(level) : jsonResponse({ error: { code: 'not_found', message: 'Level not found' } }, 404)
  }

  if (path.startsWith('/api/sections/')) {
    const sectionSlug = decodeURIComponent(path.replace('/api/sections/', ''))
    for (const level of getOrderedLevels(program)) {
      const section = getOrderedSections(level).find((candidate) => candidate.slug === sectionSlug)
      if (section) return jsonResponse({ level, section })
    }
    return jsonResponse({ error: { code: 'not_found', message: 'Section not found' } }, 404)
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
    vi.stubGlobal('scrollTo', vi.fn())
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
    expect(screen.queryByRole('heading', { name: 'Уровни' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
  })

  it('renders the categorization columns experiment route without auth shell', async () => {
    window.history.pushState({}, '', '/design/categorization-columns')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Финальная сверка колонками' })).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Пример: Бюджетные корзины' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Войдите в ФинПульс' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
    expect(getRequestCount('/api/auth/me')).toBe(0)

    const fourColumnExample = screen.getByRole('region', { name: 'Пример: Бюджетные корзины' })
    expect(within(fourColumnExample).getAllByRole('region', { name: /^Колонка / })).toHaveLength(4)
  })

  it('moves a selected answer between columns in the four-column experiment', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/design/categorization-columns')

    render(<App />)

    const fourColumnExample = await screen.findByRole('region', { name: 'Пример: Бюджетные корзины' })
    const desiredColumn = within(fourColumnExample).getByRole('region', { name: 'Колонка Желаемое' })
    const payYourselfColumn = within(fourColumnExample).getByRole('region', { name: 'Колонка Сначала себе' })
    const reserveTransfer = within(desiredColumn).getByRole('button', { name: /Перевод 10% в резерв/ })

    expect(reserveTransfer).toHaveAttribute('aria-pressed', 'false')
    expect(payYourselfColumn.firstElementChild?.className).toContain('bg-[#e9edf2]')
    expect(payYourselfColumn.firstElementChild?.className).toContain('min-h-[57px]')
    expect(payYourselfColumn.firstElementChild?.className).toContain('border-b')
    expect(payYourselfColumn.firstElementChild?.querySelector('h3')?.getAttribute('style')).toContain(
      '-webkit-line-clamp: 2',
    )
    expect(reserveTransfer.querySelector('svg')).toBeNull()

    await user.click(reserveTransfer)
    expect(reserveTransfer).toHaveAttribute('aria-pressed', 'true')

    await user.click(payYourselfColumn)

    await waitFor(() => {
      expect(within(payYourselfColumn).getByRole('button', { name: /Перевод 10% в резерв/ })).toBeTruthy()
    })
    expect(within(desiredColumn).queryByRole('button', { name: /Перевод 10% в резерв/ })).toBeNull()
    expect(within(payYourselfColumn).getAllByRole('button').map((button) => button.getAttribute('aria-label'))).toEqual([
      'Копилка на поездку. Сейчас: Сначала себе',
      'Перевод 10% в резерв. Сейчас: Сначала себе',
    ])
    expect(within(payYourselfColumn).getByRole('button', { name: /Перевод 10% в резерв/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('opens the program tab for an existing session at the root route', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/')

    render(
      <StrictMode>
        <App />
      </StrictMode>,
    )

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    await waitFor(() => {
      expect(window.location.pathname).toBe('/program')
    })
    expect(screen.queryByText(/С возвращением/i)).toBeNull()
  })

  it('renders a profile screen with identity and learning stats', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_l1s1l1_04_expense_diary',
          cardType: 'artifact',
          saveKey: null,
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          sectionSlug: 'money-and-operations',
          sectionTitle: 'Раздел 1. Деньги и операции',
          levelSlug: 'level-1-start',
          levelTitle: 'Уровень 1 · Старт',
          cardTitle: 'Твои 3 траты за сегодня',
          prompt: 'Вспомни и запиши 3 свои траты за сегодня: сумма и категория, без оценок «хорошо/плохо».',
          template: [
            'Трата 1: сумма и категория',
            'Трата 2: сумма и категория',
            'Трата 3: сумма и категория',
          ],
          answer: {
            templateValues: ['Кофе 250 ₽', 'Метро 70 ₽', 'Обед 420 ₽'],
          },
          createdAt: '2026-05-30T08:40:00.000Z',
          updatedAt: '2026-05-30T08:40:00.000Z',
        },
        {
          cardId: 'card_l1s1l1_05_surprise_reflection',
          cardType: 'reflection',
          saveKey: 'unexpected_expense',
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          sectionSlug: 'money-and-operations',
          sectionTitle: 'Раздел 1. Деньги и операции',
          levelSlug: 'level-1-start',
          levelTitle: 'Уровень 1 · Старт',
          cardTitle: 'Что удивило?',
          prompt: 'Посмотри на свои три траты. Какая из них удивила тебя — оказалась больше или меньше, чем казалось?',
          template: null,
          answer: {
            singleValue: 'Кофе/перекусы — их больше, чем думал(а)',
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
        {
          cardId: 'card_l1s1l2_05_reduce_without_pain',
          cardType: 'reflection',
          saveKey: 'desired_expense_to_reduce',
          lessonSlug: 'mandatory-and-desired',
          lessonTitle: 'Обязательное и желаемое',
          sectionSlug: 'money-and-operations',
          sectionTitle: 'Раздел 1. Деньги и операции',
          levelSlug: 'level-1-start',
          levelTitle: 'Уровень 1 · Старт',
          cardTitle: 'Что можно сократить без боли?',
          prompt: 'Посмотри на свои «желаемые» траты. Какую из них ты сократил(а) бы — и почти не заметил(а) разницы?',
          template: null,
          answer: {
            singleValue: 'Подписки, которыми почти не пользуюсь',
          },
          createdAt: '2026-05-30T09:15:00.000Z',
          updatedAt: '2026-05-30T09:15:00.000Z',
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
          cardId: 'card_l1s1l1_01_hook',
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
    expect(within(answersSection).getByRole('heading', { name: 'Куда уходят деньги · 2 ответа' })).toBeTruthy()
    expect(within(answersSection).getByRole('heading', { name: 'Обязательное и желаемое · 1 ответ' })).toBeTruthy()
    expect(within(answersSection).queryByText('Раздел 1. Деньги и операции · Куда уходят деньги')).toBeNull()
    const questionButtons = within(answersSection).getAllByRole('button', { name: 'Вспомнить вопрос' })
    expect(questionButtons).toHaveLength(3)
    expect(screen.queryByRole('dialog', { name: 'Вопрос' })).toBeNull()
    expect(answersSection.querySelector('details')).toBeNull()
    await user.click(questionButtons[0])
    const questionDialog = await screen.findByRole('dialog', { name: 'Вопрос' })
    expect(within(questionDialog).getByText('Вспомни и запиши 3 свои траты за сегодня: сумма и категория, без оценок «хорошо/плохо».')).toBeTruthy()
    await user.click(within(questionDialog).getByRole('button', { name: 'Закрыть вопрос' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Вопрос' })).toBeNull()
    })
    expect(within(answersSection).getByRole('heading', { name: 'Твои 3 траты за сегодня' })).toBeTruthy()
    expect(within(answersSection).getByRole('heading', { name: 'Что удивило?' })).toBeTruthy()
    expect(within(answersSection).getByText('Кофе/перекусы — их больше, чем думал(а)')).toBeTruthy()
    expect(within(answersSection).getByText('Подписки, которыми почти не пользуюсь')).toBeTruthy()
    const progressSection = screen.getByRole('region', { name: 'Учебный прогресс' })
    expect(within(progressSection).getByRole('heading', { name: 'Учебный прогресс' })).toBeTruthy()
    expect(within(progressSection).getByText('Пройдено уроков')).toBeTruthy()
    expect(await within(progressSection).findByText(`1/${program ? getAllLessons(program).length : 0}`)).toBeTruthy()
    expect(within(progressSection).getByText('Просмотрено уроков')).toBeTruthy()
    expect(within(progressSection).getAllByText('1').length).toBeGreaterThan(0)
    expect(within(progressSection).getByText('Карточек завершено')).toBeTruthy()
    expect(within(screen.getByRole('main')).getByRole('button', { name: 'Выйти' })).toBeTruthy()
  })

  it('keeps the profile answers empty state unchanged', async () => {
    setAuthenticatedLearner(apiOptions)
    apiOptions.reflectionAnswers = emptyReflectionAnswers
    window.history.pushState({}, '', '/profile')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Профиль' })).toBeTruthy()
    const answersSection = screen.getByRole('region', { name: 'Персональный финансовый навигатор' })
    expect(within(answersSection).getByText('Здесь появятся ответы после заданий с рефлексией и рабочими блоками.')).toBeTruthy()
    expect(within(answersSection).queryByText(/· \d+ ответ/)).toBeNull()
  })

  it('renders the real program overview', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Старт' })).toBeTruthy()
    expect(screen.getByText('Уровень 1')).toBeTruthy()
    expect(
      screen.getByText('Первый уровень новой методической рамки ФинПульс: навести порядок, увидеть базовые траты и начать маленькие финансовые привычки.'),
    ).toBeTruthy()
    expect(screen.queryByText('Ваш прогресс')).toBeNull()
    expect(screen.getByRole('progressbar', { name: /уровня завершено/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Далее' }).getAttribute('href')).toBe('/levels/level-1-start')
  })

  it('renders the program skeleton while the program route is loading', async () => {
    setAuthenticatedLearner(apiOptions)
    const delayedProgram = deferApiGet('/api/program', apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    const skeleton = await screen.findByTestId('program-loading-skeleton')
    expect(within(skeleton).getAllByTestId('program-level-card-skeleton')).toHaveLength(1)
    expect(screen.queryByText('Загружаем программу')).toBeNull()

    await delayedProgram.resolve()

    expect(await screen.findByRole('heading', { name: 'Старт' })).toBeTruthy()
    expect(screen.queryByTestId('program-loading-skeleton')).toBeNull()
  })

  it('renders the level path skeleton while the level route is loading', async () => {
    setAuthenticatedLearner(apiOptions)
    const delayedLevel = deferApiGet('/api/levels/level-1-start', apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    const skeleton = await screen.findByTestId('path-loading-skeleton')

    expect(within(skeleton).getByRole('link', { name: 'Вернуться к уровням' }).getAttribute('href')).toBe('/program')
    expect(within(skeleton).getAllByTestId('path-skeleton-node')).toHaveLength(2)
    expect(screen.queryByText('Загружаем уровень')).toBeNull()

    await delayedLevel.resolve()

    expect(await screen.findByRole('region', { name: 'Разделы уровня' })).toBeTruthy()
    expect(screen.queryByTestId('path-loading-skeleton')).toBeNull()
  })

  it('renders the section path skeleton while the section route is loading', async () => {
    setAuthenticatedLearner(apiOptions)
    const delayedSection = deferApiGet('/api/sections/money-and-operations', apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start/sections/money-and-operations')

    render(<App />)

    const skeleton = await screen.findByTestId('path-loading-skeleton')

    expect(within(skeleton).getByRole('link', { name: 'Вернуться к уровню' }).getAttribute('href')).toBe('/levels/level-1-start')
    expect(within(skeleton).getAllByTestId('path-skeleton-node')).toHaveLength(2)
    expect(screen.queryByText('Загружаем раздел')).toBeNull()

    await delayedSection.resolve()

    expect(await screen.findByRole('button', { name: /Куда уходят деньги/i })).toBeTruthy()
    expect(screen.queryByTestId('path-loading-skeleton')).toBeNull()
  })

  it('renders the lesson skeleton while the lesson route is loading before writing progress', async () => {
    setAuthenticatedLearner(apiOptions)
    const delayedLesson = deferApiGet('/api/lessons/where-money-goes', apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByTestId('lesson-loading-skeleton')).toBeTruthy()
    expect(screen.queryByText('Загружаем урок')).toBeNull()
    await new Promise((resolve) => setTimeout(resolve, 25))
    expect(getProgressWriteCount('/api/progress/lessons/where-money-goes')).toBe(0)

    await delayedLesson.resolve()

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    await waitFor(() => {
      expect(getProgressWriteCount('/api/progress/lessons/where-money-goes')).toBe(1)
    })
    expect(screen.queryByTestId('lesson-loading-skeleton')).toBeNull()
  })

  it('shows not found for removed routes', async () => {
    const removedRoutes = [
      {
        path: '/design/lesson-completion-variants',
        removedHeading: 'Завершение урока',
      },
      {
        path: '/design/mobile-section-compact',
        removedHeading: 'Раздел 1. Деньги и операции',
      },
      {
        path: '/design/lesson-card-full-width',
        removedHeading: 'Распредели траты на две группы',
      },
    ]

    for (const route of removedRoutes) {
      setAuthenticatedLearner(apiOptions)
      window.history.pushState({}, '', route.path)

      const { unmount } = render(<App />)

      expect(await screen.findByRole('heading', { name: 'Страница не найдена' })).toBeTruthy()
      expect(screen.queryByRole('heading', { name: route.removedHeading })).toBeNull()
      expect(window.location.pathname).toBe(route.path)

      unmount()
    }
  })

  it('renders the compact production level path header', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    const compactHeader = await screen.findByTestId('compact-path-header')
    const main = screen.getByRole('main')

    expect(main.className).toContain('max-w-[720px]')
    expect(main.className).not.toContain('max-w-none')
    expect(main.className).toContain('px-0')
    expect(main.className).toContain('py-0')
    expect(compactHeader.className).toContain('top-0')
    expect(compactHeader.className).toContain('rounded-b-[22px]')
    expect(compactHeader.className).not.toContain('rounded-t')
    expect(within(compactHeader).getByRole('link', { name: 'Уровень 1 раздел 1' }).getAttribute('href')).toBe('/program')
    expect(within(compactHeader).getByRole('heading', { level: 1, name: 'Деньги и операции' }).className).toContain('text-[20px]')
    expect(within(compactHeader).getByRole('heading', { level: 1, name: 'Деньги и операции' }).className).toContain('pl-5')
    expect(screen.queryByRole('heading', { name: 'Войдите в ФинПульс' })).toBeNull()

    const lessonPath = await screen.findByRole('region', { name: 'Разделы уровня' })
    const firstSectionPassport = within(lessonPath).getByRole('button', {
      name: 'Раскрыть описание раздела Деньги и операции',
    })
    expect(firstSectionPassport.getAttribute('aria-expanded')).toBe('false')
    expect(firstSectionPassport.className).toContain('size-6')
    expect(firstSectionPassport.className).toContain('border-[var(--fr-color-sky-500)]/35')
    expect(firstSectionPassport.querySelector('svg')?.className.baseVal).toContain('size-4')
    expect(firstSectionPassport.querySelector('svg')?.className.baseVal).toContain('duration-300')
    const collapsedPassportText = within(lessonPath).getByText(/Деньги и операции - это бытовые ситуации/i)
    const passportReveal = collapsedPassportText.parentElement?.parentElement
    expect(passportReveal?.getAttribute('aria-hidden')).toBe('true')
    expect(passportReveal?.className).toContain('grid-rows-[0fr]')
    expect(passportReveal?.className).toContain('opacity-0')

    await user.click(firstSectionPassport)

    const firstSectionPassportText = within(lessonPath).getByText(/Деньги и операции - это бытовые ситуации/i)
    const expandedPassportReveal = firstSectionPassportText.parentElement?.parentElement
    expect(firstSectionPassport.getAttribute('aria-expanded')).toBe('true')
    expect(firstSectionPassport.getAttribute('aria-label')).toBe('Свернуть описание раздела Деньги и операции')
    expect(firstSectionPassport.getAttribute('aria-describedby')).toBe(firstSectionPassportText.id)
    expect(expandedPassportReveal?.getAttribute('aria-hidden')).toBe('false')
    expect(expandedPassportReveal?.className).toContain('grid-rows-[1fr]')
    expect(expandedPassportReveal?.className).toContain('opacity-100')
    expect(firstSectionPassportText.className).toContain('text-center')

    const firstLessonButton = within(lessonPath).getByRole('button', { name: /Куда уходят деньги/i })
    expect(firstLessonButton).toBeTruthy()

    await user.click(firstLessonButton)

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
  })

  it('does not expose the removed lesson goal variants experiment route', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/design/lesson-goal-feedback-variants')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Страница не найдена' })).toBeTruthy()
    expect(window.location.pathname).toBe('/design/lesson-goal-feedback-variants')
    expect(screen.queryByRole('heading', { name: 'Варианты блока цели урока' })).toBeNull()
    expect(screen.queryByTestId('goal-feedback-variant-checkpoint')).toBeNull()
  })

  it('does not redirect removed module routes to levels', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/modules/level-1-start')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Страница не найдена' })).toBeTruthy()
    expect(window.location.pathname).toBe('/modules/level-1-start')
    expect(screen.queryByRole('heading', { name: 'Старт' })).toBeNull()
  })

  it('does not restore private profile state when navigating back after logout', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_l1s1l1_05_surprise_reflection',
          cardType: 'reflection',
          saveKey: 'unexpected_expense',
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          sectionSlug: 'money-and-operations',
          sectionTitle: 'Раздел 1. Деньги и операции',
          levelSlug: 'level-1-start',
          levelTitle: 'Уровень 1 · Старт',
          cardTitle: 'Что удивило?',
          prompt: 'Посмотри на свои три траты. Какая из них удивила тебя — оказалась больше или меньше, чем казалось?',
          template: null,
          answer: {
            singleValue: 'Кофе/перекусы — их больше, чем думал(а)',
          },
          createdAt: '2026-05-30T08:45:00.000Z',
          updatedAt: '2026-05-30T08:45:00.000Z',
        },
      ],
    }
    window.history.pushState({}, '', '/profile')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Профиль' })).toBeTruthy()
    expect(screen.getByRole('main').className).toContain('px-0')
    expect(screen.getByText('Кофе/перекусы — их больше, чем думал(а)')).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    await user.click(within(sidebar).getByRole('link', { name: 'Обучение' }))
    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    expect(screen.queryByText('Кофе/перекусы — их больше, чем думал(а)')).toBeNull()

    window.history.pushState({}, '', '/profile')
    fireEvent.popState(window)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    })
    expect(screen.queryByText('Кофе/перекусы — их больше, чем думал(а)')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Боковое меню приложения' })).toBeNull()
  })

  it('shows a program empty state when no levels are available', async () => {
    setAuthenticatedLearner(apiOptions)
    apiOptions.programHasNoLevels = true
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    expect(screen.getByRole('main').className).toContain('px-0')
    expect(screen.getByText('Материалы программы пока не добавлены.').className).toContain('w-full')
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
    expect(screen.queryByRole('heading', { name: 'Уровни' })).toBeNull()
  })

  it('renders the desktop sidebar and mobile bottom navigation', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    expect(screen.getByRole('main').className).toContain('px-0')

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

  it('applies route transition attributes for learning and profile navigation', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    const { container } = render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    expect(getRouteTransitionFrame(container)).toHaveAttribute('data-route-transition', 'none')

    await user.click(screen.getByRole('link', { name: 'Далее' }))

    expect(await screen.findByTestId('compact-path-header')).toBeTruthy()
    expect(getRouteTransitionFrame(container)).toHaveAttribute('data-route-transition', 'learning-forward')

    await user.click(within(screen.getByTestId('compact-path-header')).getByRole('link', { name: 'Уровень 1 раздел 1' }))

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()
    expect(getRouteTransitionFrame(container)).toHaveAttribute('data-route-transition', 'learning-back')

    await user.click(screen.getAllByRole('link', { name: 'Профиль' })[0])

    expect(await screen.findByRole('heading', { name: 'Профиль' })).toBeTruthy()
    expect(getRouteTransitionFrame(container)).toHaveAttribute('data-route-transition', 'profile-fade')
  })

  it('separates authenticated account and logout controls in desktop while keeping mobile nav focused', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/program')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Уровни' })).toBeTruthy()

    const sidebar = screen.getByRole('navigation', { name: 'Боковое меню приложения' })
    const bottomNavigation = screen.getByRole('navigation', { name: 'Нижнее меню приложения' })

    expect(within(sidebar).getByRole('link', { name: 'Профиль' }).getAttribute('href')).toBe('/profile')
    expect(within(bottomNavigation).getByRole('link', { name: 'Профиль' }).getAttribute('href')).toBe('/profile')
    expect(within(bottomNavigation).queryByRole('button', { name: 'Выйти' })).toBeNull()
    expect(screen.getAllByRole('button', { name: 'Выйти' }).length).toBe(1)
  })

  it('opens lesson details from the level lesson path before navigation', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    expect((await screen.findAllByRole('heading', { name: 'Деньги и операции' })).length).toBeGreaterThan(0)
    await user.click(await screen.findByRole('button', { name: /Куда уходят деньги/i }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(within(dialog).queryByText(/увидеть свои реальные траты/i)).toBeNull()
    expect(within(dialog).getByRole('link', { name: 'Продолжить урок · 5 мин' }).getAttribute('href')).toBe('/lessons/where-money-goes')
  })

  it('renders the active lesson nodes in source order', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы уровня' })
    expect(within(lessonPath).getByRole('button', { name: /Куда уходят деньги/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Обязательное и желаемое/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Безопасный платёж/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Цифровой след и защита/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Зачем нужна подушка/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Сколько держать в резерве/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Правило «сначала себе»/i })).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Бюджет-черновик/i })).toBeTruthy()
  })

  it('renders the active target section in the level path', async () => {
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
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы уровня' })
    const sectionHeadings = within(lessonPath).getAllByRole('heading').map((heading) => heading.textContent)

    expect(sectionHeadings).toEqual(['Деньги и операции', 'Планирование и управление'])
    expect(within(lessonPath).queryByText(/^Раздел$/)).toBeNull()
    expect(within(lessonPath).queryByText(/Юнит/)).toBeNull()
    expect(within(lessonPath).queryByText('Пройден')).toBeNull()
    expect(within(lessonPath).queryByText('Сейчас')).toBeNull()
    expect(within(lessonPath).queryAllByRole('button', { name: /Недоступный урок/ })).toHaveLength(6)
    const completedLessonButton = within(lessonPath).getByRole('button', { name: /Куда уходят деньги\. Пройден/ })
    const completedLessonCircle = completedLessonButton.querySelector('span.relative.flex')
    expect(completedLessonCircle?.className).toContain('group-hover:translate-y-[4px]')
    expect(completedLessonCircle?.className).not.toContain('group-hover:-translate-y-1')
  })

  it('renders the current target lesson node with locked future lessons', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    const lessonPath = await screen.findByRole('region', { name: 'Разделы уровня' })
    expect(within(lessonPath).getByText('Начать')).toBeTruthy()
    expect(within(lessonPath).getByRole('button', { name: /Куда уходят деньги\. Текущий урок/ })).toBeTruthy()
    expect(within(lessonPath).queryAllByRole('button', { name: /Недоступный урок/ })).toHaveLength(7)
  })

  it('renders the level sticky header for the target section', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start')

    render(<App />)

    const compactHeader = await screen.findByTestId('compact-path-header')
    expect(within(compactHeader).getByRole('link', { name: 'Уровень 1 раздел 1' })).toBeTruthy()
    expect(within(compactHeader).getByRole('heading', { level: 1, name: 'Деньги и операции' })).toBeTruthy()
  })

  it('renders a lesson with cards', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(screen.getByRole('main').className).toContain('px-0')
    expect(screen.getByRole('main').className).toContain('py-0')
    expect(screen.getByRole('heading', { name: 'Деньги были... или нет?' }).closest('section')?.className).toContain('w-full')
    expect(screen.getAllByText(/Конец месяца/i).length).toBeGreaterThan(0)
  })

  it('returns from a lesson to the focused lesson node on the level path', async () => {
    const user = userEvent.setup()
    const { restore, scrollIntoView } = mockElementScrollIntoView()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    try {
      const { container } = render(<App />)

      expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
      await user.click(screen.getByRole('link', { name: 'Вернуться к уровню Уровень 1 · Старт' }))

      expect(await screen.findByTestId('compact-path-header')).toBeTruthy()
      expect(getRouteTransitionFrame(container)).toHaveAttribute('data-route-transition', 'learning-back')
      await waitFor(() => {
        expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'auto' })
      })
    } finally {
      restore()
    }
  })

  it('shows selected option feedback immediately after selecting a subjective choice', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Деньги были... или нет?' })).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()

    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Знакомо. Сейчас увидим, куда уходят деньги.')
    expect(screen.getByRole('status')).not.toHaveTextContent('Есть нюанс')
    expect(screen.getByRole('button', { name: whereMoneyGoesFirstCta })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Проверить' })).toBeNull()

    await user.click(screen.getByRole('radio', { name: 'Нет, я знаю, куда уходят деньги' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Отлично — проверим это на практике.')
    expect(screen.queryByText('Знакомо. Сейчас увидим, куда уходят деньги.')).toBeNull()
  })

  it('shows mandatory-and-desired first-screen feedback from source JSON options', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/mandatory-and-desired')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Обязательное и желаемое' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Это мне точно нужно?' })).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()

    await user.click(screen.getByRole('radio', { name: 'Да, регулярно' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Знакомо. Научимся различать нужное и приятное.')
    expect(screen.getByRole('status')).not.toHaveTextContent('Любой ответ')

    await user.click(screen.getByRole('radio', { name: 'Иногда' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Бывает у многих — посмотрим на разницу.')
    expect(screen.queryByText('Знакомо. Научимся различать нужное и приятное.')).toBeNull()

    await user.click(screen.getByRole('radio', { name: 'Почти никогда' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Отлично. Закрепим это на примерах.')
    expect(screen.getByRole('button', { name: mandatoryDesiredFirstCta })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Проверить' })).toBeNull()
  })

  it('uses lesson-specific CTA labels from card content', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/mandatory-and-desired')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Обязательное и желаемое' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Это мне точно нужно?' })).toBeTruthy()
    expect(screen.getByRole('button', { name: mandatoryDesiredFirstCta })).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Иногда' }))

    expect(screen.getByRole('button', { name: mandatoryDesiredFirstCta })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Далее' })).toBeNull()

    await user.click(screen.getByRole('button', { name: mandatoryDesiredFirstCta }))

    expect(await screen.findByRole('heading', { name: 'Две группы трат' })).toBeTruthy()
    expect(screen.getByRole('button', { name: theoryContinueCta })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Далее' })).toBeNull()
  })

  it('does not write viewed progress for an invalid lesson slug', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/not-a-real-lesson')

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Не удалось загрузить урок' })).toBeTruthy()
    await new Promise((resolve) => setTimeout(resolve, 25))

    expect(getProgressWriteCount('/api/progress/lessons/not-a-real-lesson')).toBe(0)
  })

  it('renders canonical target section routes and rejects removed content routes', async () => {
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/levels/level-1-start/sections/money-and-operations')

    const { unmount } = render(<App />)

    const sectionHeader = await screen.findByTestId('compact-path-header')
    const main = screen.getByRole('main')
    expect(main.className).toContain('max-w-[720px]')
    expect(main.className).not.toContain('max-w-none')
    expect(within(sectionHeader).getByRole('link', { name: 'Уровень 1' }).getAttribute('href')).toBe('/levels/level-1-start')
    expect(within(sectionHeader).getByRole('heading', { level: 1, name: 'Деньги и операции' }).className).toContain('text-[20px]')
    expect(within(sectionHeader).getByRole('heading', { level: 1, name: 'Деньги и операции' }).className).toContain('pl-5')
    expect((await screen.findAllByRole('heading', { name: 'Деньги и операции' })).length).toBeGreaterThan(0)
    expect(await screen.findByRole('button', { name: /Куда уходят деньги/i })).toBeTruthy()
    expect(await screen.findByRole('button', { name: /Обязательное и желаемое/i })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Сколько держать в резерве/i })).toBeNull()

    unmount()
    window.history.pushState({}, '', '/levels/level-1-start/sections/planning-and-management')

    const planningSectionRoute = render(<App />)

    const planningSectionHeader = await screen.findByTestId('compact-path-header')
    expect(within(planningSectionHeader).getByRole('heading', { level: 1, name: 'Планирование и управление' })).toBeTruthy()
    expect(await screen.findByRole('button', { name: /Зачем нужна подушка/i })).toBeTruthy()
    expect(await screen.findByRole('button', { name: /Сколько держать в резерве/i })).toBeTruthy()

    planningSectionRoute.unmount()
    window.history.pushState({}, '', '/lessons/why-emergency-fund')

    const removedLessonRoute = render(<App />)

    expect(await screen.findByRole('heading', { name: 'Не удалось загрузить урок' })).toBeTruthy()

    removedLessonRoute.unmount()
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
      expect(getProgressWriteCount('/api/progress/cards/card_l1s1l1_01_hook')).toBe(1)
    })
    await new Promise((resolve) => setTimeout(resolve, 25))

    expect(getProgressWriteCount('/api/progress/lessons/where-money-goes')).toBe(1)
    expect(getProgressWriteCount('/api/progress/cards/card_l1s1l1_01_hook')).toBe(1)
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
    await user.click(screen.getByRole('button', { name: whereMoneyGoesFirstCta }))
    await user.click(screen.getByRole('button', { name: theoryContinueCta }))
    await completeWhereMoneyGoesPractice(user)
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: practiceContinueCta }))
    await completeWhereMoneyGoesExternalExample(user)
    const expenseFields = screen.getAllByRole('textbox')
    await user.type(expenseFields[0], 'Кофе 250')
    await user.type(expenseFields[1], 'Проезд 70')
    await user.type(expenseFields[2], 'Перекус 180')
    await user.click(screen.getByRole('button', { name: expenseArtifactContinueCta }))

    const continueButton = screen.getByRole('button', { name: reflectionContinueCta })
    expect(continueButton).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Кофе/перекусы — их больше, чем думал(а)' }))
    await user.click(continueButton)

    await waitFor(() => {
      expect(getRequestCount('/api/reflections/card_l1s1l1_05_surprise_reflection', 'PUT')).toBe(1)
      expect(getProgressCompletedWriteCount('/api/progress/cards/card_l1s1l1_05_surprise_reflection')).toBe(1)
    })
    expect(getJsonRequestBody('/api/reflections/card_l1s1l1_05_surprise_reflection', 'PUT')).toEqual({
      singleValue: 'Кофе/перекусы — их больше, чем думал(а)',
    })
    expect(getRequestOrder('/api/reflections/card_l1s1l1_05_surprise_reflection', 'PUT')).toBeLessThan(
      getRequestOrder('/api/progress/cards/card_l1s1l1_05_surprise_reflection', 'PUT', (body) => body.completed === true),
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
    expect(screen.getByRole('heading', { name: 'Деньги были... или нет?' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: whereMoneyGoesFirstCta }))

    await waitFor(
      () => {
        expect(screen.getAllByText('Progress save failed').length).toBeGreaterThan(0)
      },
      { timeout: 3_500 },
    )
    expect(screen.getByRole('heading', { name: 'Деньги были... или нет?' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Куда «утекают» деньги' })).toBeNull()
    expect(getProgressCompletedWriteCount('/api/progress/cards/card_l1s1l1_01_hook')).toBe(3)
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
    expect(screen.getByRole('heading', { name: 'Деньги были... или нет?' })).toBeTruthy()

    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: whereMoneyGoesFirstCta }))

    expect(await screen.findByRole('heading', { name: 'Куда «утекают» деньги' })).toBeTruthy()
    expect(screen.queryByText('Internal server error')).toBeNull()
    expect(getProgressCompletedWriteCount('/api/progress/cards/card_l1s1l1_01_hook')).toBe(2)
  })

  it('clears authenticated and private state when a required progress save returns 401', async () => {
    const user = userEvent.setup()
    apiOptions.currentUser = learnerUser
    apiOptions.progress = emptyProgress
    apiOptions.reflectionAnswers = {
      answers: [
        {
          cardId: 'card_l1s1l1_05_surprise_reflection',
          cardType: 'reflection',
          saveKey: 'unexpected_expense',
          lessonSlug: 'where-money-goes',
          lessonTitle: 'Куда уходят деньги',
          sectionSlug: 'money-and-operations',
          sectionTitle: 'Раздел 1. Деньги и операции',
          levelSlug: 'level-1-start',
          levelTitle: 'Уровень 1 · Старт',
          cardTitle: 'Что удивило?',
          prompt: 'Посмотри на свои три траты. Какая из них удивила тебя — оказалась больше или меньше, чем казалось?',
          template: null,
          answer: {
            singleValue: 'Кофе/перекусы — их больше, чем думал(а)',
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
    await user.click(screen.getByRole('button', { name: whereMoneyGoesFirstCta }))

    expect(await screen.findByRole('heading', { name: 'Войдите в ФинПульс' })).toBeTruthy()
    expect(screen.queryByText('Кофе/перекусы — их больше, чем думал(а)')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Нижнее меню приложения' })).toBeNull()
  })

  it('renders artifact variants and summary in the target lesson flow', async () => {
    const user = userEvent.setup()
    setAuthenticatedLearner(apiOptions)
    window.history.pushState({}, '', '/lessons/where-money-goes')

    const { container } = render(<App />)

    expect(await screen.findByRole('heading', { name: 'Куда уходят деньги' })).toBeTruthy()
    await user.click(screen.getByRole('radio', { name: 'Да, постоянно так' }))
    await user.click(screen.getByRole('button', { name: whereMoneyGoesFirstCta }))
    await user.click(screen.getByRole('button', { name: theoryContinueCta }))
    await completeWhereMoneyGoesPractice(user)
    await user.click(screen.getByRole('button', { name: 'Проверить' }))
    await user.click(screen.getByRole('button', { name: practiceContinueCta }))
    await completeWhereMoneyGoesExternalExample(user)
    expect(screen.getByRole('heading', { name: 'Твои 3 траты за сегодня' })).toBeTruthy()
    const expenseFields = screen.getAllByRole('textbox')
    await user.type(expenseFields[0], 'Кофе 250')
    await user.type(expenseFields[1], 'Проезд 70')
    await user.type(expenseFields[2], 'Перекус 180')
    await user.click(screen.getByRole('button', { name: expenseArtifactContinueCta }))
    await user.click(screen.getByRole('radio', { name: 'Кофе/перекусы — их больше, чем думал(а)' }))
    await user.click(screen.getByRole('button', { name: reflectionContinueCta }))

    expect(screen.getByRole('heading', { name: 'Твоё правило на 3 дня' })).toBeTruthy()
    await user.click(screen.getByRole('radio', { name: 'Если совершаю любую трату, то сразу отмечаю её в заметках' }))
    await user.click(screen.getByRole('button', { name: ruleContinueCta }))

    expect(screen.getByRole('heading', { name: 'Сохранили в Навигатор' })).toBeTruthy()
    expect(screen.getByText(/Дальше — Уровень 1 · Раздел 1 · Урок 2/i)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Завершить' }))

    expect(screen.getByRole('heading', { name: 'Сохранили в Навигатор' })).toBeTruthy()
    expect(screen.getByText('Сохранено в Навигатор')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Урок пройден' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'К следующему уроку' }).getAttribute('href')).toBe('/lessons/mandatory-and-desired')

    await user.click(screen.getByRole('link', { name: 'К следующему уроку' }))

    expect(await screen.findByRole('heading', { name: 'Обязательное и желаемое' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Это мне точно нужно?' })).toBeTruthy()
    expect(getRouteTransitionFrame(container)).toHaveAttribute('data-route-transition', 'lesson-forward')
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

function getRouteTransitionFrame(container: HTMLElement) {
  const routeTransitionFrame = container.querySelector('[data-route-transition]')
  expect(routeTransitionFrame).toBeInstanceOf(HTMLElement)
  return routeTransitionFrame as HTMLElement
}

function mockElementScrollIntoView() {
  const scrollIntoView = vi.fn()
  const originalScrollIntoView = Element.prototype.scrollIntoView

  Element.prototype.scrollIntoView = scrollIntoView as Element['scrollIntoView']

  return {
    scrollIntoView,
    restore: () => {
      if (originalScrollIntoView) {
        Element.prototype.scrollIntoView = originalScrollIntoView
        return
      }

      delete (Element.prototype as Partial<Pick<Element, 'scrollIntoView'>>).scrollIntoView
    },
  }
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
    expect(screen.getByRole('region', { name: 'Итоговая сверка по колонкам' })).toBeTruthy(),
  )
  expect(screen.getByRole('button', { name: 'Поездка на такси. Сейчас: Проходит мимо внимания' })).toBeTruthy()
}

async function completeWhereMoneyGoesExternalExample(user: ReturnType<typeof userEvent.setup>) {
  expect(await screen.findByRole('heading', { name: 'Куда уходят деньги Кирилла?' })).toBeTruthy()
  expect(screen.getByText('56%')).toBeTruthy()

  await user.click(screen.getByRole('radio', { name: 'Он просто записал все траты и увидел картину' }))
  await user.click(screen.getByRole('button', { name: 'Проверить' }))

  expect(await screen.findByRole('status')).toHaveTextContent('Верно')
  await user.click(screen.getByRole('button', { name: externalExampleContinueCta }))
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
