import { CheckCircle2, Info, Lightbulb, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type FeedbackTone = 'correct' | 'almost' | 'retry' | 'info'

const feedbackConfig = {
  correct: {
    icon: CheckCircle2,
    title: 'Верно',
    className: 'border-[var(--fr-color-learn-correct-500)]/30 bg-[var(--fr-color-learn-correct-50)]',
    iconClassName: 'text-[var(--fr-color-learn-correct-500)]',
  },
  almost: {
    icon: Lightbulb,
    title: 'Есть нюанс',
    className: 'border-[var(--fr-color-learn-almost-500)]/30 bg-[var(--fr-color-learn-almost-50)]',
    iconClassName: 'text-[var(--fr-color-learn-almost-500)]',
  },
  retry: {
    icon: RotateCcw,
    title: 'Можно уточнить',
    className: 'border-[var(--fr-color-learn-almost-500)]/30 bg-[var(--fr-color-learn-almost-50)]',
    iconClassName: 'text-[var(--fr-color-learn-almost-500)]',
  },
  info: {
    icon: Info,
    title: 'Принято',
    className: 'border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)]',
    iconClassName: 'text-[var(--fr-color-brand-500)]',
  },
} satisfies Record<FeedbackTone, { icon: typeof CheckCircle2; title: string; className: string; iconClassName: string }>

export function LessonFeedback({
  id,
  tone,
  title,
  children,
}: {
  id?: string
  tone: FeedbackTone
  title?: string
  children: ReactNode
}) {
  const config = feedbackConfig[tone]
  const Icon = config.icon

  return (
    <div
      aria-live="polite"
      className={cn(
        'scroll-mb-[calc(6rem+env(safe-area-inset-bottom))] flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 text-[var(--fr-text-secondary)]',
        config.className,
      )}
      id={id}
      role="status"
    >
      <Icon aria-hidden="true" className={cn('mt-0.5 shrink-0', config.iconClassName)} />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-semibold text-[var(--fr-text-primary)]">{title ?? config.title}</p>
        <div className="flex flex-col gap-1 [overflow-wrap:anywhere]">{children}</div>
      </div>
    </div>
  )
}
