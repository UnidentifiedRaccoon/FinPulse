import type { ReactNode } from 'react'
import {
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  Fingerprint,
  Layers3,
  LogOut,
  Mail,
  type LucideIcon,
} from 'lucide-react'

import { api, type ApiUser, type ProgressResponse, type ReflectionAnswer, type ReflectionAnswersResponse } from '@/api/client'
import type { Program } from '@/content/program'
import { useApiQuery } from '@/api/useApiQuery'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AuthControls } from '@/features/auth/AuthControls'
import { buildProgramLearningPath, getProgressPercent } from '@/features/program-navigation/learningPath'

export function EntryPage({
  user,
  authError,
  isAuthBusy,
  isAuthReady,
  progress,
  reflectionAnswers,
  onLogin,
  onLogout,
  onRegister,
}: {
  user: ApiUser | null
  authError: string
  isAuthBusy: boolean
  isAuthReady: boolean
  progress: ProgressResponse | null
  reflectionAnswers: ReflectionAnswersResponse | null
  onLogin: (login: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
  onRegister: (login: string, password: string) => Promise<void>
}) {
  if (!isAuthReady) {
    return (
      <EntrySection>
        <div className="rounded-[24px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5 shadow-[var(--fr-shadow-sm)]">
          <div className="min-w-0">
            <img alt="" aria-hidden="true" className="h-10 w-[116px] object-contain" src="/finpulse-logo.png" />
            <h1 className="mt-2 text-2xl font-bold leading-8 tracking-normal text-[var(--fr-text-primary)]">
              Проверяем сессию
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--fr-text-secondary)]">
              Сейчас откроем нужный стартовый экран.
            </p>
          </div>
        </div>
      </EntrySection>
    )
  }

  if (!user) {
    return (
      <EntrySection>
        <section className="flex flex-col gap-5" aria-labelledby="auth-entry-heading">
          <div className="min-w-0">
            <h1
              id="auth-entry-heading"
              className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)] [overflow-wrap:anywhere]"
            >
              Войдите в FinPulse
            </h1>
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

  return (
    <ProfileEntry
      authError={authError}
      isAuthBusy={isAuthBusy}
      onLogout={onLogout}
      progress={progress}
      reflectionAnswers={reflectionAnswers}
      user={user}
    />
  )
}

function ProfileEntry({
  authError,
  isAuthBusy,
  onLogout,
  user,
  progress,
  reflectionAnswers,
}: {
  authError: string
  isAuthBusy: boolean
  onLogout: () => Promise<void>
  user: ApiUser
  progress: ProgressResponse | null
  reflectionAnswers: ReflectionAnswersResponse | null
}) {
  const programQuery = useApiQuery(api.getProgram, [])
  const program = programQuery.status === 'success' ? programQuery.data : null
  const stats = buildProfileStats(program, progress)
  const identityLabel = isEmailLogin(user.login) ? 'Email' : 'Логин'
  const initial = getProfileInitial(user.login)

  return (
    <section aria-labelledby="profile-heading" className="flex flex-col gap-6 pb-8 pt-1">
      <div className="overflow-hidden rounded-[28px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] shadow-[var(--fr-shadow-md)]">
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[var(--fr-surface-soft)]">
          <div className="absolute inset-x-8 top-9 h-px bg-[var(--fr-border-default)]" />
          <div className="absolute inset-x-14 top-20 h-px bg-[var(--fr-border-subtle)]" />
          <div className="absolute bottom-[-2.5rem] flex size-30 items-center justify-center rounded-full border-[10px] border-[var(--fr-surface-card)] bg-[var(--fr-color-sky-500)] text-5xl font-black leading-none text-white shadow-[var(--fr-shadow-sm)]">
            {initial}
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 pb-5 pt-16">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase leading-4 tracking-normal text-[var(--fr-color-sky-600)]">Учебный аккаунт</p>
            <h1
              id="profile-heading"
              className="mt-1 text-[2rem] font-black leading-9 tracking-normal text-[var(--fr-text-primary)] [overflow-wrap:anywhere]"
            >
              Профиль
            </h1>
          </div>

          <dl className="flex flex-col gap-3 text-sm leading-5">
            <ProfileMetaRow Icon={Mail} label={identityLabel} value={user.login} />
            <ProfileMetaRow Icon={CalendarDays} label="Дата регистрации" value={formatRegistrationDate(user.createdAt)} />
            <ProfileMetaRow Icon={Fingerprint} label="ID" value={formatProfileId(user.id)} />
          </dl>
        </div>
      </div>

      <Separator className="bg-[var(--fr-border-default)]" />

      <PersonalAnswersSection answers={reflectionAnswers?.answers ?? []} />

      <Separator className="bg-[var(--fr-border-default)]" />

      <section aria-labelledby="profile-progress-heading" className="flex flex-col gap-3">
        <h2 id="profile-progress-heading" className="text-2xl font-black leading-8 tracking-normal text-[var(--fr-text-primary)]">
          Учебный прогресс
        </h2>
        {programQuery.status === 'error' ? (
          <p className="rounded-[18px] border border-[var(--fr-color-danger-500)]/30 bg-[var(--fr-color-danger-50)] p-3 text-sm leading-6 text-[var(--fr-color-danger-500)]">
            {programQuery.error.message}
          </p>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <ProfileStatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <MobileAccountLogout authError={authError} isAuthBusy={isAuthBusy} onLogout={onLogout} />
    </section>
  )
}

function ProfileMetaRow({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--fr-color-sky-600)]" />
      <div className="min-w-0">
        <dt className="font-bold text-[var(--fr-text-primary)]">{label}</dt>
        <dd className="break-all text-[var(--fr-text-secondary)]">{value}</dd>
      </div>
    </div>
  )
}

