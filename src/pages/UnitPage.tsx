import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { getOrderedLessons, type Program } from '@/content/program'
import { findModuleBySlug, findUnitBySlug } from '@/content/selectors'

export function UnitPage({ program }: { program: Program }) {
  const { moduleSlug, unitSlug } = useParams()
  const module = findModuleBySlug(program, moduleSlug)
  const unit = module ? findUnitBySlug(module, unitSlug) : null

  if (!module || !unit) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to={`/modules/${module.slug}`}>
          <ChevronLeft data-icon="inline-start" />
          {module.title}
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Юнит {unit.order}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{unit.title}</h1>
        {unit.description ? (
          <p className="text-base leading-7 text-muted-foreground">{unit.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-label={`${unit.title}: уроки`}>
        {getOrderedLessons(unit).map((lesson) => (
          <Link
            className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
            key={lesson.id}
            to={`/lessons/${lesson.slug}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                {lesson.description ? (
                  <p className="text-sm leading-6 text-muted-foreground">{lesson.description}</p>
                ) : null}
                {lesson.estimatedMinutes ? (
                  <p className="text-xs text-muted-foreground">{lesson.estimatedMinutes} мин</p>
                ) : null}
              </div>
              <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
