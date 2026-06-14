import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { buildProgramLearningPath } from '@/features/program-navigation/learningPath'
import { LevelPathNode } from '@/features/program-navigation/LevelPathNode'
import { ProgramOverviewSkeleton } from '@/shared/ui/RouteLoadingSkeletons'

export function ProgramOverviewPage({ progress }: { progress: ProgressResponse | null }) {
  const programQuery = useApiQuery(api.getProgram, [])

  if (programQuery.status === 'loading') {
    return <ProgramOverviewSkeleton />
  }

  if (programQuery.status === 'error') {
    return <PageState title="Не удалось загрузить программу" description={programQuery.error.message} />
  }

  const program = programQuery.data
  const path = buildProgramLearningPath(program, progress)

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-col gap-3 px-4 pt-2 sm:px-0">
        <h1 className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)]">Уровни</h1>
      </section>

      <section className="flex flex-col gap-3" aria-label="Уровни программы">
        {path.levels.length > 0 ? (
          <div className="flex flex-col gap-3">
            {path.levels.map((level, index) => (
              <LevelPathNode index={index + 1} item={level} key={level.level.id} />
            ))}
          </div>
        ) : (
          <div className="w-full rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
            Материалы программы пока не добавлены.
          </div>
        )}
      </section>
    </div>
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="w-full rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold">{title}</h1>
      {description ? <p className="mt-1 text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