type ProfileStat = {
  label: string
  value: string
  Icon: LucideIcon
}

function ProfileStatCard({ stat }: { stat: ProfileStat }) {
  const Icon = stat.Icon

  return (
    <article className="min-h-28 rounded-[18px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-sm)]">
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-1 size-6 shrink-0 text-[var(--fr-color-sky-600)]" />
        <div className="min-w-0">
          <p className="text-2xl font-black leading-8 text-[var(--fr-text-primary)]">{stat.value}</p>
          <p className="mt-1 text-sm font-bold leading-5 text-[var(--fr-text-secondary)]">{stat.label}</p>
        </div>
      </div>
    </article>
  )
}

function PersonalAnswersSection({ answers }: { answers: ReflectionAnswer[] }) {
  return (
    <section aria-labelledby="personal-answers-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-black uppercase leading-4 tracking-normal text-[var(--fr-color-sky-600)]">Навигатор</p>
        <h2 id="personal-answers-heading" className="text-2xl font-black leading-8 tracking-normal text-[var(--fr-text-primary)]">
          Персональный финансовый навигатор
        </h2>
      </div>

      {answers.length === 0 ? (
        <p className="rounded-[18px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
          Здесь появятся ответы после заданий с рефлексией и рабочими блоками.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {answers.map((answer) => (
            <PersonalAnswerItem answer={answer} key={answer.cardId} />
          ))}
        </div>
      )}
    </section>
  )
}

