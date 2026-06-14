import type { ReactNode } from 'react'

import type { Card } from '@/content/program'
import { NoBreakText } from '@/features/lesson-reader/card-renderers/shared'

const cardTypeLabels: Record<Card['type'], string> = {
  theory: 'Короткое объяснение',
  video: 'Видео',
  callout: 'Подсказка',
  single_choice: 'Выбор',
  multi_select: 'Практика',
  categorization: 'Практика',
  reflection: 'Размышление',
  scenario: 'Ситуация',
  artifact: 'Рабочий блок',
  checklist: 'Чеклист',
  summary: 'Итог',
}

export function LessonCardFrame({
  card,
  children,
}: {
  card: Card
  current: number
  total: number
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={`${card.id}-title`}
      className="flex w-full flex-col gap-4 rounded-[20px] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-md)] [overflow-wrap:anywhere] sm:p-5"
    >
      <header>
        {card.title ? (
          <h2 className="text-xl font-bold leading-7 text-balance tracking-normal text-[var(--fr-text-primary)]" id={`${card.id}-title`}>
            <NoBreakText text={card.title} />
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
