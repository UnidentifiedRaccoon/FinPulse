import { useCallback, useEffect, useState } from 'react'
import { CircleUserRound, LogIn, LogOut, Map, type LucideIcon } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'

import { api, ApiError, type ApiUser, type ProgressResponse, type ReflectionAnswerPayload, type ReflectionAnswersResponse } from '@/api/client'
import { LessonPage } from '@/pages/LessonPage'
import { EntryPage } from '@/pages/EntryPage'
import { ModulePage } from '@/pages/ModulePage'
import { ProgramOverviewPage } from '@/pages/ProgramOverviewPage'
import { UnitPage } from '@/pages/UnitPage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LOGOUT_MARKER_KEY = 'finpulse:logged-out'

function App() {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [authError, setAuthError] = useState('')
  const [progressError, setProgressError] = useState('')
  const [reflectionError, setReflectionError] = useState('')
  const [progress, setProgress] = useState<ProgressResponse | null>(null)
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswersResponse | null>(null)
  const [isAuthBusy, setIsAuthBusy] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(() => hasLogoutMarker())

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
        reflectionAnswers={reflectionAnswers}
        reflectionError={reflectionError}
        saveReflectionAnswer={saveReflectionAnswer}
        user={user}
      />
    </BrowserRouter>
  )
}

