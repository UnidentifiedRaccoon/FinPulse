import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { getOrderedModules } from '@/content/program'
import type { Program } from '@/content/program'

export function ProgramOverviewPage({ program }: { program: Program }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Образовательная программа</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal">{program.title}</h1>
        {program.description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{program.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-semibold">
          Модули
        </h2>
        <div className="flex flex-col gap-3">
          {getOrderedModules(program).map((module) => (
            <Link
              className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
              key={module.id}
              to={`/modules/${module.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  {module.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">{module.units.length} юнит</p>
                </div>
                <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
