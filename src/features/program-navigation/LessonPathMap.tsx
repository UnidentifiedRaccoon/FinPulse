import { Check, Clock, Lock, Play } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Module } from '@/content/program'
import { cn } from '@/lib/utils'

import type { LessonPathItem, PathItemState } from './learningPath'
import type { LessonPathSection } from './lessonPathSections'

type Accent = {
  soft: string
  surface: string
  border: string
  text: string
  solid: string
  hover: string
  shadow: string
}

const accents: Accent[] = [
  {
    soft: 'bg-[var(--fr-color-learn-correct-50)]',
    surface: 'bg-[var(--fr-color-learn-correct-500)]',
    border: 'border-[var(--fr-color-learn-correct-500)]',
    text: 'text-[var(--fr-color-learn-correct-500)]',
    solid: 'bg-[var(--fr-color-learn-correct-500)]',
    hover: 'hover:bg-[var(--fr-color-learn-correct-500)]/90',
    shadow: 'shadow-[0_9px_0_rgba(20,133,95,0.22)]',
  },
  {
    soft: 'bg-[var(--fr-color-brand-50)]',
    surface: 'bg-[var(--fr-color-sky-500)]',
    border: 'border-[var(--fr-color-sky-500)]',
    text: 'text-[var(--fr-color-sky-500)]',
    solid: 'bg-[var(--fr-color-sky-500)]',
    hover: 'hover:bg-[var(--fr-color-sky-600)]',
    shadow: 'shadow-[0_9px_0_rgba(20,121,184,0.22)]',
  },
  {
    soft: 'bg-[var(--fr-color-learn-almost-50)]',
    surface: 'bg-[var(--fr-color-learn-almost-500)]',
    border: 'border-[var(--fr-color-learn-almost-500)]',
    text: 'text-[var(--fr-color-learn-almost-500)]',
    solid: 'bg-[var(--fr-color-learn-almost-500)]',
    hover: 'hover:bg-[var(--fr-color-learn-almost-500)]/90',
    shadow: 'shadow-[0_9px_0_rgba(184,118,20,0.22)]',
  },
  {
    soft: 'bg-[var(--fr-color-learn-retry-50)]',
    surface: 'bg-[var(--fr-color-learn-retry-500)]',
    border: 'border-[var(--fr-color-learn-retry-500)]',
    text: 'text-[var(--fr-color-learn-retry-500)]',
    solid: 'bg-[var(--fr-color-learn-retry-500)]',
    hover: 'hover:bg-[var(--fr-color-learn-retry-500)]/90',
    shadow: 'shadow-[0_9px_0_rgba(184,74,58,0.22)]',
  },
]

const nodeOffsets = ['translate-x-7', '-translate-x-9', 'translate-x-2', 'translate-x-11', '-translate-x-4']

const stateCopy = {
  completed: 'Пройден',
  current: 'Текущий урок',
  locked: 'Будущий урок',
} satisfies Record<PathItemState, string>

export function LessonPathMap({
  sections,
}: {
  moduleOrder: number
  sections: LessonPathSection[]
}) {
  if (sections.length === 0) {
    return <EmptyPathState />
  }

  return (
    <section id="module-sections" className="flex flex-col gap-9" aria-label="Разделы модуля">
      {sections.map((section, sectionIndex) => (
        <PathSection
          accent={accents[sectionIndex % accents.length]}
          key={section.id}
          section={section}
          sectionIndex={sectionIndex}
        />
      ))}
    </section>
  )
}

export function ModuleTransitionCard({ isComplete, nextModule }: { isComplete: boolean; nextModule: Module | null }) {
  if (!nextModule && !isComplete) {
    return null
  }

  const target = nextModule ? `/modules/${nextModule.slug}` : '/program'
  const title = nextModule ? `Модуль ${nextModule.order}` : 'Модуль завершён'
  const description = nextModule?.title ?? 'Вернитесь к списку модулей и выберите следующий шаг.'

  return (
    <section className="rounded-[28px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5 text-center shadow-[var(--fr-shadow-sm)]">
      <div className="mx-auto flex max-w-[340px] flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold leading-8 tracking-normal text-[var(--fr-text-primary)]">{title}</h2>
          <p className="text-base font-semibold leading-6 text-[var(--fr-text-secondary)]">
            {description}
          </p>
          {nextModule?.description ? (
            <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{nextModule.description}</p>
          ) : null}
        </div>
        <Button
          asChild
          className="min-h-12 w-full rounded-2xl bg-[var(--fr-color-sky-500)] text-[15px] font-bold text-white shadow-[0_5px_0_var(--fr-color-sky-600)] hover:bg-[var(--fr-color-sky-600)]"
        >
          <Link to={target}>{nextModule ? 'Перейти к модулю' : 'К модулям'}</Link>
        </Button>
      </div>
    </section>
  )
}

