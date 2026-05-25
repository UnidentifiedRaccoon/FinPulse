import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { getOrderedCards, type Program } from '@/content/program'
import { findLessonBySlug, getLessonNavigation } from '@/content/selectors'
import { LessonCardRenderer } from '@/features/lesson-reader/LessonCardRenderer'

export function LessonPage({ program }: { program: Program }) {
  const { lessonSlug } = useParams()
  const current = findLessonBySlug(program, lessonSlug)

  if (!current) {
    return <Navigate to="/" replace />
  }

  const { previous, next } = getLessonNavigation(program, current.lesson)

  return (
    <article className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="h-auto w-fit whitespace-normal text-left">
        <Link to={`/modules/${current.module.slug}/units/${current.unit.slug}`}>
          <ChevronLeft data-icon="inline-start" />
          {current.unit.title}
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {current.module.title} · {current.unit.title} · Урок {current.lesson.order}
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{current.lesson.title}</h1>
        {current.lesson.description ? (
          <p className="text-base leading-7 text-muted-foreground">{current.lesson.description}</p>
        ) : null}
        {current.lesson.learningGoal ? (
          <p className="rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">
            {current.lesson.learningGoal}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-4">
        {getOrderedCards(current.lesson).map((card) => (
          <LessonCardRenderer card={card} key={card.id} />
        ))}
      </div>

      <nav className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2" aria-label="Навигация по урокам">
        {previous ? (
          <Button asChild variant="outline" className="h-auto justify-start whitespace-normal text-left">
            <Link to={`/lessons/${previous.lesson.slug}`}>
              <ChevronLeft data-icon="inline-start" />
              {previous.lesson.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild className="h-auto justify-end whitespace-normal text-right">
            <Link to={`/lessons/${next.lesson.slug}`}>
              {next.lesson.title}
              <ChevronRight data-icon="inline-end" />
            </Link>
          </Button>
        ) : null}
      </nav>
    </article>
  )
}
