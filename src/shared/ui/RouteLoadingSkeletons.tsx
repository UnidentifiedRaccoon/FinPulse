import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const pathNodeOffsets = ['translate-x-7', '-translate-x-9']
const pathBackLabelSkeletonWidth: Record<'level' | 'section', string> = {
  level: 'w-32',
  section: 'w-16',
}

export function ProgramOverviewSkeleton() {
  return (
    <div
      aria-label="Подготавливаем уровни"
      aria-live="polite"
      className="flex flex-col gap-6 pb-8"
      data-testid="program-loading-skeleton"
      role="status"
    >
      <section aria-hidden="true" className="flex flex-col gap-3 px-4 pt-2 sm:px-0">
        <h1 className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)]">Уровни</h1>
      </section>

      <section aria-hidden="true" className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <ProgramLevelCardSkeleton />
        </div>
      </section>
    </div>
  )
}

export function PathPageSkeleton({
  backLabel,
  backTo,
  variant,
}: {
  backLabel: string
  backTo: string
  variant: 'level' | 'section'
}) {
  return (
    <div
      aria-label={variant === 'level' ? 'Подготавливаем уровень' : 'Подготавливаем раздел'}
      aria-live="polite"
      className="min-h-svh bg-[var(--fr-surface-canvas)] pb-10"
      data-testid="path-loading-skeleton"
      role="status"
    >
      <header className="sticky top-0 z-30 rounded-b-[22px] bg-[var(--fr-color-sky-500)] px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] text-white">
        <Link
          aria-label={backLabel}
          className="inline-flex min-h-8 items-center gap-1 rounded-none px-0 py-0 text-white hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
          to={backTo}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          <Skeleton aria-hidden="true" className={cn('h-4 bg-white/35', pathBackLabelSkeletonWidth[variant])} />
        </Link>

        <Skeleton aria-hidden="true" className="h-6 w-72 max-w-[18rem] bg-white/35" />
      </header>

      <div aria-hidden="true" className={cn('pb-6 pt-7', variant === 'level' && 'flex flex-col gap-8')}>
        <section className="flex flex-col gap-9">
          <section className="flex flex-col gap-5">
            <div className="grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 px-4">
              <span className="h-px bg-[var(--fr-border-default)]" />
              <div className="min-w-0 text-center">
                <Skeleton className="h-12 w-[250px] max-w-[250px]" />
              </div>
              <span className="h-px bg-[var(--fr-border-default)]" />
            </div>

            <div className="mx-auto flex w-full max-w-[340px] flex-col items-center gap-5 py-2">
              {pathNodeOffsets.map((offset, index) => (
                <PathLessonNodeSkeleton isCurrent={index === 0} key={index} offset={offset} />
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}

export function LessonPageSkeleton() {
  return (
    <article
      aria-label="Подготавливаем урок"
      aria-live="polite"
      className="flex min-h-svh flex-col bg-[var(--fr-surface-canvas)] sm:rounded-3xl"
      data-testid="lesson-loading-skeleton"
      role="status"
    >
      <div aria-hidden="true" className="contents">
        <header className="sticky top-0 z-10 border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-canvas)]/95 px-4 pb-3 pt-3 backdrop-blur sm:rounded-b-2xl sm:border-x">
          <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3">
            <div className="grid grid-cols-[44px_minmax(0,1fr)_minmax(4.75rem,auto)] items-center gap-3">
              <Skeleton className="size-11 rounded-xl" />
              <div className="flex min-w-0 flex-col gap-1.5 self-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full max-w-48" />
              </div>
              <Skeleton className="h-7 min-w-[4.75rem] rounded-full" />
            </div>
            <Skeleton className="h-2.5 rounded-full" />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col gap-4 pb-4 pt-4 sm:px-4 sm:pt-5">
          <section className="w-full overflow-hidden rounded-[20px] border border-[var(--fr-color-sky-500)]/35 bg-[var(--fr-surface-card)] shadow-[var(--fr-shadow-sm)]">
            <div className="bg-[var(--fr-color-sky-500)] px-4 py-2">
              <Skeleton className="h-4 w-20 bg-white/35" />
            </div>
            <div className="flex flex-col gap-2 px-4 py-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </section>

          <section className="flex w-full flex-col gap-4 rounded-[20px] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-md)] sm:p-5">
            <Skeleton className="h-7 w-4/5" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
            </div>
          </section>
        </div>

        <footer className="sticky bottom-0 z-20 border-t border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)]/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(18,52,89,0.06)] backdrop-blur sm:rounded-t-2xl sm:border-x">
          <div className="mx-auto flex w-full max-w-[480px] items-center gap-3">
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </footer>
      </div>
    </article>
  )
}

function ProgramLevelCardSkeleton() {
  return (
    <article
      className="relative w-full overflow-hidden rounded-[28px] border border-[var(--fr-border-default)] bg-[linear-gradient(135deg,var(--fr-surface-card)_0_34%,var(--fr-surface-soft)_34%_54%,var(--fr-surface-card)_54%_100%)] p-4 shadow-[var(--fr-shadow-sm)]"
      data-testid="program-level-card-skeleton"
    >
      <div className="relative flex min-h-[132px] flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-7 w-20 shrink-0 rounded-full" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4 sm:hidden" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-3 rounded-full" />
        </div>

        <Skeleton className="h-12 rounded-2xl" />
      </div>
    </article>
  )
}

function PathLessonNodeSkeleton({ isCurrent, offset }: { isCurrent: boolean; offset: string }) {
  return (
    <div
      className={cn(
        'relative flex w-[116px] flex-col items-center gap-2 rounded-[24px] px-2 pb-2 text-center',
        isCurrent ? 'pt-12' : 'pt-2',
        offset,
      )}
      data-testid="path-skeleton-node"
    >
      {isCurrent ? (
        <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2">
          <Skeleton className="h-11 w-24 rounded-[14px]" />
        </div>
      ) : null}
      <Skeleton className="size-[78px] rounded-full" />
    </div>
  )
}