function PathSection({
  accent,
  section,
  sectionIndex,
}: {
  accent: Accent
  section: LessonPathSection
  sectionIndex: number
}) {
  return (
    <section className="flex flex-col gap-5" aria-labelledby={`section-${section.id}`}>
      <div className="grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3">
        <span className="h-px bg-[var(--fr-border-default)]" />
        <div className="min-w-0 text-center">
          <p className="text-xs font-bold uppercase leading-5 tracking-normal text-[var(--fr-text-tertiary)]">
            Раздел
          </p>
          <h2
            className="max-w-[250px] text-lg font-bold leading-6 tracking-normal text-[var(--fr-text-secondary)]"
            id={`section-${section.id}`}
          >
            {section.title}
          </h2>
        </div>
        <span className="h-px bg-[var(--fr-border-default)]" />
      </div>

      <div className="mx-auto flex w-full max-w-[340px] flex-col items-center gap-5 py-2">
        {section.lessons.map((lessonItem, lessonIndex) => (
          <LessonNode
            accent={accent}
            globalIndex={section.firstLessonNumber + lessonIndex}
            key={lessonItem.lesson.id}
            lessonItem={lessonItem}
            offset={nodeOffsets[(sectionIndex + lessonIndex) % nodeOffsets.length]}
          />
        ))}
      </div>
    </section>
  )
}

function LessonNode({
  accent,
  globalIndex,
  lessonItem,
  offset,
}: {
  accent: Accent
  globalIndex: number
  lessonItem: LessonPathItem
  offset: string
}) {
  const { lesson, state } = lessonItem
  const Icon = state === 'completed' ? Check : state === 'current' ? Play : Lock
  const isHighlighted = state === 'completed' || state === 'current'
  const primaryAction = state === 'completed' ? 'Повторить урок' : state === 'current' ? 'Продолжить урок' : 'Открыть урок'
  const visibleState = state === 'current' ? 'Сейчас' : state === 'completed' ? stateCopy.completed : null
  const duration = lesson.estimatedMinutes ? `${lesson.estimatedMinutes} мин` : 'Короткий урок'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={`${lesson.title}. ${stateCopy[state]}. Показать описание урока`}
          className={cn(
            'group relative flex w-[116px] flex-col items-center gap-2 rounded-[24px] px-2 py-2 text-center transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-sky-500)]/25 motion-reduce:transition-none',
            offset,
          )}
          type="button"
        >
          <span
            className={cn(
              'relative flex size-[78px] items-center justify-center overflow-hidden rounded-full border-[6px] bg-[var(--fr-surface-card)] text-xl font-black text-[var(--fr-text-tertiary)] tabular-nums transition group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
              state === 'completed' && cn(accent.border, accent.solid, accent.shadow, 'text-white'),
              state === 'current' && cn(accent.border, accent.solid, accent.shadow, 'text-white'),
              state === 'locked' && 'border-[var(--fr-border-strong)] shadow-[0_8px_0_rgba(99,113,136,0.16)]',
            )}
          >
            {isHighlighted ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[-18px] top-[14px] h-[18px] w-[108px] rotate-[-38deg] rounded-full bg-white/24"
              />
            ) : null}
            {state === 'current' ? <Icon aria-hidden="true" /> : state === 'completed' ? <Icon aria-hidden="true" /> : globalIndex}
          </span>
          {visibleState ? (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-bold leading-4 tracking-normal',
                state === 'current' ? cn(accent.soft, accent.text) : 'bg-transparent text-[var(--fr-text-tertiary)]',
              )}
            >
              {visibleState}
            </span>
          ) : null}
        </button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden rounded-[28px] border-0 p-0 shadow-[0_24px_70px_rgba(16,35,74,0.18)] sm:max-w-[420px]">
        <div className={cn('flex flex-col gap-4 p-5 pb-6 text-white', accent.solid)}>
          <DialogHeader className="gap-3 pr-10">
            <DialogTitle className="text-2xl font-bold leading-8 tracking-normal text-white">{lesson.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Откройте урок или вернитесь к карте модуля.
            </DialogDescription>
          </DialogHeader>

          <span className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-sm font-semibold leading-5 text-white">
            <Clock aria-hidden="true" className="size-4" />
            {duration}
          </span>
        </div>

        <DialogFooter className="m-0 flex-col gap-3 rounded-none border-0 bg-[var(--fr-surface-card)] p-4 sm:flex-col sm:justify-start">
          <Button
            asChild
            className={cn(
              'min-h-12 w-full rounded-2xl text-[15px] font-bold text-white shadow-[0_5px_0_rgba(16,35,74,0.16)]',
              accent.solid,
              accent.hover,
            )}
          >
            <Link to={`/lessons/${lesson.slug}`}>{primaryAction}</Link>
          </Button>
          <DialogClose asChild>
            <Button className="min-h-11 w-full rounded-2xl" variant="outline">
              Не сейчас
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EmptyPathState() {
  return (
    <section className="rounded-[24px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-5 text-center">
      <h2 className="text-xl font-bold leading-7 tracking-normal text-[var(--fr-text-primary)]">
        В модуле пока нет уроков
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--fr-text-secondary)]">Разделы появятся после обновления программы.</p>
    </section>
  )
}
