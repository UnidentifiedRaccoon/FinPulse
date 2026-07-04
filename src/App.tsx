import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router'

import { api, ApiError, type ApiUser, type ProgressResponse, type ReflectionAnswerPayload, type ReflectionAnswersResponse } from '@/api/client'
import { LearningContentProvider } from '@/api/contentClient'
import { publicLearningContentClient } from '@/api/publicContentClient'
import { LearnerAppShell } from '@/app/LearnerAppShell'
import { isCategorizationColumnsPreviewPath } from '@/app/learnerRoutes'

const LOGOUT_MARKER_KEY = 'finpulse:logged-out'

function App() {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [authError, setAuthError] = useState('')
  const [progressError, setProgressError] = useState('')
  const [reflectionError, setReflectionError] = useState('')
  const [progress, setProgress] = useState<ProgressResponse | null>(null)
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswersResponse | null>(null)
  const [isAuthBusy, setIsAuthBusy] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(
    () => hasLogoutMarker() || isCategorizationColumnsPreviewPath(window.location.pathname),
  )

  const clearAuthenticatedState = useCallback(() => {
    setUser(null)
    setProgress(null)
    setProgressError('')
    setReflectionAnswers(null)
    setReflectionError('')
  }, [])

  const syncLoggedOutHistoryState = useCallback(() => {
    if (!hasLogoutMarker()) return
    clearAuthenticatedState()
    setAuthError('')
    setIsAuthReady(true)
  }, [clearAuthenticatedState])

  const refreshProgress = useCallback(async () => {
    try {
      const nextProgress = await api.getProgress()
      setProgress(nextProgress)
      setProgressError('')
    } catch (error) {
      setProgressError(getApiMessage(error))
    }
  }, [])

  const refreshReflectionAnswers = useCallback(async () => {
    try {
      const nextAnswers = await api.getReflectionAnswers()
      setReflectionAnswers(nextAnswers)
      setReflectionError('')
    } catch (error) {
      setReflectionError(getApiMessage(error))
    }
  }, [])

  useEffect(() => {
    let isActive = true

    if (isCategorizationColumnsPreviewPath(window.location.pathname)) {
      return () => {
        isActive = false
      }
    }

    if (hasLogoutMarker()) {
      return () => {
        isActive = false
      }
    }

    api
      .getCurrentUser()
      .then(async ({ user: currentUser }) => {
        if (!isActive) return
        setUser(currentUser)
        const [nextProgress, nextReflectionAnswers] = await Promise.all([api.getProgress(), api.getReflectionAnswers()])
        if (!isActive) return
        setProgress(nextProgress)
        setReflectionAnswers(nextReflectionAnswers)
      })
      .catch((error: unknown) => {
        if (!isActive) return
        if (error instanceof ApiError && error.status === 401) {
          setUser(null)
          setProgress(null)
          setReflectionAnswers(null)
          return
        }
        setAuthError(getApiMessage(error))
      })
      .finally(() => {
        if (!isActive) return
        setIsAuthReady(true)
      })

    return () => {
      isActive = false
    }
  }, [clearAuthenticatedState])

  useEffect(() => {
    window.addEventListener('pageshow', syncLoggedOutHistoryState)
    window.addEventListener('popstate', syncLoggedOutHistoryState)

    return () => {
      window.removeEventListener('pageshow', syncLoggedOutHistoryState)
      window.removeEventListener('popstate', syncLoggedOutHistoryState)
    }
  }, [syncLoggedOutHistoryState])

  const handleLogin = async (login: string, password: string) => {
    setIsAuthBusy(true)
    setAuthError('')
    try {
      const response = await api.login(login, password)
      clearLogoutMarker()
      setUser(response.user)
      await Promise.all([refreshProgress(), refreshReflectionAnswers()])
    } catch (error) {
      setAuthError(getApiMessage(error))
    } finally {
      setIsAuthBusy(false)
    }
  }

  const handleRegister = async (login: string, password: string) => {
    setIsAuthBusy(true)
    setAuthError('')
    try {
      const response = await api.register(login, password)
      clearLogoutMarker()
      setUser(response.user)
      await Promise.all([refreshProgress(), refreshReflectionAnswers()])
    } catch (error) {
      setAuthError(getApiMessage(error))
    } finally {
      setIsAuthBusy(false)
    }
  }

  const handleLogout = async () => {
    setIsAuthBusy(true)
    setAuthError('')
    try {
      await api.logout()
      markLogout()
      clearAuthenticatedState()
      return true
    } catch (error) {
      setAuthError(getApiMessage(error))
      return false
    } finally {
      setIsAuthBusy(false)
    }
  }

  const markLessonProgress = useCallback(
    async (lessonSlug: string, payload: { viewed?: boolean; completed?: boolean }) => {
      if (!user) return
      try {
        const nextProgress = await api.markLessonProgress(lessonSlug, payload)
        setProgress(nextProgress)
        setProgressError('')
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuthenticatedState()
          if (payload.completed) throw error
          return
        }
        setProgressError(getApiMessage(error))
        if (payload.completed) throw error
      }
    },
    [clearAuthenticatedState, user],
  )

  const markCardProgress = useCallback(
    async (cardId: string, payload: { viewed?: boolean; completed?: boolean }) => {
      if (!user) return
      try {
        const nextProgress = await api.markCardProgress(cardId, payload)
        setProgress(nextProgress)
        setProgressError('')
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuthenticatedState()
          if (payload.completed) throw error
          return
        }
        setProgressError(getApiMessage(error))
        if (payload.completed) throw error
      }
    },
    [clearAuthenticatedState, user],
  )

  const saveReflectionAnswer = useCallback(
    async (cardId: string, payload: ReflectionAnswerPayload) => {
      if (!user) return
      try {
        const nextAnswers = await api.saveReflectionAnswer(cardId, payload)
        setReflectionAnswers(nextAnswers)
        setReflectionError('')
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuthenticatedState()
          throw error
        }
        setReflectionError(getApiMessage(error))
        throw error
      }
    },
    [clearAuthenticatedState, user],
  )

  return (
    <BrowserRouter>
      <LearningContentProvider client={publicLearningContentClient}>
        <LearnerAppShell
          authError={authError}
          isAuthReady={isAuthReady}
          isAuthBusy={isAuthBusy}
          markCardProgress={markCardProgress}
          markLessonProgress={markLessonProgress}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onRegister={handleRegister}
          progress={progress}
          progressError={progressError}
          reflectionAnswers={reflectionAnswers}
          reflectionError={reflectionError}
          saveReflectionAnswer={saveReflectionAnswer}
          user={user}
        />
      </LearningContentProvider>
    </BrowserRouter>
  )
}

function getApiMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос.'
}

function markLogout() {
  try {
    window.sessionStorage.setItem(LOGOUT_MARKER_KEY, String(Date.now()))
  } catch {
    // Storage can be unavailable in restricted browser modes; state clearing still protects the live app.
  }
}

function clearLogoutMarker() {
  try {
    window.sessionStorage.removeItem(LOGOUT_MARKER_KEY)
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}

function hasLogoutMarker() {
  try {
    return window.sessionStorage.getItem(LOGOUT_MARKER_KEY) !== null
  } catch {
    return false
  }
}

export default App
