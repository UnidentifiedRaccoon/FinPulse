import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { api, type ApiUser, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { AuthControls } from '@/features/auth/AuthControls'
import { buildProgramLearningPath, getProgressPercent } from '@/features/program-navigation/learningPath'

export function EntryPage({
  user,
  authError,
  isAuthBusy,
  isAuthReady,
  progress,
  onLogin,
  onRegister,
}: {
  user: ApiUser | null
  authError: string
  isAuthBusy: boolean
  isAuthReady: boolean
  progress: ProgressResponse | null
  onLogin: (login: string, password: string) => Promise<void>
  onRegister: (login: string, password: string) => Promise<void>
}) {
  if (!isAuthReady) {
    return (
      <EntrySection>
        <div className="rounded-[24px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5 shadow-[var(--fr-shadow-sm)]">
          <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">FinPulse</p>
          <h1 className="mt-2 text-2xl font-bold leading-8 tracking-normal text-[var(--fr-text-primary)]">
            Проверяем сессию
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--fr-text-secondary)]">
            Сейчас откроем нужный стартовый экран.
          </p>
        </div>
      </EntrySection>
    )
  }

  if (!user) {
    return (
      <EntrySection>
        <section className="flex flex-col gap-5" aria-labelledby="auth-entry-heading">
          <div className="flex flex-col gap-2">
            <h1
              id="auth-entry-heading"
              className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)] [overflow-wrap:anywhere]"
            >
              Войдите в FinPulse
            </h1>
            <p className="text-base leading-7 text-[var(--fr-text-secondary)]">
              Учебный аккаунт сохраняет прогресс уроков между сессиями.
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-md)]">
            <AuthControls
              error={authError}
              isBusy={isAuthBusy}
              onLogin={onLogin}
              onLogout={async () => undefined}
              onRegister={onRegister}
              user={null}
              variant="entry"
            />
          </div>
        </section>
      </EntrySection>
    )
  }

  return <WelcomeEntry progress={progress} user={user} />
}

function WelcomeEntry({ user, progress }: { user: ApiUser; progress: ProgressResponse | null }) {
  const programQuery = useApiQuery(api.getProgram, [])

  if (programQuery.status === 'loading') {
    return (
      <EntrySection>
        <WelcomeFrame title={`С возвращением, ${user.login}`}>
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">Загружаем ваш маршрут обучения.</p>
        </WelcomeFrame>
      </EntrySection>
    )
  }

  if (programQuery.status === 'error') {
    return (
      <EntrySection>
        <WelcomeFrame title={`С возвращением, ${user.login}`}>
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{programQuery.error.message}</p>
          <Button asChild className="mt-4 min-h-11 w-full" size="lg">
            <Link to="/program">Открыть программу</Link>
          </Button>
        </WelcomeFrame>
      </EntrySection>
    )
  }

  const path = buildProgramLearningPath(programQuery.data, progress)
  const firstLesson = path.modules[0]?.units[0]?.lessons[0]?.lesson ?? null
  const nextLesson = path.currentLesson?.lesson ?? firstLesson
  const continueTo = nextLesson && !path.isComplete ? `/lessons/${nextLesson.slug}` : '/program'
  const progressPercent = getProgressPercent(path.completedLessons, path.totalLessons)

  return (
    <EntrySection>
      <WelcomeFrame title={`С возвращением, ${user.login}`}>
        <div className="flex flex-col gap-4">
          <p className="text-base leading-7 text-[var(--fr-text-secondary)]">
            {path.isComplete
              ? 'Вы прошли текущий учебный маршрут. Можно вернуться к программе и повторить нужные уроки.'
              : nextLesson
                ? `Следующий шаг: ${nextLesson.title}.`
                : 'Маршрут обучения готов к просмотру.'}
          </p>

          <div className="flex flex-col gap-2">
            <p className="text-sm leading-5 text-[var(--fr-text-secondary)]">
              {path.completedLessons} из {path.totalLessons} уроков
            </p>
            <div
              aria-label={`${progressPercent}% маршрута завершено`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progressPercent}
              className="h-2 overflow-hidden rounded-full bg-[var(--fr-surface-soft)]"
              role="progressbar"
            >
              <div className="h-full rounded-full bg-[var(--fr-color-sky-500)]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="min-h-11 flex-1" size="lg">
              <Link to={continueTo}>{path.isComplete ? 'Смотреть программу' : 'Продолжить'}</Link>
            </Button>
            <Button asChild className="min-h-11 flex-1" size="lg" variant="outline">
              <Link to="/program">Программа</Link>
            </Button>
          </div>
        </div>
      </WelcomeFrame>
    </EntrySection>
  )
}

function EntrySection({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[calc(100svh-7rem)] flex-col justify-center py-4">{children}</div>
}

function WelcomeFrame({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section
      className="flex flex-col gap-5 rounded-[24px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5 shadow-[var(--fr-shadow-md)]"
      aria-labelledby="welcome-entry-heading"
    >
      <h1
        id="welcome-entry-heading"
        className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)] [overflow-wrap:anywhere]"
      >
        {title}
      </h1>
      {children}
    </section>
  )
}