function PersonalAnswerItem({ answer }: { answer: ReflectionAnswer }) {
  const entries = getAnswerEntries(answer)

  return (
    <article className="rounded-[18px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-sm)]">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase leading-4 tracking-normal text-[var(--fr-text-tertiary)]">
            {stripSectionCode(answer.unitTitle)} · {answer.lessonTitle}
          </p>
          <h4 className="mt-1 text-base font-black leading-6 tracking-normal text-[var(--fr-text-primary)]">
            {answer.cardTitle ?? (answer.cardType === 'artifact' ? 'Рабочий блок' : 'Ответ')}
          </h4>
          <p className="mt-2 text-sm leading-6 text-[var(--fr-text-secondary)]">{answer.prompt}</p>
        </div>

        <dl className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              className="rounded-2xl bg-[var(--fr-surface-soft)] px-3 py-2 text-sm leading-6"
              key={`${entry.label ?? 'answer'}-${entry.value}`}
            >
              {entry.label ? <dt className="font-bold text-[var(--fr-text-primary)]">{entry.label}</dt> : null}
              <dd className="whitespace-pre-wrap break-words text-[var(--fr-text-secondary)]">{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

function getAnswerEntries(answer: ReflectionAnswer) {
  const entries: Array<{ label?: string; value: string }> = []
  const answerValue = answer.answer
  const textValue = answerValue.textValue?.trim()
  const singleValue = answerValue.singleValue?.trim()
  const fallbackValue = answerValue.fallbackValue?.trim()
  const selectedVariant = answerValue.selectedVariant?.trim()

  if (singleValue) entries.push({ value: singleValue })
  for (const value of answerValue.multiValues ?? []) {
    const trimmed = value.trim()
    if (trimmed) entries.push({ value: trimmed })
  }
  if (textValue) entries.push({ value: textValue })
  if (selectedVariant) entries.push({ label: 'Вариант', value: selectedVariant })
  for (const [index, value] of (answerValue.templateValues ?? []).entries()) {
    const trimmed = value.trim()
    if (trimmed) {
      entries.push({ label: answer.template?.[index] ?? `Строка ${index + 1}`, value: trimmed })
    }
  }
  if (fallbackValue) entries.push({ value: fallbackValue })

  return entries.length > 0 ? entries : [{ value: 'Ответ сохранён.' }]
}

function stripSectionCode(title: string) {
  return title.replace(/^\d{2}\.\d{2}\s+/, '')
}

function buildProfileStats(program: Program | null, progress: ProgressResponse | null): ProfileStat[] {
  const path = program ? buildProgramLearningPath(program, progress) : null
  const completedLessons = path?.completedLessons ?? countProgressItems(progress?.lessons, 'completed')
  const totalLessons = path?.totalLessons ?? null
  const viewedLessons = countProgressItems(progress?.lessons, 'viewed')
  const completedCards = countProgressItems(progress?.cards, 'completed')
  const progressPercent = path ? getProgressPercent(path.completedLessons, path.totalLessons) : 0

  return [
    {
      label: 'Пройдено уроков',
      value: totalLessons ? `${completedLessons}/${totalLessons}` : String(completedLessons),
      Icon: BookOpenCheck,
    },
    {
      label: 'Прогресс маршрута',
      value: `${progressPercent}%`,
      Icon: Layers3,
    },
    {
      label: 'Просмотрено уроков',
      value: String(viewedLessons),
      Icon: ClipboardCheck,
    },
    {
      label: 'Карточек завершено',
      value: String(completedCards),
      Icon: Layers3,
    },
  ]
}

function countProgressItems(items: Array<{ viewed: boolean; completed: boolean }> | undefined, key: 'viewed' | 'completed') {
  return items?.filter((item) => item[key]).length ?? 0
}

function isEmailLogin(login: string) {
  return login.includes('@')
}

function getProfileInitial(login: string) {
  return login.trim().charAt(0).toLocaleUpperCase('ru-RU') || 'F'
}

function formatProfileId(id: string) {
  if (id.length <= 18) return id
  return `${id.slice(0, 8)}...${id.slice(-6)}`
}

const registrationDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatRegistrationDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Дата недоступна'
  return registrationDateFormatter.format(date).replace(/\s?г\.$/, '')
}

function MobileAccountLogout({
  authError,
  isAuthBusy,
  onLogout,
}: {
  authError: string
  isAuthBusy: boolean
  onLogout: () => Promise<void>
}) {
  return (
    <div className="flex flex-col gap-2 lg:hidden">
      {authError ? <p className="text-sm leading-5 text-[var(--fr-color-danger-500)]">{authError}</p> : null}
      <Button className="min-h-11 w-full rounded-[18px]" disabled={isAuthBusy} onClick={onLogout} size="lg" type="button" variant="outline">
        <LogOut data-icon="inline-start" />
        Выйти
      </Button>
    </div>
  )
}

function EntrySection({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[calc(100svh-7rem)] flex-col justify-center py-4">{children}</div>
}
