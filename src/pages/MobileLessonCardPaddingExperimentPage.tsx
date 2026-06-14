import { Check, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'

import { api } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import type { Card } from '@/content/program'
import { getOrderedCards } from '@/content/order'
import { NoBreakText } from '@/features/lesson-reader/card-renderers/shared'
import { formatLessonHeaderContext } from '@/features/lesson-reader/lessonHeaderContext'
import { cn } from '@/lib/utils'

const PREVIEW_LESSON_SLUG = 'where-money-goes'
const PREVIEW_CARD_ID = 'card_l1s1l1_03_sorting_choice'

type CategorizationCard = Extract<Card, { type: 'categorization' }>

export function MobileLessonCardPaddingExperimentPage() {
  const lessonQuery = useApiQuery(() => api.getLesson(PREVIEW_LESSON_SLUG), [])

  if (lessonQuery.status === 'loading') {
    return <PageState title="Загружаем карточку" />
  }

  if (lessonQuery.status === 'error') {
    return <PageState title="Не удалось загрузить карточку" description={lessonQuery.error.message} />
  }

  const { level, section, lesson } = lessonQuery.data
  const cards = getOrderedCards(lesson)
  const previewCard = cards.find(isPreviewCategorizationCard)

  if (!previewCard) {
    return <PageState title="Карточка не найдена" />
  }

  const currentPosition = cards.findIndex((card) => card.id === previewCard.id) + 1
  const progressValue = Math.round((currentPosition / cards.length) * 100)

  return (
    <div className="min-h-svh bg-[var(--fr-surface-canvas)] text-[var(--fr-text-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-canvas)]/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3">
          <div className="grid grid-cols-[44px_minmax(0,1fr)_minmax(4.75rem,auto)] items-center gap-3">
            <Link
              aria-label={`Вернуться к уровню ${level.title}`}
              className="flex size-11 items-center justify-center rounded-xl text-[var(--fr-text-secondary)] transition-[background-color,color,box-shadow] hover:bg-[var(--fr-surface-soft)] hover:text-[var(--fr-text-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
              to={`/levels/${level.slug}`}
            >
              <ChevronLeft aria-hidden="true" />
            </Link>
            <div className="min-w-0 self-center">
              <p className="truncate text-xs font-semibold leading-5 text-[var(--fr-text-tertiary)]">
                {formatLessonHeaderContext(level.title, section.title)}
              </p>
              <h1 className="truncate text-base font-bold leading-6 tracking-normal text-[var(--fr-text-primary)]">
                {lesson.title}
              </h1>
            </div>
            <p className="min-w-[4.75rem] rounded-full bg-[var(--fr-surface-card)] px-3 py-1 text-center text-xs font-semibold tabular-nums text-[var(--fr-color-brand-700)] shadow-[var(--fr-shadow-sm)]">
              {currentPosition} из {cards.length}
            </p>
          </div>
          <div
            aria-label="Прогресс урока"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressValue}
            className="h-2.5 overflow-hidden rounded-full bg-[var(--fr-color-brand-100)] p-[2px]"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-[var(--fr-color-sky-500)] transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[480px] flex-col pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-4 sm:px-4">
        <section
          aria-labelledby={`${previewCard.id}-title`}
          className="flex w-full flex-col gap-4 rounded-[20px] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)] shadow-[var(--fr-shadow-md)] [overflow-wrap:anywhere] sm:p-5"
          data-testid="full-width-lesson-card"
        >
          <header>
            <h2 className="text-xl font-bold leading-7 text-balance tracking-normal text-[var(--fr-text-primary)]" id={`${previewCard.id}-title`}>
              <NoBreakText text={previewCard.title ?? 'Практика'} />
            </h2>
          </header>

          <div className="flex flex-col gap-4">
            <p className="text-base font-medium leading-6 text-pretty text-[var(--fr-text-primary)]">
              <NoBreakText text={previewCard.question} />
            </p>
            <FullWidthCategorizationTable card={previewCard} />
          </div>
        </section>
      </div>

      <footer className="sticky bottom-0 z-20 border-t border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)]/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(18,52,89,0.06)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[480px] items-center gap-3">
          <button
            className="min-h-12 flex-1 rounded-xl bg-[var(--fr-color-sky-500)] px-4 text-center text-[15px] font-semibold leading-tight text-white shadow-[var(--fr-shadow-sm)]"
            type="button"
          >
            Проверить
          </button>
        </div>
      </footer>
    </div>
  )
}

function FullWidthCategorizationTable({ card }: { card: CategorizationCard }) {
  const gridTemplateColumns = `minmax(8rem,1fr) repeat(${card.categories.length}, minmax(4.25rem,4.75rem))`

  return (
    <div
      className="overflow-hidden rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)]"
      data-testid="full-width-categorization-table"
    >
      <div
        className="grid border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]"
        style={{ gridTemplateColumns }}
      >
        <span className="px-[var(--fr-space-3)] py-[var(--fr-space-2)]">Пункт</span>
        {card.categories.map((category) => (
          <span
            className="px-1.5 py-[var(--fr-space-2)] text-center text-[length:var(--fr-type-caption-sm-size)] leading-[var(--fr-type-caption-sm-line)] [hyphens:none] [overflow-wrap:normal] [word-break:normal]"
            key={category.id}
          >
            {category.label}
          </span>
        ))}
      </div>

      {card.items.map((item) => (
        <div
          className="grid border-b border-[var(--fr-border-subtle)] last:border-b-0"
          key={item.id}
          style={{ gridTemplateColumns }}
        >
          <div className="min-w-0 px-[var(--fr-space-3)] py-[var(--fr-space-3)]">
            <span className="min-w-0 text-pretty text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-primary)]">
              <NoBreakText text={item.label} />
            </span>
          </div>

          {card.categories.map((category) => {
            const isSelected = category.id === item.correctCategoryId

            return (
              <button
                aria-label={`${item.label}: ${category.label}`}
                aria-pressed={isSelected}
                className={cn(
                  'flex min-h-12 items-center justify-center border-l border-[var(--fr-border-subtle)] px-[var(--fr-space-1)] text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] transition-[background-color,border-color,color,box-shadow] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fr-color-sky-500)]',
                  isSelected
                    ? 'bg-[var(--fr-color-brand-50)] text-[var(--fr-color-sky-600)]'
                    : 'text-[var(--fr-text-tertiary)] hover:bg-[var(--fr-surface-soft)]',
                )}
                key={category.id}
                type="button"
              >
                {isSelected ? <Check aria-hidden="true" className="size-4" strokeWidth={2.5} /> : '—'}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function isPreviewCategorizationCard(card: Card): card is CategorizationCard {
  return card.id === PREVIEW_CARD_ID && card.type === 'categorization'
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col justify-center gap-2 px-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold leading-7 tracking-normal">{title}</h1>
      {description ? <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
