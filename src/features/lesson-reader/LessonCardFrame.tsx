import { BookOpen, CheckSquare, FilePenLine, Lightbulb, ListChecks, PlayCircle, ScrollText } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Card } from '@/content/program'

const cardTypeLabels: Record<Card['type'], string> = {
  theory: 'Короткое объяснение',
  video: 'Видео',
  callout: 'Подсказка',
  single_choice: 'Выбор',
  reflection: 'Размышление',
  scenario: 'Ситуация',
  artifact: 'Рабочий блок',
  checklist: 'Чеклист',
  summary: 'Итог',
}

const cardTypeIcons = {
  theory: BookOpen,
  video: PlayCircle,
  callout: Lightbulb,
  single_choice: CheckSquare,
  reflection: FilePenLine,
  scenario: ScrollText,
  artifact: FilePenLine,
  checklist: ListChecks,
  summary: CheckSquare,
} satisfies Record<Card['type'], typeof BookOpen>

export function LessonCardFrame({
  card,
  current,
  total,
  children,
}: {
  card: Card
  current: number
  total: number
  children: ReactNode
}) {
  const Icon = cardTypeIcons[card.type]

  return (
    <section
      aria-labelledby={`${card.id}-title`}
      className="flex flex-col gap-5 rounded-[20px] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-5 text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-md)] [overflow-wrap:anywhere]"
    >
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex min-h-8 items-center gap-2 rounded-full bg-[var(--fr-color-brand-50)] px-3 text-xs font-semibold leading-5 text-[var(--fr-color-brand-700)]">
            <Icon aria-hidden="true" />
            {cardTypeLabels[card.type]}
          </p>
          <p className="shrink-0 text-xs font-semibold tabular-nums text-[var(--fr-text-tertiary)]">
            {current} / {total}
          </p>
        </div>
        {card.title ? (
          <h2 className="text-xl font-bold leading-7 tracking-normal text-[var(--fr-text-primary)]" id={`${card.id}-title`}>
            {card.title}
          </h2>
        ) : (
          <h2 className="sr-only" id={`${card.id}-title`}>
            {cardTypeLabels[card.type]}
          </h2>
        )}
      </header>
      {children}
    </section>
  )
}
