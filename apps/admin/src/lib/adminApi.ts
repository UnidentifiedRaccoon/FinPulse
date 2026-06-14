import type { AdminMeResponse, AdminSummaryResponse, AdminUserProgressResponse, AdminUsersResponse } from './types'

export class AdminApiError extends Error {
  status: number
  code: string

  constructor(message: string, status: number, code: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

type LoginResponse = AdminMeResponse

export const adminApi = {
  getMe: () => request<AdminMeResponse>('/api/admin/auth/me'),
  login: (login: string, password: string) =>
    request<LoginResponse>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),
  logout: () =>
    request<void>('/api/admin/auth/logout', {
      method: 'POST',
    }),
  getSummary: () => request<AdminSummaryResponse>('/api/admin/summary'),
  getUsers: (search: string) => {
    const params = new URLSearchParams()
    const normalizedSearch = search.trim()
    if (normalizedSearch) {
      params.set('search', normalizedSearch)
    }

    const query = params.toString()
    return request<AdminUsersResponse>(`/api/admin/users${query ? `?${query}` : ''}`)
  },
  getUserProgress: (userId: string) => request<AdminUserProgressResponse>(`/api/admin/users/${encodeURIComponent(userId)}/progress`),
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
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

  const data = await parseJson(response)
  if (!response.ok) {
    const error = parseApiError(data)
    throw new AdminApiError(error.message, response.status, error.code)
  }

  return data as T
}

async function parseJson(response: Response) {
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
    return {
      code: 'code' in data.error && typeof data.error.code === 'string' ? data.error.code : 'api_error',
      message: data.error.message,
    }
  }

  return {
    code: 'api_error',
    message: 'Не удалось выполнить запрос.',
  }
}
