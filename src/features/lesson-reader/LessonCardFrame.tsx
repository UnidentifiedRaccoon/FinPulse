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
      className="flex flex-col gap-5 rounded-[20px] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-5 text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-md)] [overflow-wrap:anywhere]"
    >
      <header>
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
