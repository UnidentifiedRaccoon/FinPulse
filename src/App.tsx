import { BookOpen } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router'

import { api, ApiError, type ApiUser, type ProgressResponse } from '@/api/client'
import { AuthControls } from '@/features/auth/AuthControls'
import { LessonPage } from '@/pages/LessonPage'
import { ModulePage } from '@/pages/ModulePage'
import { ProgramOverviewPage } from '@/pages/ProgramOverviewPage'
import { UnitPage } from '@/pages/UnitPage'

function App() {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [authError, setAuthError] = useState('')
  const [progressError, setProgressError] = useState('')
  const [progress, setProgress] = useState<ProgressResponse | null>(null)
  const [isAuthBusy, setIsAuthBusy] = useState(false)

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
        setProgressError(getApiMessage(error))
      }
    },
    [user],
  )

  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background text-foreground">
        <header className="border-b border-border bg-background/95">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <Link className="flex items-center gap-2 text-sm font-semibold" to="/">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen aria-hidden="true" />
              </span>
              <span>FinPulse</span>
            </Link>
            <AuthControls
              error={authError}
              isBusy={isAuthBusy}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onRegister={handleRegister}
              user={user}
            />
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 py-6">
          {progressError ? (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm leading-6 text-destructive">
              {progressError}
            </p>
          ) : null}
          <Routes>
            <Route path="/" element={<ProgramOverviewPage progress={progress} />} />
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
    </BrowserRouter>
  )
}

function getApiMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос.'
}

export default App