function AppShell({
  user,
  authError,
  progressError,
  reflectionError,
  reflectionAnswers,
  progress,
  isAuthBusy,
  isAuthReady,
  onLogin,
  onRegister,
  onLogout,
  markLessonProgress,
  markCardProgress,
  saveReflectionAnswer,
}: {
  user: ApiUser | null
  authError: string
  progressError: string
  reflectionError: string
  reflectionAnswers: ReflectionAnswersResponse | null
  progress: ProgressResponse | null
  isAuthBusy: boolean
  isAuthReady: boolean
  onLogin: (login: string, password: string) => Promise<void>
  onRegister: (login: string, password: string) => Promise<void>
  onLogout: () => Promise<boolean>
  markLessonProgress: (lessonSlug: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
  markCardProgress: (cardId: string, payload: { viewed?: boolean; completed?: boolean }) => Promise<void>
  saveReflectionAnswer: (cardId: string, payload: ReflectionAnswerPayload) => Promise<void>
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isLessonRoute = location.pathname.startsWith('/lessons/')
  const showAuthenticatedShell = Boolean(user)
  const showMobileNavigation = showAuthenticatedShell && !isLessonRoute
  const handleLogoutAndRedirect = useCallback(async () => {
    const didLogout = await onLogout()
    if (didLogout) {
      navigate('/', { replace: true })
    }
  }, [navigate, onLogout])

  return (
    <div
      className={cn(
        'min-h-svh bg-[var(--fr-surface-canvas)] text-[var(--fr-text-primary)]',
        showAuthenticatedShell && 'lg:pl-[18rem]',
      )}
    >
      {showAuthenticatedShell ? (
        <DesktopAppSidebar
          authError={authError}
          isAuthBusy={isAuthBusy}
          onLogout={handleLogoutAndRedirect}
          pathname={location.pathname}
          user={user}
        />
      ) : null}

      <main
        className={cn(
          'mx-auto w-full px-4',
          showAuthenticatedShell && isLessonRoute
            ? 'max-w-none py-6 lg:px-8'
            : 'max-w-[560px] py-5 sm:py-6 lg:max-w-[720px]',
          showMobileNavigation ? 'pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:pb-8' : null,
        )}
      >
        {showAuthenticatedShell
          ? [progressError, reflectionError].filter(Boolean).map((error) => (
              <p
                className="mb-4 rounded-[18px] border border-[var(--fr-color-danger-500)]/30 bg-[var(--fr-color-danger-50)] p-3 text-sm leading-6 text-[var(--fr-color-danger-500)]"
                key={error}
              >
                {error}
              </p>
            ))
          : null}
        {showAuthenticatedShell ? (
          <Routes>
            <Route path="/" element={<Navigate to="/program" replace />} />
            <Route
              path="/profile"
              element={
                <EntryPage
                  authError={authError}
                  isAuthBusy={isAuthBusy}
                  isAuthReady={isAuthReady}
                  onLogin={onLogin}
                  onLogout={handleLogoutAndRedirect}
                  onRegister={onRegister}
                  progress={progress}
                  reflectionAnswers={reflectionAnswers}
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
                  saveReflectionAnswer={saveReflectionAnswer}
                  user={user}
                />
              }
            />
            <Route path="*" element={<Navigate to="/program" replace />} />
          </Routes>
        ) : (
          <EntryPage
            authError={authError}
            isAuthBusy={isAuthBusy}
            isAuthReady={isAuthReady}
            onLogin={onLogin}
            onLogout={handleLogoutAndRedirect}
            onRegister={onRegister}
            progress={null}
            reflectionAnswers={null}
            user={null}
          />
        )}
      </main>

      {showMobileNavigation ? (
        <MobileBottomNavigation
          authError={authError}
          pathname={location.pathname}
          user={user}
        />
      ) : null}
    </div>
  )
}

type NavigationItem = {
  label: string
  to: string
  Icon: LucideIcon
  isActive: (pathname: string) => boolean
}

const learningNavigationItem: NavigationItem = {
  label: 'Обучение',
  to: '/program',
  Icon: Map,
  isActive: (pathname) => pathname === '/program' || pathname.startsWith('/modules/') || pathname.startsWith('/lessons/'),
}

const accountNavigationItem: NavigationItem = {
  label: 'Профиль',
  to: '/profile',
  Icon: CircleUserRound,
  isActive: (pathname) => pathname === '/profile',
}

const desktopNavigationItems: NavigationItem[] = [learningNavigationItem, accountNavigationItem]

function getMobileNavigationItems(user: ApiUser | null): NavigationItem[] {
  return [
    learningNavigationItem,
    {
      label: user ? 'Профиль' : 'Войти',
      to: user ? '/profile' : '/',
      Icon: user ? CircleUserRound : LogIn,
      isActive: (pathname) => (user ? pathname === '/profile' : pathname === '/'),
    },
  ]
}

const navigationIconClassName =
  'flex items-center justify-center rounded-2xl text-[var(--fr-color-sky-500)] transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100'

const mobileNavigationItemClassName =
  'group flex min-h-14 items-center justify-center border border-transparent font-black uppercase tracking-normal text-[var(--fr-text-secondary)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/25 disabled:opacity-50 motion-reduce:transition-none flex-col gap-1 rounded-[18px] px-2 py-2 text-[11px] leading-4 hover:bg-[var(--fr-surface-soft)] hover:text-[var(--fr-color-sky-600)]'

const logoutButtonClassName =
  'min-h-11 w-full justify-start rounded-[18px] px-3 text-[var(--fr-text-secondary)] hover:bg-[var(--fr-surface-soft)] hover:text-[var(--fr-color-sky-600)]'

function DesktopAppSidebar({
  user,
  authError,
  isAuthBusy,
  onLogout,
  pathname,
}: {
  user: ApiUser | null
  authError: string
  isAuthBusy: boolean
  onLogout: () => Promise<void>
  pathname: string
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] lg:flex">
      <div className="px-6 pb-6 pt-8">
        <Link
          aria-label="FinPulse"
          className="inline-flex min-h-11 items-center rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/25"
          to="/program"
        >
          <img
            alt=""
            aria-hidden="true"
            className="h-auto w-[212px] max-w-full object-contain"
            height={227}
            src="/assets/brand/finpulse-wordmark.png"
            width={1200}
          />
        </Link>
      </div>

      <AppNavigation ariaLabel="Боковое меню приложения" items={desktopNavigationItems} pathname={pathname} variant="desktop" />

      <DesktopAccountDock
        authError={authError}
        isAuthBusy={isAuthBusy}
        onLogout={onLogout}
        user={user}
      />
    </aside>
  )
}

function DesktopAccountDock({
  user,
  authError,
  isAuthBusy,
  onLogout,
}: {
  user: ApiUser | null
  authError: string
  isAuthBusy: boolean
  onLogout: () => Promise<void>
}) {
  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-[var(--fr-border-subtle)] p-4">
      {user ? (
        <>
          <div className="min-w-0 px-2">
            <p className="truncate text-sm font-bold leading-5 text-[var(--fr-text-primary)]">{user.login}</p>
          </div>
          <Button className={logoutButtonClassName} disabled={isAuthBusy} onClick={onLogout} type="button" variant="ghost">
            <LogOut data-icon="inline-start" />
            Выйти
          </Button>
        </>
      ) : (
        <Button asChild className="min-h-12 w-full justify-start rounded-[18px]" variant="outline">
          <Link to="/">
            <LogIn data-icon="inline-start" />
            Войти
          </Link>
        </Button>
      )}
      {authError ? <p className="text-sm leading-5 text-[var(--fr-color-danger-500)]">{authError}</p> : null}
    </div>
  )
}

