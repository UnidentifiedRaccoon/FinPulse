import { BookOpen } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router'

import { api, ApiError, type ApiUser, type ProgressResponse } from '@/api/client'
import { AuthControls } from '@/features/auth/AuthControls'
import { LessonPage } from '@/pages/LessonPage'
import { EntryPage } from '@/pages/EntryPage'
import { ModulePage } from '@/pages/ModulePage'
import { ProgramOverviewPage } from '@/pages/ProgramOverviewPage'
import { UnitPage } from '@/pages/UnitPage'

function App() {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [authError, setAuthError] = useState('')
  const [progressError, setProgressError] = useState('')
  const [progress, setProgress] = useState<ProgressResponse | null>(null)
  const [isAuthBusy, setIsAuthBusy] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)

  const refreshProgress = useCallback(async () => {
    try {
      const nextProgress = await api.getProgress()
      setProgress(nextProgress)
      setProgressError('')
    } catch (error) {
      setProgressError(getApiMessage(error))
    }
  }, [])

  useEffect(() => {
    let isActive = true

    api
      .getCurrentUser()
      .then(async ({ user: currentUser }) => {
        if (!isActive) return
        setUser(currentUser)
        const nextProgress = await api.getProgress()
        if (!isActive) return
        setProgress(nextProgress)
      })
      .catch((error: unknown) => {
        if (!isActive) return
        if (error instanceof ApiError && error.status === 401) {
          setUser(null)
          setProgress(null)
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
  }, [])

  const handleLogin = async (login: string, password: string) => {
    setIsAuthBusy(true)
    setAuthError('')
    try {
      const response = await api.login(login, password)
      setUser(response.user)
      await refreshProgress()
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
      setUser(response.user)
      await refreshProgress()
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
      setUser(null)
      setProgress(null)
      setProgressError('')
    } catch (error) {
      setAuthError(getApiMessage(error))
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
          setProgress(null)
          setProgressError('')
          return
        }
        setProgressError(getApiMessage(error))
      }
    },
    [user],
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
          setProgress(null)
          setProgressError('')
          return
        }
        setProgressError(getApiMessage(error))
      }
    },
    [user],
  )

  return (
    <BrowserRouter>
      <AppShell
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
        user={user}
      />
    </BrowserRouter>
  )
}

function AppShell({
  user,
  authError,
  progressError,
  progress,
  isAuthBusy,
  isAuthReady,
  onLogin,
  onRegister,
  onLogout,
  markLessonProgress,
  markCardProgress,
}: {
  user: ApiUser | null
  authError: string
  progressError: string
  progress: ProgressResponse | null
  isAuthBusy: boolean
  isAuthReady: boolean
  onLogin: (login: string, password: string) => Promise<void>
  onRegister: (login: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
  markLessonProgress: (lessonSlug: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
  markCardProgress: (cardId: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
}) {
  const location = useLocation()
  const isLessonRoute = location.pathname.startsWith('/lessons/')
  const isEntryRoute = location.pathname === '/'

  return (
    <div className="min-h-svh bg-[var(--fr-surface-canvas)] text-[var(--fr-text-primary)]">
      {!isLessonRoute ? (
        <header className="border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-canvas)]/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[560px] items-center justify-between gap-3 px-4 py-3">
            <Link className="flex items-center gap-2 text-sm font-bold text-[var(--fr-text-primary)]" to="/">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--fr-color-sky-500)] text-white shadow-[var(--fr-shadow-sm)]">
                <BookOpen aria-hidden="true" />
              </span>
              <span>FinPulse</span>
            </Link>
            {isEntryRoute && !user ? null : user ? (
              <AuthControls
                error={authError}
                isBusy={isAuthBusy}
                onLogin={onLogin}
                onLogout={onLogout}
                onRegister={onRegister}
                user={user}
              />
            ) : (
              <>
                <details className="relative sm:hidden">
                  <summary className="flex min-h-9 cursor-pointer list-none items-center rounded-xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-3 text-sm font-semibold text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-sm)] [&::-webkit-details-marker]:hidden">
                    Войти
                  </summary>
                  <div className="absolute right-0 top-11 z-30 w-[min(340px,calc(100vw-2rem))] rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-3 shadow-[var(--fr-shadow-md)]">
                    <AuthControls
                      error={authError}
                      isBusy={isAuthBusy}
                      onLogin={onLogin}
                      onLogout={onLogout}
                      onRegister={onRegister}
                      user={user}
                    />
                  </div>
                </details>
                <div className="hidden sm:block">
                  <AuthControls
                    error={authError}
                    isBusy={isAuthBusy}
                    onLogin={onLogin}
                    onLogout={onLogout}
                    onRegister={onRegister}
                    user={user}
                  />
                </div>
              </>
            )}
          </div>
        </header>
      ) : null}

      <main className={`mx-auto w-full px-4 ${isLessonRoute ? 'max-w-none py-6' : 'max-w-[560px] py-5 sm:py-6'}`}>
        {progressError ? (
          <p className="mb-4 rounded-[18px] border border-[var(--fr-color-danger-500)]/30 bg-[var(--fr-color-danger-50)] p-3 text-sm leading-6 text-[var(--fr-color-danger-500)]">
            {progressError}
          </p>
        ) : null}
        <Routes>
          <Route
            path="/"
            element={
              <EntryPage
                authError={authError}
                isAuthBusy={isAuthBusy}
                isAuthReady={isAuthReady}
                onLogin={onLogin}
                onRegister={onRegister}
                progress={progress}
                user={user}
              />
            }
          />
          <Route path="/program" element={<ProgramOverviewPage progress={progress} />} />
          <Route path="/modules/:moduleSlug" element={<ModulePage progress={progress} />} />
          <Route path="/modules/:moduleSlug/units/:unitSlug" element={<UnitPage progress={progress} />} />
          <Route
            path="/lessons/:lessonSlug"
            element={
              <LessonPage
                markCardProgress={markCardProgress}
                markLessonProgress={markLessonProgress}
                progress={progress}
                user={user}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function getApiMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос.'
}

export default App
