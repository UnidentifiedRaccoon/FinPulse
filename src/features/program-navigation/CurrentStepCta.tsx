import { ArrowRight, CheckCircle2, Play } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import type { Lesson } from '@/content/program'

export function CurrentStepCta({
  lesson,
  isComplete,
  fallbackTo,
}: {
  lesson: Lesson | null
  isComplete: boolean
  fallbackTo: string
}) {
  const to = lesson ? `/lessons/${lesson.slug}` : fallbackTo
  const label = isComplete ? 'Повторить маршрут' : lesson ? 'Продолжить' : 'Открыть маршрут'

  return (
    <section className="flex flex-col gap-3 rounded-[22px] bg-[var(--fr-color-brand-50)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--fr-surface-card)] text-[var(--fr-color-sky-500)] shadow-[var(--fr-shadow-sm)]">
          {isComplete ? <CheckCircle2 aria-hidden="true" /> : <Play aria-hidden="true" />}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase leading-5 tracking-normal text-[var(--fr-color-brand-700)]">
            Следующий шаг
          </p>
          <h2 className="text-lg font-bold leading-6 tracking-normal text-[var(--fr-text-primary)]">
            {isComplete ? 'Маршрут завершён' : (lesson?.title ?? 'Начните с первого урока')}
          </h2>
          {lesson?.estimatedMinutes ? (
            <p className="mt-1 text-sm leading-5 text-[var(--fr-text-secondary)]">{lesson.estimatedMinutes} мин</p>
          ) : null}
        </div>
      </div>
      <Button
        asChild
        className="min-h-12 rounded-xl bg-[var(--fr-color-sky-500)] px-4 text-[15px] font-semibold text-white shadow-[var(--fr-shadow-sm)] hover:bg-[var(--fr-color-sky-600)]"
      >
        <Link to={to}>
          {label}
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </section>
  )
}
