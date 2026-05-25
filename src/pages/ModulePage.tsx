import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { findModuleBySlug, getUnitLessonCount } from '@/content/selectors'
import { getOrderedUnits, type Program } from '@/content/program'

export function ModulePage({ program }: { program: Program }) {
  const { moduleSlug } = useParams()
  const module = findModuleBySlug(program, moduleSlug)

  if (!module) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/">
          <ChevronLeft data-icon="inline-start" />
          Программа
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Модуль {module.order}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{module.title}</h1>
        {module.description ? (
          <p className="text-base leading-7 text-muted-foreground">{module.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-label={`${module.title}: юниты`}>
        {getOrderedUnits(module).map((unit) => (
          <Link
            className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
            key={unit.id}
            to={`/modules/${module.slug}/units/${unit.slug}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{unit.title}</h2>
                {unit.description ? (
                  <p className="text-sm leading-6 text-muted-foreground">{unit.description}</p>
                ) : null}
                <p className="text-xs text-muted-foreground">{getUnitLessonCount(unit)} уроков</p>
              </div>
              <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
