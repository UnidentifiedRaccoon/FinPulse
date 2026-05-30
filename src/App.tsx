import { useCallback, useEffect, useState } from 'react'
import { CircleUserRound, LogIn, LogOut, Map, type LucideIcon } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router'

import { api, ApiError, type ApiUser, type ProgressResponse } from '@/api/client'
import { LessonPage } from '@/pages/LessonPage'
import { EntryPage } from '@/pages/EntryPage'
import { ModulePage } from '@/pages/ModulePage'
import { ProgramOverviewPage } from '@/pages/ProgramOverviewPage'
import { UnitPage } from '@/pages/UnitPage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const showMobileNavigation = !isLessonRoute

  return (
    <div className="min-h-svh bg-[var(--fr-surface-canvas)] text-[var(--fr-text-primary)] lg:pl-[18rem]">
      <DesktopAppSidebar
        authError={authError}
        isAuthBusy={isAuthBusy}
        onLogout={onLogout}
        pathname={location.pathname}
        user={user}
      />

      <main
        className={cn(
          'mx-auto w-full px-4',
          isLessonRoute ? 'max-w-none py-6 lg:px-8' : 'max-w-[560px] py-5 sm:py-6 lg:max-w-[720px]',
          showMobileNavigation ? 'pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:pb-8' : null,
        )}
      >
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
                onLogout={onLogout}
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
  label: 'Аккаунт',
  to: '/',
  Icon: CircleUserRound,
  isActive: (pathname) => pathname === '/',
}

const desktopNavigationItems: NavigationItem[] = [learningNavigationItem, accountNavigationItem]

function getMobileNavigationItems(user: ApiUser | null): NavigationItem[] {
  return [
    learningNavigationItem,
    {
      label: user ? 'Аккаунт' : 'Войти',
      to: '/',
      Icon: user ? CircleUserRound : LogIn,
      isActive: (pathname) => pathname === '/',
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
          className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/25"
          to="/"
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

export default App
