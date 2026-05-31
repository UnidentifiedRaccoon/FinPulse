import type { Lesson, Module, Program, Unit } from '@/content/program'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export type ApiUser = {
  id: string
  login: string
  createdAt: string
}

export type ProgressItem = {
  viewed: boolean
  completed: boolean
  viewedAt: string | null
  completedAt: string | null
  updatedAt: string
}

export type LessonProgressItem = ProgressItem & {
  lessonSlug: string
}

export type CardProgressItem = ProgressItem & {
  cardId: string
}

export type ProgressResponse = {
  lessons: LessonProgressItem[]
  cards: CardProgressItem[]
}

export type ReflectionAnswerPayload = {
  textValue?: string
  singleValue?: string
  multiValues?: string[]
  selectedVariant?: string
  checkedRows?: string[]
  templateValues?: string[]
  fallbackValue?: string
}

export type ReflectionAnswer = {
  cardId: string
  cardType: 'reflection' | 'artifact'
  saveKey: string | null
  lessonSlug: string
  lessonTitle: string
  unitSlug: string
  unitTitle: string
  moduleSlug: string
  moduleTitle: string
  cardTitle: string | null
  prompt: string
  template: string[] | null
  answer: ReflectionAnswerPayload
  createdAt: string
  updatedAt: string
}

export type ReflectionAnswersResponse = {
  answers: ReflectionAnswer[]
}

export type UnitDetails = {
  module: Module
  unit: Unit
}

export type LessonDetails = {
  module: Module
  unit: Unit
  lesson: Lesson
  previous: { module: Module; unit: Unit; lesson: Lesson } | null
  next: { module: Module; unit: Unit; lesson: Lesson } | null
}

export class ApiError extends Error {
  status: number
  code: string

  constructor(message: string, status: number, code: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

type ProgressPayload = {
  viewed?: boolean
  completed?: boolean
}

export const api = {
  getProgram: () => request<Program>('/api/program'),
  getModules: () => request<Module[]>('/api/modules'),
  getModule: (moduleSlug: string) => request<Module>(`/api/modules/${encodeURIComponent(moduleSlug)}`),
  getUnit: (unitSlug: string) => request<UnitDetails>(`/api/units/${encodeURIComponent(unitSlug)}`),
  getLesson: (lessonSlug: string) => request<LessonDetails>(`/api/lessons/${encodeURIComponent(lessonSlug)}`),
  getCurrentUser: () => request<{ user: ApiUser }>('/api/auth/me'),
  register: (login: string, password: string) =>
    request<{ user: ApiUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),
  login: (login: string, password: string) =>
    request<{ user: ApiUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),
  logout: () =>
    request<void>('/api/auth/logout', {
      method: 'POST',
    }),
  getProgress: () => request<ProgressResponse>('/api/progress'),
  getReflectionAnswers: () => request<ReflectionAnswersResponse>('/api/reflections'),
  saveReflectionAnswer: (cardId: string, payload: ReflectionAnswerPayload) =>
    request<ReflectionAnswersResponse>(`/api/reflections/${encodeURIComponent(cardId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  markLessonProgress: (lessonSlug: string, payload: ProgressPayload) =>
    request<ProgressResponse>(`/api/progress/lessons/${encodeURIComponent(lessonSlug)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  markCardProgress: (cardId: string, payload: ProgressPayload) =>
    request<ProgressResponse>(`/api/progress/cards/${encodeURIComponent(cardId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await parseResponseJson(response)

  if (!response.ok) {
    const error = parseApiError(data)
    throw new ApiError(error.message, response.status, error.code)
  }

  return data as T
}

async function parseResponseJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function parseApiError(data: unknown) {
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    data.error &&
    typeof data.error === 'object' &&
    'message' in data.error &&
    typeof data.error.message === 'string'
  ) {
    const code = 'code' in data.error && typeof data.error.code === 'string' ? data.error.code : 'api_error'
    return {
      code,
      message: data.error.message,
    }
  }

  return {
    code: 'api_error',
    message: 'Не удалось выполнить запрос.',
  }
}