function MobileBottomNavigation({
  user,
  authError,
  pathname,
}: {
  user: ApiUser | null
  authError: string
  pathname: string
}) {
  const mobileItems = getMobileNavigationItems(user)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--fr-border-default)] bg-[var(--fr-surface-card)]/96 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(18,52,89,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-2">
        {authError ? <p className="text-xs leading-4 text-[var(--fr-color-danger-500)]">{authError}</p> : null}
        <nav
          aria-label="Нижнее меню приложения"
          className="grid w-full grid-cols-2 gap-2"
        >
          {mobileItems.map((item) => (
            <AppNavigationLink isActive={item.isActive(pathname)} item={item} key={item.label} variant="mobile" />
          ))}
        </nav>
      </div>
    </div>
  )
}

function AppNavigation({
  ariaLabel,
  items,
  pathname,
  variant,
}: {
  ariaLabel: string
  items: NavigationItem[]
  pathname: string
  variant: 'desktop' | 'mobile'
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        variant === 'desktop' && 'flex flex-1 flex-col gap-2 px-4',
        variant === 'mobile' && 'mx-auto grid w-full max-w-[560px] grid-cols-2 gap-2',
      )}
    >
      {items.map((item) => (
        <AppNavigationLink isActive={item.isActive(pathname)} item={item} key={item.label} variant={variant} />
      ))}
    </nav>
  )
}

function AppNavigationLink({
  item,
  isActive,
  variant,
}: {
  item: NavigationItem
  isActive: boolean
  variant: 'desktop' | 'mobile'
}) {
  const Icon = item.Icon

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group flex min-h-14 items-center border border-transparent font-black uppercase tracking-normal text-[var(--fr-text-secondary)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/25 motion-reduce:transition-none',
        variant === 'desktop' &&
          'gap-4 rounded-[22px] px-4 text-sm leading-5 hover:bg-[var(--fr-surface-soft)] hover:text-[var(--fr-color-sky-600)]',
        variant === 'mobile' && mobileNavigationItemClassName,
        isActive && 'border-[var(--fr-color-sky-400)] bg-[var(--fr-color-brand-50)] text-[var(--fr-color-sky-600)]',
      )}
      to={item.to}
    >
      <span
        className={cn(
          navigationIconClassName,
          variant === 'desktop' && 'size-10',
          variant === 'mobile' && 'size-8',
          isActive && 'text-[var(--fr-color-sky-600)]',
        )}
      >
        <Icon aria-hidden="true" className={cn(variant === 'desktop' ? 'size-7' : 'size-6')} />
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
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
